# 🌐 Axios - Hướng dẫn đầy đủ

Thư viện HTTP client phổ biến cho JavaScript, hỗ trợ Promise, dễ sử dụng hơn Fetch API.

---

## 📦 Cài đặt

```bash
npm install axios
```

---

## 1️⃣ Import & Cú pháp cơ bản

```js
import axios from 'axios';

// GET request
axios.get('https://api.example.com/users')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));

// Với async/await
const fetchUsers = async () => {
  try {
    const response = await axios.get('https://api.example.com/users');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
```

---

## 2️⃣ Các phương thức HTTP

### GET - Lấy dữ liệu

```js
// Cơ bản
axios.get('/users');

// Với params
axios.get('/users', {
  params: {
    page: 1,
    limit: 10
  }
});
// → GET /users?page=1&limit=10
```

### POST - Tạo mới

```js
axios.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});
```

### PUT - Cập nhật toàn bộ

```js
axios.put('/users/1', {
  name: 'John Updated',
  email: 'john.updated@example.com'
});
```

### PATCH - Cập nhật một phần

```js
axios.patch('/users/1', {
  name: 'John Updated'
});
```

### DELETE - Xóa

```js
axios.delete('/users/1');
```

---

## 3️⃣ Response Structure

```js
const response = await axios.get('/users');

console.log(response.data);       // Dữ liệu từ server
console.log(response.status);     // 200
console.log(response.statusText); // "OK"
console.log(response.headers);    // Headers từ server
console.log(response.config);     // Config của request
```

---

## 4️⃣ Config Options

```js
axios({
  method: 'post',
  url: '/users',
  data: {
    name: 'John',
    email: 'john@example.com'
  },
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  timeout: 5000, // 5 giây
  params: {
    sort: 'desc'
  }
});
```

---

## 5️⃣ Headers

### Gửi headers

```js
axios.get('/users', {
  headers: {
    'Authorization': 'Bearer your_token',
    'Content-Type': 'application/json'
  }
});
```

### Set headers mặc định

```js
axios.defaults.headers.common['Authorization'] = 'Bearer token123';
axios.defaults.headers.post['Content-Type'] = 'application/json';
```

---

## 6️⃣ Create Instance (Recommended)

Tạo instance riêng với config mặc định.

```js
// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
```

```js
// Sử dụng
import api from './api';

api.get('/users');        // → GET https://api.example.com/users
api.post('/users', data); // → POST https://api.example.com/users
```

---

## 7️⃣ Interceptors - Can thiệp request/response

### Request Interceptor

Thực thi **trước khi** gửi request.

```js
api.interceptors.request.use(
  config => {
    // Thêm token vào mỗi request
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request sent:', config);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
```

### Response Interceptor

Thực thi **sau khi** nhận response.

```js
api.interceptors.response.use(
  response => {
    // Xử lý response thành công
    console.log('Response received:', response);
    return response;
  },
  error => {
    // Xử lý lỗi
    if (error.response?.status === 401) {
      // Redirect đến login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 8️⃣ Error Handling

```js
try {
  const response = await axios.get('/users');
} catch (error) {
  if (error.response) {
    // Server trả về lỗi (status code 4xx, 5xx)
    console.log('Error data:', error.response.data);
    console.log('Error status:', error.response.status);
    console.log('Error headers:', error.response.headers);
  } else if (error.request) {
    // Request được gửi nhưng không nhận được response
    console.log('No response:', error.request);
  } else {
    // Lỗi khi setup request
    console.log('Error:', error.message);
  }
}
```

### Xử lý lỗi chi tiết

```js
const handleError = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        console.error('Bad Request');
        break;
      case 401:
        console.error('Unauthorized - Please login');
        break;
      case 403:
        console.error('Forbidden');
        break;
      case 404:
        console.error('Not Found');
        break;
      case 500:
        console.error('Internal Server Error');
        break;
      default:
        console.error('Error:', error.response.status);
    }
  } else if (error.request) {
    console.error('Network Error - No response from server');
  } else {
    console.error('Error:', error.message);
  }
};
```

---

## 9️⃣ Timeout

```js
// Global timeout
axios.defaults.timeout = 5000; // 5 giây

// Per request timeout
axios.get('/users', {
  timeout: 3000 // 3 giây
});
```

---

## 🔟 Cancel Request

### Sử dụng AbortController (Recommended)

```js
const controller = new AbortController();

axios.get('/users', {
  signal: controller.signal
});

// Cancel request
controller.abort();
```

### Ví dụ trong React

```jsx
useEffect(() => {
  const controller = new AbortController();
  
  const fetchData = async () => {
    try {
      const response = await axios.get('/users', {
        signal: controller.signal
      });
      setData(response.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled');
      }
    }
  };
  
  fetchData();
  
  return () => controller.abort(); // Cleanup
}, []);
```

---

## 1️⃣1️⃣ Concurrent Requests

### Promise.all - Chờ tất cả

```js
const [users, posts] = await Promise.all([
  axios.get('/users'),
  axios.get('/posts')
]);

console.log(users.data);
console.log(posts.data);
```

### Promise.allSettled - Không quan tâm lỗi

```js
const results = await Promise.allSettled([
  axios.get('/users'),
  axios.get('/posts'),
  axios.get('/comments')
]);

