import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// Import Constants
import { USER_ROLES } from '../constants';

// Import Thunks
import { listPizzas } from '../redux/asyncThunks/pizzaThunks';
import { getUserDetails } from '../redux/asyncThunks/userThunks';

// Import Components
import VerificationModal from '../components/ui/Auth/VerificationModal';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import Message from '../components/ui/Message';
import PizzaList from '../components/ui/PizzaMenu/PizzaList';

function MenuScreen() {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);

  const user = useSelector((state) => state.user);
  const { userDetails } = user;

  const pizza = useSelector((state) => state.pizza);
  const { loading, pizzaList, pizzaListError } = pizza;

  const cart = useSelector((state) => state.cart);
  const { cartAddItemError } = cart;

  useEffect(() => {
    if (!userDetails) {
      dispatch(getUserDetails({}));
    }
    if (!pizzaList || pizzaList.length < 1) {
      dispatch(listPizzas({}));
    }
  }, [dispatch, userDetails, pizzaList]);

  useEffect(() => {
    if (userDetails && !userDetails.isVerified) {
      setModalVisible(true);
    }
  }, [userDetails]);

  return (
    <>
      <section className="min-h-screen flex flex-col justify-center items-center px-10 sm:px-16 bg-neutral-50">
        {loading ? (
          <Loader />
        ) : pizzaListError || cartAddItemError ? (
          <Message>{pizzaListError || cartAddItemError}</Message>
        ) : pizzaList.length > 0 ? (
          <>
            <div className="w-full flex flex-row items-center justify-between my-4">
              <h1 className="font-display text-h1 text-primary-600">
                Pizza Menu
              </h1>
              {userDetails && (
                <Link to="/custom-pizza">
                  <Button variant="primary" className="rounded-pill font-bold">
                    Create Custom Pizza
                  </Button>
                </Link>
              )}
            </div>
            <PizzaList
              pizzaList={pizzaList.filter(
                (pizza) => pizza.createdBy === USER_ROLES.ADMIN
              )}
            />
          </>
        ) : (
          <div className="font-display text-h2 text-primary-600 text-center max-w-md">
            Our kitchen is between batches right now &mdash; check back soon,
            or try a custom pizza of your own.
          </div>
        )}
      </section>
      {modalVisible && (
        <VerificationModal onClose={() => setModalVisible(false)} />
      )}
    </>
  );
}

export default MenuScreen;
