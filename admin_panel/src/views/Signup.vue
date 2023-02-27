<template lang="">
     <div class="row justify-content-center mt-5 pt-5 h-100">
        <div class="col-12 col-md-6">
            <form @submit.prevent="submit()" ref="signupForm">
                <div class="mb-3">
                    <label for="fullName" class="form-label">First Name *</label>
                    <input type="text" class="form-control" id="firstName" required v-model="registerData.first_name">
                </div>
                <div class="mb-3">
                    <label for="fullName" class="form-label">Last Name *</label>
                    <input type="text" class="form-control" id="lastName" required v-model="registerData.last_name">
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email address *</label>
                    <input type="email" class="form-control" id="email" aria-describedby="emailHelp" required v-model="registerData.email">
                    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password *</label>
                    <input type="password" class="form-control" id="password" required v-model="registerData.password">
                </div>
                <div class="mb-3">
                    <label for="confirmPassword" class="form-label">Confirm Password *</label>
                    <input type="password" class="form-control" id="confirmPassword" required>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
            <hr />
            <h2 class="text-center">OR</h2>
            <hr />
            <button class="btn btn-success" @click="signUpWithGoogle()">Sign Up with Google</button>
            <div class="mt-5 text-center">
                <p>Already have an account? <RouterLink to="/login" class="text-bold">Login</RouterLink></p>
            </div>
        </div>
    </div>
</template>
<script>
import productsCrud from '../modules/productsCrud'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

export default {
    setup() {
      const { registerData, signup } = productsCrud()
      return { registerData, signup }
    }, 
    mounted(){
        
    },
    methods: {
        submit(){
            const res = this.signup()
            this.$refs.signupForm.reset();
            if(res === "user added"){
                this.$router.push("/login")
            }
        },

        signUpWithGoogle(){
            const provider = new GoogleAuthProvider();
            const auth = getAuth();
            signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result)
                this.$refs.signupForm.reset();
                this.$router.push("/login")
            }).catch((error) => {
                console.log(error)
            });
        }
    }
}
</script>
<style lang="">
    
</style>