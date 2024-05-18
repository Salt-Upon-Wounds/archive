import {
  BsHouseDoor,
  BsCardChecklist,
  BsInfoCircle,
  BsGear,
  BsBoxArrowRight,
} from "react-icons/bs";
import { Link } from "react-router-dom";

const SidebarItem = ({
  href,
  iconName,
  label,
  external = false,
  active = false,
  ...props
}) => {
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

  const properties = {};
  if (external) {
    properties.href = href;
  } else {
    properties.to = href;
  }
  properties.className = `p-2 rounded ${
    active ? "active fw-normal text-dark" : "text-muted"
  } sidebar-item w-100 text-decoration-none `;

  return (
    <div {...props}>
      <div className="d-flex flex-fill">
        {external ? (
          <a {...properties} target="_blank">
            <div className={`d-flex align-items-center word-nowrap`}>
              {Icon && <Icon />}
              <p className="ps-2 m-0">{label}</p>
            </div>
          </a>
        ) : (
          <Link {...properties}>
            <div className={`d-flex align-items-center word-nowrap`}>
              {Icon && <Icon />}
              <p className="ps-2 m-0">{label}</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default SidebarItem;
