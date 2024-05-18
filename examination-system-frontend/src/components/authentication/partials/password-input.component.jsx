import { useState, useRef, useEffect } from "react";
import { Form } from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import "./text-input.styles.css";

const TextInput = ({ label, placeholder, id, error, ...props }) => {
  const [isHidden, setIsHidden] = useState(true);
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
    <Form.Group className="mb-3" controlId={id}>
      <div className="d-flex position-relative">
        <Form.Control
          ref={inputRef}
          onFocus={moveCaretAtEnd}
          className="authentication-inputs border-top-0 border-end-0 border-start-0 border-4 border-dark text-center fw-light"
          style={{ backgroundColor: "inherit", fontSize: "min(4vw,20px)" }}
          aria-label={label}
          type={isHidden ? "password" : "text"}
          {...props}
          placeholder={placeholder}
        />
        {isHidden ? (
          <button
            type="button"
            onClick={() => setIsHidden(false)}
            className="toggle-show-auth-btn fs-5 border-0 bg-transparent position-absolute right-0"
            title="show password"
          >
            <BsEye />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsHidden(true)}
            className="toggle-show-auth-btn fs-5 border-0 bg-transparent position-absolute right-0"
            title="hide password"
          >
            <BsEyeSlash />
          </button>
        )}
      </div>
      {error && <p className="text-danger">{error[0]}</p>}
    </Form.Group>
  );
};

export default TextInput;
