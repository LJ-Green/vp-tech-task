import React, { useEffect, useState } from "react";
import {
  IconHeart,
  IconShoppingCartPlus,
  IconStar,
  IconStarFilled,
  IconStarHalf,
  IconStarHalfFilled,
} from "@tabler/icons-react";
import imageCompression from "browser-image-compression";

function Card({ product, addToCart }) {
  const [compressedImage, setCompressedImage] = useState("");

  useEffect(() => {
    const compressImage = async () => {
      if (product.image.url) {
        try {
          const imageFile = await fetch(product.image.url).then((res) =>
            res.blob()
          );
          const options = {
            maxSizeMB: 1, // maximum size in MB
            maxWidthOrHeight: 500, // maximum width or height in pixels
            useWebWorker: true,
          };
          const compressedFile = await imageCompression(imageFile, options);
          const compressedImageUrl = URL.createObjectURL(compressedFile);
          setCompressedImage(compressedImageUrl);
        } catch (error) {
          console.error("Error compressing image:", error);
        }
      }
    };

    compressImage();
  }, [product.image.url]);

  // Create data attributes from product.attributes
  const filteredAttributes = Object.entries(product.attributes).reduce(
    (acc, [key, value]) => {
      acc[`data-${key}`] = value;
      return acc;
    },
    {}
  );

  // Function to get the stars based on averageRating
  const getStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - (fullStars + halfStar);
    return { fullStars, halfStar, emptyStars };
  };

  const { fullStars, halfStar, emptyStars } = getStarRating(
    product.averageRating
  );

  return (
    <div className="card-container" key={product.id} {...filteredAttributes}>
      <div className="card-main">
        <div className="brand-image-container">
          <img
            src={product.brand.brandImage.url}
            alt={product.brand.brandImage.attributes.imageAltText}
          />
        </div>
        <img
          className="card-image"
          src={compressedImage || product.image.url}
          alt={product.productName}
          loading="lazy"
        />
        {product.attributes.isBestSeller && (
          <div className="bestseller-badge">Best Seller</div>
        )}
      </div>
      <span className="card-name">{product.productName}</span>
      <div className="card-subcontent">
        <div className="card-subcontent-context">
          <div className="subcontent-header-container">
            <span className="card-price">£{product.price.priceIncTax}</span>
            <div>
              <IconShoppingCartPlus
                stroke={2}
                onClick={() => addToCart(product)}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
          <div className="star-rating">
            <div>
              {Array.from({ length: fullStars }).map((_, index) => (
                <IconStarFilled
                  color="#008000"
                  key={`full-${index}`}
                  stroke={1}
                  size={18}
                />
              ))}
              {halfStar === 1 && (
                <IconStarHalfFilled color="#008000" stroke={1} size={18} />
              )}
              {Array.from({ length: emptyStars }).map((_, index) => (
                <IconStar
                  color="#008000"
                  key={`empty-${index}`}
                  stroke={1}
                  size={18}
                />
              ))}
            </div>
            <span>{product.averageRating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
