import { useContext } from "react";

import { AnswerQuestionContext } from "../../../../../contexts/answer-question-context/answer-question.context";

import AnswerIndicator from "../../../../../components/answer-indicator/answer-indicator.component";

const AnswerTrueOrFalse = ({ readOnly = false, props }) => {
  const { answers, changeAnswers } = props;

  const handleChange = (newAnswer) => {
    changeAnswers([{ integer_part: Number(newAnswer) }]);
  };

  return (
    <div>
      <AnswerIndicator
        answer={answers && answers[0] && answers[0].integer_part}
        onChange={handleChange}
        suffix="answer-of-question"
        buttonLabels={["Правда", "Ложь"]}
        noAnswer={!answers || answers.length === 0}
        readOnly={readOnly}
      />
    </div>
  );
};

export default AnswerTrueOrFalse;
