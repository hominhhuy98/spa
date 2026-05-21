# Cloud Armor + Load Balancer — Hướng dẫn kích hoạt

## Hạ tầng đã tạo (sẵn sàng, chờ đổi DNS)

| Resource | Tên | Ghi chú |
|----------|-----|---------|
| Static IP | `ydsg-lb-ip` | **8.233.115.140** |
| Serverless NEG | `ydsg-neg` | → Cloud Run `ydsg-web` (asia-southeast1) |
| Backend Service | `ydsg-backend` | gắn Cloud Armor `ydsg-armor` |
| Security Policy | `ydsg-armor` | rate limit + OWASP + DDoS L7 |
| SSL Cert | `ydsg-cert` | managed, 2 domain (PROVISIONING) |
| URL Map | `ydsg-urlmap` + `ydsg-http-redirect` | HTTPS + redirect HTTP→HTTPS |
| HTTPS Proxy | `ydsg-https-proxy` | port 443 |
| HTTP Proxy | `ydsg-http-proxy` | port 80 (redirect) |

## Cloud Armor rules
- **Rule 900**: Chống SQL injection (`sqli-v33-stable`) → deny 403
- **Rule 901**: Chống XSS (`xss-v33-stable`) → deny 403
- **Rule 1000**: Rate limit 100 req/phút/IP, ban 5 phút → deny 429
- **Adaptive Protection**: chống DDoS Layer 7 (tự học traffic bất thường)

## Kích hoạt (khi sẵn sàng) — đổi DNS trên Mắt Bão

1. Vào **Mắt Bão → dalieuyduocsaigon.com → Bản ghi DNS**
2. **Xóa** 4 record A cũ (trỏ `216.239.32/34/36/38.21`)
3. **Thêm** record A: Host `@` → `8.233.115.140`
4. **Thêm/sửa** record A: Host `www` → `8.233.115.140`
5. Đợi DNS propagate → SSL cert tự chuyển ACTIVE (15-60 phút)

## Sau khi DNS trỏ về LB — xóa domain mapping cũ
```bash
gcloud beta run domain-mappings delete --domain=dalieuyduocsaigon.com --region=asia-southeast1
```

## Kiểm tra SSL cert
```bash
gcloud compute ssl-certificates describe ydsg-cert --global --format="value(managed.status)"
# PROVISIONING → ACTIVE (khi DNS đã trỏ đúng)
```

## Lưu ý
- Chi phí LB: ~$18-25/tháng + traffic.
- App đã có rate-limit tầng ứng dụng + reCAPTCHA → Cloud Armor là lớp phòng thủ bổ sung (network/L7).
- Khi DNS đã trỏ về LB, traffic đi: User → Cloud Armor (WAF) → LB → Cloud Run.
