# Kết quả kiểm tra · VinMed

Ngày 12/11/2026, môi trường Windows, Node.js 26.13.0. Không có package ngoài.

| Kiểm tra | Kết quả | Phạm vi |
|---|---|---|
| `npm test` | **34/34 Pass** | 23 kiểm tra phân luồng, 11 kiểm tra cổng trạng thái |
| `node --check prototype/app.js` và `engine.js` | Pass | Cú pháp JavaScript |
| Server preview | HTTP 200 | `index.html` và tài nguyên nội bộ được phục vụ |
| UI Chrome / kích thước mobile | **Chưa xác minh** | Công cụ Computer Use dừng vì không xác định được URL hiện tại đủ tin cậy để áp dụng chính sách |
| AI thật, dược sĩ thật, đặt hàng thật | Không có | Mọi tác vụ được ghi là mô phỏng |

Test trạng thái chạy `app.js` thật trong Node VM với DOM giả tối thiểu, kiểm tra cổng bảo vệ và dữ liệu đầu ra. Không xác minh CSS, cuộn trang, focus, native dialog hay trình đọc màn hình. Hình SVG trong `prototype/images/` là minh họa chú thích, không phải bằng chứng đã render bằng browser.

Các bất biến đã thử: dấu hiệu nguy hiểm ưu tiên mọi ý mua hàng; không mở nháp cho ca cấm/nhóm cần chuyên môn; ca thường không gửi trước nhận + kiểm tra + duyệt; sửa tuổi 28 → 2 thu hồi quyền cũ; quá hạn không tự duyệt; hoàn tác gỡ ca; consent ban đầu trống và từ chối không lưu; đồng ý mới lưu, xóa/Phiên mới xóa; tin mới không kế thừa hồ sơ người trước; input HTML được escape.

Ngưỡng từ 7 ngày hoặc mô tả tuần/tháng là luật bảo thủ tự dựng cho demo, không phải ngưỡng y khoa đã thẩm định. Bộ từ khóa không đại diện khả năng hiểu ngôn ngữ tự nhiên hay hệ thống lâm sàng; ca không hiểu sẽ hỏi thêm/chuyển người.

Ban đầu test runner mặc định không tạo được process con (`EPERM`). Đã đổi sang `--test-isolation=none`, sau đó chạy thành công. Kiểm tra phát hiện và đã sửa lỗi chuẩn hóa chữ Đ hoa, lỗi tuổi trong tin cũ ghi đè tuổi vừa sửa, và ngăn kế thừa trường của người dùng thuốc trước.

Trước khi nộp, nhóm cần bấm theo `DEMO.md` trong Chrome/Edge, kiểm tra màn hình hẹp, thử cả hai dialog và thay hình minh họa bằng 1–2 screenshot thực tế có nhãn. Chưa có bằng chứng bonus gọi AI thật hoặc demo trước lớp.
