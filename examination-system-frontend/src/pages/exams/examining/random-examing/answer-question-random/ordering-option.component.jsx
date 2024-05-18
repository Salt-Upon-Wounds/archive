import { ListGroup, Button } from "react-bootstrap";
import { BsArrowUp, BsArrowDown } from "react-icons/bs";

const OrderingOption = ({
  state,
  downDisabled,
  upDisabled,
  onUp,
  onDown,
  readOnly = false,
}) => {
  return (
    <ListGroup.Item as="li">
      <Button
        variant="success"
        className="ms-2"
        title="переместить вниз"
        disabled={readOnly || downDisabled}
        onClick={onDown}
      >
        <BsArrowDown />
      </Button>
      <Button
        variant="success"
        className="ms-2"
        title="переместить вверх"
        disabled={readOnly || upDisabled}
        onClick={onUp}
      >
        <BsArrowUp />
      </Button>
      <span className="ps-3"> {state.text_part} </span>
    </ListGroup.Item>
  );
};

export default OrderingOption;
