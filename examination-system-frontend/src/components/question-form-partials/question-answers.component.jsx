import { Row, Col } from "react-bootstrap";
import QuestionAnswer from "./question-answer.component";
import AddNewItem from "./add-new-item.component";

const QuestionAnswers = ({
  readOnly = false,
  notCreatedStates,
  deleteState,
  addState,
  changeState,
  error = "",
  suffix = "",
}) => {
  return (
    <div>
      {error && <p className="text-danger">*{error}</p>}
      {notCreatedStates.map((answer) => {
        return (
          <QuestionAnswer
            key={answer.id}
            value={answer.text_part}
            deleteAnswer={() => deleteState(answer.id)}
            changeAnswer={(changedState) =>
              changeState({ ...changedState, id: answer.id })
            }
            readOnly={readOnly}
            suffix={`${suffix}-answer-${answer.id}`}
          />
        );
      })}
      <Row className="mt-2">
        <Col>
          <AddNewItem variant="success" disabled={readOnly} onClick={addState}>
            Добавить ответ
          </AddNewItem>
        </Col>
      </Row>
    </div>
  );
};

export default QuestionAnswers;
