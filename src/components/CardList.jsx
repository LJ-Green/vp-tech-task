import React from "react";
import Card from "./Card";

function CardList({ products, onSortChange, selectedSort, currentPage, totalPages, onPageChange, addToCart }) {
  return (
    <div className="card-list-container">
      <div className="card-list-header">
        <select value={selectedSort} onChange={onSortChange}>
          <option value="recommended">Recommended</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
        </select>
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      <div className="cards-grid">
        {products.map((product) => (
          <Card addToCart={addToCart} key={product.id} product={product} />
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button 
            key={index + 1} 
            onClick={() => onPageChange(index + 1)} 
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CardList;
