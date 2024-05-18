import { useState, useContext } from "react";

import { QuestionTypesContext } from "../../contexts/question-types-context/question-types.context";

import QuestionType from "../question-form-partials/question-type.component";

import { CreateQuestionContext } from "../../contexts/create-question-context/create-question.context";

import CreateDescriptive from "./create-descriptive.component";
import CreateFillTheBlank from "./create-fill-the-blank.component";
import CreateMultipleAnswers from "./create-multiple-answers.component";
import CreateSelectTheAnswer from "./create-select-the-answer.component";
import CreateTrueOrFalse from "./create-true-or-false.component";
import CreateOrdering from "./create-ordering.component";
const CreateQuestionForm = ({ examId, addQuestion, readOnly = false }) => {
  const [questionTypeId, setQuestionTypeId] = useState(1);
  const { questionTypes } = useContext(QuestionTypesContext);
  const { errors } = useContext(CreateQuestionContext);

  let questionForm = <p>Загрузка...</p>;

  switch (Number(questionTypeId)) {
    case 1:
      questionForm = (
        <CreateDescriptive
          examId={examId}
          addQuestion={addQuestion}
          readOnly={readOnly}
        />
      );
      break;
    case 2:
      questionForm = (
        <CreateFillTheBlank
          examId={examId}
          addQuestion={addQuestion}
          readOnly={readOnly}
        />
      );
      break;
    case 3:
      questionForm = (
        <CreateMultipleAnswers
          examId={examId}
          addQuestion={addQuestion}
          readOnly={readOnly}
        />
      );
      break;
    case 4:
      questionForm = (
        <CreateSelectTheAnswer
          examId={examId}
          addQuestion={addQuestion}
          readOnly={readOnly}
        />
      );
      break;
    case 5:
      questionForm = (
        <CreateTrueOrFalse
          examId={examId}
          addQuestion={addQuestion}
          readOnly={readOnly}
        />
      );
      break;
    case 6:
      questionForm = (
        <CreateOrdering
          examId={examId}
          addQuestion={addQuestion}
          readOnly={readOnly}
        />
      );
      break;
    default:
      throw new Error("invalid question type id");
  }
  return (
    <div>
      {errors.text_part && <p className="text-danger">{errors.text_part}</p>}
      {errors.integer_part && (
        <p className="text-danger">{errors.integer_part}</p>
      )}
      {questionTypes && questionTypes.length > 0 && (
        <div className="px-2 mx-1">
          <QuestionType
            options={questionTypes.map((current) => {
              return {
                value: current.type_id,
                label: current.type_name,
              };
            })}
            selectedValue={questionTypeId}
            onChange={(e) => {
              setQuestionTypeId(e.target.value);
            }}
            suffix={`not-created-question`}
            error={errors.question_type_id}
          />
        </div>
      )}
      {questionForm}
    </div>
  );
};

export default CreateQuestionForm;
