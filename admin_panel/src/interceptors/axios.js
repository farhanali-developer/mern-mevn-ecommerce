import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://127.0.0.1:5000/api/'
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwt')