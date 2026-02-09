<template>
  <div>
     <!-- Navbar -->
    <NavbarComp :menuItems="menuItems" /> 
  
  <div class="dashboard">
    <h2>Admin Dashboard</h2>

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
// import axios from "axios";
import NavbarComp from "../NavbarComp.vue";
import { menuItems } from "@/utils/global";
import { api } from "@/utils/interceptor";

export default {
  name: "AdminDashboard",
  components:{
    NavbarComp
  },

  data() {
    return {
      cards: {
         totalProducts:0,
          totalUsers: 0,
          lowStock: 0,
          pendingOrders: 0,
          totalRevenue: 0
      },
      menuItems : []
//       menuItems: [
//   { label: "Dashboard", path: "/home", icon: "fas fa-chart-line" },
//   { label: "Products", path: "/products", icon: "fas fa-box" },
//   { label: "Users", path: "/users", icon: "fas fa-users" },
//   { label: "Orders", path: "/orders", icon: "fas fa-shopping-cart" },
//   { label: "Profile", path: "/profile", icon: "fas fa-user-circle" }
// ]
    };
  },

  mounted() {
    this.menuItems = menuItems();
    this.fetchDashboardData();

  },

  methods: {
    async fetchDashboardData() {
      try{
        const response = await api.get('/inventory/dashboard')
        // const response = await axios.get("http://localhost:8080/inventory/dashboard",{
        //   headers:{
        //      Authorization: `Bearer ${localStorage.getItem("authTokens")}`
        //   }
        // })
        console.log(response)
       if (response) {
         this.cards.totalProducts = response.data.totalProducts;
         this.cards.lowStock = response.data.lowStock;
         this.cards.totalUsers = response.data.totalUsers;
         this.cards.pendingOrders = response.data.pending;
         this.cards.totalRevenue = response.data.totalRevnue;
       }
      }
      catch(error){
        console.log('catch block ;',error.message);
        throw error;
      } 
    },

    formatTitle(key) {
      return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, str => str.toUpperCase());
    },
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
  grid-template-columns: repeat(auto-fit, minmax(220px, 2fr));
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
