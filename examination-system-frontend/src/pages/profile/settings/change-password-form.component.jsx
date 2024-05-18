import { useState, useContext } from "react";
import { Button, Form } from "react-bootstrap";

import PasswordInput from "../../../components/inputs/password-input.component";

import { AuthenticationContext } from "../../../contexts/authentication-context/authentication.context";

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { changePassword, isLoading, errors } = useContext(
    AuthenticationContext
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    changePassword(currentPassword, newPassword, confirmNewPassword);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <PasswordInput
        label="Текущий Пароль"
        error={errors.current_password}
        value={currentPassword}
        id="current-password"
        placeholder="Введите текущий пароль"
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="pb-3"
      />
      <PasswordInput
        label="Новый Пароль"
        error={errors.password}
        value={newPassword}
        id="new-password"
        placeholder="Введите новый пароль"
        onChange={(e) => setNewPassword(e.target.value)}
        className="pb-3"
      />
      <PasswordInput
        label="Подтверждение Нового Пароля"
        error={errors.password_confirmation}
        value={confirmNewPassword}
        id="confirm-new-password"
        placeholder="Введите новый пароль еще раз"
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        className="pb-3"
      />
      <Button
        variant="success"
        disabled={isLoading}
        className="my-3"
        type="submit"
      >
        {isLoading ? "Загрузка..." : "Изменение пароля"}
      </Button>
    </Form>
  );
};

export default ChangePasswordForm;
