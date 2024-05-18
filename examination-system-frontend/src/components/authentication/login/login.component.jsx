import { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import LoginForm from "./login-form.component";
import AuthenticateHeader from "../partials/authenticate-header.component";
import Brand from "../../brand/brand.component";
import { AuthenticationContext } from "../../../contexts/authentication-context/authentication.context";

const Login = () => {
  const { changePopover } = useContext(AuthenticationContext);
  return (
    <div className="h-100">
      <Row className="h-100 flex-column flex-md-row">
        <Col xs={12} md={6} lg={8}>
          <AuthenticateHeader />
        </Col>
        <Col className="order-md-first flex-fill" xs={12} md={6} lg={4}>
          <Container className="h-100 d-flex justify-content-around flex-column align-items-around">
            <Brand
              style={{ flexGrow: 1 }}
              className="d-flex justify-content-center align-items-center"
            />
            <LoginForm style={{ flexGrow: 3 }} />
            <p style={{ flexGrow: 1 }} className="fw-light text-center">
              <small>
                <span className="text-uppercase">Нет аккаунта? </span>
                <button
                  onClick={() => changePopover("register")}
                  className="text-uppercase text-decoration-none border-0 bg-transparent text-primary fst-italic"
                >
                  Создать новый
                </button>
              </small>
            </p>
          </Container>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
