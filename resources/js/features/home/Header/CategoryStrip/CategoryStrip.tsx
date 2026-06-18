
export function CategoryStrip({ activeCategory, onCategoryChange, categories = [] }) {
  const displayCategories = [
    { id: 'all', name_ar: 'الكل' },
    ...categories
  ];

  return (
    <div className="sticky top-[72px] md:top-[72px] z-40 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
          {displayCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.name_ar)}
              className={`px-4 h-10 rounded-full whitespace-nowrap transition-colors ${
                category.name_ar === activeCategory
                  ? 'bg-primary text-white'
                  : 'bg-white text-muted-foreground border border-border hover:border-primary'
              }`}
            >
              {category.name_ar}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
