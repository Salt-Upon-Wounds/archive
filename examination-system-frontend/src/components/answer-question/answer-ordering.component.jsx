import { useContext } from "react";

import { ListGroup } from "react-bootstrap";
import OrderingOption from "./ordering-option.component";

import { AnswerQuestionContext } from "../../contexts/answer-question-context/answer-question.context";

const AnswerOrdering = ({ readOnly = false }) => {
  const { answers, changeAnswers, states } = useContext(AnswerQuestionContext);

  const handleChange = (stateId, isUp) => {
    let currentAnswers;
    if (!answers || answers.length === 0) {
      currentAnswers = states.map((state) => ({
        integer_part: state.state_id,
      }));
    } else {
      currentAnswers = answers;
    }
    if (isUp) {
      const answerIndex = currentAnswers.findIndex(
        (answer) => answer.integer_part === stateId
      );
      const prevElements = currentAnswers.filter(
        (element, idx) => idx < answerIndex - 1
      );
      const lastElements = currentAnswers.filter(
        (element, idx) => idx > answerIndex
      );
      const newAnswers = [
        ...prevElements,
        currentAnswers[answerIndex],
        currentAnswers[answerIndex - 1],
        ...lastElements,
      ];
      changeAnswers(newAnswers);
    } else {
      const answerIndex = currentAnswers.findIndex(
        (answer) => answer.integer_part === stateId
      );
      const prevElements = currentAnswers.filter(
        (element, idx) => idx < answerIndex
      );
      const lastElements = currentAnswers.filter(
        (element, idx) => idx > answerIndex + 1
      );
      const newAnswers = [
        ...prevElements,
        currentAnswers[answerIndex + 1],
        currentAnswers[answerIndex],
        ...lastElements,
      ];
      changeAnswers(newAnswers);
    }
  };

  return (
    <div className="text-start">
      <ListGroup>
        {answers && answers.length > 0
          ? answers.map((answer, idx) => {
              const state = states.find(
                (state) =>
                  Number(state.state_id) === Number(answer.integer_part)
              );
              return (
                <OrderingOption
                  readOnly={readOnly}
                  key={state.state_id}
                  state={state}
                  downDisabled={idx === states.length - 1}
                  upDisabled={idx === 0}
                  onUp={() => handleChange(state.state_id, true)}
                  onDown={() => handleChange(state.state_id, false)}
                />
              );
            })
          : states &&
            states.map((state, idx) => {
              return (
                <OrderingOption
                  readOnly={readOnly}
                  key={state.state_id}
                  state={state}
                  downDisabled={idx === states.length - 1}
                  upDisabled={idx === 0}
                  onUp={() => handleChange(state.state_id, true)}
                  onDown={() => handleChange(state.state_id, false)}
                />
              );
            })}
      </ListGroup>
    </div>
  );
};

export default AnswerOrdering;
