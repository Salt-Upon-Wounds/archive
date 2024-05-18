const errorMessages = {
  questions: {
    question_text: {
      empty: "текстовое поле вопроса обязательно для заполнения",
    },
    question_score: {
      notPositive: "количество баллов должно быть положительным числом",
    },
    question_answers: {
      emptyAnswer: "текстовое поле ответа на вопрос обязательно для заполнения",
    },
    question_options: {
      emptyOption: "текстовое варианта ответа обязательно для заполнения",
    },
  },
};

export default errorMessages;
