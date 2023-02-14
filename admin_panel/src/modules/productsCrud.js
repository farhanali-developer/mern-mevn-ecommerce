import { ref, computed } from 'vue'
import { useRoute , useRouter } from 'vue-router'
import axios from 'axios'

const getProducts = () => {

  const route = useRoute();
  const router = useRouter();

  const productId = computed(() => route.params.id)

  const state = ref({
    title: '',
    description: '',
    thumbnail: '',
    brand: '',
    category: '',
    sale: ''
  })

  const registerData = ref({
    full_name: '',
    email: '',
    password: '',
  })

  const userData = ref({
    full_name: '',
    email: '',
    password: '',
  })

  const loginData = ref({
    email: '',
    password: '',
  })

  const getAllProducts = async (limit, page) => {
    try {
        const res = await axios.get("/?limit="+limit+"&page="+page+"")
        return res;
    }
    catch(error) {
      console.log(error)
    }
  }
  
   const newProduct = async (data) => { 
      // const data = {
      //   title: state.value.title,
      //   description: state.value.description,
      //   thumbnail: state.value.thumbnail,
      //   brand: state.value.brand,
      //   category: state.value.category,
      //   sale: state.value.sale
      // }
      const rawObject = JSON.parse(JSON.stringify(data.value));
      // console.log(rawObject)

    const res = await axios.post("/add_product", rawObject, {headers: { "Content-Type": "application/json" },})
    return "added"
      // return res
   }


   const signup = async () => { 

    const data = {
      full_name: registerData.value.full_name,
      email: registerData.value.email,
      password: registerData.value.password,
    }

    await axios.post("/signup", data, {headers: { "Content-Type": "application/json" },})
    return "user added"
  }

   const login = async () => { 

    const data = {
      email: loginData.value.email,
      password: loginData.value.password,
    }

    const res = await axios.post("/login", data, 
    { withCredentials: true,
      headers: 
        { 
          "Content-Type": "application/json",
        },
        
    }
    )
    // return "loggedIn"
    return res
  }

   const logout = async () => { 

    const res = await axios.delete("/logout", 
    { withCredentials: true,
      headers: 
        { 
          "Content-Type": "application/json",
        },
        
    }
    )
    // return "loggedIn"
    return res
  }

   const user = async () => { 
    const requestOptions = {
      withCredentials: true,
      headers: {"Content-Type": "application/json"},
    }
    const res = await axios.get("/user", 
    requestOptions)
    // return "loggedIn"
    return res
  }

   const csvProducts = async (data) => { 
     const headers = {
       headers: {
         "Content-Type": "application/json"
       } 
     }

     const newData = data
     await axios.post("/csv_products", newData, headers)
     return "imported"
   }
  

  const deleteProduct = async (_id) => {
    await axios.delete("/delete/" + _id)
    return "deleted"
  }

  const deleteAllProducts = async () => {
    await axios.delete("/deleteAll")
    return "deletedAll"
  }


  const editProduct = async (data, id) => { 
    const headerOptions = {
      headers: {
        "Content-Type": "application/json"
      },
    }
    const newData = data
    const res = await axios.put("/update/" + id, data, headerOptions)
    console.log(res)
    return res
  }







  const product = ref({})
  const GetSpecificProduct = async (id, limit, page) => {
    try {
      const res = await axios.get("/?limit="+limit+"&page="+page+"")
      const data = await res.data
      return data.find((item)=>{
        return item._id === id
      })
    }
    catch(error) {
      console.log(error)
    }
  }


  return {
    state,
    productId,
    product,
    getAllProducts, 
    newProduct,
    csvProducts,
    deleteProduct,
    deleteAllProducts,
    editProduct,
    GetSpecificProduct,
    registerData,
    signup,
    loginData,
    login,
    logout,
    userData,
    user
  }
}

export default getProducts