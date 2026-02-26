# Kế hoạch phát triển ứng dụng HandBags

## 1. Tìm hiểu & Phân tích cấu trúc dự án (Đã xong)
- [x] Đọc `package.json` để kiểm tra dependencies.
- [x] Phân tích `App.js` và `AppNavigator.js`.
- [x] Xác định mô hình quản lý state hiện tại (Context API).

## 2. Hoàn thiện UI/UX & Logic
- [ ] Thiết kế `HomeScreen`: Sử dụng `FlatList` để hiển thị danh sách túi xách.
- [ ] Xử lý logic tại `DetailScreen`: Nhận dữ liệu từ `HomeScreen` qua params.
- [ ] Tích hợp tính năng "Thêm vào yêu thích" dùng `FavoritesContext`.

## 3. Tối ưu & Mở rộng
- [ ] Lưu trữ danh sách yêu thích vào bộ nhớ máy dùng `AsyncStorage`.
- [ ] Tối ưu hóa hiệu năng render với `memo` hoặc `useCallback` (nếu cần).
- [ ] Làm đẹp giao diện với các thư viện Animation (Lottie hoặc Reanimated) - (Nâng cao).

## Nhật ký học tập & Review
- **Ghi chú:** Luôn giữ cấu trúc thư mục sạch sẽ, phân tách UI và Logic rõ ràng.
