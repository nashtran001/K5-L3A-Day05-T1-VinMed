# Bài nộp LAB5 — T1 Y tế · Nhóm VinMed

Lớp: **L3A** · Bàn / zone: **[nhóm bổ sung]** · Track: **T1** · Ngày: **12/11/2026**

| Họ và tên | Mã học viên | Việc đã làm — nhóm xác nhận sau khi đọc và thực hành |
|---|---|---|
| [Thành viên 1] | [Mã học viên] | Đề xuất: §1–2, giải thích hai rủi ro và demo cảnh báo nguy hiểm |
| [Thành viên 2] | [Mã học viên] | Đề xuất: §3–4, giải thích mức tự chủ và demo bàn dược sĩ |
| [Thành viên 3] | [Mã học viên] | Đề xuất: §5–7, kiểm tra prototype, demo sửa thông tin và ca lạ |

**Trạng thái trung thực:** tên, mã học viên, ý kiến độc lập của ba thành viên và ca lạ từ TA chưa được cung cấp. Các vai trò trên là đề xuất, không phải xác nhận ai đã làm. Prototype và bản thảo này được xây dựng với hỗ trợ của coding agent; từng thành viên cần thực hành và giải thích phần nhận trách nhiệm trước khi nộp.

## §1. Lát cắt & phạm vi

Trong kênh Hỏi dược sĩ tham chiếu Pharmacity, khách hỏi cách xử lý triệu chứng cho bản thân hoặc người nhà; AI chọn giữa hỏi sàng lọc, chuẩn bị gợi ý để dược sĩ duyệt, chuyển người có chuyên môn hoặc hiện cảnh báo đi khám/cấp cứu, nhằm tránh gợi ý sai cho người dùng thuốc và tránh giữ ca nguy hiểm trong hàng chờ. Đây là cách diễn đạt đầy đủ lát cắt T1, không mở rộng sang chẩn đoán hay bán hàng thật.

Theo bối cảnh của đề, kênh thực tế đã có lớp hỗ trợ thông tin và lớp dược sĩ xử lý chuyên môn. Thiết kế này làm rõ thời điểm chuyển, điều khách nhìn thấy và giới hạn hành động của AI. Người chat có thể là cha mẹ hoặc người chăm sóc, không phải người sẽ uống thuốc. Chi phí bỏ sót nguy hiểm hoặc chọn nhầm sản phẩm có thể là tổn hại không đảo lại được; chuyển thừa thường chỉ mất thời gian.

Ba giới hạn:

1. Không chẩn đoán, tự chỉ liều hoặc thay thuốc kê đơn: xác nhận của khách không thay được chuyên môn, tổn hại sau khi uống khó đảo lại.
2. Không bán thuốc kê đơn hoặc thực hiện đơn hàng/thanh toán: ngoài thẩm quyền AI và ngoài bộ dữ liệu mô phỏng. Nút bước đặt chỉ xuất hiện sau duyệt sản phẩm giả, kết thúc bằng thông báo không tạo đơn.
3. Không xác nhận giá, tồn kho, nhà thuốc gần khách hoặc tự lưu hồ sơ: track không có tool đọc kho/vị trí; lưu sức khỏe phải có đồng ý riêng. Chat tạm trong phiên hỗ trợ khác với hồ sơ sức khỏe.

Chỉ dùng fixture do nhóm tự dựng: mã ca VM-DEMO-01, sản phẩm giả SP-DEMO-01, không có giá, liều hoặc hiệu quả điều trị thật. Không gọi chatbot, không liên hệ nhà thuốc.

## §2. Kịch bản rủi ro — M1

Các lớp: ① căn cứ/nguồn; ② mơ hồ/thiếu; ③ ngoài quyền; ④ đặc thù sức khỏe. Một ca có thể thuộc nhiều lớp.

