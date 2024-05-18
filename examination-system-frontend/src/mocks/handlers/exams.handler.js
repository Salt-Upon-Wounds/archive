import { rest } from "msw";
import apiRoutes from "../../constants/api-routes.constant";
import {
  pageOneExamsIndex,
  pageTwoExamsIndex,
  pageThreeExamsIndex,
  notFoundPageExamsIndex,
  examShowId_1,
  examShowId_2,
  examShowId_3,
  examShowId_4,
  examShowId_5_withPassword,
  notFoundExamSearch,
  foundSearch,
} from "../mocks/exams.mock";
import { invalidSum } from "../errors/failed-publish.error";

import { undefinedExamName } from "../errors/failed-exam-creation.error";
import { wrongStartExamFormat } from "../errors/failed-exam-update.error";

const examsHandler = [
  rest.get(apiRoutes.exams.indexAllExams(), (req, res, ctx) => {
    const valueOfPage = req.url.searchParams.get("page");
    const searchQuery = req.url.searchParams.get("search");
    if (
      searchQuery !== undefined &&
      searchQuery !== null &&
      searchQuery !== foundSearch
    ) {
      return res(ctx.json(notFoundExamSearch));
    }
    const page = Number(valueOfPage);
    switch (page) {
      case 1:
        return res(ctx.json(pageOneExamsIndex));

      case 2:
        return res(ctx.json(pageTwoExamsIndex));

      case 3:
        return res(ctx.json(pageThreeExamsIndex));

      default:
        return res(ctx.json(notFoundPageExamsIndex(page)));
    }
  }),
  rest.get(apiRoutes.exams.indexCreatedExams(), (req, res, ctx) => {
    if (!req.headers.get("authorization")) {
      return res(ctx.status(401));
    }

    const valueOfPage = req.url.searchParams.get("page");
    const page = Number(valueOfPage);
    switch (page) {
      case 1:
        return res(ctx.json(pageOneExamsIndex));

      case 2:
        return res(ctx.json(pageTwoExamsIndex));

      case 3:
        return res(ctx.json(pageThreeExamsIndex));

      default:
        return res(ctx.json(notFoundPageExamsIndex(page)));
    }
  }),
  rest.get(apiRoutes.participants.participatedExams(), (req, res, ctx) => {
    if (!req.headers.get("authorization")) {
      return res(ctx.status(401));
    }

    const valueOfPage = req.url.searchParams.get("page");
    const page = Number(valueOfPage);
    switch (page) {
      case 1:
        return res(ctx.json(pageOneExamsIndex));

      case 2:
        return res(ctx.json(pageTwoExamsIndex));

      case 3:
        return res(ctx.json(pageThreeExamsIndex));

      default:
        return res(ctx.json(notFoundPageExamsIndex(page)));
    }
  }),
  rest.get(apiRoutes.exams.showExam(":examId"), (req, res, ctx) => {
    if (!req.headers.get("authorization")) {
      return res(ctx.status(401));
    }

    let { examId } = req.params;
    examId = Number(examId);

    switch (examId) {
      case 1:
        return res(ctx.json(examShowId_1));

      case 2:
        return res(ctx.json(examShowId_2));

      case 3:
        return res(ctx.json(examShowId_3));

      case 4:
        return res(ctx.json(examShowId_4));

      case 5:
        return res(ctx.json(examShowId_5_withPassword));

      default:
        return res(ctx.status(404));
    }
  }),
  rest.post(apiRoutes.exams.createExam(), (req, res, ctx) => {
    if (!req.headers.get("authorization")) {
      return res(ctx.status(401));
    }

    const {
      exam_name,
      needs_confirmation,
      start_of_exam,
      end_of_exam,
      total_score,
      password,
    } = req.body;

    if (!exam_name) {
      return res(ctx.json(undefinedExamName), ctx.status(422));
    }
    if (
      needs_confirmation === undefined ||
      start_of_exam === undefined ||
      end_of_exam === undefined ||
      total_score === undefined
    ) {
      throw Error("unforeseen input variables");
    } else if (!password) {
      return res(ctx.json(examShowId_1), ctx.status(201));
    } else {
      return res(ctx.json(examShowId_5_withPassword), ctx.status(201));
    }
  }),
  rest.get(apiRoutes.exams.indexCreatedExams(), (req, res, ctx) => {
    if (!req.headers.get("authorization")) {
      return res(ctx.status(401));
    }

    const valueOfPage = req.url.searchParams.get("page");
    const page = Number(valueOfPage);
    switch (page) {
      case 1:
        return res(ctx.json(pageOneExamsIndex));

      case 2:
        return res(ctx.json(pageTwoExamsIndex));

      case 3:
        return res(ctx.json(pageThreeExamsIndex));

      default:
        return res(ctx.json(notFoundPageExamsIndex(page)));
    }
  }),
  rest.put(apiRoutes.exams.updateExam(":examId"), (req, res, ctx) => {
    if (!req.headers.get("authorization")) {
      return res(ctx.status(401));
    }

    let { examId } = req.params;
    examId = Number(examId);

    const {
      exam_name,
      needs_confirmation,
      start_of_exam,
      end_of_exam,
      total_score,
      password,
    } = req.body;

    if (start_of_exam === "Invalid date") {
      return res(ctx.status(422), ctx.json(wrongStartExamFormat));
    }

    if (examId === 1) {
      return res(
        ctx.json({
          data: {
            exam: {
              exam_id: examId,
              exam_name: exam_name || examShowId_1.data.exam.exam_name,
              needs_confirmation:
                needs_confirmation || examShowId_1.data.exam.needs_confirmation,
              has_password: password ? true : examShowId_1.data.exam.password,
              start_of_exam:
                start_of_exam || examShowId_1.data.exam.start_of_exam,
              end_of_exam: end_of_exam || examShowId_1.data.exam.end_of_exam,
              total_score: total_score || examShowId_1.data.exam.total_score,
              creation_time: "2021-10-21T15:38:28.000000Z",
              last_update: "2021-10-25T11:35:56.000000Z",
              owner_id: 1,
              owner_name: "Eli Abernathy",
              owner_link: "http://localhost:8000/api/users/1",
              is_registered: false,
            },
          },
        })
      );
    } else if (examId === 5) {
      return res(
        ctx.json({
          data: {
            exam: {
              exam_id: examId,
              exam_name:
                exam_name || examShowId_5_withPassword.data.exam.exam_name,
              needs_confirmation:
                needs_confirmation ||
                examShowId_5_withPassword.data.exam.needs_confirmation,
              has_password: password
                ? true
                : examShowId_5_withPassword.data.exam.password,
              start_of_exam:
                start_of_exam ||
                examShowId_5_withPassword.data.exam.start_of_exam,
              end_of_exam:
                end_of_exam || examShowId_5_withPassword.data.exam.end_of_exam,
              total_score:
                total_score || examShowId_5_withPassword.data.exam.total_score,
              creation_time: "2021-10-21T15:38:28.000000Z",
              last_update: "2021-10-25T11:35:56.000000Z",
              owner_id: 1,
              owner_name: "Eli Abernathy",
              owner_link: "http://localhost:8000/api/users/1",
              is_registered: false,
            },
          },
        })
      );
    } else {
      throw Error("invalid examId");
    }
  }),
  rest.put(apiRoutes.exams.publishExam(":examId"), (req, res, ctx) => {
    if (!req.headers.get("authorization")) {
      return res(ctx.status(401));
    }

    const { examId } = req.params;

    switch (Number(examId)) {
      // for successful states
      case 1:
        return res(ctx.status(202));
      // for unsuccessful states
      case 3:
        return res(ctx.json(invalidSum), ctx.status(422));
      default:
        return res(ctx.status(404));
    }
  }),
  rest.put(apiRoutes.exams.unpublishExam(":examId"), (req, res, ctx) => {
    if (!req.headers.get("authorization")) {
      return res(ctx.status(401));
    }

    return res(ctx.status(202));
  }),
];

export default examsHandler;
