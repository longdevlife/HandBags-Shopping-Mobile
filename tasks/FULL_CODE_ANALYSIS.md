# PHÂN TÍCH TOÀN DIỆN MÃ NGUỒN DỰ ÁN LUXBAG (DÀNH CHO NGƯỜI MỚI)

Tài liệu này giải thích chi tiết từng phần quan trọng trong App của bạn. Hãy dùng nó để hiểu cách App vận hành từ bên trong.

---

## 1. CẤU TRÚC THƯ MỤC (DỰ ÁN ĐƯỢC CHIA NHƯ THẾ NÀO?)
- **src/api**: Nơi chứa code để App "gọi điện" lên Server lấy dữ liệu.
- **src/context**: Nơi chứa dữ liệu dùng chung cho toàn App (Yêu thích).
- **src/hooks**: Nơi chứa các logic xử lý dữ liệu (Lọc, tìm kiếm, lấy tọa độ).
- **src/screens**: Giao diện các màn hình (Home, Detail, Map...).
- **src/utils**: Các công cụ hỗ trợ (Lưu vào bộ nhớ máy, tính toán khoảng cách).
- **src/styles**: Nơi định nghĩa màu sắc, kích thước (CSS cho Mobile).

---

## 2. GIẢI THÍCH CHI TIẾT CÁC FEATURE CHÍNH

### A. LẤY DỮ LIỆU TỪ SERVER (`src/api/handbagApi.js`)
**Code:**
```javascript
const apiClient = axios.create({ baseURL: "...", timeout: 10000 });
export const getHandbags = async () => { ... };
```
- **Giải thích:** Bạn dùng thư viện `Axios`. Hãy tưởng tượng `apiClient` là một cái "mẫu đơn đặt hàng" có sẵn địa chỉ công ty. Khi gọi `getHandbags`, App sẽ gửi đơn này đi. 
- **Tại sao Senior?** Vì bạn dùng `axios.create` (tạo mẫu dùng chung) và xử lý lỗi bằng `try-catch`. Nếu Server sập, App sẽ báo lỗi thay vì bị treo (crash).

### B. BỘ NÃO XỬ LÝ DANH SÁCH (`src/hooks/useHandbags.js`)
Đây là phần quan trọng nhất của màn hình Home.
**Logic Tìm kiếm & Lọc:**
```javascript
const filteredData = useMemo(() => {
  let result = [...handbags]; // Bước 1: Lấy danh sách gốc
  if (selectedBrand !== "All") { // Bước 2: Nếu khách chọn hiệu khác "All", thì lọc theo hiệu đó
    result = result.filter(item => item.brand === selectedBrand);
  }
  // Bước 3: Nếu khách gõ tìm kiếm, lọc tiếp theo tên
  // Bước 4: Sắp xếp giá từ cao xuống thấp (.sort)
  return result;
}, [handbags, selectedBrand, searchText]);
```
- **Giải thích:** `useMemo` giúp App "nhớ" kết quả lọc. Nếu khách không gõ gì thêm, App không cần tính toán lại.
- **Dành cho thầy:** "Em dùng `FlatList` để hiển thị danh sách này vì nó cực kỳ tiết kiệm RAM, nó chỉ vẽ những gì thầy đang thấy trên màn hình thôi."

### C. QUẢN LÝ YÊU THÍCH (`src/context/FavoritesContext.js`)
**Logic:** Context giống như một cái "Loa phóng thanh" đặt ở giữa làng.
- **Provider:** Là cái Loa. Nó giữ danh sách túi xách khách đã thích.
- **Consumer (useFavorites):** Là người dân. Bất kỳ màn hình nào (Home hay Detail) cũng có thể nghe thấy cái loa này để biết túi nào đang được thả tim đỏ.
- **Lưu trữ:** Khi khách bấm thích, App gọi `AsyncStorage` để lưu vào bộ nhớ máy. Khi tắt App mở lại, tim vẫn đỏ.

