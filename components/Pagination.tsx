import { useEffect, useRef } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  scrollOffset?: number;
  targetRef: React.RefObject<HTMLElement>;
}

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  scrollOffset = 40,
  targetRef
}: PaginationProps) => {
  const shouldScrollRef = useRef(false);
  
  const handlePageChange = (page: number) => {
    onPageChange(page);
    shouldScrollRef.current = true;
  };

  useEffect(() => {
    if (shouldScrollRef.current && targetRef.current) {
      const topPosition = targetRef.current.getBoundingClientRect().top;
      const scrollTop = window.pageYOffset + topPosition - scrollOffset;

      window.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });

      shouldScrollRef.current = false;
    }
  }, [currentPage, scrollOffset, targetRef]);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center mt-8 gap-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white text-black border border-black 
                  hover:bg-black hover:text-white transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => handlePageChange(number)}
          className={`w-10 h-10 flex items-center justify-center
                    transition duration-300 cursor-pointer
                    ${currentPage === number 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black border border-black hover:bg-black hover:text-white'
                    }`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-white text-black border border-black 
                  hover:bg-black hover:text-white transition duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;