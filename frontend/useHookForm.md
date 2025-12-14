# 📝 React Hook Form - Hướng dẫn đầy đủ

Thư viện quản lý form hiệu quả, ít re-render, dễ validation.

---

## 📦 Cài đặt

```bash
npm install react-hook-form
```

---

## 1️⃣ Cú pháp cơ bản

```jsx
import { useForm } from 'react-hook-form';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data); // { email: "...", password: "..." }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      <input type="password" {...register("password")} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 2️⃣ Validation cơ bản

```jsx
<input 
  {...register("email", {
    required: "Email là bắt buộc",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Email không hợp lệ"
    }
  })} 
/>

{errors.email && <span>{errors.email.message}</span>}
```

### Các validation phổ biến:

| Rule | Ví dụ | Mô tả |
|------|-------|-------|
| `required` | `required: "Bắt buộc"` | Không được để trống |
| `minLength` | `minLength: { value: 6, message: "Tối thiểu 6 ký tự" }` | Độ dài tối thiểu |
| `maxLength` | `maxLength: { value: 20, message: "Tối đa 20 ký tự" }` | Độ dài tối đa |
| `min` | `min: { value: 18, message: "Tối thiểu 18" }` | Giá trị số tối thiểu |
| `max` | `max: { value: 100, message: "Tối đa 100" }` | Giá trị số tối đa |
| `pattern` | `pattern: { value: /regex/, message: "..." }` | Regex validation |
| `validate` | `validate: value => value !== 'admin' \|\| "Không được dùng admin"` | Custom validation |

---

## 3️⃣ Hiển thị lỗi

```jsx
const { register, handleSubmit, formState: { errors } } = useForm();

<input {...register("username", { required: "Username bắt buộc" })} />
{errors.username && <p className="error">{errors.username.message}</p>}
```

### Kiểm tra nhiều lỗi:

```jsx
{errors.username?.type === "required" && <p>Trường bắt buộc</p>}
{errors.username?.type === "minLength" && <p>Quá ngắn</p>}
```

---

## 4️⃣ Default values

```jsx
const { register, handleSubmit } = useForm({
  defaultValues: {
    username: "john_doe",
    email: "john@example.com",
    age: 25
  }
});
```

---

## 5️⃣ Watch - Theo dõi giá trị input

```jsx
const { register, watch } = useForm();
const password = watch("password"); // Lấy giá trị realtime

<input {...register("password")} />
<input 
  {...register("confirmPassword", {
    validate: value => value === password || "Mật khẩu không khớp"
  })} 
/>
```

### Watch nhiều field:

```jsx
const [email, password] = watch(["email", "password"]);
```

### Watch tất cả:

```jsx
const allValues = watch(); // { email: "...", password: "..." }
```

---

## 6️⃣ Reset form

```jsx
const { reset } = useForm();

const handleReset = () => {
  reset(); // Reset về defaultValues
};

const handleResetWithValues = () => {
  reset({ email: "", password: "" }); // Reset về giá trị mới
};
```

---

## 7️⃣ SetValue - Gán giá trị thủ công

```jsx
const { setValue } = useForm();

const handleFillForm = () => {
  setValue("email", "test@example.com");
  setValue("password", "123456");
};
```

---

## 8️⃣ SetError - Hiển thị lỗi từ API

```jsx
const { setError } = useForm();

const onSubmit = async (data) => {
  try {
    await loginAPI(data);
  } catch (error) {
    setError("email", {
      type: "manual",
      message: "Email hoặc mật khẩu không đúng"
    });
  }
};
```

### Set lỗi cho root (lỗi chung):

```jsx
setError("root", {
  type: "manual",
  message: "Đăng nhập thất bại"
});

{errors.root && <p>{errors.root.message}</p>}
```

---

## 9️⃣ Mode validation

```jsx
const { register } = useForm({
  mode: "onChange" // Validate khi thay đổi
});
```

| Mode | Khi nào validate |
|------|------------------|
| `onSubmit` (default) | Khi submit form |
| `onChange` | Mỗi khi thay đổi |
| `onBlur` | Khi blur khỏi input |
| `onTouched` | Sau lần blur đầu tiên |
| `all` | onChange + onBlur |

---

## 🔟 Custom validation function

```jsx
<input 
  {...register("age", {
    validate: {
      positive: value => parseInt(value) > 0 || "Phải là số dương",
      lessThan100: value => parseInt(value) < 100 || "Phải nhỏ hơn 100"
    }
  })} 
/>
```

---

## 1️⃣1️⃣ Validate async (gọi API)

```jsx
<input 
  {...register("username", {
    validate: async (value) => {
      const response = await fetch(`/api/check-username?username=${value}`);
      const data = await response.json();
      return data.available || "Username đã tồn tại";
    }
  })} 
/>
```

---

## 1️⃣2️⃣ Trigger - Validate thủ công

```jsx
const { trigger } = useForm();

const handleCheckEmail = async () => {
  const isValid = await trigger("email"); // true/false
  if (isValid) {
    console.log("Email hợp lệ");
  }
};

// Validate nhiều field
await trigger(["email", "password"]);

