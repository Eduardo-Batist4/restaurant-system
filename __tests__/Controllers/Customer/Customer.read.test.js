const { getCustomer, getCustomers } =  require('../../../controllers/CustomerController');
const { Customer } = require('../../../models/Association');

jest.mock('../../../models/Association')

describe('GET Customers', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} },
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    });

    it('Should return a list of Customers!', async () => {

        const mockCustomers = [
            { id: '1', name: 'Gabriel Fallen', email: 'fallen@test.com' },
            { id: '2', name: 'Fernando FerGod', email: 'fer@test.com' },
        ]

        Customer.findAll.mockResolvedValue(mockCustomers);

        await getCustomers(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockCustomers);
    });

    it('Should handle errors!', async () => {
        const errorMessage =  'Database error!';
        Customer.findAll.mockRejectedValue(new Error(errorMessage));

        await getCustomers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error'});

    })
});

describe('GET Customer by ID', () => {
    let req, res;

    beforeEach(() => {
        req = { params: { id: '1' } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('Should return a customer by ID', async () => {
        const mockCustomer = {
            id: '1',
            name: 'Kaike Kscerato',
            email: 'ks@teste.com',
            Table: [
                {
                    id: '2',
                    number: '10',
                }
            ]
        };

        Customer.findOne = jest.fn().mockResolvedValue(mockCustomer);
        Customer.findByPk = jest.fn().mockResolvedValue(mockCustomer);

        await getCustomer(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockCustomer);
    });

});