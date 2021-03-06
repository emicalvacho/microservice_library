import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/SignUp.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/UserHome.vue')
  },
  {
    path: '/books',
    name: 'books',
    component: () => import('../views/AdminBooks.vue')
  },
  {
    path: '/loans',
    name: 'loans',
    component: () => import('../views/AdminLoans.vue')
  },
  {
    path: '/partners',
    name: 'partners',
    component: () => import('../views/AdminPartners.vue')
  },
  {
    path: '/home_admin',
    name: 'home_admin',
    component: () => import('../views/AdminHome.vue')
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
