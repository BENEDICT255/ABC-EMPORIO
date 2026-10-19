import { eventConfig } from './config/event';
import { getRegistrationState } from './lib/schedule';
import { useReveal } from './lib/useReveal';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { EventDetails } from './components/EventDetails';
import { RSVPForm } from './components/RSVPForm';
import { Closing } from './components/Closing';

export function App() {
  useReveal();
  const registrationOpen = getRegistrationState(eventConfig) === 'open';

  return (
    <>
      <a href="#details" className="skip-link">Skip to main content</a>
      <Header registrationOpen={registrationOpen} />
      <main id="main-content">
        {/* Page 1: Hero */}
        <Hero registrationOpen={registrationOpen} />
        {/* Page 2: Event Details */}
        <EventDetails />
        {/* Page 3: Reserve Your Place (RSVP Form) */}
        <RSVPForm />
        {/* Page 4: Closing Farewell & Comprehensive Showroom/Brand Info */}
        <Closing />
      </main>
    </>
  );
}
