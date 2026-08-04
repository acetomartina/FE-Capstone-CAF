import "./MarchioFapi.css";

interface MarchioFapiProps {
  /** `navbar` sta in barra, `hero` nei pannelli grandi. */
  variante?: "navbar" | "hero";
  mostraSede?: boolean;
}

/**
 * Marchio composto: simbolo "F" piu' la sigla FAPI.
 * <p>
 * Non e' un'immagine ma testo e forme: resta nitido a ogni dimensione e mette
 * in evidenza la sigla, cosa che il logo ricalcato non riesce a fare sotto i
 * 400px. Il logo ufficiale resta per footer, documenti e stampa.
 */
const MarchioFapi = ({
  variante = "navbar",
  mostraSede = true,
}: MarchioFapiProps) => {
  return (
    <span className={`marchio marchio--${variante}`}>
      <span className="marchio__simbolo" aria-hidden="true">
        F
      </span>

      <span className="marchio__testo">
        <strong className="marchio__nome">FAPI</strong>

        {mostraSede && (
          <span className="marchio__sede">SEDE DI PIANOPOLI</span>
        )}
      </span>
    </span>
  );
};

export default MarchioFapi;
