import { Container, Row, Col } from "react-bootstrap";
// import { BsInstagram, BsTelegram, BsTwitter, BsLinkedin } from "react-icons/bs";
// import externalRoutes from "../../../constants/external-routes.constant";
import "./icons.style.css";

const Footer = () => {
  return (
    <footer>
      <Container
        id="footer"
        data-testid="footer"
        fluid={true}
        className="bg-dark text-muted px-5"
      >
        <Container>
          {
            // <Row>
            //   <Col xs={12}>
            //     <p className="text-center lead">Follow us on social media</p>
            //   </Col>
            //   <Col>
            //     <div className="d-flex justify-content-center">
            //       <div className="mx-3">
            //         <a
            //           href={externalRoutes.socialMedia.twitter()}
            //           className={`rounded-circle text-muted p-2 twitter`}
            //         >
            //           <BsTwitter />
            //         </a>
            //       </div>
            //       <div className="mx-3">
            //         <a
            //           href={externalRoutes.socialMedia.instagram()}
            //           className={`rounded-circle text-muted p-2 instagram`}
            //         >
            //           <BsInstagram />
            //         </a>
            //       </div>
            //       <div className="mx-3">
            //         <a
            //           href={externalRoutes.socialMedia.telegram()}
            //           className={`rounded-circle text-muted p-2 telegram`}
            //         >
            //           <BsTelegram />
            //         </a>
            //       </div>
            //         <div className="mx-3">
            //           <a
            //             href={externalRoutes.socialMedia.linkedin()}
            //             className={`rounded-circle text-muted p-2 linkedin`}
            //           >
            //             <BsLinkedin />
            //           </a>
            //         </div>
            //     </div>
            //   </Col>
            // </Row>
          }
          <Row>
            <Col className="d-flex flex-column align-items-center pt-4">
              <p className="font-monospace">© 2023 FizMat</p>
              <p>All Rights Reserved</p>
            </Col>
          </Row>
        </Container>
      </Container>
    </footer>
  );
};

export default Footer;
