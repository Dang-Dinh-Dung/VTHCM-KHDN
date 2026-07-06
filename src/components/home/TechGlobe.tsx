/**
 * Qua cau cong nghe 3D xoay lien tuc (wireframe globe) cho hero.
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

export function TechGlobe() {
  return (
    <div className="tech-globe-wrap" aria-hidden>
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
    </div>
  )
}
