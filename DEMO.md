# Demo VinMed — 4 phút, 3 thành viên

Chạy `uv run python -m http.server 4173 --directory prototype`, mở http://127.0.0.1:4173. Không cần npm để mở giao diện. Tất cả dữ liệu là giả. Chuyển tab Khách/Bàn dược sĩ giữ nguyên phiên; chọn ca khác tạo phiên mới.

| Thời gian | Người trình bày theo kế hoạch | Bấm / nói | Bằng chứng |
|---|---|---|---|
| 0:00–0:30 | Nguyễn Cảnh Hiếu | Giới thiệu lát cắt, chỉ nhãn AI mô phỏng ① và quyền ④ | G1; quyết định hỗ trợ hỏi thuốc, không chẩn đoán |
| 0:30–1:15 | Nguyễn Cảnh Hiếu | Chọn Dấu hiệu nguy hiểm; đọc cảnh báo; mở Bàn dược sĩ | Dấu hiệu nguy hiểm lẫn yêu cầu mua; khách được cảnh báo ngay, dược sĩ nhận thông báo; không gợi ý/đặt |
| 1:15–2:10 | Trần Minh Nhật | Chọn Đau họng thông thường → Bàn dược sĩ → Nhận ca → tích kiểm tra → Duyệt & gửi → quay Hỏi dược sĩ | Cần người duyệt thể hiện bằng thao tác thật; không thể duyệt trước nhận hoặc trước tích kiểm tra |
| 2:10–3:00 | Phạm Cát Tân | Bấm Sửa thông tin ③ → tuổi 2, giữ trường khác → cập nhật → xem bàn dược sĩ | Thu hồi gợi ý trước, biến mất bước đặt; chuyển ca với tuổi mới, không nháp trẻ em |
| 3:00–3:30 | Trần Minh Nhật | Lưu ghi chú ⑥ → xem dữ liệu → Không lưu; mở lại, tích đồng ý → lưu → xóa | Consent riêng; không tự lưu ngay khi chuyển người |
| 3:30–4:00 | Cả nhóm | Nhận ca lạ do người xem đưa, nhập vào chat, giải thích nhánh và giới hạn | Không đoán khi không hiểu; không dùng thông tin người uống từ tin cũ |

Nếu chỉ được demo một ca, ưu tiên ca nguy hiểm hoặc trẻ nhỏ theo bắt buộc T1. Không khẳng định có dược sĩ thật/cấp cứu thật nhận ca.

## Lời dẫn để ba người tập trình bày

- **Hiếu:** “VinMed hỗ trợ thu thập thông tin và phân luồng. Với ca có dấu hiệu nguy hiểm, hệ thống cảnh báo ngay vì bắt khách chờ có thể gây hại. Thông báo ở bàn dược sĩ không có nghĩa đã gọi cấp cứu hoặc có người thật tiếp nhận.”
- **Nhật:** “Ca đủ thông tin vẫn cần dược sĩ duyệt trước khi gửi gợi ý. AI chỉ chuẩn bị nháp; các bước nhận ca, kiểm tra và duyệt thể hiện quyền này bằng thao tác. Lưu ghi chú là quyền khác, cần khách đồng ý riêng và có thể xóa.”
- **Tân:** “Khi sửa người uống từ người lớn thành trẻ nhỏ, gợi ý và quyền đặt cũ bị thu hồi. Đây là sửa cả trạng thái, không chỉ sửa câu chữ. Với ca lạ, nhóm quan sát nhánh thực tế, giải thích giới hạn rồi ghi lại quyết định ở §7.”

Khi nhận ca lạ, Tân nhập và ghi nguyên tin nhắn cùng kết quả; Hiếu đối chiếu rủi ro, Nhật đối chiếu mức tự chủ. Nếu cần trao đổi dài hơn 30 giây cuối, xin thêm thời gian thay vì bỏ qua việc kiểm tra. Lời dẫn là tài liệu tập, không phải biên bản demo đã diễn ra.

## Ca dự phòng tự dựng để tập, không phải ca lạ TA đã đưa

### Happy case: phần việc AI tự hoàn tất

- **H1:** chọn Cần chuẩn bị thông tin gì? → AI hướng dẫn từ các trường fixture; Bàn dược sĩ vẫn không có ca.
- **H2:** chọn Bổ sung từng tin nhắn → gửi lần lượt `Mình 28 tuổi`, `Không mang thai và không cho con bú`, `Không dùng thuốc, không bệnh nền và không dị ứng`. Panel giữ thời gian `2 ngày`, hỏi mục thiếu tiếp theo. Khi đủ, AI thông báo đã tổng hợp; chỉ lúc cần nháp sản phẩm mới chuyển dược sĩ, chưa gửi gợi ý khách.
- **H3:** chọn Sửa, lưu và xóa ghi chú → sửa tuổi thành 30, khai các trường muốn cung cấp → không tự tạo bệnh/ca tư vấn, chưa lưu hồ sơ.
- **H4:** từ H3 mở lưu → xem preview → Không lưu; mở lại → đồng ý → lưu → xóa. Không cần dược sĩ; thao tác mô phỏng trong RAM.
- **H5:** ca thường đã đủ trường → dược sĩ duyệt theo demo chính. Happy path không đồng nghĩa AI tự chọn thuốc.

### Ca thực hành rủi ro

- “Bé khó thở, cho mua kháng sinh và nước muối.” → cảnh báo nguy hiểm thắng cả hai ý mua hàng.
- “Mẹ 75 tuổi đang dùng thuốc huyết áp, đổi thuốc khác giúp.” → không bán kê đơn, không gợi ý thay thế; gặp dược sĩ.
- “Uống thuốc nhiều ngày không đỡ, hỏi mãi, bán loại mạnh hơn đi.” → chuyển dược sĩ, không chiều theo áp lực.
- “Cho sản phẩm XYZ từ ảnh mình gửi hôm qua.” → không có ảnh/nguồn, không đoán; hỏi thêm/chuyển.
- “Nhà thuốc gần mình còn nước muối không?” → nói rõ thiếu tool tồn kho, không hứa giữ hàng.
- Sau khi đã duyệt ca thường, gửi “Bạn mình đau họng, cho thuốc với” → nhận biết đổi người, xóa trường cũ và hỏi lại, không kế thừa tuổi 28.
- Chọn ca nguy hiểm rồi gửi “Tôi đang chờ xe” hoặc hỏi cần cung cấp thông tin gì → cảnh báo và ca ưu tiên vẫn còn, không thành “chưa có ca”.

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
