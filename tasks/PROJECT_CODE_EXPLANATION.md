# GIẢI THÍCH CHI TIẾT TOÀN BỘ LOGIC CODE DỰ ÁN LUXBAG (TỪ A-Z)

Tài liệu này được viết để giúp bạn hiểu **từng dòng code, từng khái niệm** trong dự án, từ những thứ cơ bản nhất của React Native cho đến những logic nâng cao mà bạn đã áp dụng. Hãy đọc kỹ để tự tin 100% khi thầy hỏi "Chỗ này hoạt động như thế nào?".

---

## PHẦN 1: CÁC KHÁI NIỆM CƠ BẢN CỦA REACT NATIVE TRONG APP

Thầy có thể hỏi bạn về các Component cơ bản, hãy nắm chắc những định nghĩa sau:

1. **`<View>`**: Giống như thẻ `<div>` trong HTML. Dùng để tạo ra một khối (container) chứa các thành phần khác và dùng để dàn layout (flexbox).
2. **`<Text>`**: Dùng để hiển thị chữ. Mọi chữ trong React Native đều PHẢI được bọc trong thẻ này.
3. **`<TouchableOpacity>` / `<Pressable>`**: Dùng để tạo ra một khu vực có thể bấm được (như nút nhấn). `TouchableOpacity` khi bấm vào sẽ có hiệu ứng mờ đi (opacity), còn `Pressable` thì linh hoạt hơn, cho phép tùy chỉnh hiệu ứng nâng cao.
4. **`<FlatList>`**: Component "thần thánh" dùng để hiển thị danh sách dài. 
   * **Tại sao không dùng `map()` bình thường?** Vì nếu danh sách có 1000 túi xách, `map()` sẽ render ra 1000 cái cùng lúc gây treo máy. `FlatList` chỉ render những item nào đang hiển thị trên màn hình (cộng thêm vài cái dự phòng ở trên/dưới). Cuộn đến đâu render đến đó -> Rất tối ưu hiệu năng.
   * *Các thuộc tính quan trọng của FlatList:* 
     * `data`: Mảng dữ liệu đầu vào.
     * `renderItem`: Cái hàm để vẽ ra giao diện của TỪNG item.
     * `keyExtractor`: Tạo ra một ID duy nhất cho mỗi item để React biết item nào bị xóa/sửa mà cập nhật cho đúng.

## PHẦN 2: CÁC HOOKS (TRÁI TIM CỦA LOGIC)

Dự án này dùng rất nhiều Hook, đây là cách trả lời:

1. **`useState`**: Dùng để tạo ra các biến lưu trữ trạng thái. Khi giá trị này thay đổi (thông qua hàm set), giao diện sẽ tự động vẽ lại (re-render) để hiển thị dữ liệu mới. (Ví dụ: `const [searchText, setSearchText] = useState("")`).
2. **`useEffect`**: Dùng để thực hiện các "tác vụ phụ" (side effects) như: Gọi API lấy data khi mở màn hình, tính toán thời gian, hoặc theo dõi một biến nào đó thay đổi.
3. **`useMemo`**: Dùng để "ghi nhớ" một KẾT QUẢ TÍNH TOÁN. Giúp App không phải tính đi tính lại các phép toán nặng (như lọc danh sách túi xách, tính khoảng cách) nếu dữ liệu gốc không đổi.
4. **`useCallback`**: Dùng để "ghi nhớ" một HÀM. Tránh việc tạo ra các hàm mới liên tục mỗi khi màn hình re-render, giúp các component con không bị render lại oan uổng.
5. **`useRef`**: Giống như một cái hộp giữ giá trị mà khi giá trị trong hộp thay đổi, component KHÔNG bị re-render. Rất hay dùng để lưu tham chiếu tới Map (`mapRef`) hoặc BottomSheet để gọi các hàm `.animateToRegion()` hay `.snapToIndex()`.

---

## PHẦN 3: GIẢI THÍCH LUỒNG CHẠY TỪNG FILE QUAN TRỌNG

