import React from "react";
import { Container, Dropdown } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import { BsAlarm, BsArrowRight } from "react-icons/bs";
import useExamStatus from "../../../hooks/useExamStatus";
import "./exam-record.style.css";

const ExamRecord = ({ exam, links, extraLinks, ...props }) => {
  const [currentStatus, color] = useExamStatus({
    examStart: exam.start_of_exam,
    examEnd: exam.end_of_exam,
    isPublished: exam.published === undefined ? true : exam.published,
  });

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <button
      className="bg-white border-0 p-1"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </button>
  ));

  return (
    <div {...props}>
      <Container
        className={`exam-record bg-white rounded border shadow border-start-${color} border-start-lg pt-2`}
      >
        <div>
          <div className="text-start">
            <div className="d-flex justify-content-between">
              <div>
                <p className="lead mb-0" title={exam.exam_name}>
                  {exam.exam_name.length > 46
                    ? `${exam.exam_name.substr(0, 43)}...`
                    : exam.exam_name}
                </p>
                <p className="small text-muted">составитель {exam.owner_name}</p>
              </div>
              <div>
                {extraLinks && (
                  <Dropdown>
                    <Dropdown.Toggle
                      as={CustomToggle}
                      variant="success"
                      id="dropdown-basic"
                    >
                      <BsThreeDotsVertical />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {extraLinks.map(({ linkName, linkHref }) => {
                        return (
                          <Dropdown.Item as={Link} to={linkHref} key={linkName}>
                            {linkName}
                          </Dropdown.Item>
                        );
                      })}
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
            </div>
          </div>
          <div className="d-flex text-muted small align-items-center">
            <BsAlarm />
            <p className="m-0 mx-1">{exam.start_of_exam}</p>
            <BsArrowRight />
            <p className="m-0 mx-1">{exam.end_of_exam}</p>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <p
              className={`text-${color} font-monospace fw-bold text-start my-3`}
            >
              {currentStatus === "not started" ? "не начался" : ""}
              {currentStatus === "running" ? "открыт" : ""}
              {currentStatus === "finished" ? "завершен" : ""}
              {currentStatus === "not published" ? "закрыт" : ""}
            </p>
            {links.map(({ linkName, linkHref }) => {
              return (
                <Link key={linkName} to={linkHref}>
                  <button className="my-3 bg-white text-dark border-dark border p-1 rounded">
                    {linkName}
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ExamRecord;
