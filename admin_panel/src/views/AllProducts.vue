<template lang="">
    <div>
        <div class="row justify-content-between mt-5">
            <div class="col-12 col-md-2">
                <button class="btn btn-danger" @click="deleteAll()">Delete All Products</button>
            </div>
        </div>
        <div class="row justify-content-start">
            <div class="col-12 col-md-6 col-lg-3 mt-5" v-for="product in products" :key="product._id" v-bind:id="`${product._id}`">
                <div class="card h-100" style="width: 18rem;">
                    <img height="200" style="object-fit: cover;" v-bind:src="`${product.thumbnail}`" class="card-img-top" alt="...">
                    <div class="card-body">
                        <router-link :to="`product/${product._id}`">
                            <h5 class="card-title">{{product.title}}</h5>
                        </router-link>
                        <p class="card-text">{{product.description}}</p>
                    </div>
                    <div class="card-footer">
                        <div class="d-flex justify-content-between align-items-center">
                            <button class="btn btn-danger" @click="deleteSingleProduct(product._id)">Delete</button>
                            <router-link :to="`update-product/${product._id}`">
                                <button class="btn btn-primary">Edit</button>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row justify-content-center mt-5">
            <div class="col-12 mt-5 text-center">
                <vue-awesome-paginate
                    :total-items="totalProducts"
                    :items-per-page="12"
                    :max-pages-shown="5"
                    :hidePrevNextWhenEnds="true"
                    :showJumpButtons="true"
                    :showEndingButtons="true"
                    v-model="currentPage"
                    :on-click="paginationHandler"
                />
            </div>
        </div>
    </div>
</template>
<script>
import productsCrud from '../modules/productsCrud'
import { onMounted } from 'vue'
  export default {
    setup(){
    },
    data: function() {
        return {
            products: [],
            totalProducts: 0,
            currentPage: 1
        }
    },
    mounted() {
        this.setProducts(12,1);
    },
    methods: {
        setProducts(pageSize, page){
            const { getAllProducts } = productsCrud();

            getAllProducts(pageSize, page).then((res) => {
                this.products = res.data.results
                this.totalProducts = res.data.totalProducts
            })
        },

        deleteAll(){
            const { deleteAllProducts } = productsCrud()
            const res = deleteAllProducts()
            if(res === "deletedAll"){
                this.$router.go()
            }
        },

        deleteSingleProduct(id){
            const { deleteProduct } = productsCrud()
            const res = deleteProduct(id)
            if(res === "deleted"){
                this.$router.go()
            }
        },

        paginationHandler(page){
            this.setProducts(12, page);
        }
    },
  }
</script>
<style lang="">

</style>