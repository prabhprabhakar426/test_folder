<template>
    <div>
        <NavbarComp :menuItems="menuItems"/>
    <div class="profile-card">
    <div class="profile-header">
      <img
        :src="defaultImage"
        alt="Profile Photo"
        class="profile-photo"
      />
      <h2>Profile</h2>
    </div>

    <div class="profile-row">
      <span class="label">Name</span>
      <span class="value">
        {{profile.name}}
        <button class="edit-btn">Edit</button>
      </span>
    </div>

    <div class="profile-row">
      <span class="label">Role</span>
      <span class="value">{{profile.role}}</span>
    </div>

    <div class="profile-row">
      <span class="label">Email</span>
      <span class="value">{{profile.email}} </span>
    </div>

    <div class="profile-row">
      <span class="label">Joined</span>
      <span class="value">{{formattedDate}}</span>
    </div>
  </div>
  </div>
</template>

<script>
import { getUserId } from '@/utils/auth';
// import axios from 'axios';
import { api } from '@/utils/interceptor';
import NavbarComp from './NavbarComp.vue';
import { menuItems } from '@/utils/global';

    export default{
        name: 'ProfilePage',
        data(){
            return{
                defaultImage:'/no-image.png',
                profile:{},
                menuItems:[]
            }
        },
        components:{
            NavbarComp
        },
        mounted(){
            this.menuItems = menuItems()
            this.fetchProfileData();
        },
        computed:{
            formattedDate() {
                return this.profile.createdOn.split(' ')[0]
            }
        },
        methods:{
            async fetchProfileData(){
                const userId = getUserId();
                const response = await api.get('/user/getUser',{
                  params:{
                    id: userId
                  }
                });
                // const response = await axios.get('http://localhost:8080/user/getUser',{
                //     params:{
                //         id: userId
                //     },
                //     headers:{
                //         Authorization: `Bearer ${localStorage.getItem('authTokens')}`
                //     }
                // });
                if(response){
                    this.profile = response.data;
                    console.log(this.profile);
                }
            }
        }
    }
</script>

<style scoped>
   body {
  font-family: "Segoe UI", Roboto, Arial, sans-serif;
  background: linear-gradient(135deg, #eef2f7, #f9fafb);
  margin: 0;
  padding: 40px;
  color: #1f2933;
}

/* Card */
.profile-card {
  max-width: 520px;
  margin: auto;
  background: #ffffff;
  border-radius: 14px;
  padding: 28px;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.08),
    0 4px 10px rgba(0, 0, 0, 0.04);
}

/* Header */
.profile-header {
  text-align: center;
  margin-bottom: 28px;
}

.profile-header h2 {
  margin: 12px 0 0;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

/* Profile Image */
.profile-photo {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e5e7eb;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}

/* Rows */
.profile-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f0f2f5;
}

.profile-row:last-child {
  border-bottom: none;
}

/* Labels */
.label {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Values */
.value {
  font-size: 15px;
  font-weight: 500;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Edit Button */
.edit-btn {
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid #2563eb;
  background-color: #2563eb;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.edit-btn:hover {
  background-color: #1e40af;
  border-color: #1e40af;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 600px) {
  body {
    padding: 20px;
  }

  .profile-card {
    padding: 22px;
  }

  .label {
    font-size: 13px;
  }

  .value {
    font-size: 14px;
  }
}

</style>