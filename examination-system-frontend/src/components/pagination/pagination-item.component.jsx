import { Link } from "react-router-dom";

const PaginationItem = ({ to, disabled = false, active = false, children }) => {
  return (
    <li
      className={`page-item ${disabled ? "disabled" : ""} ${
        active ? "active" : ""
      }`}
    >
      {active ? (
        <span className="page-link">{children}</span>
      ) : (
        <Link className="page-link" to={to}>
          {children}
        </Link>
      )}
    </li>
  );
};

export default PaginationItem;
