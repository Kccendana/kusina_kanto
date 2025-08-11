const { ObjectId } = require('mongodb');
const menuModel = require('../models/menu');
const { getAll, getSingle } = require('../controllers/menu');

// Mock the userModel methods
jest.mock('../models/menu');

describe('Menu Controller', () => {
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
    it('should return all menu with 200', async () => {
      const mockMenu = [
        {
          
        "_id": "688a49c904c8472efa4f66c9",
        "name": "Pancit Bihon",
        "description": "Rice noodles sautéed with vegetables and meat.",
        "imageUrl": "/images/pancit.jpg",
        "price": 120,
        "category": "Noodles",
        "servingSize": "1 plate",
        "createdAt": "2025-07-02T10:30:00"
        }
      ];

      menuModel.getAll.mockResolvedValue(mockMenu);

      await getAll(mockReq, mockRes);

      expect(menuModel.getAll).toHaveBeenCalled();
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockMenu);
    });

    it('should handle errors and return 500', async () => {
      menuModel.getAll.mockRejectedValue(new Error('DB Error'));

      await getAll(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('getSingle', () => {
    it('should return a single menu with 200', async () => {
      const menuId = new ObjectId();
      const mockMenu = { 
        "_id": menuId.toHexString(),
        "name": "Pancit Bihon",
        "description": "Rice noodles sautéed with vegetables and meat.",
        "imageUrl": "/images/pancit.jpg",
        "price": 120,
        "category": "Noodles",
        "servingSize": "1 plate",
        "createdAt": "2025-07-02T10:30:00"
        };
      mockReq.params.id = menuId.toHexString();

      // Note: the controller converts string ID to ObjectId internally,
      // so we expect getById to be called with an ObjectId instance.
      menuModel.getById.mockResolvedValue(mockMenu);

      await getSingle(mockReq, mockRes);

      expect(menuModel.getById).toHaveBeenCalledWith(menuId);
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockMenu);
    });

    it('should return 404 if user not found', async () => {
      const menuId = new ObjectId();
      mockReq.params.id = menuId.toHexString();
      menuModel.getById.mockResolvedValue(null);

      await getSingle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Menu not found' });
    });

    it('should handle errors and return 500', async () => {
      mockReq.params.id = 'invalid-id';
      menuModel.getById.mockRejectedValue(new Error('Invalid ID'));

      await getSingle(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});
