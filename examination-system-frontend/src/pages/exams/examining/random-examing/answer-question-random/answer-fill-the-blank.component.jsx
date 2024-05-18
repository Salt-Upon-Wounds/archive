import { useContext } from "react";

import TextInput from "../../../../../components/inputs/text-input.component";

import { AnswerQuestionContext } from "../../../../../contexts/answer-question-context/answer-question.context";

const AnswerFillTheBlank = (props) => {
  const {question, userAnswerSetter} = props;
  const  answers = question.answer;

  const handleChange = (e) => {
    // if (e.target.value === "") {
    //   userAnswerSetter([]);
    // } else {
    //   userAnswerSetter([{ text_part: e.target.value }]);
    // }
    userAnswerSetter(e.target.value);
  };

  return (
    <div className="d-inline-block">
      <TextInput
        label="Ответ на вопрос"
        value={answers.length > 0 ? answers[0].text_part : ""}
        id="answer-of-question"
        placeholder="Ответ"
        onChange={handleChange}
        hiddenLabel={true}
        readOnly={false}
        textCenter={true}
      />
    </div>
  );
};

export default AnswerFillTheBlank;
