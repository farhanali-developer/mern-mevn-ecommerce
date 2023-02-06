<template lang="">
    <div class="row justify-content-between mt-5">
        <div class="col-12 col-md-5">
            <img class="w-100" v-bind:src="`${product.thumbnail}`" />
        </div>
        <div class="col-12 col-md-6">
            <h2>{{ product.title }}</h2>
            <p>{{ product.description }}</p>
            <p><b>Brand: </b>{{ product.brand }}</p>
            <p class="mb-5"><b>Category: </b>{{ product.category }}</p>
            <input class="form-control" type="number" placeholder="Quantity" style="max-width:150px"/>
            <button class="btn btn-success mt-3">Add to Cart</button>
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