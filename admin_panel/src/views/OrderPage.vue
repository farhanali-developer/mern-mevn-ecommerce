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
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>641493a74c4555402fc79760</td>
                        <td><img src="https://i.dummyjson.com/data/products/1/thumbnail.jpg" height="100" width="100" /></td>
                        <td>iPhone 9</td>
                        <td>5</td>
                        <td>$100</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>641493a74c4555402fc79760</td>
                        <td><img src="https://i.dummyjson.com/data/products/1/thumbnail.jpg" height="100" width="100" /></td>
                        <td>iPhone 9</td>
                        <td>5</td>
                        <td>$100</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>641493a74c4555402fc79760</td>
                        <td><img src="https://i.dummyjson.com/data/products/1/thumbnail.jpg" height="100" width="100" /></td>
                        <td>iPhone 9</td>
                        <td>5</td>
                        <td>$100</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="col-12 col-md-2">
            <button type="button" class="btn btn-primary">Back</button>
        </div>
        <div class="col-12 col-md-3">
            <select class="form-select" aria-label="Default select example">
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
export default {
    
}
</script>
<style lang="">
    
</style>