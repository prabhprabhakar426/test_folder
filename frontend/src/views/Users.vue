<template>
  <div class="users-page">
    <NavbarComp :menuItems="menuItems"/>
    <h2 class="title">All Users</h2>

    <!-- Top Actions -->
    <div class="actions">
      <input
        type="text"
        v-model="search"
        placeholder="Search users..."
      />
      <button class="add-btn" v-if="canAddUser" @click="addUser">
        <!-- <button class="add-btn" @click="addUser" > -->
        <i class="fas fa-plus"></i> Add User
      </button>
    </div>

    <!-- Users Table -->
    <table class="bordered-table">
      <thead>
        <tr>
          <th>Sr. No</th>
          <th>Name</th>
          <th>Email</th>
          <th v-if="canDelete">Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(user, index) in filteredUsers" :key="user.id">
          <td class="center">{{ index + 1 }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td class="center" v-if="canDelete">
            <button class="delete" @click="deleteUser(user.id)">
              Delete
            </button>
          </td>
        </tr>

        <tr v-if="filteredUsers.length === 0">
          <td colspan="100%" class="center">No users found</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
import NavbarComp from '@/components/NavbarComp.vue';
import { getRole } from '@/utils/auth';
import { menuItems } from '@/utils/global';
import axios from 'axios';
import {api} from '../utils/interceptor';

export default {
  name: "UsersPage",
  components:{
        NavbarComp
      },

  data() {
    return {
      search: "",
      showAddForm: false,
       menuItems: [],
        users: [],
        newUsers:{
          name: "",
          email: "",
          password:"",
          role: "",
        }
    }
  },
  mounted(){
    this.menuItems = menuItems()
    this.fetchAllUsers();  
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user =>
        user.name.toLowerCase().includes(this.search.toLowerCase()) ||
        user.email.toLowerCase().includes(this.search.toLowerCase()) 
      );
    },
    canAddUser(){
      const role = getRole();
      if(role !== 'ADMIN' || role !== 'MANAGER'){
        return true;
      }
      return false;
    },
    canDelete(){
      const role = getRole();
      if(role === 'ADMIN'){
        return true;
      }
      return false;
    }
  },

  methods: {

    async fetchAllUsers(){
        console.log('fetch all user')
        try {
            // const token = localStorage.getItem('authTokens')

            const result = await api.get('/user/getAllUsers');
            // const result = await axios.get('http://localhost:8080/user/getAllUsers',{
            //   headers:{
            //     Authorization: `Bearer ${localStorage.getItem("authTokens")}`
            //   }
            // });
            console.log(result.data)
            this.users = result.data;
            // console.log(this.users, Array.isArray(this.users));
        } catch (error) {
            console.log('all users '+error.message)
        }        
    },

    async addUser() {

      this.$router.push({name:'Register'});
    },

    async deleteUser(userId) {
      try{
        console.log('delete User ', userId);
        const result = await axios.delete('http://localhost:8080/user/delete',
        {
          data:{id: userId},
          headers:{
            Authorization: `Bearer ${localStorage.getItem("authTokens")}`
          }
        })
        if(result){
          alert('user is deleted')
          await this.fetchAllUsers();
        }
      }
      catch(error){
        console.log(error.message);
        throw error;
      }
    },
  }
};
</script>

<style scoped>
.bordered-table th,
.bordered-table td {
  border: 1px solid #a1def1;
}

.title {
    text-align: center;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.actions input {
  width: 200px;
  padding: 8px;
  margin-left: 20px;
  border-radius: 10px;
  border: 1px solid #6dec62;
}

.add-btn {
  background: #2bb0e4;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-btn:hover {
  background: #2652e2;
}

.add-form {
  margin-bottom: 15px;
}

.add-form input {
  margin-right: 8px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
}

.add-form select {
  margin-right: 8px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
}

.save-btn {
  background: #10b981;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.cancel {
  margin-left: 6px;
  background: #ccc;
  color: #333;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

table {
  width: 75%;
  margin: 10px auto;
  border-collapse: separate;
  border-spacing: 0;
  background: #fdffff;
  border: 1px solid #95d8ec;
  border-radius: 15px;
  overflow: hidden;
}

thead {
  background: linear-gradient(90deg, #1e3a8a, #2563eb);
}

/* Column widths */
thead th:nth-child(1),
tbody td:nth-child(1) {
  width: 10%;   /* Serial No */
}

thead th:nth-child(2),
tbody td:nth-child(2) {
  width: 30%;   /* Name */
}

thead th:nth-child(3),
tbody td:nth-child(3) {
  width: 40%;   /* Email */
}

thead th:nth-child(4),
tbody td:nth-child(4) {
  width: 20%;   /* Action */
}

thead th {
  padding: 12px;
  font-size: 14px;
  color: #ffffff;
  text-align: left;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

thead th:last-child {
  border-right: none;
}

tbody tr {
  transition: background 0.2s;
}

tbody tr:hover {
  background: #f1f5f9;
}

tbody td {
  padding: 12px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

tbody td.center {
  text-align: center;
  padding: 20px;

}

tbody tr:last-child td {
  border-bottom: none;
}

.delete {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 600;
}

.delete:hover {
  background: #dc2626;
}


</style>
