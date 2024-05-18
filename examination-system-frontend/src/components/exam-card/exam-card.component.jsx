import { Card, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import UserInfo from "../user-info/user-info.component";

const ExamCard = ({ title, handleMoreDetails, ...props }) => {
  return (
    <Card className="bg-light" {...props} style={{ height: 600 }}>
      <UserInfo />
      <Card.Img style={{ height: 250 }} variant="top" src="./Exam.jpeg" />
      <Card.Body className="d-flex flex-column justify-content-between">
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Row>
          <Col xs={6} className="d-flex justify-content-start">
            <Button variant="secondary" onClick={handleMoreDetails}>
              Детали
            </Button>
          </Col>
          <Col xs={6} className="d-flex justify-content-end align-items-center">
            <Button variant="outline-secondary">
              <FontAwesomeIcon icon={faShareAlt} />
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ExamCard;
