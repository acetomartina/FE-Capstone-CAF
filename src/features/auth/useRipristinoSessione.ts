import { useEffect } from "react";

import { useAppDispatch } from "../../app/hooks";
import { tokenService } from "../../services/tokenService";
import { authService } from "./authService";
import { impostaAutenticazione, sessioneAssente } from "./authSlice";

/**
 * Ricostruisce la sessione a ogni avvio dell'applicazione.
 * <p>
 * Il token sopravvive nel browser, lo stato Redux no: senza questo, un
 * semplice ricaricamento butterebbe fuori chi ha credenziali valide.
 * <p>
 * I dati dell'utente arrivano dal server e non dal browser: se nel
 * frattempo qualcuno e' stato disattivato o gli e' cambiato il ruolo, il
 * primo ricaricamento se ne accorge.
 */
export const useRipristinoSessione = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = tokenService.recuperaToken();

    if (!token) {
      dispatch(sessioneAssente());

      return;
    }

    let annullato = false;

    const ripristina = async () => {
      try {
        const utente = await authService.me();

        if (annullato) {
          return;
        }

        dispatch(impostaAutenticazione({ token, utente }));
      } catch {
        if (annullato) {
          return;
        }

        /* Token scaduto, revocato o server irraggiungibile: in tutti i
           casi non possiamo dire chi sia, quindi lo buttiamo via invece
           di tenerci una credenziale che non funziona. */
        tokenService.rimuoviToken();

        dispatch(sessioneAssente());
      }
    };

    void ripristina();

    return () => {
      annullato = true;
    };
  }, [dispatch]);
};
