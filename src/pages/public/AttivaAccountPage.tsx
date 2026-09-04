import { Col, Container, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import LoginHero from "../../features/auth/components/LoginHero";
import ResetPasswordForm from "../../features/auth/components/ResetPasswordForm";

import "../../styles/LoginPage/login-layout.css";
import "../../styles/LoginPage/login-hero.css";
import "../../styles/LoginPage/login-form.css";
import "../../styles/PasswordPage/password-page.css";
import "../../styles/LoginPage/login-responsive.css";

const AttivaAccountPage = () => {
  const { token } = useParams<{ token: string }>();

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
                  <h1>Attiva il tuo account</h1>
                  <p>Scegli la password della tua Area Cliente.</p>
                </div>

                <p className="login-access__intro">
                  Imposta la password che userai per accedere e ripetila
                  per conferma.
                </p>

                <ResetPasswordForm
                  token={token}
                  modalita="attivazione"
                />

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

export default AttivaAccountPage;
