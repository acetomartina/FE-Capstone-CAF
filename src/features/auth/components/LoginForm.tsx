import { useState, type FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
} from "react-icons/fi";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostraPassword, setMostraPassword] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log({
      email,
      password,
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <Form.Group className="login-form__group" controlId="email">
        <Form.Label>Email</Form.Label>

        <div className="login-form__field">
          <FiMail />

          <Form.Control
            type="email"
            placeholder="nome@email.it"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </div>
      </Form.Group>

      <Form.Group className="login-form__group" controlId="password">
        <div className="login-form__label-row">
          <Form.Label>Password</Form.Label>

          <Link to="/recupera-password" className="login-form__forgot">
            Password dimenticata?
          </Link>
        </div>

        <div className="login-form__field">
          <FiLock />

          <Form.Control
            type={mostraPassword ? "text" : "password"}
            placeholder="Inserisci la password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          <button
            type="button"
            className="login-form__password-toggle"
            onClick={() => setMostraPassword((valore) => !valore)}
            aria-label={
              mostraPassword
                ? "Nascondi la password"
                : "Mostra la password"
            }
          >
            {mostraPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </Form.Group>

      <Button type="submit" className="login-form__submit">
        <span>Accedi</span>
        <FiArrowRight />
      </Button>
    </Form>
  );
};

export default LoginForm;