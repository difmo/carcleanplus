import React, { useState, useEffect, useMemo } from 'react';
import {
  FaPlus,
  FaSearch,
  FaSpinner,
  FaExclamationTriangle,
  FaEdit,
  FaTrashAlt,
  FaEye,
  FaEyeSlash,
  FaImages,
  FaTag,
  FaCalendarAlt,
  FaCheckCircle
} from 'react-icons/fa';
import { fetchWithAuth } from '../../../utils/api';
import UploadGalleryModal from './UploadGalleryModal';

const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth('/api/gallery/admin');
      setItems(res.data || []);
      setError(null);
    } catch (err) {
      console.error('Fetch gallery error:', err);
      setError(err.message || 'Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set(items.map((it) => it.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'All' ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [items, searchTerm, selectedCategory]);

  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
      await fetchWithAuth(`/api/gallery/${id}`, {
        method: 'DELETE'
      });
      setItems((prev) => prev.filter((item) => item._id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      alert(err.message || 'Failed to delete gallery item');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      const newStatus = !item.isActive;
      await fetchWithAuth(`/api/gallery/${item._id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: newStatus })
      });
      setItems((prev) =>
        prev.map((it) => (it._id === item._id ? { ...it, isActive: newStatus } : it))
      );
    } catch (err) {
      alert(err.message || 'Failed to update item status');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <FaImages className="text-[#0052cc]" />
            Work Gallery Management
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Upload showcase photos, crop to custom ratios & size, and set titles & descriptions
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setIsUploadOpen(true);
          }}
          className="px-5 py-2.5 bg-[#0052cc] hover:bg-[#0747a6] text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <FaPlus className="text-xs" />
          <span>Upload New Image</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center text-xl font-bold">
            <FaImages />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{items.length}</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Total Uploads
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl font-bold">
            <FaCheckCircle />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">
              {items.filter((i) => i.isActive).length}
            </div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Active Visible
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold">
            <FaTag />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">
              {Math.max(0, categories.length - 1)}
            </div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Categories
            </div>
          </div>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by title, description or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#0052cc] text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-20 flex flex-col items-center justify-center text-gray-400">
            <FaSpinner className="animate-spin text-4xl mb-3 text-[#0052cc]" />
            <p className="font-bold text-sm text-gray-600">Loading gallery photos...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-100 p-12 flex flex-col items-center justify-center text-red-500">
            <FaExclamationTriangle className="text-4xl mb-3" />
            <p className="font-bold text-base">{error}</p>
            <button
              onClick={fetchItems}
              className="mt-4 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-bold text-xs transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0052cc] flex items-center justify-center text-2xl mb-4">
              <FaImages />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-1">
              {items.length === 0 ? 'No Gallery Photos Yet' : 'No Matching Photos Found'}
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mb-6">
              {items.length === 0
                ? 'Upload your first car detailing showcase photo with custom cropping, title, and description.'
                : 'Try adjusting your search query or category filter.'}
            </p>
            <button
              onClick={() => {
                setEditingItem(null);
                setIsUploadOpen(true);
              }}
              className="px-5 py-2.5 bg-[#0052cc] hover:bg-[#0747a6] text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <FaPlus className="text-xs" />
              <span>Upload Photo Now</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
              >
                {/* Image Box */}
                <div className="relative h-48 bg-gray-900 overflow-hidden cursor-pointer">
                  <img
                    src={item.imageUrl}
                    alt={item.title || item.altText}
                    onClick={() => setPreviewImage(item)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Category Pill Overlay */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-bold border border-white/10 flex items-center gap-1.5">
                    <FaTag className="text-blue-400 text-[10px]" />
                    <span>{item.category}</span>
                  </div>

                  {/* Active / Inactive Badge */}
                  <div
                    className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                      item.isActive
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-gray-800/90 text-gray-300'
                    }`}
                  >
                    {item.isActive ? 'Active' : 'Hidden'}
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 line-clamp-1 mb-1">
                      {item.title || 'Untitled Work'}
                    </h4>
                    {item.description ? (
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                        {item.description}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 italic mb-3">No description provided</p>
                    )}
                  </div>

                  {/* Footer & Actions */}
                  <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                      <FaCalendarAlt className="text-gray-300" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Toggle Visibility */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item)}
                        className={`p-2 rounded-lg transition-colors ${
                          item.isActive
                            ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                            : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={item.isActive ? 'Hide from public' : 'Show in public'}
                      >
                        {item.isActive ? <FaEyeSlash /> : <FaEye />}
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItem(item);
                          setIsUploadOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-[#0052cc] hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Details"
                      >
                        <FaEdit />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(item._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Image"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload / Edit Modal */}
      {isUploadOpen && (
        <UploadGalleryModal
          isOpen={isUploadOpen}
          onClose={() => {
            setIsUploadOpen(false);
            setEditingItem(null);
          }}
          onSuccess={fetchItems}
          editItem={editingItem}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-xl mx-auto mb-4">
              <FaTrashAlt />
            </div>
            <h3 className="text-base font-black text-center text-gray-900 mb-2">
              Delete Gallery Image?
            </h3>
            <p className="text-xs text-center text-gray-500 mb-6">
              This photo will be permanently removed from the work gallery. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 font-bold text-xs text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-xs text-white shadow-md shadow-red-500/20 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <FaSpinner className="animate-spin text-xs" />
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Lightbox Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl cursor-default border border-white/10"
          >
            <div className="relative bg-black flex items-center justify-center max-h-[70vh]">
              <img
                src={previewImage.imageUrl}
                alt={previewImage.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="px-3 py-1 bg-blue-50 text-[#0052cc] rounded-lg text-xs font-bold">
                  {previewImage.category}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {formatDate(previewImage.createdAt)}
                </span>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">
                {previewImage.title || 'Untitled Work'}
              </h3>
              {previewImage.description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {previewImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