### D. CHỌN ĐỊA CHỈ TRÊN MAP (`src/screens/AddressPickerScreen.js`)
**Logic Debounce (Trì hoãn):**
```javascript
const timer = setTimeout(() => {
  reverseGeocode(pin.latitude, pin.longitude);
}, 800);
```
- **Giải thích:** Khi bạn rê tay trên bản đồ, tọa độ thay đổi liên tục. Nếu mỗi lần nhích 1mm App lại gọi API lấy địa chỉ thì sẽ bị lag. 
- **Hành động:** App đợi bạn dừng tay hẳn 0.8 giây rồi mới gọi API. Đây là kỹ thuật cực kỳ chuyên nghiệp (Senior Level).

### E. THEO DÕI ĐƠN HÀNG (TRACKING) TRÊN MAP (`src/screens/MapScreen.js`)
Đây là phần "khó" nhất để giải thích:
1. **Di chuyển mượt (`AnimatedRegion`):** Thay vì icon tài xế nhảy từ điểm A sang B, ta dùng `AnimatedRegion`. Nó sẽ tự động tạo ra hàng trăm điểm nhỏ ở giữa để cái xe "trượt" đi mượt mà.
2. **Xoay đầu xe (`calcHeading`):** 
   - App lấy tọa độ điểm đang đứng và tọa độ điểm sắp tới.
   - Dùng công thức lượng giác (sin, cos, atan2) để tính xem cái xe phải quay bao nhiêu độ.
   - **Kết quả:** Đầu xe luôn hướng về phía trước. Nếu xe rẽ trái, icon sẽ tự xoay trái.
3. **Store Locator:** Nếu không có đơn hàng, App dùng công thức **Haversine** để tính xem từ vị trí GPS của bạn đến cửa hàng LuxBag gần nhất là bao nhiêu km.

---

## 3. CÁC KHÁI NIỆM REACT NATIVE CƠ BẢN (CÂU HỎI THƯỜNG GẶP)

- **State là gì?** Là bộ nhớ tạm của màn hình. State đổi -> Giao diện vẽ lại (Re-render).
- **Props là gì?** Là dữ liệu truyền từ màn hình cha xuống màn hình con (ví dụ truyền thông tin túi xách vào màn hình Detail).
- **Navigation là gì?** Là hệ thống dẫn đường. 
  - **Stack:** Chồng các màn hình lên nhau (mở chi tiết sản phẩm).
  - **Tab:** Các nút ở dưới cùng để chuyển nhanh giữa các tính năng chính.
- **useEffect là gì?** Là cái "chuông báo thức". App sẽ bảo: "Khi màn hình này vừa mở lên, hãy làm việc X cho tôi" (ví dụ: gọi API lấy túi xách).

---

## 4. LỜI KHUYÊN KHI DEBATE 1-1 VỚI THẦY

1. **Thành thật nhưng tự tin:** Nếu thầy hỏi sâu về toán học trong Map, bạn hãy nói: "Dạ đây là công thức chuẩn về tọa độ địa lý (Haversine/Bearing), em đã tìm hiểu tài liệu và áp dụng vào App để đạt được độ chính xác như các App giao hàng thực tế."
2. **Nhấn mạnh vào Hiệu năng (Performance):** Hãy nhắc nhiều đến việc bạn dùng `useMemo`, `useCallback`, `FlatList` và `Debounce`. Đây là những thứ thầy giáo đánh giá rất cao vì nó cho thấy bạn quan tâm đến việc App chạy có mượt hay không.
3. **Giải thích về Custom Component:** "Thưa thầy, em tự viết `CustomBottomSheet` bằng `Animated` API của React Native thay vì dùng thư viện có sẵn để App nhẹ hơn và em có toàn quyền kiểm soát giao diện."

---
*Chúc bạn bình tĩnh và tự tin. Với bộ code này và tài liệu này, bạn hoàn toàn đủ khả năng đạt điểm xuất sắc!*
