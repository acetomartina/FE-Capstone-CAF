import axios from "axios";
import { useEffect } from "react";

import { useAppDispatch } from "../../app/hooks";
import { tokenService } from "../../services/tokenService";
import { authService } from "./authService";
import {
  impostaAutenticazione,
  sessioneAssente,
} from "./authSlice";

/**
 * Ricostruisce la sessione a ogni avvio dell'applicazione.
 *
 * Il token sopravvive nel browser, lo stato Redux no:
 * senza questo controllo un semplice ricaricamento
 * farebbe perdere la sessione all'utente.
 *
 * I dati dell'utente vengono sempre recuperati dal server,
 * così eventuali modifiche al ruolo o allo stato dell'account
 * vengono recepite al primo caricamento.
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

        dispatch(
          impostaAutenticazione({
            token,
            utente,
          }),
        );
      } catch (errore) {
        if (annullato) {
          return;
        }

        /*
         * Il token viene eliminato soltanto quando il server
         * ci conferma che la sessione non è più autorizzata.
         *
         * Un errore di rete o un 500 non devono cancellare
         * una credenziale che potrebbe essere ancora valida.
         */
        if (
          axios.isAxiosError(errore) &&
          (errore.response?.status === 401 ||
            errore.response?.status === 403)
        ) {
          tokenService.rimuoviToken();
        }

        dispatch(sessioneAssente());
      }
    };

    void ripristina();

    return () => {
      annullato = true;
    };
  }, [dispatch]);
};