import { Row, Col, Image } from "react-bootstrap";

const UserInfo = ({ imageSize = 50 }) => {
  return (
    <Row className="p-3">
      <Col xs={3} className="d-flex justify-content-center">
        <Image
          className="border border-3 border-success"
          style={{ width: imageSize, height: imageSize }}
          src="./user.jpeg"
          roundedCircle
        />
      </Col>
      <Col xs={1}></Col>
      <Col xs={7} className="d-flex text-success fw-bold align-items-center">
        <p className="fs-4">Just Test</p>
      </Col>
    </Row>
  );
};

export default UserInfo;
