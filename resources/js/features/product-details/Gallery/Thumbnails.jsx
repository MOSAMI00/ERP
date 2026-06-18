
export function Thumbnails({ images, currentImageIndex, setCurrentImageIndex }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {images.map((img, index) => (
        <button
          key={index}
          onClick={() => setCurrentImageIndex(index)}
          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
            index === currentImageIndex ? 'border-primary' : 'border-transparent'
          }`}
        >
          <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
        </button>
      ))}
    </div>
  );
}
