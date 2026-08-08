import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import LoginHero from "../../features/auth/components/LoginHero";
import RecuperoPasswordForm from "../../features/auth/components/RecuperoPasswordForm";

import "../../styles/LoginPage/login-layout.css";
import "../../styles/LoginPage/login-hero.css";
import "../../styles/LoginPage/login-form.css";
import "../../styles/PasswordPage/password-page.css";
import "../../styles/LoginPage/login-responsive.css";

const RecuperoPasswordPage = () => {
  return (
    <div className="login-page">
      <main className="login-main">
        <Container fluid className="p-0">
          <Row className="g-0">
            <Col lg={6} className="p-0">
              <LoginHero />
            </Col>

            <Col lg={6} className="login-access">
              <div className="login-access__content">
                <div className="login-access__heading">
                  <h1>Password dimenticata</h1>
                  <p>Recupera l’accesso alla tua area personale.</p>
                </div>

                <p className="login-access__intro">
                  Inserisci l’email con cui sei registrato: ti invieremo un link
                  per reimpostare la password.
                </p>

                <RecuperoPasswordForm />

                <Link to="/login" className="password-back">
                  <FiArrowLeft />
                  Torna all’accesso
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default RecuperoPasswordPage;
