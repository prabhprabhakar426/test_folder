<template>
  <div class="overlay">
    <div class="buy-card">

      <h3 class="title">Update Product</h3>
      <p class="subtitle">Product Details</p>

      <div class="field">
        <span>Product Name: {{ productNameLabel }}</span>
        <input type="text" 
            v-model.trim="product.updatedName" 
            placeholder="Enter new name"/>
      </div>

      <div class="field">
        <span>Current Price: {{ priceLabel }}</span>
        <input type="number" 
            v-model.lazy.number="product.updatedPrice" 
            placeholder="Enter updated price"
            @blur="validPrice"/>
            <p v-if="priceError">{{ priceError }}</p>
      </div>

      <div class="field">
        <span>Current Stock: {{ stockLabel }}</span>
        <input type="number" 
            v-model.lazy.number="product.updatedTotalStock" 
            @blur="validStock"
            placeholder="Enter new stocks"/>
            <p v-if="stockError">{{ stockError }}</p>
      </div>

      <div class="actions">
        <button class="primary-btn" @click="confirmUpdate">
        <!-- <button class="primary-btn" > -->
          Update
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
import { api } from '@/utils/interceptor'; 

export default{
    name: 'ProductUpdateForm',
    data(){
        return{
            product:{
              updatedName:'',
              updatedPrice:0,
              updatedTotalStock:0
            },
            priceError:'',
            stockError: ''
        }
    },
    mounted(){
    },
    computed:{
      productId(){
        return Number(this.$route.query.productId);
      },
      productNameLabel() {
        return this.$route.query.productName
      },
      priceLabel() {
        return  this.$route.query.price
      },
      stockLabel() {
        return this.$route.query.quantity
      },
    },
    methods:{
      goBack(){
        this.$router.push({name: 'ProductList'});
    },
    validPrice(){
      if (this.product.updatedPrice == null || this.product.updatedPrice <= 0) {
      this.priceError = 'Price must be a positive number';
      this.product.updatedPrice = this.priceLabel; // optional reset
    } else {
      this.priceError = '';
    }
    },
    validStock(){
      if (this.product.updatedTotalStock == null || this.product.updatedTotalStock <= 0) {
        this.stockError = 'Stock must be a positive number';
        this.product.updatedTotalStock = this.stockLabel; // optional reset
      } else {
        this.stockError = '';
      }
    },
    async confirmUpdate(){
        try {
            const updatedProduct = {
                id: this.productId,
                productName: this.product.updatedName || undefined,
                price: this.product.updatedPrice > 0? this.product.updatedPrice : undefined,
                totalStock: this.product.updatedTotalStock >0? this.product.updatedTotalStock : undefined
            }
            console.log('Update Product ', updatedProduct);
            const response = await api.put('/inventory/update/', updatedProduct);

            // const response = await axios.put('http://localhost:8080/inventory/update',updatedProduct,{
            //     headers:{
            //         Authorization: `Bearer ${localStorage.getItem('authTokens')}`
            //     }
            // });
            console.log(response);
            if(response){
                alert('Product is Updated')
                this.$router.push({name:'ProductList'})
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    
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

.buy-card {
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

.field {
  display: flex;
  flex-direction: column;
  position: relative;
  margin-bottom: 20px;
  align-items: flex-start;
}

.field input {
  width: 100%;
  padding: 14px 12px;
  font-size: 14px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  outline: none;
  background: #fff;
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