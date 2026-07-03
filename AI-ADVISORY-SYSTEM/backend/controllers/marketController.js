import MarketPrice from '../models/MarketPrice.js';

// Seed initial market price data if database is empty
const seedMarketPrices = async () => {
  const count = await MarketPrice.countDocuments();
  if (count > 0) return;

  const crops = [
    { name: 'Paddy (Rice)', price: 2183, trend: 'up' },
    { name: 'Wheat', price: 2275, trend: 'stable' },
    { name: 'Cotton (Medium Staple)', price: 6620, trend: 'down' },
    { name: 'Sugarcane', price: 315, trend: 'up' },
    { name: 'Maize', price: 2090, trend: 'up' },
    { name: 'Potato', price: 1600, trend: 'stable' },
    { name: 'Onion', price: 2200, trend: 'up' },
    { name: 'Tomato', price: 2800, trend: 'down' },
  ];

  const markets = [
    { name: 'Chennai Koyambedu', state: 'Tamil Nadu', district: 'Chennai' },
    { name: 'Bengaluru Yeshwanthpur', state: 'Karnataka', district: 'Bengaluru' },
    { name: 'Adoni Market', state: 'Andhra Pradesh', district: 'Kurnool' },
    { name: 'Pune Gultekdi', state: 'Maharashtra', district: 'Pune' },
    { name: 'Azamgarh Mandi', state: 'Uttar Pradesh', district: 'Azamgarh' },
  ];

  const seedData = [];

  markets.forEach((m) => {
    crops.forEach((c) => {
      // Generate historical prices for last 5 months
      const historicalPrices = [];
      const basePrice = c.price + (Math.random() * 200 - 100);
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        // Add random fluctuation
        const price = Math.round(basePrice * (1 + (Math.random() * 0.1 - 0.05)));
        historicalPrices.push({ date, price });
      }

      const currentPrice = historicalPrices[historicalPrices.length - 1].price;
      const prevPrice = historicalPrices[historicalPrices.length - 2].price;
      const trend = currentPrice > prevPrice ? 'up' : currentPrice < prevPrice ? 'down' : 'stable';

      seedData.push({
        cropName: c.name,
        marketName: m.name,
        state: m.state,
        district: m.district,
        price: currentPrice,
        priceDate: new Date(),
        priceTrend: trend,
        historicalPrices: historicalPrices,
      });
    });
  });

  await MarketPrice.insertMany(seedData);
  console.log('Market price seed database successfully initialized!');
};

// @desc    Get all market prices with query filters
// @route   GET /api/market/prices
// @access  Private
export const getMarketPrices = async (req, res) => {
  try {
    // Seed data if empty
    await seedMarketPrices();

    const { crop, state, search } = req.query;
    let query = {};

    if (crop) {
      query.cropName = crop;
    }

    if (state) {
      query.state = state;
    }

    if (search) {
      query.$or = [
        { cropName: { $regex: search, $options: 'i' } },
        { marketName: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
      ];
    }

    const prices = await MarketPrice.find(query).sort({ priceDate: -1 });

    // Extract unique crops and states for filtering selections in UI
    const uniqueCrops = await MarketPrice.distinct('cropName');
    const uniqueStates = await MarketPrice.distinct('state');

    res.status(200).json({
      success: true,
      count: prices.length,
      crops: uniqueCrops,
      states: uniqueStates,
      data: prices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get price history for a specific crop record
// @route   GET /api/market/prices/:id
// @access  Private
export const getMarketPriceById = async (req, res) => {
  try {
    const priceRecord = await MarketPrice.findById(req.params.id);

    if (!priceRecord) {
      return res.status(404).json({
        success: false,
        message: 'Market price record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: priceRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
