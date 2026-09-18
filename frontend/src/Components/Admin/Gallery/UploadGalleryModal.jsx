import React, { useState, useEffect, useRef } from 'react';
import {
  FaTimes,
  FaCloudUploadAlt,
  FaCropAlt,
  FaCheck,
  FaTag,
  FaHeading,
  FaAlignLeft,
  FaSpinner,
  FaImage
} from 'react-icons/fa';
import ImageCropperModal from './ImageCropperModal';
import { fetchWithAuth } from '../../../utils/api';

const DEFAULT_CATEGORIES = [
  'Exterior Cleaning',
  'Interior Detailing',
  'Ceramic Coating',
  'Tyre & Wheels',
  'Deep Cleaning',
  'Paint Protection'
];

const UploadGalleryModal = ({ isOpen, onClose, onSuccess, editItem = null }) => {
  const fileInputRef = useRef(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Exterior Cleaning');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [altText, setAltText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageMeta, setImageMeta] = useState(null); // { width, height, sizeKB }

  // Cropper State
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  // Loading / Error
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title || '');
      setDescription(editItem.description || '');
      setAltText(editItem.altText || '');
      setImageUrl(editItem.imageUrl || '');

      if (DEFAULT_CATEGORIES.includes(editItem.category)) {
        setCategory(editItem.category);
        setIsCustomCategory(false);
      } else if (editItem.category) {
        setIsCustomCategory(true);
        setCustomCategory(editItem.category);
        setCategory('custom');
      }
    } else {
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('Exterior Cleaning');
      setCustomCategory('');
      setIsCustomCategory(false);
      setAltText('');
      setImageUrl('');
      setImageMeta(null);
      setRawImageSrc(null);
    }
    setError(null);
  }, [editItem, isOpen]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    // Read file as Data URL
    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result);
      setIsCropperOpen(true);
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
    };
    reader.readAsDataURL(file);

    // Reset input so re-selecting same file triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropDone = (croppedResult) => {
    setImageUrl(croppedResult.dataUrl);
    setImageMeta({
      width: croppedResult.width,
      height: croppedResult.height,
      sizeKB: croppedResult.sizeKB
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageUrl) {
      setError('Please upload and crop an image first.');
      return;
    }

    const finalCategory = isCustomCategory
      ? (customCategory.trim() || 'General')
      : category;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category: finalCategory,
        imageUrl,
        altText: altText.trim() || title.trim() || 'Car Clean Plus Gallery'
      };

      if (editItem && editItem._id) {
        await fetchWithAuth(`/api/gallery/${editItem._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await fetchWithAuth('/api/gallery', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }

      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Something went wrong while saving image.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center font-bold">
                <FaImage className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">
                  {editItem ? 'Edit Gallery Item' : 'Upload to Work Gallery'}
                </h2>
                <p className="text-xs text-gray-500">
                  Add photos, crop to size, and write title & details
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                {error}
              </div>
            )}

            {/* Image Selection / Preview Section */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Gallery Image *
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
              />

              {!imageUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-[#0052cc] bg-gray-50/80 hover:bg-blue-50/30 rounded-2xl p-8 text-center cursor-pointer transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0052cc] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-sm">
                    <FaCloudUploadAlt className="text-2xl" />
                  </div>
                  <p className="font-bold text-sm text-gray-800">
                    Click to browse or drop image here
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports JPG, PNG, WEBP (Cropping & sizing will open automatically)
                  </p>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-900 group">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-56 object-contain bg-black/40"
                  />

                  {/* Top info badge */}
                  {imageMeta && (
                    <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-mono font-medium border border-white/10">
                      {imageMeta.width} × {imageMeta.height} px • ~{imageMeta.sizeKB} KB
                    </div>
                  )}

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    {rawImageSrc && (
                      <button
                        type="button"
                        onClick={() => setIsCropperOpen(true)}
                        className="px-4 py-2 bg-white text-gray-900 rounded-xl font-bold text-xs shadow-lg hover:bg-gray-100 flex items-center gap-2 transition-transform hover:scale-105"
                      >
                        <FaCropAlt className="text-[#0052cc]" />
                        Re-Crop Image
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-[#0052cc] text-white rounded-xl font-bold text-xs shadow-lg hover:bg-[#0747a6] flex items-center gap-2 transition-transform hover:scale-105"
                    >
                      <FaCloudUploadAlt />
                      Change Photo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Title / Heading */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                <FaHeading className="text-gray-400" />
                Image Title / Headline
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Deep Paint Correction on Mercedes C-Class"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent"
              />
            </div>

            {/* Category / Tags */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                <FaTag className="text-gray-400" />
                Category
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {DEFAULT_CATEGORIES.map((cat) => {
                  const isSelected = !isCustomCategory && category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(false);
                        setCategory(cat);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-[#0052cc] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setIsCustomCategory(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isCustomCategory
                      ? 'bg-[#0052cc] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  + Custom Tag
                </button>
              </div>

              {isCustomCategory && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category name..."
                  className="w-full px-4 py-2 bg-white border border-blue-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc]"
                />
              )}
            </div>

            {/* Description / Caption */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                <FaAlignLeft className="text-gray-400" />
                Description / Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe the detailing steps, products used, or customer feedback..."
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent leading-relaxed resize-none"
              />
            </div>

            {/* Alt text for SEO (Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Alt Text (SEO & Accessibility)
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Short description for search engines"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0052cc]"
              />
            </div>

            {/* Submit Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-100 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !imageUrl}
                className="px-6 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#0747a6] text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin text-sm" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span>{editItem ? 'Update Photo' : 'Publish to Gallery'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Embedded Interactive Image Cropper Modal */}
      {isCropperOpen && rawImageSrc && (
        <ImageCropperModal
          isOpen={isCropperOpen}
          imageSrc={rawImageSrc}
          onClose={() => setIsCropperOpen(false)}
          onCropDone={handleCropDone}
        />
      )}
    </>
  );
};

export default UploadGalleryModal;