// Validate tất cả
await trigger();
```

---

## 1️⃣3️⃣ GetValues - Lấy giá trị không re-render

```jsx
const { getValues } = useForm();

const handleSave = () => {
  const values = getValues(); // Không trigger re-render
  console.log(values);
};

// Lấy 1 field
const email = getValues("email");

// Lấy nhiều field
const [email, password] = getValues(["email", "password"]);
```

---

## 1️⃣4️⃣ FormState - Trạng thái form

```jsx
const { formState } = useForm();

console.log(formState.isDirty);        // Form đã thay đổi?
console.log(formState.isValid);        // Form hợp lệ?
console.log(formState.isSubmitting);   // Đang submit?
console.log(formState.isSubmitted);    // Đã submit?
console.log(formState.touchedFields);  // Field nào đã touch
console.log(formState.dirtyFields);    // Field nào đã thay đổi
console.log(formState.errors);         // Object lỗi
```

### Sử dụng trong UI:

```jsx
const { formState: { isSubmitting, isValid } } = useForm();

<button 
  type="submit" 
  disabled={isSubmitting || !isValid}
>
  {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
</button>
```

---

## 1️⃣5️⃣ Unregister - Xóa field khỏi form

```jsx
const { unregister } = useForm();

const handleRemoveField = () => {
  unregister("phoneNumber");
};
```

---

## 1️⃣6️⃣ Controller - Wrap thư viện UI

Dùng cho các thư viện như Material-UI, Ant Design, Select...

```jsx
import { Controller } from 'react-hook-form';
import Select from 'react-select';

<Controller
  name="country"
  control={control}
  rules={{ required: "Chọn quốc gia" }}
  render={({ field }) => (
    <Select {...field} options={countries} />
  )}
/>
```

---

## 1️⃣7️⃣ Handle dynamic fields (FieldArray)

```jsx
import { useFieldArray } from 'react-hook-form';

const { control } = useForm();
const { fields, append, remove } = useFieldArray({
  control,
  name: "users"
});

<>
  {fields.map((field, index) => (
    <div key={field.id}>
      <input {...register(`users.${index}.name`)} />
      <button onClick={() => remove(index)}>Xóa</button>
    </div>
  ))}
  <button onClick={() => append({ name: "" })}>Thêm</button>
</>
```

---

## 1️⃣8️⃣ Nested objects

```jsx
<input {...register("user.firstName")} />
<input {...register("user.lastName")} />
<input {...register("user.address.city")} />

// Submit data:
// {
//   user: {
//     firstName: "John",
//     lastName: "Doe",
//     address: { city: "HCM" }
//   }
// }
```

---

## 1️⃣9️⃣ Tách validation rules ra file riêng

```js
// validations.js
export const emailRules = {
  required: "Email là bắt buộc",
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Email không hợp lệ"
  }
};

export const passwordRules = {
  required: "Mật khẩu là bắt buộc",
  minLength: {
    value: 6,
    message: "Mật khẩu tối thiểu 6 ký tự"
  }
};
```

```jsx
import { emailRules, passwordRules } from './validations';

<input {...register("email", emailRules)} />
<input {...register("password", passwordRules)} />
```

---

## 2️⃣0️⃣ DevTool - Debug form

```bash
npm install -D @hookform/devtools
```

```jsx
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

function App() {
  const { control } = useForm();
  
  return (
    <>
      <form>...</form>
      <DevTool control={control} />
    </>
  );
}
```

---

## ✅ Example hoàn chỉnh - Login Form

```jsx
import { useForm } from 'react-hook-form';

function LoginForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    setError 
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Đăng nhập thất bại');
      }
      
      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      setError('root', {
        message: error.message
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.root && (
        <div className="alert-error">{errors.root.message}</div>
      )}
      
      <div>
        <label>Email</label>
        <input 
          type="email"
          {...register('email', {
            required: 'Email là bắt buộc',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email không hợp lệ'
            }
          })}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label>Password</label>
        <input 
          type="password"
          {...register('password', {
            required: 'Mật khẩu là bắt buộc',
            minLength: {
              value: 6,
              message: 'Mật khẩu tối thiểu 6 ký tự'
            }
          })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
      </button>
    </form>
  );
}
```

---

## 🎯 Best Practices

✅ **Tách validation rules** ra file riêng
✅ **Dùng mode phù hợp** (onBlur tốt cho UX)
✅ **SetError** cho lỗi từ API
✅ **Disable button** khi isSubmitting
✅ **GetValues** thay watch nếu không cần re-render
✅ **Controller** cho thư viện UI bên ngoài
✅ **DevTool** để debug trong development

❌ **Không dùng inline validation** phức tạp
❌ **Không watch** tất cả field nếu không cần
❌ **Không quên** hiển thị lỗi cho user

---

## 📚 Tài liệu chính thức

👉 [react-hook-form.com](https://react-hook-form.com)

---

🎓 **Khi nào dùng React Hook Form?**

✅ Form có nhiều field
✅ Cần validation phức tạp
✅ Muốn tối ưu performance (ít re-render)
✅ Cần integrate với UI library

❌ Form đơn giản 1-2 field → Dùng useState đơn giản hơn
