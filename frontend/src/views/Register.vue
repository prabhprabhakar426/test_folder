<template>
    <div>
        <RegisterForm @add-new-user="addStaff"></RegisterForm>
    </div>
</template>

<script>
import { getRole } from '@/utils/auth';
import RegisterForm from '../components/RegisterForm.vue';
import axios from 'axios';

export default {
  name: 'RegisterPage',
  components: {
    RegisterForm,
  },
  computed:{
    role(){
      const role = getRole();
      if(role === 'ADMIN' || role === 'MANAGER'){
        return true;
      }
      return false;
    },
  },
  methods:{
    async addStaff(newStaff){
      // console.log(newStaff)
      try {
          await axios.post('http://localhost:8080/user/register', newStaff)
          if (this.role) {
            this.$router.push('/users');
          } else {
            this.$router.push('/login');
          }
      } catch (error) {
          console.error(
          error.response?.data?.message || "Registration failed"
        );
      }
    }
  },
  mounted(){
    let user = localStorage.getItem('authTokens');
    let role = getRole();
    if(user && role === 'USER'){
      this.$router.push({name:'Home'});
    }
  }
}
</script>