import type {
  CSSProperties,
  ReactNode,
} from "react";

import {
  useState,
} from "react";

import type {
  IconType,
} from "react-icons";

import {
  FiCheck,
} from "react-icons/fi";

import "./ServicePostIt.css";

export interface ServicePostItSide {
  eyebrow: string;
  title: string;
  description?: string | null;
  icon?: IconType;
  checks?: string[];
  extra?: ReactNode;
}

interface ServicePostItProps {
  front: ServicePostItSide;
  back: ServicePostItSide;
  accent?: string;
  accentDark?: string;
  accentSoft?: string;
  ariaLabelFront?: string;
  ariaLabelBack?: string;
}

const ServicePostIt = ({
  front,
  back,
  accent = "#249239",
  accentDark = "#176d2b",
  accentSoft = "#eaf7ed",
  ariaLabelFront = "Mostra il secondo foglio",
  ariaLabelBack = "Torna al primo foglio",
}: ServicePostItProps) => {
  const [postItAperto, setPostItAperto] =
    useState<"front" | "back">("front");

  const style = {
    "--service-accent": accent,
    "--service-accent-dark": accentDark,
    "--service-accent-soft": accentSoft,
    "--service-ink": "#102c65",
  } as CSSProperties;

  const renderChecks = (
    checks?: string[],
  ) => {
    if (!checks || checks.length === 0) {
      return null;
    }

    return (
      <div className="servizio-dettaglio-paper__checks">
        {checks.map((check) => (
          <span key={check}>
            <FiCheck />
            {check}
          </span>
        ))}
      </div>
    );
  };

  const FrontIcon = front.icon;
  const BackIcon = back.icon;

  return (
    <button
      type="button"
      className={`servizio-dettaglio-paper-stack ${
        postItAperto === "back"
          ? "servizio-dettaglio-paper-stack--switched"
          : ""
      }`}
      style={style}
      aria-label={
        postItAperto === "front"
          ? ariaLabelFront
          : ariaLabelBack
      }
      aria-pressed={postItAperto === "back"}
      onClick={() =>
        setPostItAperto((stato) =>
          stato === "front"
            ? "back"
            : "front",
        )
      }
      onMouseEnter={() =>
        setPostItAperto("back")
      }
      onMouseLeave={() =>
        setPostItAperto("front")
      }
    >
      <article className="servizio-dettaglio-paper servizio-dettaglio-paper--back">
        <span className="servizio-dettaglio-paper__pin" />

        {BackIcon && (
          <span className="servizio-dettaglio-paper__icon">
            <BackIcon />
          </span>
        )}

        <small>{back.eyebrow}</small>

        <h2>{back.title}</h2>

        {back.description && (
          <p>{back.description}</p>
        )}

        {renderChecks(back.checks)}

        {back.extra}

        <span className="servizio-dettaglio-paper__hint servizio-dettaglio-paper__hint--desktop">
          Clicca per tornare
        </span>

        <span className="servizio-dettaglio-paper__hint servizio-dettaglio-paper__hint--mobile">
          Tocca per tornare
        </span>
      </article>

      <article className="servizio-dettaglio-paper servizio-dettaglio-paper--main">
        <span className="servizio-dettaglio-paper__pin" />

        {FrontIcon && (
          <span className="servizio-dettaglio-paper__icon">
            <FrontIcon />
          </span>
        )}

        <small>{front.eyebrow}</small>

        <h2>{front.title}</h2>

        {front.description && (
          <p>{front.description}</p>
        )}

        {renderChecks(front.checks)}

        {front.extra}

        <span className="servizio-dettaglio-paper__hint servizio-dettaglio-paper__hint--main servizio-dettaglio-paper__hint--desktop">
          Passa sopra o clicca
        </span>

        <span className="servizio-dettaglio-paper__hint servizio-dettaglio-paper__hint--main servizio-dettaglio-paper__hint--mobile">
          Tocca per scoprire
        </span>
      </article>
    </button>
  );
};

export default ServicePostIt;