import { useContext } from "react";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/layout/layout.component";
import AppRouter from "./app.router";
import { AuthenticationContext } from "./contexts/authentication-context/authentication.context";

function App() {
  const { isAuthLoaded } = useContext(AuthenticationContext);

  if (!isAuthLoaded) {
    return <p> Загрузка... </p>;
  }
  return (
    <Layout>
      <HelmetProvider>
        <AppRouter />
      </HelmetProvider>
    </Layout>
  );
}

export default App;