| ID | Tin khách dựng | Lớp | Sai cụ thể và bằng chứng từ tool/dữ liệu | Phản ứng thiết kế | Mức hại |
|---|---|---|---|---|---|
| **K1 ★** | “Ba mình 70 tuổi đau ngực, khó thở, mua giúp thuốc với.” | ②④ | `goi_y_san_pham` đáp ứng ý mua hàng hoặc `chuyen_duoc_si` giữ ca trong hàng chờ, bỏ qua dấu hiệu cần hành động ngay | Ưu tiên `khuyen_di_kham`; hiện cảnh báo trước mọi hàng chờ; tạo thông báo ở bàn dược sĩ, không có sản phẩm | Không chấp nhận được |
| **K2 ★** | Ban đầu “Họng mình đau rát 2 ngày”, sau đó “À thuốc cho con 2 tuổi.” | ②④ | Dùng ngữ cảnh người lớn để gọi `goi_y_san_pham`; sửa câu chat nhưng bản nháp/nút đặt cũ còn hiệu lực | Thu hồi nháp và quyền đặt; cập nhật người dùng thuốc; chuyển dược sĩ | Không chấp nhận được |
| K3 | “Nhà thuốc gần mình còn nước muối không, tối mình qua lấy.” | ① | Bịa còn hàng dù không có tool tồn kho/chi nhánh | Nêu thiếu nguồn, cho gặp dược sĩ; không nút giữ hàng | Sửa được |
| K4 | “Bán amoxicillin đi, không có đơn đâu.” | ③④ | Gọi `ban_thuoc_ke_don`, hoặc lách bằng thuốc thay thế | Từ chối phần bán, chuyển dược sĩ về bước kiểm tra đơn/khám; không nút bán | Không chấp nhận được |
| K5 | “Mình bầu 3 tháng, cảm sổ mũi, uống gì an toàn?” | ②④ | Gợi ý dựa triệu chứng mà bỏ qua người mang thai; đề không có nguồn thuốc phù hợp thai kỳ | Dừng gợi ý; chuyển dược sĩ; hiển thị trường mang thai | Không chấp nhận được |
| K6 | “Ho uống thuốc nhiều ngày không đỡ, cho loại mạnh hơn.” | ④ | `goi_y_san_pham` đẩy sang mua tiếp thay vì đánh giá diễn tiến | Chuyển dược sĩ; không gửi thuốc mạnh hơn; không tự nói liều | Không chấp nhận được |
| K7 | “Hỏi lắm thế, đưa thuốc luôn đi.” | ②③ | Bỏ qua trường thiếu để làm khách hài lòng | Giữ thiếu thông tin; hỏi ai dùng/tuổi hoặc đi thẳng dược sĩ | Không chấp nhận được |
| K8 | “Mình hỏi cho mẹ 75 tuổi đang uống thuốc huyết áp.” | ②④ | Lấy thông tin người chat, không người uống; không xét thuốc đang dùng | Chuyển dược sĩ, đánh dấu tuổi và thuốc cần xác minh | Không chấp nhận được |
| K9 | “Con bị khó thở, mua nước muối và kháng sinh giúp.” | ③④ | Tách ý mua hàng rồi cho gợi ý, hoặc từ chối kê đơn mà quên nguy hiểm | Nhánh nguy hiểm ưu tiên cao hơn nhánh kê đơn và tồn kho | Không chấp nhận được |
| K10 | “Ghi giúp bệnh của con vào hồ sơ cho tiện.” | ③④ | Gọi `luu_ghi_chu_suc_khoe` khi chưa có đồng ý cụ thể, hoặc lưu nhầm người | Hiện các trường chuẩn bị lưu, checkbox bỏ trống; xác nhận riêng; xóa được | Không chấp nhận được |
| K11 | “28 tuổi đau họng, không thai/cho bú, không bệnh nền/dị ứng, không dùng thuốc, 2 ngày.” | ①② | Dùng đủ trường để đồng nhất với an toàn, gọi `goi_y_san_pham` ngay | Bản nháp chỉ cho dược sĩ; nhận ca + kiểm tra + duyệt mới gửi | Không chấp nhận được nếu gửi sai |
| K12 | “Mình muốn loại XYZ giống ảnh hôm trước.” | ①② | Nhận diện sản phẩm/ảnh không có trong fixture, bịa thành phần | Không hiểu thì nói rõ, hỏi thêm hoặc chuyển dược sĩ | Sửa được |

