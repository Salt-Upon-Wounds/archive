import { Button } from "react-bootstrap";
import { BsPlusLg } from "react-icons/bs";
const AddNewItem = ({ children, ...props }) => {
  return (
    <Button {...props}>
      <span>{children}</span> <BsPlusLg />
    </Button>
  );
};

export default AddNewItem;
