import React, { useEffect, useState } from "react";
import "./App.css";
import Nav from "./components/Nav";
import Search from "./components/Search";
import FacetPanel from "./components/FacetPanel";
import CardList from "./components/CardList";

function App() {
  // State variables to manage application data
  const [facets, setFacets] = useState([]);
  const [products, setProducts] = useState([]); 
  const [selectedFacets, setSelectedFacets] = useState({}); 
  const [selectedSort, setSelectedSort] = useState("recommended"); 
  const [currentPage, setCurrentPage] = useState(1); 
  const productsPerPage = 6; 
  const [cartItems, setCartItems] = useState([]); 

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `https://spanishinquisition.victorianplumbing.co.uk/interviews/listings?apikey=${process.env.REACT_APP_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: "toilets",
          }),
        }
      );

      const data = await response.json(); 
      setFacets(data.facets || []); 
      setProducts(data.products || []); 
      console.log(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch component on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to add a product to the cart
  const addToCart = (product) => {
    // Does product already exist?
    const existingProduct = cartItems.find((item) => item.id === product.id);
    if (existingProduct) {
      alert("Product is already in the cart.");
    } else {
      setCartItems([...cartItems, product]);
    }
  };

  // Toggling options for facets
  const handleFacetChange = (facetIdentifier, option) => {
    setSelectedFacets((prevSelected) => {
      const currentSelections = prevSelected[facetIdentifier] || [];
      const isSelected = currentSelections.some(
        (selection) => selection.identifier === option.identifier // Utlisise identifier
      );

      let updatedSelections;

      if (isSelected) {
        // remove options?
        updatedSelections = currentSelections.filter(
          (selection) => selection.identifier !== option.identifier
        );
      } else {
        // add options?
        updatedSelections = [...currentSelections, option];
      }

      // No options selected? show all
      if (updatedSelections.length === 0) {
        const { [facetIdentifier]: _, ...remainingSelections } = prevSelected;
        return remainingSelections; // Return remaining selections without the empty facet
      }

      // Return results
      return {
        ...prevSelected,
        [facetIdentifier]: updatedSelections,
      };
    });
  };

  // Function to filter and sort products based on selected facets and sorting option
  const getFilteredAndSortedProducts = () => {
    let filteredProducts = products;

    // Filter by brand names
    if (selectedFacets.brands) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          selectedFacets.brands.some(
            (brand) => brand.value === product.brand.name // Does it match?
          )
      );
    }

    // Filter by price ranges
    if (selectedFacets.prices) {
      filteredProducts = filteredProducts.filter((product) => {
        const productPrice = product.price.priceIncTax;
        return selectedFacets.prices.some((priceRange) => {
          const { gte, lte } = priceRange.value;
          return productPrice >= gte && productPrice <= lte;
        });
      });
    }

    // Funtion for sort by select element
    return filteredProducts.sort((a, b) => {
      if (selectedSort === "priceAsc") {
        return a.price.priceIncTax - b.price.priceIncTax;
      } else if (selectedSort === "priceDesc") {
        return b.price.priceIncTax - a.price.priceIncTax;
      } else if (selectedSort === "recommended") {
        return b.attributes.isRecommended - a.attributes.isRecommended;
      }
      return 0; // No products recomended? return
    });
  };

  // Handle sort selection change
  const handleSortChange = (event) => {
    setSelectedSort(event.target.value);
    setCurrentPage(1);
  };

  // Calculate total pages
  const filteredProducts = getFilteredAndSortedProducts();
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Calculate products to display on the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Nav cartItems={cartItems} />
      <Search />
      <div className="content-container">
        <FacetPanel
          facets={facets}
          onFacetChange={handleFacetChange}
          products={products}
        />
        <CardList
          products={currentProducts}
          onSortChange={handleSortChange}
          selectedSort={selectedSort}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          addToCart={addToCart}
        />
      </div>
    </>
  );
}

export default App;
