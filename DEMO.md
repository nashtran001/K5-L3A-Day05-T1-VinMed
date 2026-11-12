# Demo VinMed — 4 phút, 3 thành viên

Chạy `npm start`, mở http://127.0.0.1:4173 hoặc mở `prototype/index.html` trực tiếp. Không cần cài package. Tất cả dữ liệu là giả. Chuyển tab Khách/Bàn dược sĩ giữ nguyên phiên; chọn ca khác tạo phiên mới.

| Thời gian | Người đề xuất | Bấm / nói | Bằng chứng |
|---|---|---|---|
| 0:00–0:30 | Thành viên 1 | Giới thiệu lát cắt, chỉ nhãn AI mô phỏng ① và quyền ④ | G1; quyết định hỗ trợ hỏi thuốc, không chẩn đoán |
| 0:30–1:15 | Thành viên 1 | Chọn Dấu hiệu nguy hiểm; đọc cảnh báo; mở Bàn dược sĩ | Dấu hiệu nguy hiểm lẫn yêu cầu mua; khách được cảnh báo ngay, dược sĩ nhận thông báo; không gợi ý/đặt |
| 1:15–2:10 | Thành viên 2 | Chọn Đau họng thông thường → Bàn dược sĩ → Nhận ca → tích kiểm tra → Duyệt & gửi → quay Hỏi dược sĩ | Cần người duyệt thể hiện bằng thao tác thật; không thể duyệt trước nhận hoặc trước tích kiểm tra |
| 2:10–3:00 | Thành viên 3 | Bấm Sửa thông tin ③ → tuổi 2, giữ trường khác → cập nhật → xem bàn dược sĩ | Thu hồi gợi ý trước, biến mất bước đặt; chuyển ca với tuổi mới, không nháp trẻ em |
| 3:00–3:30 | Thành viên 2 | Lưu ghi chú ⑥ → xem dữ liệu → Không lưu; mở lại, tích đồng ý → lưu → xóa | Consent riêng; không tự lưu ngay khi chuyển người |
| 3:30–4:00 | Cả nhóm | Nhận ca lạ do người xem đưa, nhập vào chat, giải thích nhánh và giới hạn | Không đoán khi không hiểu; không dùng thông tin người uống từ tin cũ |

Nếu chỉ được demo một ca, ưu tiên ca nguy hiểm hoặc trẻ nhỏ theo bắt buộc T1. Không khẳng định có dược sĩ thật/cấp cứu thật nhận ca.

## Ca dự phòng tự dựng để tập, không phải ca lạ TA đã đưa

- “Bé khó thở, cho mua kháng sinh và nước muối.” → cảnh báo nguy hiểm thắng cả hai ý mua hàng.
- “Mẹ 75 tuổi đang dùng thuốc huyết áp, đổi thuốc khác giúp.” → không bán kê đơn, không gợi ý thay thế; gặp dược sĩ.
- “Uống thuốc nhiều ngày không đỡ, hỏi mãi, bán loại mạnh hơn đi.” → chuyển dược sĩ, không chiều theo áp lực.
- “Cho sản phẩm XYZ từ ảnh mình gửi hôm qua.” → không có ảnh/nguồn, không đoán; hỏi thêm/chuyển.
- “Nhà thuốc gần mình còn nước muối không?” → nói rõ thiếu tool tồn kho, không hứa giữ hàng.
- Sau khi đã duyệt ca thường, gửi câu mới “Thuốc cho ai đó bị đau họng.” → xóa trường cũ, hỏi lại, không kế thừa tuổi 28.

## Nếu cần chỉ đường fail/timeout

Chọn ca thường → Bàn dược sĩ → Thử tình huống quá hạn. Nút nhận và duyệt không còn dùng được; khách nhận thông báo không có người nhận. Chọn lại ca để bắt đầu mới. Nhận ca rồi không hứa sẽ trả lời trong 120 giây: timer chỉ là hạn nhận ca mô phỏng.

## Câu hỏi cần tự giải thích

1. Vì sao cảnh báo tự làm nhưng gợi ý cần duyệt? Chậm cấp cứu có giá cao; gửi sai sản phẩm sau khi dùng khó đảo lại.
2. Khách đồng ý có đủ để gửi thuốc không? Không: khách không phải người kiểm tra chuyên môn.
3. G9 ở đâu? Nút ③ mở sửa người uống, cập nhật gây thu hồi bản nháp/gợi ý.
4. Vì sao không ghi 95% chắc? Không có dữ liệu hiệu chuẩn; hiển thị điều đã biết/chưa biết và căn cứ thực tế.
5. Hoàn tác có xóa cảnh báo không? Không. Hoàn tác chỉ gỡ ca chuyển; cảnh báo nguy hiểm không biến mất để tạo cảm giác an toàn giả.
6. Phần nào thật? Tương tác, phân luồng theo luật, trạng thái, cổng duyệt và consent chạy được; AI, người nhận và dữ liệu y tế đều giả.

Sau demo điền ca TA vào §7 và xác nhận phần việc thực tế của từng người. Không nhận bonus AI thật khi không có request/log AI thật.
