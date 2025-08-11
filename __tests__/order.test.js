const { ObjectId } = require('mongodb');
const orderModel = require('../models/order');
const { getAll, getSingle } = require('../controllers/order');

// Mock the userModel methods
jest.mock('../models/order');

describe('Order Controller', () => {
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
      const mockOrder = [
        {
        "_id":"68989f2e239e87abb572654f",
        "orderItems": [
            {
            "menuItemId": "68989deec5b5fb5fd78e2c2b",
            "quantity": 21
            },
            {
            "menuItemId": "68989deec5b5fb5fd78e2c2b",
            "quantity": 4
            }
        ],
        "orderStatus": "Preparing",
        "orderType": "Take-out",
        "createdAt": "2025-08-10T13:31:26.962Z"
        }
      ];

      orderModel.getAll.mockResolvedValue(mockOrder);

      await getAll(mockReq, mockRes);

      expect(orderModel.getAll).toHaveBeenCalled();
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockOrder);
    });

    it('should handle errors and return 500', async () => {
      orderModel.getAll.mockRejectedValue(new Error('DB Error'));

      await getAll(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('getSingle', () => {
    it('should return a single user with 200', async () => {
      const orderId = new ObjectId();
      const mockOrder = {
        _id: orderId.toHexString(),
        "orderItems": [
            {
            "menuItemId": "68989deec5b5fb5fd78e2c2b",
            "quantity": 21
            },
            {
            "menuItemId": "68989deec5b5fb5fd78e2c2b",
            "quantity": 4
            }
        ],
        "orderStatus": "Preparing",
        "orderType": "Take-out",
        "createdAt": "2025-08-10T13:31:26.962Z"
      };
      mockReq.params.id = orderId.toHexString();

      // Note: the controller converts string ID to ObjectId internally,
      // so we expect getById to be called with an ObjectId instance.
      orderModel.getById.mockResolvedValue(mockOrder);

      await getSingle(mockReq, mockRes);

      expect(orderModel.getById).toHaveBeenCalledWith(orderId);
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockOrder);
    });

    it('should return 404 if user not found', async () => {
      const orderId = new ObjectId();
      mockReq.params.id = orderId.toHexString();
      orderModel.getById.mockResolvedValue(null);

      await getSingle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Order not found' });
    });

    it('should handle errors and return 500', async () => {
      mockReq.params.id = 'invalid-id';
      orderModel.getById.mockRejectedValue(new Error('Invalid ID'));

      await getSingle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});
