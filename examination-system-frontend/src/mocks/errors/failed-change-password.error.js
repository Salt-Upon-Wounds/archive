export const wrongCurrentPassword = {
  message: "The given data was invalid.",
  errors: {
    current_password: [
      "The provided password does not match your current password.",
    ],
  },
};

export const passwordConfirmationDoesNotMatch = {
  message: "The given data was invalid.",
  errors: {
    password: ["The password confirmation does not match."],
  },
};
