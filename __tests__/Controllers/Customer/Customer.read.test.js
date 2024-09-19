const { getCustomer, getCustomers } =  require('../../../controllers/CustomerController');
const { Customer, Table } = require('../../../models/Association');

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
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.'});

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

    it('Should return (200) if a customer is found by ID', async () => {
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

        Customer.findOne.mockResolvedValueOnce(mockCustomer); 
        Customer.findByPk.mockResolvedValueOnce(mockCustomer); 

        await getCustomer(req, res);

        expect(Customer.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
        expect(Customer.findByPk).toHaveBeenCalledWith('1', {
            include: [{
                model: Table,
                attributes: { exclude: ['id', 'clientId', 'createdAt', 'updatedAt'] }
            }]
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockCustomer);
    });

    it('Should return (400) if ID is not provied', async () => {
        req.params.id = undefined;

        await getCustomer(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'ID is required!' });
    });

    it('Should return (400) if customer does not exist', async () => {
        Customer.findOne.mockResolvedValue(null);

        await getCustomer(req, res);

        expect(Customer.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "The customer doesn't exist!" });
    });

    it('Should handle server erros', async () => {
        Customer.findOne.mockRejectedValue(new Error('Database error'));

        await getCustomer(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' });
    })
});