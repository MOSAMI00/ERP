
export function CategoryStrip({ activeCategory, onCategoryChange }) {
  const categories = [
    'الكل',
    'مولدات كهرباء',
    'بناء وأعمال',
    'زراعة',
    'تصوير',
    'فعاليات',
    'رياضة',
    'طبي',
    'أخرى'
  ];

  return (
    <div className="sticky top-[72px] md:top-[72px] z-40 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 h-10 rounded-full whitespace-nowrap transition-colors ${
                category === activeCategory
                  ? 'bg-primary text-white'
                  : 'bg-white text-muted-foreground border border-border hover:border-primary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
