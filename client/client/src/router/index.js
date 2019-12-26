import Vue from 'vue';
import VueRouter from 'vue-router';

import firstComponent from '../components/first-component.vue';
import signin from '../components/user/signin-user.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/first-component',
    name: 'firstComponent',
    component: firstComponent,
  },
  {
    path: '/signin',
    name: 'signin',
    component: signin
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
