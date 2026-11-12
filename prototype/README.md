# Prototype Track 1

Mở `index.html` trực tiếp hoặc chạy `npm start` từ thư mục gốc. Hai vai trò chỉ là công tắc mô phỏng, không có đăng nhập.

| Nhãn | Vị trí | Ý nghĩa |
|---|---|---|
| ① | Đầu chat | G1: AI mô phỏng và phạm vi hỗ trợ |
| ② | Panel căn cứ | G10: điều đã biết/chưa biết, vì sao chuyển hoặc dừng |
| ③ | Sửa thông tin | G9: đổi người dùng thuốc, thu hồi nháp và duyệt cũ |
| ④ | Panel quyền | Tự làm / cần duyệt / cấm, đúng `spec.md` |
| ⑤ | Bàn dược sĩ | Tin gốc, phiên bản, nhận ca và cổng duyệt |
| ⑥ | Lưu ghi chú | Khách duyệt dữ liệu trước lưu, xóa được |

Các hình trong `images/` là minh họa để định vị chú thích, **không phải screenshot xác minh UI**. Công cụ Chrome không truy cập được do không xác định URL đủ tin cậy; nhóm cần chụp ảnh thực tế trước nộp. Có thể bỏ tick chú thích trên desktop để xem giao diện thuần.

`engine.js` không phải LLM, không có API key hoặc nguồn thuốc thật. `app.js` không gọi mạng hoặc ghi dữ liệu bền vững. `SP-DEMO-01` hoàn toàn giả; phần đặt chỉ minh họa điểm bàn giao, không thanh toán. Nhánh ca lạ hỏi thêm/chuyển người. Bộ luật không có độ bao phủ để dùng tư vấn thực tế.
