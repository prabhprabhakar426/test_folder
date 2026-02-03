<template>
  <div>
    <NavbarComp :menuItems="menuItems" />

    <div class="dashboard">
      <h2>User Dashboard</h2>

      <div class="card-grid">
        <div class="card" v-for="(value, key) in cards" :key="key">
          <p class="title">{{ formatTitle(key) }}</p>
          <p class="value">{{ value }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserId, getUserName } from "@/utils/auth";
import NavbarComp from "../NavbarComp.vue";
import { menuItems } from "@/utils/global";
// import axios from 'axios';
import { api } from "@/utils/interceptor";

export default {
  name: "UserDashboard",
  components: { NavbarComp },

  data() {
    return {
      cards: {
        // availableProducts: 124,
        myOrders: 0,
        pendingDeliveries: 0
      },
      menuItems: []
    };
  },
  mounted(){
    this.menuItems = menuItems();
    this.fetchDashboardData();
  },
  methods: {

    async fetchDashboardData() {
      try{
        const userId = getUserId();
        const userName = getUserName();
        console.log('userId')
        console.log(userId)
        
        // axios interceptor.
        const response = await api.get('/user/dashboard',{
          params:{
            id: userId,
            name: userName
          }
        });
        // const response = await axios.get("http://localhost:8080/user/dashboard",{
        //   params:{
        //     id: userId,
        //     name: userName
        //   },
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('authTokens')}`
        //   }
        // })

        console.log(response)
        if (response) {
          this.cards.pendingDeliveries = response.data.pending;
          this.cards.myOrders = response.data.delivered
        }
      }
      catch(error){
        console.log(error.message);
        throw error;
      } 
    },
    formatTitle(key) {
      return key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
    }
  }
};
</script>

<style scoped>

/* Navbar */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1f2937;
  padding: 12px 20px;
  color: #fff;
}

.logo {
  font-size: 18px;
  font-weight: bold;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 20px;
}

.nav-links li {
  cursor: pointer;
  font-size: 14px;
}

.nav-links li:hover {
  text-decoration: underline;
}

.logout-btn {
  background: #ef4444;
  border: none;
  padding: 6px 12px;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}

.dashboard {
  padding: 20px;
}

.dashboard h2 {
  text-align: center;
  margin-bottom: 24px;
  font-size: 22px;
  color: #1f2937;
}

/* Grid Layout */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

/* Card Design */
.card {
  background: linear-gradient(135deg, #ffffff, #f9fafb);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Hover Effect */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

/* Title Text */
.card .title {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Value Text */
.card .value {
  font-size: 28px;
  font-weight: 700;
  color: #2563eb;
}

</style>