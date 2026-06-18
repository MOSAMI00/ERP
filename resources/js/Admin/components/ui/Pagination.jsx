export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex space-x-1 space-x-reverse">
      <button
        className="px-3 py-1 border border-brand-border rounded hover:bg-white disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        السابق
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          className={`px-3 py-1 border border-brand-border rounded ${page === currentPage ? 'bg-brand-primary text-white' : 'hover:bg-white'}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="px-3 py-1 border border-brand-border rounded hover:bg-white disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        التالي
      </button>
    </div>
  );
}
