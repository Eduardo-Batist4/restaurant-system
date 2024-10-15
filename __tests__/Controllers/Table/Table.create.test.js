const { createTable } = require('../../../controllers/TableController');
const { Table, Customer } = require('../../../models/Association');

jest.mock('../../../models/Association');

describe('Create Table', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} },
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    });

    afterEach(() => {
        jest.clearAllMocks()
    });

    it('Should return (201) if the Table is created successfully', async () => {
        req.body = { number: 10, clientId: 3 };

        Table.findOne.mockResolvedValueOnce(false);
        Customer.findOne.mockResolvedValueOnce(true);
        Table.findOne.mockResolvedValueOnce(false);

        const mockTable = { id: 1, number: 10, clientId: 3 };
        Table.create.mockResolvedValueOnce(mockTable);

        await createTable(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockTable);
    });
    
    it('Should return (400) if all Fields are Empty', async () => {
        req.body = {}

        await createTable(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required!' });
    });

    it('Should return (409) if the table number already exist', async () => {
        req.body = { number: 10, clientId: 5 };

        Table.findOne.mockResolvedValueOnce(true);

        await createTable(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: 'The table number already exists!' });
    });

    it("Should return (404) if the Customer doesn't exists", async () => {
        req.body = { number: 10, clientId: 5 };

        Table.findOne.mockResolvedValueOnce(false);
        Customer.findOne.mockResolvedValueOnce(false);

        await createTable(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Not Found!' });
    });

    it("Should return (409) if the Customer already has a table", async () => {
        req.body = { number: 10, clientId: 5 };

        Table.findOne.mockResolvedValueOnce(false);
        Customer.findOne.mockResolvedValueOnce(true);
        Table.findOne.mockResolvedValueOnce(true);

        await createTable(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: 'The customer already a table!' });
    });
    
    it("Should handle internal server erros", async () => {
        req.body = { number: 10, clientId: 5 };

        Table.findOne.mockRejectedValue(new Error('Database Error'));

        await createTable(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' });
    });
});