import { useContext } from "react";

import TextareaInput from "../inputs/textarea-input.component";

import { AnswerQuestionContext } from "../../contexts/answer-question-context/answer-question.context";

const AnswerDescriptive = ({ readOnly = false }) => {
  const { answers, changeAnswers } = useContext(AnswerQuestionContext);

  const handleChange = (e) => {
    if (e.target.value === "") {
      changeAnswers([]);
    } else {
      changeAnswers([{ text_part: e.target.value }]);
    }
  };

  return (
    <div>
      <TextareaInput
        readOnly={readOnly}
        label="Ответ на вопрос"
        value={answers.length ? answers[0].text_part : ""}
        id="answer-of-question"
        placeholder="Ответ"
        onChange={handleChange}
        hiddenLabel={true}
      />
    </div>
  );
};

export default AnswerDescriptive;
