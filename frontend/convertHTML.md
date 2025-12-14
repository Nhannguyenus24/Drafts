# 📘 Tách HTML thành React Component – Tổng hợp lý thuyết & checklist

Tài liệu này tổng hợp **tất cả các lưu ý quan trọng** khi chuyển HTML thuần sang **React component (JSX)**.

---

## 1️⃣ `class` → `className`

React **không dùng `class`** vì trùng keyword JavaScript.

❌ HTML

```html
<div class="container"></div>
```

✅ React

```jsx
<div className="container"></div>
```

---

## 2️⃣ Đổi tên các attribute HTML

Một số thuộc tính **bắt buộc đổi tên** trong JSX:

| HTML       | React      |
| ---------- | ---------- |
| `for`      | `htmlFor`  |
| `onclick`  | `onClick`  |
| `onchange` | `onChange` |
| `tabindex` | `tabIndex` |
| `readonly` | `readOnly` |

---

## 3️⃣ Component phải viết hoa chữ cái đầu

React phân biệt **component** và **thẻ HTML** bằng chữ hoa.

❌ Sai

```jsx
function header() {}
```

✅ Đúng

```jsx
function Header() {}
```

---

## 4️⃣ JSX chỉ có **1 thẻ cha**

Mỗi component phải return **một root element**.

❌ Sai

```jsx
return (
  <h1>Title</h1>
  <p>Text</p>
);
```

✅ Đúng

```jsx
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
);
```

---

## 5️⃣ Style inline là object

Không dùng string như HTML.

❌ Sai

```jsx
<div style="color: red"></div>
```

✅ Đúng

```jsx
<div style={{ color: "red", fontSize: "16px" }}></div>
```

---

## 6️⃣ Event handler dùng function, không dùng string

❌ Sai

```html
<button onclick="handleClick()">Click</button>
```

✅ Đúng

```jsx
<button onClick={handleClick}>Click</button>
```

---

## 7️⃣ Render danh sách phải có `key`

`key` giúp React tối ưu render.

❌ Sai

```jsx
{items.map(item => <li>{item.name}</li>)}
```

✅ Đúng

```jsx
{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}
```

---

## 8️⃣ Không thao tác DOM trực tiếp

❌ Không dùng:

```js
document.getElementById()
document.querySelector()
```

✅ Dùng **state / props**

```jsx
const [title, setTitle] = useState("Hello");
<h1>{title}</h1>
```

---

## 9️⃣ Input phải được quản lý (Controlled Component)

❌ Sai

```html
<input value="abc" />
```

✅ Dùng state

```jsx
<input value={value} onChange={e => setValue(e.target.value)} />
```

✅ Hoặc dùng React Hook Form

```jsx
<input {...register("email")} />
```

---

## 🔟 Không viết logic trực tiếp trong JSX phức tạp

❌ Sai

```jsx
{isLogin ? user.name : user ? user.email : ""}
```

✅ Đúng

```jsx
const displayName = isLogin ? user.name : "";
{displayName}
```

---

## 1️⃣1️⃣ Tách component nhỏ, đúng trách nhiệm

❌ Component quá lớn

```jsx
Page.jsx (500 dòng)
```

✅ Tách hợp lý

```
Header.jsx
Footer.jsx
LoginForm.jsx
Button.jsx
```

---

## 1️⃣2️⃣ Dùng props thay cho dữ liệu cứng

❌ Sai

```jsx
function Button() {
  return <button>Submit</button>;
}
```

✅ Đúng

```jsx
function Button({ text }) {
  return <button>{text}</button>;
}
```

---

## 1️⃣3️⃣ Component phải `return` JSX

❌ Sai

```jsx
const Header = () => {
  <div>Header</div>;
};
```

✅ Đúng

```jsx
const Header = () => {
  return <div>Header</div>;
};
```

---

## 1️⃣4️⃣ Đặt tên file & component rõ ràng

* PascalCase cho component
* 1 component / 1 file

✅ Tốt

```
Header.jsx
LoginForm.jsx
UserCard.jsx
```

---

## ✅ Checklist nhanh khi convert HTML → React

✔ `class` → `className`
✔ `for` → `htmlFor`
✔ Event camelCase (`onClick`)
✔ 1 thẻ cha duy nhất
✔ Không thao tác DOM trực tiếp
✔ Input có state hoặc form library
✔ List có `key`
✔ Component viết hoa

---

