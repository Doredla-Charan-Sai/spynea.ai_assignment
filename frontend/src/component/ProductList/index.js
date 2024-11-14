import React, { Component } from 'react';
import { Link } from 'react-router-dom'; 
import Cookies from 'js-cookie';
import './index.css';

class ProductList extends Component {
  state = {
    searchQuery: '',
    products: [], 
    filteredProducts: [], 
    errorMsg: '',
  };

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = async () => {
    try {
      const yourAuthToken = Cookies.get('jwt_token');
      const response = await fetch('http://localhost:3000/api/cars', {
        headers: {
          'Authorization': `Bearer ${yourAuthToken}`, 
          'Content-Type': 'application/json',
        },
      }); 

      if (response.ok) {
        const { cars: products } = await response.json();
        this.setState({
          products,
          filteredProducts: products,
        });
      } else {
        this.setState({ errorMsg: 'Failed to fetch products. Please try again.' });
      }
    } catch (error) {
      this.setState({ errorMsg: 'An error occurred while fetching products.' });
    }
  };

  onSearchChange = (event) => {
    const searchQuery = event.target.value;
    this.setState({ searchQuery }, this.filterProducts);
  };

  filterProducts = () => {
    const { searchQuery, products } = this.state;
    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    this.setState({ filteredProducts });
  };

  // New function to handle delete
  handleDelete = async (productId) => {
    try {
      const yourAuthToken = Cookies.get('jwt_token');
      const response = await fetch(`http://localhost:3000/api/cars/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${yourAuthToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update the state by filtering out the deleted product
        this.setState((prevState) => ({
          products: prevState.products.filter((product) => product.id !== productId),
          filteredProducts: prevState.filteredProducts.filter((product) => product.id !== productId),
          errorMsg: '',
        }));
      } else {
        this.setState({ errorMsg: 'Failed to delete product. Please try again.' });
      }
    } catch (error) {
      this.setState({ errorMsg: 'An error occurred while deleting the product.' });
    }
  };

  render() {
    const { searchQuery, filteredProducts, errorMsg } = this.state;

    return (
      <div className="product-list-container">
        <h1>Product List</h1>
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={this.onSearchChange}
            placeholder="Search by title"
            className="search-input"
          />
        </div>
        {errorMsg && <p className="error">{errorMsg}</p>}
        <div className="product-list">
          {filteredProducts.length === 0 ? (
            <p>No products found</p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-item">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <Link to={`/product/${product.id}`} className="product-link">
                  View Details
                </Link>
                <button
                  onClick={() => this.handleDelete(product.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

export default ProductList;
