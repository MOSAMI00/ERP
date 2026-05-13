export function JoinCTA() {
  return (
    <section className="py-12 bg-muted">
      <div className="container mx-auto px-4">
        <div className="bg-primary rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="p-8 md:p-12 text-white space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                وفّر بالريال اليمني
              </h2>
              <p className="text-xl text-white/90">
                استأجر بدل ما تشتري
              </p>
              <button className="px-8 h-12 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                تصفح العروض
              </button>
            </div>
            <div className="h-64 md:h-full relative">
              <img
                src="https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&h=600&fit=crop"
                alt="Equipment"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
