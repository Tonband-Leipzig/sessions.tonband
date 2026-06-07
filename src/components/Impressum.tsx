import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Background from './Background';

const Impressum: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-bg-dark text-white overflow-hidden">
      <Background />

      <div className="relative z-10 px-6 max-w-4xl mx-auto py-12">
        <button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 text-neutral-400 hover:text-[#3BAAB8] transition-colors"
        >
          <ArrowLeft size={20} />
          Zurück
        </button>

        <h1 className="text-4xl font-bold mb-8 text-[#3BAAB8]">Impressum</h1>

        <div className="space-y-6 text-neutral-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Angaben gemäß § 5 TMG</h2>
            <p className="mb-2">ton.band Leipzig</p>
            <p className="mb-2">Inhaber: Martin Lach</p>
            <p className="mb-2">Bitterfelder Straße 2a</p>
            <p className="mb-2">04129 Leipzig</p>
            <p className="mb-2">Deutschland</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Kontakt</h2>
            <p className="mb-2">
              E-Mail:{' '}
              <a
                href="mailto:kontakt@tonbandleipzig.de"
                className="text-[#3BAAB8] hover:underline"
              >
                kontakt@tonbandleipzig.de
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG</h2>
            <p>Nicht erforderlich – Anwendung der Kleinunternehmerregelung nach § 19 UStG.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p className="mb-2">Martin Lach</p>
            <p className="mb-2">Bitterfelder Straße 2a</p>
            <p className="mb-2">04129 Leipzig</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">EU-Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3BAAB8] hover:underline ml-1"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              . Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Haftung für Inhalte</h2>
            <p className="mb-3">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen
              Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet,
              übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf
              eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p>
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen
              bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer
              konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese
              Inhalte umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Haftung für Links</h2>
            <p className="mb-3">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
              Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
              Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
            <p>
              Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
              Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche
              Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar.
              Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">Urheberrecht</h2>
            <p className="mb-3">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
              Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
              Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
            <p>
              Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
              Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter
              beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine
              Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden
              von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Impressum;
