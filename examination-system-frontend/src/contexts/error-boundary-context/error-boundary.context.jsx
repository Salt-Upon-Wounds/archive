import { createContext, useState } from "react";
import { useLocation } from "react-router-dom";
import ErrorBoundary from "../../components/error-boundary/error-boundary.component";
import { createPath, getParams } from "../../utilities/url.utility";

export const ErrorBoundaryContext = createContext();

export const ErrorBoundaryProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const location = useLocation();
  const changeError = (newError) => setError(newError);

  const value = {
    error,
    changeError,
  };

  if (
    error &&
    createPath({
      pathName: location.pathname,
      params: getParams({ url: location.search }),
    }) !== error.route
  ) {
    setError(null);
  }

  return (
    <ErrorBoundaryContext.Provider value={value}>
      <ErrorBoundary
        error={error}
        route={createPath({
          pathName: location.pathname,
          params: getParams({ url: location.search }),
        })}
        changeError={changeError}
      >
        {children}
      </ErrorBoundary>
    </ErrorBoundaryContext.Provider>
  );
};
