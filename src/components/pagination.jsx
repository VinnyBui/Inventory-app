import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 4; // Number of pages to show

        // Calculate start and end page
        let startPage = Math.max(currentPage - 2, 1);
        let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

        // Adjust startPage if we are at the end of the page list
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(endPage - maxVisiblePages + 1, 1);
        }

        if (startPage > 1) {
            pages.push(
                <PaginationItem key={1}>
                    <PaginationLink href="#" onClick={() => onPageChange(1)}>
                        1
                    </PaginationLink>
                </PaginationItem>
            );
            if (startPage > 2) {
                pages.push(
                    <PaginationItem key="ellipsis-start">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
        }

        for (let page = startPage; page <= endPage; page++) {
            pages.push(
                <PaginationItem key={page}>
                    <PaginationLink href="#" onClick={() => onPageChange(page)} className={currentPage === page ? 'bg-muted text-primary' : ''}>
                        {page}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <PaginationItem key="ellipsis-end">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
            pages.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink href="#" onClick={() => onPageChange(totalPages)}>
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return pages;
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" onClick={() => onPageChange(currentPage - 1)} />
                </PaginationItem>
                {renderPageNumbers()}
                <PaginationItem>
                    <PaginationNext href="#" onClick={() => onPageChange(currentPage + 1)} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationComponent;
