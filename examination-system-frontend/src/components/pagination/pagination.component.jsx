import { Pagination } from "react-bootstrap";
import PaginationItem from "./pagination-item.component";
import "./pagination.styles.css";

const PaginationComponent = ({
  prefix,
  currentPage,
  numberOfPages,
  rangeSize = 3,
}) => {
  const prevPagesButtons = [];
  const createUrl = (page) => {
    const parts = prefix.split("?");
    if (parts.length > 2) {
      throw new Error("something went wrong");
    }
    if (parts.length === 1) {
      return `${parts[0]}?page=${page}`;
    } else if (parts.length === 2) {
      return `${parts[0]}?${parts[1]}&page=${page}`;
    }
  };

  for (let i = Math.max(currentPage - rangeSize, 1); i < currentPage; i++) {
    prevPagesButtons.push(
      <PaginationItem to={createUrl(i)} key={i}>
        {i}
      </PaginationItem>
    );
  }
  const nextPagesButtons = [];
  for (
    let i = currentPage + 1;
    i <= Math.min(numberOfPages, currentPage + rangeSize);
    i++
  ) {
    nextPagesButtons.push(
      <PaginationItem to={createUrl(i)} key={i}>
        {i}
      </PaginationItem>
    );
  }
  return (
    <>
      <Pagination className="pagination-muted">
        <PaginationItem to={createUrl(1)} disabled={currentPage === 1}>
          <span aria-hidden="true">«</span>
          <span className="visually-hidden">Начало</span>
        </PaginationItem>
        <PaginationItem
          disabled={currentPage === 1}
          to={createUrl(currentPage - 1)}
        >
          <span aria-hidden="true">‹</span>
          <span className="visually-hidden">Пред</span>
        </PaginationItem>
        {prevPagesButtons}
        <PaginationItem active={true}>{currentPage}</PaginationItem>
        {nextPagesButtons}
        <PaginationItem
          to={createUrl(currentPage + 1)}
          disabled={currentPage === numberOfPages}
        >
          <span aria-hidden="true">›</span>
          <span className="visually-hidden">След</span>
        </PaginationItem>
        <PaginationItem
          to={createUrl(numberOfPages)}
          disabled={currentPage === numberOfPages}
        >
          <span aria-hidden="true">»</span>
          <span className="visually-hidden">Конец</span>
        </PaginationItem>
      </Pagination>
    </>
  );
};

export default PaginationComponent;
