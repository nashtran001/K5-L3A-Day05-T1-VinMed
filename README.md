# VinMed · Hỏi dược sĩ

Prototype LAB5, lớp L3A, Track 1 Y tế. Thiết kế cho lúc AI chưa chắc hoặc sai: hỏi đúng người dùng thuốc, cảnh báo nguy hiểm trước hàng chờ và dược sĩ duyệt trước khi gửi gợi ý.

## Mở prototype

Mở trực tiếp [prototype/index.html](prototype/index.html) bằng Chrome/Edge. Không cần cài đặt hoặc API key.

Hoặc với Node.js 22 trở lên:

```powershell
npm start
```

Vào **http://127.0.0.1:4173**. Dừng server bằng Ctrl+C.

## Tài liệu nộp và trình bày

- [spec.md](spec.md): 7 mục theo đề, 12 kịch bản, lập luận hai ca đắt nhất, đủ 5 tool và 3 tiêu chí Pass/Fail.
- [DEMO.md](DEMO.md): luồng 4 phút, chia phần đề xuất cho 3 người và ca dự phòng.
- [prototype/README.md](prototype/README.md): vị trí tương tác, chú thích và giới hạn.
- [TEST-REPORT.md](TEST-REPORT.md): kết quả kiểm tra và phần chưa kiểm tra.

Hai màn hình: **Hỏi dược sĩ** và **Bàn dược sĩ**, cùng trạng thái trong một trang. Có 7 ca chọn nhanh và ô nhập ca lạ, sàng lọc, sửa thông tin, thu hồi, duyệt/từ chối, hoàn tác chuyển, thử quá hạn, đồng ý lưu và xóa ghi chú.

## Kiểm tra

```powershell
npm test
```

Không có dependency ngoài, không cần `npm install`. Node 22+ hỗ trợ chế độ test không tạo process con dùng trong môi trường hiện tại.

## Cần nhóm hoàn tất trước khi nộp

- Điền tên, mã học viên, bàn/zone và công việc thực tế ở đầu `spec.md`.
- Xếp mức tự chủ độc lập rồi ghi ý kiến thực tế ba người ở §4.
- Bấm thử trong trình duyệt; chụp 1–2 ảnh thật có nhãn ①–⑥ thay hình minh họa hiện có.
- Demo và ghi ca lạ thực tế vào §7. Mỗi người giải thích được phần mình.
- Kiểm tra repo công khai bằng cửa sổ ẩn danh; nộp link trước **23:59 ngày 12/11/2026, giờ Việt Nam**, theo kênh giảng viên công bố.

Mã nguồn được xây tại repo nộp mới, không clone/fork đề. Agent chưa push, chưa xác minh repo public hoặc bật GitHub Pages. Có thể phục vụ thư mục `prototype/` bằng bất kỳ static host nào nếu nhóm muốn link web.

Toàn bộ dữ liệu, sản phẩm, dược sĩ và tác vụ đều mô phỏng. Không có lời gọi AI thật; không chẩn đoán, giao dịch hay lưu hồ sơ bên ngoài. Không nhập sức khỏe thật. VinMed không liên kết với Pharmacity; đề lấy kênh chat của chuỗi làm bối cảnh.

[Đề lab](https://github.com/VinUni-AI20k/K5-L3-Day05-AI-Product-UX-Autonomy) · [Track 1](https://github.com/VinUni-AI20k/K5-L3-Day05-AI-Product-UX-Autonomy/blob/main/tracks/t1-healthcare.md)
