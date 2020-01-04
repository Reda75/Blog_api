import Vue from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import store from "./store/store";
import BootstrapVue from 'bootstrap-vue';
import Bootstrap from 'bootstrap'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'

Vue.config.productionTip = false;
Vue.use(BootstrapVue, Bootstrap, VueMaterial)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
