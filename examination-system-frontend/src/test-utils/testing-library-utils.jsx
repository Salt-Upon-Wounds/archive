import { render } from "@testing-library/react";
import {
  AuthenticationProvider,
  AuthenticationContext,
} from "../contexts/authentication-context/authentication.context";
import { BrowserRouter as Router } from "react-router-dom";
import { NotificationProvider } from "../contexts/notification-context/notification.context";
import { MemoryRouter } from "react-router-dom";
import { userMock } from "../mocks/mocks/authentication.mock";

const wrapper = ({ children }) => {
  return (
    <Router>
      <NotificationProvider>
        <AuthenticationProvider>{children}</AuthenticationProvider>
      </NotificationProvider>
    </Router>
  );
};

const renderWithContext = (ui, options) =>
  render(ui, { wrapper: wrapper, ...options });

export const renderWithRouter = (
  ui,
  { route = "/", withContexts = false, singleWrapper = "memory" } = {}
) => {
  window.history.pushState({}, "Test page", route);

  return render(ui, {
    wrapper: withContexts
      ? wrapper
      : singleWrapper === "memory"
      ? MemoryRouter
      : Router,
  });
};

export const renderWithAuthentication = (
  ui,
  { route = "/", authenticationProviderProps = {} } = {}
) => {
  window.history.pushState({}, "Test page", route);

  const authenticatedUserWrapper = ({ children }) => {
    return (
      <Router>
        <NotificationProvider>
          <AuthenticationContext.Provider
            value={{
              user: userMock.data.user,
              isAuthLoaded: true,
              login: jest.fn(),
              register: jest.fn(),
              errors: {},
              isLoading: false,
              popover: "",
              changePopover: jest.fn(),
              resetErrors: jest.fn(),
              token: userMock.data.token,
              isUserAuthenticated: true,
              showUserLoginPopover: jest.fn(),
              redirectIfNotAuthenticated: jest.fn(),
              logout: jest.fn(),
              removeUserInfo: jest.fn(),
              ...authenticationProviderProps,
            }}
          >
            {children}
          </AuthenticationContext.Provider>
        </NotificationProvider>
      </Router>
    );
  };

  return render(ui, { wrapper: authenticatedUserWrapper });
};

export * from "@testing-library/react";

export { renderWithContext as render };
