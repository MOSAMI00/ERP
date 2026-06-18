
export function TabDescription({ product }) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">الوصف والمواصفات</h3>
      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
        {product.description || 'لا يوجد وصف متاح.'}
      </p>

      {product.features && product.features.length > 0 && (
        <div className="mt-4">
          <h4 className="font-bold mb-2">المميزات:</h4>
          <ul className="list-disc list-inside text-muted-foreground">
            {product.features.map((feature: string, idx: number) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={key} className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">{key}</span>
              <span className="font-semibold">{value as React.ReactNode}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
