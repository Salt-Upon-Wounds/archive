import CheckboxAndRadioInput from "./checkbox-and-radio-input.component";

const RadioInput = ({
  label,
  checked,
  id,
  inputProps,
  onChange,
  error,
  readOnly = false,
  ...props
}) => {
  return (
    <CheckboxAndRadioInput
      type="radio"
      label={label}
      checked={checked}
      id={id}
      inputProps={inputProps}
      onChange={onChange}
      error={error}
      disabled={readOnly}
      {...props}
    />
  );
};

export default RadioInput;
