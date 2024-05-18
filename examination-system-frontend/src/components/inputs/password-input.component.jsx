import { useRef, useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const PasswordInput = ({
  error,
  label,
  value,
  id,
  placeholder,
  onChange,
  readOnly = false,
  ...props
}) => {
  const [isHidden, setIsHidden] = useState(true);
  const randSuffix = useRef(Math.floor(Math.random() * 1000).toString());
  const inputRef = useRef();

  const moveCaretAtEnd = (e) => {
    var temp_value = e.target.value;
    e.target.value = "";
    e.target.value = temp_value;
  };

  useEffect(() => {
    if (isHidden === false && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isHidden]);

  return (
    <Form.Group {...props}>
      <div className="position-relative">
        <Form.Label htmlFor={`input-password-${randSuffix.current}`}>
          {label}
        </Form.Label>
        <Form.Control
          ref={inputRef}
          onFocus={moveCaretAtEnd}
          id={`input-password-${randSuffix.current}`}
          type={isHidden ? "password" : "text"}
          readOnly={readOnly}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
        {isHidden ? (
          <button
            type="button"
            onClick={() => setIsHidden(false)}
            className="fs-5 border-0 bg-transparent text-muted position-absolute"
            style={{ right: "5px", top: "47%" }}
            title="show password"
          >
            <BsEye />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsHidden(true)}
            className="fs-5 border-0 bg-transparent text-muted position-absolute"
            style={{ right: "5px", top: "47%" }}
            title="hide password"
          >
            <BsEyeSlash />
          </button>
        )}
      </div>
      {error && <p className="text-danger mb-0">{error}</p>}
    </Form.Group>
  );
};

export default PasswordInput;
