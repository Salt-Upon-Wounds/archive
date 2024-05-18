import { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { BsHouseDoor, BsGear, BsBoxArrowRight } from "react-icons/bs";
import { Navbar, Dropdown, Image, Container, Nav } from "react-bootstrap";
import { AuthenticationContext } from "../../../contexts/authentication-context/authentication.context";
import programRoutes from "../../../constants/program-routes.constant";
import externalRoutes from "../../../constants/external-routes.constant";
import useCurrentPath from "../../../hooks/useCurrentPath";
import "./header.styles.css";

const Header = () => {
  const { user, logout } = useContext(AuthenticationContext);
  const toggleButtonRef = useRef();
  const checkCurrentPath = useCurrentPath();

  const isActive = (expected) => {
    const output = {};
    output.active = checkCurrentPath(expected);
    return output;
  };

  const closeMenu = () => {
    if (
      toggleButtonRef.current?.classList &&
      !Array.from(toggleButtonRef.current?.classList).includes("collapsed")
    ) {
      toggleButtonRef.current.click();
    }
  };

  return (
    <div className="navbar-container" style={{ zIndex: 100 }}>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="white"
        variant="light"
        className="shadow py-1"
      >
        <Container className="">
          <Navbar.Brand
            href={externalRoutes.main()}
            className="ms-3 me-auto py-0"
          >
            <Image
              src="./favicon.ico"
              width={50}
              height={50}
              alt="FizMat"
            />
          </Navbar.Brand>
          {user && (
            <Dropdown align="end">
              <Dropdown.Toggle variant="white" id="dropdown-basic">
                {user.user_name.length > 18
                  ? `${user.user_name.substr(0, 15)}...`
                  : user.user_name}
              </Dropdown.Toggle>

              <Dropdown.Menu className="p-2">
                <Dropdown.Header>
                  {user.user_name.length > 33
                    ? `${user.user_name.substr(0, 30)}...`
                    : user.user_name}
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item
                  {...isActive(programRoutes.profile())}
                  as={Link}
                  onClick={closeMenu}
                  className="text-dark p-1 user-popover-link rounded"
                  to={programRoutes.profile()}
                >
                  <span className="pe-2">
                    <BsHouseDoor />
                  </span>

                  <span>Прогресс</span>
                </Dropdown.Item>
                <Dropdown.Item
                  {...isActive(programRoutes.settings())}
                  as={Link}
                  onClick={closeMenu}
                  className="text-dark p-1 user-popover-link rounded"
                  to={programRoutes.settings()}
                >
                  <span className="pe-2">
                    <BsGear />
                  </span>

                  <span>Настройки</span>
                </Dropdown.Item>
                <Dropdown.Item
                  className="text-dark p-1 user-popover-link rounded"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  role="button"
                >
                  <span className="pe-2">
                    <BsBoxArrowRight />
                  </span>

                  <span>Выйти</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
          <Navbar.Toggle
            ref={toggleButtonRef}
            aria-controls="responsive-navbar-nav"
          />
          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="flex-lg-grow-0"
          >
            <Nav className="me-auto">
              {user && (
                <>
                  <Nav.Link
                    {...isActive(programRoutes.profile())}
                    as={Link}
                    onClick={closeMenu}
                    className="d-lg-none m-2 lead"
                    to={programRoutes.profile()}
                  >
                    Прогресс
                  </Nav.Link>
                  <Nav.Link
                    {...isActive(programRoutes.indexAllExams())}
                    as={Link}
                    onClick={closeMenu}
                    className="d-lg-none m-2 lead"
                    to={programRoutes.indexAllExams()}
                  >
                    Все тесты
                  </Nav.Link>
                  {user.permissions.includes('create-exams') ?
                  <Nav.Link
                    {...isActive(programRoutes.indexCreatedExams())}
                    as={Link}
                    onClick={closeMenu}
                    className="d-lg-none m-2 lead"
                    to={programRoutes.indexCreatedExams()}
                  >
                    Созданные тесты
                  </Nav.Link> : ''}
                  {user.permissions.includes('create-exams') ?
                  <Nav.Link
                    {...isActive(programRoutes.createExam())}
                    as={Link}
                    onClick={closeMenu}
                    className="d-lg-none m-2 lead"
                    to={programRoutes.createExam()}
                  >
                    Создать тест
                  </Nav.Link> : ''}
                  <Nav.Link
                    {...isActive(programRoutes.indexParticipatedExams())}
                    as={Link}
                    onClick={closeMenu}
                    className="d-lg-none m-2 lead"
                    to={programRoutes.indexParticipatedExams()}
                  >
                    Пройденные тесты
                  </Nav.Link>
                  <Nav.Link
                    {...isActive(programRoutes.randomExam())}
                    as={Link}
                    onClick={closeMenu}
                    className="d-lg-none m-2 lead"
                    to={programRoutes.randomExam()}
                  >
                    Генерируемые тесты
                  </Nav.Link>
                  <Nav.Link
                    {...isActive(programRoutes.settings())}
                    as={Link}
                    onClick={closeMenu}
                    className="d-lg-none m-2 lead"
                    to={programRoutes.settings()}
                  >
                    Настройки
                  </Nav.Link>
                </>
              )}
            </Nav>
            <Nav>
              {!user && (
                <>
                  <Nav.Link
                    {...isActive(programRoutes.login())}
                    className="m-2 lead"
                    onClick={closeMenu}
                    as={Link}
                    to={programRoutes.login()}
                  >
                    Войти
                  </Nav.Link>
                  <Nav.Link
                    {...isActive(programRoutes.register())}
                    className="m-2 lead"
                    onClick={closeMenu}
                    as={Link}
                    to={programRoutes.register()}
                  >
                    Регистрация
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
