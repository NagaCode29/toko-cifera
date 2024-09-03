class ProductController {
    #productService;
    constructor(productService) {
        this.#productService = productService;

        this.getProductsHandler = this.getProductsHandler.bind(this);
        this.postProductHandler = this.postProductHandler.bind(this);
        this.postUpdateHandler = this.postUpdateHandler.bind(this);
        this.deleteProductHandler = this.deleteProductHandler.bind(this);
        this.getAllProductsByDateHandler = this.getAllProductsByDateHandler.bind(this);
        this.getAllProductsByKeyword = this.getAllProductsByKeyword.bind(this);
    }

    async getProductsHandler(req,res,next) {
        try{
            const products = await this.#productService.getAllProducts();
            res.render('product/products',{title: 'Products',products});
        }catch (e) {
            console.log(e.message);
            next(e);
        }
    }

    async getAddProductHandler(req,res,next){
        res.redirect('/products');
    }

    async postProductHandler(req,res,next){
        try {
            await this.#productService.addProduct(req.body);

            const products = await this.#productService.getAllProducts();
            res.render('product/products',{title: 'Products',products,message:'Product add successfully', status: 'success'});
        }catch (e) {
            const products = await this.#productService.getAllProducts();
            res.render('product/products',{title: 'Products',products,message: e.message, status: 'danger'});
        }
    }

    async getUpdateHandler(req,res,next){
        res.redirect('/products');
    }

    async postUpdateHandler(req,res,next){
        try {
            const {id: idOld} = req.params;
            await this.#productService.updateProduct(idOld,req.body);

            const products = await this.#productService.getAllProducts();
            res.render('product/products',{title: 'Products',products,message:'Product update successfully', status: 'success'});
        }catch (e) {
            const products = await this.#productService.getAllProducts();
            res.render('product/products',{title: 'Products',products,message: e.message, status: 'danger'});
        }
    }

    async deleteProductHandler(req,res){
        try {
            const {id} = req.params;
            await this.#productService.deleteProduct(id);

            const products = await this.#productService.getAllProducts();
            res.render('product/products',{title: 'Products',products,message:'Product delete successfully', status: 'success'});
        }catch (e) {
            const products = await this.#productService.getAllProducts();
            res.render('product/products',{title: 'Products',products,message: e.message, status: 'danger'});
        }
    }

    async getAllProductsByDateHandler(req,res,next){
        try {
            const products = await this.#productService.searchProductsByDate(req.query);

            res.render('product/products',{title: 'Products',products});
        }catch (e) {
            res.redirect('/products');
        }
    }

    async getAllProductsByKeyword(req,res,next){
        try {
            const products = await this.#productService.searchProductsByKeyword(req.query);

            res.send(products);
        }catch (e) {
            res.send(e.message);
        }
    }
}

export default ProductController;
