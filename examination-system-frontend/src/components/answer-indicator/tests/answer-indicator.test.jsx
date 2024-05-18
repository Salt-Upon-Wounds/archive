import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import AnswerIndicator from "../answer-indicator.component";

describe("if the answer prop is true, the 'correct answer' must be checked and otherwise unchecked", () => {
  test("check answer = true", () => {
    const onChange = jest.fn();
    render(<AnswerIndicator answer={true} onChange={onChange} />);

    const correctAnswerRadio = screen.getByRole("radio", {
      name: /correct answer/i,
    });
    expect(correctAnswerRadio).toBeChecked();
  });

  test("check answer = false", () => {
    const onChange = jest.fn();
    render(<AnswerIndicator answer={false} onChange={onChange} />);

    const correctAnswerRadio = screen.getByRole("radio", {
      name: /correct answer/i,
    });
    expect(correctAnswerRadio).not.toBeChecked();
  });
});

describe("if the answer props is false, the 'correct answer' must be checked and otherwise unchecked", () => {
  test("check answer = true", () => {
    const onChange = jest.fn();
    render(<AnswerIndicator answer={true} onChange={onChange} />);

    const wrongAnswerRadio = screen.getByRole("radio", {
      name: /wrong answer/i,
    });
    expect(wrongAnswerRadio).not.toBeChecked();
  });

  test("check answer = false", () => {
    const onChange = jest.fn();
    render(<AnswerIndicator answer={false} onChange={onChange} />);

    const wrongAnswerRadio = screen.getByRole("radio", {
      name: /wrong answer/i,
    });
    expect(wrongAnswerRadio).toBeChecked();
  });
});

describe("check changing the value", () => {
  describe("if user click on chosen radio, nothing must be happened", () => {
    test("check when answer = true", () => {
      const onChange = jest.fn();
      render(<AnswerIndicator answer={true} onChange={onChange} />);

      const correctAnswerRadio = screen.getByRole("radio", {
        name: /correct answer/i,
      });
      userEvent.click(correctAnswerRadio);

      expect(onChange).toHaveBeenCalledTimes(0);
    });

    test("check when answer = false", () => {
      const onChange = jest.fn();
      render(<AnswerIndicator answer={false} onChange={onChange} />);

      const wrongAnswerRadio = screen.getByRole("radio", {
        name: /wrong answer/i,
      });
      userEvent.click(wrongAnswerRadio);

      expect(onChange).toHaveBeenCalledTimes(0);
    });
  });
  describe("if user click on another radio, onChange must be triggered", () => {
    test("check when answer = true", () => {
      const onChange = jest.fn();
      render(<AnswerIndicator answer={true} onChange={onChange} />);

      const wrongAnswerRadio = screen.getByRole("radio", {
        name: /wrong answer/i,
      });
      userEvent.click(wrongAnswerRadio);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(false);
    });

    test("check when answer = false", () => {
      const onChange = jest.fn();
      render(<AnswerIndicator answer={false} onChange={onChange} />);

      const correctAnswerRadio = screen.getByRole("radio", {
        name: /correct answer/i,
      });
      userEvent.click(correctAnswerRadio);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });
});

describe("check readonly property", () => {
  test("if readonly was true, the radios do not have to change", () => {
    const onChange = jest.fn();
    render(
      <AnswerIndicator answer={false} readOnly={true} onChange={onChange} />
    );

    const correctAnswerRadio = screen.getByRole("radio", {
      name: /correct answer/i,
    });
    userEvent.click(correctAnswerRadio);

    expect(onChange).toHaveBeenCalledTimes(0);
  });
});

describe("setting buttons contents", () => {
  test("default button contents must be correct answer and wrong answer", () => {
    const onChange = jest.fn();
    render(<AnswerIndicator answer={true} onChange={onChange} />);

    expect(
      screen.getByRole("radio", { name: /correct answer/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /wrong answer/i })
    ).toBeInTheDocument();
  });

  test("if there is any buttonLabels in props, they must be shown", () => {
    const onChange = jest.fn();
    const greenButton = "something green";
    const redButton = "something red";
    render(
      <AnswerIndicator
        answer={true}
        onChange={onChange}
        buttonLabels={[greenButton, redButton]}
      />
    );

    expect(
      screen.getByRole("radio", { name: greenButton })
    ).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: redButton })).toBeInTheDocument();
  });
});

describe("check when we do not have any answer", () => {
  describe("if the noAnswer was true, none of the radios must be checked", () => {
    test("if answer is true", () => {
      const onChange = jest.fn();
      render(
        <AnswerIndicator answer={true} onChange={onChange} noAnswer={true} />
      );

      const radios = screen.getAllByRole("radio");
      expect(radios).toHaveLength(2);
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).not.toBeChecked();
    });

    test("if answer is false", () => {
      const onChange = jest.fn();
      render(
        <AnswerIndicator answer={false} onChange={onChange} noAnswer={true} />
      );

      const radios = screen.getAllByRole("radio");
      expect(radios).toHaveLength(2);
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).not.toBeChecked();
    });

    test("if answer is undefined", () => {
      const onChange = jest.fn();
      render(<AnswerIndicator onChange={onChange} noAnswer={true} />);

      const radios = screen.getAllByRole("radio");
      expect(radios).toHaveLength(2);
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).not.toBeChecked();
    });
  });
});
