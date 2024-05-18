import { useContext } from "react";
import Popover from "../../popover/popover.component";
import Register from "../../authentication/register/register.component";
import { AuthenticationContext } from "../../../contexts/authentication-context/authentication.context";

const RegisterPopover = () => {
  const { changePopover } = useContext(AuthenticationContext);
  return (
    <Popover zIndex={20} onPopoverClose={() => changePopover("")}>
      <div className="d-flex h-100 w-100 justify-content-center align-items-center">
        <div
          style={{ width: "min(80%, 1080px)", height: "70%" }}
          className="bg-light"
        >
          <Register />
        </div>
      </div>
    </Popover>
  );
};

export default RegisterPopover;
