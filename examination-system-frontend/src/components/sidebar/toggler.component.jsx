import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { faToggleOff } from "@fortawesome/free-solid-svg-icons";

const Toggler = ({ title, onClick, open, ...props }) => {
  return (
    <div {...props}>
      <div className="d-flex flex-fill">
        <button
          className={`sidebar-item py-2 w-100 ${
            open ? "text-start mx-2" : "text-center"
          }`}
          title={title}
          onClick={onClick}
        >
          {open ? (
            <FontAwesomeIcon size="lg" icon={faToggleOn} />
          ) : (
            <FontAwesomeIcon size="lg" icon={faToggleOff} />
          )}
        </button>
      </div>
    </div>
  );
};

export default Toggler;
