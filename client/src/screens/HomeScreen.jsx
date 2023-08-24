import FeaturedPizzasSection from '../components/ui/Home/FeaturedPizzasSection';
import HowItWorksSection from '../components/ui/Home/HowItWorksSection';
import Jumbotron from '../components/ui/Home/Jumbotron';

function HomeScreen() {
  return (
    <>
      <Jumbotron />
      <FeaturedPizzasSection />
      <HowItWorksSection />
    </>
  );
}

export default HomeScreen;
