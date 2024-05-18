import NumberInput from "../inputs/number-input.component";

const QuestionScore = ({
  value,
  error,
  onChange,
  readOnly = false,
  suffix = "",
}) => {
  return (
    <NumberInput
      error={error}
      label="Баллы за вопрос"
      value={value}
      id={`question-score-${suffix}`}
      onChange={onChange}
      readOnly={readOnly}
    />
  );
};

export default QuestionScore;
