<template>
  <div>
    <NavbarComp :menuItems="menuItems" /> 

    <div class="productList">
      <h2>Product List</h2>

      <!-- Top Actions -->
      <div class="actions-bar">
        <div class="search-group">
          <i class="fas fa-search search-icon"></i>
          <input
            type="text"
            v-model="search"
            placeholder="Search products..."
            class="search-input"
          />
          <i v-if="searching" class="search-spinner" aria-hidden="true"></i>
        </div>
        <div class="category-group">
          <label for="category-select" class="category-label"><i class="fas fa-filter"></i> Category</label>
          <select v-model="selectedCategory" id="category-select" class="category-select">
            <option value="">All Categories</option>
            <option>Electronics</option>
            <option>Stationary</option>
            <option>Home Appliances</option>
            <option>Beauty & Personal</option>
            <option>Sports Wear</option>
          </select>
        </div>
        <button
          class="add-btn-pro"
          v-if="canAddProduct"
          @click="showProductForm"
        >
          <i class="fas fa-plus"></i> Add Product
        </button>
      </div>

      <!-- Product Grid -->
      <div class="card-grid">
        <div
          class="card"
          v-for="product in filteredProducts"
          :key="product.id"
          @click="showProduct(product)"
        >
          <!-- Product Image -->
          <img
            class="product-image"
            :src="product.productImage"
            alt="Product Image"
          />

          <!-- Product Name -->
          <p class="title">{{ product.productName }}</p>

          <!-- Price -->
          <p class="price">₹ {{ product.price }}</p>

          <!-- Stock -->
          <p
            class="stock"
            :class="{ lowStock: product.totalStock < 10 }"
          >
            Stock Left: {{ product.totalStock }}
          </p>

          <!-- Buy / Admin Actions -->
          <p v-if="canBuy">
            <button class="buy" @click="buyProduct(product)">
              Buy
            </button>
          </p>

          <div v-else class="action-buttons">
            <button class="update" @click="UpdateProduct(product)">
              Update
            </button>
            <button class="delete" @click="openDeleteModal(product)">
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <p v-if="filteredProducts.length === 0" class="center">
        No Product Found
      </p>


      <div v-if="showDetail" class="product-details-overlay">
  
        <div class="product-card">
          <h3 class="product-title">Product Details</h3>
          <img
            :src="(productDetails && productDetails.productImage) || defaultImage"
            alt="product"
            class="product-card-img"
          />

          <div class="product-card-body">
            <strong class="product-card-title">
              {{ productDetails.productName }}
            </strong>

            <div class="product-card-info">
              Price: ₹ {{ productDetails.price }}
            </div>

            <div class="product-card-info">
              Stock: {{ productDetails.totalStock }}
            </div>
          </div>

          <div class="product-card-actions">
            <button class="btn-cancel" @click="cancelDetails">
              Close
            </button>
          </div>
        </div>
      </div>


      <!-- Delete confirmation modal (minimal) -->
      <div v-if="showDeleteModal" class="simple-overlay">
        <div class="simple-modal">
          <img :src="(productToDelete && productToDelete.productImage) || defaultImage" alt="product" class="simple-modal-img" />
          <div class="simple-modal-body">
            <strong>{{ productToDelete.productName }}</strong>
            <div>Price: ₹ {{ productToDelete.price }}</div>
            <div>Stock: {{ productToDelete.totalStock }}</div>
          </div>
          <div class="simple-modal-actions">
            <button class="btn-cancel" @click="cancelDelete" :disabled="deleting">Cancel</button>
            <button class="btn-delete" @click="performDelete" :disabled="deleting">{{ deleting ? 'Deleting...' : 'Delete' }}</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>


<script>
import { menuItems } from '@/utils/global';
import NavbarComp from './NavbarComp.vue';
// import axios from 'axios';
import { getRole } from '@/utils/auth';
import { api } from '../utils/interceptor'

