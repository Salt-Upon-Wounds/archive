import { Row, Col } from "react-bootstrap";
import TextInput from "../inputs/text-input.component";
import DeleteButton from "./delete-button.component";

const QuestionAnswer = ({
  value,
  deleteAnswer,
  changeAnswer,
  error = "",
  suffix = "",
  readOnly = false,
}) => {
  return (
    <div>
      <Row className="my-1">
        <Col xs={9} xl={6}>
          <TextInput
            error={error}
            label="Question Answer"
            hiddenLabel={true}
            value={value}
            id={`question-answer-${suffix}`}
            placeholder="ответ на вопрос"
            onChange={(e) => changeAnswer({ text_part: e.target.value })}
            readOnly={readOnly}
            required={true}
          />
        </Col>
        <Col>
          <DeleteButton
            variant="danger"
            onClick={deleteAnswer}
            title="Delete Answer"
            disabled={readOnly}
          />
        </Col>
      </Row>
    </div>
  );
};

export default QuestionAnswer;
