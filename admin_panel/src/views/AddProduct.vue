<template lang="">
    <div class="row justify-content-center mt-5 pt-5 h-100">
        <div class="col-12">
            <h2>Add New Product</h2>
            <form @submit.prevent="submit()">
                <div class="row mt-5">
                    <div class="mb-3 col-12 col-md-6">
                        <label for="productTitle" class="form-label">Product Title</label>
                        <input type="text" class="form-control" id="productTitle" v-model="state.title">
                    </div>
                    <div class="mb-3 col-12 col-md-6">
                        <label for="productThumbnail" class="form-label">Product Thumbnail URL</label>
                        <input type="url" class="form-control" id="productThumbnail" v-model="state.thumbnail">
                    </div>
                    <div class="mb-3 col-12 col-md-6">
                        <label for="productBrand" class="form-label">Product Brand</label>
                        <input type="text" class="form-control" id="productBrand" v-model="state.brand">
                    </div>
                    <div class="mb-3 col-12 col-md-6">
                        <label for="productCategory" class="form-label">Product Category</label>
                        <input type="text" class="form-control" id="productCategory" v-model="state.category">
                    </div>
                    <div class="mb-3 col-12">
                        <label for="productSale" class="form-label">Product Sale</label>
                        <input type="text" class="form-control" id="productSale" v-model="state.sale">
                    </div>
                    <div class="mb-3 col-12">
                        <label for="productDescription" class="form-label">Product Description</label>
                        <textarea class="form-control" id="productDescription" rows="3" v-model="state.description"></textarea>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    </div>
</template>
<script>
import productsCrud from '../modules/productsCrud'
  export default {
    setup() {
      const { state, newProduct} = productsCrud()
      return { state, newProduct}
    }, 
    mounted(){
    },
    methods: {
        async submit(){
            const res = await this.newProduct()
            if(res === "added"){
                this.$router.push("/")
            }
        }
    }
  }
</script>
<style lang="">
    
</style>