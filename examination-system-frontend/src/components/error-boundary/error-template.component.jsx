import "./error-template.styles.css";
import { Link } from "react-router-dom";
// import { BsInstagram, BsTelegram, BsTwitter, BsLinkedin } from "react-icons/bs";
import programRoutes from "../../constants/program-routes.constant";
import externalRoutes from "../../constants/external-routes.constant";

const ErrorTemplate = ({ status, message, phrase }) => {
  return (
    <div id="notfound">
      <div className="notfound-bg">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="notfound">
        <div className="notfound-404">{status && <h1>{status}</h1>}</div>
        <h2>{message ? message : "Ошибка"}</h2>
        <p>
          {phrase
            ? phrase
            : "Произошла ошибка. При дальнейшем столкновении с ошибкой, пожалуйста, свжитесь с нами"}
        </p>
        <Link to={programRoutes.profile}>Главная страница</Link>
        <div className="notfound-social">
          {
            // <a href={externalRoutes.socialMedia.linkedin()}>
            //   <BsLinkedin />
            // </a>
            // <a href={externalRoutes.socialMedia.twitter()}>
            //   <BsTwitter />
            // </a>
            // <a href={externalRoutes.socialMedia.instagram()}>
            //   <BsInstagram />
            // </a>
            // <a href={externalRoutes.socialMedia.telegram()}>
            //   <BsTelegram />
            // </a>
          }
        </div>
      </div>
    </div>
  );
};

export default ErrorTemplate;
