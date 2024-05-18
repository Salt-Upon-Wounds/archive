import { Form } from "react-bootstrap";

const Checkbox = ({ id, label, ...props }) => {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Check type="checkbox" {...props} label={label} />
    </Form.Group>
  );
};

export default Checkbox;
