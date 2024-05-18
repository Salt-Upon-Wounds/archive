import { CreatedExamsProvider } from "../../../contexts/created-exams-context/created-exams.context";
import { ParticipatedExamsProvider } from "../../../contexts/participated-exams-context/participated-exams.context";
import Overview from "./overview.component";
import useMetaTag from "../../../hooks/useMetaTag";

const OverviewPage = () => {
  useMetaTag({
    title: "Dashboard",
    ogTitle: "Dashboard",
  });

  return (
    <CreatedExamsProvider>
      <ParticipatedExamsProvider>
        <Overview />
      </ParticipatedExamsProvider>
    </CreatedExamsProvider>
  );
};

export default OverviewPage;
