const { getEmployees, getEmployee } = require('../../../controllers/EmployeeController');
const Employee = require('../../../models/Employee');

jest.mock('../../../models/Employee');

describe('GET Employees', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} },
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should return (200) and All Employees', async () => {
        const mockEmployees = [
            {   
                id: '1',
                name: 'Rain',
                position: 'recepção'
            },
            {   
                id: '2',
                name: 'Broky',
                position: 'garçom'
            },
        ];

        Employee.findAll.mockResolvedValue(mockEmployees);

        await getEmployees(req, res);

        expect(Employee.findAll).toHaveBeenCalledWith({
            attributes: { exclude: ['email', 'password', 'createdAt', 'updatedAt'] }
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockEmployees);
    });

    it('Should handle internal server errors', async () => {
        Employee.findAll.mockRejectedValue(new Error('Database Error'));
        
        await getEmployees(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.' });
    });
});

describe('Get Employee by ID', () => {
    let req, res;

    beforeEach(() => {
        req = { 
            params: { id: '1' }, 
            body: {}, 
        },
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should return (200) if Employee is found by ID', async () => {
        const mockEmployee = {
            id: '1',
            name: 'Rain',
            email: 'rain@teste.com',
            position: 'recepção'
        }

        Employee.findOne.mockResolvedValue(mockEmployee);

        await getEmployee(req, res);

        expect(Employee.findOne).toHaveBeenCalledWith({
            where: { id: '1' },
            attributes: { exclude: ['password'] },
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockEmployee);
    });

    it('Should return (404) if the Employee is not found', async () => {
        Employee.findOne.mockResolvedValue(false);

        await getEmployee(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Not found!'});
    });

    it('Should handle internal server errors', async () => {
        Employee.findOne.mockRejectedValue(new Error('Database Error'));

        await getEmployee(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error.'});
    });
});
