import { visit } from '../../../inertia/navigation';
import { X, MapPin } from 'lucide-react';



export function ProductDetailsModal({ isOpen, onClose, product }) {
  

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2 font-semibold">
            <span>📋</span>
            <span>تفاصيل المنتج</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-0">
          <div className="aspect-[4/3] bg-muted w-full">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          
          <div className="p-6 space-y-4 text-right" dir="rtl">
            <h2 className="text-2xl font-bold">"{product.name}"</h2>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4 text-[#de8c54]" />
              <span>{product.location}</span>
            </div>
            
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description || 'لا يوجد وصف متاح.'}
            </p>
            
            {product.features && product.features.length > 0 && (
              <div className="space-y-2 mt-4">
                <h3 className="font-bold">المميزات:</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="space-y-2 mt-4">
                <h3 className="font-bold">المواصفات:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <span className="font-semibold text-foreground">{key}:</span>
                      <span>{value as React.ReactNode}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-white">
          <button onClick={onClose} className="text-[#e23f66] hover:underline font-semibold px-4">
            اغلاق
          </button>
          <button 
            onClick={() => {
              onClose();
              visit(`/product/${product.id}`);
            }}
            className="h-11 px-8 bg-[#de8c54] text-white rounded-full hover:bg-[#c97d49] transition-colors font-semibold"
          >
            استأجره الآن
          </button>
        </div>
      </div>
    </div>
  );
}
