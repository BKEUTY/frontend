import React from 'react';
import './Pagination.css';


const Pagination = ({ page, totalPages, onPageChange }) => {
    // If only 1 page, don't show controls (or show disabled if preferred, but usually hide)
    if (totalPages <= 1) return null;

    return (
        <div className="pagination-wrapper">
            <div className="pagination">
                <button
                    className="page-btn"
                    disabled={page === 0}
                    onClick={() => onPageChange(Math.max(0, page - 1))}
                >
                    ❮
                </button>

                {/* Simplified Logic: Show all pages if small, or implement complex logic later if needed */}
                {/* For now, replicating the "numbered" requirement */}
                {[...Array(totalPages)].map((_, idx) => (
                    <button
                        key={idx}
                        className={`page-btn ${page === idx ? 'active' : ''}`}
                        onClick={() => onPageChange(idx)}
                    >
                        {idx + 1}
                    </button>
                ))}

                <button
                    className="page-btn"
                    disabled={page >= totalPages - 1}
                    onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
                >
                    ❯
                </button>
            </div>
        </div>
    );
};

export default Pagination;
