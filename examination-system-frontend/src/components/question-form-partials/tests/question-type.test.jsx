import QuestionType from "../question-type.component";
import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";

const options = [
  { value: "1", label: "descriptive" },
  { value: "2", label: "fill the blank" },
  { value: "3", label: "multiple answer" },
];

test("selected question type must be equal to the input value", async () => {
  render(
    <QuestionType
      options={options}
      selectedValue={options[1].value}
      onChange={jest.fn()}
    />
  );

  const selectInput = screen.getByRole("combobox", { name: /question type/i });
  expect(selectInput).toHaveValue(options[1].value);
});

test("all the question types must be shown in the select", async () => {
  render(
    <QuestionType
      options={options}
      selectedValue={options[1].value}
      onChange={jest.fn()}
    />
  );

  for (const current of options) {
    expect(screen.getByText(current.label)).toBeInTheDocument();
  }
});

test("if the selected question type was changed, the onChange function must be triggered", async () => {
  const onChange = jest.fn();
  render(
    <QuestionType
      options={options}
      selectedValue={options[1].value}
      onChange={onChange}
    />
  );

  const selectInput = screen.getByRole("combobox", { name: /question type/i });
  userEvent.selectOptions(selectInput, options[0].value);
  expect(onChange).toHaveBeenCalledTimes(1);
});

test("if the disabled property was true, the select must be disabled", async () => {
  const onChange = jest.fn();
  render(
    <QuestionType
      options={options}
      selectedValue={options[1].value}
      onChange={onChange}
      disabled={true}
    />
  );

  const selectInput = screen.getByRole("combobox", { name: /question type/i });
  userEvent.selectOptions(selectInput, options[0].value);

  expect(onChange).toHaveBeenCalledTimes(0);
  expect(selectInput).toBeDisabled();
});
