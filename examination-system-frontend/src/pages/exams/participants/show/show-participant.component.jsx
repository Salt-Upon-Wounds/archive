import { useContext } from "react";

import ParticipantInfo from "./participant-info.component";
import AnswersInfo from "./answers-info.component";

import { ShowParticipantContext } from "../../../../contexts/show-participant-context/show-participant.context";
import { UserProvider } from "../../../../contexts/user-context/user.context";
import { ExamInfoProvider } from "../../../../contexts/exam-info-context/exam-info.context";

const ShowParticipant = () => {
  const { participant, isContextLoaded } = useContext(ShowParticipantContext);

  if (!isContextLoaded) {
    return <p> Загрузка... </p>;
  }

  return (
    <ExamInfoProvider examId={participant.exam_id}>
      <h1 className="display-6">ответы пользователя</h1>
      <UserProvider userId={participant.user_id}>
        <ParticipantInfo className="my-3" />
      </UserProvider>
      <AnswersInfo className="" />
    </ExamInfoProvider>
  );
};

export default ShowParticipant;
