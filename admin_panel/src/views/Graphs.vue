<template lang="">
    <div class="mt-5">
        <div class="row justify-content-center">
            <div class="col-12">
                <h1>Bar Graph</h1>
                <apexchart class="mt-5" id="vuechart-example"  type="bar" :options="chartOptions" :series="series"></apexchart>
            </div>
        </div>
    </div>
</template>
<script lang="ts">

import productsCrud from '../modules/productsCrud'
import { onMounted } from 'vue'
  export default {
    data: function() {
      return {
        products: [],
        chartOptions: {
          chart: {
            id: 'vuechart-example'
          },
          xaxis: {
            categories: [],
          }
        },
        series: [
            {
                name: 'series-1',
                data: []
            },
        ],
      }
    },
    
    mounted(){
        this.setCategory("*", "*")
    },
    methods:{
        setCategory(limit, page){
            const { getAllProducts } = productsCrud()
            getAllProducts(limit, page).then((res)=>{
                const data = res.data
                const uniqueCategories = [...new Set(data?.map(product => product.category?.toLowerCase() ?? ""))]
                const seriesData = uniqueCategories.map(cat => {
                    return data.filter(item => item.category.toLowerCase() === cat).length
                })
                this.chartOptions = {
                    ...this.chartOptions, ...{
                        xaxis: {
                            categories: uniqueCategories
                        }
                    }
                }
                this.series = [{
                    data: seriesData 
                }]
            })

        }
    },

    
  }
</script>
<style lang="">
    
</style>