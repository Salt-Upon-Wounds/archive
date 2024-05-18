import { Form, Row } from "react-bootstrap";

const QuestionType = ({
  options, // array of objects with value and label props
  selectedValue, // the value of selected object
  onChange,
  disabled = false,
  error,
  suffix = "",
}) => {
  function ru(el) {
    switch (el) {
      case "descriptive":
        return "описательный"
      case "fill the blank":
        return "заполнить пробелы"
      case "multiple answer":
        return "множество правильных"
      case "select the answer":
        return "один правильный"
      case "true or false":
        return "правда или ложь"
      case "ordering":
        return "порядок"
      default:
        return el
    }
  }
  return (
    <Form.Group as={Row} controlId={`question-type-${suffix}`}>
      <Form.Label>Тип вопроса</Form.Label>
      <Form.Select
        value={selectedValue}
        onChange={onChange}
        disabled={disabled}
      >
        {options &&
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {ru(option.label)}
            </option>
          ))}
      </Form.Select>
      {error && <p className="text-danger">{error}</p>}
    </Form.Group>
  );
};

export default QuestionType;
