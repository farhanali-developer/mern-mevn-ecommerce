<template lang="">
    <div class="row justify-content-center mt-5 pt-5 h-100">
        <div class="col-12 col-md-6">
            <div class="alert alert-success" role="alert" v-if="message === 'Success'">
                Login Success!
            </div>
            <div class="alert alert-danger" role="alert" v-else-if="message === 'Invalid Credentials'">
                Invalid Credentials!
            </div>
            <div class="alert alert-danger" role="alert" v-else-if="message === 'User not found'">
                User not found.
            </div>
            <form @submit.prevent="submit()" ref="loginForm">
                <div class="mb-3">
                    <label for="email" class="form-label">Email address *</label>
                    <input type="email" class="form-control" id="email" aria-describedby="emailHelp" required v-model="loginData.email">
                    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password *</label>
                    <input type="password" class="form-control" id="password" required v-model="loginData.password">
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
            <hr />
            <h2 class="text-center">OR</h2>
            <hr />
            <button class="btn btn-success" @click="signInWithGoogle()">Login with Google</button>
            <div class="mt-5 text-center">
                <a href="#">Forgot Password</a>
                <p class="mt-4">Don't have an account? <RouterLink to="/signup" class="text-bold">Register Here</RouterLink></p>
            </div>
        </div>
    </div>
</template>
<script>
import productsCrud from '../modules/productsCrud'
import { mapActions, mapGetters } from "vuex";
import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider  } from 'firebase/auth'
export default {
    data: function() {
        return {
            message: ''
        }
    },
    setup() {
        const { loginData, login } = productsCrud()
        return { loginData, login}
    }, 
    computed: {
        ...mapGetters("auth", {
        getLoginApiStatus: "getLoginApiStatus",
        }),
    },
    methods: {
        ...mapActions("auth", {
            actionLoginApi: "loginApi",
        }),

        async submit(){
            console.log(this.loginData.email)
            console.log(this.loginData.password)
            const res = await this.login()
            const payload = {
                email: this.loginData.email,
                password: this.loginData.password,
                role: "admin"
            };
            await this.actionLoginApi(payload);
            if(this.getLoginApiStatus == "success"){
                this.$router.push("/products");
            }else{
                alert("failed")
            }
            // this.$refs.loginForm.reset();
            // if(res === "loggedIn"){
            //     this.$router.push("/login")
            // }
            // console.log(res)
            this.message = res.message
        },

        signInWithGoogle(){
            const provider = new GoogleAuthProvider();
            const auth = getAuth();
            signInWithRedirect(auth, provider);
            getRedirectResult(auth)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access Google APIs.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;

                // The signed-in user info.
                const user = result.user;
                console.log(user)
                this.$refs.loginForm.reset();
                this.$router.push("/products")

            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log(errorMessage)
                // ...
            });
        }
    }
}
</script>
<style lang="">
    
</style>