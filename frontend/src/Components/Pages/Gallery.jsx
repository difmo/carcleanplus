import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaPlus,
  FaImages,
  FaTag,
  FaTimes,
  FaExpand,
  FaShieldAlt,
  FaSlidersH
} from 'react-icons/fa';
import UploadGalleryModal from '../Admin/Gallery/UploadGalleryModal';

// Starter static images
import chatGptImage from '../../assets/ChatGPT Image Aug 14, 2026, 11_01_31 AM.png';
import seatImage from '../../assets/seat2.png';
import tyerImage from '../../assets/tyer.png';
import carImage from '../../assets/car.jpg';
import gl1 from '../../assets/gl 1.png';
import gl2 from '../../assets/gl 2.png';
import gl3 from '../../assets/gl 3.png';
import gl4 from '../../assets/gl 4.png';
import gl5 from '../../assets/gl 5.png';
import gl6 from '../../assets/gl 6.png';
import gl7 from '../../assets/gl 7.png';
import gl8 from '../../assets/gl8.png';

const STARTER_IMAGES = [
  { id: 's1', src: chatGptImage, title: 'Exterior Foam Wash & Polish', category: 'Exterior Cleaning', desc: 'High-gloss deep foam bath removing contaminants while protecting clear coat.' },
  { id: 's2', src: seatImage, title: 'Deep Seat Extraction & Sanitization', category: 'Interior Detailing', desc: 'Deep steam cleaning and hot water extraction on premium car seats.' },
  { id: 's3', src: tyerImage, title: 'Alloy Decontamination & Tyre Dressing', category: 'Tyre & Wheels', desc: 'Iron fallout removal and ultra-rich hydrophobic tyre shine coat.' },
  { id: 's4', src: carImage, title: 'Complete Showroom Detailing', category: 'Exterior Cleaning', desc: 'Full multi-stage polish giving an immaculate mirror reflection finish.' },
  { id: 's5', src: gl1, title: 'Precision Paint Protection', category: 'Ceramic Coating', desc: 'Nano-ceramic coating shield against UV, road grime, and light scratches.' },
  { id: 's6', src: gl2, title: 'Signature Hand Wash', category: 'Exterior Cleaning', desc: 'Two-bucket hand wash method ensuring swirl-free paint preservation.' },
  { id: 's7', src: gl3, title: 'Interior Cockpit Restoration', category: 'Interior Detailing', desc: 'Dashboard, console and trim anti-static conditioning.' },
  { id: 's8', src: gl4, title: 'High-Gloss Paint Enhancement', category: 'Ceramic Coating', desc: 'Single-stage polish enhancing depth and color vibrancy.' },
  { id: 's9', src: gl5, title: 'Upholstery Shampoo & Odor Neutralizer', category: 'Interior Detailing', desc: 'Thorough fabric scrubbing and antibacterial air sanitization.' },
  { id: 's10', src: gl6, title: 'Complete Car Care Package', category: 'Deep Cleaning', desc: 'End-to-end full interior and exterior transformation.' },
  { id: 's11', src: gl7, title: 'Professional Engine Bay & Trim Care', category: 'Exterior Cleaning', desc: 'Delicate steam cleansing and satin engine dressing.' },
  { id: 's12', src: gl8, title: 'Mirror Gloss Ceramic Sealant', category: 'Ceramic Coating', desc: 'Long-lasting hydrophobic water beading and mirror finish.' },
];

