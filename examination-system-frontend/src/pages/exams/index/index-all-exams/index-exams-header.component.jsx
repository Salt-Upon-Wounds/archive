import { Container, Button, Row, Col } from "react-bootstrap";

const Header = () => {
  return (
    <Container fluid={true} className="bg-light p-5">
      <Container className="my-5">
        <Row>
          <Col>
            <Row>
              <Col xs={12}>
                <h1 className="text-success text-center">
                  Lorem ipsum dolor sit amet
                </h1>
              </Col>
            </Row>
            <Row>
              <Col lg="2"></Col>
              <Col lg="8">
                <p className="text-success text-center fs-3 mt-4">
                  {" "}
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.{" "}
                </p>
              </Col>
              <Col lg="2"></Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center mt-5">
            <Button variant="outline-success" className="px-5" size="lg">
              Создайте ваш первый тест
            </Button>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Header;
