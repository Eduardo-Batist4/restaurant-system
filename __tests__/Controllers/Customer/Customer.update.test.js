const { updateCustomer } = require('../../../controllers/CustomerController');
const { Customer } = require('../../../models/Association');

jest.mock('../../../models/Association');

describe('Update Customer', () => {
    let req, res;

    beforeEach(() => {
        req = { 
            params: { id: '1' },    
            body: {} 
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('Should return (200) if the customer is updated', async () => {
        req.body = { name: 'Mathieu ZywOo', email: 'zywoo@teste.com' };
       
        Customer.findOne.mockResolvedValueOnce(true);
        Customer.update.mockResolvedValueOnce([1]);

        await updateCustomer(req, res);

        expect(Customer.findOne).toHaveBeenCalledWith({ where: { id: '1'} });
        expect(Customer.update).toHaveBeenCalledWith({ name: 'Mathieu ZywOo', email: 'zywoo@teste.com' }, { where: { id: '1' } });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Success!' });
    });

    it('Should return (400) if ID is not provided', async () => {
        req.params.id = undefined;

        await updateCustomer(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'ID is required!' });
    });

    it('Should return (400) if Name and email are not provided', async () => {
        req.body = {};

        await updateCustomer(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Name or E-mail is required!' });
    });

    it('Should return (404) if the customer already exists', async () => {
        req.body = { name: 'Mathieu ZywOo', email: 'zywoo@teste.com' };

        Customer.findOne.mockResolvedValueOnce(false);

        await updateCustomer(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "The customer doesn't exist!" });
    });

    it('Should handle internal server errors', async () => {
        req.body = { name: 'Mathieu ZywOo', email: 'zywoo@teste.com' };

        Customer.findOne.mockRejectedValue(new Error('Database Error'));

        await updateCustomer(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.'});
    })
});