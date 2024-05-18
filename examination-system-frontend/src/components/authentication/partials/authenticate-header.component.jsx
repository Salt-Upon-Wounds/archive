import { Container, Image, Row, Col } from "react-bootstrap";
import externalRoutes from "../../../constants/external-routes.constant";

const AuthenticateHeader = () => {
  return (
    <Container fluid className="h-100" style={{ backgroundColor: "#bcf1dd" }}>
      <div className="p-3 pb-1 p-md-0 h-100 d-flex flex-column justify-content-center">
        <Row className="d-flex flex-column justify-content-center align-items-center">
          <Col xs={2} md={0} />
          <Col
            xs={8}
            md={12}
            className="flex-grow-1 d-flex justify-content-center align-items-center flex-column"
          >
            <Image
              style={{ maxHeight: "75%" }}
              className="d-none d-md-inline w-100 float-start"
              src="./auth-image.jpg"
              alt="Authentication Page"
            />

            <h3
              style={{ fontSize: "min(3.5vw, 25px)" }}
              className="text-success text-center fw-light text-uppercase"
            >
              подгтовка к ЦТ в любое время
            </h3>
          </Col>
          <Col xs={2} md={0} />
        </Row>
        <Row>
          <Col>
            <p
              style={{ fontSize: "min(2.5vw,15px)" }}
              className="text-uppercase mt-3 mb-2 text-center fw-light"
            >
              <span className="text-success">нашли ошибки? </span>
              <a href={externalRoutes.contactUs()}>
                <em>свяжитесь с нами</em>
              </a>
            </p>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default AuthenticateHeader;
