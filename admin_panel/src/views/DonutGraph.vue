<template lang="">
    <div class="mt-5">
        <div class="row justify-content-center">
            <div class="col-12">
                <h1>Donut Graph</h1>
                <apexchart class="mt-5" id="donut_chart" ref="donut" width="800" type="donut" :options="chartOptions" :series="series"></apexchart>
            </div>
        </div>
    </div>
</template>
<script>

import productsCrud from '../modules/productsCrud'
import { onMounted } from 'vue'
  export default {
    data: function() {
      return {
        products: [],
        series: [],
          chartOptions: {
            chart: {
              width: 800,
              type: 'donut',
            },
            plotOptions: {
              pie: {
                startAngle: -90,
                endAngle: 270
              }
            },
            dataLabels: {
              enabled: false
            },
            fill: {
              type: 'gradient',
            },
            legend: {
                show: true,
                position: 'right',
            },
            labels: [],
            
            // title: {
            //   text: 'Gradient Donut with custom Start-angle'
            // },
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: 'bottom'
                }
              }
            }]
          },
      }
    },
    
    mounted(){
        this.setCategory("*", "*")
    },
    methods:{
        setProducts(data) {
            this.products = data;
        },
        setCategory(limit, page){
            const { state, getAllProducts } = productsCrud()
            getAllProducts(limit, page).then((res)=>{
                this.setProducts(res);
                const data = res.data
                const uniqueCategories = [...new Set(data?.map(product => product.category?.toLowerCase() ?? ""))]
                const seriesData = uniqueCategories.map(cat => {
                    return data.filter(item => item.category.toLowerCase() === cat).length
                })
                this.chartOptions = {
                    ...this.chartOptions, ...{
                        labels: uniqueCategories
                    }
                }
                this.series = seriesData 
            })

        }
    },

    
  }
</script>
<style lang="">
    
</style>