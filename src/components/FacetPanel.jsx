import { IconMinus, IconPlus } from "@tabler/icons-react";
import React, { useState } from "react";

/**
 * FacetPanel component displays a list of filter facets for product search.
 * Users can expand or collapse each facet section to view available options
 * and select or deselect options to filter the product list.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.facets - An array of facet objects to display.
 * @param {function} props.onFacetChange - Callback function to handle changes in facet selection.
 * @param {Array} props.products - An array of product objects for determining available options.
 */

function FacetPanel({ facets, onFacetChange, products }) {
  // Track which facets are expanded
  const [expandedFacets, setExpandedFacets] = useState({});

  // Toggle the expanded state of a facet section
  const toggleFacetSection = (facetIdentifier) => {
    setExpandedFacets((prevExpanded) => ({
      ...prevExpanded,
      [facetIdentifier]: !prevExpanded[facetIdentifier],
    }));
  };

  // Filtered facets to only include specific identifiers
  const allowedFacets = ['prices', 'brands'];

  // Get the set of brands that have products
  const brandsWithProducts = new Set(products.map(product => product.brand.name));

  return (
    <div className="facets-container">
      {facets.filter(facet => allowedFacets.includes(facet.identifier)).map((facet) => (
        <div key={facet.identifier} className="facet-section">
          <h4 
            onClick={() => toggleFacetSection(facet.identifier)} 
            className="facet-header"
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            {facet.displayName}
            {expandedFacets[facet.identifier] ? (
              <IconMinus stroke={1} style={{ marginLeft: "auto" }} />
            ) : (
              <IconPlus stroke={1} style={{ marginLeft: "auto" }} />
            )}
          </h4>
          
          {expandedFacets[facet.identifier] && (
            <div className="facet-options">
              {facet.identifier === 'brands' && facet.options
                .filter(option => brandsWithProducts.has(option.displayValue)) // Only show brands with products
                .map((option) => (
                  <span key={option.identifier} className="facet-option">
                    <input
                      type="checkbox"
                      onChange={() => onFacetChange(facet.identifier, option)}
                    />
                    {option.displayValue}
                  </span>
                ))}
              {facet.identifier !== 'brands' && facet.options?.map((option) => (
                <span key={option.identifier} className="facet-option">
                  <input
                    type="checkbox"
                    onChange={() => onFacetChange(facet.identifier, option)}
                  />
                  {option.displayValue}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FacetPanel;
