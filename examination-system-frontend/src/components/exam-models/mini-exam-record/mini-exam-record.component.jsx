import { Link } from "react-router-dom";
import useExamStatus from "../../../hooks/useExamStatus";
import { convertToHumanReadable } from "../../../utilities/dateAndTime.utility";
import { BsClock } from "react-icons/bs";
import "./mini-exam-record.styles.css";

const MiniExamRecord = ({
  examName,
  examTime,
  examStart,
  examEnd,
  isPublished,
  to,
  ...props
}) => {
  const { 1: variant } = useExamStatus({
    examStart,
    examEnd,
    isPublished,
  });

  return (
    <Link to={to} className="text-decoration-none">
      <div {...props}>
        <div
          className={`mini-exam-record border-${variant} border border-start-0 border-end-0 border-top-0 border-2 rounded-top p-2`}
        >
          <div className={`text-start text-${variant}`}>
            <p className="m-0">
              {examName.length > 33 ? `${examName.slice(0, 30)}...` : examName}
            </p>
            <p className="m-0">
              <BsClock />
              <span className="ms-1 small">
                {convertToHumanReadable(examTime)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MiniExamRecord;
