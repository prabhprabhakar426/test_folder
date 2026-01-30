<template>
  <aside class="menu">
    <h2 class="title">Menu</h2>
    <ul>
      <li @click="navigate('dashboard')">Dashboard</li>
      <li @click="navigate('products')">Products</li>
      <li @click="navigate('orders')">Orders</li>
      <li @click="navigate('suppliers')">Suppliers</li>
      <li @click="navigate('users')">Users</li>
      <li @click="navigate('profile')">Profile</li>
      <li class="logout" @click="logout">Logout</li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'MenuOption',
  methods: {
    navigate(route) {
      // example navigation
      this.$router.push('/' + route)
    },
    logout() {
      // logout logic here
      console.log('Logged out')
    }
  }
}
</script>

<style scoped>
.menu {
  width: 220px;
  height: 100vh;
  background-color: #2c3e50;
  color: #fff;
  padding: 20px;
}

.title {
  margin-bottom: 20px;
  font-size: 18px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
}

li:hover {
  background-color: #34495e;
}

.logout {
  margin-top: 20px;
  background-color: #c0392b;
}

.logout:hover {
  background-color: #e74c3c;
}
</style>