export default {
  name: 'ProductList',
  components: { NavbarComp,
  },

  data() {
    return {
      newProduct:{
        productName:"",
        price:"",
        category:"",
        totalStock:"",
        productImage: ""
      },
      showAddForm: false,
      products: [],
      menuItems: [],
      defaultImage: '/no-image.png',
      search:"",
      debounceSearch:"",
      searching: false,
      selectedCategory:"",
      // delete modal state
      showDeleteModal: false,
      productToDelete: null,
      deleting: false,
      productDetails: null,
      showDetail: false

    };
  },
  watch:{
    search(val){
      // show searching indicator while user types
      this.searching = true;
      clearTimeout(this._timer)
      this._timer = setTimeout(()=>{
        this.debounceSearch = val;
        this.searching = false;
      }, 300) // 300ms debounce
    }
  },
  computed: {
    imageSrc() {
      console.log(this.products.productImage)
      return this.products.productImage || this.defaultImage;
    },
    filteredProducts() {
      let products = this.products;
      if (this.debounceSearch) {
       products = products.filter(product =>
          product.productName.toLowerCase().includes(this.debounceSearch.toLowerCase())
        );
      }
      
      if(this.selectedCategory){
        console.log('category methods ',products)
        // filtering the products based on category
        products =  products.filter(product =>
          product.category === this.selectedCategory
        );
      }
      return products;
    },
    canAddProduct(){
      const role = getRole();
      if(role === 'ADMIN' || role === 'MANAGER'){
        return true;
      }
      return false;
    },
    canBuy(){
      const role = getRole();
      if(role === 'ADMIN' || role === 'MANAGER'){
        return false;
      }
      return true;
    }
  },

  mounted() {
    this.menuItems = menuItems();
    this.fetchAllProducts();
  },
  beforeUnmount(){
    if(this._timer){
      clearTimeout(this._timer);
      this._timer = null;
    }
  },

  methods: {
    async fetchAllProducts() {
      try {
        const response = await api.get('/inventory/get/');
        // const response = await axios.get('http://localhost:8080/inventory/get/',{
        //   headers:{
        //     Authorization: `Bearer ${localStorage.getItem("authTokens")}`
        //   }
        // });
        this.products = response.data;
        console.log('Vue products : ',this.products)
      } catch (error) {
        console.error(error.message);
      }
    },
    showProductForm() {
     this.$router.push({name: 'AddProduct'});
    },

    buyProduct(product) {
      console.log(product.id)
      const query = {
        productId: product.id,
        productName: product.productName,
        price: product.price,
        quantity: product.totalStock
      }
      console.log(query);
      this.$router.push({name: 'BuyProduct',query})
      // this.users = this.products.filter(product => product.id !== id);
    },

    // open a small modal to confirm delete
    openDeleteModal(product){
      this.productToDelete = product;
      this.showDeleteModal = true;
    },

    cancelDelete(){
      this.productToDelete = null;
      this.showDeleteModal = false;
    },

    async performDelete(){
      if(!this.productToDelete) return;
      try{
        this.deleting = true;
        const response = await api.delete('/inventory/delete/',{
          data:{ id: this.productToDelete.id }
        });
        if(response){
          await this.fetchAllProducts();
        }
        this.cancelDelete();
      }
      catch(err){
        console.error('Delete failed', err);
        alert('Failed to delete product');
      }
      finally{
        this.deleting = false;
      }
    },

    UpdateProduct(product){
      console.log(product)
      const query = {
        productId: product.id,
        productName: product.productName,
        price: product.price,
        quantity: product.totalStock
      }
      this.$router.push({name:'ProductUpdateForm', query})
    },
    showProduct(product){
      this.productDetails = product;
      this.showDetail = true;
    },
    cancelDetails(){
      this.productDetails = null;
      this.showDetail = false;
    },
    
  }
};
</script>

<style scoped>


/* Professional Actions Bar */
.actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #f8fafc 60%, #e0e7ff 100%);
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(99,102,241,0.07);
  padding: 18px 24px 14px 24px;
  margin-bottom: 24px;
  gap: 18px;
  flex-wrap: wrap;
}
.search-group {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(99,102,241,0.04);
  padding: 0 10px;
  border: 1.5px solid #7b8297;
  min-width: 220px;
  flex: 1 1 220px;
  max-width: 280px;
}
.search-icon {
  color: #6366f1;
  font-size: 16px;
  margin-right: 7px;
}
.search-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  padding: 10px 0;
  width: 100%;
  color: #3730a3;
  font-family: inherit;
}
.search-input::placeholder {
  color: #a5b4fc;
  font-size: 14px;
}

/* small spinner shown while debouncing search */
.search-spinner{
  width:16px;
  height:16px;
  border-radius:50%;
  border:2px solid #e6eefc;
  border-top-color:#6366f1;
  margin-left:8px;
  animation: spin 0.9s linear infinite;
}
@keyframes spin{
  to{ transform: rotate(360deg); }
}
.category-group {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(99,102,241,0.04);
  padding: 0 10px;
  border: 1.5px solid #7e8497;
  min-width: 180px;
  flex: 1 1 180px;
  max-width: 240px;
}
.category-label {
  color: #6366f1;
  font-size: 14px;
  font-weight: 600;
  margin-right: 4px;
  display: flex;
  align-items: center;
  gap: 3px;
}
.category-select {
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: #3730a3;
  font-family: inherit;
  padding: 10px 0;
  min-width: 100px;
}
.add-btn-pro {
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 22px;
  font-weight: 700;
  font-size: 15px;
  box-shadow: 0 2px 8px rgba(99,102,241,0.10);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  transition: background 0.18s, transform 0.18s;
}
.add-btn-pro:hover {
  background: linear-gradient(90deg, #4338ca 0%, #2563eb 100%);
  transform: translateY(-2px) scale(1.04);
}
@media (max-width: 900px) {
  .actions-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 12px 8px 10px 8px;
  }
  .search-group, .category-group {
    max-width: 100%;
    min-width: 0;
  }
}

