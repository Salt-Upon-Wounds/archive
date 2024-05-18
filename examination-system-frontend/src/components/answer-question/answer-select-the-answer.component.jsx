import { useContext } from "react";

import { AnswerQuestionContext } from "../../contexts/answer-question-context/answer-question.context";

import RadioInput from "../inputs/radio-input.component";

const AnswerSelectTheAnswer = ({ readOnly = false }) => {
  const { answers, changeAnswers, states } = useContext(AnswerQuestionContext);

  const handleChange = (e) => {
    const stateId = Number(e.target.dataset.stateId);
    changeAnswers([{ integer_part: stateId }]);
  };

  return (
    <div className="text-start">
      {states &&
        states.map((state) => {
          return (
            <RadioInput
              key={`option-${state.state_id}`}
              label={state.text_part}
              checked={
                answers &&
                answers[0] &&
                Number(answers[0].integer_part) === Number(state.state_id)
              }
              id={`option-${state.state_id}`}
              onChange={handleChange}
              readOnly={readOnly}
              inputProps={{
                "data-state-id": state.state_id,
              }}
            />
          );
        })}
    </div>
  );
};

export default AnswerSelectTheAnswer;
