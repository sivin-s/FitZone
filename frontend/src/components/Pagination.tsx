interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  limit: number;
  busy?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (limit: number) => void;
}

export default function Pagination({ currentPage, totalPages, totalUsers, limit, busy = false, onPageChange, onPageSizeChange }: PaginationProps) {
  const pageStart = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const visiblePages = Array.from({ length: Math.min(5, totalPages) }, (_, index) => pageStart + index);
  const firstUser = totalUsers === 0 ? 0 : (currentPage - 1) * limit + 1;
  const lastUser = Math.min(currentPage * limit, totalUsers);
  const paginationBusy = busy;
  return (
              <nav aria-label="Pagination" className="px-4 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  Showing {firstUser}–{lastUser} of {totalUsers} users
                  <span className="block text-xs mt-1">Page {currentPage} of {totalPages}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <label className="flex items-center gap-2 mr-2">
                    <span>Per page</span>
                    <select aria-label="Users per page" value={limit} onChange={(e) => { onPageSizeChange(Number(e.target.value)); }} className="rounded-lg border border-gray-200 bg-white px-2 py-2">
                      {[10, 20, 50].map(size => <option key={size} value={size}>{size}</option>)}
                    </select>
                  </label>
                  <button type="button" aria-label="First page" onClick={() => onPageChange(1)} disabled={currentPage === 1 || paginationBusy} className="rounded-lg border border-gray-200 px-2 py-2 hover:bg-gray-100 disabled:opacity-40">«</button>
                  <button type="button" aria-label="Previous page" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1 || paginationBusy} className="rounded-lg border border-gray-200 px-2 py-2 hover:bg-gray-100 disabled:opacity-40">Previous</button>
                  {pageStart > 1 && <span aria-hidden="true" className="text-gray-400">…</span>}
                  {visiblePages.map(number => (
                    <button key={number} type="button" aria-label={`Page ${number}`} aria-current={number === currentPage ? "page" : undefined} onClick={() => onPageChange(number)} disabled={paginationBusy} className={`min-w-9 rounded-lg border px-2 py-2 disabled:opacity-40 ${number === currentPage ? "border-black bg-black text-white" : "border-gray-200 hover:bg-gray-100"}`}>{number}</button>
                  ))}
                  {pageStart + visiblePages.length - 1 < totalPages && <span aria-hidden="true" className="text-gray-400">…</span>}
                  <button type="button" aria-label="Next page" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages || paginationBusy} className="rounded-lg border border-gray-200 px-2 py-2 hover:bg-gray-100 disabled:opacity-40">Next</button>
                  <button type="button" aria-label="Last page" onClick={() => onPageChange(totalPages)} disabled={currentPage >= totalPages || paginationBusy} className="rounded-lg border border-gray-200 px-2 py-2 hover:bg-gray-100 disabled:opacity-40">»</button>
                </div>
              </nav>
  );
}
