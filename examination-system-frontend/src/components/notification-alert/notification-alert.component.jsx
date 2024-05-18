import { Row, Col, Alert } from "react-bootstrap";

const NotificationAlert = ({ children, variant }) => {
  return (
    <div className="fixed-bottom">
      <Row>
        <Col lg={6} xs={12}>
          <Alert dismissible variant={variant}>
            {children}
          </Alert>
        </Col>
      </Row>
    </div>
  );
};

export default NotificationAlert;
