import { useContext } from "react";

import CheckboxInput from "../inputs/checkbox-input.component";

import { AnswerQuestionContext } from "../../contexts/answer-question-context/answer-question.context";

const AnswerMultipleAnswers = ({ readOnly = false }) => {
  const { answers, changeAnswers, states } = useContext(AnswerQuestionContext);

  const handleChange = (e) => {
    if (e.target.checked) {
      const newAnswers = [...answers, { integer_part: Number(e.target.id) }];
      changeAnswers(newAnswers);
    } else {
      const newAnswers = answers.filter(
        (answer) => Number(answer.integer_part) !== Number(e.target.id)
      );
      changeAnswers(newAnswers);
    }
  };

  return (
    <div className="text-start">
      {states &&
        states.map((state, idx) => {
          const answer = answers.find(
            (answer) => answer.integer_part === state.state_id
          );
          const isChecked = answer !== undefined;
          return (
            <CheckboxInput
              readOnly={readOnly}
              label={state.text_part}
              key={state.state_id}
              checked={isChecked}
              id={state.state_id}
              onChange={handleChange}
            />
          );
        })}
    </div>
  );
};

export default AnswerMultipleAnswers;
