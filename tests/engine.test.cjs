const {test}=require('node:test'),assert=require('node:assert/strict');
const {classify,emptyFacts}=require('../prototype/engine.js');
const full={age:'28',pregnancy:'no',meds:'Không',conditions:'Không',duration:'2 ngày'};
for(const [input,route] of [
 ['Ba mình 70 tuổi đau ngực khó thở, mua nước muối với','emergency'],
 ['Bán kháng sinh, khó thở quá','emergency'],
 ['Con mình 2 tuổi bị ho','handoff'],
 ['Mình đang bầu 3 tháng bị cảm','handoff'],
 ['Ông mình 80 tuổi cần thuốc','handoff'],
 ['Mình uống thuốc nhiều ngày không đỡ, cho loại mạnh hơn','handoff'],
 ['Bán amoxicillin không có đơn','prescription'],
 ['Nhà thuốc gần mình còn nước muối không, tối qua lấy','source'],
 ['Họng đau rát 2 ngày','screen'],
 ['Bực rồi, đưa thuốc đây đừng hỏi nữa','unknown'],
 ['<img src=x onerror=alert(1)>','unknown'],
 ['Bé khó thở và cho mua kháng sinh','emergency'],
 ['Không có khó thở, chỉ đau họng','screen'],
 ['Ba không thở được','emergency'],
 ['Chưa biết nữa','unknown']])test(`${route}: ${input}`,()=>assert.equal(classify(input,emptyFacts()).route,route));
test('Đủ trường vẫn phải qua dược sĩ',()=>assert.equal(classify('Đau họng',full).route,'review'));
test('Sửa người dùng từ 28 sang 2 tuổi chặn gợi ý',()=>assert.equal(classify('Đau họng',{...full,age:'2'}).route,'handoff'));
test('Bệnh nền ngăn bản nháp thông thường',()=>assert.equal(classify('Đau họng',{...full,conditions:'Tiểu đường'}).route,'handoff'));
test('Thuốc đang dùng ngăn bản nháp thông thường',()=>assert.equal(classify('Đau họng',{...full,meds:'Thuốc kê đơn'}).route,'handoff'));
test('Không sửa đối tượng facts đầu vào',()=>{const f=emptyFacts();classify('Con 2 tuổi bị ho',f);assert.equal(f.age,'')});
test('Thông tin sửa ưu tiên hơn tuổi trong tin cũ',()=>assert.equal(classify('Mình 28 tuổi đau họng',{...full,age:'2'},{corrected:true}).route,'handoff'));
test('Thời gian kéo dài trong tin nhắn chuyển người',()=>assert.equal(classify('Mình đau họng 10 ngày',full).route,'handoff'));
test('Thời gian kéo dài trong form chuyển người',()=>assert.equal(classify('Đau họng',{...full,duration:'2 tuần'}).route,'handoff'));

test('AI trả lời câu hỏi chuẩn bị thông tin bằng quy trình, không gợi ý thuốc',()=>{
 const r=classify('Tôi cần cung cấp thông tin gì trước khi hỏi thuốc?');
 assert.equal(r.route,'info');assert.ok(r.text.includes('không cần chờ'));
});
test('Hướng dẫn quyền riêng tư chưa thực thi lưu hồ sơ',()=>assert.equal(classify('Cho mình xem ghi chú trước khi đồng ý lưu.').route,'privacy'));
test('Không hiểu tuổi thai thành thời gian triệu chứng',()=>{
 const r=classify('Mình đang bầu 3 tháng, bị cảm sổ mũi 2 hôm');
 assert.equal(r.route,'handoff');assert.equal(r.facts.duration,'2 hom');assert.ok(!r.text.includes('Triệu chứng đã kéo dài'));
});
test('Không hiểu tháng tuổi của bé thành thời gian triệu chứng',()=>{
 const r=classify('Con mình 2 tháng tuổi bị ho 2 ngày');
 assert.equal(r.route,'handoff');assert.equal(r.facts.duration,'2 ngay');assert.ok(!r.text.includes('Triệu chứng đã kéo dài'));
});
test('Thông tin phủ định rõ không bị coi là bệnh nền hoặc dị ứng',()=>{
 const r=classify('Mình 28 tuổi đau họng 2 ngày, không mang thai, không dùng thuốc, không bệnh nền, không dị ứng');
 assert.equal(r.route,'review');assert.equal(r.facts.conditions,'Không');assert.equal(r.facts.meds,'Không');
});
test('Không hỏi lại tuổi đã có, chỉ hỏi mục thiếu kế tiếp',()=>{
 const r=classify('Mình 28 tuổi đau họng 2 ngày');
 assert.equal(r.route,'screen');assert.equal(r.missing[0],'mang thai / cho con bú');assert.ok(!r.text.includes('bao nhiêu tuổi'));
});
test('Ghi Chưa rõ trong form không đủ để chuyển nháp',()=>{
 const r=classify('Đau họng',{...full,meds:'Chưa rõ',conditions:'Chưa rõ'});
 assert.equal(r.route,'screen');
});
