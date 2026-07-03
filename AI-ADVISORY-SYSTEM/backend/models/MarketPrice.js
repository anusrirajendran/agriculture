import mongoose from 'mongoose';

const historicalPriceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const marketPriceSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: [true, 'Please add a crop name'],
    },
    marketName: {
      type: String,
      required: [true, 'Please add a market name'],
    },
    state: {
      type: String,
      required: [true, 'Please add a state'],
    },
    district: {
      type: String,
      required: [true, 'Please add a district'],
    },
    price: {
      type: Number,
      required: [true, 'Please add current price'],
    },
    priceDate: {
      type: Date,
      default: Date.now,
    },
    priceTrend: {
      type: String,
      enum: ['up', 'down', 'stable'],
      default: 'stable',
    },
    historicalPrices: [historicalPriceSchema],
  },
  {
    timestamps: true,
  }
);

const MarketPrice = mongoose.model('MarketPrice', marketPriceSchema);
export default MarketPrice;