**Vì sao chọn K1/K2:** K1 nguy hiểm do thời gian: chờ đúng quy trình vẫn có thể sai với hoàn cảnh. K2 nguy hiểm do thông tin gán sai đối tượng: câu trả lời nhìn hợp lý nhưng hành động thuốc dựa trên người khác. Hai ca kiểm tra hai cơ chế khác nhau: ưu tiên trước hàng chờ và thu hồi theo phiên bản.

**Suýt chọn K4:** hậu quả cũng rất cao, nhưng ranh giới cấm rõ và kiểm tra được bằng không có hành động bán. K1/K2 khó hơn vì yêu cầu ban đầu vẫn giống ca mua thuốc bình thường; chỉ chặn từ khóa “kháng sinh” không cứu được. Không coi số lượng ca là bằng chứng đủ; bằng chứng là tool cụ thể có thể bị dùng sai.

## §3. Khi AI sai — quyết định và đường lui

### K1 — nguy hiểm lẫn trong câu mua hàng

Câu AI trong prototype:

> Bạn mô tả dấu hiệu có thể nguy hiểm. Hãy gọi cấp cứu hoặc đến cơ sở cấp cứu ngay; đừng chờ dược sĩ trong chat. Mình không thể đánh giá mức độ qua tin nhắn và sẽ không gợi ý thuốc. Thông báo ưu tiên đã được tạo ở bàn dược sĩ mô phỏng, nhưng không thay thế hỗ trợ cấp cứu.

- **Khách thấy:** khối cảnh báo đỏ trong chat, nhãn “Cần hỗ trợ ngay”, cụm từ làm căn cứ ở panel bên phải, nút xác nhận đã hiểu. Không có nút gợi ý/đặt thuốc. Màu đi kèm chữ, không dùng màu đơn độc.
- **Khách làm tiếp:** tìm hỗ trợ cấp cứu ngoài chat; nút xác nhận chỉ ghi nhận đọc, không gọi dịch vụ. Sửa thông tin luôn có sẵn. Khách không bấm vẫn thấy cảnh báo; không bị bắt cung cấp đủ tuổi/dị ứng trước khi được cảnh báo.
- **Ai được báo:** bàn dược sĩ mô phỏng nhận cảnh báo trong cùng lần chuyển trạng thái; thấy tin gốc, trường đã biết/chưa rõ và lý do. Không chờ nhận ca để hiện cảnh báo. Không tuyên bố dược sĩ thật đã được thông báo.
- **Lựa chọn:** chọn cảnh báo tức thời và báo người có chuyên môn. Loại hỏi đủ 5 trường trước vì làm chậm; loại chỉ trả lời kèm “có thể” rồi gợi ý vì không giảm được hại; loại chuyển hàng chờ thường vì chờ cũng là lỗi trong ca này.
- **Loại lỗi:** lỗi ngữ cảnh nếu bộ chuyển ca vận hành đúng nhưng vẫn giữ người cần hỗ trợ ngay; lỗi hệ thống nếu phát hiện nguy hiểm mà UI vẫn mở gợi ý. Không đổ lỗi khách nhắn gộp nhiều ý. Cần sửa thứ tự ưu tiên và chặn hành động, thêm câu xin lỗi không đủ.

### K2 — sửa người uống từ người lớn thành trẻ nhỏ

Câu AI sau sửa:

> Mình đã cập nhật và thu hồi bản nháp/gợi ý cũ. Những gợi ý trước đó không còn áp dụng cho thông tin vừa sửa.

Sau đó, khi ca được xác định là trẻ nhỏ:

> Mình chưa có đủ căn cứ để chọn sản phẩm an toàn cho người sẽ dùng thuốc. Mình đã chuyển ca cho dược sĩ mô phỏng, kèm thông tin hiện có và những mục chưa rõ. Chưa có gợi ý thuốc nào được gửi. Nếu xuất hiện dấu hiệu nguy hiểm, hãy đi cấp cứu ngay, đừng chờ chat.

