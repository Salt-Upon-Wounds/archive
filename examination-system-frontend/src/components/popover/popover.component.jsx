import CloseButton from "react-bootstrap/CloseButton";

const Popover = ({ onPopoverClose, children, zIndex = 10 }) => {
  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        top: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: zIndex,
      }}
    >
      <CloseButton
        onClick={() => {
          onPopoverClose();
        }}
        className="p-3"
        style={{
          position: "fixed",
          fontSize: "3vw",
          right: "3vw",
          top: "3vw",
          zIndex: 20,
        }}
      />
      {children}
    </div>
  );
};

export default Popover;
