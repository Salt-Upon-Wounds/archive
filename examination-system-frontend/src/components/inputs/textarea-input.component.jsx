import { Form } from "react-bootstrap";

const TextareaInput = ({
  error,
  label,
  value,
  id,
  placeholder,
  onChange,
  rows = 3,
  readOnly = false,
  hiddenLabel = false,
  required = false,
  ...props
}) => {
  const additionalAttributes = {};
  if (hiddenLabel) {
    additionalAttributes["aria-label"] = label;
  }
  if (required) {
    additionalAttributes["required"] = "required";
  }
  return (
    <Form.Group {...props} controlId={id}>
      {hiddenLabel === false && <Form.Label> {label} </Form.Label>}
      <Form.Control
        {...additionalAttributes}
        readOnly={readOnly}
        as="textarea"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        rows={rows}
        style={{ resize: "none" }}
      />
      {error && <p className="text-danger">{error}</p>}
    </Form.Group>
  );
};

export default TextareaInput;
