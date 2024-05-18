import CreatedExams from "./created-exams.component";
import useMetaTag from "../../../../hooks/useMetaTag";

import { CreatedExamsProvider } from "../../../../contexts/created-exams-context/created-exams.context";

const CreatedExamsPage = () => {
  useMetaTag({
    title: "Created Exams",
    ogTitle: "Created Exams",
  });

  return (
    <CreatedExamsProvider>
      <CreatedExams />
    </CreatedExamsProvider>
  );
};

export default CreatedExamsPage;
