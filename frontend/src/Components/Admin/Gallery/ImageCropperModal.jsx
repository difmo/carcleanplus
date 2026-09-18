import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import {
  FaTimes,
  FaSearchPlus,
  FaSearchMinus,
  FaRedo,
  FaCheck,
  FaCropAlt,
  FaExpandArrowsAlt,
  FaSlidersH
} from 'react-icons/fa';
import getCroppedImg from '../../../utils/cropImageHelper';

const ASPECT_RATIOS = [
  { label: '4:3 Standard', value: 4 / 3, desc: 'Best for gallery cards' },
  { label: '16:9 Wide', value: 16 / 9, desc: 'Landscape / Cinematic' },
  { label: '1:1 Square', value: 1 / 1, desc: 'Instagram / Square' },
  { label: '3:2 Classic', value: 3 / 2, desc: 'DSLR photo format' },
  { label: 'Free Crop', value: null, desc: 'Custom arbitrary ratio' }
];

const SIZE_PRESETS = [
  { label: 'HD (1200px)', maxDim: 1200, desc: 'Crisp & sharp for high-res screens' },
  { label: 'Standard (800px)', maxDim: 800, desc: 'Balanced quality & fast loading' },
  { label: 'Optimized (600px)', maxDim: 600, desc: 'Ultra lightweight' }
];

const ImageCropperModal = ({ imageSrc, isOpen, onClose, onCropDone }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(4 / 3);
  const [maxDimension, setMaxDimension] = useState(1000);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleApplyCrop = async () => {
    if (!croppedAreaPixels || !imageSrc) return;

    try {
      setIsProcessing(true);
      const croppedResult = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        maxDimension,
        'image/jpeg',
        0.88
      );
      onCropDone(croppedResult);
      onClose();
    } catch (e) {
      console.error('Error cropping image:', e);
      alert('Failed to crop image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
    setAspect(4 / 3);
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center font-bold">
              <FaCropAlt className="text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">Crop & Resize Image</h2>
              <p className="text-xs text-gray-500">
                Drag to position, zoom and select ideal aspect ratio for gallery display
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Cropping Canvas Viewport */}
        <div className="relative w-full h-80 sm:h-96 md:h-[420px] bg-gray-950 flex items-center justify-center select-none overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            showGrid={true}
            cropSize={aspect ? undefined : { width: 320, height: 240 }}
            style={{
              containerStyle: {
                background: '#090d16',
                position: 'relative',
                width: '100%',
                height: '100%'
              },
              cropAreaStyle: {
                border: '2px solid #0052cc',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)'
              }
            }}
          />

          {/* Dimension Tag */}
          {croppedAreaPixels && (
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-mono font-semibold flex items-center gap-2 border border-white/10 pointer-events-none">
              <FaExpandArrowsAlt className="text-blue-400 text-xs" />
              <span>
                Crop: {Math.round(croppedAreaPixels.width)} × {Math.round(croppedAreaPixels.height)} px
              </span>
            </div>
          )}
        </div>

        {/* Toolbar & Controls */}
        <div className="p-5 space-y-4 bg-white overflow-y-auto">
          {/* Aspect Ratio Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Aspect Ratio
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-[#0052cc] hover:underline"
              >
                Reset All
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {ASPECT_RATIOS.map((item) => {
                const isActive = aspect === item.value;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setAspect(item.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border text-center ${
                      isActive
                        ? 'bg-blue-50 border-[#0052cc] text-[#0052cc] shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div>{item.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zoom & Rotate Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Zoom Slider */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-2">
                <span className="flex items-center gap-1.5">
                  <FaSlidersH className="text-gray-400" /> Zoom Level
                </span>
                <span className="font-mono text-[#0052cc] font-semibold">{zoom.toFixed(1)}x</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
                  className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Zoom Out"
                >
                  <FaSearchMinus className="text-sm" />
                </button>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0052cc]"
                />
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
                  className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Zoom In"
                >
                  <FaSearchPlus className="text-sm" />
                </button>
              </div>
            </div>

            {/* Rotation & Size Preset */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Rotate Button */}
              <button
                type="button"
                onClick={handleRotate}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-700 font-bold text-xs transition-colors"
              >
                <FaRedo className="text-sm text-gray-500" />
                <span>Rotate 90° ({rotation}°)</span>
              </button>

              {/* Output Resolution Selection */}
              <div className="flex-1 flex flex-col justify-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                  Target Size
                </label>
                <select
                  value={maxDimension}
                  onChange={(e) => setMaxDimension(Number(e.target.value))}
                  className="bg-transparent font-bold text-xs text-gray-800 focus:outline-none cursor-pointer mt-0.5"
                >
                  {SIZE_PRESETS.map((preset) => (
                    <option key={preset.maxDim} value={preset.maxDim}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/70 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-100 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#0747a6] text-white font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaCheck />
                <span>Apply Crop & Continue</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
