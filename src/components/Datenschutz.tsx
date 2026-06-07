import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Background from './Background';

const Datenschutz: React.FC = () => {
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

        <h1 className="text-4xl font-bold mb-8 text-[#3BAAB8]">Datenschutzerklärung</h1>

        <div className="space-y-6 text-neutral-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Datenschutz auf einen Blick</h2>
            <h3 className="text-xl font-medium mb-3 text-white">Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert,
              wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert
              werden können.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-medium mb-3 text-white">Datenerfassung auf dieser Website</h3>
            <h4 className="text-lg font-medium mb-2 text-white">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h4>
            <p>
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie
              dem Impressum dieser Website entnehmen.
            </p>
          </section>

          <section>
            <h4 className="text-lg font-medium mb-2 text-white">Wie erfassen wir Ihre Daten?</h4>
            <p className="mb-3">
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. um Daten
              handeln, die Sie in ein Kontaktformular eingeben.
            </p>
            <p>
              Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme
              erfasst. Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
            </p>
          </section>

          <section>
            <h4 className="text-lg font-medium mb-2 text-white">Wofür nutzen wir Ihre Daten?</h4>
            <p>
              Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten
              können zur Analyse Ihres Nutzerverhaltens verwendet werden.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Hosting und Content Delivery Networks (CDN)</h2>
            <h3 className="text-xl font-medium mb-3 text-white">Externes Hosting</h3>
            <p>
              Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, die auf
              dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Allgemeine Hinweise und Pflichtinformationen</h2>
            <h3 className="text-xl font-medium mb-3 text-white">Datenschutz</h3>
            <p>
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre
              personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser
              Datenschutzerklärung.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-medium mb-3 text-white">Hinweis zur verantwortlichen Stelle</h3>
            <p>
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist im Impressum angegeben.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-medium mb-3 text-white">Speicherdauer</h3>
            <p>
              Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre
              personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-medium mb-3 text-white">Ihre Rechte</h3>
            <p className="mb-3">
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten
              personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten
              zu verlangen.
            </p>
            <p>
              Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für
              die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der
              Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Datenschutz;
