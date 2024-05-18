import { ExamInfoProvider } from "../../../../contexts/exam-info-context/exam-info.context";
import IndexParticipants from "./index-participants.component";
import { useParams } from "react-router-dom";
import useMetaTag from "../../../../hooks/useMetaTag";

const IndexParticipantsPage = () => {
  const { examId } = useParams();
  useMetaTag({
    title: "Index Participants",
    ogTitle: "Index Participants",
  });

  return (
    <ExamInfoProvider examId={examId}>
      <IndexParticipants />
    </ExamInfoProvider>
  );
};

export default IndexParticipantsPage;
