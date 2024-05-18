import { useEffect, useState, useContext } from "react";
import { Form, Alert } from "react-bootstrap";
import TextInput from "../partials/text-input.component";
import PasswordInput from "../partials/password-input.component";
import AuthButton from "../partials/auth-button.component";
import { AuthenticationContext } from "../../../contexts/authentication-context/authentication.context";

const RegisterForm = ({ ...props }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, errors, resetErrors } = useContext(AuthenticationContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(name, email, password, confirmPassword);
  };

  useEffect(() => {
    return () => {
      resetErrors();
    };
  }, [resetErrors]);

  return (
    <div {...props}>
      <div className="h-100 d-flex flex-column align-items-around justify-content-around">
        {Object.keys(errors).length > 0 && (
          <div>
            {errors.message && <Alert variant="danger">{errors.message}</Alert>}
          </div>
        )}
        <Form
          className="flex-fill d-flex flex-column justify-content-around align-items-around"
          onSubmit={handleSubmit}
        >
          <TextInput
            error={errors.name}
            id="register-name"
            placeholder="Имя"
            label="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <TextInput
            error={errors.email}
            id="register-email-address"
            type="email"
            placeholder="Email"
            label="email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            error={errors.password}
            id="register-password"
            placeholder="Пароль"
            label="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordInput
            error={errors.password_confirmation}
            id="register-password-confirmation"
            placeholder="Подтвердите пароль"
            label="confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <AuthButton variant="dark" text="СОЗДАТЬ" />
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
