import Vue from 'vue';
import Router from 'vue-router'
import Login from '../components/login/index.vue'
import Register from '../components/register/index.vue'
import Layout from '../components/layout/index.vue'
import List from '../components/list/index.vue'
Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/layout',
            name: 'layout',
            component: Layout,
            children: [{
                path: 'list',
                name: 'list',
                component: List
            }]
        }
    ]
})