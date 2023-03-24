<template lang="">
    <div class="row justify-content-center mt-5">
        <div class="col-12">
            <table class="table table-hover">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Order No</th>
                    <th scope="col">Order Date</th>
                    <th scope="col">Address</th>
                    <th scope="col">Delivery Method</th>
                    <th scope="col">Payment Method</th>
                    <th scope="col">Payment Status</th>
                    <th scope="col">Total Quantity</th>
                    <th scope="col">Total Amount</th>
                    <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(order, index) in orders" :key="order._id" v-bind:id="`${order._id}`">
                        <th scope="row">{{ index + 1 }}</th>
                        <td style="width: 90px;"><router-link :to="`order/${order._id}`">{{order._id}}</router-link></td>
                        <td>{{ formatDate(order.createdAt) }}</td>
                        <td>{{order?.customerInfo?.address}}</td>
                        <td>{{order?.deliveryMethod == "self" ? "Self-pickup from the store" : order?.deliveryMethod == "us" ? "US Shipping" : order?.deliveryMethod == "worldwide" ? "" : "Worldwide Shipping"}}</td>
                        <td>{{order?.paymentMethod == "cod" ? "Cash On Delivery" : "Credeit Card"}}</td>
                        <td>{{order?.paymentMethod == "card" ? "Paid" : ""}}</td>
                        <td align="center">{{order?.cartTotal?.totalQuantity}}</td>
                        <td align="center">${{order?.cartTotal?.total}}</td>
                        <!-- <td><span class="badge rounded-pill bg-success">{{order?.orderStatus}}</span></td> -->
                        <td><span :class="{'badge rounded-pill bg-success': order?.orderStatus === 'finished', 'badge rounded-pill bg-warning': order?.orderStatus === 'processing', 'badge rounded-pill bg-danger': order?.orderStatus === 'declined', 'badge rounded-pill bg-secondary': order?.orderStatus === 'dispatched'}">{{ capitalize(order?.orderStatus) }}</span></td>
                    </tr>
                </tbody>
            </table>
            
        </div>
    </div>
</template>
<script>
import productsCrud from '../modules/productsCrud'
export default {
    data: function() {
        return {
            orders: []
        }
    },
    mounted() {
        this.getOrders()
    },
    methods: {
    async getOrders() {
      const { getAllOrders } = productsCrud();
      const orders = await getAllOrders();
      this.orders = orders;
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },

    capitalize(s){
        return s && s[0].toUpperCase() + s.slice(1);
    }
  },
}
</script>
<style lang="">
    
</style>