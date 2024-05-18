import { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, Redirect, useLocation } from "react-router-dom";
import useMetaTag from "../../hooks/useMetaTag";
import LoginForm from "../../components/authentication/login/login-form.component";
import AuthenticateHeader from "../../components/authentication/partials/authenticate-header.component";
import { AuthenticationContext } from "../../contexts/authentication-context/authentication.context";
import Brand from "../../components/brand/brand.component";
import { getParams } from "../../utilities/url.utility";
import programRoutes from "../../constants/program-routes.constant";

const LoginPage = () => {
  const { isUserAuthenticated } = useContext(AuthenticationContext);
  const location = useLocation();
  useMetaTag({
    title: "Login",
    ogTitle: "Login",
  });

  if (isUserAuthenticated) {
    const redirect = getParams({ url: location.search }).redirect;

    if (redirect) {
      return <Redirect to={redirect} />;
    }
    return <Redirect to={programRoutes.profile()} />;
  }

  return (
    <div className=" flex-grow-1 d-flex overflow-hidden">
      <Row className="flex-column flex-grow-1 flex-md-row d-flex">
        <Col xs={12} md={6} lg={8}>
          <AuthenticateHeader />
        </Col>
        <Col
          className="d-flex order-md-first flex-grow-1 flex-fill"
          xs={12}
          md={6}
          lg={4}
        >
          <Container className=" d-flex justify-content-around flex-column align-items-around">
            <Brand
              style={{ flexGrow: 1 }}
              className="d-flex justify-content-center align-items-center"
            />
            <LoginForm style={{ flexGrow: 3 }} />
            <p style={{ flexGrow: 1 }} className="fw-light text-center">
              <small>
                <span className="text-uppercase">нет аккаунта? </span>
                <Link to={programRoutes.register()}>
                  <button className="text-uppercase text-decoration-none border-0 bg-transparent text-primary fst-italic">
                    создать новый
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

export default LoginPage;
