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

Đã có hai ảnh chụp do nhóm cung cấp: [màn hình khách hàng](images/01-customer.png) có nhãn ①②③④⑥ và [bàn dược sĩ](images/02-pharmacist.png) có nhãn ⑤. Ảnh bàn dược sĩ thể hiện ca nguy hiểm được ưu tiên, gợi ý sản phẩm bị chặn; không phải ảnh duyệt ca thường. Các file SVG trong `images/` là hình minh họa chú thích, không phải screenshot. Có thể bỏ tick chú thích trên desktop để xem giao diện thuần.

`engine.js` không phải LLM, không có API key hoặc nguồn thuốc thật. `app.js` không gọi mạng hoặc ghi dữ liệu bền vững. `SP-DEMO-01` hoàn toàn giả; phần đặt chỉ minh họa điểm bàn giao, không thanh toán. Nhánh ca lạ hỏi thêm/chuyển người. Bộ luật không có độ bao phủ để dùng tư vấn thực tế.

## Ca thường AI tự hỗ trợ

Ba lựa chọn đầu sidebar minh họa hướng dẫn thông tin, bổ sung từng tin và quản lý ghi chú. Hỏi quy trình không chuyển người; sửa bản khai không tự lưu; lưu/xóa cần đúng thao tác đồng ý của khách. Chỉ khi chuyển từ tổng hợp thông tin sang gợi ý sản phẩm mới cần dược sĩ theo thiết kế nhóm.

Tin bổ sung giữ ngữ cảnh cùng ca, panel cập nhật trường đã rõ. Câu đổi người rõ ràng bỏ dữ liệu người trước. Hệ thống chỉ nhận một số mẫu câu: nếu không nhận được thông tin, dùng form Bổ sung/Sửa. Ca nguy hiểm giữ cảnh báo và thông báo ưu tiên khi có tin tiếp theo. Không dùng bộ luật demo cho tư vấn thật.