- **Khách thấy:** tuổi cập nhật, nhãn cần dược sĩ, thông báo thu hồi; nút bước đặt biến mất. Lịch sử trước vẫn đọc được, nhưng thông báo mới nêu rõ không còn áp dụng.
- **Khách làm tiếp:** bấm sửa để bổ sung hoặc xem ca đã chuyển. Có thể hoàn tác chuyển ca, nhưng việc hoàn tác không khôi phục gợi ý cũ. Không làm gì: không tự gửi sản phẩm; sau 120 giây chưa có người nhận thì hiện đường tìm hỗ trợ trực tiếp, không tự nâng quyền.
- **Ai được báo:** bàn dược sĩ mô phỏng nhận phiên bản mới ngay sau lưu sửa, có tin gốc và các trường sửa. Dược sĩ phải nhận lại ca; bản duyệt cũ hết hiệu lực. Không lưu những trường này vào hồ sơ nếu khách chưa đồng ý.
- **Lựa chọn:** chọn thu hồi + chuyển dược sĩ. Loại chỉ đổi câu chữ “thuốc cho trẻ” vì không có cơ sở chọn thuốc cho trẻ; loại xác nhận của phụ huynh thay dược sĩ vì phụ huynh không có nghĩa vụ thẩm định tính an toàn của bản nháp.
- **Loại lỗi:** thiếu ngữ cảnh người uống, không quy lỗi cho người chat. Khi hệ thống đã gán người uống mà không hỏi thì có lỗi thiết kế; sửa bằng trường người uống rõ ràng và vô hiệu hóa hành động phụ thuộc dữ liệu cũ.

### Ba nguyên tắc lựa chọn, gắn đúng vị trí

| Nguyên tắc | Vị trí trên prototype | Hành vi cụ thể |
|---|---|---|
| HAX G1 — nêu năng lực | **①** đầu chat, banner mô phỏng, panel quyền **④** | Biết đang tương tác lớp AI mô phỏng, quyền gửi gợi ý thuộc dược sĩ |
| HAX G10 — thu hẹp khi nghi ngờ | **②** panel căn cứ và khối cảnh báo trong chat | Thiếu trường → hỏi; không có nguồn → không khẳng định; nguy hiểm → bỏ hàng chờ |
| HAX G9 — sửa thuận tiện | **③** nút sửa người uống, thông báo thu hồi | Sửa được bằng dialog, tự tính lại và gỡ quyền hành động cũ |

Hai vị trí **⑤** bàn duyệt và **⑥** đồng ý lưu là bằng chứng mức tự chủ, không thêm một danh sách nguyên tắc chỉ có tên.

**Lỗi không thể cứu bằng câu chữ:** nói “hãy hỏi dược sĩ” nhưng nút đặt vẫn hoạt động; dẫn nguồn tồn kho không tồn tại; sửa tuổi nhưng giữ bản duyệt trước. Thiết kế giải quyết bằng cổng duyệt, không tạo dữ liệu kho và thu hồi bản nháp theo phiên bản thông tin.

## §4. Mức tự chủ — M2

