const { getOrder, getOrders } = require('../../../controllers/OrderController');
const { Menu, Order, Table, Customer } = require('../../../models/Association');

jest.mock('../../../models/Association');

describe('GET Orders', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should return (200) and all Orders', async () => {
        const mockOrders = [
            {
                id: '1',
                total: '100',
                Table: {
                    number: 10,
                    Customer: {
                        name: 'Gabriel Fallen',
                    }
                },
                Menu: {
                    name: 'Pizza',
                    price: 100
                }
            },
            {
                id: '2',
                total: '150',
                Table: {
                    number: 15,
                    Customer: {
                        name: 'Fergod',
                    }
                },
                Menu: [
                    {
                        name: 'Pizza',
                        price: 100
                    },
                    {
                        name: 'Burger',
                        price: 75
                    }
                ]
            },
        ];

        Order.findAll.mockResolvedValue(mockOrders);

        await getOrders(req, res);

        expect(Order.findAll).toHaveBeenCalledWith({
            attributes: { exclude: [ 'menuId', 'tableId', 'createdAt', 'updatedAt' ]},
            include: [
                {
                    model: Table,
                    include: [{
                        model: Customer,
                        attributes: { exclude: [ 'id', 'email', 'createdAt', 'updatedAt' ]}
                    }],
                    attributes: { exclude: [ 'id', 'clientId', 'createdAt', 'updatedAt' ] },
                },
                {
                    model: Menu,
                    attributes: { exclude: [ 'description', 'available', 'createdAt', 'updatedAt' ] }
                }
            ]
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockOrders);
    });

    it('Should handle internal server errors', async () => {
        Order.findAll.mockRejectedValue(new Error('Database Error'));

        await getOrders(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' });
    });
});

describe('GET Order', () => {
    let req, res;

    beforeEach(() => {
        req = { 
            params: { id: '1' },
            body: {} 
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should return (200) if order is found by ID', async () => {
        const mockOrder = [
            {
                id: '1',
                total: '70',
                Table: {
                    number: 20,
                    Customer: {
                        name: 'Boltz',
                    }
                },
                Menu: {
                    name: 'Burger',
                    price: 70
                }
            },
        ];

        Order.findOne.mockResolvedValueOnce(true);
        Order.findByPk.mockResolvedValueOnce(mockOrder);

        await getOrder(req, res);

        expect(Order.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
        expect(Order.findByPk).toHaveBeenCalledWith('1', {
            include: [
                {
                    model: Table,
                    include: [{
                        model: Customer,
                        attributes: { exclude: ['id', 'email', 'createdAt', 'updatedAt'] }
                    }],
                    attributes: { exclude: ['id', 'clientId', 'createdAt', 'updatedAt'] }
                },
                {
                    model: Menu,
                    attributes: { exclude: ['id', 'description', 'available', 'createdAt', 'updatedAt'] }
                }
            ]
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockOrder);        
    });

    it('Should return (400) if ID is not provied', async () => {
        req.params = { id: null }

        await getOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'ID is required!' });
    });

    it('Should return (404) if order is not exist', async () => {
        Order.findOne.mockResolvedValueOnce(null);

        await getOrder(req, res);

        expect(Order.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "The order doesn't exist!" });
    });

    it('Should handle internal server errors', async () => {
        Order.findOne.mockRejectedValue(new Error('Database Error'));

        await getOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' })
    });
});