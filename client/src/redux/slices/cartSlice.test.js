import { describe, it, expect, beforeEach } from 'vitest';
import cartReducer, {
  addToCart,
  createStripeCheckoutSession,
  updateCartItemQuantity,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartData,
} from './cartSlice';

const pizzaA = {
  _id: 'pizza-1',
  name: 'Margherita',
  imageUrl: '/margherita.png',
  basePrice: 10,
  size: 'medium',
  price: 12,
  qty: 1,
};

const pizzaAlarge = {
  ...pizzaA,
  size: 'large',
  price: 15,
};

const pizzaB = {
  _id: 'pizza-2',
  name: 'Pepperoni',
  imageUrl: '/pepperoni.png',
  basePrice: 11,
  size: 'medium',
  price: 13,
  qty: 2,
};

const stateWithItems = (items) => ({
  cartItems: items,
  shippingAddress: {},
  paymentMethod: {},
  stripeSessionId: null,
  stripeCheckoutUrl: null,
  stripeOrderId: null,
  stripeCheckoutError: null,
  cartAddItemError: null,
  cartRemoveItemError: null,
  cartSaveShippingAddressError: null,
  cartSavePaymentMethodError: null,
  cartAddItemSuccess: false,
  cartRemoveItemSuccess: false,
  cartSaveShippingAddressSuccess: false,
  cartSavePaymentMethodSuccess: false,
  loading: false,
});

beforeEach(() => {
  localStorage.clear();
});

describe('cartSlice reducer defaults', () => {
  it('returns an empty cart when localStorage has nothing stored', () => {
    const state = cartReducer(undefined, { type: '@@INIT' });
    expect(state.cartItems).toEqual([]);
    expect(state.shippingAddress).toEqual({});
    expect(state.paymentMethod).toEqual({});
  });
});

describe('updateCartItemQuantity', () => {
  it('sets (does not add to) the quantity of the matching id+size item', () => {
    const initial = stateWithItems([{ ...pizzaA, qty: 1 }]);
    const next = cartReducer(
      initial,
      updateCartItemQuantity({ id: 'pizza-1', size: 'medium', qty: 4 })
    );
    expect(next.cartItems[0].qty).toBe(4);
  });

  it('does not update an item with a different size (size-aware keying)', () => {
    const initial = stateWithItems([{ ...pizzaA, qty: 1 }]);
    const next = cartReducer(
      initial,
      updateCartItemQuantity({ id: 'pizza-1', size: 'large', qty: 4 })
    );
    expect(next.cartItems[0].qty).toBe(1);
  });

  it('ignores quantities below 1 or above 10', () => {
    const initial = stateWithItems([{ ...pizzaA, qty: 3 }]);

    const tooLow = cartReducer(
      initial,
      updateCartItemQuantity({ id: 'pizza-1', size: 'medium', qty: 0 })
    );
    expect(tooLow.cartItems[0].qty).toBe(3);

    const tooHigh = cartReducer(
      initial,
      updateCartItemQuantity({ id: 'pizza-1', size: 'medium', qty: 11 })
    );
    expect(tooHigh.cartItems[0].qty).toBe(3);
  });

  it('persists the updated cart to localStorage', () => {
    const initial = stateWithItems([{ ...pizzaA, qty: 1 }]);
    cartReducer(initial, updateCartItemQuantity({ id: 'pizza-1', size: 'medium', qty: 5 }));
    const stored = JSON.parse(localStorage.getItem('cartItems'));
    expect(stored[0].qty).toBe(5);
  });
});

describe('removeFromCart', () => {
  it('removes only the item matching both id and size', () => {
    const initial = stateWithItems([pizzaA, pizzaAlarge, pizzaB]);
    const next = cartReducer(initial, removeFromCart({ id: 'pizza-1', size: 'medium' }));
    expect(next.cartItems).toEqual([pizzaAlarge, pizzaB]);
  });

  it('persists the removal to localStorage', () => {
    const initial = stateWithItems([pizzaA]);
    cartReducer(initial, removeFromCart({ id: 'pizza-1', size: 'medium' }));
    expect(JSON.parse(localStorage.getItem('cartItems'))).toEqual([]);
  });
});

