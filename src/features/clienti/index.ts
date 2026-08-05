export { clientiService } from "./api/clientiService";

export type {
  Cliente,
  ParametriRicercaClienti,
  RispostaPaginata,
} from "./types/clientiTypes";

export {
  caricaClienti,
  caricaClientePerId,
  impostaDimensionePagina,
  pulisciClienteSelezionato,
} from "./store/clientiSlice";

export { default as clientiReducer } from "./store/clientiSlice";