# Đồng bộ lead sang Google Sheet (Apps Script webhook)

Mỗi khi có khách đặt lịch mới, hệ thống sẽ tự thêm 1 dòng vào Google Sheet.
Cách này nhẹ, không cần Google API key / service account.

## 1. Tạo Google Sheet
- Tạo một Google Sheet mới (vd tên "Lead KHDN Viettel").
- Dòng 1 để trống — script sẽ tự tạo tiêu đề cột lần chạy đầu.

## 2. Thêm Apps Script
- Trong Sheet: menu **Extensions → Apps Script**.
- Xóa code mẫu, dán đoạn dưới. Đổi `SECRET` thành chuỗi bí mật của bạn
  (phải khớp biến `GSHEET_WEBHOOK_SECRET` đặt trong môi trường app).

```javascript
const SECRET = 'DOI_THANH_CHUOI_BI_MAT_CUA_BAN'
const HEADERS = ['Thời gian', 'Họ tên', 'Doanh nghiệp', 'SĐT', 'Email', 'Loại', 'Quy mô', 'Nội dung', 'Ngày mong muốn', 'Khung giờ', 'Nguồn']

// Mo URL bang trinh duyet (GET) -> chi de kiem tra webhook con song.
function doGet() {
  return ContentService.createTextOutput('Webhook OK - dang hoat dong (chi nhan POST tu app).')
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents)
    if (SECRET && body.secret !== SECRET) {
      return ContentService.createTextOutput('unauthorized')
    }
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS)
    sheet.appendRow([
      new Date(),
      body.name || '',
      body.company || '',
      body.phone || '',
      body.email || '',
      body.type || '',
      body.companySize || '',
      body.message || '',
      body.preferredDate || '',
      body.timeSlot || '',
      body.source || '',
    ])
    return ContentService.createTextOutput('ok')
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err)
  }
}
```

## 3. Deploy thành Web App
- Trong Apps Script: **Deploy → New deployment**.
- **Select type → Web app**.
- **Execute as:** Me (tài khoản của bạn).
- **Who has access:** **Anyone** (để app POST vào được — bảo mật bằng `SECRET`).
- Bấm **Deploy** → cho phép quyền → copy **Web app URL** (dạng `https://script.google.com/macros/s/..../exec`).

## 4. Cấu hình app
Đặt 2 biến môi trường (Vercel Environment Variables và/hoặc `.env` trên server):
```
GSHEET_WEBHOOK_URL=<Web app URL vừa copy>
GSHEET_WEBHOOK_SECRET=<đúng chuỗi SECRET trong script>
```
→ Redeploy. Từ giờ mỗi lead mới sẽ tự xuất hiện trong Sheet.

## Lưu ý
- Để trống `GSHEET_WEBHOOK_URL` => tính năng tắt (không ảnh hưởng gì).
- Đồng bộ chạy nền: nếu Google lỗi/chậm, form khách vẫn gửi bình thường (chỉ ghi log lỗi).
- Muốn đổi cột: sửa `HEADERS` + mảng `appendRow` trong script cho khớp.
