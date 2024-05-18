import { Button } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";
const DeleteButton = ({ ...props }) => {
  return (
    <Button {...props}>
      <BsTrash />
    </Button>
  );
};

export default DeleteButton;