📌 **Mẹo**: Nếu HTML chạy được → JSX chưa chắc chạy được. Hãy convert **từng phần nhỏ** để dễ debug.

---

## 1️⃣5️⃣ Self-closing tags phải có dấu `/`

Trong React, tất cả thẻ tự đóng **bắt buộc có `/>`**.

❌ Sai

```jsx
<img src="logo.png">
<input type="text">
<br>
```

✅ Đúng

```jsx
<img src="logo.png" />
<input type="text" />
<br />
```

---

## 1️⃣6️⃣ Comments trong JSX

Không dùng `<!-- -->` như HTML.

❌ Sai

```jsx
<!-- This is a comment -->
<div>Hello</div>
```

✅ Đúng

```jsx
{/* This is a comment */}
<div>Hello</div>
```

---

## 1️⃣7️⃣ Boolean attributes

Trong React, các thuộc tính boolean không cần giá trị.

❌ Dài dòng

```jsx
<input disabled={true} required={true} />
```

✅ Ngắn gọn

```jsx
<input disabled required />
```

✅ Conditional

```jsx
<input disabled={isLoading} />
```

---

## 1️⃣8️⃣ Render conditional

Có nhiều cách render theo điều kiện trong React.

✅ && operator

```jsx
{isLoggedIn && <WelcomeMessage />}
```

✅ Ternary

```jsx
{isLoggedIn ? <Dashboard /> : <Login />}
```

✅ Early return

```jsx
if (!user) return <Loading />;
return <Profile user={user} />;
```

❌ Không dùng `if` trực tiếp trong JSX

```jsx
{if (condition) { <div>Text</div> }}  // ❌ Sai
```

---

## 1️⃣9️⃣ Fragment ngắn gọn `<>...</>`

Dùng Fragment khi không muốn thêm div không cần thiết.

❌ Thêm div thừa

```jsx
return (
  <div>
    <Header />
    <Content />
  </div>
);
```

✅ Dùng Fragment

```jsx
return (
  <>
    <Header />
    <Content />
  </>
);
```

✅ Fragment với key (khi map)

```jsx
{items.map(item => (
  <Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.description}</dd>
  </Fragment>
))}
```

---

## 2️⃣0️⃣ Không được sửa props

Props là **read-only**, không được modify trực tiếp.

❌ Sai

```jsx
function Button({ text }) {
  text = text.toUpperCase(); // ❌ Sai
  return <button>{text}</button>;
}
```

✅ Đúng

```jsx
function Button({ text }) {
  const displayText = text.toUpperCase();
  return <button>{displayText}</button>;
}
```

---

## 2️⃣1️⃣ Không được sửa state trực tiếp

Luôn dùng **setter function** để update state.

❌ Sai

```jsx
state.count = 5;
state.users.push(newUser);
```

✅ Đúng

```jsx
setCount(5);
setUsers([...users, newUser]);
```

---

## 2️⃣2️⃣ useEffect dependencies

Phải khai báo đầy đủ dependencies để tránh bug.

❌ Thiếu dependencies

```jsx
useEffect(() => {
  fetchData(userId);
}, []); // ❌ Thiếu userId
```

✅ Đầy đủ

```jsx
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

---

## 2️⃣3️⃣ Tránh inline function trong render

Tạo function mới mỗi lần render → performance kém.

❌ Tốn performance

```jsx
<button onClick={() => handleClick(id)}>Click</button>
```

✅ Tốt hơn (nếu không cần parameter)

```jsx
<button onClick={handleClick}>Click</button>
```

✅ Nếu cần parameter, dùng useCallback

```jsx
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

---

## 2️⃣4️⃣ Destructuring props

Làm code sạch hơn, dễ đọc hơn.

❌ Không destructure

```jsx
function User(props) {
  return <div>{props.name} - {props.email}</div>;
}
```

✅ Destructure

```jsx
function User({ name, email }) {
  return <div>{name} - {email}</div>;
}
```

---

## 2️⃣5️⃣ Default props

Đặt giá trị mặc định cho props.

✅ Cách 1: Destructuring

```jsx
function Button({ text = "Submit", color = "blue" }) {
  return <button style={{ color }}>{text}</button>;
}
```

✅ Cách 2: defaultProps

```jsx
Button.defaultProps = {
  text: "Submit",
  color: "blue"
};
```

---

## 2️⃣6️⃣ PropTypes validation

Kiểm tra kiểu dữ liệu props (optional nhưng hữu ích).