| Tool của track | Mức chốt | Ai duyệt / thấy gì / quá hạn | Cái giá khi sai, khả năng đảo và phương án loại |
|---|---|---|---|
| `goi_y_san_pham` | **Cần dược sĩ duyệt** | Dược sĩ mô phỏng nhận ca, xem tin gốc + người uống + trường thiếu + nguồn fixture, tích kiểm tra rồi duyệt. Chỉ nhánh đủ trường thường mới có nháp. Chưa nhận sau 120 giây → không gửi, hiện đường hỗ trợ trực tiếp; nhận rồi không hứa thời gian trả lời | Khách/người uống chịu hại; uống rồi không hoàn tác. Tự làm tiết kiệm thời gian nhưng sai có giá cao; cấm toàn bộ làm mất ích lợi hỗ trợ. Xác nhận của khách không đủ chuyên môn nên bị loại |
| `chuyen_duoc_si` | **Tự làm + hoàn tác** | Có lý do và ca hiện ở bàn mô phỏng. Khách được gỡ yêu cầu; ca khẩn chỉ tạo thông báo, không bắt đợi | Chuyển thừa mất ít phút; gỡ được. Nếu hỏi phép mọi lần sẽ tăng thao tác khi người dùng đang lo. Không gửi hồ sơ ra dịch vụ ngoài |
| `khuyen_di_kham` | **Tự làm, khách có thể bỏ qua** | Không đợi duyệt; có căn cứ cụm từ và giới hạn. Xác nhận đọc không đồng nghĩa đã được cứu | Cảnh báo thừa gây lo/tốn thời gian, nhưng bỏ sót có thể hại không đảo được. Loại chờ người duyệt vì trì hoãn nguy hiểm hơn. Không có “hoàn tác” làm mất cảnh báo y tế; khách có thể sửa dữ kiện |
| `luu_ghi_chu_suc_khoe` | **Cần khách đồng ý riêng** | Dialog hiện chính xác trường sắp lưu, phạm vi và thời hạn; checkbox trống. Không xác nhận/đóng → không lưu. Xóa ghi chú hoặc Phiên mới/tải lại → xóa | Lộ thông tin vẫn có hại dù sau đó xóa; tự lưu vì tiện bị loại. Cấm mọi lưu giảm khả năng dùng lại với đồng ý nên không chọn. Demo chỉ mô phỏng trong RAM |
| `ban_thuoc_ke_don` | **Cấm** | Không có nút bán hoặc thay thế. Có đường trao đổi với dược sĩ về bước tiếp theo | Thuốc dùng rồi không đảo; khách đồng ý không làm AI có thẩm quyền. Không nâng thành cần khách xác nhận |

**Tách bước, không thêm quyền âm thầm:** `soan_nhap_goi_y` chuẩn bị fixture SP-DEMO-01 chỉ ở bàn dược sĩ; `goi_y_san_pham` là bước gửi khách sau duyệt. `hoi_sang_loc` là bước hội thoại tự làm, không thay đổi hồ sơ; sửa/thu hồi rẻ hơn gửi thuốc sai. Bước xem đặt là mô phỏng đầu ra của gợi ý, không có tool mua hàng mới.

**Tool khó xếp nhất:** `goi_y_san_pham`. Ba phương án cần nhóm tự đối chiếu: A tự gửi cho ca đủ trường (K11 cho thấy đủ trường không đồng nghĩa phù hợp); B mọi ca cần dược sĩ (tăng hàng chờ cho ca thường); C cấm toàn bộ (giảm ích lợi hỗ trợ). B được chọn, nhưng tách nháp và gửi, để dược sĩ bớt chép lại; dữ liệu nháp không cho khách xem như lời khuyên trước duyệt. K2 cho thấy duyệt phải gắn phiên bản, không chỉ có checkbox. **Chưa có kết quả ba người xếp độc lập; nhóm điền ý kiến thực tế dưới đây, không nhận ba phương án giả là tranh luận đã xảy ra.**

| Thành viên | Mức từng chọn độc lập | Lý do, ca tham chiếu | Nhóm đối chiếu và xác nhận |
|---|---|---|---|
| [1] | [bổ sung] | [bổ sung] | [bổ sung] |
| [2] | [bổ sung] | [bổ sung] | [bổ sung] |
| [3] | [bổ sung] | [bổ sung] | [bổ sung] |

### Thử mức trên ba ca

| Ca | Sai có bị chặn? | Có làm khi cần hỏi không? | Có bắt chờ vô ích không? |
|---|---|---|---|
| K1 | Luật nguy hiểm chạy trước kê đơn/kho/nháp; không nút đặt | Cảnh báo không cần đồng ý; không lưu hồ sơ | Không chờ để được cảnh báo; bàn dược sĩ nhận bản tin ưu tiên |
| K2 | Sửa tuổi tăng phiên bản, thu hồi duyệt và nút đặt; trẻ → chuyển | Không gửi nháp trẻ; không tự lưu | Chờ chuyên môn là chủ ý; quá hạn có thông báo, không hứa cứu hộ |
| K11 thường | Đủ trường chỉ tạo nháp, chỉ gửi sau nhận + tích kiểm tra + duyệt | Không gửi trước duyệt; không lưu trước consent | Khách vẫn phải chờ dược sĩ vì quyết định dùng sản phẩm; không phải chờ người để được hỏi sàng lọc hoặc biết trạng thái |

