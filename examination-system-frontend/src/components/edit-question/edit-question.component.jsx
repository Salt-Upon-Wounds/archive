import { EditQuestionProvider } from "../../contexts/edit-question-context/edit-question.context";

import ChooseQuestionType from "./choose-question-type.component";

const EditQuestion = ({
  examId,
  questionId,
  readOnly = false,
  deleteQuestion,
}) => {
  return (
    <EditQuestionProvider examId={examId} questionId={questionId}>
      <ChooseQuestionType
        readOnly={readOnly}
        onDeleteQuestion={deleteQuestion}
      />
    </EditQuestionProvider>
  );
};

export default EditQuestion;
