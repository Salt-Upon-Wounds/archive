import { ParticipatedExamsProvider } from "../../../../contexts/participated-exams-context/participated-exams.context";
import useMetaTag from "../../../../hooks/useMetaTag";

import ParticipatedExams from "./participated-exams.component";

const ParticipatedExamsPage = () => {
  useMetaTag({
    title: "Participated Exams",
    ogTitle: "Participated Exams",
  });
  return (
    <ParticipatedExamsProvider>
      <ParticipatedExams />
    </ParticipatedExamsProvider>
  );
};

export default ParticipatedExamsPage;
