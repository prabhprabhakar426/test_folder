<template>
  <div class="overlay">
    <div class="buy-card">

      <h3 class="title">Buy Product</h3>
      <p class="subtitle">Confirm product details</p>

      <div class="field">
        <p>Product Name: {{ productName }}</p>
      </div>

      <div class="field">
        <p>price: {{ price }}</p>
      </div>

      <div class="field">
        <p>Left stocks: {{ stock }}</p>
      </div>

      <div class="field">
        <input
          type="number"
          v-model.number="quantity"
          min="1"
          placeholder=" "
          @input="checkLimit"
        />
        <label>Quantity</label>
        <p v-if="message">{{ message }}</p>
      </div>

      <div class="field">
        <input
          type="number"
          :value="totalPrice"
          placeholder=" "
          disabled
        />
        <label>Total Price</label>
      </div>

      <div class="actions">
        <button class="primary-btn" @click="confirmBuy">
          Buy
        </button>
        <button class="cancel-btn" @click="goBack">
          Cancel
        </button>
      </div>

    </div>
  </div>
</template>


<script>
import { getUserId, getUserName } from '@/utils/auth';
// import axios from 'axios';
import { api } from '../utils/interceptor';

export default{
    name: 'BuyProduct',
    data(){
        return{
            product:{
              name:'',
              price:0,
              stock:0
            },
            quantity:0,
            message: ''
        }
    },
    mounted(){
    },
    computed:{
      
      totalPrice(){
        return this.price * this.quantity;
      },
      productId(){
        return this.$route.query.productId;
      },
      productName() {
        return this.$route.query.productName;
      },
      price() {
        return this.$route.query.price;
      },
      stock() {
        return this.$route.query.quantity;
      },
    },
    watch:{

    },
    methods:{
      checkLimit(){
        if(this.quantity >= this.stock){
          this.quantity = this.stock;
          this.message = 'Maximum Stock Limit Reach'
        }
        else{
           this.message = ''
        }
      },
      goBack(){
        this.$router.push({name: 'ProductList'});
    },
    async confirmBuy(){
      try {
        const buyProduct = {
          userId : getUserId(),
          userName: getUserName(),
          productId: this.productId,
          productName: this.productName,
          price: this.price,
          quantity: this.quantity,
          totalPrice: this.totalPrice
        }
        console.log(buyProduct);
        await api.post('/orders/orderProduct', buyProduct);
        // await axios.post('http://localhost:8080/orders/orderProduct', buyProduct, {
        //   headers:{
        //             Authorization: `Bearer ${localStorage.getItem("authTokens")}`
        //           }
        // });
        console.log('order placed')
        this.$router.push({name: 'ProductList'})
      } catch (error) {
        console.log(error.message);
        throw error;
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