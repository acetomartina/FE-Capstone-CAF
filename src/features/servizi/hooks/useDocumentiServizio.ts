import { useMemo, useState } from "react";

import { serviziService } from "../api/serviziService";

import {
  creaFormDocumento,
  type FormDocumento,
} from "../form/servizioForm";

import type {
  AggiornaDocumentoServizioRequest,
  CreaDocumentoServizioRequest,
  DocumentoServizio,
} from "../types/serviziTypes";

interface OpzioniDocumentiServizio {
  servizioId: number;

  segnalaErrore: (messaggio: string | null) => void;
  segnalaSuccesso: (messaggio: string | null) => void;
}

export const useDocumentiServizio = ({
  servizioId,
  segnalaErrore,
  segnalaSuccesso,
}: OpzioniDocumentiServizio) => {

  const [documenti, setDocumenti] =
    useState<DocumentoServizio[]>([]);

  const [documentoInModificaId, setDocumentoInModificaId] =
    useState<number | null>(null);

  const [formDocumento, setFormDocumento] =
    useState<FormDocumento | null>(null);

  const [nuovoDocumentoAperto, setNuovoDocumentoAperto] =
    useState(false);

  const [nuovoDocumento, setNuovoDocumento] =
    useState<FormDocumento>({
      etichetta: "",
      suggerimento: "",
      tipoObbligatorieta: "OBBLIGATORIO",
      visibileAlCliente: true,
      ordineVisualizzazione: 1,
    });

  const [operazioneDocumentoId, setOperazioneDocumentoId] =
    useState<number | null>(null);

  const [creazioneDocumento, setCreazioneDocumento] =
    useState(false);

  const documentiOrdinati = useMemo(
    () =>
      [...documenti].sort(
        (a, b) =>
          a.ordineVisualizzazione - b.ordineVisualizzazione,
      ),
    [documenti],
  );

  const documentiAttivi = useMemo(
    () => documenti.filter((documento) => documento.attivo).length,
    [documenti],
  );

  const prossimoOrdineDocumento = useMemo(() => {
    if (documenti.length === 0) {
      return 1;
    }

    return (
      Math.max(
        ...documenti.map(
          (documento) => documento.ordineVisualizzazione,
        ),
      ) + 1
    );
  }, [documenti]);

  const azzeraMessaggi = () => {
    segnalaErrore(null);
    segnalaSuccesso(null);
  };

  const avviaModificaDocumento = (
    documento: DocumentoServizio,
  ) => {
    setDocumentoInModificaId(documento.id);
    setFormDocumento(creaFormDocumento(documento));
    setNuovoDocumentoAperto(false);

    azzeraMessaggi();
  };

  const annullaModificaDocumento = () => {
    setDocumentoInModificaId(null);
    setFormDocumento(null);
  };

  const salvaDocumento = async (documentoId: number) => {
    if (!formDocumento) {
      return;
    }

    if (formDocumento.etichetta.trim() === "") {
      segnalaErrore("Il nome del documento è obbligatorio.");

      return;
    }

    try {
      setOperazioneDocumentoId(documentoId);
      azzeraMessaggi();

      const richiesta: AggiornaDocumentoServizioRequest = {
        etichetta: formDocumento.etichetta.trim(),
        suggerimento: formDocumento.suggerimento.trim(),
        tipoObbligatorieta: formDocumento.tipoObbligatorieta,
        visibileAlCliente: formDocumento.visibileAlCliente,
        ordineVisualizzazione: formDocumento.ordineVisualizzazione,
      };

      const aggiornato =
        await serviziService.aggiornaDocumento(
          documentoId,
          richiesta,
        );

      setDocumenti((correnti) =>
        correnti.map((documento) =>
          documento.id === aggiornato.id ? aggiornato : documento,
        ),
      );

      setDocumentoInModificaId(null);
      setFormDocumento(null);

      segnalaSuccesso("Documento aggiornato correttamente.");
    } catch {
      segnalaErrore(
        "Non è stato possibile aggiornare il documento.",
      );
    } finally {
      setOperazioneDocumentoId(null);
    }
  };

  const apriNuovoDocumento = () => {
    setNuovoDocumento({
      etichetta: "",
      suggerimento: "",
      tipoObbligatorieta: "OBBLIGATORIO",
      visibileAlCliente: true,
      ordineVisualizzazione: prossimoOrdineDocumento,
    });

    setDocumentoInModificaId(null);
    setFormDocumento(null);
    setNuovoDocumentoAperto(true);

    azzeraMessaggi();
  };

  const creaDocumento = async () => {
    if (nuovoDocumento.etichetta.trim() === "") {
      segnalaErrore("Il nome del documento è obbligatorio.");

      return;
    }

    try {
      setCreazioneDocumento(true);
      azzeraMessaggi();

      const richiesta: CreaDocumentoServizioRequest = {
        etichetta: nuovoDocumento.etichetta.trim(),
        suggerimento: nuovoDocumento.suggerimento.trim(),
        tipoObbligatorieta: nuovoDocumento.tipoObbligatorieta,
        visibileAlCliente: nuovoDocumento.visibileAlCliente,
        ordineVisualizzazione: nuovoDocumento.ordineVisualizzazione,
      };

      const creato =
        await serviziService.creaDocumento(servizioId, richiesta);

      setDocumenti((correnti) => [...correnti, creato]);
      setNuovoDocumentoAperto(false);

      segnalaSuccesso("Documento aggiunto correttamente.");
    } catch {
      segnalaErrore(
        "Non è stato possibile aggiungere il documento.",
      );
    } finally {
      setCreazioneDocumento(false);
    }
  };

  const cambiaAttivazioneDocumento = async (
    documento: DocumentoServizio,
  ) => {
    try {
      setOperazioneDocumentoId(documento.id);
      azzeraMessaggi();

      if (documento.attivo) {
        await serviziService.disattivaDocumento(documento.id);

        setDocumenti((correnti) =>
          correnti.map((corrente) =>
            corrente.id === documento.id
              ? { ...corrente, attivo: false }
              : corrente,
          ),
        );

        segnalaSuccesso("Documento disattivato.");

        return;
      }

      const aggiornato =
        await serviziService.aggiornaDocumento(documento.id, {
          attivo: true,
        });

      setDocumenti((correnti) =>
        correnti.map((corrente) =>
          corrente.id === aggiornato.id ? aggiornato : corrente,
        ),
      );

      segnalaSuccesso("Documento riattivato.");
    } catch {
      segnalaErrore(
        "Non è stato possibile modificare lo stato del documento.",
      );
    } finally {
      setOperazioneDocumentoId(null);
    }
  };

  return {
    documenti,

    impostaDocumenti: setDocumenti,

    documentiOrdinati,
    documentiAttivi,
    prossimoOrdineDocumento,

    documentoInModificaId,
    formDocumento,
    setFormDocumento,

    nuovoDocumentoAperto,
    setNuovoDocumentoAperto,
    nuovoDocumento,
    setNuovoDocumento,

    operazioneDocumentoId,
    creazioneDocumento,

    avviaModificaDocumento,
    annullaModificaDocumento,
    salvaDocumento,
    apriNuovoDocumento,
    creaDocumento,
    cambiaAttivazioneDocumento,
  };
};