results.forEach(result => {
  if (result.status === 'fulfilled') {
    console.log('Success:', result.value.data);
  } else {
    console.log('Error:', result.reason);
  }
});
```

---

## 1️⃣2️⃣ Upload File

### Single file

```js
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('name', 'My File');

await axios.post('/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  onUploadProgress: (progressEvent) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    console.log(`Upload: ${percentCompleted}%`);
  }
});
```

### Multiple files

```js
const formData = new FormData();
for (let i = 0; i < files.length; i++) {
  formData.append('files[]', files[i]);
}

await axios.post('/upload-multiple', formData);
```

---

## 1️⃣3️⃣ Download File

```js
const response = await axios.get('/download/file.pdf', {
  responseType: 'blob'
});

// Tạo link download
const url = window.URL.createObjectURL(new Blob([response.data]));
const link = document.createElement('a');
link.href = url;
link.setAttribute('download', 'file.pdf');
document.body.appendChild(link);
link.click();
link.remove();
```

---

## 1️⃣4️⃣ Query Parameters

```js
// Cách 1: Object
axios.get('/users', {
  params: {
    page: 1,
    limit: 10,
    sort: 'desc'
  }
});
// → /users?page=1&limit=10&sort=desc

// Cách 2: URLSearchParams
const params = new URLSearchParams();
params.append('page', 1);
params.append('limit', 10);

axios.get('/users', { params });
```

---

## 1️⃣5️⃣ Authentication

### Bearer Token

```js
const token = localStorage.getItem('token');

axios.get('/users', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

### Basic Auth

```js
axios.get('/users', {
  auth: {
    username: 'user',
    password: 'pass'
  }
});
```

---

## 1️⃣6️⃣ Retry Failed Requests

```js
import axios from 'axios';

const api = axios.create();

api.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    
    // Nếu chưa retry hoặc retry < 3 lần
    if (!config._retry) {
      config._retry = 0;
    }
    
    if (config._retry < 3) {
      config._retry += 1;
      
      // Đợi 1 giây trước khi retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return api(config);
    }
    
    return Promise.reject(error);
  }
);
```

---

## 1️⃣7️⃣ Refresh Token Pattern

```js
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/auth/refresh', { refreshToken });
        const newToken = response.data.token;
        
        localStorage.setItem('token', newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        processQueue(null, newToken);
        
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);
```

---

## 1️⃣8️⃣ BaseURL theo môi trường

```js
// config.js
const API_BASE_URL = {
  development: 'http://localhost:3000/api',
  production: 'https://api.example.com',
  staging: 'https://staging-api.example.com'
};

const baseURL = API_BASE_URL[process.env.NODE_ENV] || API_BASE_URL.development;

export const api = axios.create({
  baseURL,
  timeout: 10000
});
```

---

## 1️⃣9️⃣ Axios với React Hook

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function useAxios(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(url, {
          signal: controller.signal
        });
        setData(response.data);
        setError(null);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// Sử dụng
function UserList() {
  const { data, loading, error } = useAxios('/users');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## 2️⃣0️⃣ Complete API Service Example

```js
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  response => response.data,
  error => {
    const message = error.response?.data?.message || error.message;
    console.error('API Error:', message);
    
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

```js
// services/userService.js
import api from './api';

export const userService = {
  getAll: () => api.get('/users'),
  
  getById: (id) => api.get(`/users/${id}`),
  
  create: (data) => api.post('/users', data),
  
  update: (id, data) => api.put(`/users/${id}`, data),
  
  delete: (id) => api.delete(`/users/${id}`),
  
  search: (query) => api.get('/users/search', {
    params: { q: query }
  })
};
```

```jsx
// Sử dụng trong component
import { userService } from './services/userService';

function UserManager() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAll();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await userService.delete(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          {user.name}
          <button onClick={() => handleDelete(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

---

## ✅ Best Practices

✅ **Tạo instance riêng** với baseURL
✅ **Dùng interceptors** cho token và error handling
✅ **Tách service layer** (userService, authService...)
✅ **Cancel request** khi component unmount
✅ **Handle errors** một cách chi tiết
✅ **Set timeout** phù hợp
✅ **Dùng environment variables** cho API URL
✅ **Implement retry logic** cho network errors
✅ **Loading & error states** trong UI

❌ **Không hardcode** API URL trong component
❌ **Không quên** cleanup trong useEffect
❌ **Không bỏ qua** error handling
❌ **Không để** token trong code

---

## 📊 Axios vs Fetch API

| Feature | Axios | Fetch |
|---------|-------|-------|
| JSON transform | Tự động | Cần `.json()` |
| Error handling | Bắt lỗi 4xx/5xx | Chỉ bắt network error |
| Timeout | Có sẵn | Cần AbortController |
| Interceptors | Có sẵn | Phải tự implement |
| Progress tracking | Có sẵn | Không có |
| Browser support | IE11+ | Modern browsers |

---

## 🎯 Khi nào dùng Axios?

✅ Cần interceptors (token, logging...)
✅ Upload/download với progress
✅ Cancel requests dễ dàng
✅ API service phức tạp
✅ Cần retry logic

❌ Project nhỏ, API đơn giản → Dùng fetch
❌ Giảm bundle size → Dùng fetch

---

## 📚 Tài liệu chính thức

👉 [axios-http.com](https://axios-http.com)

---

🚀 **Axios là lựa chọn tốt cho hầu hết các project React cần gọi API!**
