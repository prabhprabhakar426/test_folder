<template>
  <div class="login-container">
    <div class="login-card">

      <h2 class="brand">Inventory Management</h2>

      <h3 class="title">Sign in</h3>

      <form @submit.prevent="handleLogin">

        <div class="field">
          <input
            type="email"
            v-model="email"
            placeholder=" "
            required
          />
          <label>Email</label>
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

        <div class="actions">
          <button type="submit" class="primary-btn">
            Sign in
          </button>
        </div>

        <p class="register-text">
          Don’t have an account?
          <span @click="redirectRegister">Create account</span>
        </p>

      </form>
    </div>
  </div>
</template>


<script>
export default{
    name:'LoginForm',
    data(){
        return {
            email:'',
            password:''
        }
    },
    methods:{
      handleLogin(){
        console.log('handle Login '+ this.password);
        const credentials = {
            email: this.email,
            password: this.password
        }
        this.$emit('checkCredentials', credentials);
        this.email='';
        this. password='';
      },
      redirectRegister(){
          console.log("register")
          this.$router.push('/register')
      }
    }
}
</script>

<style scoped>
  .login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f1f3f4;
  font-family: Arial, sans-serif;
}

.login-card {
  width: 360px;
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

.field input {
  width: 100%;
  padding: 14px 12px;
  font-size: 14px;
  border: 1px solid #dadce0;
  border-radius: 4px;
  outline: none;
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
  color: #5f6368;
  font-size: 14px;
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
  margin-top: 24px;
}

.primary-btn {
  width: 100%;
  background: #1a73e8;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.primary-btn:hover {
  background: #1558c0;
}

.register-text {
  margin-top: 24px;
  font-size: 14px;
  text-align: center;
}

.register-text span {
  color: #1a73e8;
  cursor: pointer;
  font-weight: 500;
}

</style>>
