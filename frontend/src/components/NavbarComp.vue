<template>
  <nav class="navbar">
    <!-- Left: Logo -->
    <div class="logo">
      <i class="fas fa-boxes"></i>
      <span>Inventory</span>
    </div>

    <!-- Center: Menu -->
    <ul class="nav-links">
      <li
        v-for="item in menuItems"
        :key="item.path"
        :class="{ active: isActive(item.path) }"
        @click="goTo(item.path)"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </li>
    </ul>

    <!-- Right: Profile + Logout -->
<div class="right-actions">
  <div class="profile" @click="goTo('/profile')">
    <i class="fas fa-user-circle"></i>
    <span>Profile</span>
  </div>

  <button class="logout-btn" @click="logout">
    <i class="fas fa-sign-out-alt"></i>
    Logout
  </button>
</div>

  </nav>
</template>

<script>
import { api } from '@/utils/interceptor';

export default {
  name: "NavbarComp",

  props: {
    menuItems: {
      type: Array,
      required: true
    }
  },

  methods: {
    goTo(path) {
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    },

    isActive(path) {
      return this.$route.path === path;
    },

    async logout() {
      try {
       
        await api.post('/user/logout');
        localStorage.removeItem("authTokens");
        this.$router.push("/Login");
      } catch (error) {
        console.log('logout error: ',error.messge)
      }
    }
  }
};
</script>

<style scoped>
/* Navbar Container */
.navbar {
  display: flex;
  /* width: 100%; */
  /* flex-wrap: wrap; */
  align-items: center;
  justify-content: space-between;
  background: #1f2937;
  padding: 12px 20px;
  color: #fff;
}

/* @media (max-width: 768px) {
  .navbar {
    flex-direction: column;
  }
} */

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
font-size: clamp(10px, 2vw, 14px);
}

/* Smaller screens
@media (max-width: 768px) {
  .nav-links li {
    font-size: 12px;
  }
}

/* Very small screens 
@media (max-width: 480px) {
  .nav-links li {
    font-size: 10px;
  }
} */

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
  font-size: clamp(11px, 2vw, 14px);
}
.right-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: clamp(11px, 2vw, 14px);
}

.profile:hover {
  text-decoration: underline;
}
</style>

