import { useContext } from "react";
import { Button } from "react-bootstrap";
import { AuthenticationContext } from "../../../contexts/authentication-context/authentication.context";

const AuthButton = ({ variant, text, ...props }) => {
  const { isLoading } = useContext(AuthenticationContext);
  return (
    <Button variant={variant} disabled={isLoading} type="submit" {...props}>
      {isLoading ? "Загрузка..." : text}
    </Button>
  );
};

export default AuthButton;
