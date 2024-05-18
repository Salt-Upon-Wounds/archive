import apiRoutes from "../../constants/api-routes.constant";
import axios from "axios";

export const examsIndexRequest = async (page, search) => {
  const params = {
    page: page,
  };
  if (search !== undefined && search !== "") {
    params.search = search;
  }
  return axios.get(apiRoutes.exams.indexAllExams(), {
    params,
    headers: {
      accept: "application/json",
    },
  });
};

export const ownedExamsIndexRequest = async (token, page = 1) => {
  return axios.get(apiRoutes.exams.indexCreatedExams(), {
    params: {
      page: page,
    },
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

export const participatedExamsIndexRequest = async (token, page = 1) => {
  return axios.get(apiRoutes.participants.participatedExams(), {
    params: {
      page: page,
    },
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

export const examsShowRequest = async (examId, token = "") => {
  const hdrs = {
    accept: "application/json",
  };
  if (token) {
    hdrs.authorization = `Bearer ${token}`;
  }
  return axios.get(apiRoutes.exams.showExam(examId), {
    headers: hdrs,
  });
};

export const examsStoreRequest = (token, body) => {
  return axios.post(apiRoutes.exams.createExam(), body, {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

export const examsUpdateRequest = (token, body, examId) => {
  return axios.put(apiRoutes.exams.updateExam(examId), body, {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

export const examsPublishRequest = (token, examId) => {
  return axios.put(
    apiRoutes.exams.publishExam(examId),
    {},
    {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
    }
  );
};

export const examsUnpublishRequest = (token, examId) => {
  return axios.put(
    apiRoutes.exams.unpublishExam(examId),
    {},
    {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
    }
  );
};
