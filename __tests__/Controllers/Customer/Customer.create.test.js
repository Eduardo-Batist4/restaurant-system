const { createCustomer } = require('../../../controllers/CustomerController');
const { Customer } = require('../../../models/Association');

jest.mock('../../../models/Association');

describe('Create Customer', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} },
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should return (200) if the Customer is created successfully!', async () => {
        req.body = { name: 'Robin ropz', email: 'ropz@teste.com' };

        Customer.findOne   
            .mockResolvedValueOnce(false)
            .mockResolvedValueOnce(false)
        
        Customer.create.mockResolvedValueOnce({ id: 1, name: 'Robin ropz', email: 'ropz@teste.com' });

        await createCustomer(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Robin ropz', email: 'ropz@teste.com' });
    });

    it('Should return (400) if  all Fields are Empty!', async () => {
        req.body = {};

        await createCustomer(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required!' });
    });

    it('Should return (409) if the Name already exists!', async () => {
        req.body = { name: 'Oleksandr s1mple', email: 's1mple@teste.com' };

        Customer.findOne
            .mockResolvedValueOnce(true)
            .mockResolvedValueOnce(false)

        await createCustomer(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: 'Name already exists!' });
    });

    it('Should return (409) if the Email already exists!', async () => {
        req.body = { name: 'Ilya m0NESY', email: 'm0NESY@teste.com' };

        Customer.findOne
            .mockResolvedValueOnce(false)
            .mockResolvedValueOnce(true)

        await createCustomer(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: 'E-mail already exists!' });
    });
    
    it('Should handle internal server errors', async () => {
        req.body = { name: 'Robin ropz', email: 'ropz@teste.com' };

        Customer.create.mockRejectedValue(new Error('Database Error'));

        await createCustomer(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' });
    })
});