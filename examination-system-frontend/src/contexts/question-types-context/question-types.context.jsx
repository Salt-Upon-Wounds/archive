import { useState, useEffect, createContext } from "react";
import { useMountedState } from "react-use";
import { questionTypesIndexRequest } from "../../services/question-types/question-types.service";

export const QuestionTypesContext = createContext();

export const QuestionTypesProvider = ({ children }) => {
  const [questionTypes, setQuestionTypes] = useState([]);
  const isMounted = useMountedState();

  useEffect(() => {
    questionTypesIndexRequest()
      .then((response) => response.data.data)
      .then(({ types }) => {
        if (isMounted()) {
          setQuestionTypes(types);
        }
      });
  }, [isMounted]);
  return (
    <QuestionTypesContext.Provider value={{ questionTypes }}>
      {children}
    </QuestionTypesContext.Provider>
  );
};
