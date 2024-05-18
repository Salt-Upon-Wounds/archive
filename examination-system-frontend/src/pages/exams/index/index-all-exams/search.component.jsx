import { useState } from "react";
import { useDebounce } from "react-use";
import {
  InputGroup,
  Form,
  Button,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";
import { BsSearch } from "react-icons/bs";

const Search = ({ value, changeValue, handleClick }) => {
  const [currentValue, setCurrentValue] = useState(value || "");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value !== currentValue) {
      changeValue(currentValue);
    }
    handleClick();
  };

  useDebounce(
    () => {
      if (value === currentValue) {
        return;
      }
      changeValue(currentValue);
      handleClick();
    },
    500,
    [currentValue]
  );

  return (
    <Row>
      <Col lg={2}></Col>
      <Col lg={8}>
        <Form onSubmit={handleSubmit}>
          <InputGroup size="lg" role="search" className="mb-3">
            <FormControl
              className="rounded-pill"
              placeholder="Найти тест"
              aria-label="search-exam"
              aria-describedby="search-exam"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
            />
            <Button
              type="submit"
              title="search exam"
              id="search-exam"
              variant="muted"
              className="ms-1 rounded-circle"
            >
              <BsSearch />
            </Button>
          </InputGroup>
        </Form>
      </Col>
      <Col lg={2}></Col>
    </Row>
  );
};

export default Search;
