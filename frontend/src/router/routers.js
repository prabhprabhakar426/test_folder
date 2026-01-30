import Vue from 'vue'
import Router from 'vue-router'

import HomePage from '@/components/Home.vue'
import Register from '@/views/Register.vue'
import Login from '@/views/Login.vue'
import Users from '@/views/Users.vue'
import ProductList from '@/components/ProductList.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import AddProduct from '@/components/AddProduct.vue'
import BuyProduct from '@/components/BuyProduct.vue'
import OrdersList from '@/components/OrdersList.vue'
import ProductUpdateForm from '@/components/ProductUpdateForm.vue'
import ProfilePage from '@/components/ProfilePage.vue'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/user/register',
    name: 'RegisterForm',
    component: RegisterForm
  },
  
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/profile',
    name: 'ProfilePage',
    component: ProfilePage
  },
  {
    path:'/users',
    name: 'Users',
    component: Users
  },
  {
    path:'/products',
    name: 'ProductList',
    component: ProductList
  },
  {
    path:'/orders',
    name: 'OrdersList',
    component: OrdersList
  },
  {
    path:'/products/addProducts',
    name: 'AddProduct',
    component: AddProduct
  },
  {
    path:'/products/buyproduct',
    name: 'BuyProduct',
    component: BuyProduct
  },
  {
    path:'/products/delete',
    name: 'ProductUpdateForm',
    component: ProductUpdateForm
  },
  
]

export default new Router({
  mode: 'history',
  routes
})
