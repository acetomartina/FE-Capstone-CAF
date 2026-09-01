export interface ConfigurazioneTesseramento {
  quotaAnnuale: number | null;
  aggiornatoIl: string | null;
}

export interface AggiornaConfigurazioneTesseramentoRequest {
  quotaAnnuale: number;
}