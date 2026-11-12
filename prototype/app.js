const $=s=>document.querySelector(s), E=VinMedEngine;
const cases=[
 {id:'screening-help',icon:'✓',title:'Cần chuẩn bị thông tin gì?',sub:'AI tự hướng dẫn · không phải chờ',message:'Tôi cần cung cấp những thông tin gì trước khi hỏi thuốc?'},
 {id:'screening-chat',icon:'✎',title:'Bổ sung từng tin nhắn',sub:'Happy path · tổng hợp thông tin',message:'Mình đau họng 2 ngày, có thuốc gì không?'},
 {id:'profile',icon:'♧',title:'Sửa, lưu và xóa ghi chú',sub:'Khách tự kiểm soát · không cần dược sĩ',message:'Cho mình xem ghi chú trước khi đồng ý lưu.',facts:{age:'28',pregnancy:'unknown',meds:'',conditions:'',duration:''}},
 {id:'child',icon:'♧',title:'Thuốc cho bé 2 tuổi',sub:'Thiếu thông tin · chuyển người',message:'Con mình 2 tuổi bị ho 2 ngày, có thuốc gì không?'},
 {id:'danger',icon:'♡',title:'Dấu hiệu nguy hiểm',sub:'Ưu tiên ngay · không chờ chat',message:'Ba mình 70 tuổi đau ngực, khó thở, mua giúp thuốc với.'},
 {id:'normal',icon:'✧',title:'Đau họng thông thường',sub:'Sàng lọc · dược sĩ duyệt',message:'Mình 28 tuổi đau rát họng 2 ngày nay, có thuốc gì không?',facts:{age:'28',pregnancy:'no',meds:'Không',conditions:'Không',duration:'2 ngày'}},
 {id:'stock',icon:'⌕',title:'Hỏi tồn kho',sub:'Thiếu nguồn · nói rõ giới hạn',message:'Pharmacity gần mình còn nước muối sinh lý không, tối nay mình qua lấy.'},
 {id:'pregnant',icon:'♧',title:'Mang thai 3 tháng',sub:'Cần dược sĩ · không tự gợi ý',message:'Mình đang bầu 3 tháng, bị cảm sổ mũi 2 hôm, thuốc nào không ảnh hưởng em bé?'},
 {id:'rx',icon:'⊘',title:'Xin mua kháng sinh',sub:'Ngoài thẩm quyền · từ chối',message:'Bán mình amoxicillin nhé, mình không có đơn.'},
 {id:'correction',icon:'↺',title:'Sửa: người dùng là bé',sub:'Thu hồi gợi ý · đánh giá lại',message:'Họng mình đau rát 2 ngày nay, có thuốc gì không?'}
];
let s,toastTimer;
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function notify(t){$('#toast').textContent=t;$('#toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').style.display='none',3500)}
function log(text){s.logs.push({at:new Date().toLocaleTimeString('vi-VN'),text})}
function msg(text,type='ai'){s.messages.push({text,type});}
function init(id){const c=cases.find(c=>c.id===id);s={caseId:id||'',facts:E.emptyFacts(),messages:[],logs:[],result:null,queue:false,accepted:false,expired:false,approved:false,rejected:false,saved:null,deadline:0,view:'customer',revision:0};if(c){s.facts={...s.facts,...c.facts};receive(c.message,true)}else{msg('Chào bạn, mình là trợ lý AI mô phỏng. Mình có thể hỏi sàng lọc và chuyển dược sĩ; gợi ý sản phẩm cần dược sĩ duyệt. Bạn đang hỏi cho ai và người đó bao nhiêu tuổi?')}render()}
function revoke(){s.revision++;s.approved=false;s.rejected=false;s.accepted=false;s.expired=false;s.deadline=0;s.queue=false;log('Thu hồi bản nháp/gợi ý cũ; tăng phiên bản thông tin.');}
function evaluate(text,corrected=false){const r=E.classify(text,s.facts,{corrected});s.result=r;s.facts=r.facts;msg(r.text,r.route==='emergency'?'alert':'ai');log(`${r.rule}: ${r.reason}`);if(['emergency','prescription','handoff','review'].includes(r.route)&&!s.queue){s.queue=true;s.deadline=Date.now()+120000;log(r.route==='emergency'?'Đã tạo thông báo cấp cứu mô phỏng ngay, không đưa vào hàng chờ thường.':'Đã tạo ca ở bàn dược sĩ mô phỏng; hạn nhận ca 120 giây.')}}
function receive(text,keepFixture=false){
 if(!text.trim())return;
 const direct=E.classify(text);
 // Process/privacy questions do not erase or downgrade an active clinical case.
 if(['info','privacy'].includes(direct.route)){
  msg(text,'user');msg(direct.text);log(direct.rule);
  if(!s.lastInput)s.result={...direct,facts:{...s.facts}};
  render();return;
 }
 if(/^(cam on(?: ban)?|vang|da|toi dang cho xe)[.!\s]*$/.test(E.normalize(text))){
  msg(text,'user');msg(s.result?.route==='emergency'?'Cảnh báo trước vẫn có hiệu lực. Đừng chờ phản hồi trong chat để tìm hỗ trợ cấp cứu.':'Mình vẫn giữ thông tin và trạng thái ca hiện tại. Bạn có thể bổ sung hoặc sửa khi cần.');render();return;
 }
 const newPatient=Boolean(s.lastInput)&&/ban minh|nguoi khac|(?:thuoc|hoi) (?:nay )?cho |doi nguoi dung/.test(E.normalize(text));
 if(newPatient&&s.result?.route==='emergency'){
  msg(text,'user');msg('Ca nguy hiểm trước vẫn cần được xử lý. Nếu đây là người dùng thuốc khác, hãy chọn Phiên mới; tin nhắn này không gỡ cảnh báo và thông báo ưu tiên hiện có.');render();return;
 }
 const base=newPatient?E.emptyFacts():s.facts;
 const nextFacts=E.extractFacts(text,base);
 const changed=JSON.stringify(nextFacts)!==JSON.stringify(s.facts);
 if(newPatient||changed||keepFixture||!s.lastInput)revoke();
 if(newPatient){s.lastInput='';s.saved=null;msg('Đang hỏi cho người khác: đã bỏ các trường và ghi chú người trước. Bạn cần cung cấp lại thông tin; gợi ý cũ không còn áp dụng.','system');}
 s.facts=nextFacts;msg(text,'user');s.lastInput=s.lastInput?s.lastInput+'\n'+text:text;
 // Parse new facts only from the new message; retain earlier symptom context.
 evaluate(s.lastInput,true);render();
}
function render(){
 $('#scenarios').innerHTML=cases.map(c=>`<button class="scenario ${c.id===s.caseId?'active':''}" data-case="${c.id}"><span class="case-icon">${c.icon}</span><span><b>${c.title}</b><small>${c.sub}</small></span></button>`).join('');
 $('#chat').innerHTML='<div class="day-label">PHIÊN MÔ PHỎNG · DỮ LIỆU GIẢ</div>'+s.messages.map(m=>`<div class="message ${m.type}">${['ai','alert'].includes(m.type)?'<div class="who">VINMED · TRỢ LÝ AI MÔ PHỎNG</div>':''}${esc(m.text)}</div>`).join('');
 $('#chat').scrollTop=$('#chat').scrollHeight;
 const r=s.result,route=r?.route;
 const labels={info:['AI tự hỗ trợ quy trình','green'],privacy:['Bạn kiểm soát ghi chú','green'],emergency:['Cần hỗ trợ ngay','red'],handoff:['Cần dược sĩ kiểm tra','amber'],prescription:['Ngoài thẩm quyền AI','red'],source:['Chưa có dữ liệu xác minh','amber'],unknown:['Chưa hiểu đủ tình huống','amber'],screen:['Chưa đủ thông tin','amber'],review:['Đủ trường · chưa xác minh','green']};const label=labels[route]||['Chưa có thông tin','amber'];
 $('#risk-status').innerHTML=`<span class="badge ${label[1]}">${label[0]}</span><div class="small muted">${esc(r?.reason||'AI sẽ hỏi trước khi đưa ra quyết định.')}</div>`;
 const facts=[['Người dùng thuốc',s.facts.age!==''?`${s.facts.age} tuổi`:'Chưa rõ'],['Thai / cho con bú',{unknown:'Chưa rõ',no:'Không',yes:'Có'}[s.facts.pregnancy]],['Thuốc đã/đang dùng',s.facts.meds||'Chưa rõ'],['Bệnh nền / dị ứng',s.facts.conditions||'Chưa rõ'],['Thời gian',s.facts.duration||'Chưa rõ']];
 $('#facts').innerHTML=facts.map(([a,b])=>`<div class="fact"><dt>${a}</dt><dd>${esc(b)}</dd></div>`).join('');
 $('#evidence').innerHTML=`<b>${esc(r?.rule||'T1 · giới hạn hệ thống')}</b><p>Căn cứ: tin nhắn và các trường khách vừa cung cấp, chưa được dược sĩ xác minh. Không dùng phần trăm chắc chắn giả.</p><p>Chính sách học tập từ Track 1: nhóm dễ tổn thương → dược sĩ; dấu hiệu nguy hiểm → hỗ trợ ngay; không tự chỉ liều.</p><p>Không có kết nối tồn kho, dữ liệu lâm sàng hoặc nhà thuốc thật.</p>`;
 let actions='';
 if(route==='emergency')actions+='<button class="danger" data-action="emergency">Tôi hiểu · sẽ tìm hỗ trợ cấp cứu</button>';
 if(['info','privacy','screen','unknown'].includes(route))actions+='<button class="primary" data-action="edit">'+(route==='privacy'?'Xem / sửa các trường':'Bổ sung thông tin')+'</button>';
 if(s.queue&&route!=='emergency')actions+=`<button class="secondary" data-action="staff">${s.accepted?'Dược sĩ đã nhận ca':'Xem ca đã chuyển'} <span class="number">5</span></button><button class="text-button" data-action="undo">Hoàn tác chuyển ca</button>`;
 else if(!s.queue)actions+='<button class="secondary" data-action="handoff">Gặp dược sĩ</button>';
 actions+='<button class="text-button" data-action="save">'+(s.saved?'Xem / xóa ghi chú':'Lưu ghi chú (cần đồng ý)')+' <span class="number">6</span></button>';
 if(s.approved)actions+='<button class="primary" data-action="order">Xem bước đặt mô phỏng</button>';
 $('#actions').innerHTML=actions;$('#queue-count').textContent=s.queue?'1':'0';
 const isStaff=s.view==='pharmacist';$('#customer-view').classList.toggle('hidden',isStaff);$('#pharmacist-view').classList.toggle('hidden',!isStaff);document.querySelectorAll('.tab').forEach(x=>{const active=x.dataset.view===s.view;x.classList.toggle('active',active);x.setAttribute('aria-pressed',active)});
 $('#page-title').textContent=isStaff?'Mỗi quyết định đều có người kiểm tra.':'Hiểu đúng trước khi dùng thuốc.';
 $('#page-sub').textContent=isStaff?'Tóm tắt có nguồn, phần chưa rõ có nhãn. Quyền duyệt thuộc về dược sĩ.':'Trợ lý AI hỏi thêm khi chưa rõ. Dược sĩ quyết định khi cần chuyên môn.';
 renderStaff(facts);
}
function renderStaff(facts){
 if(!s.queue){$('#staff-content').innerHTML='<div class="staff-card"><h3>Chưa có ca cần xử lý</h3><p class="muted">Chọn ca thực hành và gửi tin ở màn hình khách. Ca hoàn tác sẽ được gỡ khỏi bàn này.</p></div>';return}
 const r=s.result,eligible=r?.route==='review',urgent=r?.route==='emergency';
 $('#staff-content').innerHTML=`<span class="badge ${urgent?'red':''}">${urgent?'ƯU TIÊN NGAY · KHÔNG CHỜ CHAT':s.expired?'Hết thời gian nhận ca':s.accepted?'Dược sĩ đã nhận':'Đang chờ dược sĩ nhận ca'}</span><div class="staff-card"><h3>VM-DEMO-01 · Tóm tắt phiên bản ${s.revision}</h3><p><b>Tin gốc:</b> ${esc(s.lastInput||'Yêu cầu chuyển trực tiếp')}</p>${facts.map(([a,b])=>`<p><span class="muted">${a}:</span> ${esc(b)}</p>`).join('')}<p><b>Lý do chuyển:</b> ${esc(r?.reason||'Khách yêu cầu gặp dược sĩ')}</p><p class="muted">Nguồn: khách cung cấp, chưa xác minh · Chỉ chia sẻ trong phiên hỗ trợ này, chưa lưu hồ sơ.</p></div>${urgent?'<div class="staff-card"><h3>Cảnh báo đã hiện ngay phía khách</h3><p>Không có bản nháp sản phẩm hoặc nút đặt. Thông báo này không xác nhận có dịch vụ cấp cứu được gọi.</p></div>':`<p class="small muted">${s.expired?'Không tự duyệt khi quá hạn. Khách được thông báo tìm hỗ trợ trực tiếp.':s.accepted?'Ca đã nhận, không còn hứa thời gian trả lời.':'Hạn nhận ca mô phỏng: <span class="timer" id="timer"></span> · Không tự gửi khi hết hạn.'}</p>`}
 <div class="button-row">${!s.accepted&&!s.expired?'<button class="primary" data-action="accept">Nhận ca mô phỏng</button>':''}${!urgent&&!s.accepted&&!s.expired?'<button class="quiet" data-action="timeout">Thử tình huống quá hạn</button>':''}</div>
 ${eligible?`<div class="staff-card"><h3>Bản nháp chờ duyệt <span class="badge">Chưa gửi khách</span></h3><p>Fixture SP-DEMO-01 · Dung dịch vệ sinh họng mẫu · Sản phẩm giả, không có liều, giá hoặc tồn kho.</p><label class="small" for="draft">Nội dung dược sĩ kiểm tra trước khi gửi</label><textarea id="draft" maxlength="600">Dược sĩ mô phỏng đã kiểm tra thông tin bạn cung cấp. Bạn có thể xem sản phẩm vệ sinh họng mẫu SP-DEMO-01 trong bài lab. Hãy đọc nhãn và hỏi dược sĩ về cách dùng phù hợp. Đây không phải đơn thuốc hay giao dịch thật.</textarea><label class="check small"><input type="checkbox" id="review-check"> Tôi đã kiểm tra người dùng thuốc, chống chỉ định và căn cứ bản nháp (mô phỏng).</label><div class="button-row"><button class="quiet" data-action="reject" ${s.approved||s.rejected?'disabled':''}>Từ chối bản nháp</button><button class="primary" id="approve" data-action="approve" disabled>Duyệt & gửi mô phỏng</button></div><p class="small muted">Chỉ mở duyệt sau khi nhận ca và tích kiểm tra. Hết hạn hoặc sửa dữ liệu sẽ vô hiệu hóa bản nháp.</p></div>`:'<div class="staff-card"><h3>Gợi ý sản phẩm đang bị chặn</h3><p>Ca này chưa đủ điều kiện cho bản nháp sản phẩm. Dược sĩ trao đổi thêm hoặc hướng dẫn đi khám; AI không tự mở khóa bằng một lời xác nhận.</p></div>'}
 <div class="staff-card"><h3>Nhật ký quyết định · Chỉ trong bộ nhớ</h3>${s.logs.map(l=>`<p class="small"><span class="muted">${l.at}</span> · ${esc(l.text)}</p>`).join('')}</div>`;
 updateTimer();
}
function updateTimer(){if($('#timer'))$('#timer').textContent=Math.max(0,Math.ceil((s.deadline-Date.now())/1000))+' giây';}
function expire(){if(!s.queue||s.accepted||s.expired||s.result?.route==='emergency')return;s.expired=true;s.approved=false;log('Hết hạn nhận ca: không gửi gợi ý, không tự nâng quyền.');msg('Chưa có dược sĩ nhận ca trong thời gian mô phỏng. Mình không thể hứa thời gian phản hồi. Bạn nên tìm dược sĩ hoặc cơ sở y tế trực tiếp; nếu có dấu hiệu nguy hiểm, hãy tìm hỗ trợ cấp cứu ngay.');render()}
setInterval(()=>{if(s?.queue&&!s.accepted&&!s.expired&&Date.now()>=s.deadline)expire();updateTimer()},1000);
function openEdit(){const f=$('#edit-form');for(const k of ['age','pregnancy','meds','conditions','duration'])f.elements[k].value=s.facts[k];$('#edit-dialog').showModal()}
function act(a){
 if(a==='edit')return openEdit();
 if(a==='staff'){s.view='pharmacist';render();return}
 if(a==='handoff'){s.queue=true;s.deadline=Date.now()+120000;s.expired=false;msg('Yêu cầu chuyển dược sĩ mô phỏng đã được tạo. Bạn có thể hoàn tác chuyển ca. Chưa có thông tin nào được lưu vào hồ sơ.');log('Khách chủ động yêu cầu chuyển dược sĩ.');}
 if(a==='undo'){s.queue=false;s.accepted=false;s.approved=false;msg('Đã hoàn tác chuyển ca và thu hồi bản nháp. Không có gợi ý mới nào được gửi. Cảnh báo nguy hiểm (nếu có) vẫn có hiệu lực.','system');log('Khách hoàn tác chuyển ca.');}
 if(a==='emergency'){msg('Bạn đã xác nhận sẽ tìm hỗ trợ. Bản mô phỏng không gọi cấp cứu và không xác nhận bạn đã nhận được chăm sóc.','system');log('Khách xác nhận đã đọc cảnh báo; không đánh dấu đã được cấp cứu.');}
 if(a==='accept'&&s.queue&&!s.expired){s.accepted=true;msg('Dược sĩ mô phỏng đã nhận ca và thấy các mục chưa rõ. Đây không phải kết nối với dược sĩ thật.','system');log('Dược sĩ mô phỏng nhận ca.');}
 if(a==='timeout'){expire();return}
 if(a==='reject'){s.rejected=true;s.approved=false;msg('Dược sĩ mô phỏng đã từ chối bản nháp; không gửi sản phẩm cho bạn. Cần trao đổi thêm trước khi đưa ra gợi ý.');log('Dược sĩ từ chối bản nháp.');}
 if(a==='approve'){if(!(s.queue&&s.accepted&&!s.expired&&!s.rejected&&!s.approved&&s.result?.route==='review'&&$('#review-check')?.checked))return;const draft=$('#draft').value.trim();if(!draft)return notify('Cần nội dung trước khi duyệt.');s.approved=true;msg(draft,'approved');log('Dược sĩ mô phỏng duyệt SP-DEMO-01, khớp phiên bản hiện tại.');notify('Đã gửi gợi ý mô phỏng sang màn hình khách.');}
 if(a==='order'){if(!s.approved)return;msg('Bước đặt mô phỏng: SP-DEMO-01 · Không có tồn kho / giá được xác minh. Bài lab dừng tại đây; không tạo đơn, không thanh toán và không giao thuốc.','system');}
 if(a==='save'){if(s.saved){s.saved=null;msg('Đã xóa ghi chú khỏi hồ sơ mô phỏng trong bộ nhớ. Lịch sử chat của phiên vẫn hiển thị cho đến khi bạn chọn Phiên mới.','system');log('Khách xóa ghi chú.');notify('Đã xóa ghi chú mô phỏng.')}else{$('#save-preview').textContent=JSON.stringify(s.facts,null,2);$('#consent-check').checked=false;$('#save-dialog').showModal();return}}
 render();
}
document.addEventListener('click',e=>{const c=e.target.closest('[data-case]');if(c)return init(c.dataset.case);const a=e.target.closest('[data-action]');if(a&&!a.disabled)return act(a.dataset.action);const v=e.target.closest('[data-view]');if(v){s.view=v.dataset.view;render()}});
document.addEventListener('change',e=>{if(e.target.id==='review-check')$('#approve').disabled=!(e.target.checked&&s.queue&&s.accepted&&!s.expired&&!s.approved&&!s.rejected&&s.result?.route==='review');});
$('#chat-form').addEventListener('submit',e=>{e.preventDefault();const input=$('#message'),text=input.value.trim();if(text){input.value='';receive(text)}});
$('#message').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();$('#chat-form').requestSubmit()}});
$('#correct').onclick=openEdit;$('#reset').onclick=()=>{init();notify('Đã xóa dữ liệu phiên và hồ sơ mô phỏng.');};$('#annotations').onchange=e=>document.body.classList.toggle('no-annotations',!e.target.checked);
$('#close-edit').onclick=()=>$('#edit-dialog').close();$('#close-save').onclick=()=>$('#save-dialog').close();
$('#edit-form').onsubmit=e=>{e.preventDefault();const f=e.target;revoke();for(const k of ['age','pregnancy','meds','conditions','duration'])s.facts[k]=f.elements[k].value.trim();msg(`Mình sửa thông tin: người dùng ${s.facts.age} tuổi; thai/cho bú: ${{unknown:'chưa rõ',yes:'có',no:'không'}[s.facts.pregnancy]}.`,'user');msg('Mình đã cập nhật và thu hồi bản nháp/gợi ý cũ. Những gợi ý trước đó không còn áp dụng cho thông tin vừa sửa.','system');$('#edit-dialog').close();if(s.lastInput)evaluate(s.lastInput,true);else{s.result={...E.classify('Tôi cần cung cấp thông tin gì?'),facts:{...s.facts}};msg('Đã cập nhật các trường bạn cung cấp trong phiên. Chưa lưu hồ sơ, chưa yêu cầu tư vấn hay chuyển dược sĩ. Bạn có thể kiểm tra và chọn lưu riêng.');}render()};
$('#consent-form').onsubmit=e=>{e.preventDefault();if(!$('#consent-check').checked)return;s.saved={...s.facts};log('Khách đồng ý rõ ràng; lưu ghi chú mô phỏng trong bộ nhớ.');msg('Đã lưu ghi chú mô phỏng sau khi bạn đồng ý. Bạn có thể bấm “Xem / xóa ghi chú” để xóa; tải lại hoặc Phiên mới cũng xóa dữ liệu.','system');$('#save-dialog').close();render()};
init('child');
