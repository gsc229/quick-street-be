const mongoose = require('mongoose');
const validater = require('validater');

const VendorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6
  },
  phone: {
    type: Number
  },
  zipcode: {
    type: Number
  },
  business_name: {
    type: String,
    unique: true
  },
  description: {
    type: String
  },
  avatar: {
    type: Blob
  },
  vendor_banner: {
    type: Blob
  },
  vendor_category: {
    type: String
  },
  created_at: {
    type: Date
  },
  address: {
    type: String
  },
  //Vendor Products
  products: {
    name: {
      type: String
    },
    description: {
      type: String
    },
    category: {
      type: String
    },
    dietary: {
      type: String
    },
    price: {
      type: Number
    },
    image: {
      type: Blob
    },
    created_at: {
      type: Date
    }
  },
  //Vendor location
  location: {
    street: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    country: {
      type: String
    },
    coordinates: {
      type: String
    }
  },
  bulletins: {
    created_at: {
      type: Date
    }
  }
});

module.exports = mongoose.model('Vendors', VendorSchema);
