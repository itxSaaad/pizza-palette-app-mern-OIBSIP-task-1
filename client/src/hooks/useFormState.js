import { useState } from 'react';

// Generalizes EditProfileForm's single-`formData`-object pattern, which is
// simpler to extend than a separate useState per field (the pattern most
// other forms in this codebase still use).
export function useFormState(initialValues) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const reset = () => setValues(initialValues);

  return { values, setValues, handleChange, reset };
}
