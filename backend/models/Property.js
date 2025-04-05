const mongoose = require('mongoose');

// Define a simple schema for GeoJSON Point
const PointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }
});

const PropertySchema = new mongoose.Schema({
  address: {
    street: { type: String, required: [true, 'Please add a street address'] },
    city: { type: String, required: [true, 'Please add a city'] },
    state: { type: String, required: [true, 'Please add a state'] },
    zipCode: { type: String, required: [true, 'Please add a zip code'] },
    country: { type: String, required: [true, 'Please add a country'], default: 'USA' },
  },
  purchasePrice: {
    type: Number,
    required: [true, 'Please add a purchase price'],
  },
  currentValue: {
    type: Number,
    // Could be updated periodically
  },
  status: {
    type: String,
    enum: ['Owned', 'Sold', 'Under Contract', 'Prospect'],
    default: 'Owned',
  },
  documents: [ // Array to store references or details of related documents
    {
      name: String,
      url: String, // URL to the stored document (e.g., S3)
      uploadedAt: { type: Date, default: Date.now }
    }
  ],
  owner: { // Renamed from ownerUserId for clarity
    type: mongoose.Schema.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  // financialData could be embedded or referenced from FinancialRecord model later
  // For now, let's keep it simple or omit until Phase 4
  location: { // GeoJSON for mapping
    type: PointSchema,
    index: '2dsphere' // Create a geospatial index
  },
  // Add other relevant fields like property type, size, year built etc. as needed
  propertyType: {
    type: String,
    enum: ['Single Family', 'Multi-Family', 'Condo', 'Townhouse', 'Land', 'Commercial'],
  },
  bedrooms: Number,
  bathrooms: Number,
  squareFootage: Number,
  yearBuilt: Number,

}, {
  timestamps: true // Automatically add createdAt and updatedAt
});

module.exports = mongoose.model('Property', PropertySchema);