**Lời hứa thay đổi bởi mức:** từ “AI chọn thuốc giúp bạn ngay” thành “AI thu thập thông tin và chuẩn bị để dược sĩ kiểm tra trước khi gửi”. Đây là giới hạn sản phẩm, không chỉ một dòng disclaimer.

## §5. Prototype — M3

- Mở [prototype/index.html](prototype/index.html) trực tiếp, hoặc `npm start` rồi vào `http://127.0.0.1:4173`.
- HTML/CSS/JavaScript thuần, không dependency, không backend, hai màn hình dùng chung trạng thái. Chuyển tab không xóa ca; chọn ca mới/Phiên mới xóa toàn bộ phiên trước.
- Mọi “AI”, dược sĩ, chuyển ca, đếm giờ, duyệt, lưu và bước đặt đều mô phỏng. **Không có lời gọi AI thật, không nhận bonus +3.** Có màn hình dược sĩ theo gợi ý riêng T1; không tự cộng nó thành điểm bonus chung.
- `engine.js` là luật từ khóa giới hạn cho demo, không phải bộ sàng lọc y tế đã được xác thực. Ca lạ đi vào hỏi thêm hoặc chuyển người, không tạo câu trả lời chuyên môn tự do.
- `app.js` chứa cổng duyệt, thu hồi, quá hạn, consent; giao diện luôn escape input trước khi đưa vào HTML. Không dùng localStorage, cookie, analytics, ảnh/font CDN hay request ra ngoài.

### Bốn đường đi bấm được

1. **Happy path:** chọn Đau họng thông thường (fixture đã điền đầy đủ) → bàn dược sĩ → nhận ca → kiểm tra → duyệt → về khách thấy gợi ý mẫu → bước đặt mô phỏng dừng trước tạo đơn.
2. **Low confidence:** chọn ca Sửa: người dùng là bé → Bổ sung thông tin → điền người dùng → đánh giá lại. Thiếu mục vẫn chưa gợi ý; nhóm dễ tổn thương chuyển chuyên môn.
3. **Failure / không nguồn:** chọn Hỏi tồn kho → thông báo không có dữ liệu → Gặp dược sĩ; không tạo kho giả. Nút thử quá hạn ở bàn dược sĩ cho thấy thất bại chuyển người không biến thành tự duyệt.
4. **Correction:** chọn ca thường → duyệt thử → quay lại khách → sửa tuổi thành 2 → nháp/gợi ý cũ bị thu hồi, bước đặt biến mất, bàn dược sĩ nhận ca mới với trường chưa xác minh.

**Cách biểu diễn đã chọn:** trạng thái bằng chữ + trường thiếu + tin gốc + quy tắc fixture. Loại số 95% vì không có phép hiệu chuẩn hoặc dữ liệu tính; loại chỉ màu vì khó kiểm tra/khó tiếp cận; loại chỉ văn bản disclaimer vì không ngăn được thao tác sai. Cổng duyệt nằm ở vai trò dược sĩ thay vì nút “Tôi đồng ý” phía khách. Demo chuyển vai không phải cơ chế xác thực thật.

**Ảnh đánh số:** [01-customer.svg](prototype/images/01-customer.svg), [02-pharmacist.svg](prototype/images/02-pharmacist.svg) là **hình minh họa chú thích**, không phải ảnh chụp trình duyệt. Chỉ mục ① G1, ② G10, ③ G9, ④ quyền tool, ⑤ dược sĩ duyệt, ⑥ consent khớp nhãn trong UI. Công cụ điều khiển Chrome bị chặn do không xác định URL đủ chắc; **chưa xác minh hình thức bằng trình duyệt, chưa có screenshot thật**. Nhóm cần chụp 1–2 ảnh thực tế và thay ảnh minh họa trước khi nộp nếu yêu cầu TA là screenshot.

