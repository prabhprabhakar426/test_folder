<template>
    <div>
        <NavbarComp :menuItems="menuItems"/>
    <div class="profile-card">
    <div class="profile-header">
      <img
        :src="previewImage || profile.profileUrl || defaultImage"
        alt="Profile Photo"
        class="profile-photo"
      />
      <!-- hidden file input triggered by Edit Photo button -->
      <input type="file" ref="photoInput" style="display:none" @change="onFileSelected" accept="image/*" />
      <button class="edit-photo-btn" @click="onEditPhoto">Change Photo</button>
      <h2>Profile</h2>
    </div>

    <div class="profile-row">
      <div class="profile-row-left">
        <span class="label">Name</span>
        <span class="value">{{profile.name}}</span>
      </div>
      <button class="edit-btn">Edit</button>
    </div>

    <div class="profile-row">
      <div class="profile-row-left">
        <span class="label">Role</span>
        <span class="value">{{profile.role}}</span>
      </div>
    </div>

    <div class="profile-row">
      <div class="profile-row-left">
        <span class="label">Email</span>
        <span class="value">{{profile.email}}</span>
      </div>
      <button class="edit-btn">Edit</button>
    </div>

    <div class="profile-row">
      <div class="profile-row-left">
        <span class="label">Joined</span>
        <span class="value">{{formattedDate()}}</span>
      </div>
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
                profileImage:'',
                profile:[],
                menuItems:[],
                previewImage: null,
                selectedFile: null,
                uploading: false
            }
        },
        components:{
            NavbarComp
        },
        mounted(){
            this.menuItems = menuItems();
            this.fetchProfileData();
        },
        computed:{
            
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
            },
            formattedDate() {
              if(this.profile){
                return this.profile.createdOn.split(' ')[0]
              }
              return null;
            },
            onEditPhoto() {
              // trigger the hidden file input
              this.$refs.photoInput.click();
            },
            async onFileSelected(e) {
              const file = e.target.files[0];
              if(!file) return;
              this.selectedFile = file;
              // show local preview
              this.previewImage = URL.createObjectURL(file);

              // Attempt upload if backend endpoint exists; fail gracefully
              try{
                this.uploading = true;
                const userId = getUserId();
                const fd = new FormData();
                fd.append('profileImage', file);
                fd.append('id', userId);
                console.log(api.defaults.baseURL);
                const resp = await api.put('/user/uploadProfilePhoto/',
                  fd,
                  {
                    params: { id: userId }
                  }
                );
                if(resp && resp.data && resp.data.url){
                  // update profile picture to server URL
                  this.profile.profileImage = resp.data.url;
                  alert('Photo uploaded successfully');
                } else {
                  // backend not configured for upload; keep preview
                  alert('Photo selected (preview only). Server upload may not be configured.');
                }
              }
              catch(error){
                console.error('Upload error', error);
                alert('Upload failed — preview is available locally');
              }
              finally{
                this.uploading = false;
              }
            }
        }
    }
</script>

<style scoped>
  /* Edit Photo Button */
  .edit-photo-btn {
    margin: 12px auto 0 auto;
    display: block;
    font-size: 13px;
    padding: 6px 18px;
    border-radius: 22px;
    border: none;
    background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
    color: #fff;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.10);
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
    outline: none;
  }
  .edit-photo-btn:hover {
    background: linear-gradient(90deg, #4338ca 0%, #2563eb 100%);
    transform: translateY(-2px) scale(1.04);
  }
  /* Row with edit button on right */
  .profile-row-edit {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .profile-row-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }
body {
  font-family: 'Poppins', 'Segoe UI', Roboto, Arial, sans-serif;
  background: linear-gradient(135deg, #e0e7ff 0%, #f9fafb 100%);
  margin: 0;
  padding: 40px;
  color: #1f2933;
}

/* Card */
.profile-card {
  max-width: 440px;
  width: 98vw;
  margin: 32px auto;
  background: linear-gradient(120deg, #f8fafc 60%, #e0e7ff 100%);
  border-radius: 18px;
  padding: 12px 14px 8px 14px;
  box-shadow:
    0 8px 24px rgba(30, 64, 175, 0.10),
    0 2px 8px rgba(0, 0, 0, 0.04);
  border: 2px solid;
  border-image: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  border-image-slice: 1;
  position: relative;
  transition: box-shadow 0.2s;
}
.profile-card:hover {
  box-shadow:
    0 16px 40px rgba(30, 64, 175, 0.16),
    0 4px 16px rgba(0, 0, 0, 0.06);
}

/* Header */
.profile-header {
  text-align: center;
  margin-bottom: 18px;
}

.profile-header h2 {
  margin: 16px 0 0;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #3730a3;
  font-family: 'Poppins', 'Segoe UI', Roboto, Arial, sans-serif;
}

/* Profile Image */
.profile-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #6366f1;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.13);
  background: #f3f4f6;
}

/* Rows */
.profile-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 6px 0;
  border-bottom: 1.5px solid #e0e7ff;
}

.profile-row:last-child {
  border-bottom: none;
}

/* Labels */
.label {
  font-size: 15px;
  font-weight: 600;
  color: #6366f1;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  font-family: 'Poppins', 'Segoe UI', Roboto, Arial, sans-serif;
}

/* Values */
.value {
  font-size: 16px;
  font-weight: 500;
  color: #3730a3;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Poppins', 'Segoe UI', Roboto, Arial, sans-serif;
}

/* Edit Button */
.edit-btn {
  font-size: 13px;
  padding: 6px 18px;
  border-radius: 22px;
  border: none;
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.10);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  outline: none;
}
.edit-btn:hover {
  background: linear-gradient(90deg, #4338ca 0%, #2563eb 100%);
  transform: translateY(-2px) scale(1.04);
}

/* Responsive */
@media (max-width: 600px) {
  body {
    padding: 10px;
  }
  .profile-card {
    max-width: 98vw;
    padding: 4px 2vw 6px 2vw;
    border-radius: 12px;
  }
  .profile-header {
    margin-bottom: 10px;
  }
  .profile-row {
    padding: 6px 0 3px 0;
  }
  .profile-header h2 {
    font-size: 20px;
  }
  .profile-photo {
    width: 110px;
    height: 110px;
  }
  .label {
    font-size: 12px;
  }
  .value {
    font-size: 13px;
  }
  .edit-btn {
    font-size: 11px;
    padding: 4px 10px;
  }
}

</style>