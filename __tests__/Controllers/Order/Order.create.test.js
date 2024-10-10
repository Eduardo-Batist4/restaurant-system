const { createOrder } = require('../../../controllers/OrderController');
const { Menu, Order, Table } = require('../../../models/Association');

jest.mock('../../../models/Association');

describe('Create Order', () => {
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

    it('Should return (201) if the order is created successfully',async () => {
        req.body = {
            menuId: '100',
            tableId: '150',
            status: 'pending'
        };

        Menu.findOne.mockResolvedValueOnce({ id: '100', available: true, price: 100 });
        Table.findOne.mockResolvedValueOnce({ id: 3, number: '150'});

        const mockOrder = {
            id: '1',
            menuId: '70',
            tableId: '80', 
            status: 'pending',
            total: 100
        };

        Order.create.mockResolvedValueOnce(mockOrder);

        await createOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockOrder);
    });

    it('Should return (400) if all Fields are Empty', async () => {
        req.body = {};

        await createOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required!' });
    });

    it("Should return (404) if the Menu item isn't found", async () => {
        req.body = {
            menuId: '10',
            tableId: '20',
            status: 'pending'
        };

        Menu.findOne.mockResolvedValueOnce(null)
        Table.findOne.mockResolvedValueOnce({ id: 1, number: '20' });

        await createOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Not Found!' });
    });

    it("Should return (404) if the Table isn't found", async () => {
        req.body = {
            menuId: '30',
            tableId: '40',
            status: 'pending'
        };

        Menu.findOne.mockResolvedValueOnce({ id: '30', available: false, price: 100 })
        Table.findOne.mockResolvedValueOnce(null);

        await createOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Not Found!' });
    });

    it("Should return (404) if the food isn't available", async () => {
        req.body = {
            menuId: '50',
            tableId: '60',
            status: 'pending'
        };

        Menu.findOne.mockResolvedValueOnce({ id: '50', available: false, price: 100 });
        Table.findOne.mockResolvedValueOnce({ id: '2', number: 60 });

        await createOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Food is not available!' });
    });

    it('Should handle internal server erros', async () => {
        req.body = {
            menuId: '70',
            tableId: '80',
            status: 'pending'
        };

        Menu.findOne.mockResolvedValueOnce({ id: '70', available: true, price: 100 });
        Table.findOne.mockResolvedValueOnce({ id: '2', number: 80 });
        Order.create.mockRejectedValue(new Error('Database Error'));
        await createOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' });
    });
});