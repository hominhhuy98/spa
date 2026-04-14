/**
 * Module gửi thông báo Zalo ZNS — dùng chung cho toàn bộ hệ thống
 * Mỗi hàm gửi fail-silent (log lỗi, không throw) để không block luồng chính.
 */

const ZNS_URL = 'https://business.openapi.zalo.me/message/template';

// ── Helpers ──────────────────────────────────────────────────────────────────

export function toZaloPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('0') ? '84' + digits.slice(1) : digits;
}

export function formatDateVN(dateStr: string): string {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function getAccessToken(): string | null {
  return process.env.ZALO_OA_ACCESS_TOKEN || null;
}

async function sendZNS(phone: string, templateId: string | undefined, templateData: Record<string, string>) {
  const accessToken = getAccessToken();
  if (!accessToken || !templateId) {
    console.log('[Zalo ZNS] Skipped — template chưa cấu hình. Data:', JSON.stringify({ phone, templateData }));
    return;
  }

  try {
    const res = await fetch(ZNS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', access_token: accessToken },
      body: JSON.stringify({
        phone: toZaloPhone(phone),
        template_id: Number(templateId),
        template_data: templateData,
      }),
    });
    const json = await res.json();
    if (json.error !== 0) {
      console.error(`[Zalo ZNS] Error ${json.error}: ${json.message}`);
    } else {
      console.log(`[Zalo ZNS] Sent to ${phone} — template ${templateId}`);
    }
  } catch (err) {
    console.error('[Zalo ZNS] Network error:', err);
  }
}

// ── Thông báo hoàn thành lượt khám ──────────────────────────────────────────

interface CompleteData {
  customerName: string;
  service: string;
  date: string;
  diagnosis?: string;
  prescriptionSummary?: string;
  treatmentPlanSummary?: string;
  followUpDate?: string;
  doctorName?: string;
  portalLink?: string;
}

export async function sendAppointmentComplete(phone: string, data: CompleteData) {
  const templateId = process.env.ZALO_TEMPLATE_COMPLETE;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  await sendZNS(phone, templateId, {
    ten_khach_hang:   data.customerName,
    dich_vu:          data.service,
    ngay_kham:        formatDateVN(data.date),
    chan_doan:        data.diagnosis || 'Chưa cập nhật',
    don_thuoc:        data.prescriptionSummary || 'Không có',
    phac_do:          data.treatmentPlanSummary || 'Không có',
    ngay_tai_kham:    data.followUpDate ? formatDateVN(data.followUpDate) : 'Bác sĩ sẽ tư vấn',
    bac_si:           data.doctorName || 'YDSG',
    link_portal:      data.portalLink || `${siteUrl}/portal`,
    hotline:          '028 6285 2727',
  });
}

// ── Thông báo kê đơn thuốc ──────────────────────────────────────────────────

interface PrescriptionData {
  customerName: string;
  service: string;
  diagnosis?: string;
  medications: string; // "Tretinoin 0.025% — 1 lần/ngày; Doxycycline 100mg — 2 lần/ngày"
  notes?: string;
  doctorName?: string;
}

export async function sendPrescriptionNotify(phone: string, data: PrescriptionData) {
  const templateId = process.env.ZALO_TEMPLATE_PRESCRIPTION;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  await sendZNS(phone, templateId, {
    ten_khach_hang:   data.customerName,
    dich_vu:          data.service,
    chan_doan:        data.diagnosis || 'Chưa cập nhật',
    danh_sach_thuoc:  data.medications,
    ghi_chu:          data.notes || '',
    bac_si:           data.doctorName || 'YDSG',
    link_portal:      `${siteUrl}/portal`,
  });
}

// ── Thông báo tạo phác đồ điều trị ──────────────────────────────────────────

interface TreatmentPlanData {
  customerName: string;
  diagnosis?: string;
  planDetail: string;
  sessionsTotal: number;
  nextSessionDate?: string;
  doctorName?: string;
}

export async function sendTreatmentPlanNotify(phone: string, data: TreatmentPlanData) {
  const templateId = process.env.ZALO_TEMPLATE_TREATMENT;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  await sendZNS(phone, templateId, {
    ten_khach_hang:    data.customerName,
    chan_doan:         data.diagnosis || 'Chưa cập nhật',
    phac_do:           data.planDetail,
    so_buoi:           String(data.sessionsTotal),
    ngay_tiep_theo:    data.nextSessionDate ? formatDateVN(data.nextSessionDate) : 'Sẽ thông báo sau',
    bac_si:            data.doctorName || 'YDSG',
    link_portal:       `${siteUrl}/portal`,
  });
}
