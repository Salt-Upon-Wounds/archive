import { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, Redirect, useLocation } from "react-router-dom";

import useMetaTag from "../../hooks/useMetaTag";
import programRoutes from "../../constants/program-routes.constant";
import RegisterForm from "../../components/authentication/register/register-form.component";
import AuthenticateHeader from "../../components/authentication/partials/authenticate-header.component";
import Brand from "../../components/brand/brand.component";
import { AuthenticationContext } from "../../contexts/authentication-context/authentication.context";
import { getParams } from "../../utilities/url.utility";

const Register = () => {
  const { isUserAuthenticated } = useContext(AuthenticationContext);
  const location = useLocation();
  useMetaTag({
    title: "Register",
    ogTitle: "Register",
  });

  if (isUserAuthenticated) {
    const redirect = getParams({ url: location.search }).redirect;
    if (redirect) {
      return <Redirect to={redirect} />;
    }
    return <Redirect to={programRoutes.profile()} />;
  }

  return (
    <div className="flex-grow-1 d-flex overflow-hidden">
      <Row className="flex-grow-1 d-flex flex-column flex-md-row">
        <Col xs={12} md={6} lg={8}>
          <AuthenticateHeader />
        </Col>
        <Col
          className="order-md-first flex-fill d-flex flex-grow-1"
          xs={12}
          md={6}
          lg={4}
        >
          <Container className="d-flex justify-content-around flex-column align-items-around">
            <Brand
              style={{ flexGrow: 1 }}
              className="d-flex justify-content-center align-items-center"
            />
            <RegisterForm style={{ flexGrow: 3 }} />
            <p style={{ flexGrow: 1 }} className="fw-light text-center">
              <small>
                <span className="text-uppercase">есть аккаунт? </span>
                <Link to={programRoutes.login()}>
                  <button className="text-uppercase text-decoration-none border-0 bg-transparent text-primary fst-italic">
                    войти
                  </button>
                </Link>
              </small>
            </p>
          </Container>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
