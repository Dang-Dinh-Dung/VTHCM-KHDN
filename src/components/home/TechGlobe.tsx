import {
  BarChart3,
  Bot,
  Building2,
  Cloud,
  type LucideIcon,
  RadioTower,
  ShieldCheck,
} from 'lucide-react'

/**
 * Qua cau chuyen doi so 3D xoay lien tuc + cac giai phap bay quanh quy dao.
 * Thuan CSS 3D transforms (styles trong globals.css) - khong can thu vien,
 * tu tat animation khi prefers-reduced-motion (override toan cuc).
 *
 * Kich thuoc co dinh 26rem (416px) -> ban kinh R = 208px; cac con so
 * size/translate ben duoi tinh tu R theo vi do (cos/sin) nen phai di cung nhau.
 */

// Vi tuyen: [duong kinh vong tron, do lech truc Z]
const PARALLELS: Array<[number, number]> = [
  [416, 0], // xich dao
  [353, 110], // +32 do
  [353, -110],
  [220, 176], // +58 do
  [220, -176],
]

// Kinh tuyen: goc xoay quanh truc Y
const MERIDIANS = [0, 36, 72, 108, 144]

// Diem sang tren be mat: rotateY(kinh do) + translate3d(0, -R*sin(vi do), R*cos(vi do))
const DOTS = [
  'rotateY(0deg) translate3d(0, 0px, 208px)',
  'rotateY(80deg) translate3d(0, -110px, 176px)',
  'rotateY(200deg) translate3d(0, 71px, 195px)',
  'rotateY(300deg) translate3d(0, -159px, 134px)',
]

// Cac giai phap bay quanh quy dao (icon + nhan ngan)
const ORBIT_ITEMS: Array<{ icon: LucideIcon; label: string }> = [
  { icon: Cloud, label: 'Điện toán đám mây' },
  { icon: ShieldCheck, label: 'An toàn thông tin' },
  { icon: Building2, label: 'Quản trị doanh nghiệp' },
  { icon: Bot, label: 'Tự động hóa' },
  { icon: BarChart3, label: 'Phân tích dữ liệu' },
  { icon: RadioTower, label: 'Kết nối IoT' },
]

export function TechGlobe() {
  return (
    <div className="tech-globe-wrap" aria-hidden>
      <div className="tg-backdrop" />
      <div className="tg-halo" />
      <div className="tg-core" />
      <div className="tech-globe-tilt">
        <div className="tech-globe">
          {MERIDIANS.map((a) => (
            <i key={a} className="tg-meridian" style={{ transform: `rotateY(${a}deg)` }} />
          ))}
          {PARALLELS.map(([size, z], i) => (
            <i
              key={i}
              className="tg-parallel"
              style={{
                width: size,
                height: size,
                transform: `translate(-50%, -50%) rotateX(90deg) translateZ(${z}px)`,
              }}
            />
          ))}
          {DOTS.map((t, i) => (
            <i key={i} className="tg-dot" style={{ transform: t }} />
          ))}
        </div>
        <div className="tg-orbit tg-orbit-1">
          <span />
        </div>
        <div className="tg-orbit tg-orbit-2">
          <span />
        </div>
      </div>

      {/* Chu o tam qua cau */}
      <div className="tg-center">
        <span className="tg-center-title">Chuyển đổi số</span>
        <span className="tg-center-sub">Kết nối · Tối ưu · Bứt phá</span>
      </div>

      {/* Vanh icon giai phap bay quanh (icon luon thang dung nho counter-rotation) */}
      <div className="tg-icon-ring">
        {ORBIT_ITEMS.map(({ icon: Icon, label }, i) => {
          const angle = (360 / ORBIT_ITEMS.length) * i
          return (
            <div key={label} className="tg-icon-arm" style={{ transform: `rotate(${angle}deg)` }}>
              <div className="tg-icon">
                <div className="tg-icon-box" style={{ transform: `rotate(${-angle}deg)` }}>
                  <span className="tg-icon-badge">
                    <Icon strokeWidth={1.75} />
                  </span>
                  <span className="tg-icon-label">{label}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
