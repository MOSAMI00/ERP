import { useState } from 'react';

export default function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const open = (item) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return { isOpen, open, close, selectedItem };
}
