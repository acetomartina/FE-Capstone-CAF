export {
  caricaPratiche,
  caricaPraticaPerId,
  pulisciPraticaSelezionata,
  impostaDimensionePagina,
  pulisciErrorePratiche,
} from "./store/praticheSlice";

export {
  praticheService,
} from "./api/praticheService";

export type {
  Pratica,
  StatoPratica,
  PrioritaPratica,
  UtentePratica,
  ServizioPratica,
  ParametriRicercaPratiche,
  CreaPraticaRequest,
  AggiornaPraticaRequest,
  CambiaStatoPraticaRequest,
} from "./types/praticheTypes";