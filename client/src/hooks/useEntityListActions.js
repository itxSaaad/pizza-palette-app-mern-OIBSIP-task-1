import { useState } from 'react';
import { useDispatch } from 'react-redux';

export function useEntityListActions({ deleteThunk, refreshThunk, entityName }) {
  const dispatch = useDispatch();
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const handleDeleteRequest = (id) => {
    setPendingDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteId) {
      dispatch(deleteThunk(pendingDeleteId)).then(() => {
        dispatch(refreshThunk());
      });
      setPendingDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setPendingDeleteId(null);
  };

  const confirmDialogProps = {
    isOpen: pendingDeleteId !== null,
    onConfirm: handleConfirmDelete,
    onCancel: handleCancelDelete,
    title: `Delete ${entityName}?`,
    message: `Are you sure you want to delete this ${entityName}? This action cannot be undone.`,
    confirmLabel: 'Delete',
    danger: true,
  };

  return { handleDeleteRequest, confirmDialogProps };
}
