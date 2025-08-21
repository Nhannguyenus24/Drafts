# Mobile Responsive Features

## Tổng quan
Ứng dụng chat này đã được tối ưu hóa để hoạt động hoàn hảo trên cả desktop và mobile, với thiết kế responsive theo phong cách GPT.

## Tính năng Mobile Responsive

### 1. Sidebar Responsive
- **Desktop**: Sidebar cố định bên trái (280px width)
- **Mobile**: Sidebar chuyển thành drawer có thể mở/đóng
- Tap vào menu icon để mở sidebar trên mobile
- Tự động đóng sidebar khi chọn conversation trên mobile

### 2. Navigation Mobile-First
- **Mobile Header**: AppBar với menu button và title
- **Desktop Header**: Header truyền thống với thông tin chi tiết
- Touch-friendly button sizes (44px minimum)

### 3. Chat Interface Optimization
- **Message bubbles**: Tăng kích thước trên mobile (maxWidth 90% vs 75%)
- **Avatar sizes**: Lớn hơn trên mobile (36px vs 32px)
- **Font sizes**: Tự động điều chỉnh cho mobile (16px vs 15px)
- **Padding/spacing**: Tối ưu cho touch interface

### 4. Input Interface
- **Font size**: 16px trên mobile để tránh zoom khi focus
- **Button size**: Lớn hơn cho dễ bấm (44px vs 36px)
- **Max rows**: Giảm từ 5 xuống 4 rows trên mobile
- **Safe area**: Hỗ trợ safe-area-inset-bottom cho mobile keyboard

### 5. Authentication Pages
- **Responsive layout**: Điều chỉnh padding, margins cho mobile
- **Touch targets**: Buttons và inputs lớn hơn
- **Typography**: Font sizes tối ưu cho mobile
- **Full height**: Sử dụng toàn bộ viewport trên mobile

### 6. Viewport & Meta Tags
- **Viewport**: Cấu hình tối ưu với maximum-scale=1
- **Apple meta tags**: Hỗ trợ iOS web app
- **No zoom on input**: Ngăn zoom khi focus input trên iOS
- **Safe areas**: Hỗ trợ devices có notch

### 7. Performance Optimizations
- **Touch scrolling**: -webkit-overflow-scrolling: touch
- **Scrollbar**: Ẩn hoặc thu nhỏ trên mobile
- **Hardware acceleration**: Tối ưu CSS transforms
- **Dynamic viewport**: Sử dụng dvh cho mobile browsers

## Breakpoints
```typescript
xs: 0px      // Extra small devices
sm: 600px    // Small devices  
md: 768px    // Medium devices (tablet)
lg: 1024px   // Large devices (desktop)
xl: 1200px   // Extra large devices
```

## Responsive Behavior
- **< 768px**: Mobile layout với drawer sidebar
- **≥ 768px**: Desktop layout với fixed sidebar

## Touch-Friendly Features
- Minimum 44px touch targets
- Proper spacing between interactive elements
- Optimized font sizes for readability
- Smooth scrolling and transitions
- Haptic feedback ready

## Browser Support
- ✅ iOS Safari (iPhone, iPad)
- ✅ Android Chrome
- ✅ Desktop Chrome, Firefox, Safari, Edge
- ✅ PWA ready với manifest.json

## Testing Checklist
- [ ] Sidebar opens/closes properly on mobile
- [ ] All text is readable without zooming
- [ ] Touch targets are at least 44px
- [ ] Keyboard doesn't break layout
- [ ] Safe areas work on notched devices
- [ ] Scrolling is smooth on all devices
- [ ] Orientation changes work correctly 