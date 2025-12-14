import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xử lý đăng xuất ở đây
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-10 py-5 flex justify-between items-center shadow-lg">
        <h1 className="text-3xl font-bold">Trang Chủ</h1>
        <button 
          onClick={handleLogout} 
          className="px-5 py-2.5 bg-white text-indigo-600 rounded-lg text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all cursor-pointer"
        >
          Đăng Xuất
        </button>
      </header>
      <main className="p-10 flex justify-center items-center">
        <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-2xl">
          <h2 className="text-gray-800 mb-4 text-2xl font-bold">
            Chào mừng bạn đến với ứng dụng!
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Bạn đã đăng nhập thành công.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Home;
