import type {
  PrioritaPratica,
  StatoPratica,
  UtentePratica,
} from "../../pratiche/types/praticheTypes";

export type Sottopratica = {
  id: number;
  praticaId: number;
  numeroPratica: string;
  titolo: string;
  descrizione: string | null;
  operatoreAssegnato: UtentePratica | null;
  stato: StatoPratica;
  priorita: PrioritaPratica;
  dataScadenza: string | null;
  dataChiusura: string | null;
  note: string | null;
  creatoIl: string;
  aggiornatoIl: string;
};

export type RispostaPaginataSottopratiche = {
  content: Sottopratica[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};
