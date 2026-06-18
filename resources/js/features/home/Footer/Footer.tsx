import { MessageCircle, Send } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">م</span>
              </div>
              <span className="font-bold text-lg">منصة تأجير المعدات</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              منصة تأجير المعدات الأولى في اليمن. نربط المؤجرين والمستأجرين بطريقة آمنة وموثوقة.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">روابط سريعة</h4>
            <nav className="flex flex-col gap-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">الرئيسية</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">تصفح المعدات</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">أضف معدتك</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">من نحن</a>
            </nav>
          </div>

          {/* Column 3: Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">دعم العملاء</h4>
            <nav className="flex flex-col gap-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">مركز المساعدة</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">سياسة الإلغاء</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">شروط الاستخدام</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">اتصل بنا</a>
            </nav>
          </div>

          {/* Column 4: Social Media */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">تواصل معنا</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#25D366] transition-colors flex items-center justify-center"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#0088cc] transition-colors flex items-center justify-center"
                aria-label="Telegram"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#1877F2] transition-colors flex items-center justify-center"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] transition-colors flex items-center justify-center"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>

            <div className="text-sm text-gray-400 space-y-1">
              <p>📱 واتساب: 967+ 777 123 456</p>
              <p>📧 info@equipment-rent.ye</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-gray-400">
            © 2025 منصة تأجير المعدات — الجمهورية اليمنية 🇾🇪
          </p>
        </div>
      </div>
    </footer>
  );
}
