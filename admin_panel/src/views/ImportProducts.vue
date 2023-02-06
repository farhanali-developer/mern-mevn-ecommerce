<template lang="">
    <div class="text-center mt-5 pt-5">
        <h2>Add CSV file here</h2>
        <div class="row justify-content-center align-items-center text-start">
            <div class="col-12 col-md-6 mt-2">
                <vue-csv-import v-model="mappedCsv" :fields="fields">
                    <vue-csv-toggle-headers></vue-csv-toggle-headers>
                    <vue-csv-errors></vue-csv-errors>
                    <div>
                        <vue-csv-input class="form-control"></vue-csv-input>
                    </div>
                    <vue-csv-map></vue-csv-map>
                </vue-csv-import>

                <button type="submit" class="btn btn-primary mt-3" @click="mappedData()">Submit</button>
            </div>
            <div class="col-md-12">
                <pre>{{ mappedCsv }}</pre>
            </div>
        </div>
    </div>
</template>
<script>
import productsCrud from '../modules/productsCrud'
  export default {
    data: function() {
      return {
        mappedCsv: null,
        fields: {
            title: {required: false, label: "Title"},
            description: {required: false, label: "Description"},
            thumbnail: {required: false, label: "Thumbnail"},
            brand: {required: false, label: "Brand"},
            category: {required: false, label: "Category"},
            sale: {required: false, label: "Sale"}
        },
        }
    },
    setup() {
        const { csvProducts} = productsCrud()
        return { csvProducts}
    },
    mounted() {
    },

    methods: {
        mappedData(){
            const res = this.csvProducts(this.mappedCsv)
            if(res === "imported"){
                this.$router.push("/")
            }
        }
    },
  }
</script>
<style lang="">
    
</style>