export const ProductService = {
    getProductsData() {
        return [
            {
                id: '1',
                name: 'Agriculture',
                value: '0.00',
                categoryname: 'Regular',
            },
            {
                id: '2',
                name: 'Apparel',
                value: '2.50',
                categoryname: 'Silver',
            },
            {
                id: '3',
                name: 'Automotive',
                value: '6.00',
                categoryname: 'Bronze',
            },
            {
                id: '4',
                name: 'Banking',
                value: '5.25',
                categoryname: 'Regular',
            },
            {
                id: '5',
                name: 'Biotechnology',
                value: '6.00',
                categoryname: 'Bronze',
            },
            
        ];
    },

    getProductsMini() {
        return Promise.resolve(this.getProductsData().slice(0, 5));
    },

    getProductsSmall() {
        return Promise.resolve(this.getProductsData().slice(0, 10));
    },

    getProducts() {
        return Promise.resolve(this.getProductsData());
    },

    getProductsWithOrdersSmall() {
        return Promise.resolve(this.getProductsWithOrdersData().slice(0, 10));
    },

    getProductsWithOrders() {
        return Promise.resolve(this.getProductsWithOrdersData());
    }
};

