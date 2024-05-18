import { Table } from "react-bootstrap";

const RecordsTable = ({ children }) => {
  return (
    <Table responsive hover className="bg-light shadow border">
      {children}
    </Table>
  );
};

export default RecordsTable;
