import { Star, ChevronLeft, CheckCircle, Trash2, Flag } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Drawer from '../../../components/ui/Drawer';

const renderStars = (rating) => {
  return Array(5).fill(0).map((_, i) => (
    <Star key={i} size={14} className={i < rating ? "text-brand-warning fill-brand-warning" : "text-brand-border"} />
  ));
};

export default function ReviewDrawer({ isOpen, review, onClose }) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="تفاصيل التقييم"
      bodyClassName="flex-1 overflow-y-auto p-6 space-y-6"
      footer={review && (
        <div className="p-4 border-t border-brand-border bg-white flex space-x-3 space-x-reverse">
          <Button unstyled className="flex-1 py-2.5 rounded-lg font-bold text-sm bg-brand-success/10 text-brand-success hover:bg-brand-success hover:text-white transition-colors border border-brand-success/20 flex items-center justify-center">
            <CheckCircle size={18} className="ml-2" /> إبقاء التقييم
          </Button>
          <Button unstyled className="flex-1 py-2.5 rounded-lg font-bold text-sm bg-brand-danger/10 text-brand-danger hover:bg-brand-danger hover:text-white transition-colors border border-brand-danger/20 flex items-center justify-center">
            <Trash2 size={18} className="ml-2" /> حذف
          </Button>
          <Button unstyled className="flex-1 py-2.5 rounded-lg font-bold text-sm bg-brand-warning/10 text-brand-warning hover:bg-brand-warning hover:text-white transition-colors border border-brand-warning/20 flex items-center justify-center">
            <Flag size={18} className="ml-2" /> إبلاغ
          </Button>
        </div>
      )}
    >
        {review && (
          <>
              
              <div className="flex items-center justify-between bg-white border border-brand-border p-4 rounded-xl shadow-sm">
                <div className="text-center">
                  <p className="text-xs text-brand-text-muted mb-1 font-bold">المُقيِّم ({review.raterType})</p>
                  <p className="font-bold text-brand-primary hover:underline cursor-pointer">{review.rater}</p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="h-px bg-brand-border w-10 mx-2"></div>
                  <ChevronLeft size={16} className="text-brand-text-muted" />
                  <div className="h-px bg-brand-border w-10 mx-2"></div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-brand-text-muted mb-1 font-bold">الهدف ({review.targetType})</p>
                  <p className="font-bold text-brand-primary hover:underline cursor-pointer">{review.target}</p>
                </div>
              </div>

              <div className="flex justify-between items-center px-2">
                <div className="flex items-center space-x-1 space-x-reverse" dir="ltr">
                  {renderStars(review.rating)}
                  <span className="font-bold text-brand-text-primary ml-2">{review.rating}.0</span>
                </div>
                <div className="text-sm text-brand-text-muted font-medium" dir="ltr">{review.date}</div>
              </div>

              <div className="bg-brand-content p-5 rounded-xl border border-brand-border text-brand-text-primary font-medium leading-relaxed">
                "{review.text}"
              </div>

              <div className="border border-brand-border rounded-xl overflow-hidden hover:border-brand-primary transition-colors">
                <div className="bg-brand-content/50 px-4 py-2 border-b border-brand-border text-xs font-bold text-brand-text-muted">العملية المرتبطة</div>
                <div className="p-4 bg-white flex justify-between items-center cursor-pointer group">
                  <div>
                    <p className="font-bold text-brand-text-primary group-hover:text-brand-primary transition-colors" dir="ltr">{review.opId}</p>
                    <p className="text-xs text-brand-text-muted mt-1">اضغط لعرض تفاصيل العملية</p>
                  </div>
                  <ChevronLeft size={20} className="text-brand-text-muted group-hover:text-brand-primary transition-colors" />
                </div>
              </div>
          </>
        )}
    </Drawer>
  );
}
