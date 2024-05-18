import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./item-button.styles.css";

const ItemButton = ({ to, variant = "success", text, subText, icon }) => {
  const supportedColors = ["primary", "info", "success"];
  if (!supportedColors.includes(variant)) {
    throw new Error("unsupported color in item-button.component.jsx");
  }
  return (
    <Link className="text-decoration-none" to={to}>
      <Button
        variant="success"
        className={`m-0 p-3 py-2 fw-bold d-block w-100 h-100 bg-white text-muted border shadow rounded border item-button border-end-${variant}`}
      >
        <div className="h-100 d-flex justify-content-between align-items-stretch">
          <div className="font-monospace text-start d-flex flex-column justify-content-between">
            <p className={`small text-${variant}`}>{text}</p>
            <p className={`${subText === undefined && "invisible"}`}>
              {subText === undefined ? "no sub text" : subText}
            </p>
          </div>
          <div className="fs-1 d-flex align-items-center">{icon}</div>
        </div>
      </Button>
    </Link>
  );
};

export default ItemButton;