### 1. `App.js` & `src/navigation/AppNavigator.js` (Cổng vào của App)
*   **Chức năng:** Nơi cấu hình đường đi nước bước của toàn bộ App.
*   **Logic:**
    *   Trong `App.js`, bạn bọc toàn bộ App bằng `<GestureHandlerRootView>`. Điều này bắt buộc phải có để các thao tác vuốt, kéo (như vuốt BottomSheet hay kéo Bản đồ) hoạt động.
    *   `<FavoritesProvider>`: Bọc ngoài cùng để mọi màn hình đều truy cập được danh sách yêu thích.
    *   **Nested Navigation (Điều hướng lồng nhau):** Bạn có một `Tab.Navigator` (chứa Home, Map, Orders, Favorites) nằm lồng BÊN TRONG `Stack.Navigator` (chứa Detail, Order, AddressPicker). 
    *   *Mục đích:* Khi đang ở Home (Tab), bấm vào 1 cái túi sẽ mở ra Detail (Stack) đè lên trên, che luôn thanh Tab Bar đi, giúp người dùng tập trung vào chi tiết sản phẩm.

### 2. `src/hooks/useHandbags.js` (Logic Lấy Data & Lọc)
*   **Chức năng:** Quản lý toàn bộ dữ liệu danh sách túi xách. Việc tách ra file Hook riêng như vầy gọi là *Clean Code*, giúp màn hình Home chỉ tập trung vào UI, không chứa logic lằng nhằng.
*   **Logic:**
    *   Gọi hàm `getHandbags()` từ file API.
    *   Biến `filteredData` dùng `useMemo`: 
        ```javascript
        const filteredData = useMemo(() => {
           // 1. Copy mảng gốc
           // 2. Lọc theo Brand (nếu chọn khác "All")
           // 3. Lọc theo Tên (nếu có gõ searchText)
           // 4. Sắp xếp giá từ cao xuống thấp
           return result;
        }, [handbags, selectedBrand, searchText]);
        ```
        *Giải thích cho thầy:* "Nếu em không dùng `useMemo` ở đây, mỗi khi em gõ 1 chữ vào ô tìm kiếm, toàn bộ quá trình lọc và sắp xếp này sẽ chạy lại từ đầu gây lag máy."

### 3. `src/context/FavoritesContext.js` (Quản lý Yêu thích)
*   **Chức năng:** Chia sẻ danh sách túi xách yêu thích giữa màn hình Home, Detail và Favorite mà không cần truyền props lằng nhằng (Prop Drilling).
*   **Logic:** 
    *   Khởi tạo bằng `createContext`.
    *   Khi app mở lên (`useEffect` chạy lần đầu), nó lấy danh sách yêu thích đã lưu từ bộ nhớ điện thoại (`AsyncStorage`) đưa vào state `favorites`.
    *   Hàm `toggleFav`: Kiểm tra xem túi đó có trong mảng chưa, nếu có rồi thì xóa (bỏ tim), chưa có thì thêm vào (thả tim), sau đó lưu ngược lại vào `AsyncStorage`.

### 4. `src/screens/MapScreen.js` (Màn hình Phức tạp nhất)
Đây là màn hình thể hiện trình độ Senior của bạn, hãy giải thích như sau:
*   **Chức năng:** Hiển thị vị trí cửa hàng gần nhất (Store Locator) HOẶC theo dõi hành trình giao hàng (Delivery Tracking).
*   **Logic Store Locator (Khi không có đơn hàng):**
    *   Lấy tọa độ GPS của người dùng (`useUserLocation`).
    *   Dùng hàm `haversine` (công thức toán học tính khoảng cách giữa 2 điểm kinh độ/vĩ độ trên hình cầu Trái Đất) để tính khoảng cách từ khách đến các Store.
    *   Dùng `.sort` để sắp xếp cửa hàng gần nhất lên đầu.
