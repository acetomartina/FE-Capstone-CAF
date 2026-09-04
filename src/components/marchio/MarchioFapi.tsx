import "./MarchioFapi.css";

interface MarchioFapiProps {

  variante?: "navbar" | "hero";
  mostraSede?: boolean;
}

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
