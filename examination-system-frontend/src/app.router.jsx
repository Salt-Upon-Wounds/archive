import { useContext } from "react";
import { Switch, Redirect, Route, useLocation } from "react-router-dom";
import MainRouter from "./main.router";
import { ErrorBoundaryProvider } from "./contexts/error-boundary-context/error-boundary.context";
import { MetaTagsProvider } from "./contexts/meta-tags-context/meta-tags.context";
import { AuthenticationContext } from "./contexts/authentication-context/authentication.context";
import programRoutes from "./constants/program-routes.constant";
import LoginPage from "./pages/login/login.page";
import RegisterPage from "./pages/register/register.page";
import { getParams, createPath } from "./utilities/url.utility";

const AppRouter = () => {
  const { isAuthLoaded, isUserAuthenticated, isLoggedOut } = useContext(
    AuthenticationContext
  );
  const location = useLocation();

  if (!isAuthLoaded) {
    return <p> Загрузка... </p>;
  }
  if (
    !isUserAuthenticated &&
    location.pathname !== programRoutes.redirectUnAuthenticated() &&
    location.pathname !== programRoutes.login() &&
    location.pathname !== programRoutes.register()
  ) {
    return (
      <Redirect
        to={`${programRoutes.redirectUnAuthenticated()}${
          isLoggedOut
            ? ""
            : `?redirect=${encodeURIComponent(
                createPath({
                  pathName: location.pathname,
                  params: getParams({ url: location.search }),
                })
              )}`
        }`}
      />
    );
  }
  return (
    <ErrorBoundaryProvider>
      <MetaTagsProvider>
        <div style={{ minHeight: "100vh" }} className="d-flex flex-column">
          <Switch>
            <Route path={programRoutes.login()} component={LoginPage} />
            <Route path={programRoutes.register()} component={RegisterPage} />
            <Route path="*" component={MainRouter} />
          </Switch>
        </div>
      </MetaTagsProvider>
    </ErrorBoundaryProvider>
  );
};

export default AppRouter;
