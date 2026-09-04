import axios from "axios";
import { useEffect } from "react";

import { useAppDispatch } from "../../app/hooks";
import { tokenService } from "../../services/tokenService";

import { authService } from "./authService";

import {
  impostaAutenticazione,
  sessioneAssente,
} from "./authSlice";

export const useRipristinoSessione = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token =
      tokenService.recuperaToken();

    if (!token) {
      dispatch(sessioneAssente());

      return;
    }

    let annullato = false;

    const ripristina = async () => {
      try {
        const utente =
          await authService.me();

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

        if (
          axios.isAxiosError(errore) &&
          errore.response?.status === 401
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