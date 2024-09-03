class Order{
    constructor(id, customer_id, created_at, updated_at, total_paid) {
        this.id = id;
        this.customer_id = customer_id;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.total_paid = total_paid;
    }
}
export default Order;