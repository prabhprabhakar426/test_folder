<template>
  <div >
    <component :is="dashboardComponent" />
  </div>
</template>



<script>
import { getRole } from '@/utils/auth';
import AdminDashboard from './dashboard/AdminDashboard.vue';
import ManagerDashboard from './dashboard/ManagerDashboard.vue';
import UserDashboard from './dashboard/UserDashboard.vue';


export default {
  name: 'HomePage',
  data(){
    return {

    }
  },
  components:{
    AdminDashboard
  },   
  computed:{
    dashboardComponent(){
      const role = getRole();
      console.log(role);
      if(role === 'ADMIN') return AdminDashboard;
      if(role === "MANAGER") return ManagerDashboard;
      return UserDashboard;
    }
  },
  mounted(){
        // send JWT token to verify expiry of token if not use refresh token another token
        // let tokens = localStorage.getItem('authTokens');
        // if(!tokens){
        //     this.$router.push({name:'Login'});
        // }
    },
}
</script>





    

