import { Form } from "react-bootstrap";
import "./text-input.styles.css";

const TextInput = ({ label, placeholder, id, error, ...props }) => {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Control
        className="authentication-inputs border-top-0 border-end-0 border-start-0 border-4 border-dark text-center fw-light"
        style={{ backgroundColor: "inherit", fontSize: "min(4vw,20px)" }}
        aria-label={label}
        type="text"
        {...props}
        placeholder={placeholder}
      />
      {error && <p className="text-danger">{error[0]}</p>}
    </Form.Group>
  );
};

export default TextInput;
