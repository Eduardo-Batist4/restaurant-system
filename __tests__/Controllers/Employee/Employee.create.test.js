const { createEmployee } = require('../../../controllers/EmployeeController');
const { hashPassword } = require('../../../utils/bcrypt');
const Employee = require('../../../models/Employee');

jest.mock('../../../models/Employee');
jest.mock('../../../utils/bcrypt');

describe('Create Employee', () => {
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

    it('Should return (201) if the Employee was created successfully', async () => {
        req.body = { name: 'Marcelo Coldzera', email: 'cold@teste.com', password: 'cold123', confirmPassword: 'cold123', position: 'garçom' };

        Employee.findOne
            .mockResolvedValueOnce(false)
            .mockResolvedValueOnce(false)

        const hashedPassword = 'hashedPassword123';
        hashPassword.mockResolvedValue(hashedPassword);

        Employee.create.mockResolvedValueOnce({ name: 'Marcelo Coldzera', email: 'cold@teste.com', password: hashedPassword, position: 'garçom' })

        await createEmployee(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ name: 'Marcelo Coldzera', email: 'cold@teste.com', password: hashedPassword, position: 'garçom' });
    });

    it('Should return (400) if all Fields are Empty', async () => {
        req.body = {};

        await createEmployee(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required!'});
    });
   
    it("Should return (400) if password doesn't match confirmPassword", async () => {
        req.body = { password: 'cold123', confirmPassword: 'cold124' };

        await createEmployee(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Wrong password!' });
    });
    
    it('Should return (409) if the Name already exists', async () => {
        req.body = { 
            name: 'Ropz', 
            email: 'ropz@teste.com', 
            password: 'ropz123', 
            confirmPassword: 'ropz123', 
            position: 'cozinheiro' 
        }

        Employee.findOne
            .mockResolvedValueOnce(true)
            .mockResolvedValueOnce(false)

        await createEmployee(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: 'This name already exists!' });
    });
    
    it('Should return (409) if the Email already exists', async () => {
        req.body = { 
            name: 'Ropz', 
            email: 'ropz@teste.com', 
            password: 'ropz123', 
            confirmPassword: 'ropz123', 
            position: 'cozinheiro' 
        }

        Employee.findOne.mockResolvedValue(true)

        await createEmployee(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: 'This email already exists!' });
    });

    it('Should handle internal server errors', async () => {
        req.body = { 
            name: 'Ropz', 
            email: 'ropz@teste.com', 
            password: 'ropz123', 
            confirmPassword: 'ropz123', 
            position: 'cozinheiro' 
        }

        Employee.findOne.mockResolvedValue(false);

        Employee.create.mockRejectedValue(new Error('Database Error'));

        await createEmployee(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' });
    });
});

