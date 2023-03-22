import { createRouter, createWebHistory } from 'vue-router'
import store from "../stores/index";
import Home from '../views/HomeView.vue';
import AllProducts from '../views/AllProducts.vue'
import BarGraph from '../views/Graphs.vue'
import DonutGraph from '../views/DonutGraph.vue'
import SaleGraph from '../views/SaleGraph.vue'
import ImportProducts from '../views/ImportProducts.vue'
import AddProducts from '../views/AddProduct.vue'
import UpdateProducts from '../views/UpdateProduct.vue'
import SingleProduct from '../views/SingleProduct.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Profile from '../views/Profile.vue'
import Orders from '../views/Orders.vue'
import OrderPage from '../views/OrderPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiredAuth: false }
    },
    {
      path: '/orders',
      name: 'Orders',
      component: Orders,
      meta: { requiredAuth: false }
    },
    {
      path: '/order/:id',
      name: 'OrderPage',
      component: OrderPage,
      meta: { requiredAuth: true }
    },
    {
      path: '/products',
      name: 'AllProducts',
      component: AllProducts,
      meta: { requiredAuth: true }
    },
    {
      path: '/bar-graph',
      name: 'Graphs',
      component: BarGraph,
      meta: { requiredAuth: true }
    },
    {
      path: '/donut-graph',
      name: 'Donut Graph',
      component: DonutGraph,
      meta: { requiredAuth: true }
    },
    {
      path: '/sale-graph',
      name: 'Sale Graph',
      component: SaleGraph,
      meta: { requiredAuth: true }
    },
    {
      path: '/import-products',
      name: 'Import Products',
      component: ImportProducts,
      meta: { requiredAuth: true }
    },
    {
      path: '/add-product',
      name: 'addproduct',
      component: AddProducts,
      meta: { requiredAuth: true }
    },
    {
      path: '/update-product/:id',
      name: 'updateproduct',
      component: UpdateProducts,
      meta: { requiredAuth: true }
    },
    {
      path: '/product/:id',
      name: 'singleproduct',
      component: SingleProduct,
      meta: { requiredAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiredAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiredAuth: false }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: { requiredAuth: false }
    },

  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiredAuth) {
    var userProfile = store.getters["auth/getUserProfile"];
    if (userProfile.id === 0) {
      await store.dispatch("auth/userProfile");
      userProfile = store.getters["auth/getUserProfile"];
      if (userProfile.id === 0) {
        return next({ path: "/login" });
      } else {
        return next();
      }
    }
  }
  return next();
});

export default router
