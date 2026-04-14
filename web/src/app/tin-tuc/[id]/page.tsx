import Link from 'next/link';

const KIEN_THUC = [
  {
    id: "1",
    title: "Phòng Ngừa Mụn Trong Mùa Hè Nắng Nóng",
    tag: "Mụn Trứng Cá",
    nguon: "Hướng dẫn Da liễu Bộ Y Tế VN",
    date: "2026-03-23",
    content: `
      <p>Nhiệt độ cao khiến tuyến bã nhờn hoạt động mạnh hơn 30–40%, kết hợp với mồ hôi và bụi bẩn môi trường tạo điều kiện lý tưởng để vi khuẩn <em>Cutibacterium acnes</em> (trước đây gọi là <em>P. acnes</em>) gây viêm nang lông và sinh mụn.</p>
      <h2>Cơ Chế Sinh Mụn Mùa Hè</h2>
      <ul>
        <li><strong>Tăng tiết bã nhờn:</strong> Nhiệt độ tăng → tuyến bã nhờn tăng hoạt động → bít tắc lỗ chân lông.</li>
        <li><strong>Mồ hôi + vi khuẩn:</strong> Môi trường ẩm ướt tạo điều kiện vi khuẩn sinh sản nhanh.</li>
        <li><strong>Kem chống nắng sai loại:</strong> Công thức dầu hoặc gây bít tắc (comedogenic) làm nặng thêm tình trạng.</li>
        <li><strong>Căng thẳng nhiệt:</strong> Cortisol tăng → kích thích tuyến bã nhờn.</li>
      </ul>
      <h2>Giải Pháp Phòng Ngừa Khoa Học</h2>
      <ol>
        <li><strong>Làm sạch 2 lần/ngày</strong> bằng sữa rửa mặt dịu nhẹ (pH 4.5–5.5), không chứa SLS/SLES mạnh.</li>
        <li><strong>Chống nắng bắt buộc:</strong> Chọn loại <em>non-comedogenic</em>, gel-base hoặc khoáng (Zinc Oxide / Titanium Dioxide). SPF 50+ PA++++.</li>
        <li><strong>Uống 2–2.5L nước/ngày</strong> để duy trì độ ẩm nội bào và hỗ trợ chuyển hóa da.</li>
        <li><strong>Tránh chạm tay lên mặt</strong> — bàn tay mang 200+ chủng vi khuẩn.</li>
        <li><strong>Thay gối 2–3 lần/tuần</strong> — gối tích tụ bã nhờn và vi khuẩn.</li>
        <li><strong>Giảm thực phẩm đường huyết cao</strong> (sữa bò, đường trắng, bánh mì trắng) — liên quan đến mụn theo các nghiên cứu gần đây.</li>
      </ol>
      <h2>Khi Nào Cần Gặp Bác Sĩ Da Liễu?</h2>
      <p>Nếu mụn viêm sâu, nang bọc, để lại sẹo thâm/sẹo rỗ hoặc không cải thiện sau 8 tuần tự chăm sóc — cần được thăm khám và điều trị bằng thuốc kê đơn (kháng sinh, Retinoid, Isotretinoin).</p>
    `
  },
  {
    id: "2",
    title: "Hiểu Đúng Về Corticoid Trong Mỹ Phẩm & Kem Trộn",
    tag: "Cảnh Báo Y Khoa",
    nguon: "Hội Da Liễu Việt Nam",
    date: "2026-03-10",
    content: `
      <p>Corticosteroid (thường gọi là Corticoid) là nhóm thuốc kháng viêm cực mạnh, được phép dùng trong điều trị y khoa dưới sự giám sát chặt chẽ của bác sĩ. Tuy nhiên, nhóm thuốc này đang bị lạm dụng phổ biến trong "kem trộn" làm trắng da trôi nổi — gây ra hàng loạt tác hại nghiêm trọng.</p>
      <h2>Dấu Hiệu Nhận Biết Kem Trộn Có Corticoid</h2>
      <ul>
        <li>Da trắng sáng nhanh bất thường trong 1–2 tuần đầu dùng.</li>
        <li>Khi ngừng kem, da nổi mụn ồ ạt, đỏ bừng, ngứa rát — dấu hiệu "hội chứng cai" Corticoid.</li>
        <li>Da mỏng dần, xuất hiện mao mạch đỏ lộ rõ (telangiectasia).</li>
        <li>Lông vùng dùng kem mọc nhiều hơn (hypertrichosis).</li>
      </ul>
      <h2>Tác Hại Khi Dùng Lâu Dài</h2>
      <ul>
        <li><strong>Teo da (skin atrophy):</strong> Da mỏng, dễ rách, mất độ đàn hồi vĩnh viễn.</li>
        <li><strong>Rổ da Cushing cục bộ:</strong> Giãn mao mạch, xuất hiện vết rạn trắng (striae).</li>
        <li><strong>Nhiễm trùng cơ hội:</strong> Corticoid ức chế miễn dịch cục bộ → nấm da, viêm nang lông lan rộng.</li>
        <li><strong>Tăng nhãn áp:</strong> Dùng gần mắt có nguy cơ gây Glaucoma.</li>
        <li><strong>Phụ thuộc thuốc:</strong> Da không thể tự điều tiết khi ngừng, gây "rebound" mạnh.</li>
      </ul>
      <h2>Hướng Điều Trị Phục Hồi</h2>
      <p>Quá trình phục hồi sau lạm dụng Corticoid cần được bác sĩ da liễu giám sát, bao gồm: ngừng dùng từ từ (hoặc thay bằng Corticoid nhẹ hơn), điều trị biến chứng, phục hồi hàng rào da bằng Ceramide và theo dõi định kỳ. Thời gian phục hồi thường kéo dài 3–12 tháng.</p>
    `
  },
  {
    id: "3",
    title: "Nám Da: Phân Biệt Nám Thượng Bì Và Hạ Bì Để Điều Trị Đúng",
    tag: "Nám Da",
    nguon: "Hội Da Liễu Việt Nam",
    date: "2026-03-05",
    content: `
      <p>Nám da (Melasma) là rối loạn tăng sắc tố da mãn tính, ảnh hưởng chủ yếu đến phụ nữ (95%) ở độ tuổi sinh sản. Việc phân biệt chính xác loại nám là yêu cầu bắt buộc trước khi lập phác đồ điều trị — điều trị sai loại không chỉ kém hiệu quả mà còn làm nám nặng thêm.</p>
      <h2>Phân Loại Nám Theo Độ Sâu</h2>
      <table>
        <thead><tr><th>Đặc điểm</th><th>Nám Thượng Bì (Epidermal)</th><th>Nám Hạ Bì (Dermal)</th></tr></thead>
        <tbody>
          <tr><td>Màu sắc</td><td>Nâu đậm, nâu vàng</td><td>Xám xanh, xám nâu</td></tr>
          <tr><td>Đèn Wood</td><td>Tương phản rõ (đậm hơn)</td><td>Không tương phản (không thay đổi)</td></tr>
          <tr><td>Đáp ứng điều trị</td><td>Tốt hơn với kem bôi</td><td>Khó, cần Laser chuyên sâu</td></tr>
        </tbody>
      </table>
      <h2>Nguyên Tắc Điều Trị Chung (Bắt Buộc)</h2>
      <ol>
        <li><strong>Chống nắng SPF 50+ PA++++</strong> mỗi 2–3 giờ, không kể trong hay ngoài nhà (ánh sáng nhìn thấy HEV cũng kích hoạt nám).</li>
        <li><strong>Không tự ý laser</strong> khi chưa phân loại nám — laser sai bước sóng, sai thông số trên nám hạ bì có thể gây bùng phát nặng hơn (PIH).</li>
        <li>Kiên trì điều trị ít nhất 3–6 tháng. Nám là bệnh mãn tính, cần duy trì để phòng tái phát.</li>
      </ol>
    `
  },
  {
    id: "4",
    title: "Retinoid: 'Vàng Ròng' Của Da Liễu Và Cách Dùng An Toàn",
    tag: "Kiến Thức Chăm Sóc Da",
    nguon: "Hội Da Liễu VN, Bộ Y Tế",
    date: "2026-02-28",
    content: `
      <p>Retinoid là nhóm dẫn xuất Vitamin A, được Hội Da Liễu Việt Nam và các chuyên gia da liễu xếp vào nhóm thành phần có bằng chứng khoa học mạnh nhất trong chăm sóc da: trị mụn, chống lão hóa, điều trị rối loạn sừng hóa.</p>
      <h2>So Sánh Các Thế Hệ Retinoid</h2>
      <ul>
        <li><strong>Retinol (OTC):</strong> Yếu nhất, cần chuyển hóa qua 2 bước → Retinal → Retinoic acid. Phù hợp người mới bắt đầu.</li>
        <li><strong>Retinaldehyde (Retinal):</strong> Trung gian, mạnh hơn Retinol 11 lần, ít kích ứng hơn Tretinoin.</li>
        <li><strong>Tretinoin (Retinoic acid – kê đơn):</strong> Mạnh nhất trong Retinoid tại chỗ. Hiệu quả cao nhất, kích ứng cao nhất.</li>
        <li><strong>Adapalene 0.1% (OTC ở nhiều nước):</strong> Thế hệ 3, ít kích ứng hơn Tretinoin, đặc biệt hiệu quả với mụn.</li>
      </ul>
      <h2>Quy Tắc "Sandwich" Giảm Kích Ứng</h2>
      <p>Cho người mới bắt đầu: Dưỡng ẩm → Đợi 10 phút → Retinoid (lượng hạt đậu cho toàn mặt) → Dưỡng ẩm. Bắt đầu 2 lần/tuần, tăng dần sau 4 tuần.</p>
      <h2>Lưu Ý Quan Trọng</h2>
      <ul>
        <li>Chỉ dùng ban đêm (UV phân hủy Retinoid và tăng nhạy cảm da với nắng).</li>
        <li>Tuyệt đối không dùng khi mang thai (Isotretinoin và Tretinoin gây dị tật thai nhi).</li>
        <li>"Retinoid uglies" (da bong, đỏ, ngứa tuần 2–6) là bình thường — kiên trì qua giai đoạn này.</li>
      </ul>
    `
  },
  {
    id: "5",
    title: "Chàm Dị Ứng (Atopic Dermatitis): Kiểm Soát Bệnh Lâu Dài",
    tag: "Bệnh Da Mãn Tính",
    nguon: "Bộ Y Tế Việt Nam",
    date: "2026-02-20",
    content: `
      <p>Viêm da cơ địa (Atopic Dermatitis / Chàm) là bệnh da viêm mãn tính tái phát do rối loạn hàng rào bảo vệ da (thiếu Filaggrin) và hoạt hóa miễn dịch Th2 quá mức. Ảnh hưởng 20% trẻ em và 3% người lớn toàn cầu.</p>
      <h2>Yếu Tố Khởi Phát Cần Tránh</h2>
      <ul>
        <li>Xà phòng kiềm mạnh, nước quá nóng (tắm &gt; 5 phút, nước ấm 36–38°C).</li>
        <li>Vải len, sợi tổng hợp (ưu tiên 100% cotton mềm).</li>
        <li>Bụi nhà, lông thú cưng, phấn hoa — dị nguyên hít phải.</li>
        <li>Căng thẳng, thay đổi thời tiết đột ngột.</li>
        <li>Một số thực phẩm (trứng, sữa, đậu phộng ở trẻ nhỏ — cần test dị ứng trước khi loại trừ).</li>
      </ul>
      <h2>Nền Tảng Điều Trị: Dưỡng Ẩm</h2>
      <p>Dưỡng ẩm chứa <strong>Ceramide</strong> (NMF) là nền tảng điều trị bắt buộc ở mọi cấp độ nặng. Bôi ít nhất 2 lần/ngày, ngay sau khi tắm (trong vòng 3 phút — "soak and smear"). Lượng dùng: 250g/tuần cho người lớn cơ thể toàn thân.</p>
      <h2>Thuốc Điều Trị Theo Cấp Độ</h2>
      <ul>
        <li><strong>Nhẹ:</strong> Corticosteroid bôi nhẹ (Hydrocortisone 1%) ngắt quãng.</li>
        <li><strong>Vừa:</strong> Ức chế Calcineurin (Tacrolimus 0.03–0.1%) — không teo da, an toàn dùng lâu dài và quanh mắt.</li>
        <li><strong>Nặng:</strong> Dupilumab (kháng IL-4Rα) — sinh học đầu tiên được được chỉ định trong điều trị AD, hiệu quả 60–70% sạch/gần sạch sau 16 tuần.</li>
      </ul>
    `
  },
  {
    id: "6",
    title: "Chống Nắng Đúng Cách: SPF, PA, Khoáng Và Hóa Học",
    tag: "Kiến Thức Chăm Sóc Da",
    nguon: "Bộ Y Tế Việt Nam",
    date: "2026-02-14",
    content: `
      <p>Chống nắng là bước chăm sóc da quan trọng nhất để phòng ngừa lão hóa sớm, ung thư da, nám và tăng sắc tố. Tuy nhiên, nhiều người vẫn còn hiểu sai về cách sử dụng đúng.</p>
      <h2>SPF Và PA Là Gì?</h2>
      <ul>
        <li><strong>SPF (Sun Protection Factor):</strong> Chỉ số bảo vệ UVB (gây cháy nắng, ung thư da). SPF 50 chặn 98% UVB. SPF 30 chặn 97%.</li>
        <li><strong>PA+ đến PA++++:</strong> Chỉ số bảo vệ UVA (gây lão hóa, nám, ung thư tế bào đáy). PA++++ = bảo vệ cao nhất.</li>
        <li><strong>Ánh sáng HEV (Blue Light):</strong> Từ màn hình và ánh sáng nhìn thấy — cũng kích hoạt nám. Cần chống nắng khoáng có Iron Oxide.</li>
      </ul>
      <h2>Khoáng (Physical) Vs Hóa Học (Chemical)</h2>
      <ul>
        <li><strong>Khoáng (Zinc Oxide, Titanium Dioxide):</strong> Hoạt động ngay khi bôi, an toàn cho da nhạy cảm, phụ nữ có thai, trẻ em. Nhược: để lại bóng trắng (white cast).</li>
        <li><strong>Hóa học (Avobenzone, Tinosorb, Uvinul):</strong> Texture mỏng nhẹ hơn, không trắng da. Cần bôi trước 15–20 phút. Một số công thức cũ (Oxybenzone) có thể kích ứng.</li>
      </ul>
      <h2>Quy Tắc Sử Dụng Đúng</h2>
      <ol>
        <li>Lượng: <strong>1/4 thìa cà phê (khoảng 1.5–2ml)</strong> cho mặt và cổ — phần lớn mọi người bôi chỉ bằng 1/4–1/2 lượng cần thiết.</li>
        <li>Thoa lại mỗi <strong>2–3 giờ</strong> khi tiếp xúc nắng. Không "chống nắng một lần cả ngày".</li>
        <li>Bôi <strong>trong nhà cũng cần</strong> nếu ngồi gần cửa sổ (UVA xuyên kính).</li>
      </ol>
    `
  },
  {
    id: "7",
    title: "Vảy Nến Không Lây: Giải Oan Cho Bệnh Nhân",
    tag: "Bệnh Da Mãn Tính",
    nguon: "Hội Da Liễu Việt Nam",
    date: "2026-02-08",
    content: `
      <p>Vảy nến (Psoriasis) là bệnh da tự miễn mãn tính — không có khả năng lây từ người sang người thông qua bất kỳ con đường tiếp xúc nào. Đây là sự thật khoa học được khẳng định bởi mọi tổ chức y khoa thế giới. Việc kỳ thị bệnh nhân vảy nến là hoàn toàn sai về mặt khoa học.</p>
      <h2>Cơ Chế Bệnh Sinh</h2>
      <p>Tế bào lympho T tự tấn công tế bào keratinocyte của chính cơ thể → tăng sinh tế bào da nhanh gấp 5–10 lần bình thường → mảng đỏ có vảy trắng bạc. Nguyên nhân: di truyền (PSORS1 gene) + yếu tố khởi phát môi trường.</p>
      <h2>Yếu Tố Khởi Phát (Trigger)</h2>
      <ul>
        <li>Căng thẳng tâm lý (stress) — nguyên nhân khởi phát #1.</li>
        <li>Nhiễm trùng (đặc biệt Streptococcus — liên quan vảy nến thể giọt).</li>
        <li>Một số thuốc (Lithium, Beta-blocker, NSAID, kháng sốt rét).</li>
        <li>Rượu bia, hút thuốc lá.</li>
        <li>Chấn thương da (Hiệu ứng Koebner).</li>
      </ul>
      <h2>Vảy Nến Và Các Bệnh Đồng Mắc</h2>
      <p>Bệnh nhân vảy nến có nguy cơ cao hơn mắc: <strong>viêm khớp vảy nến</strong> (30%), bệnh tim mạch, đái tháo đường type 2, trầm cảm và bệnh Crohn. Cần tầm soát định kỳ và điều trị toàn diện.</p>
    `
  },
  {
    id: "8",
    title: "Isotretinoin (Roaccutane) Và 10 Điều Cần Biết Trước Khi Dùng",
    tag: "Mụn Trứng Cá",
    nguon: "Hội Da Liễu VN, Cục Quản lý Dược",
    date: "2026-01-30",
    content: `
      <p>Isotretinoin (biệt dược nổi tiếng: Roaccutane) là thuốc trị mụn nặng hiệu quả nhất hiện nay — đến 85% bệnh nhân đạt thuyên giảm hoàn toàn sau 1 liệu trình. Tuy nhiên, đây là thuốc kê đơn bắt buộc cần giám sát y tế chặt chẽ.</p>
      <h2>10 Điều Cần Biết</h2>
      <ol>
        <li><strong>Chỉ định:</strong> Mụn trứng cá nặng (nang bọc, sẹo), mụn kháng kháng sinh ≥ 3 tháng, mụn tái phát nhiều lần.</li>
        <li><strong>Liều dùng:</strong> 0.5–1mg/kg/ngày, tổng liều tích lũy 120–150mg/kg (đạt mới ngừng thuốc).</li>
        <li><strong>Xét nghiệm trước và trong điều trị:</strong> Men gan (ALT/AST), triglyceride, cholesterol — mỗi 4–8 tuần.</li>
        <li><strong>Chống chỉ định tuyệt đối:</strong> Phụ nữ mang thai và có kế hoạch mang thai (gây dị tật thai nhi nghiêm trọng — Category X).</li>
        <li><strong>Tránh thai bắt buộc:</strong> Nữ giới cần dùng 2 phương pháp tránh thai trong và 1 tháng sau điều trị.</li>
        <li><strong>Khô da/môi:</strong> Tác dụng phụ phổ biến nhất — dùng kem dưỡng ẩm không mùi và son dưỡng môi liên tục.</li>
        <li><strong>Nhạy cảm ánh nắng:</strong> Bảo vệ da nghiêm ngặt khi ra nắng, tránh laser/waxing trong và sau 6 tháng khi ngừng thuốc.</li>
        <li><strong>Mụn nặng hơn tuần 2–6:</strong> Bình thường — do thuốc "đẩy mụn ra" trước khi cải thiện.</li>
        <li><strong>Không uống Vitamin A bổ sung</strong> khi đang dùng Isotretinoin — nguy cơ ngộ độc Vitamin A.</li>
        <li><strong>Tái khám định kỳ:</strong> Mỗi 4–8 tuần để đánh giá đáp ứng và xét nghiệm theo dõi.</li>
      </ol>
    `
  },
  {
    id: "9",
    title: "7 Thói Quen Chăm Sóc Da Khiến Mụn Ngày Càng Nặng Hơn",
    tag: "Mụn Trứng Cá",
    nguon: "BV Y Dược Sài Gòn – Da Liễu Chuyên Sâu",
    date: "2026-03-25",
    content: `
      <p>Nhiều người điều trị mụn trong thời gian dài nhưng không thấy cải thiện — thậm chí ngày càng nặng hơn. Lý do thường không phải là thuốc không hiệu quả, mà là những thói quen chăm sóc da hàng ngày đang vô tình phá vỡ quá trình điều trị.</p>

      <h2>1. Thay Đổi Sản Phẩm Liên Tục</h2>
      <p><strong>Hậu quả:</strong> Kích ứng da liên tục, mụn nặng hơn do da chưa thích nghi.</p>
      <p><strong>Lời khuyên:</strong> Da cần 6–8 tuần để thích nghi với sản phẩm mới và thể hiện hiệu quả. Hãy kiên trì đủ thời gian trước khi đánh giá. Nếu sau 2 tháng không thấy cải thiện — đó mới là lúc thay đổi.</p>

      <h2>2. Chăm Sóc Da Khi Chưa Hiểu Rõ Loại Da</h2>
      <p><strong>Hậu quả:</strong> Sản phẩm không phù hợp → kích ứng, bít tắc lỗ chân lông, mụn tái phát.</p>
      <p><strong>Lời khuyên:</strong> Khám với bác sĩ da liễu để xác định loại da (Fitzpatrick I–VI, da dầu/khô/hỗn hợp/nhạy cảm) và nhận phác đồ chăm sóc phù hợp từng người.</p>

      <h2>3. Tự Nặn Mụn Tại Nhà</h2>
      <p><strong>Hậu quả:</strong> Viêm nhiễm lan rộng, để lại thâm sau mụn (PIH) và sẹo rỗ vĩnh viễn.</p>
      <p><strong>Lời khuyên:</strong> Hãy để chuyên viên có tay nghề xử lý đúng cách. Nặn mụn đúng kỹ thuật trong điều kiện vô trùng giúp hạn chế tối đa tổn thương và ngăn thâm sẹo.</p>

      <h2>4. Không Làm Sạch Da Trước Khi Đi Ngủ</h2>
      <p><strong>Hậu quả:</strong> Da tích tụ bã nhờn, bụi bẩn, kem chống nắng → bít tắc lỗ chân lông → nổi mụn đầu đen và mụn viêm.</p>
      <p><strong>Lời khuyên:</strong> Tẩy trang và rửa mặt sạch mỗi tối <em>kể cả khi không makeup</em>. Đây là bước không thể bỏ qua trong bất kỳ phác đồ chăm sóc da nào.</p>

      <h2>5. Tẩy Da Chết Quá Thường Xuyên</h2>
      <p><strong>Hậu quả:</strong> Hàng rào bảo vệ da bị phá vỡ → da yếu, mỏng, nhạy cảm và dễ nổi mụn hơn.</p>
      <p><strong>Lời khuyên:</strong> Chỉ nên tẩy tế bào chết 1–2 lần/tuần. Nếu đang dùng Retinoid hoặc BHA (Salicylic Acid) — cần giảm tần suất hoặc dừng hẳn tẩy da chết vật lý.</p>

      <h2>6. Lối Sống Chưa Khoa Học</h2>
      <p><strong>Hậu quả:</strong> Đồ cay nóng, thức khuya, ăn nhiều đường làm tăng viêm toàn thân và kích thích tuyến bã nhờn.</p>
      <p><strong>Lời khuyên:</strong> Uống đủ 2 lít nước/ngày, ngủ trước 23:00, ăn nhiều rau xanh và hạn chế đường/sữa bò. Nhiều nghiên cứu cho thấy chế độ ăn ít đường huyết giúp giảm mụn đáng kể.</p>

      <h2>7. Thường Xuyên Sờ Tay Lên Mặt</h2>
      <p><strong>Hậu quả:</strong> Bàn tay mang trung bình 200+ chủng vi khuẩn — chạm tay lên mặt là đưa vi khuẩn trực tiếp vào lỗ chân lông.</p>
      <p><strong>Lời khuyên:</strong> Không chạm tay lên mặt khi chưa rửa tay. Rửa tay sạch trước khi thoa mỹ phẩm. Thay vỏ gối 2–3 lần/tuần để giảm vi khuẩn tiếp xúc với da khi ngủ.</p>

      <h2>Bạn Đang Mắc Bao Nhiêu Trong 7 Sai Lầm Này?</h2>
      <p>Để điều trị mụn đúng cách và hiệu quả, đừng tự loay hoay một mình. Bác sĩ Da liễu Chuyên khoa I tại BV Y Dược Sài Gòn sẽ giúp bạn xác định đúng nguyên nhân và xây dựng phác đồ điều trị cá nhân hóa — tránh lãng phí thời gian và tiền bạc vào những sản phẩm không phù hợp.</p>
    `
  },
];

