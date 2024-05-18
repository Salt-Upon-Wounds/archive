export const repeatedEmailError = {
  message: "The given data was invalid.",
  errors: {
    email: ["The email has already been taken."],
  },
};

export const passwordMatchError = {
  message: "The given data was invalid.",
  errors: {
    password: ["The password confirmation does not match."],
  },
};

export const shortPasswordAndRepeatedEmailError = {
  message: "The given data was invalid.",
  errors: {
    email: ["The email has already been taken."],
    password: ["The password must be at least 8 characters."],
  },
};

export const shortPasswordError = {
  message: "The given data was invalid.",
  errors: {
    password: ["The password must be at least 8 characters."],
  },
};
