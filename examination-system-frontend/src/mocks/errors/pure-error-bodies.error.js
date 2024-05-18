import { randomString } from "../../utilities/tests.utility";

export const error_401 = () => {
  const errorBody = {
    message: "Unauthenticated.",
  };
  return { errorBody };
};

export const error_422 = ({ message, fields }) => {
  const errors = {};
  for (const field of fields) {
    errors[field] = randomString(20);
  }
  const errorBody = {
    message: message,
    errors: { ...errors },
  };
  return { errorBody, errors };
};
