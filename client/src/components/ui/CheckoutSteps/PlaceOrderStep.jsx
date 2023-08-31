import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// Import Components
import Button from '../Button';

function PlaceOrderStep({ setCurrentStep }) {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod, cartItems } = cart;

  const orderSummary = [
    {
      name: 'Items Price',
      value:
        cartItems &&
        cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    },
    {
      name: 'Delivery Charges',
      value:
        cartItems &&
        cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) >
          100
          ? 0
          : 10,
    },
    {
      name: 'Sales Tax',
      value:
        cartItems &&
        Number(
          (
            0.15 *
            cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
          ).toFixed(2)
        ),
    },
    {
      name: 'Total',
      value:
        cartItems &&
        Number(
          (
            cartItems.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            ) +
            (cartItems.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            ) > 100
              ? 0
              : 10) +
            Number(
              (
                0.15 *
                cartItems.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0
                )
              ).toFixed(2)
            )
          ).toFixed(2)
        ),
    },
  ];

  const handlePlaceOrder = () => {
    setCurrentStep('Shipping');
  };
  return (
    <div className="flex flex-col justify-between items-center mb-4">
      <h1 className="text-center text-black text-xl leading-relaxed">
        Place Order
      </h1>
      <div className="w-full flex flex-col items-center border border-orange-300 rounded-2xl p-4 mt-2 space-y-4 md:flex-row md:space-y-0 md:space-x-6">
        {cartItems ? (
          <>
            <div className="flex flex-col items-start justify-between w-full md:w-2/3">
              <div className="flex flex-col items-start justify-between w-full py-2">
                <h2 className="text-center text-black text-xl leading-relaxed">
                  Shipping Address
                </h2>

                <p className="text-orange-500 text-md leading-relaxed">
                  <span className="text-black text-md leading-relaxed mr-2">
                    Address:
                  </span>
                  {shippingAddress.address}, {shippingAddress.city},{' '}
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
              </div>
              <div className="flex flex-col items-start justify-between w-full md:w-2/3 border-y border-y-orange-300 py-2">
                <h2 className="text-center text-black text-xl leading-relaxed">
                  Payment Method
                </h2>
                <p className="text-orange-500 text-md leading-relaxed">
                  <span className="text-black text-md leading-relaxed mr-2">
                    Method:
                  </span>
                  {paymentMethod}
                </p>
              </div>
              <div className="flex flex-col items-start justify-between w-full md:2/3 py-2 ">
                <h2 className="text-center text-black text-xl leading-relaxed">
                  Order Items
                </h2>

                <div className="flex flex-col items-start justify-between w-full space-y-2">
                  {cartItems.map((item) => (
                    <div
                      key={item.name}
                      className="flex flex-col sm:flex-row items-center justify-between w-full space-x-5 border-b border-orange-300 py-2"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-2xl"
                      />
                      <div className="flex flex-col sm:flex-row items-start justify-between w-full">
                        <p className="text-orange-500 text-md leading-relaxed">
                          {item.name}
                        </p>

                        <p className="text-black text-md leading-relaxed">
                          {item.quantity} x ${item.price}= $
                          {item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between border-2 border-orange-300 rounded-2xl p-4 sm:w-1/3">
              <h2 className="text-center text-black text-xl leading-relaxed">
                Order Summary
              </h2>
              <div className="w-full flex flex-col items-center justify-between my-2 space-y-1">
                {orderSummary.map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-row items-center justify-between w-full border-t border-orange-300"
                  >
                    <p className="text-black text-md leading-relaxed">
                      {item.name}
                    </p>
                    <p className="text-black text-md leading-relaxed">
                      ${item.value}
                    </p>
                  </div>
                ))}
              </div>
              <Button
                variant="primary"
                onClick={handlePlaceOrder}
                className="w-full rounded-full"
              >
                Place Order
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            <p className="text-center text-orange-500 text-xl leading-relaxed">
              Can&apos;t Place Order Without Order Items
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

PlaceOrderStep.propTypes = {
  setCurrentStep: PropTypes.func.isRequired,
};

export default PlaceOrderStep;
