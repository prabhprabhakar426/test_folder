<template>
  <div class="users-page">
    <NavbarComp :menuItems="menuItems"/>
    <h2 class="title">All Orders</h2>

    <!-- Top Actions -->
    <div class="actions">   
      <input
        type="text"
        v-model="search"
        placeholder="Search orders..."
      />
    </div>

    <!-- Order List Table -->
    <table class="bordered-table">
      <thead>
        <tr>
          <th>S.NO</th>
          <th  v-if="showAction()">Product Id</th>
          <th  v-if="showAction()">User Id</th>
          <th>Product Name</th>
          <th>Order Quantity </th>
          <th>Price</th>
          <th>Total Amount</th>
          <th>Order Status</th>
          <th v-if="showAction()">Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(order, index) in searchOrders" :key="order.id">
          <td class="center">{{ index + 1 }}</td>
          <td v-if="showAction()">{{ order.id }}</td>
          <td v-if="showAction()">{{ order.userId }}</td>
          <td>{{ order.productName }}</td>
          <td>{{ order.quantity }}</td>
          <td>{{ order.price }}</td>
          <td>{{ order.totalPrice }}</td>
          <td>{{ order.status }}</td>
          <td class="center" v-if="showAction()">
            <button v-if="canDeliver(order.status)" 
                    class="deliver" 
                    @click="deliver(order)"
            >
              Deliver
            </button>
          </td>
        </tr>

        <tr v-if="searchOrders.length === 0">
          <td  colspan="100%" class="center">No Orders found</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { menuItems } from '@/utils/global';
import axios from 'axios';
import NavbarComp from './NavbarComp.vue';
import { getRole, getUserId } from '@/utils/auth';
import { api } from '../utils/interceptor'

    export default {
        name: 'OrdersList',
        components:{
            NavbarComp
        },
        data(){
            return {
                search:'',
                menuItems:[],
                orders:[]
            }
        },
        mounted(){
            this.menuItems = menuItems();
            this.fetchAllOrders();
        },
        computed:{
            searchOrders(){
                return this.orders.filter(order => 
                    order.productName.toLowerCase().includes(this.search.toLowerCase())
                );
            },
        },
        methods:{
            async fetchAllOrders(){
                try{
                    const role = getRole();
                    let response ;
                    if(role === 'ADMIN' || role === 'MANAGER'){
                      response = await api.get('/orders/allOrders');
                        // response = await axios.get('http://localhost:8080/orders/allOrders',{
                        //   headers:{
                        //     Authorization: `Bearer ${localStorage.getItem("authTokens")}`
                        //   }
                        // });
                    }else{
                        const userId = getUserId();
                        response = await api.get('/orders/userOrders',{ params:{id: userId}});
                        // response = await axios.get('http://localhost:8080/orders/userOrders', {
                        //     params:{
                        //         id: userId
                        //     },
                        //     headers:{
                        //     Authorization: `Bearer ${localStorage.getItem("authTokens")}`
                        //   }
                        // });
                    }
                    this.orders = response.data;
                }
                catch(error){
                    console.log(error.message);
                    throw error;
                }
            },
            async deliver(order){
                try {
                    console.log(order,' order Id')
                    const response = await axios.put('http://localhost:8080/orders/deliver',order,
                    {
                      headers:{
                        Authorization: `Bearer ${localStorage.getItem("authTokens")}`
                      }
                    })
                    if(response){
                        alert('Product delivered')
                        await this.fetchAllOrders(); 
                    }else{
                        alert('Product not delivered')
                    }
                } catch (error) {
                    console.log(error.message);
                    throw error;
                }
            },
            canDeliver(status){
                return status === 'PENDING';
            },
            showAction(){
                const role = getRole();
                console.log(role)
                return role === 'ADMIN' || role === 'MANAGER';
            }
        }
    }
</script>

<style scoped>
/* Enhanced Orders Table Design */
.bordered-table {
  border-radius: 18px;
  overflow: hidden;
  border: 4px solid;
  border-image: linear-gradient(270deg, #6366f1, #38bdf8, #fbbf24, #ef4444, #6366f1) 1;
  animation: border-anim 6s linear infinite;
  box-shadow: 0 4px 24px rgba(99,102,241,0.10);
  background: #f8fafc;
  width: 100%;
  margin: 0 auto 24px auto;
  font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
  font-size: 15px;
  border-collapse: separate;
  border-spacing: 0;
}
.bordered-table th, .bordered-table td {
  padding: 14px 10px;
  text-align: center;
}
.bordered-table th {
  background: linear-gradient(90deg, #6366f1 0%, #38bdf8 100%);
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  border-bottom: 2px solid #e0e7ff;
  letter-spacing: 0.5px;
}
.bordered-table tbody tr:nth-child(even) {
  background: #e0e7ff;
}
.bordered-table tbody tr:nth-child(odd) {
  background: #f8fafc;
}
.bordered-table tbody tr:hover {
  background: #c7d2fe;
  transition: background 0.18s;
}
.bordered-table td {
  color: #3730a3;
  font-weight: 500;
  border-bottom: 1px solid #e0e7ff;
}
.bordered-table td.center {
  text-align: center;
}
.bordered-table th:first-child, .bordered-table td:first-child {
  border-left: none;
}
.bordered-table th:last-child, .bordered-table td:last-child {
  border-right: none;
}
.bordered-table tr:last-child td {
  border-bottom: none;
}

/* Responsive Table */
@media (max-width: 900px) {
  .bordered-table th, .bordered-table td {
    padding: 8px 4px;
    font-size: 13px;
  }
  .bordered-table {
    font-size: 13px;
  }
}
@media (max-width: 600px) {
  .bordered-table {
    font-size: 11px;
    border-radius: 8px;
  }
  .bordered-table th, .bordered-table td {
    padding: 5px 2px;
  }
}
.bordered-table th,
.bordered-table td {
  border: 1px solid #a1def1;
}

.title {
    text-align: center;
}

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
  border: 1px solid #6cdd84;
}

table {
  width: 75%;
  margin: 10px auto;
  border-collapse: separate;
  border-spacing: 0;
  background: #fdffff;
  border: 1px solid #f5f6f8;
  border-radius: 15px;
  overflow: hidden;
}

thead {
  background: linear-gradient(90deg, #1e3a8a, #2563eb);
}

/* Column widths */
/* thead th:nth-child(1),
tbody td:nth-child(1) {
  width: 10%;   
}

thead th:nth-child(2),
tbody td:nth-child(2) {
  width: 30%;  
}

thead th:nth-child(3),
tbody td:nth-child(3) {
  width: 40%;   
}

thead th:nth-child(4),
tbody td:nth-child(4) {
  width: 20%;   
} */

thead th {
  padding: 12px;
  font-size: 14px;
  color: #ffffff;
  text-align: left;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

thead th:last-child {
  border-right: none;
}

tbody tr {
  transition: background 0.2s;
}

tbody tr:hover {
  background: #f1f5f9;
}

tbody td {
  padding: 12px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

tbody td.center {
  text-align: center;
  padding: 20px;

}

tbody tr:last-child td {
  border-bottom: none;
}

.deliver {
  background:  #5edf7a;
  color: white;
  border: none;
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 600;
}

.deliver:hover {
  background: #18eb46;
}

</style>