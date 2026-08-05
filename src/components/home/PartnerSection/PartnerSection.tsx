import {
  FiBox,
  FiBriefcase,
  FiCreditCard,
  FiGlobe,
  FiHome,
  FiMonitor,
  FiPhone,
  FiShield,
  FiTruck,
  FiZap,
} from "react-icons/fi";

import "./PartnerSection.css";

const SERVIZI = [
  {
    nome: "Energia e gas",
    descrizione: "Attivazioni, volture e assistenza sulle utenze.",
    icona: FiZap,
    variante: "green",
  },
  {
    nome: "Telefonia e internet",
    descrizione: "Offerte casa, mobile e connettività.",
    icona: FiPhone,
    variante: "blue",
  },
  {
    nome: "Assicurazioni",
    descrizione: "Supporto nella scelta delle principali coperture.",
    icona: FiShield,
    variante: "fuchsia",
  },
  {
    nome: "Noleggio auto",
    descrizione: "Soluzioni di mobilità per privati e aziende.",
    icona: FiBriefcase,
    variante: "orange",
  },
  {
    nome: "Spedizioni e ritiri",
    descrizione: "Punti di ritiro, invii e servizi logistici.",
    icona: FiTruck,
    variante: "blue",
  },
  {
    nome: "Amazon Hub",
    descrizione: "Ritiro e gestione delle consegne presso la sede.",
    icona: FiBox,
    variante: "green",
  },
  {
    nome: "Servizi finanziari",
    descrizione: "Prestiti, mutui e cessione del quinto.",
    icona: FiCreditCard,
    variante: "fuchsia",
  },
  {
    nome: "FNT – Facciamo Tutto Noi",
    descrizione: "Una rete di servizi integrati per cittadini e imprese.",
    icona: FiHome,
    variante: "orange",
  },
  {
    nome: "martina.dstudio",
    descrizione: "Siti web, gestionali e servizi digitali su misura.",
    icona: FiMonitor,
    variante: "petrol",
  },
  {
    nome: "Servizi online",
    descrizione: "Supporto digitale e assistenza anche da remoto.",
    icona: FiGlobe,
    variante: "blue",
  },
];

const PartnersSection = () => {
  const elementiDuplicati = [...SERVIZI, ...SERVIZI];

  return (
    <section className="partners-section" aria-labelledby="partners-title">
      <div className="partners-section__container">
        <div className="partners-section__heading">
          <span className="partners-section__eyebrow">
            Centro multiservizi
          </span>

          <h2 id="partners-title" className="partners-section__title">
            Una rete di servizi.
            <span> Un unico sportello.</span>
          </h2>

          <p className="partners-section__description">
            Dalle utenze alla logistica, dai servizi finanziari alle soluzioni
            digitali: presso la sede trovi assistenza per tante esigenze
            quotidiane.
          </p>
        </div>

        <div className="partners-marquee">
          <div className="partners-marquee__fade partners-marquee__fade--left" />

          <div className="partners-marquee__viewport">
            <div className="partners-marquee__track">
              {elementiDuplicati.map((servizio, indice) => {
                const Icona = servizio.icona;

                return (
                  <article
                    key={`${servizio.nome}-${indice}`}
                    className={`partners-card partners-card--${servizio.variante}`}
                    aria-hidden={indice >= SERVIZI.length}
                  >
                    <span className="partners-card__icon">
                      <Icona aria-hidden="true" />
                    </span>

                    <div>
                      <h3>{servizio.nome}</h3>
                      <p>{servizio.descrizione}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="partners-marquee__fade partners-marquee__fade--right" />
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;