const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
// Test application guards without a browser. This minimal DOM does not validate layout or native dialogs.
function app(){
 const nodes=new Map();const node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',value:'',checked:false,disabled:false,style:{},elements:{},classList:{toggle(){}},addEventListener(){},showModal(){this.open=true},close(){this.open=false},scrollTop:0,scrollHeight:0});return nodes.get(id)};
 const context=vm.createContext({console,Date,setTimeout(){return 1},clearTimeout(){},setInterval(){},document:{querySelector:node,querySelectorAll(){return []},addEventListener(){},body:{classList:{toggle(){}}}}});
 for(const f of ['engine.js','app.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../prototype',f),'utf8'),context);
 return {run:code=>vm.runInContext(code,context),node};
}
test('Ca nguy hiểm không có nháp hoặc bước đặt và không đợi nhận ca',()=>{const a=app();a.run("init('danger')");assert.equal(a.run('s.result.route'),'emergency');assert.equal(a.run('s.queue'),true);assert.ok(a.node('#chat').innerHTML.includes('đừng chờ'));assert.ok(!a.node('#actions').innerHTML.includes('data-action="order"'));assert.ok(!a.node('#staff-content').innerHTML.includes('id="draft"'))});
test('Không duyệt được trước nhận, trước kiểm tra; duyệt được sau cả hai',()=>{const a=app();a.run("init('normal');act('approve')");assert.equal(a.run('s.approved'),false);a.run("act('accept');act('approve')");assert.equal(a.run('s.approved'),false);a.node('#review-check').checked=true;a.node('#draft').value='Sản phẩm giả đã được kiểm tra trong demo.';a.run("act('approve')");assert.equal(a.run('s.approved'),true);assert.ok(a.node('#actions').innerHTML.includes('data-action="order"'))});
test('Sửa tuổi thu hồi duyệt cũ, bỏ nút đặt, chuyển nhánh trẻ nhỏ',()=>{const a=app();a.run("init('normal');act('accept')");a.node('#review-check').checked=true;a.node('#draft').value='Sản phẩm giả.';a.run("act('approve')");const target={elements:{age:{value:'2'},pregnancy:{value:'no'},meds:{value:'Không'},conditions:{value:'Không'},duration:{value:'2 ngày'}}};a.node('#edit-form').onsubmit({preventDefault(){},target});assert.equal(a.run('s.facts.age'),'2');assert.equal(a.run('s.approved'),false);assert.equal(a.run('s.accepted'),false);assert.equal(a.run('s.result.route'),'handoff');assert.ok(!a.node('#actions').innerHTML.includes('data-action="order"'));assert.ok(!a.node('#staff-content').innerHTML.includes('id="draft"'))});
test('Quá hạn không tự duyệt dù có kiểm tra',()=>{const a=app();a.run("init('normal');act('timeout')");a.node('#review-check').checked=true;a.node('#draft').value='Sản phẩm giả';a.run("act('accept');act('approve')");assert.equal(a.run('s.expired'),true);assert.equal(a.run('s.approved'),false);assert.equal(a.run('s.accepted'),false)});
test('Hoàn tác chuyển gỡ ca và không khôi phục nháp',()=>{const a=app();a.run("init('normal');act('accept');act('undo')");assert.equal(a.run('s.queue'),false);assert.equal(a.run('s.approved'),false);assert.ok(a.node('#staff-content').innerHTML.includes('Chưa có ca'))});
test('Consent mặc định trống, submit không đồng ý không lưu; đồng ý mới lưu; xóa được',()=>{const a=app();a.run("init('child');act('save')");assert.equal(a.node('#consent-check').checked,false);const submit=()=>a.node('#consent-form').onsubmit({preventDefault(){}});submit();assert.equal(a.run('s.saved'),null);a.node('#consent-check').checked=true;submit();assert.equal(a.run('s.saved.age'),'2');a.run("act('save')");assert.equal(a.run('s.saved'),null)});
test('Phiên mới xóa ghi chú, hội thoại và ca chuyển',()=>{const a=app();a.run("s.saved={age:'2'};init()");assert.equal(a.run('s.saved'),null);assert.equal(a.run('s.queue'),false);assert.equal(a.run('s.messages.length'),1)});
test('Tin mới không kế thừa sàng lọc từ người trước',()=>{const a=app();a.run("init('normal');receive('Bạn mình đau họng, cho thuốc với')");assert.equal(a.run('s.facts.age'),'');assert.equal(a.run('s.result.route'),'screen');assert.equal(a.run('s.approved'),false)});
test('Tin HTML được hiển thị như chữ, không chèn thẻ thực thi',()=>{const a=app();a.run("receive('<img src=x onerror=alert(1)>')");assert.ok(a.node('#chat').innerHTML.includes('&lt;img'));assert.ok(!a.node('#chat').innerHTML.includes('<img'))});
test('Ca kê đơn không có hành động bán, duyệt hoặc bước đặt',()=>{const a=app();a.run("init('rx')");assert.equal(a.run('s.result.route'),'prescription');assert.ok(!a.node('#staff-content').innerHTML.includes('id="approve"'));assert.ok(!a.node('#actions').innerHTML.includes('data-action="order"'))});
test('Từ chối bản nháp không thể bị duyệt lại trong phiên bản đó',()=>{const a=app();a.run("init('normal');act('accept');act('reject')");a.node('#review-check').checked=true;a.node('#draft').value='Bản nháp';a.run("act('approve')");assert.equal(a.run('s.approved'),false)});

