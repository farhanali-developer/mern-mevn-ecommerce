<template lang="">
    <div class="row justify-content-start mt-5">
        <div class="col-12">
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Product ID</th>
                    <th scope="col">Product Thumbnail</th>
                    <th scope="col">Product Title</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Sub Total</th>
                    <th scope="col">Stock</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(order, index) in orderData" :key="order._id" v-bind:id="`${order._id}`">
                        <th scope="row">{{ index + 1 }}</th>
                        <td><router-link :to="`/product/${order?.product._id}`">{{order?.product._id}}</router-link></td>
                        <td><img v-bind:src="`${order?.product?.thumbnail}`" height="100" width="100" /></td>
                        <td>{{order?.product?.title}}</td>
                        <td>{{order?.quantity}}</td>
                        <td>${{order?.subTotal}}</td>
                        <td>{{order?.product?.stock}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="col-12 col-md-2">
            <button type="button" class="btn btn-primary">Back</button>
        </div>
        <div class="col-12 col-md-3">
            <select class="form-select" aria-label="Order Status" v-model="orderStatus" @change="updateOrderStatus">
                <option disabled selected>Order Status</option>
                <option value="processing">Processing</option>
                <option value="dispatched">Dispatched</option>
                <option value="finished">Finished</option>
                <option value="declined">Declined</option>
            </select>
        </div>
    </div>
</template>
<script>
import productsCrud from '../modules/productsCrud'
export default {
    data: function(){
        return{
            orderData: [],
            orderStatus: "",
            customerInfo: {
                userId: "",
                orderStatus: ""
            }
        }
    },
    mounted(){
        this.getOrderData()
        this.getOrderStatus()
    },
    methods: {
        async getOrderData () {
            const { GetSpecificOrder } = productsCrud()
            const res = await GetSpecificOrder(this.$router.currentRoute.value.params.id)
            this.orderData = res.products
            this.customerInfo.userId = res.customerInfo.userId
            this.customerInfo.orderStatus = res.orderStatus
        },

        async getOrderStatus () {
            const { getOrderStatus } = productsCrud()
            const res = await getOrderStatus(this.$router.currentRoute.value.params.id)
            this.orderStatus = res.orderStatus
        },

        async updateOrderStatus() {
            const { updateOrderStatus } = productsCrud()
            const data = {
                id: this.$router.currentRoute.value.params.id,
                userId: this.customerInfo.userId,
                oldStatus: this.customerInfo.orderStatus,
                newStatus: this.orderStatus
            }
            const res = await updateOrderStatus(data)
            console.log(res)
        }
    }
}
</script>
<style lang="">
    
</style>