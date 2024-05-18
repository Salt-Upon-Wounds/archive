import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthenticationProvider } from "./contexts/authentication-context/authentication.context";
import { NotificationProvider } from "./contexts/notification-context/notification.context";
import { ErrorBoundaryProvider } from "./contexts/error-boundary-context/error-boundary.context";

import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ErrorBoundaryProvider>
        <NotificationProvider>
          <AuthenticationProvider>
            <App />
          </AuthenticationProvider>
        </NotificationProvider>
      </ErrorBoundaryProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