test('Happy: hỏi quy trình không tạo hàng chờ hoặc nháp',()=>{
 const a=app();a.run("init('screening-help')");assert.equal(a.run('s.result.route'),'info');assert.equal(a.run('s.queue'),false);assert.equal(a.run('s.approved'),false);
});
test('Happy: bổ sung từng tin giữ ngữ cảnh, chỉ chuyển khi đã tổng hợp đủ',()=>{
 const a=app();a.run("init('screening-chat');receive('Mình 28 tuổi')");
 assert.equal(a.run('s.facts.duration'),'2 ngay');assert.equal(a.run('s.queue'),false);
 a.run("receive('Không mang thai và không cho con bú')");assert.equal(a.run('s.queue'),false);
 a.run("receive('Không dùng thuốc, không bệnh nền và không dị ứng')");
 assert.equal(a.run('s.result.route'),'review');assert.equal(a.run('s.facts.age'),'28');assert.equal(a.run('s.queue'),true);assert.equal(a.run('s.approved'),false);
});
test('Happy: sửa thông tin thuần túy không tạo triệu chứng hoặc chuyển người',()=>{
 const a=app();a.run("init('profile')");
 const target={elements:{age:{value:'30'},pregnancy:{value:'no'},meds:{value:'Không'},conditions:{value:'Không'},duration:{value:''}}};
 a.node('#edit-form').onsubmit({preventDefault(){},target});
 assert.equal(a.run('s.facts.age'),'30');assert.equal(a.run('s.queue'),false);assert.equal(a.run('s.saved'),null);assert.equal(a.run('s.lastInput'),undefined);
});
test('Happy: lưu và xóa ghi chú hoàn tất không cần người duyệt chuyên môn',()=>{
 const a=app();a.run("init('profile');act('save')");assert.equal(a.node('#consent-check').checked,false);assert.equal(a.run('s.saved'),null);
 a.node('#consent-check').checked=true;a.node('#consent-form').onsubmit({preventDefault(){}});
 assert.equal(a.run('s.saved.age'),'28');assert.equal(a.run('s.queue'),false);
 a.run("act('save')");assert.equal(a.run('s.saved'),null);assert.equal(a.run('s.queue'),false);
});
test('Tin tiếp theo không làm mất thông báo ưu tiên của ca nguy hiểm',()=>{
 const a=app();a.run("init('danger');receive('Tôi đang chờ xe')");
 assert.equal(a.run('s.result.route'),'emergency');assert.equal(a.run('s.queue'),true);assert.equal(a.run('s.facts.age'),'70');
 a.run("receive('Tôi cần cung cấp thông tin gì?')");assert.equal(a.run('s.result.route'),'emergency');assert.equal(a.run('s.queue'),true);
});
test('Tin cảm ơn không gỡ ca đã nhận hoặc khởi động lại thời hạn',()=>{
 const a=app();a.run("init('normal');act('accept');receive('Cảm ơn')");
 assert.equal(a.run('s.queue'),true);assert.equal(a.run('s.accepted'),true);
});
