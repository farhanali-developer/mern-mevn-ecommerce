<template lang="">
    <div class="row justify-content-center mt-5 pt-5 h-100">
        <div class="col-12">
            <h2>Add New Product</h2>
            <form @submit.prevent="submit()">
                <div class="row mt-5">
                    <div class="mb-3 col-12 col-md-6">
                        <label for="productTitle" class="form-label">Product Title</label>
                        <input type="text" class="form-control" id="productTitle" v-model="this.title">
                    </div>
                    <div class="mb-3 col-12 col-md-6">
                        <label for="productThumbnail" class="form-label">Product Thumbnail URL</label>
                        <input type="file" class="form-control" id="productThumbnail" ref="myfile">
                    </div>
                    <div class="mb-3 col-12 col-md-6">
                        <label for="productBrand" class="form-label">Product Brand</label>
                        <input type="text" class="form-control" id="productBrand" v-model="this.brand">
                    </div>
                    <div class="mb-3 col-12 col-md-6">
                        <label for="productCategory" class="form-label">Product Category</label>
                        <input type="text" class="form-control" id="productCategory" v-model="this.category">
                    </div>
                    <div class="mb-3 col-12">
                        <label for="productSale" class="form-label">Product Sale</label>
                        <input type="text" class="form-control" id="productSale" v-model="this.sale">
                    </div>
                    <div class="mb-3 col-12">
                        <label for="productDescription" class="form-label">Product Description</label>
                        <textarea class="form-control" id="productDescription" rows="3" v-model="this.description"></textarea>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    </div>
</template>
<script>
import productsCrud from '../modules/productsCrud'
import { storage } from '../main'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { ref as refs } from 'vue'

// import { getStorage, ref as stRef, uploadBytes } from "firebase/storage";


  export default {
    data(){
        return{
            productImage: null,
            title: '',
            description: '',
            thumbnail: '',
            brand: '',
            category: '',
            sale: ''
        }
    },
    setup() {
      const { state, newProduct} = productsCrud()
      return { state, newProduct}
    }, 
    mounted(){
    },
    methods: {
        onFileChange(e) {

        },
        async submit(){

            const file = this.$refs.myfile.files[0]; //get file object
            const fileName = this.$refs.myfile.files[0].name; //get file name
            const storageRef = ref(storage, fileName)
            await uploadBytes(storageRef, file).then((snapshot) => {
                // console.log(snapshot)

                const avatarUrl = getDownloadURL(storageRef)
                    .then((url) => {
                    // This is correct url
                    console.log('URL', url)
                    if(url){
                        this.productImage = url;
                        // alert("Image Uploaded");
                        const productData = refs({
                            title: this.title,
                            description: this.description,
                            thumbnail: this.productImage,
                            brand: this.brand,
                            category: this.category,
                            sale: this.sale
                        })
                        const res = this.newProduct(productData)
                        if(res === "added"){
                            this.$router.push("/products")
                            console.log("Product Upload done")
                        }
                    }
                    return url
                    })
                    .catch((err) => {
                    console.log('Error with file url', err)
                    })
                // This logs promise pending with correct url inside
                console.log('avatarUrl', avatarUrl)  
            })

            
        }
    }
  }
</script>
<style lang="">
    
</style>