import { ButtonGroup, ToggleButton } from "react-bootstrap";

const AnswerIndicator = ({
  answer,
  onChange,
  readOnly = false,
  suffix = "",
  noAnswer = false,
  buttonLabels = ["Правильный ответ", "Неправильный ответ"],
}) => {
  const handleChange = (e) => {
    if (!readOnly) {
      onChange(e.target.value === "1" ? true : false);
    }
  };
  return (
    <ButtonGroup className="w-100">
      <ToggleButton
        id={`radio-correct-answer-${suffix}`}
        type="radio"
        variant="outline-success"
        name={`answer-indicator-${suffix}`}
        value={1}
        checked={!noAnswer && answer}
        onChange={handleChange}
        disabled={readOnly}
      >
        {buttonLabels[0]}
      </ToggleButton>
      <ToggleButton
        id={`radio-wrong-answer-${suffix}`}
        type="radio"
        variant="outline-danger"
        name={`answer-indicator-${suffix}`}
        value={0}
        checked={!noAnswer && !answer}
        onChange={handleChange}
        disabled={readOnly}
      >
        {buttonLabels[1]}
      </ToggleButton>
    </ButtonGroup>
  );
};

export default AnswerIndicator;
