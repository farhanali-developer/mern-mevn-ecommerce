<template lang="">
    <div class="row justify-content-center mt-5 pt-5 h-100">
        <div class="col-12">
            <h2>Update Product</h2>
            <form @submit.prevent="submit()">
                <div class="row mt-5">
                    <div class="mb-3 col-12 col-md-6">
                        <label for="productTitle" class="form-label">Product Title</label>
                        <input type="text" class="form-control" id="productTitle" v-model="product.title">
                    </div>
                    <div class="mb-3 col-12 col-md-6">
                        <label for="productThumbnail" class="form-label">Product Thumbnail URL</label>
                        <input type="url" class="form-control" id="productThumbnail" v-model="product.thumbnail">
                    </div>
                    
                    <div class="mb-3 col-12 col-md-6">
                        <label for="productBrand" class="form-label">Product Brand</label>
                        <input type="text" class="form-control" id="productBrand" v-model="product.brand">
                    </div>
                    <div class="mb-3 col-12 col-md-6">
                        <label for="productCategory" class="form-label">Product Category</label>
                        <input type="text" class="form-control" id="productCategory" v-model="product.category">
                    </div>
                    <div class="mb-3 col-12">
                        <label for="productSale" class="form-label">Product Sale</label>
                        <input type="text" class="form-control" id="productSale" v-model="product.sale">
                    </div>
                    <div class="mb-3 col-12">
                        <label for="productDescription" class="form-label">Product Description</label>
                        <textarea class="form-control" id="productDescription" rows="3" v-model="product.description"></textarea>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    </div>
</template>
<script lang="ts">
import productsCrud from '../modules/productsCrud'
import { useRoute , useRouter } from 'vue-router'

  export default {
    data: function(){
        return{
            product: null,
        }
    },
    setup() {
      const { state, editProduct, GetSpecificProduct, product, productId } = productsCrud()
      GetSpecificProduct()
      return { state, editProduct, GetSpecificProduct, product, productId }
    },
    mounted(){
        this.updateData("*", "*")
    },
    methods: {
        async updateData(limit, page){
            const { GetSpecificProduct } = productsCrud()
            await GetSpecificProduct(this.$router.currentRoute.value.params.id, limit, page).then((res)=>{
                this.product = res
                // console.log("Response: " + res)
            })
        },

        async submit(){
            const { editProduct } = productsCrud()
            const data = await editProduct(this.product, this.$router.currentRoute.value.params.id)
            if(data){
                this.$router.push("/")
            }

            // console.log(data)
        }
    },
  }
</script>
<style lang="">
    
</style>