import axios from "axios";

const state = () => ({
    loginApiStatus: "",
    userProfile:{
        id: 0,
        full_name:"",
        email:"",
        password: ""
    },
    logOut: false
  });


   
  const getters = {
    getLoginApiStatus(state) {
        return state.loginApiStatus;
    },
    getUserProfile(state){
        return state.userProfile;
    },
    getLogout(state) {
        return state.logOut;
    }
  };
   
  const actions = {
    async loginApi({ commit }, payload) {
      const response = await axios.post("/login", payload,{withCredentials: true, credentials: 'include'})
        .catch((err) => {
          console.log(err);
        });
   
      if (response && response.data) {
        commit("setLoginApiStatus", "success");
      } else {
        commit("setLoginApiStatus", "failed");
      }
    },

    async userProfile({commit}){
        const response = await axios.get("/user",{withCredentials: true, credentials: 'include'})
        .catch((err) => {
          console.log(err);
        });
       
        if(response && response.data){
          commit("setUserProfile", response.data)
        }
    },
    async userLogout({ commit }) {
        const response = await axios
          .post("/logout", {
            withCredentials: true,
            credentials: "include",
          })
          .catch((err) => {
            console.log(err);
          });
    
        if (response && response.data) {
          commit("setLogout", true);
          localStorage.removeItem("jwt");
        } else {
          commit("setLogout", false);
        }
    },
  };
   
  const mutations = {
    setLoginApiStatus(state, data) {
      state.loginApiStatus = data;
    },
    setUserProfile(state, data) {
        const userProfile = {
          id: data._id,
          full_name: data.full_name,
          email: data.email,
          password: data.password
        };
        state.userProfile = userProfile;
      },
    
      setLogout(state, payload) {
        state.logOut = payload;
      }
  };
   
  export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
  };