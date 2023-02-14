import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from "vue3-apexcharts";
import './interceptors/axios'
import store from './stores/index'
import App from './App.vue'
import router from './router'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.js"
import "bootstrap"
import './assets/main.css'
import {VueCsvImportPlugin} from "vue-csv-import";
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCartShopping)

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAXt4G1bKnnV4WimWv6QI3p1ZUBVoCcLE",
  authDomain: "mevn-881bb.firebaseapp.com",
  projectId: "mevn-881bb",
  storageBucket: "mevn-881bb.appspot.com",
  messagingSenderId: "479055639686",
  appId: "1:479055639686:web:59d6b619def77078388d07",
  measurementId: "G-9LZP5B4WHG"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp)
export {storage}
// const analytics = getAnalytics(newApp);






const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueApexCharts);
app.use(VueCsvImportPlugin);
app.use(VueAwesomePaginate);
app.use(store);
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
