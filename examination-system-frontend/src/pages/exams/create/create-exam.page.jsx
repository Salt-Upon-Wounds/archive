import CreateExamForm from "./create-exam-form.component";
import useMetaTag from "../../../hooks/useMetaTag";

const CreateExamPage = () => {
  useMetaTag({
    title: "Create New Exam",
    ogTitle: "Create New Exam",
  });

  return <CreateExamForm className="text-start" />;
};

export default CreateExamPage;
