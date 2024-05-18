import { useState } from "react";
import { Button } from "react-bootstrap";
import { BsCaretRight, BsCaretDown } from "react-icons/bs";
import {
  BsHouseDoor,
  BsCardChecklist,
  BsInfoCircle,
  BsGear,
  BsBoxArrowRight,
} from "react-icons/bs";

const SidebarItemContainer = ({ iconName, label, children, ...props }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isActive = children.reduce((ans, child) => {
    return child.props.active || ans;
  }, false);
  const Icon = (() => {
    switch (iconName) {
      case "home":
        return BsHouseDoor;
      case "exam":
        return BsCardChecklist;
      case "help":
        return BsInfoCircle;
      case "settings":
        return BsGear;
      case "logout":
        return BsBoxArrowRight;
      default:
        return null;
    }
  })();
  return (
    <div {...props}>
      <div className="d-flex sidebar-item-container flex-fill">
        <Button
          onClick={() => setIsOpen((prevState) => !prevState)}
          className={`p-0 text-muted w-100`}
        >
          <div
            className={`p-2 rounded ${
              isActive && !isOpen ? "active fw-normal text-dark" : "text-muted"
            }  sidebar-item w-100 text-decoration-none `}
            title={label}
          >
            <div className={`d-flex align-items-center word-nowrap`}>
              {Icon && <Icon />}
              <p className="ps-2 m-0">{label}</p>
              <span className="ms-auto">
                {isOpen ? <BsCaretDown /> : <BsCaretRight />}
              </span>
            </div>
          </div>
        </Button>
      </div>
      <div
        className={`item-container ps-3 ms-3 border-start ${
          isOpen ? "" : "d-none"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default SidebarItemContainer;
