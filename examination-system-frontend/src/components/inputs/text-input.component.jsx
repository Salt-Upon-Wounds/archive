import { Form } from "react-bootstrap";

const TextInput = ({
  error,
  label,
  value,
  id,
  placeholder,
  onChange,
  hiddenLabel = false,
  readOnly = false,
  required = false,
  autoFocus = false,
  textCenter = false,
  ...props
}) => {
  const additionalAttributes = {};
  if (hiddenLabel) {
    additionalAttributes["aria-label"] = label;
  }
  if (required) {
    additionalAttributes["required"] = "required";
  }
  if (autoFocus) {
    additionalAttributes["autoFocus"] = "autoFocus";
  }
  if (textCenter) {
    additionalAttributes["className"] = "text-center";
  }
  return (
    <Form.Group {...props} controlId={id}>
      {hiddenLabel === false && <Form.Label> {label} </Form.Label>}
      <Form.Control
        {...additionalAttributes}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        readOnly={readOnly}
      />
      {error && <p className="text-danger">{error}</p>}
    </Form.Group>
  );
};

export default TextInput;
