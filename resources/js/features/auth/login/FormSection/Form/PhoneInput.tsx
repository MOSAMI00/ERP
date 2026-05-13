import { Phone } from 'lucide-react';


export function PhoneInput({ phone, setPhone }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">رقم الجوال</label>
      <div className="relative">
        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-muted-foreground">
          <span>🇾🇪</span>
          <span>+967</span>
        </div>
        <input
          type="tel"
          placeholder="777 123 456"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full h-12 pr-12 pl-24 rounded-lg border border-border bg-white focus:outline-none focus:border-primary transition-colors"
          required
        />
      </div>
    </div>
  );
}
