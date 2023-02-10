function paginate(model) {
    return async (req, res, next) => {
        if(req.query.page === "*" && req.query.limit === "*"){
            const allProducts = await model.find({})
            res.status(200).json(allProducts)
            return
        }
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
  
        const result = {};
        // change model.length to model.countDocuments() because you are counting directly from mongodb
        if (endIndex < (await model.countDocuments().exec())) {
            result.next = {
                page: page + 1,
                limit: limit,
            };
        }
        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit: limit,
            };
        }
        try {
            // .limit(limit).skip(startIndex) replaced the slice method because 
            // it is done directly from mongodb and they are one of mongodb methods
            const allProducts = await model.find({});
            result.results = await model.find().limit(limit).skip(startIndex).sort({"createdAt": "desc"});
            result.totalProducts = allProducts.length
            res.paginatedResult = result;
            next();
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };
}

module.exports = {paginate}