```jsx
import PropTypes from 'prop-types';

function User({ name, age, isActive }) {
  return <div>{name}</div>;
}

User.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  isActive: PropTypes.bool
};
```

---

## 2️⃣7️⃣ Async trong useEffect

Không được return Promise trực tiếp từ useEffect.

❌ Sai

```jsx
useEffect(async () => {
  const data = await fetchData();
}, []);
```

✅ Đúng

```jsx
useEffect(() => {
  const loadData = async () => {
    const data = await fetchData();
  };
  loadData();
}, []);
```

---

## 2️⃣8️⃣ Cleanup trong useEffect

Luôn cleanup khi component unmount để tránh memory leak.

✅ Cleanup

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);
  
  return () => clearInterval(timer); // Cleanup
}, []);
```

---

## 2️⃣9️⃣ Key không dùng index

Tránh dùng array index làm key → gây bug khi reorder.

❌ Không nên

```jsx
{items.map((item, index) => (
  <li key={index}>{item.name}</li>
))}
```

✅ Dùng unique ID

```jsx
{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}
```

---

## 3️⃣0️⃣ Import/Export đúng cách

**Named export**

```jsx
// Button.jsx
export function Button() {}
export const Icon = () => {};

// Import
import { Button, Icon } from './Button';
```

**Default export**

```jsx
// Header.jsx
export default function Header() {}

// Import
import Header from './Header';
```

---

## 3️⃣1️⃣ Tránh nested ternary

Quá nhiều ternary lồng nhau → khó đọc.

❌ Khó đọc

```jsx
{status === 'loading' ? <Spinner /> : status === 'error' ? <Error /> : <Data />}
```

✅ Dùng function hoặc component riêng

```jsx
const renderContent = () => {
  if (status === 'loading') return <Spinner />;
  if (status === 'error') return <Error />;
  return <Data />;
};

return <div>{renderContent()}</div>;
```

---

## 3️⃣2️⃣ Children prop

`children` là prop đặc biệt chứa nội dung bên trong component.

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

// Sử dụng
<Card>
  <h2>Title</h2>
  <p>Content</p>
</Card>
```

---

## 3️⃣3️⃣ Spread props

Truyền nhiều props cùng lúc.

```jsx
const userProps = {
  name: "John",
  age: 30,
  email: "john@example.com"
};

<User {...userProps} />
```

❗ Chú ý: Không lạm dụng vì khó debug.

---

## 3️⃣4️⃣ State batching

React tự động gom nhiều setState thành 1 lần render.

```jsx
const handleClick = () => {
  setCount(count + 1);
  setName("John");
  setActive(true);
  // Chỉ render 1 lần dù có 3 setState
};
```

---

## 3️⃣5️⃣ Functional updates

Khi state mới phụ thuộc vào state cũ.

❌ Có thể bị bug

```jsx
setCount(count + 1);
setCount(count + 1); // Không được +2
```

✅ Dùng function

```jsx
setCount(prev => prev + 1);
setCount(prev => prev + 1); // Được +2
```

---

## 3️⃣6️⃣ Đặt tên event handler

Convention: `handle` + tên event.

✅ Chuẩn

```jsx
const handleClick = () => {};
const handleSubmit = () => {};
const handleChange = () => {};
```

---

## 3️⃣7️⃣ Tránh bind trong render

Tạo function mới mỗi lần render → performance kém.

❌ Không tối ưu

```jsx
<button onClick={this.handleClick.bind(this)}>Click</button>
```

✅ Dùng arrow function trong class

```jsx
handleClick = () => {
  // ...
}
```

---

## 3️⃣8️⃣ Strict Mode

Bật Strict Mode để phát hiện lỗi sớm.

```jsx
import { StrictMode } from 'react';

<StrictMode>
  <App />
</StrictMode>
```

---

## 3️⃣9️⃣ Environment variables

Dùng biến môi trường an toàn.

**Vite:**

```jsx
const API_URL = import.meta.env.VITE_API_URL;
```

**Create React App:**

```jsx
const API_URL = process.env.REACT_APP_API_URL;
```

❗ Không commit file `.env` có thông tin nhạy cảm.

---

## 4️⃣0️⃣ Lazy loading & Code splitting

Tối ưu performance với lazy load.

```jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}
```

---

👉 Có thể dùng file này làm **cheat sheet khi học React** hoặc **note cho project thực tế**.
