import { Button, Modal } from "react-bootstrap";

const ModalComponent = ({
  buttonLabels = ["OK", "Отмена"],
  onConfirm = () => {},
  onCancel = () => {},
  isShown,
  closeModal,
  title,
  body,
  disabled = false,
}) => {
  const handleClose = () => {
    closeModal();
  };
  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };
  const handleCancel = () => {
    onCancel();
    handleClose();
  };

  return (
    <>
      <Modal show={isShown} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
          <Button
            disabled={disabled}
            variant="secondary"
            onClick={handleCancel}
          >
            {buttonLabels[1]}
          </Button>
          <Button disabled={disabled} variant="primary" onClick={handleConfirm}>
            {buttonLabels[0]}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalComponent;
