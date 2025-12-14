import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ErrorAlert from '../components/ErrorAlert';
import SuccessAlert from '../components/SuccessAlert';
import { emailValidation, passwordValidation, loginAPI } from '../utils/loginHelpers';

function Login() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await loginAPI(data.email, data.password);
      setSuccessMessage(response.message);
      
      // Chuyển đến trang chủ sau 1.5 giây
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-center mb-8 text-gray-800 text-3xl font-bold">Đăng Nhập</h2>
        
        {/* Thông báo lỗi */}
        <ErrorAlert 
          message={errorMessage} 
          onClose={() => setErrorMessage('')} 
        />
        
        {/* Thông báo thành công */}
        <SuccessAlert 
          message={successMessage} 
          onClose={() => setSuccessMessage('')} 
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-gray-700 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', emailValidation)}
              placeholder="Nhập email của bạn"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              disabled={isLoading}
            />
            {errors.email && (
              <span className="block text-red-500 text-xs mt-1">{errors.email.message}</span>
            )}
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-gray-700 font-medium">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              {...register('password', passwordValidation)}
              placeholder="Nhập mật khẩu"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              disabled={isLoading}
            />
            {errors.password && (
              <span className="block text-red-500 text-xs mt-1">{errors.password.message}</span>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-400/50 transition-all active:translate-y-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              'Đăng Nhập'
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Demo: admin@example.com / 123456</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
