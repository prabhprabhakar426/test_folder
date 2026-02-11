<template>
  <nav class="navbar glass-navbar">
    <!-- Left: Logo -->
    <div class="logo" @click="goTo('/')">
      <i class="fas fa-cubes"></i>
      <span>Inventory<span class="dot">•</span></span>
    </div>

    <!-- Center: Menu -->
    <ul class="nav-links">
  <li
    v-for="item in menuItems"
    :key="item.path"
  >
    <router-link
      :to="item.path"
      class="nav-item"
      active-class='active'
    >
      <i :class="item.icon"></i>
      <span>{{ item.label }}</span>
    </router-link>
  </li>
</ul>


    <!-- Right: Profile + Theme Toggle + Logout -->
    <div class="right-actions">
      <button class="theme-toggle" @click="toggleTheme" :title="darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
        <i :class="darkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
      </button>
      <div class="profile" @click="goTo('/profile')">
        <img src="https://i.pravatar.cc/32?img=3" alt="Profile" class="profile-img" />
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
  data() {
    return {
      darkMode: false
    }
  },
  mounted() {
    // Set theme on mount
    this.darkMode = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
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
        console.log('logout error: ', error.message)
      }
    },
    toggleTheme() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
      this.applyTheme();
    },
    applyTheme() {
      if (this.darkMode) {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
    }
  }
};
</script>

<style scoped>
/* Glassmorphism Navbar */
.glass-navbar {
  background: rgba(31, 41, 55, 0.85);
  box-shadow: 0 8px 32px 0 rgba(31, 41, 55, 0.25);
  backdrop-filter: blur(8px);
  border-radius: 18px;
  margin: 18px 2vw;
  border: 1.5px solid rgba(255,255,255,0.07);
  transition: background 0.3s;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 28px;
  color: #fff;
  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
}

.logo {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  user-select: none;
}
.logo .dot {
  color: #38bdf8;
  font-size: 22px;
  margin-left: 2px;
  font-weight: 900;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 28px;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  color: inherit;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  transition: background 0.18s, color 0.18s;
  font-weight: 500;
}
.nav-links li {
  cursor: pointer;
  font-size: clamp(12px, 2vw, 16px);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  transition: background 0.18s, color 0.18s;
  font-weight: 500;
}
.nav-links li.active,
.nav-links li:hover {
  background: linear-gradient(90deg, #38bdf8 0%, #6366f1 100%);
  color: #fff;
}

.logout-btn {
  background: linear-gradient(90deg, #ef4444 0%, #f59e42 100%);
  border: none;
  padding: 7px 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 6px;
  font-size: clamp(12px, 2vw, 15px);
  font-weight: 600;
  box-shadow: 0 2px 8px 0 rgba(239, 68, 68, 0.08);
  transition: background 0.18s;
}
.logout-btn:hover {
  background: linear-gradient(90deg, #f87171 0%, #fbbf24 100%);
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.profile {
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  font-size: clamp(12px, 2vw, 15px);
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 6px;
  transition: background 0.18s;
}
.profile:hover {
  background: rgba(56,189,248,0.12);
}
.profile-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #38bdf8;
  background: #fff;
}

.theme-toggle {
  background: none;
  border: none;
  color: #fbbf24;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 50%;
  transition: background 0.18s;
}
.theme-toggle:hover {
  background: rgba(251,191,36,0.13);
}

/* Responsive Design */
@media (max-width: 900px) {
  .navbar {
    flex-direction: column;
    align-items: stretch;
    padding: 12px 8px;
    gap: 10px;
  }
  .nav-links {
    justify-content: center;
    gap: 18px;
  }
  .right-actions {
    justify-content: flex-end;
    gap: 10px;
  }
}

@media (max-width: 600px) {
  .glass-navbar {
    margin: 8px 0;
    border-radius: 0 0 16px 16px;
  }
  .navbar {
    flex-direction: column;
    gap: 8px;
    padding: 10px 2vw;
  }
  .nav-links {
    gap: 10px;
  }
  .profile-img {
    width: 26px;
    height: 26px;
  }
}

/* Dark theme support */
:global(.dark-theme) .glass-navbar {
  background: rgba(17, 24, 39, 0.92);
  color: #e0e7ef;
}
:global(.dark-theme) .nav-links li.active,
:global(.dark-theme) .nav-links li:hover {
  background: linear-gradient(90deg, #6366f1 0%, #38bdf8 100%);
  color: #fff;
}
:global(.dark-theme) .logout-btn {
  background: linear-gradient(90deg, #f87171 0%, #fbbf24 100%);
}
:global(.dark-theme) .logout-btn:hover {
  background: linear-gradient(90deg, #ef4444 0%, #f59e42 100%);
}
</style>