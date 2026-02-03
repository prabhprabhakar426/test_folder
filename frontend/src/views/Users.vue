<template>
  <div class="users-page">
    <NavbarComp :menuItems="menuItems"/>
    <h2 class="title">All Users</h2>

    <!-- Top Actions -->
    <div class="actions-bar">
      <div class="search-group">
        <i class="fas fa-search search-icon"></i>
        <input
          type="text"
          v-model="search"
          placeholder="Search users..."
          class="search-input"
        />
      </div>
      <button class="add-btn-pro" v-if="canAddUser" @click="addUser">
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

/* Enhanced Users Table Design */
.bordered-table {
  border-radius: 18px;
  overflow: hidden;
  border: 3px solid #38bdf8;
  box-shadow: 0 4px 24px rgba(99,102,241,0.10);
  background: #f8fafc;
  width: 100%;
  margin: 0 auto 24px auto;
  font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
  font-size: 15px;
  border-collapse: separate;
  border-spacing: 0;
}
.bordered-table th, .bordered-table td {
  padding: 14px 10px;
  text-align: center;
}
.bordered-table th {
  background: linear-gradient(90deg, #38bdf8 0%, #6366f1 100%);
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  border-bottom: 2px solid #e0e7ff;
  letter-spacing: 0.5px;
}
.bordered-table tbody tr:nth-child(even) {
  background: #e0e7ff;
}
.bordered-table tbody tr:nth-child(odd) {
  background: #f8fafc;
}
.bordered-table tbody tr:hover {
  background: #c7d2fe;
  transition: background 0.18s;
}
.bordered-table td {
  color: #3730a3;
  font-weight: 500;
  border-bottom: 1px solid #e0e7ff;
}
.bordered-table td.center {
  text-align: center;
}
.bordered-table th:first-child, .bordered-table td:first-child {
  border-left: none;
}
.bordered-table th:last-child, .bordered-table td:last-child {
  border-right: none;
}
.bordered-table tr:last-child td {
  border-bottom: none;
}

/* Professional Actions Bar */
.actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(90deg, #f8fafc 60%, #e0e7ff 100%);
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(99,102,241,0.07);
  padding: 18px 24px 14px 24px;
  margin-bottom: 24px;
  gap: 18px;
  flex-wrap: wrap;
}
.search-group {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(99,102,241,0.04);
  padding: 0 10px;
  border: 1.5px solid #e0e7ff;
  min-width: 220px;
  flex: 1 1 220px;
  max-width: 320px;
}
.search-icon {
  color: #6366f1;
  font-size: 16px;
  margin-right: 7px;
}
.search-input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  padding: 10px 0;
  width: 100%;
  color: #3730a3;
  font-family: inherit;
}
.search-input::placeholder {
  color: #a5b4fc;
  font-size: 14px;
}
.add-btn-pro {
  background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 22px;
  font-weight: 700;
  font-size: 15px;
  box-shadow: 0 2px 8px rgba(99,102,241,0.10);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  transition: background 0.18s, transform 0.18s;
}
.add-btn-pro:hover {
  background: linear-gradient(90deg, #4338ca 0%, #2563eb 100%);
  transform: translateY(-2px) scale(1.04);
}
@media (max-width: 900px) {
  .actions-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 12px 8px 10px 8px;
  }
  .search-group {
    max-width: 100%;
    min-width: 0;
  }
  .bordered-table th, .bordered-table td {
    padding: 8px 4px;
    font-size: 13px;
  }
  .bordered-table {
    font-size: 13px;
  }
}
@media (max-width: 600px) {
  .bordered-table {
    font-size: 11px;
    border-radius: 8px;
  }
  .bordered-table th, .bordered-table td {
    padding: 5px 2px;
  }
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
