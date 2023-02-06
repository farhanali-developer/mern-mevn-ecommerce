<template lang="">
    <div class="mt-5">
        <div class="row justify-content-center mt-5">
            <div class="col-12 col-md-6">
                <form @submit.prevent="submit()" ref="signupForm">
                    <div class="mb-3">
                        <label for="fullName" class="form-label">Full Name *</label>
                        <input type="text" class="form-control" id="fullName" required v-model="getUserProfile.full_name">
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email address *</label>
                        <input type="email" class="form-control" id="email" aria-describedby="emailHelp" required v-model="getUserProfile.email">
                        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password *</label>
                        <input type="password" class="form-control" id="password" required v-model="getUserProfile.password">
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import productsCrud from '../modules/productsCrud'
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
    computed: {
    ...mapGetters("auth", {
      getUserProfile: "getUserProfile",
    }),
  },
}
</script>
<style lang="">
    
</style>