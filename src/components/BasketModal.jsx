import React, { useRef, useEffect } from "react";

function BasketModal({ cartItems, closeModal }) {
  const modalRef = useRef(null); // Modal Reference

  // Clied somewhere but the icon or modal? Hide it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

  return (
    <div className="cart-modal" ref={modalRef}>
      {cartItems.length > 0 ? (
        cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <img
              src={item.image.url}
              alt={item.image.attributes.imageAltText}
            />
            <span className="cart-item-name">{item.productName}</span>
            <span className="cart-item-price">£{item.price.priceIncTax}</span>
          </div>
        ))
      ) : (
        <span>Your cart is empty.</span>
      )}
      {cartItems.length > 0 && (
        <>
          <div className="cart-total">
            <span>Total:</span>
            <span className="total">
              £
              {cartItems
                .reduce((total, item) => total + item.price.priceIncTax, 0)
                .toFixed(2)}
            </span>
          </div>
          <button>Checkout</button>
        </>
      )}
    </div>
  );
}

export default BasketModal;
