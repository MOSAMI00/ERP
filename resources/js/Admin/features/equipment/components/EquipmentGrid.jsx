import { MapPin, Tag, User, Eye, Edit, Trash2 } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

export default function EquipmentGrid({ equipment, onOpenDrawer }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-8">
      {equipment.map(item => (
        <div 
          key={item.id} 
          className="bg-brand-card rounded-2xl border border-brand-border shadow-sm overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
        >
          <div className="relative aspect-video cursor-pointer overflow-hidden group-hover:shadow-inner" onClick={() => onOpenDrawer(item)}>
            <img 
              src={item.images[0]} 
              alt={item.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
            
            <div className="absolute top-3 left-3">
                  <Badge unstyled className={`px-2.5 py-1 text-[10px] font-bold rounded-lg shadow-sm backdrop-blur-md text-white border border-white/20 ${
                    item.statusColor === 'success' ? 'bg-brand-success/80' : 'bg-brand-warning/80'
                  }`}>
                    {item.status}
                  </Badge>
            </div>
            
            <div className="absolute bottom-3 right-3">
               <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-white/20 flex flex-col items-center">
                  <span className="text-brand-primary font-black text-sm leading-none">{item.price.toLocaleString()}</span>
                  <span className="text-[9px] text-brand-text-muted font-bold mt-0.5">ر.ي / يوم</span>
               </div>
            </div>
          </div>

          <div className="p-5 flex flex-col flex-1 bg-white">
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <h3 
                  className="font-bold text-lg text-brand-text-primary line-clamp-2 cursor-pointer hover:text-brand-primary transition-colors leading-snug h-12 flex items-start" 
                  onClick={() => onOpenDrawer(item)}
                >
                  {item.name}
                </h3>
                <div className="flex flex-wrap gap-3 text-brand-text-muted text-[11px] font-medium">
                  <div className="flex items-center">
                    <MapPin size={12} className="ml-1 text-brand-primary/70" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center border-r border-brand-border pr-3">
                    <Tag size={12} className="ml-1 text-brand-primary/70" />
                    <span>{item.category}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-brand-content rounded-xl border border-brand-border/40">
                <div className="flex items-center min-w-0">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center ml-2 flex-shrink-0 border border-brand-primary/5">
                    <User size={14} className="text-brand-primary" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-brand-text-muted leading-none mb-1">المؤجر</span>
                    <span className="font-bold text-xs text-brand-text-primary truncate">{item.owner}</span>
                  </div>
                </div>
                <div className="text-[10px] text-brand-text-muted bg-white px-2 py-1.5 rounded-lg border border-brand-border shadow-sm flex items-center gap-1">
                  <span className="font-black text-brand-primary">{item.rentCount}</span> طلبية
                </div>
              </div>
            </div>

            <div className="pt-4 mt-5 border-t border-brand-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  unstyled
                  onClick={() => onOpenDrawer(item)} 
                  className="p-2 text-brand-info hover:bg-brand-info/10 rounded-lg transition-all" 
                  title="عرض"
                >
                  <Eye size={20} />
                </Button>
                <Button
                  unstyled
                  className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all" 
                  title="تعديل"
                >
                  <Edit size={20} />
                </Button>
              </div>
              <Button
                unstyled
                className="p-2 text-brand-danger hover:bg-brand-danger/10 rounded-lg transition-all" 
                title="حذف"
              >
                <Trash2 size={20} />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
