const { updateTable } = require('../../../controllers/TableController');
const { Table, Customer } = require('../../../models/Association');

jest.mock('../../../models/Association');

describe('GET Tables', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: 1 }, 
            body: {} 
        },
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
    });

    afterEach(() => {
        jest.clearAllMocks()
    });

    it('Should return (200) if Table is updated', async () => {
        req.body = { number: 7, clientId: 4 };

        Table.findOne.mockResolvedValueOnce(true);
        Customer.findOne.mockResolvedValueOnce(true);
        
        Table.update.mockResolvedValueOnce({ number: 7, clientId: 4 }, { where: { id: 1 } });

        await updateTable(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Success!' });
    });
    
    it('Should return (400) if ID is not provied', async () => {
        req.params = { id: null };

        await updateTable(req, res); 

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'ID is required!' });
    });
    
    it('Should return (400) if all Fields are Empty', async () => {
        req.body = {};

        await updateTable(req, res); 

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required!' });
    });
    
    it("Should return (400) if Table doesn't exist", async () => {
        req.body = { number: 7, clientId: 4 };

        Table.findOne.mockResolvedValueOnce(false);
        
        await updateTable(req, res); 

        expect(Table.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Not Found!' });
    });

    it("Should return (400) if Customer doesn't exist", async () => {
        req.body = { number: 7, clientId: 4 };

        Table.findOne.mockResolvedValueOnce(true);
        Customer.findOne.mockResolvedValueOnce(false);
        
        await updateTable(req, res); 

        expect(Table.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "The customer doesn't exist!" });
    });
    
    it('Sould handle internal server errors', async () => {
        req.body = { number: 7, clientId: 4 };

        Table.findOne.mockRejectedValue(new Error('Database Error'));

        await updateTable(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' });
    });
});