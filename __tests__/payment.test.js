const { ObjectId } = require('mongodb');
const paymentModel = require('../models/payment');
const { getAll, getSingle } = require('../controllers/payment');

// Mock the userModel methods
jest.mock('../models/payment');

describe('User Controller', () => {
  // Silence console.error output during tests
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = { params: {} };
    mockRes = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all users with 200', async () => {
      const mockPayment = [
        {
        "_id":"6894b3e63d489a340bcd80f7",
        "orderId": "689497e7e7b658a6634a89e0",
        "subtotal": 780,
        "tax": 78,
        "total": 858,
        "isPaid": "true",
        "paymentMethod": "Credit Card",
        "createdAt":"2025-08-07T14:10:46.365Z"}
      ];

      paymentModel.getAll.mockResolvedValue(mockPayment);

      await getAll(mockReq, mockRes);

      expect(paymentModel.getAll).toHaveBeenCalled();
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPayment);
    });

    it('should handle errors and return 500', async () => {
      paymentModel.getAll.mockRejectedValue(new Error('DB Error'));

      await getAll(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('getSingle', () => {
    it('should return a single user with 200', async () => {
      const paymentId = new ObjectId();
      const mockPayment = {
        _id: paymentId.toHexString(),
        orderId: "689497e7e7b658a6634a89e0",
        subtotal: 780,
        tax: 78,
        total: 858,
        isPaid: true,
        paymentMethod: "Credit Card",
        createdAt:"2025-08-07T14:10:46.365Z"
      };
      mockReq.params.id = paymentId.toHexString();

      // Note: the controller converts string ID to ObjectId internally,
      // so we expect getById to be called with an ObjectId instance.
      paymentModel.getById.mockResolvedValue(mockPayment);

      await getSingle(mockReq, mockRes);

      expect(paymentModel.getById).toHaveBeenCalledWith(paymentId);
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPayment);
    });

    it('should return 404 if user not found', async () => {
      const paymentId = new ObjectId();
      mockReq.params.id = paymentId.toHexString();
      paymentModel.getById.mockResolvedValue(null);

      await getSingle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Payment not found' });
    });

    it('should handle errors and return 500', async () => {
      mockReq.params.id = 'invalid-id';
      paymentModel.getById.mockRejectedValue(new Error('Invalid ID'));

      await getSingle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});
