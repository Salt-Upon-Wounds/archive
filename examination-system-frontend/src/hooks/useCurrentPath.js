import { useCallback } from "react";
import { useLocation, matchPath } from "react-router-dom";

const useCurrentPath = () => {
  const location = useLocation();

  return useCallback(
    (expected) => {
      return !!matchPath(location.pathname, {
        path: expected,
        exact: true,
      });
    },
    [location]
  );
};

export default useCurrentPath;