describe('saveShippingAddress / savePaymentMethod', () => {
  it('stores the shipping address in state and localStorage', () => {
    const initial = stateWithItems([]);
    const address = { address: '123 Main St', city: 'Metropolis' };
    const next = cartReducer(initial, saveShippingAddress(address));
    expect(next.shippingAddress).toEqual(address);
    expect(JSON.parse(localStorage.getItem('shippingAddress'))).toEqual(address);
  });

  it('stores the payment method in state and localStorage', () => {
    const initial = stateWithItems([]);
    const next = cartReducer(initial, savePaymentMethod('Card'));
    expect(next.paymentMethod).toBe('Card');
    expect(JSON.parse(localStorage.getItem('paymentMethod'))).toBe('Card');
  });
});

describe('clearCartData', () => {
  it('resets cart items, shipping address, payment method, and status flags', () => {
    localStorage.setItem('cartItems', JSON.stringify([pizzaA]));
    localStorage.setItem('shippingAddress', JSON.stringify({ address: '123' }));
    localStorage.setItem('paymentMethod', JSON.stringify('Card'));

    const initial = {
      ...stateWithItems([pizzaA]),
      shippingAddress: { address: '123' },
      paymentMethod: 'Card',
      cartAddItemSuccess: true,
      cartAddItemError: 'oops',
    };

    const next = cartReducer(initial, clearCartData());

    expect(next.cartItems).toEqual([]);
    expect(next.shippingAddress).toEqual({});
    expect(next.paymentMethod).toEqual({});
    expect(next.cartAddItemSuccess).toBe(false);
    expect(next.cartAddItemError).toBeNull();
    expect(localStorage.getItem('cartItems')).toBeNull();
    expect(localStorage.getItem('shippingAddress')).toBeNull();
    expect(localStorage.getItem('paymentMethod')).toBeNull();
  });
});

describe('addToCart async thunk reducers', () => {
  it('sets loading on pending', () => {
    const initial = stateWithItems([]);
    const next = cartReducer(initial, { type: addToCart.pending.type });
    expect(next.loading).toBe(true);
    expect(next.cartAddItemError).toBeNull();
    expect(next.cartAddItemSuccess).toBe(false);
  });

  it('adds a new item on fulfilled when it is not already in the cart', () => {
    const initial = stateWithItems([]);
    const next = cartReducer(initial, {
      type: addToCart.fulfilled.type,
      payload: pizzaA,
    });
    expect(next.loading).toBe(false);
    expect(next.cartAddItemSuccess).toBe(true);
    expect(next.cartItems).toEqual([pizzaA]);
  });

  it('increments quantity when the same id+size is added again', () => {
    const initial = stateWithItems([{ ...pizzaA, qty: 2 }]);
    const next = cartReducer(initial, {
      type: addToCart.fulfilled.type,
      payload: { ...pizzaA, qty: 3 },
    });
    expect(next.cartItems).toHaveLength(1);
    expect(next.cartItems[0].qty).toBe(5);
  });

  it('keeps the same pizza with a different size as a separate line item', () => {
    const initial = stateWithItems([{ ...pizzaA, qty: 1 }]);
    const next = cartReducer(initial, {
      type: addToCart.fulfilled.type,
      payload: { ...pizzaAlarge, qty: 1 },
    });
    expect(next.cartItems).toHaveLength(2);
  });

  it('sets an error message on rejected', () => {
    const initial = stateWithItems([]);
    const next = cartReducer(initial, {
      type: addToCart.rejected.type,
      payload: 'Pizza not found',
    });
    expect(next.loading).toBe(false);
    expect(next.cartAddItemError).toBe('Pizza not found');
  });
});

describe('createStripeCheckoutSession async thunk reducers', () => {
  it('stores session details on fulfilled', () => {
    const initial = stateWithItems([]);
    const next = cartReducer(initial, {
      type: createStripeCheckoutSession.fulfilled.type,
      payload: { sessionId: 'sess_123', url: 'https://checkout', orderId: 'order_1' },
    });
    expect(next.stripeSessionId).toBe('sess_123');
    expect(next.stripeCheckoutUrl).toBe('https://checkout');
    expect(next.stripeOrderId).toBe('order_1');
    expect(next.loading).toBe(false);
  });

  it('sets a checkout error on rejected', () => {
    const initial = stateWithItems([]);
    const next = cartReducer(initial, {
      type: createStripeCheckoutSession.rejected.type,
      payload: 'Payment failed',
    });
    expect(next.stripeCheckoutError).toBe('Payment failed');
    expect(next.loading).toBe(false);
  });
});
