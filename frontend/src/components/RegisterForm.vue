<template>
  <div class="register-container">
    <div class="register-card">

      <h2 class="brand" v-if="!canShowRole">Inventory Management</h2>

      <h3 class="title">Create an account</h3>

      <form @submit.prevent="handleRegister">

        <div class="field">
          <input
            type="text"
            v-model="name"
            placeholder=" "
            required
            @blur="validateUsername"
          />
          <label>Name</label>
          <p v-if="usernameError" class="error-text">{{ usernameError }}</p>
        </div>

        <div class="field">
          <input
            type="email"
            v-model="email"
            placeholder=" "
            required
            @blur="validateEmail"

          />
          <label>Email</label>
          <p v-if="emailError" class="error-text">{{ emailError }}</p>
        </div>

        <div class="field">
          <input
            type="password"
            v-model="password"
            placeholder=" "
            required
          />
          <label>Password</label>
        </div>

        <div class="field" v-if="canShowRole">
          <select v-model="role" required>
            <option disabled value="">Select role</option>
            <option value="USER">User</option>
            <option value="MANAGER">Manager</option>
          </select>
        </div>

        <div class="actions">
          <button type="submit" class="primary-btn">
            Register
          </button>

          <button type="button" 
            class="cancel-btn"
            @click="goBack"
            v-if="canShowLogin || canShowRole">
            Cancel
          </button>

        </div>

        <p class="login-text" v-if="!(canShowLogin || canShowRole)">
          Already have an account?
          <span @click="$router.push('/login')">Sign in</span>
        </p>

      </form>
    </div>
  </div>
</template>



<script>
import { getRole } from '@/utils/auth';

export default {
  name: "RegisterForm",

  data() {
    return {
      name: "",
      email: "",
      password: "",
      role: "",
      showRole:false,
      usernameError: '',
      emailError: ''
    };
  },

  computed:{
    canShowRole(){
      const role = getRole();
      if(role === 'ADMIN'){
        return true;
      }
      return false;
    },
    canShowLogin(){
      const role = getRole();
      if(role === 'MANAGER' ){
        return true;
      }
      return false;
    },
  },
  methods: {
    validateUsername(){
      const regex = /^[a-zA-Z0-9_]{3,20}$/;

      if(!regex.test(this.name)){
        this.usernameError = 'only letter, number allowed & length 3-20'
      }
      else{
        this.usernameError = '';
      }
    },
    validateEmail(){
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if(!regex.test(this.email)){
        this.emailError = 'Invalid Format';
      }else{
        this.emailError = '';
      }
    },
    handleRegister() {
      console.log('Name: '+this.name)
      const newStaff = {
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role || "USER"
      };
      // console.log(newStaff)
      this.$emit('add-new-user', newStaff);
    },
    goBack(){
      if (this.canShowRole || this.canShowLogin) {
            this.$router.push('/users');
          } else {
            this.$router.push('/login');
          }
    }
  }
};
</script>


<style scoped>
  .register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f1f3f4;
  font-family: Arial, sans-serif;
}

.register-card {
  width: 380px;
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
}

.brand {
  text-align: center;
  font-weight: 500;
  margin-bottom: 16px;
}

.title {
  font-size: 22px;
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

.field input,
.field select {
  width: 100%;
  padding: 14px 12px;
  font-size: 14px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  outline: none;
}

.field input:focus,
.field select:focus {
  border-color: #1a73e8;
}

.field label {
  position: absolute;
  top: 50%;
  left: 12px;
  color: #5f6368;
  font-size: 14px;
  background: #fff;
  padding: 0 4px;
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
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.primary-btn {
  background: #1a73e8;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.primary-btn:hover {
  background: #1558c0;
}

.text-btn {
  background: none;
  border: none;
  color: #1a73e8;
  font-size: 14px;
  cursor: pointer;
}

.login-text {
  margin-top: 24px;
  font-size: 14px;
}

.login-text span {
  color: #1a73e8;
  cursor: pointer;
  font-weight: 500;
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

.cancel-btn:active {
  background: rgba(26, 115, 232, 0.15);
}

.cancel-btn:focus {
  outline: none;
}

.error-text {
  color: #b71c1c;
  background: #fdecea;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  margin-top: 6px;
}

</style>
