import Button from "react-bootstrap/Button";
import { BsSearch } from "react-icons/bs";
const Search = (props) => {
  return (
    <div {...props} role="search">
      <Button>
        <BsSearch />
      </Button>
    </div>
  );
};

export default Search;
