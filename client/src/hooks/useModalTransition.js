import { useEffect, useState } from 'react';

// Modal.jsx fades in/out based on its `isOpen` prop, but the parent
// component that renders a *modal wrapper* (PizzaCreateModal, CartModal,
// etc.) usually unmounts that wrapper entirely on close — which would skip
// the fade-out unless something delays the actual unmount until the CSS
// transition finishes. This hook owns that mount-in / delayed-close-out
// timing so each modal wrapper doesn't reimplement it.
export function useModalTransition(onClose, delay = 300) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const requestClose = () => {
    setVisible(false);
    setTimeout(onClose, delay);
  };

  return { visible, requestClose };
}
