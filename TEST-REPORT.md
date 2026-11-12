# Kết quả kiểm tra · VinMed

Ngày 12/11/2026, kiểm tra lại trên Windows bằng Node.js 22.23.5 portable, tải từ nodejs.org và đối chiếu SHA256. Không cài package ngoài hoặc đổi Node toàn hệ thống.

| Kiểm tra | Kết quả | Phạm vi |
|---|---|---|
| `node --test tests/engine.test.cjs tests/workflow.test.cjs` | **47/47 Pass** | 30 kiểm tra phân luồng, 17 kiểm tra cổng trạng thái; đây là lệnh test được khai báo trong package.json |
| `node --check prototype/app.js` và `engine.js` | Pass | Cú pháp JavaScript |
| Server preview | HTTP 200 | Kiểm tra riêng trang chính, app.js, engine.js và styles.css trên 127.0.0.1:4173; chưa thay cho bấm thử browser |
| Ảnh UI do nhóm cung cấp | Đã xem hai ảnh desktop | `01-customer.png` và `02-pharmacist.png` thể hiện nhãn ①–⑥ và ca nguy hiểm ở hai vai trò; chưa xác minh toàn bộ tương tác hoặc kích thước mobile |
| AI thật, dược sĩ thật, đặt hàng thật | Không có | Mọi tác vụ được ghi là mô phỏng |

Test trạng thái chạy `app.js` thật trong Node VM với DOM giả tối thiểu, kiểm tra cổng bảo vệ và dữ liệu đầu ra. Không xác minh CSS, cuộn trang, focus, native dialog hay trình đọc màn hình. Hình SVG trong `prototype/images/` là minh họa chú thích, không phải bằng chứng đã render bằng browser.

Các bất biến đã thử: dấu hiệu nguy hiểm ưu tiên mọi ý mua hàng; không mở nháp cho ca cấm/nhóm cần chuyên môn; ca thường không gửi trước nhận + kiểm tra + duyệt; sửa tuổi 28 → 2 thu hồi quyền cũ; quá hạn không tự duyệt; hoàn tác gỡ ca; consent ban đầu trống và từ chối không lưu; đồng ý mới lưu, xóa/Phiên mới xóa; đổi người rõ ràng không kế thừa hồ sơ người trước; input HTML được escape.

Happy case mới: hỏi cần cung cấp gì không tạo hàng chờ; bổ sung từng tin giữ các trường trước và hỏi mục thiếu; đủ trường mới tạo nháp cần duyệt; sửa bản khai thuần túy không tự tạo triệu chứng/tư vấn; lưu/xóa ghi chú không tạo ca dược sĩ. Các test còn kiểm tra ca nguy hiểm không mất thông báo khi khách nhắn tiếp, và tin cảm ơn không gỡ ca đã được nhận.

Đã bổ sung test hồi quy: tuổi thai 3 tháng/tháng tuổi của bé không bị gọi là thời gian triệu chứng; “không bệnh nền, không dị ứng” không bị coi là thông tin bệnh có thật; trường “Chưa rõ” chưa đủ điều kiện tạo nháp.

Ngưỡng từ 7 ngày hoặc mô tả tuần/tháng là luật bảo thủ tự dựng cho demo, không phải ngưỡng y khoa đã thẩm định. Bộ từ khóa không đại diện khả năng hiểu ngôn ngữ tự nhiên hay hệ thống lâm sàng; ca không hiểu sẽ hỏi thêm/chuyển người.

Bản ghi trước báo 34 test pass trên môi trường khác. Kiểm tra mới phát hiện `--test-isolation=none` không có trên Node 22, nên package.json dùng `node --test` tiêu chuẩn; chạy được 47 test. Các lỗi được sửa trong lần mở rộng: mỗi tin mới gỡ ca và xóa sàng lọc; diễn giải nhầm tháng tuổi/tuổi thai; phủ định bệnh nền/dị ứng; hỏi lại tuổi dù đã có. Việc trích xuất thông tin chỉ hỗ trợ các mẫu câu demo, chưa phải xử lý ngôn ngữ y tế đầy đủ.
