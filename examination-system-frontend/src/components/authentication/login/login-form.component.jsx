import { useEffect, useState, useContext } from "react";
import { Form, Alert } from "react-bootstrap";
import TextInput from "../partials/text-input.component";
import PasswordInput from "../partials/password-input.component";
import AuthButton from "../partials/auth-button.component";
import { AuthenticationContext } from "../../../contexts/authentication-context/authentication.context";

const LoginForm = ({ ...props }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, errors, resetErrors } = useContext(AuthenticationContext);

  useEffect(() => {
    return () => resetErrors();
  }, [resetErrors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

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
            id="login-email-address"
            placeholder="Email"
            label="email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoFocus
          />
          <PasswordInput
            id="login-password"
            placeholder="Пароль"
            label="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <AuthButton variant="dark" text="ВОЙТИ" />
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