const Gallery = () => {
  const [dynamicItems, setDynamicItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeLightbox, setActiveLightbox] = useState(null);

  // Check admin status
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (token && userStr) {
        const user = JSON.parse(userStr);
        if (user.role === 'admin' || user.role === 'superadmin') {
          setIsAdmin(true);
        }
      }
    } catch (e) {
      setIsAdmin(false);
    }
  }, []);

  const fetchDynamicGallery = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setDynamicItems(data.data);
      }
    } catch (err) {
      console.error('Error loading gallery items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDynamicGallery();
  }, []);

  // Combine dynamic items and starter images
  const allImages = useMemo(() => {
    const formattedDynamic = dynamicItems.map((item) => ({
      id: item._id,
      src: item.imageUrl,
      title: item.title || 'Car Detailing Work',
      category: item.category || 'General',
      desc: item.description || '',
      isDynamic: true,
      createdAt: item.createdAt
    }));

    return [...formattedDynamic, ...STARTER_IMAGES];
  }, [dynamicItems]);

  // Extract all categories
  const categories = useMemo(() => {
    const catSet = new Set(allImages.map((img) => img.category).filter(Boolean));
    return ['All', ...Array.from(catSet)];
  }, [allImages]);

  // Filtered by selected category
  const filteredImages = useMemo(() => {
    if (selectedCategory === 'All') return allImages;
    return allImages.filter(
      (img) => img.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [allImages, selectedCategory]);

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Admin Quick Action Bar (Visible when Admin/Superadmin is logged in) */}
        {isAdmin && (
          <div className="mb-8 p-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                <FaShieldAlt />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-wide">Admin Gallery Controls</h3>
                <p className="text-xs text-blue-100">
                  Upload new photos, crop to size, and customize titles & descriptions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsUploadOpen(true)}
                className="flex-1 sm:flex-none px-4 py-2 bg-white text-[#0052cc] hover:bg-blue-50 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaPlus />
                <span>Upload New Photo</span>
              </button>

              <Link
                to="/admin/gallery"
                className="flex-1 sm:flex-none px-4 py-2 bg-black/25 hover:bg-black/35 text-white rounded-xl font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <FaSlidersH />
                <span>Manage Gallery</span>
              </Link>
            </div>
          </div>
        )}

        {/* Hero Title */}
        <div className="text-center mb-12">
          <span className="px-4 py-1.5 rounded-full bg-blue-50 text-[#0052cc] text-xs font-extrabold uppercase tracking-wider inline-block mb-4 border border-blue-100">
            Real Transformations
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-dark mb-4 tracking-tight">
            Our <span className="text-[#0052cc]">Work Gallery</span>
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Take a look at some of the premium car detailing, paint correction, and deep cleaning services we've delivered.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-[#0052cc] text-white shadow-md shadow-blue-500/25 scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              onClick={() => setActiveLightbox(img)}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-64 sm:h-72 overflow-hidden bg-gray-900">
                <img
                  src={img.src}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Category badge */}
                <div className="absolute top-3.5 left-3.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-bold border border-white/15 flex items-center gap-1.5 shadow-sm">
                  <FaTag className="text-blue-400 text-[10px]" />
                  <span>{img.category}</span>
                </div>

                {/* Expand icon on hover */}
                <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaExpand className="text-xs" />
                </div>

                {/* Bottom Overlay Title on image */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                  <h3 className="font-bold text-base md:text-lg drop-shadow-sm line-clamp-1 group-hover:text-blue-200 transition-colors">
                    {img.title}
                  </h3>
                </div>
              </div>

              {/* Card Body with description */}
              {img.desc && (
                <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {img.desc}
                  </p>
                  <div className="mt-2 text-[11px] font-bold text-[#0052cc] group-hover:underline flex items-center gap-1">
                    View full details &rarr;
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Modal for Full-Size View and Complete Text */}
      {activeLightbox && (
        <div
          onClick={() => setActiveLightbox(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl cursor-default border border-white/10 animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Image display */}
            <div className="relative bg-black flex items-center justify-center max-h-[65vh] overflow-hidden">
              <img
                src={activeLightbox.src}
                alt={activeLightbox.title}
                className="max-h-[65vh] w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setActiveLightbox(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {/* Metadata / Text write-up */}
            <div className="p-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="px-3 py-1 bg-blue-50 text-[#0052cc] rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <FaTag className="text-[10px]" />
                  {activeLightbox.category}
                </span>
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2">
                {activeLightbox.title}
              </h2>
              {activeLightbox.desc && (
                <p className="text-sm text-gray-600 leading-relaxed font-normal">
                  {activeLightbox.desc}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Quick Upload Modal */}
      {isAdmin && isUploadOpen && (
        <UploadGalleryModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onSuccess={fetchDynamicGallery}
        />
      )}
    </div>
  );
};

export default Gallery;
