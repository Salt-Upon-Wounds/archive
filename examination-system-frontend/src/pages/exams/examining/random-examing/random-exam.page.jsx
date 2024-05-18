import { useContext, useState } from "react";
import { Link, useParams, Redirect } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

import { ExaminingContext } from "../../../../contexts/examining-context/examining.context";
import { AnswerQuestionProvider } from "../../../../contexts/answer-question-context/answer-question.context";

import useMetaTag from "../../../../hooks/useMetaTag";
import AnswerQuestion from "./answer-question-random/answer-question.component";
import ExamTime from "../../../../components/exam-time/exam-time.component";
import Modal from "../../../../components/modal/modal.component";

import programRoutes from "../../../../constants/program-routes.constant";
import apiRoutes from "../../../../constants/api-routes.constant";
import { AuthenticationContext } from "../../../../contexts/authentication-context/authentication.context";
import axios from "axios";
import useAsyncError from "../../../../hooks/useAsyncError";
import { useEffect } from "react";
import { useMountedState } from "react-use";

const RExamQuestionPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { token, removeUserInfo } = useContext(AuthenticationContext);
  const [errors, setErrors] = useState({});
  const [isFailed, setIsFailed] = useState(false);
  const throwError = useAsyncError();
  const [questionId, setQuestionId] = useState(0);
  const [exam, setExam] = useState(null);
  const isMounted = useMountedState();

  useMetaTag({
    title: "RExamining",
    ogTitle: "RExamining",
  });

  useEffect(() => {
    setIsLoading(true);
    if(isMounted)
      axios.get(apiRoutes.exams.randomExam(), {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        setExam(response.data);
        setQuestionId(0);
        setIsLoading(false);
      }).catch((errors) => {
        switch (Number(errors?.response?.status)) {
          case 401:
            removeUserInfo();
            setIsFailed(true);
            break;
          default:
            throwError(errors);
        }
        setIsLoading(false);
      });
  }, [removeUserInfo, throwError, token, isMounted]);

  const handleClick = (disabled) => {
    if (disabled) {
      return { onClick: (e) => e.preventDefault() };
    }
    return {};
  };

  const nextPage = () => {
    setQuestionId(questionId + 1);
  }

  const prevPage = () => {
    setQuestionId(questionId - 1);
  }

  if (isLoading) {
    return <p> Загрузка... </p>;
  }

  return (
    <div style={{ minHeight: "100vh" }}>

      <Container className="bg-white shadow border flex-grow-1 rounded p-4 my-2 text-start">
        <div className="d-flex ">

          <AnswerQuestion question={exam[questionId]}/>
        </div>
        <div className="d-flex justify-content-end">

            <Button
              className="me-3"
              variant="success"
              disabled={questionId === 0}
              onClick={prevPage}
            >
              Пред
            </Button>
            <Button
              className="me-3"
              variant="success"
              disabled={questionId === exam.length - 1}
              onClick={nextPage}
            >
              След
            </Button>
        </div>
      </Container>
    </div>
  );
};

export default RExamQuestionPage;
