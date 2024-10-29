import React from "react";
import NavLogo from "../assets/NavLogo.png";
import Cart from "./Cart";

function Nav({ cartItems }) {
  return (
    <div className="nav-container">
      <div className="nav-wrapper">
        <img src={NavLogo} alt="Victorian Plumbing" />
        <Cart cartItems={cartItems}  />
      </div>
    </div>
  );
}

export default Nav;
