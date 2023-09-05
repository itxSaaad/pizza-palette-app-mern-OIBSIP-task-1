import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import { getUserDetails } from '../redux/asyncThunks/userThunks';

// Import Components
import FeaturedPizzasSection from '../components/ui/Home/FeaturedPizzasSection';
import HowItWorksSection from '../components/ui/Home/HowItWorksSection';
import Jumbotron from '../components/ui/Home/Jumbotron';
import VerficationModal from '../components/ui/Auth/VerficationModal';

function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { userDetails } = user;

  useEffect(() => {
    if (!userDetails) {
      dispatch(getUserDetails({}));
    }

    if (userDetails && !userDetails.isVerified) {
      setModalVisible(true);
    }
  }, [dispatch, userDetails]);

  return (
    <>
      <Jumbotron />
      <FeaturedPizzasSection />
      <HowItWorksSection />
      {modalVisible && (
        <VerficationModal onClose={() => setModalVisible(false)} />
      )}
    </>
  );
}

export default HomeScreen;
