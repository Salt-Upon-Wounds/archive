import { Form } from "react-bootstrap";
import "./checkbox-and-radio.styles.css";

const CheckboxAndRadioInput = ({
  label,
  checked,
  id,
  inputProps,
  onChange,
  error,
  type,
  disabled = false,
  ...props
}) => {
  return (
    <Form.Group controlId={id} {...props}>
      <div className="green-checkbox">
        {" "}
        <Form.Check
          type={type}
          disabled={disabled}
          checked={!!checked}
          {...inputProps}
          label={label}
          onChange={onChange}
        />
        {error && <p className="text-danger">{error}</p>}
      </div>
    </Form.Group>
  );
};

export default CheckboxAndRadioInput;
