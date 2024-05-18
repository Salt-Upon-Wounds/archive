export const biggerThanScore = (score) => ({
  message: "The given data was invalid.",
  errors: {
    grade: [`The grade must not be greater than ${score}.`],
  },
});

export const smallerThanZero = {
  message: "The given data was invalid.",
  errors: {
    grade: ["The grade must be at least 0."],
  },
};
