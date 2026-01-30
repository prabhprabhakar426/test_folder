<template>
  <div class="overlay">
    <div class="add-product-card">

      <h3 class="title">Add Product</h3>
      <p class="subtitle">Enter product details</p>

      <div class="field">
        <input
          type="text"
          v-model="product.productName"
          placeholder=" "
          required
        />
        <label>Product Name</label>
      </div>

      <div class="field">
        <input
          type="number"
          v-model.number="product.price"
          placeholder=" "
          required
          @blur="validPrice"
        />
        <label>Price</label>
        <p v-if="validPrice" >{{ priceError }}</p>
      </div>

      <div class="field">
      <select v-model="product.category" required>
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
          v-model.number="product.totalStock"
          placeholder=" "
          required
          @blur="validStock"
        />
        <label>Total Stock</label>
        <p v-if="stockError" >{{ stockError }}</p>
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
        <button class="primary-btn" @click="addProduct">
          Save
        </button>
        <button class="cancel-btn" @click="goBack">
          Cancel
        </button>
      </div>

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
          priceError: '',
          stockError: ''
      }
    },
    methods:{

      onImageChange(event) {
        const file = event.target.files[0]
        this.product.image = file
      },

      validPrice(){
        if (this.product.price == null || this.product.price <= 0) {
          this.priceError = 'Price must be a positive number';
          this.product.price = 0; // optional reset
        } else {
          this.priceError = '';
        }
      },

      validStock(){
        if (this.product.totalStock == null || this.product.totalStock <= 0) {
          this.stockError = 'Stock must be a positive number';
          this.product.totalStock = 0; // optional reset
        } else {
          this.stockError = '';
        }
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
          this.$router.push('/products');

        } catch (error) {
            console.log(error.name, error.message);
            throw error;
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
  width: 380px;
  background: #fff;
  padding: 32px;
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
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
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

</style>