import React, { useEffect } from "react";
import "./styles.css";
import { useReducer } from "react";

import faker from "faker";

faker.seed(123);

const data = [...Array(50)].map((item) => ({
  id: faker.random.uuid(),
  name: faker.commerce.productName(),
  image: faker.random.image(),
  price: faker.commerce.price(),
  material: faker.commerce.productMaterial(),
  brand: faker.lorem.word(),
  inStock: faker.random.boolean(),
  fastDelivery: faker.random.boolean(),
  ratings: faker.random.arrayElement([1, 2, 3, 4, 5]),
  offer: faker.random.arrayElement([
    "Save 50",
    "70% bonanza",
    "Republic Day Sale"
  ]),
  idealFor: faker.random.arrayElement([
    "Men",
    "Women",
    "Girl",
    "Boy",
    "Senior"
  ]),
  level: faker.random.arrayElement([
    "beginner",
    "amateur",
    "intermediate",
    "advanced",
    "professional"
  ]),
  color: faker.commerce.color()
}));

const initialFilters = {
  sortBy: "",
  inStock: false,
  fastDelivery: false,
  priceRange: 999
};

const reducerFunc = (state, action) => {
  switch (action.type) {
    case "SORT_BY_PRICE":
      return { ...state, sortBy: action.payload };

    case "inStock":
      return { ...state, inStock: action.payload };

    case "fastDelivery":
      return { ...state, fastDelivery: action.payload };

    case "priceRange":
      return { ...state, priceRange: action.payload };

    case "clear":
      return {
        ...state,
        sortBy: "",
        inStock: false,
        fastDelivery: false,
        priceRange: 999
      };

    default:
      return state;
  }
};

export default function App() {
  const [state, dispatch] = useReducer(reducerFunc, initialFilters);

  const sortByFunc = (state, data) => {
    console.log(state.sortBy);

    if (state.sortBy === "HIGH_TO_LOW") {
      return [...data].sort((a, b) => b.price - a.price);
    }

    if (state.sortBy === "LOW_TO_HIGH") {
      return [...data].sort((a, b) => a.price - b.price);
    }

    return [...data];
  };

  const sortByStock = (data) => {
    if (state.inStock === true) {
      return [...data];
    }
    if (state.inStock === false) {
      return [...data].filter((ele) => ele.inStock === true);
    }
  };

  const sortByDelivery = (data) => {
    if (state.fastDelivery === true) {
      return [...data].filter((ele) => ele.fastDelivery === true);
    }

    if (state.fastDelivery === false) {
      return [...data];
    }
  };

  const sortByPriceRange = (data) => {
    return [...data].filter((ele) => Number(ele.price) <= state.priceRange);
  };
  const sortedData = sortByFunc(state, data);
  const stockData = sortByStock(sortedData);
  const deliveryData = sortByDelivery(stockData);
  const priceRangeData = sortByPriceRange(deliveryData);
  return (
    <div className="product-listing-body">
      <div className="filter-and-category megaContainer">
        <div className="topContainer flex-space-between">
          <h3>Filters</h3>
          <p onClick={() => dispatch({ type: "clear" })}>Clear</p>
        </div>

        <div className="input scroll-input display-flex">
          <h4>Price</h4>
          <div className="price-range display-flex">
            <p>17</p>
            <p>500</p>
            <p>1000</p>
          </div>

          <input
            type="range"
            id="range-input"
            min="17.00"
            max="997.00"
            value={state.priceRange}
            onChange={(e) =>
              dispatch({ type: "priceRange", payload: e.target.value })
            }
          />
        </div>

        <div className="checheckbox-list column-flex-start">
          <div className="list-title">
            <p>Delivery</p>
          </div>

          <div className="checkbox-list-items column-flex-start">
            <div className="list-item">
              <input
                checked={state.inStock}
                onChange={(e) =>
                  dispatch({ type: "inStock", payload: e.target.checked })
                }
                id="item-1"
                type="checkbox"
                name="checkbox-input-1"
              />
              <label htmlFor="item-1">Include Out of stock</label>
            </div>
            <div className="list-item">
              <input
                checked={state.fastDelivery}
                onChange={(e) =>
                  dispatch({ type: "fastDelivery", payload: e.target.checked })
                }
                id="item-2"
                type="checkbox"
                name="checkbox-input"
              />
              <label htmlFor="item-2">Fast delivery only</label>
            </div>
          </div>
        </div>

        <div className="radio-list radio-category spacing-s column-flex-start">
          <div className="list-title">
            <p>Sort By</p>
          </div>

          <div className="radio-list-items">
            <div className="list-item">
              <input
                checked={state.sortBy === "LOW_TO_HIGH"}
                onChange={() =>
                  dispatch({ type: "SORT_BY_PRICE", payload: "LOW_TO_HIGH" })
                }
                id="item-3"
                type="radio"
                name="radio-input-2"
              />
              <label htmlFor="item-3">Price-Low to High</label>
            </div>
            <div className="list-item">
              <input
                checked={state.sortBy === "HIGH_TO_LOW"}
                onChange={() =>
                  dispatch({ type: "SORT_BY_PRICE", payload: "HIGH_TO_LOW" })
                }
                id="item-4"
                type="radio"
                name="radio-input-2"
              />
              <label htmlFor="item-4">Price-High to Low</label>
            </div>
          </div>
        </div>
      </div>
      <div className="product-container">
        {priceRangeData.length}
        {priceRangeData.map(
          ({
            id,
            name,
            image,
            price,
            productName,
            inStock,
            level,
            fastDelivery
          }) => (
            <div
              key={id}
              style={{
                border: "1px solid #4B5563",
                borderRadius: "0 0 0.5rem 0.5rem",
                margin: "1rem",
                padding: "0 0 1rem",
                maxWidth: "300px",
                maxHeight: "500px"
              }}
            >
              <img src={image} width="100%" height="auto" alt={productName} />
              <h3> {name} </h3>
              <div>Rs. {price}</div>
              {inStock && <div> In Stock </div>}
              {!inStock && <div> Out of Stock </div>}
              <div>{level}</div>
              {fastDelivery ? (
                <div> Fast Delivery </div>
              ) : (
                <div> 3 days minimum </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
