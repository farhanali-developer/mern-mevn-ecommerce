<template lang="">
    <div class="mt-5">
        <div class="row justify-content-center">
            <div class="col-12">
                <h1>Bar Graph</h1>
                <div class="mt-5">
                    <apexchart type="line" height="750" :options="chartOptions" :series="series"></apexchart>
                </div>
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
        series: [{
          name: 'Category',
          type: 'column',
          data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
        }, {
          name: 'Sales',
          type: 'line',
          data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
        }],
        chartOptions: {
            chart: {
              height: 350,
              type: 'line',
            },
            stroke: {
              width: [0, 4]
            },
            title: {
              text: 'Sales Data'
            },
            dataLabels: {
              enabled: true,
              enabledOnSeries: [1]
            },
            labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
            xaxis: {
              type: 'number'
            },
            yaxis: [{
              title: {
                text: 'Category',
              },
            
            }, {
              opposite: true,
              title: {
                text: 'Sales'
              }
            }]
          },
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

                const newData = data.filter(item => item.sale)

                const saleData = newData.map((item)=>{
                    return item.sale
                })


                this.chartOptions = {
                    ...this.chartOptions, ...{
                        labels: uniqueCategories
                    }
                }

                this.series = [{
                    name: 'Items in this Category',
                    type: 'column',
                    data: seriesData
                },
                {
                    name: 'Sales of this Category',
                    type: 'line',
                    data: saleData
                }
                ]
            })

        }
    },

    
  }
</script>
<style lang="">
    
</style>