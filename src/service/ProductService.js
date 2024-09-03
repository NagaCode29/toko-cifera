import {validate} from "../helper/index.js";
import productSchema from "../validator/schema/product-schema.js";
import NotFoundError from "../exception/NotFoundError.js";
import Product from "../model/Product.js";
import InvariantError from "../exception/InvariantError.js";
import OrderDetailRepository from "../repository/OrderDetailRepository.js";

class ProductService{
    #productRepository;
    #orderDetailRepository;
    constructor(productRepository){
        this.#productRepository = productRepository;
        this.#orderDetailRepository = new OrderDetailRepository();
    }

    async getAllProducts(){
        const query = `SELECT * FROM products ORDER BY created_at DESC`;
        return await this.#productRepository.getAll(query);
    }

    async addProduct(request){
        const value = validate(productSchema.addProductSchema,request);
        const {id, name, stock} = value;

        if (await this.checkProduct(id)){
            throw new InvariantError('Product already exists');
        }

        const product = new Product(id, name, stock);

        await this.#productRepository.save(product);

        return id;
    }

    async updateProduct(idOld,request){
        const value = validate(productSchema.updateProductSchema,request);
        const {id, name, stock} = value;

        if (!await this.checkProduct(idOld)){
            throw new NotFoundError('Product not found');
        }

        const product = new Product(id, name, stock);

        await this.#productRepository.update(idOld,product);

        return id;
    }

    async deleteProduct(id){
        if (!await this.checkProduct(id)){
            throw new NotFoundError('Product not found');
        }

        if (await this.checkProductInOrderDetail(id)){
            throw new InvariantError('Produk tidak bisa dihapus. Produk telah di order');
        }

        await this.#productRepository.delete(id);
    }

    async searchProductsByDate(request){
        const value = validate(productSchema.searchProductsByDateSchema, request);

        let {start, end} = value;
        start = start.toISOString().split('T')[0] + ' 00:00:00';
        end = end.toISOString().split('T')[0] + ' 23:59:59';

        const query = `SELECT * FROM products WHERE created_at>= '${start}' AND created_at<='${end}' ORDER BY created_at DESC`;
        return await this.#productRepository.getAll(query);
    }

    async searchProductsByKeyword(request){
        const value = validate(productSchema.searchProductsByKeywordSchema, request);
        const {keyword} = value;

        const query = `SELECT * FROM products WHERE LOWER(id) LIKE '%${keyword}%' OR LOWER(name) LIKE '%${keyword}%' OR stock LIKE  '%${keyword}%' ORDER BY created_at DESC`;

        return await this.#productRepository.getAll(query);
    }

    async checkProduct(id){
        const result = await this.#productRepository.getById(id);

        if (result.length === 0){
            return null;
        }
        return result[0];
    }

    async checkProductInOrderDetail(id){
        const result = await this.#orderDetailRepository.detailOrderByProductId(id);

        if (result.length === 0){
            return null;
        }
        return result;
    }
}

export default ProductService;
