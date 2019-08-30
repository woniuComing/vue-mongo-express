import Vue from 'vue';
import Router from 'vue-router'
import Login from '../components/login'
import Register from '../components/register'
Vue.use(Router)

export default new Router([{
    path: '/',
    redirect: '/login'
}, {
    path: '/login',
    component: Login
}, {
    path: '/register',
    component: Register
}])