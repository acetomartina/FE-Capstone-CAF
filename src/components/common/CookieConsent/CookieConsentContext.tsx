import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

type CookieConsentValue =
  | "accepted"
  | "rejected"
  | null;

interface CookieConsentContextValue {
  consent: CookieConsentValue;
  hasAnswered: boolean;
  acceptCookies: () => void;
  rejectCookies: () => void;
  resetConsent: () => void;
}

interface CookieConsentProviderProps {
  children: ReactNode;
}

const STORAGE_KEY =
  "caf-fapi-cookie-consent";

const CookieConsentContext =
  createContext<
    CookieConsentContextValue | undefined
  >(undefined);

export const CookieConsentProvider = ({
  children,
}: CookieConsentProviderProps) => {
  const [
    consent,
    setConsent,
  ] = useState<CookieConsentValue>(
    null,
  );

  useEffect(() => {
    const storedConsent =
      window.localStorage.getItem(
        STORAGE_KEY,
      );

    if (
      storedConsent === "accepted" ||
      storedConsent === "rejected"
    ) {
      setConsent(storedConsent);
    }
  }, []);

  const saveConsent = (
    value: Exclude<
      CookieConsentValue,
      null
    >,
  ) => {
    window.localStorage.setItem(
      STORAGE_KEY,
      value,
    );

    setConsent(value);
  };

  const acceptCookies = () => {
    saveConsent("accepted");
  };

  const rejectCookies = () => {
    saveConsent("rejected");
  };

  const resetConsent = () => {
    window.localStorage.removeItem(
      STORAGE_KEY,
    );

    setConsent(null);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hasAnswered:
          consent !== null,
        acceptCookies,
        rejectCookies,
        resetConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context =
    useContext(
      CookieConsentContext,
    );

  if (!context) {
    throw new Error(
      "useCookieConsent deve essere usato dentro CookieConsentProvider",
    );
  }

  return context;
};