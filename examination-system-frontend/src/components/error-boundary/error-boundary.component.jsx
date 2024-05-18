import React from "react";
import ErrorTemplate from "./error-template.component";

export default class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {}

  componentDidCatch(error) {
    const errorStatus = error?.response?.status;
    const errorMessage = error?.response?.statusText;
    this.props.changeError({
      status: errorStatus,
      message: errorMessage,
      route: this.props.route,
    });
    // Log or store the error
  }

  render() {
    const { status, message, phrase } = this.props.error || {};
    return this.props.error ? (
      <ErrorTemplate status={status} message={message} phrase={phrase} />
    ) : (
      this.props.children
    );
  }
}
