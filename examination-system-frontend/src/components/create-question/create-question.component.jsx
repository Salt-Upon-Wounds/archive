import { CreateQuestionProvider } from "../../contexts/create-question-context/create-question.context";
import CreateQuestionForm from "./create-question-form.component";

const CreateQuestion = ({
  examId,
  addQuestion,
  isVisible,
  onDismiss,
  readOnly = false,
}) => {
  if (!isVisible) {
    return null;
  }
  return (
    <CreateQuestionProvider onDismiss={onDismiss}>
      <CreateQuestionForm
        examId={examId}
        addQuestion={addQuestion}
        readOnly={readOnly}
      />
    </CreateQuestionProvider>
  );
};

export default CreateQuestion;
