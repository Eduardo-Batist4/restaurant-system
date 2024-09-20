const { deleteCustomer } = require('../../../controllers/CustomerController');
const Customer = require('../../../models/Association');

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

    // Não consegui fazer o Teste case para Usuario Deletado.
    // Não consegui fazer o Teste Case para o Erro de Servidor.

    it('Should return (400) if ID not provied', async () => {
        req.params.id = undefined;

        await deleteCustomer(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'ID is required!' });
    });

    it("Should return (400) if the customer doesn't exist", async () => {
        Customer.findOne = jest.fn().mockResolvedValue(null); // Não sei o por que não consigo usar somente o Customer.findOne.mock... sendo que ja esta mockado

        await deleteCustomer(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "The customer doesn't exist!" });
    });
});