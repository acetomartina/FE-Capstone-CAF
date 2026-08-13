import type { ReactNode } from "react";
import { FiBell } from "react-icons/fi";

import "./PrivatePageHeader.css";

interface PrivatePageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

const PrivatePageHeader = ({
  eyebrow,
  title,
  description,
  action,
}: PrivatePageHeaderProps) => {
  return (
    <header className="private-page-header">
      <div className="private-page-header__content">
        <span className="private-page-header__eyebrow">
          {eyebrow}
        </span>

        <h1>{title}</h1>

        {description && (
          <p>{description}</p>
        )}
      </div>

      <div className="private-page-header__actions">
        {action}

        <button
          type="button"
          className="private-page-header__notification"
          aria-label="Notifiche"
        >
          <FiBell />

          <span className="private-page-header__notification-dot" />
        </button>
      </div>
    </header>
  );
};

export default PrivatePageHeader;