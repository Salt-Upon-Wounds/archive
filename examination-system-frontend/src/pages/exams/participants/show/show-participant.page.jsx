import { ShowParticipantProvider } from "../../../../contexts/show-participant-context/show-participant.context";
import useMetaTag from "../../../../hooks/useMetaTag";

import ShowParticipant from "./show-participant.component";

const ShowParticipantPage = () => {
  useMetaTag({
    title: "Show Participant",
    ogTitle: "Show Participant",
  });
  return (
    <ShowParticipantProvider>
      <ShowParticipant />
    </ShowParticipantProvider>
  );
};

export default ShowParticipantPage;
