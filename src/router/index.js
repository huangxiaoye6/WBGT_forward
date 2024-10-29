import {createRouter, createWebHistory} from "vue-router";

const routes=[
    {
        path:'/',
        component:()=>import('@/views/Login.vue')
    },
    {
        path:'/login',
        component:()=>import('@/views/Login.vue'),
        name:'login'
    },
    {
        path:"/home",
        component:()=>import('@/views/Home.vue'),
        name:'home'
    }
]
const router=createRouter({
    routes:routes,
    history:createWebHistory(),
})
router.beforeEach((to, from, next) => {
    const isAuthenticated=localStorage.getItem('token')
    if (to.name !== 'login' && !isAuthenticated) next({ name: 'login' })
    else next()
})
export default router;