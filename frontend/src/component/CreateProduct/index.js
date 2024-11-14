import { Component } from 'react'; 
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import './index.css';

class CreateProductWithNavigate extends Component {
  state = {
    title: '',
    description: '',
    carType: '',
    company: '',
    dealer: '',
    images: [],
    errorMsg: '',
    successMsg: '',
    isEditMode: false,
  };

  componentDidMount() {
    const { productId } = this.props;
    if (productId) {
      this.setState({ isEditMode: true });
      this.fetchProductDetails(productId);
    }
  }

  fetchProductDetails = async (productId) => {
    const token = Cookies.get('jwt_token');
    try {
      const response = await fetch(`https://spynea-ai-assignment-2.onrender.com/api/cars/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { car: product } = await response.json();
        this.setState({
          title: product?.title || '',
          description: product?.description || '',
          carType: product?.car_type || '',
          company: product?.company || '',
          dealer: product?.dealer || '',
          images: [],  
        });
      } else {
        this.setState({ errorMsg: 'Failed to fetch product details.' });
      }
    } catch (error) {
      this.setState({ errorMsg: 'Error fetching product details.' });
    }
  };

  onTitleChange = (event) => {
    this.setState({ title: event.target.value });
  };

  onDescriptionChange = (event) => {
    this.setState({ description: event.target.value });
  };

  onCarTypeChange = (event) => {
    this.setState({ carType: event.target.value });
  };

  onCompanyChange = (event) => {
    this.setState({ company: event.target.value });
  };

  onDealerChange = (event) => {
    this.setState({ dealer: event.target.value });
  };

  onImagesChange = (event) => {
    this.setState({ images: event.target.files });
  };

  validateForm = () => {
    const { title, description, carType, company, dealer, images } = this.state;
    if (!title || !description || !carType || !company || !dealer) {
      this.setState({ errorMsg: 'All fields are required!' });
      return false;
    }
    if (images.length > 10) {
      this.setState({ errorMsg: 'You can upload a maximum of 10 images!' });
      return false;
    }
    return true;
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    if (!this.validateForm()) return;

    const { title, description, carType, company, dealer, images, isEditMode } = this.state;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('car_type', carType);
    formData.append('company', company);
    formData.append('dealer', dealer);

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    const token = Cookies.get('jwt_token');
    const apiUrl = isEditMode ? `https://spynea-ai-assignment-2.onrender.com/api/cars/${this.props.productId}` : 'https://spynea-ai-assignment-2.onrender.com/api/cars';
    const method = isEditMode ? 'PUT' : 'POST';

    const options = {
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    };

    try {
      const response = await fetch(apiUrl, options);
      if (response.ok) {
        this.setState({
          successMsg: `Car ${isEditMode ? 'updated' : 'added'} successfully!`,
          errorMsg: '',
          title: '',
          description: '',
          carType: '',
          company: '',
          dealer: '',
          images: [],
        });
        this.props.navigate('/products');
      } else {
        const errorData = await response.json();
        this.setState({ errorMsg: errorData.message || `Failed to ${isEditMode ? 'update' : 'add'} car.`, successMsg: '' });
      }
    } catch (error) {
      this.setState({ errorMsg: 'Failed to save car. Please try again.', successMsg: '' });
    }
  };

  render() {
    const { title, description, carType, company, dealer, errorMsg, successMsg, isEditMode } = this.state;
    return (
      <div className="create-product-container">
        <h1>{isEditMode ? 'Edit Product' : 'Create New Product'}</h1>
        <form className="form-cont" onSubmit={this.handleSubmit}>
          <label htmlFor="title">Title</label>
          <input id="title" type="text" value={title} onChange={this.onTitleChange} className="input-field" />

          <label htmlFor="description">Description</label>
          <textarea id="description" value={description} onChange={this.onDescriptionChange} className="input-field" />

          <label htmlFor="carType">Car Type</label>
          <input id="carType" type="text" value={carType} onChange={this.onCarTypeChange} className="input-field" />

          <label htmlFor="company">Company</label>
          <input id="company" type="text" value={company} onChange={this.onCompanyChange} className="input-field" />

          <label htmlFor="dealer">Dealer</label>
          <input id="dealer" type="text" value={dealer} onChange={this.onDealerChange} className="input-field" />

          <label htmlFor="images">Images</label>
          <input id="images" type="file" accept="image/*" multiple onChange={this.onImagesChange} className="input-field" />

          {errorMsg && <p className="error">{errorMsg}</p>}
          {successMsg && <p className="success">{successMsg}</p>}

          <button type="submit" className="submit-btn">{isEditMode ? 'Update Product' : 'Add Product'}</button>
        </form>
      </div>
    );
  }
}

export default function CreateProduct(props) {
  const navigate = useNavigate();
  const { productId } = useParams(); 
  return <CreateProductWithNavigate {...props} productId={productId} navigate={navigate} />;
}
