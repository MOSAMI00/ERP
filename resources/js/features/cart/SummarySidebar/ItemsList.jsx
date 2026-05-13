

export function ItemsList({ cartItems }) {
  return (
    <div className="space-y-3">
      {cartItems.map((item) => (
        <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-border">
          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{item.name}</h4>
            <p className="text-xs text-muted-foreground">
              {item.days} أيام x {item.dailyRate.toLocaleString('ar-YE')} ر.ي
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
