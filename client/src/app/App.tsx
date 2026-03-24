
import Navbar from '../components/layout/Navbar';
import Hero from '../features/hero/Hero';
import Map from '../features/map/Map';
import Rsvp from '../features/rsvpForm/Rsvp';

const App = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Map />
      <Rsvp />

    </div>
  )
}

export default App