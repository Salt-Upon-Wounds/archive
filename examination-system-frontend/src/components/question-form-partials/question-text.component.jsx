import TextareaInput from "../inputs/textarea-input.component";

const QuestionText = ({
  value,
  onChange,
  readOnly = false,
  error = "",
  suffix = "",
}) => {
  return (
    <TextareaInput
      label="Текст вопроса"
      error={error}
      value={value}
      id={`question-text-${suffix}`}
      placeholder="Текст вопроса"
      onChange={onChange}
      readOnly={readOnly}
    />
  );
};

export default QuestionText;
