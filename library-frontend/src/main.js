import Vue from 'vue'
import vuetify from './plugins/vuetify';
import App from './App.vue'
import router from './router'
import store from './store'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@babel/polyfill'

import axios from 'axios';
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios);

Vue.prototype.$axios = axios

Vue.config.productionTip = false

axios.defaults.withCredentials = true

import TabNav from './components/TabNav.vue'
Vue.component('TabNav', TabNav)

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')