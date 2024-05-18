import { useContext } from "react";
import Header from "./header/header.component";
import Footer from "./footer/footer.component";
import Sidebar from "../sidebar/sidebar.component";
import { AuthenticationContext } from "../../contexts/authentication-context/authentication.context";

const Layout = ({ children }) => {
  const { isUserAuthenticated } = useContext(AuthenticationContext);
  return (
    <>
      <div className="d-flex flex-row">
        {isUserAuthenticated && <Sidebar>{children}</Sidebar>}
        <div className="flex-grow-1">
          <Header />
          <div>{children}</div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;