*   **Logic Tracking (Khi có đơn hàng Delivery):**
    *   **Mô phỏng (Simulation):** Dùng `setInterval` cứ 3 giây (3000ms) sẽ nhích vị trí tài xế lên 1 điểm trong mảng `routeCoords`.
    *   **Smooth Animation (Trượt mượt):** Thay vì dùng tọa độ cứng, em dùng `AnimatedRegion` của `react-native-maps`. Khi tọa độ đổi, em gọi `driverCoord.timing({...}).start()` để tạo hiệu ứng xe chạy mượt mà từ điểm A sang điểm B trong 2 giây.
    *   **Xoay đầu xe (Heading):** Dùng hàm `calcHeading` (sử dụng toán học lượng giác `Math.atan2`) để tính góc giữa điểm hiện tại và điểm tiếp theo, sau đó truyền vào thuộc tính `rotation` của Marker để đầu xe luôn hướng về phía trước.

### 5. `src/screens/AddressPickerScreen.js` (Chọn địa chỉ trên Map)
*   **Chức năng:** Cho phép khách hàng cắm cờ trên bản đồ để chọn địa chỉ giao hàng.
*   **Logic "Reverse Geocoding":**
    *   Khi khách hàng kéo Map (thay đổi `pin`), App sẽ lấy `latitude` và `longitude` đó gửi lên API miễn phí của Nominatim (OpenStreetMap).
    *   API này sẽ dịch tọa độ (số) thành địa chỉ chữ (ví dụ: "65 Lê Lợi, Q1").
    *   **Kỹ thuật Debounce:** Ở trong `useEffect`, em dùng `setTimeout` 800ms. Nghĩa là khách hàng kéo map liên tục thì không gọi API, chỉ khi nào khách DỪNG KÉO 800ms em mới gọi. (Giải thích: "Để tránh bị API chặn do spam request (gọi quá nhiều) và tiết kiệm mạng").

### 6. `src/utils/orderStorage.js` (Lưu trữ dữ liệu Local)
*   **Chức năng:** Lưu trữ đơn hàng để tắt App mở lại không bị mất.
*   **Logic:**
    *   Dùng thư viện `@react-native-async-storage/async-storage`.
    *   **Quan trọng:** AsyncStorage chỉ lưu được dạng CHUỖI (String). Do đó, khi lưu một Object/Array (đơn hàng), ta phải ép nó thành chuỗi bằng `JSON.stringify()`.
    *   Khi lấy ra (`getItem`), ta lại phải dịch nó từ chuỗi thành Object/Array bằng `JSON.parse()`.

---

## TỔNG KẾT CÁCH TRẢ LỜI DEBATE (MẸO TÂM LÝ)

1. **Khi thầy hỏi "Code này em copy ở đâu?":** 
   -> "Dạ code này em có tham khảo document của các thư viện (như React Native Maps) và trên mạng, nhưng em HIỂU RÕ từng dòng và ĐÃ CUSTOM lại theo đúng nhu cầu của App mình." (Sau đó giải thích logic như các phần trên).
2. **Khi thầy hỏi "Sao không làm cái X cái Y?":**
   -> "Dạ trong khuôn khổ thời gian của môn học, em tập trung làm hoàn thiện và tối ưu (performance) những luồng chính nhất như Đặt hàng và Map Tracking. Những cái X, Y em đã có thiết kế kiến trúc sẵn, nếu có thêm thời gian em hoàn toàn có thể đắp thêm vào."
3. **Từ khóa ghi điểm:** Hãy dùng những từ như: *Optimize (Tối ưu), Re-render (Vẽ lại giao diện), Custom Hook (Tách logic), Debounce (Chặn spam API), User Experience (Trải nghiệm người dùng).*

Chúc bạn tự tin vượt qua buổi bảo vệ! Tài liệu này đã bao trùm toàn bộ "não bộ" của dự án. Mọi dòng code bạn đang có đều phục vụ cho một trải nghiệm xịn xò và mượt mà.
