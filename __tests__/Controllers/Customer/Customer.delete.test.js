const { deleteCustomer } = require('../../../controllers/CustomerController');
const { Customer } = require('../../../models/Association');

jest.mock('../../../models/Association');

describe('Delete Customer', () => {
    let req, res;

    beforeEach(() => {
        req = { 
            params: { id: '1' } 
        },
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        
    });

    it('Should return (200) if the Customer is deleted', async () => {
        Customer.findOne.mockResolvedValue(true);
        Customer.destroy.mockResolvedValue(true);

        await deleteCustomer(req, res);

        expect(Customer.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Success!' });
    });

    it('Should return (400) if ID is not provied', async () => {
        req.params.id = undefined;

        await deleteCustomer(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'ID is required!' });
    });

    it("Should return (400) if the customer doesn't exist", async () => {
        Customer.findOne.mockResolvedValue(false);

        await deleteCustomer(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "The customer doesn't exist!" });
    });

    it('Should handle internal server errors', async () => {
        Customer.findOne.mockResolvedValueOnce(true);
        Customer.destroy.mockRejectedValueOnce(new Error('Database Error'));

        await deleteCustomer(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' });
    });
});