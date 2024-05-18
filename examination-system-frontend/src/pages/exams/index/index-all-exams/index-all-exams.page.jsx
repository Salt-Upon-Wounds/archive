import { useState, useMemo, useEffect, useContext } from "react";
import { useHistory, Redirect, useLocation } from "react-router-dom";
import { AuthenticationContext } from "../../../../contexts/authentication-context/authentication.context";
import Search from "./search.component";
import useMetaTag from "../../../../hooks/useMetaTag";
import useAsyncError from "../../../../hooks/useAsyncError";
import { examsIndexRequest } from "../../../../services/exams/exams.service";
import { useMountedState } from "react-use";
import programRoutes from "../../../../constants/program-routes.constant";
import Pagination from "../../../../components/pagination/pagination.component";
import {
  getParams,
  createPath,
  createSearch,
} from "../../../../utilities/url.utility";
import ExamRecord from "../../../../components/exam-models/exam-record/exam-record.component";
import { convertFromUTC } from "../../../../utilities/dateAndTime.utility";

const IndexAllExams = () => {
  const [exams, setExams] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState(undefined);
  const [research, setResearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isContextLoaded, setIsContextLoaded] = useState(false);
  const { removeUserInfo } = useContext(AuthenticationContext);
  const location = useLocation();
  const page = useMemo(() => {
    return Number(getParams({ url: location.search }).page) || 1;
  }, [location]);
  const isMounted = useMountedState();
  const throwError = useAsyncError();
  const history = useHistory();
  useMetaTag({
    title: "All Exams",
    ogTitle: "All Exams",
  });

  useEffect(() => {
    if (
      (Number(page) === Number(currentPage) && research === false) ||
      isLoading ||
      searchQuery === undefined
    ) {
      return;
    }
    setIsLoading(true);
    setResearch(false);
    examsIndexRequest(page, searchQuery)
      .then((response) => response.data)
      .then(({ data, meta }) => {
        if (isMounted()) {
          setCurrentPage(Number(meta.current_page));
          setNumberOfPages(Number(meta.last_page));
        }
        return data;
      })
      .then(({ exams }) => {
        if (isMounted()) {
          setExams([
            ...exams.map((exam) => ({
              ...exam,
              start_of_exam: convertFromUTC(exam.start_of_exam),
              end_of_exam: convertFromUTC(exam.end_of_exam),
            })),
          ]);
          setIsContextLoaded(true);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted()) {
          switch (Number(err?.response?.status)) {
            case 401:
              removeUserInfo();
              break;
            default:
              throwError(err);
          }
          setIsContextLoaded(true);
          setIsLoading(false);
        }
      });
  }, [
    page,
    isMounted,
    searchQuery,
    currentPage,
    isLoading,
    removeUserInfo,
    throwError,
    research,
  ]);

  useEffect(() => {
    if (searchQuery === undefined) {
      return;
    }
    const search = {};
    if (page > 1) {
      search.page = page;
    }
    if (searchQuery !== "") {
      search.search = searchQuery;
    }
    history.push({
      search: createSearch({ params: search }),
    });
  }, [searchQuery, history, page]);

  useEffect(() => {
    if (searchQuery !== undefined) {
      return;
    }
    const currentQuery = getParams({ url: location.search }).search;
    if (currentQuery) {
      setSearchQuery(currentQuery);
    } else {
      setSearchQuery("");
    }
  }, [location.search, searchQuery]);

  if (
    isContextLoaded &&
    !isLoading &&
    (Number(page) > Number(numberOfPages) || Number(page) <= 0)
  ) {
    return (
      <Redirect
        to={createPath({
          pathName: programRoutes.indexAllExams(),
          params: { search: searchQuery },
        })}
      />
    );
  }

  const researchExam = () => {
    setExams([]);
    setCurrentPage(1);
    setIsContextLoaded(false);
    setResearch(true);
  };

  return (
    <>
      {searchQuery !== undefined && (
        <Search
          value={searchQuery}
          changeValue={(newVal) => setSearchQuery(newVal)}
          handleClick={researchExam}
        />
      )}
      {searchQuery === undefined || isLoading ? (
        <p>Загрузка...</p>
      ) : exams.length > 0 ? (
        <>
          {exams.map((exam, idx) => {
            return (
              <ExamRecord
                links={[
                  {
                    linkName: "Инфо",
                    linkHref: programRoutes.examiningOverview(exam.exam_id),
                  },
                ]}
                key={exam.exam_id}
                exam={exam}
                className="mb-3"
              />
            );
          })}
          <Pagination
            currentPage={currentPage}
            numberOfPages={numberOfPages}
            prefix={createPath({
              pathName: location.pathname,
              params: getParams({ url: location.search, except: ["page"] }),
            })}
          />
        </>
      ) : (
        <p className="lead">
          {searchQuery !== "" && searchQuery !== undefined
            ? `не найдено совпадений "${searchQuery}"`
            : "список пуст"}{" "}
        </p>
      )}
    </>
  );
};

export default IndexAllExams;
