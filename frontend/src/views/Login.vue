<template>
  <div>
    <login-form @checkCredentials="validateLogin" :error="error"></login-form>
  </div>
</template>

<script>
// import axios from 'axios';
import LoginForm from '../components/LoginForm.vue';
import { api } from '@/utils/interceptor';

export default {
  name: 'LoginPage',
  data(){
    return {
      error: {},
    };
  },
  components: {
    LoginForm,
  },
  methods:{
    async validateLogin(credential){
      console.log('validate Login' + credential)

      try {
        // return token from the server 
        
        let result = await api.post('/user/login', credential);
        
        console.log(result.data.accessToken);
        console.log(result);
        localStorage.setItem("authTokens",result.data.accessToken);
        this.$router.push({name:'Home'});
      } catch (error) {
        console.error(error)
        if (error.response.status === 400) {
           this.error = { err : error.response.data.message};
        } else {
          this.error = { err : 'Login failed' };
        }
      }
    }
  },
  mounted(){
    let tokens = localStorage.getItem('authTokens');
    if(tokens){
      this.$router.push({name:'Home'});
    }
  }
}
</script>