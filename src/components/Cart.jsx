import React, { useState } from "react";
import { IconShoppingCart } from '@tabler/icons-react';
import BasketModal from "./BasketModal";

function Cart({ cartItems }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle Modal
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="nav-cart-container">
      <div onClick={toggleModal} style={{ cursor: 'pointer' }}>
        <IconShoppingCart stroke={2} />
      </div>
      {isModalOpen && <BasketModal cartItems={cartItems} closeModal={toggleModal} />}
    </div>
  );
}

export default Cart;
