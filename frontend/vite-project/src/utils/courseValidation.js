// Validation rules for course form
export const courseValidationRules = {
  title: {
    required: 'Course title is required',
    minLength: {
      value: 10,
      message: 'Title must be at least 10 characters'
    },
    maxLength: {
      value: 200,
      message: 'Title must not exceed 200 characters'
    }
  },

  description: {
    required: 'Course description is required',
    minLength: {
      value: 50,
      message: 'Description must be at least 50 characters'
    }
  },

  imageUrl: {
    required: 'Image URL is required',
    pattern: {
      value: /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i,
      message: 'Please enter a valid image URL (jpg, jpeg, png, webp, gif)'
    }
  },

  instructorId: {
    required: 'Please select an instructor'
  },

  rating: {
    required: 'Rating is required',
    pattern: {
      value: /^\d+(\.\d{1})?$/,
      message: 'Rating must be a number with max 1 decimal place'
    },
    validate: {
      min: value => parseFloat(value) >= 0 || 'Rating must be at least 0.0',
      max: value => parseFloat(value) <= 5 || 'Rating must not exceed 5.0'
    }
  },

  totalReviews: {
    required: 'Total reviews is required',
    pattern: {
      value: /^\d+$/,
      message: 'Total reviews must be a whole number'
    },
    validate: value => parseInt(value) >= 0 || 'Total reviews must be a positive number'
  },

  totalHours: {
    required: 'Total hours is required',
    pattern: {
      value: /^\d+(\.\d{1,2})?$/,
      message: 'Total hours must be a number'
    },
    validate: value => parseFloat(value) > 0 || 'Total hours must be greater than 0'
  },

  totalLectures: {
    required: 'Total lectures is required',
    pattern: {
      value: /^\d+$/,
      message: 'Total lectures must be a whole number'
    },
    validate: value => parseInt(value) > 0 || 'Total lectures must be at least 1'
  },

  level: {
    required: 'Please select a course level'
  },

  currentPrice: {
    required: 'Current price is required',
    pattern: {
      value: /^\d+$/,
      message: 'Price must be a whole number'
    },
    validate: value => parseInt(value) > 0 || 'Price must be greater than 0'
  },

  originalPrice: {
    required: 'Original price is required',
    pattern: {
      value: /^\d+$/,
      message: 'Price must be a whole number'
    },
    validate: value => parseInt(value) > 0 || 'Price must be greater than 0'
  }
};

// Validation function for comparing current and original price
export const validatePriceComparison = (currentPrice, originalPrice) => {
  const current = parseInt(currentPrice);
  const original = parseInt(originalPrice);
  
  if (current > original) {
    return 'Current price must be less than or equal to original price';
  }
  return true;
};
