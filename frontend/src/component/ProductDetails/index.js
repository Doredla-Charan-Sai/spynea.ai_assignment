import React, { Component } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  
import Cookies from 'js-cookie';
import './index.css';

class ProductDetailsWithParams extends Component {
  state = {
    product: null, 
    errorMsg: '',
  };

  componentDidMount() {
    const { id } = this.props.match;
    this.fetchProductDetails(id);
  }

  fetchProductDetails = async (id) => {
    try {
      const yourAuthToken = Cookies.get('jwt_token');
      const response = await fetch(`http://localhost:3000/api/cars/${id}`, {
        headers: {
          'Authorization': `Bearer ${yourAuthToken}`, 
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const { car: product } = await response.json();
        this.setState({ product });
      } else {
        this.setState({ errorMsg: 'Failed to fetch product details.' });
      }
    } catch (error) {
      this.setState({ errorMsg: 'An error occurred while fetching product details.' });
    }
  };

  render() {
    const { product, errorMsg } = this.state;

    if (errorMsg) {
      return <p className="error">{errorMsg}</p>;
    }

    if (!product) {
      return <p>Loading...</p>;
    }

    const images = product.images ? product.images.split(',') : [];
    
    return (
      <div className="product-details-container">
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <p><strong>Car Type:</strong> {product.car_type}</p>
        <p><strong>Company:</strong> {product.company}</p>
        <p><strong>Dealer:</strong> {product.dealer}</p>
        <div className="product-images">
          {images.map((image, index) => (
            <img key={index} src={`http://localhost:3000/${image.replace(/\\/g, '/')}`} alt={`product-${index}`} className="product-image" />
          ))}
        </div>

        <button 
          className="update-btn" 
          onClick={() => this.props.navigate(`/edit/${product.id}`)}
        >
          Update Product
        </button>
      </div>
    );
  }
}

function ProductDetails(props) {
  const navigate = useNavigate();
  return <ProductDetailsWithParams {...props} match={useParams()} navigate={navigate} />;
}

export default ProductDetails;
