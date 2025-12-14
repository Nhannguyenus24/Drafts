// Validation rules
export const emailValidation = {
  required: 'Email là bắt buộc',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Email không hợp lệ',
  },
};

export const passwordValidation = {
  required: 'Mật khẩu là bắt buộc',
  minLength: {
    value: 6,
    message: 'Mật khẩu phải có ít nhất 6 ký tự',
  },
};

// Mock API login function
export const loginAPI = async (email, password) => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock validation - chỉ chấp nhận email cụ thể để demo
      if (email === 'admin@example.com' && password === '123456') {
        resolve({ success: true, message: 'Đăng nhập thành công!' });
      } else if (password.length < 6) {
        reject({ success: false, message: 'Mật khẩu quá ngắn!' });
      } else {
        reject({ success: false, message: 'Email hoặc mật khẩu không đúng!' });
      }
    }, 1000);
  });
};