@media (max-width: 600px) {
  .card{
    min-height: unset; /* allow compact cards on small screens */
    padding: 14px 12px;
  }
}


.action-buttons {
  display: flex;
  justify-content: center; /* center horizontally */
  align-items: center;     /* center vertically (if height exists) */
  gap: 10px;
}



.add-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-btn:hover {
  background: #1e40af;
}

.add-form {
  margin-bottom: 15px;
}

.add-form input {
  margin-right: 8px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
}

.add-form select {
  margin-right: 8px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
}

/* Simple confirmation modal */
.simple-overlay{
  position: fixed;
  inset: 0;
  display:flex;
  align-items:center;
  justify-content:center;
  background: rgba(2,6,23,0.45);
  z-index: 1000;
}
.simple-modal{
  background: #fff;
  padding: 12px 14px;
  border-radius: 10px;
  display:flex;
  gap:12px;
  align-items:center;
  width: 420px;
  max-width: 92vw;
  box-shadow: 0 10px 30px rgba(2,6,23,0.12);
}
.simple-modal-img{
  width:72px;
  height:72px;
  object-fit:cover;
  border-radius:8px;
  border:1px solid #e5e7eb;
}
.simple-modal-body{ flex:1; }
.simple-modal-actions{ display:flex; gap:8px; }
.btn-cancel{ background:#fff; border:1px solid #e5e7eb; padding:8px 12px; border-radius:8px; cursor:pointer }
.btn-delete{ background: linear-gradient(90deg,#dc2626 0%, #ef4444 100%); color:#fff; padding:8px 12px; border-radius:8px; border:none; cursor:pointer }
.btn-delete[disabled], .btn-cancel[disabled]{ opacity:0.6; cursor:not-allowed }
  /* border-radius: 8px;
  cursor: pointer;
} */

.cancel {
  margin-left: 6px;
  background: #ccc;
  color: #333;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}
  .productList h2 {
  text-align: center;
  margin-bottom: 24px;
  font-size: 22px;
  color: #1f2937;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  width: 100%;
  margin: 0 auto;
}

/* Card */
.card {
  background: linear-gradient(135deg, #f8fafc 70%, #e0e7ff 100%);
  border-radius: 18px;
  padding: 22px 16px 18px 16px;
  border: 2px solid #e0e7ff;
  text-align: center;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.10);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; /* push actions to bottom */
  min-height: 340px; /* ensure consistent card height */
  box-sizing: border-box;
}

.card:hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 16px 32px rgba(99, 102, 241, 0.18);
}

/* Keep actions aligned to bottom of card */
.card .action-buttons, .card p[action] {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

/* Truncate title to 2 lines so cards stay similar */
.title{
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price{ margin-top:6px; margin-bottom:8px; }


.product-image {
  width: 100%;
  max-width: 200px;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 12px;
}

/* .product-image {
  width: 100%;
  height: clamp(70px, 12vw, 120px);
  object-fit: cover;
} */


/* Name */
.title {
  font-size: 16px;
  font-weight: 700;
  color: #3730a3;
  margin-bottom: 6px;
  word-break: break-word;
}

/* Price */
.price {
  font-size: 18px;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 6px;
}
  /* .card-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 2vw;
  }
  .card {
    padding: 14px 6px 10px 6px;
    border-radius: 12px;
    min-width: 0;
  }
  .product-image {
    max-width: 100vw;
    border-radius: 8px;
  }
  .title {
    font-size: 14px;
  }
  .price {
    font-size: 15px;
  } */



/* Stock */
.stock {
  font-size: 14px;
  font-weight: 600;
  color: #059669;
}

.lowStock {
  color: #dc2626;
}

.buy {
  background: #05c22e;
  color: white;
  border: none;
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 600;
}

.update {
  background: #088dc2;
  color: white;
  border: none;
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 600;
}

.delete {
  background: #e24646;
  color: white;
  border: none;
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 600;
}

.field {
  position: relative;
  width: 220px;
}

.field select {
  width: 100%;
  padding: 12px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  background: #fff;
  cursor: pointer;
}

.field label {
  position: absolute;
  top: -8px;
  left: 10px;
  background: #fff;
  padding: 0 6px;
  font-size: 12px;
  color: #666;
  pointer-events: none;
}

/* Focus state */
.field select:focus {
  border-color: #4f46e5;
}

/* Disabled option look */
.field select option[disabled] {
  color: #999;
}

.product-details-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: rgba(2, 6, 23, 0.45);
  z-index: 1000;
}

.product-details-overlay h3 {
  color: #fff;
  margin-bottom: 12px;
}

.product-card {
  width: 340px;
  background: #fff;
  border-radius: 10px;
  border: #088dc2 solid 2px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0,0,0,0.25);
}

.product-card-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.product-card-body {
  padding: 14px;
}

.product-card-title {
  display: block;
  margin-bottom: 8px;
  font-size: 15px;
}

.product-card-info {
  font-size: 14px;
  margin-bottom: 6px;
}

.product-card-actions {
  padding: 12px;
  text-align: right;
}


</style>