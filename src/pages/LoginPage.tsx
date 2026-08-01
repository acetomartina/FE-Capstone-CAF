import { Col, Container, Row } from "react-bootstrap";

import LoginContactCard from "../features/auth/components/LoginContactCard";
import LoginForm from "../features/auth/components/LoginForm";
import LoginHero from "../features/auth/components/LoginHero";

import "../styles/LoginPage/login-layout.css";
import "../styles/LoginPage/login-hero.css";
import "../styles/LoginPage/login-form.css";
import "../styles/LoginPage/login-contact.css";
import "../styles/LoginPage/login-responsive.css";

const LoginPage = () => {
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
                  <h1>Bentornato</h1>
                  <p>Accedi alla tua area personale.</p>
                </div>

                <p className="login-access__intro">
                  Accedi con le credenziali fornite dal CAF FAPI Pianopoli.
                </p>

                <LoginForm />

                <LoginContactCard />
              </div>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default LoginPage;
