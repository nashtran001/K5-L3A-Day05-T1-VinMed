/* Deterministic lab fixtures, not a clinical classifier. Unknown input fails closed. */
(function(root){
  const normalize=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
  const emptyFacts=()=>({age:'',pregnancy:'unknown',meds:'',conditions:'',duration:''});
  // Only explicit facts are extracted. This is a small demo grammar, not clinical NLP.
  function extractFacts(text,facts=emptyFacts()){
    const t=normalize(text),f={...facts};
    const months=t.match(/(\d+)\s*thang tuoi/),years=t.match(/(\d+(?:[.,]\d+)?)\s*tuoi/);
    if(months)f.age=String(Math.round(Number(months[1])/12*100)/100);
    else if(years)f.age=years[1].replace(',','.');
    if(/tre so sinh/.test(t))f.age='0';
    const pregnancyText=t.replace(/khong (?:co )?(?:mang thai|co thai|cho con bu|thai)/g,'');
    if(/dang bau|mang thai|co thai|cho con bu/.test(pregnancyText))f.pregnancy='yes';
    else if(/khong (?:co )?(?:mang thai|co thai|cho con bu|thai)/.test(t))f.pregnancy='no';
    if(/(?:khong|chua) (?:dang )?(?:dung|uong) thuoc/.test(t))f.meds='Không';
    if(/khong (?:co )?benh (?:nen|man tinh)/.test(t)&&/khong (?:co )?di ung/.test(t))f.conditions='Không';
    const days=t.match(/\b\d+\s*(?:ngay|hom)\b/);
    const longer=t.match(/(?:trieu chung|keo dai|bi ho|bi cam|bi sot|dau hong|hong dau)[^.,;!?]{0,25}?(\d+\s*(?:tuan|thang))\b/);
    if(days)f.duration=days[0];else if(longer)f.duration=longer[1];
    return f;
  }
  function classify(text,facts=emptyFacts(),{corrected=false}={}){
    const t=normalize(text), f=corrected?{...facts}:extractFacts(text,facts);
    const positiveText=t.replace(/khong (?:co |dang )?(?:benh nen|benh man tinh|di ung|dung thuoc|uong thuoc|mang thai|co thai|cho con bu)/g,'');
    // Negated symptoms are removed; uncertain or indirect phrases still trigger a conservative escalation.
    const dangerText=t.replace(/khong (bi |co |con )?(kho tho|dau nguc|lo mo|tim tai|co giat)/g,'');
    const danger=dangerText.match(/kho tho|dau nguc|lo mo|tim tai|co giat|bat tinh|khong tho|tho khong (duoc|noi)|tho doc/);
    if(danger)return {route:'emergency',facts:f,reason:`Tin nhắn có cụm “${danger[0]}”`,rule:'T1 · dấu hiệu nguy hiểm',text:'Bạn mô tả dấu hiệu có thể nguy hiểm. Hãy gọi cấp cứu hoặc đến cơ sở cấp cứu ngay; đừng chờ dược sĩ trong chat. Mình không thể đánh giá mức độ qua tin nhắn và sẽ không gợi ý thuốc. Thông báo ưu tiên đã được tạo ở bàn dược sĩ mô phỏng, nhưng không thay thế hỗ trợ cấp cứu.'};
    if(/khang sinh|amoxicillin|augmentin|thuoc huyet ap|ke don|khong co don/.test(t))return {route:'prescription',facts:f,reason:'Yêu cầu có thuốc kê đơn hoặc kháng sinh',rule:'T1 · ngoài thẩm quyền',text:'Mình không bán, chỉ liều hay gợi ý thuốc thay thế cho thuốc kê đơn qua chat AI. Bạn có thể trao đổi với dược sĩ về bước khám và kiểm tra đơn phù hợp. Mình đã tạo yêu cầu chuyển dược sĩ mô phỏng.'};
    // Conservative demo policy, not a validated medical threshold.
    if(/\b([7-9]|[1-9]\d+)\s*(ngay|hom)|\b\d+\s*(tuan|thang)\b/.test(normalize(f.duration)))return {route:'handoff',facts:f,reason:'Thời gian triệu chứng được khai riêng: từ 7 ngày hoặc theo tuần/tháng (luật fixture)',rule:'T1 · diễn tiến cần kiểm tra',text:'Triệu chứng đã kéo dài theo thông tin bạn cung cấp. Mình không chọn thuốc mạnh hơn hoặc tự chỉ liều. Mình đã chuyển ca cho dược sĩ mô phỏng để trao đổi về việc đi khám phù hợp. Nếu có dấu hiệu nguy hiểm, hãy tìm hỗ trợ cấp cứu ngay.'};
    if((f.age!==''&&(Number(f.age)<18||Number(f.age)>=65))||f.pregnancy==='yes'||/\bbe\b|con (minh|toi|em)|tre nho|nguoi gia|ba bau|ong (minh|toi)|ba (minh|toi)/.test(t)|| (f.conditions&&!/^(khong|khong co|chua ro)$/i.test(normalize(f.conditions))) || (f.meds&&!/^(khong|khong co|chua ro)$/i.test(normalize(f.meds))) || /tieu duong|benh nen|di ung|benh man|dang dung thuoc|u?ong thuoc.*(ngay|hom).*(khong do|khong khoi)|nhieu ngay|keo dai|loai manh hon/.test(positiveText))return {route:'handoff',facts:f,reason:'Có yếu tố cần chuyên môn: nhóm dễ tổn thương, thuốc/bệnh nền hoặc triệu chứng kéo dài',rule:'T1 · người dùng thuốc & diễn tiến',text:'Mình chưa có đủ căn cứ để chọn sản phẩm an toàn cho người sẽ dùng thuốc. Mình đã chuyển ca cho dược sĩ mô phỏng, kèm thông tin hiện có và những mục chưa rõ. Chưa có gợi ý thuốc nào được gửi. Nếu xuất hiện dấu hiệu nguy hiểm, hãy đi cấp cứu ngay, đừng chờ chat.'};
    if(/(?:can|nen|phai) (?:cung cap|khai|dien|noi).*thong tin|can chuan bi gi|ho tro duoc gi/.test(t))return {route:'info',facts:f,reason:'Câu hỏi về quy trình; căn cứ là các trường sàng lọc trong fixture',rule:'T1 · hỗ trợ tự phục vụ',text:'Bạn cần cho biết ai sẽ dùng thuốc và độ tuổi; sau đó là mang thai/cho con bú, thuốc đã hoặc đang dùng, bệnh nền/dị ứng và thời gian triệu chứng. Bạn có thể bổ sung từng tin hoặc bấm Bổ sung thông tin. Mình tự tổng hợp để bạn kiểm tra, không cần chờ dược sĩ cho bước này; gợi ý sản phẩm vẫn cần dược sĩ duyệt.'};
    if(/luu|xoa|xem/.test(t)&&/ghi chu|ho so|thong tin.*dong y/.test(t))return {route:'privacy',facts:f,reason:'Yêu cầu quản lý ghi chú; chưa có hành động lưu hoặc xóa được thực thi',rule:'T1 · khách kiểm soát dữ liệu',text:'Bạn có thể xem đúng các trường trước khi đồng ý lưu bằng nút Lưu ghi chú. Chưa tích đồng ý và xác nhận thì chưa lưu. Nếu đã lưu, nút Xem / xóa ghi chú cho phép xóa bản ghi trong RAM. Bước này không cần dược sĩ; Phiên mới hoặc tải lại cũng xóa dữ liệu mô phỏng.'};
    if(/con hang|ton kho|gia|khuyen mai|gan (minh|toi)|qua lay|chi nhanh/.test(t))return {route:'source',facts:f,reason:'Không có tool truy vấn tồn kho, giá hoặc chi nhánh trong fixture',rule:'T1 · nguồn sự thật',text:'Mình không có dữ liệu tồn kho, giá hay chi nhánh trong bản mô phỏng này, nên chưa thể xác nhận còn hàng. Bạn có thể nhờ dược sĩ kiểm tra. Đây chưa phải yêu cầu giữ hàng hay đặt mua.'};
    const known=/dau (rat )?hong|hong.*(dau|rat)|so mui|bi cam|bi ho|bi sot|nuoc muoi/.test(t);
    if(!known)return {route:'unknown',facts:f,reason:'Ca lạ ngoài tập luật mô phỏng; không đủ căn cứ phân loại',rule:'G10 · thu hẹp khi nghi ngờ',text:'Mình chưa hiểu đủ tình huống này để đưa ra gợi ý an toàn. Bạn cho biết ai sẽ dùng thuốc và độ tuổi được không? Bạn cũng có thể chuyển thẳng dược sĩ. Mình sẽ không đoán tên thuốc hoặc liều dùng.'};
    const unknown=v=>!v||/^(chua ro|khong biet|unknown)$/i.test(normalize(v));
    const missing=[];if(f.age==='')missing.push('tuổi người sẽ dùng thuốc');if(f.pregnancy==='unknown')missing.push('mang thai / cho con bú');if(unknown(f.meds))missing.push('thuốc đang dùng và đã tự dùng');if(unknown(f.conditions))missing.push('bệnh mạn tính / dị ứng');if(unknown(f.duration))missing.push('thời gian triệu chứng');
    if(missing.length){
      const questions={
        'tuổi người sẽ dùng thuốc':'Ai sẽ dùng thuốc và người đó bao nhiêu tuổi?',
        'mang thai / cho con bú':'Người dùng thuốc có mang thai hoặc đang cho con bú không?',
        'thuốc đang dùng và đã tự dùng':'Người dùng thuốc đang hoặc đã tự dùng thuốc gì? Nếu chưa dùng, bạn có thể ghi “Không dùng thuốc”.',
        'bệnh mạn tính / dị ứng':'Người dùng thuốc có bệnh nền hoặc dị ứng không? Nếu không có cả hai, bạn có thể ghi “Không bệnh nền, không dị ứng”.',
        'thời gian triệu chứng':'Triệu chứng kéo dài bao lâu? Ví dụ: “2 ngày”.'
      };
      return {route:'screen',facts:f,missing,reason:`Chưa rõ: ${missing.join(', ')}`,rule:'T1 · sàng lọc trước gợi ý',text:'Mình đã ghi nhận thông tin rõ ràng bạn cung cấp. '+questions[missing[0]]+' Bạn có thể trả lời từng tin hoặc bấm Bổ sung thông tin. Chưa đủ căn cứ thì chưa có gợi ý sản phẩm; bước hỏi và tổng hợp này do AI tự hỗ trợ, không cần chờ dược sĩ.'};
    }
    return {route:'review',facts:f,reason:'Đã tổng hợp đủ trường; quyết định chuyên môn vẫn cần dược sĩ',rule:'T1 · gợi ý phải được dược sĩ duyệt',text:'Mình đã tổng hợp đủ các mục sàng lọc bạn cung cấp để bạn kiểm tra ở phần Căn cứ đang có. Bước thu thập thông tin đã hoàn tất. Một bản nháp đang chờ dược sĩ kiểm tra trước khi gửi; chưa có sản phẩm nào được gợi ý hoặc đặt mua. Bạn có thể sửa thông tin bất cứ lúc nào.'};
  }
  const api={classify,normalize,emptyFacts,extractFacts};if(typeof module!=='undefined')module.exports=api;root.VinMedEngine=api;
})(globalThis);
