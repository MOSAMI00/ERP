import React, { useRef } from 'react';
import { Image as ImageIcon, Plus, X } from 'lucide-react';

interface PhotosStepProps {
  images: File[];
  setImages: (images: File[]) => void;
}

const PhotosStep: React.FC<PhotosStepProps> = ({ images, setImages }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages([...images, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const photoSlots = Array.from({ length: Math.max(5, images.length + 1) }, (_, index) => index);

  return (
    <div>
      <h3 className="mb-2">صور المعدة</h3>
      <p className="text-muted mb-6">ارفع 5 صور على الأقل لعرض المعدة بشكل واضح</p>

      <input
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <div className="image-upload-grid mb-6">
        {images.map((file, index) => (
          <div key={index} className="image-upload-slot has-image">
            <img
              src={URL.createObjectURL(file)}
              alt={`preview ${index}`}
              className="w-full h-full object-cover rounded-xl"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
            {index === 0 && (
              <span className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
                الأساسية
              </span>
            )}
          </div>
        ))}
        
        {images.length < 10 && (
          <div
            className="image-upload-slot cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="image-upload-placeholder">
              <Plus size={24} />
              <span>أضف صورة</span>
            </div>
          </div>
        )}
      </div>

      <div className="owner-card" style={{ backgroundColor: 'var(--color-page-bg)', boxShadow: 'none' }}>
        <p className="text-muted" style={{ margin: 0, fontSize: 13 }}>
          نصائح للصور: التقط صوراً واضحة من زوايا مختلفة، أظهر أي عيوب موجودة، استخدم إضاءة جيدة، الحد الأدنى 5 صور
        </p>
      </div>
    </div>
  );
};

export default PhotosStep;
