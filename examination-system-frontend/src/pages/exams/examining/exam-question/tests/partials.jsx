import { Route } from "react-router-dom";
import { ExaminingContext } from "../../../../../contexts/examining-context/examining.context";
import programRoutes from "../../../../../constants/program-routes.constant";
import {
  showParticipantId1,
  showParticipantId2,
} from "../../../../../mocks/mocks/participants.mock";

const getParticipant = (participantId) => {
  let participant;
  switch (participantId) {
    case 0:
      return null;
    case 1:
      participant = showParticipantId1;
      break;
    case 2:
      participant = showParticipantId2;
      break;
    default:
      throw new Error("participant id is not valid in exam question partials");
  }
  return participant.data.participant;
};

export const wrapper = (
  ui,
  {
    isContextLoaded = true,
    participantId = 1,
    nextQuestion = -1,
    prevQuestion = -1,
    finishExam = jest.fn(),
    examTime = {
      isExamStarted: true,
      isExamFinished: false,
      examTimeDuration: { seconds: 10, minutes: 10, hours: 10, days: 0 },
      seconds: 1,
      minutes: 1,
      hours: 1,
      days: 0,
    },
    isUserFinishedExam = false,
    errors = {},
  }
) => {
  const value = {
    isContextLoaded,
    participant: getParticipant(participantId),
    nextQuestion,
    prevQuestion,
    examTime,
    finishExam,
    isUserFinishedExam,
    errors,
  };
  const WrappedElement = (
    <Route path={programRoutes.examiningQuestion(":examId", ":questionId")}>
      <ExaminingContext.Provider value={value}>{ui}</ExaminingContext.Provider>
    </Route>
  );
  return { WrappedElement, value };
};
