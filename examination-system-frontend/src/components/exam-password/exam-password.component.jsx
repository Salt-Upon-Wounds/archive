import PasswordInput from "../inputs/password-input.component";

const ExamPassword = ({
  examId,
  examPassword,
  changeExamPassword,
  passwordErrorMessage,
}) => {
  return (
    <div>
      <PasswordInput
        error={passwordErrorMessage}
        label="Пароль"
        value={examPassword}
        id={`exam-password-field-${examId}`}
        placeholder="Введите пароль"
        onChange={(e) => changeExamPassword(e.target.value)}
      />
      <small>
        Для регистрации на тест требуется пароль.
        Если вы не знаете пароль, свяжитесь с составителем теста
      </small>
    </div>
  );
};

export default ExamPassword;