const TAG_COLORS: Record<string, string> = {
  'Mụn Trứng Cá': 'bg-orange-100 text-orange-700',
  'Cảnh Báo Y Khoa': 'bg-red-100 text-red-700',
  'Nám Da': 'bg-purple-100 text-purple-700',
  'Kiến Thức Chăm Sóc Da': 'bg-green-100 text-green-700',
  'Bệnh Da Mãn Tính': 'bg-blue-100 text-blue-700',
};

export async function generateStaticParams() {
  return KIEN_THUC.map((bai) => ({ id: bai.id }));
}

export default async function TinTucDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = KIEN_THUC.find(p => p.id === id);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Không tìm thấy bài viết</h1>
        <Link href="/tin-tuc" className="text-primary hover:underline">&larr; Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/tin-tuc" className="text-primary font-semibold hover:underline inline-flex items-center gap-1 mb-8">
          &larr; Quay lại Kiến thức Y khoa
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${TAG_COLORS[post.tag] || 'bg-gray-100 text-gray-600'}`}>
              {post.tag}
            </span>
            <span className="text-sm text-gray-400">
              {new Date(post.date).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-snug">{post.title}</h1>

          <div className="flex items-center gap-2 mb-8 pb-6 border-b border-gray-100">
            <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <span className="text-sm text-blue-700 font-semibold">Nguồn xác thực: {post.nguon}</span>
          </div>

          <div
            className="prose prose-lg max-w-none text-gray-700 prose-headings:text-gray-900 prose-headings:font-black prose-a:text-primary prose-strong:text-gray-900 prose-li:text-gray-700 prose-table:text-sm"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-10 pt-6 border-t border-gray-100 bg-amber-50 rounded-xl p-4">
            <p className="text-amber-800 text-sm">
              <strong>⚠️ Tuyên bố miễn trừ trách nhiệm:</strong> Bài viết mang tính chất thông tin y khoa tham khảo.
              Không thay thế cho tư vấn, chẩn đoán hoặc chỉ định điều trị của bác sĩ chuyên khoa.
              Hãy thăm khám trực tiếp để được tư vấn cá nhân hóa.
            </p>
          </div>
        </article>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Cần được tư vấn chuyên sâu về tình trạng da của bạn?</p>
          <Link href="/dat-lich" className="bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-blue-900 transition inline-block">
            Đặt Lịch Khám Với Bác Sĩ →
          </Link>
        </div>
      </div>
    </div>
  );
}
