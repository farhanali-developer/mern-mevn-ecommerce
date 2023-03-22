<template lang="">
    <div>
        <header>
            <div class="wrapper">
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <div class="container-fluid">
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item" v-if="!getUserProfile.id">
                                    <RouterLink to="/" class="nav-link active">Home</RouterLink>
                                </li>
                                <li class="nav-item" v-if="getUserProfile.id">
                                    <RouterLink to="/products" class="nav-link">All Products</RouterLink>
                                </li>
                                <li class="nav-item" v-if="getUserProfile.id">
                                    <RouterLink to="/bar-graph" class="nav-link">Bar Graph</RouterLink>
                                </li>
                                <li class="nav-item" v-if="getUserProfile.id">
                                    <RouterLink to="/donut-graph" class="nav-link">Donut Graph</RouterLink>
                                </li>
                                <li class="nav-item" v-if="getUserProfile.id">
                                    <RouterLink to="/sale-graph" class="nav-link">Sale Graph</RouterLink>
                                </li>
                                <li class="nav-item" v-if="getUserProfile.id">
                                    <RouterLink to="/profile" class="nav-link">Profile</RouterLink>
                                </li>
                                <li class="nav-item" v-if="getUserProfile.id">
                                    <RouterLink to="/orders" class="nav-link">Orders</RouterLink>
                                </li>
                            </ul>
                            <!-- <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Dropdown button
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#">Action</a></li>
                                <li><a class="dropdown-item" href="#">Another action</a></li>
                                <li><a class="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                            </div> -->
                            <div>
                                <div class="d-inline" v-if="getUserProfile.id">
                                    <RouterLink to="/add-product"><button class="btn btn-outline-success" >Add Product</button></RouterLink>
                                    <RouterLink to="/import-products"><button class="btn btn-outline-danger ms-2 me-3">Import Products</button></RouterLink>
                                    <!-- <RouterLink to="/login"><button class="btn btn-secondary ms-2" @click="logout">Logout</button></RouterLink> -->
                                    <!-- <RouterLink to="/cart"><font-awesome-icon icon="fa-solid fa-cart-shopping" size="lg" /></RouterLink> -->
                                    <RouterLink to="/cart">
                                        <button type="button" class="btn btn-outline-primary position-relative">
                                            <font-awesome-icon icon="fa-solid fa-cart-shopping" size="lg" />
                                            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                99+
                                            <span class="visually-hidden">unread messages</span>
                                            </span>
                                        </button>
                                    </RouterLink>
                                    <button class="btn btn-secondary ms-4" @click="logout">Logout</button>
                                    
                                </div>
                                <div class="d-inline" v-if="!getUserProfile.id">
                                    <RouterLink to="/login"><button class="btn btn-success ms-2">Login</button></RouterLink>
                                    <RouterLink to="/signup"><button class="btn btn-primary ms-2">Register</button></RouterLink>
                                </div>
                                
                                
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    </div>
</template>
<script>
import axios from 'axios'
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
    computed: {
    ...mapGetters("auth", {
      getUserProfile: "getUserProfile",
      getLogout: "getLogout",
    }),
  },
  methods: {
    ...mapActions("auth", {
      userLogout: "userLogout",
    }),
    ...mapMutations("auth", {
      setLogout: "setLogout",
      setUserProfile: "setUserProfile",
    }),
    async logout() {
      await this.userLogout();
      if (this.getLogout == false) {
        const resetUser = {
          id: 0,
          email: "",
          full_name: "",
          password: "",
        };
        this.setUserProfile(resetUser);
        this.setLogout(false);
        this.$router.push("/login");
      }
    },
  },
}
</script>
<style lang="">
    
</style>