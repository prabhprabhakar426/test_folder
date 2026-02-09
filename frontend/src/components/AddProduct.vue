<template>
  <div class="overlay">
    <div class="add-product-card">

      <h3 class="title">Add Product</h3>
      <p class="subtitle">Enter product details</p>
      <p class="error-text" v-if="error.err">{{ error.err }}</p>
      <p class="success-text" v-if="success">{{ success }}</p>

      <form @submit.prevent="addProduct">

        <div class="field">
          <input
            type="text"
            v-model.lazy="product.productName"
            placeholder=" "
            required
            @blur="validProductName"
          />
          <label>Product Name</label>
            <p v-if=" productNameError" class="error-text">{{ productNameError }}</p>
        </div>

        <div class="field">
          <input
            type="number"
            v-model.number.lazy="product.price"
            placeholder=" "
            required
            @blur="validprice"
          />
          <label>Price</label>
          <p v-if=" priceError" class="error-text">{{ priceError }}</p>
        </div>

        <div class="field">
          <select v-model.lazy="product.category" required>
            <option disabled value="">Select category</option>
            <option>Electronics</option>
            <option>Stationary</option>
            <option>Home Appliances</option>
            <option>Beauty & Personal</option>
            <option>Sports Wear</option>
          </select>
          <label>Category</label>
        </div>

        <div class="field">
          <input
            type="number"
            v-model.number.lazy="product.totalStock"
            placeholder=" "
            required
            @blur="validStock"
          />
          <label>Total Stock</label>
          <p v-if=" stockError" class="error-text">{{ stockError }}</p>
        </div>

        <div class="field">
          <input
            type="file"
            accept="image/*"
            @change="onImageChange"
            required
          />
          <label>Product Image</label>
        </div>

        <div class="actions">
          <button type="submit" :disabled="showAddButton()" class="primary-btn">
            Add Product
          </button>
          <button type="button" class="cancel-btn" @click="goBack">
            Cancel
          </button>
        </div>

      </form>

    </div>
  </div>
</template>


<script>
// import axios from 'axios';
import { api } from '../utils/interceptor';

  export default {
    name: 'AddProduct',
    data(){
      return {
          product:{
              productName:'',
              price: 0,
              category:'',
              totalStock:0,
              image: null
          },
          productNameError: "",
          priceError: "",
          stockError: "",
          error:{
            type: Object,
            default: () => ({})
          },
          success: "",
      }
    },
    methods:{
      onImageChange(event) {
        const file = event.target.files[0]
        this.product.image = file;
        console.log('Selected image:', file) // Debug log to verify the selected file
      },
      validProductName(){
        const regex = /^[a-zA-Z0-9\s]+$/;
        console.log('validating product name');
        if(!this.product.productName){
          this.productNameError = 'Product name is required';
        } else if(!regex.test(this.product.productName)) {
          this.productNameError = 'Allowed only letters, numbers and spaces';
        } else {
          this.productNameError = "";
        }
      },
      validprice(){
        console.log('validating price');
        if(!this.product.price || this.product.price <= 0){
          this.priceError = 'Price cannot be zero or negative';
        } else {
          this.priceError = "";
        }
      },
      validStock(){
        console.log('validating stock');
        if(!this.product.totalStock || this.product.totalStock <= 0){
          this.stockError = 'Stock cannot be zero or negative';
        } else {
          this.stockError = "";
        }
      },
      showAddButton(){
        if(this.productNameError || this.priceError || this.stockError){
          return true;
        }
        return false;
      },
      async addProduct() {
        if (!this.product.productName || 
        !this.product.price || 
        !this.product.category || 
        !this.product.totalStock) return;

        try {
          const formData = new FormData()
          formData.append("productName", this.product.productName)
          formData.append("price", this.product.price)
          formData.append("category", this.product.category)
          formData.append("totalStock", this.product.totalStock)
          formData.append("productImage", this.product.image)

          await api.post('/inventory/add', formData);
          // await axios.post('http://localhost:8080/inventory/add',newProduct, {
          //   headers:{
          //             Authorization: `Bearer ${localStorage.getItem("authTokens")}`
          //           }
          // });
          setTimeout(() => {
          this.$router.push('/products');
          }, 1500);
          this.success = "Product added successfully!";
        } catch (error) {
            console.log(error.name, error.message);
            this.error = { err : error.response.data.message || 'Registeration failed' };
        }
      },
      goBack(){
          this.$router.push('/products');
      },
    }
  }
</script>

<style scoped>
    .overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.add-product-card {
  width: 90%;
  max-width: 380px;
  padding: 2rem;
  box-sizing: border-box;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 6px;
}

.subtitle {
  font-size: 14px;
  color: #5f6368;
  margin-bottom: 24px;
}
.field select {
  width: 100%;
  padding: 10px;
}

.field select:focus + label,
.field select:not([value=""]) + label {
  top: -8px;
  font-size: 12px;
  color: #1558c0;
  border-color: #1a73e8;
}

.field {
  position: relative;
  margin-bottom: 20px;
}

.field input {
  width: 100%;
  padding: 14px 12px;
  font-size: 14px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  outline: none;
}

.field input:focus {
  border-color: #1a73e8;
}

.field label {
  position: absolute;
  top: 50%;
  left: 12px;
  background: #fff;
  padding: 0 4px;
  font-size: 14px;
  color: #5f6368;
  transform: translateY(-50%);
  pointer-events: none;
  transition: 0.2s ease;
}

.field input:focus + label,
.field input:not(:placeholder-shown) + label {
  top: -6px;
  font-size: 12px;
  color: #1a73e8;
}

.actions {
  display: flex;
  flex-wrap: wrap; /* buttons will wrap on small width */
  gap: 0.5rem;
  justify-content: flex-end;
}

.primary-btn {
  background: #1a73e8;
  color: #fff;
  border: none;
  padding: 8px 22px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
}

.primary-btn:hover {
  background: #1558c0;
}

.primary-btn:disabled {
  background: #878baf;
  cursor: not-allowed;
  opacity: 0.6;
}

.cancel-btn {
  background: none;
  border: none;
  color: #1a73e8;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
}

.cancel-btn:hover {
  background: rgba(26, 115, 232, 0.08);
}

.error-text {
  color: #b71c1c;
  background: #fdecea;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  margin-top: 6px;
}

.success-text {
  color: #2e7d32;
  background: #e8f5e9;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  margin-top: 6px;
}

/* Fluid, media-query-free responsive tweaks */
.add-product-card {
  width: min(92%, 420px);
  max-width: 100%;
  padding: clamp(1rem, 4vw, 2rem);
}

.title {
  font-size: clamp(18px, 2.6vw, 20px);
}

.subtitle {
  font-size: clamp(13px, 1.8vw, 14px);
  margin-bottom: clamp(12px, 2.5vw, 24px);
}

.field input,
.field select {
  padding: 12px;
  font-size: clamp(14px, 2vw, 14px);
  box-sizing: border-box;
}

.field label {
  left: 12px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end;
}

.primary-btn,
.cancel-btn {
  flex: 1 1 140px;
  min-width: 120px;
  padding: clamp(8px, 1.8vw, 12px) 12px;
}
/* .primary-btn {
  background: #1a73e8;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
} */



.error-text {
  font-size: clamp(12px, 1.6vw, 13px);
}

</style>