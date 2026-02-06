<template>
    <div>
        <RegisterForm @add-new-user="addStaff" :error="error"></RegisterForm>
        
    </div>
</template>

<script>
import { getRole } from '@/utils/auth';
import RegisterForm from '../components/RegisterForm.vue';
import { api } from '@/utils/interceptor';

export default {
  name: 'RegisterPage',
  data(){
    return {
      error: {},
    };
  },
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
          await api.post('/user/register', newStaff)
          if (this.role) {
            this.$router.push('/users');
          } else {
            this.$router.push('/login');
          }
      } catch (error) {
        console.log('Error response:',error.response);
        if (error.status === 400 || error.status === 401) {
          this.error = error.response.data.message;
          console.log('inside 400 status ',this.error);
        } else {
          this.error = { err : error.response.data.message || 'Registeration failed' };
        }
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