**Kiểm chứng:** `npm test` kiểm tra phân luồng và cổng trạng thái trong môi trường DOM giả tối thiểu; xem [TEST-REPORT.md](TEST-REPORT.md). Các test không chứng minh khả năng chẩn đoán hay độ bao phủ ngôn ngữ tự nhiên, cũng không thay thế bấm thử trên trình duyệt/mobile.

## §6. Tốt là gì — ba tiêu chí Pass/Fail

| Tiêu chí quan sát được | K1 | K2 | Cách chấm |
|---|---|---|---|
| P1 — Không gửi/cho đặt sản phẩm sai ngữ cảnh | Pass ở kiểm tra luật & trạng thái | Pass ở kiểm tra thu hồi | K1 không có nháp/đặt; K2 sau sửa không còn quyền duyệt cũ/đặt |
| P2 — Có đường hành động đúng và lý do hiện ra | Pass ở đầu ra trạng thái | Pass ở đầu ra trạng thái | K1 câu cảnh báo có “đừng chờ”; K2 có tuổi sửa và chuyển người; kiểm tra UI thực tế còn chờ |
| P3 — Không tự lưu và không tự nâng quyền | Pass ở kiểm tra trạng thái | Pass ở kiểm tra trạng thái | Chưa đồng ý → saved=null; quá hạn → không duyệt; cập nhật → phải nhận/duyệt lại |

Phạm vi Pass là fixture và trạng thái được test; **không tuyên bố đã kiểm tra browser hoặc đủ an toàn để phát hành thật**. Lỗi/giới hạn còn lại: luật từ khóa có thể bỏ sót cách nói mới, mô tả phủ định/phức tạp; không có dữ liệu thuốc; role switch không xác thực; RAM mất khi tải lại; không có dược sĩ nhận thật. Tin tự do mới xóa các trường sàng lọc cũ để tránh mang thông tin người trước sang người sau; đây là đánh đổi giảm tiện lợi cho demo an toàn. Muốn triển khai cần quy trình lâm sàng và hạ tầng riêng, ngoài lab.

## §7. Demo

Kịch bản 4 phút và ca dự phòng trong [DEMO.md](DEMO.md). Mỗi thành viên cần tự nói được cost-of-error và chỉ đúng vị trí HAX trong phần mình.

**Ca lạ thực tế do TA/người xem đưa:** chưa diễn ra. Không ghi ca tự dựng thành bằng chứng demo thật.

| Tin nhắn TA đưa | Nhánh prototype thực tế | Mức tự chủ có đúng không? | Nhóm đổi quyết định gì, vì sao? |
|---|---|---|---|
| [Điền ngay sau demo] | [Điền] | [Điền] | [Điền hoặc ghi không đổi kèm lý do] |

### Nguồn đối chiếu

- [README và hướng dẫn nộp](https://github.com/VinUni-AI20k/K5-L3-Day05-AI-Product-UX-Autonomy)
- [Challenge brief](https://github.com/VinUni-AI20k/K5-L3-Day05-AI-Product-UX-Autonomy/blob/main/01-challenge-brief.md)
- [Guide](https://github.com/VinUni-AI20k/K5-L3-Day05-AI-Product-UX-Autonomy/blob/main/02-guide.md)
- [Spec template](https://github.com/VinUni-AI20k/K5-L3-Day05-AI-Product-UX-Autonomy/blob/main/03-spec-template.md)
- [Rubric chung](https://github.com/VinUni-AI20k/K5-L3-Day05-AI-Product-UX-Autonomy/blob/main/04-rubric.md)
- [Track 1](https://github.com/VinUni-AI20k/K5-L3-Day05-AI-Product-UX-Autonomy/blob/main/tracks/t1-healthcare.md)

Không sao chép repo đề vào repo nộp; chỉ tài liệu và mã của nhóm ở đây.
