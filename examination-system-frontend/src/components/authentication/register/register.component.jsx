import { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import RegisterForm from "./register-form.component";
import AuthenticateHeader from "../partials/authenticate-header.component";
import Brand from "../../brand/brand.component";
import { AuthenticationContext } from "../../../contexts/authentication-context/authentication.context";

const Register = () => {
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
            <RegisterForm style={{ flexGrow: 3 }} />
            <p style={{ flexGrow: 1 }} className="fw-light text-center">
              <small>
                <span className="text-uppercase">Уже есть аккаунт? </span>
                <button
                  onClick={() => changePopover("login")}
                  className="text-uppercase text-decoration-none border-0 bg-transparent text-primary fst-italic"
                >
                  Войти
                </button>
              </small>
            </p>
          </Container>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
