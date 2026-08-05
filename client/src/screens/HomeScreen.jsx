import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Thunks
import { getUserDetails } from '../redux/asyncThunks/userThunks';

// Import Components
import FeaturedPizzasSection from '../components/ui/Home/FeaturedPizzasSection';
import HowItWorksSection from '../components/ui/Home/HowItWorksSection';
import Jumbotron from '../components/ui/Home/Jumbotron';
import VerificationModal from '../components/ui/Auth/VerificationModal';

function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const { userInfo, userDetails } = user;

  useEffect(() => {
    // Guests have no userInfo/token — fetching a profile would just throw
    // trying to read userInfo.token, so only fetch when actually logged in.
    if (!userInfo) return;

    if (!userDetails) {
      dispatch(getUserDetails({}));
    }

    if (userDetails && !userDetails.isVerified) {
      setModalVisible(true);
    }
  }, [dispatch, userInfo, userDetails]);

  return (
    <>
      <Jumbotron />
      <FeaturedPizzasSection />
      <HowItWorksSection />
      {modalVisible && <VerificationModal onClose={() => setModalVisible(false)} />}
    </>
  );
}

export default HomeScreen;
