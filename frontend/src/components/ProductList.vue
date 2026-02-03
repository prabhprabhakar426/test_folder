<template>
  <div>
    <NavbarComp :menuItems="menuItems" /> 

    <div class="productList">
      <h2>Product List</h2>

      <!-- Top Actions -->
      <div class="actions">
        <!-- Search -->
        <input
          type="text"
          v-model="search"
          placeholder="Search products..."
        />

        <!-- Category Filter -->
        <div class="field">
          <select v-model="selectedCategory">
            <option value="">All Categories</option>
            <option>Electronics</option>
            <option>Stationary</option>
            <option>Home Appliances</option>
            <option>Beauty & Personal</option>
            <option>Sports Wear</option>
          </select>
          <label>Category</label>
        </div>

        <button
          class="add-btn"
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
            <button class="delete" @click="deleteProduct(product)">
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <p v-if="filteredProducts.length === 0" class="center">
        No Product Found
      </p>

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
  components: { NavbarComp },

  data() {
    return {
      newProduct:{
        productName:"",
        price:"",
        category:"",
        totalStock:"",
        productImage: "/productImage_1769671201716.jfif"
      },
      showAddForm: false,
      products: [],
      menuItems: [],
      defaultImage: '/no-image.png',
      search:"",
      debounceSearch:"",
      selectedCategory:""
    };
  },
  watch:{
    search(val){
      clearTimeout(this._timer)
      this._timer = setTimeout(()=>{
        this.debounceSearch = val 
      }, 200)
    }
  },
  computed: {
    imageSrc() {
      console.log(this.products.productImage)
      return this.products.productImage || this.defaultImage;
    },
    filteredProducts() {
      let products = this.products;
      if (this.search) {
       products = products.filter(product =>
          product.productName.toLowerCase().includes(this.search.toLowerCase())
        );
      }
      
      if(this.selectedCategory){
        console.log('category methods ',products)
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

    async deleteProduct(product){
      console.log(product.id)
      try {
        const response = await api.delete('/inventory/delete/',{
          data:{
            id: product.id
          }
        });
        // const response = await axios.delete('http://localhost:8080/inventory/delete/',{
        //   data:{
        //     id: product.id
        //   },
        //   headers:{
        //     Authorization: `Bearer ${localStorage.getItem("authTokens")}`
        //   }
        // });
        if(response){
          alert('Product is Deleted');
          await this.fetchAllProducts();
        }
        this.products = response.data;
      } catch (error) {
        console.error(error.message);
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
    
  }
};
</script>

<style scoped>

.actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.actions input {
  width: 200px;
  padding: 8px;
  margin-left: 20px;
  border-radius: 10px;
  border: 1px solid #5be097;
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

.save-btn {
  background: #10b981;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

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
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

/* Card */
.card {
  background: #ffffff;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid #beb4e0;
  text-align: center;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.15);
}


.product-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 10px;
}

/* .product-image {
  width: 100%;
  height: clamp(70px, 12vw, 120px);
  object-fit: cover;
} */


/* Name */
.title {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

/* Price */
.price {
  font-size: 20px;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 6px;
}

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


</style>