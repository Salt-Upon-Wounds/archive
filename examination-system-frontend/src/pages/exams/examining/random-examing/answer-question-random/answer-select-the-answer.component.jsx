import { useContext } from "react";

import { AnswerQuestionContext } from "../../../../../contexts/answer-question-context/answer-question.context";

import RadioInput from "../../../../../components/inputs/radio-input.component";
import { useState } from "react";

const AnswerSelectTheAnswer = (props) => {
  const {question, userAnswerSetter} = props;
  const  answers = question.answer,
         states = question.states;
  const [ans, setAns] = useState(-1);

  let handleChange = (e) => {

    const stateId = Number(e.target.dataset.stateId);

    setAns(stateId);
    userAnswerSetter(stateId)
  }
  return (
    <div className="text-start">
      {states &&
        states.map((state, id) => {
          return (
            <RadioInput
              key={`option-${id}`}
              label={state}
              checked={
                Number(ans) === Number(id)
              }
              id={`option-${id}`}
              onChange={handleChange}
              readOnly={false}
              inputProps={{
                "data-state-id": id,
              }}
            />
          );
        })}
    </div>
  );
};

export default AnswerSelectTheAnswer;
