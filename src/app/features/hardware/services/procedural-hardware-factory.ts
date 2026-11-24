import type * as ThreeNamespace from 'three';

type THREE = typeof ThreeNamespace;

export interface BuiltHardwareAsset {
  readonly root: ThreeNamespace.Group;
  readonly disposables: {
    readonly geometries: ThreeNamespace.BufferGeometry[];
    readonly materials: ThreeNamespace.Material[];
    readonly textures: ThreeNamespace.Texture[];
  };
}

/**
 * Helper that tracks every created geometry, material, and texture for deterministic GPU disposal.
 */
class AssetBuilder {
  readonly geometries: ThreeNamespace.BufferGeometry[] = [];
  readonly materials: ThreeNamespace.Material[] = [];
  readonly textures: ThreeNamespace.Texture[] = [];

  constructor(private readonly T: THREE) {}

  geo<G extends ThreeNamespace.BufferGeometry>(g: G): G {
    this.geometries.push(g);
    return g;
  }

  mat<M extends ThreeNamespace.Material>(m: M): M {
    this.materials.push(m);
    return m;
  }

  tex<X extends ThreeNamespace.Texture>(t: X): X {
    this.textures.push(t);
    return t;
  }

  mesh(
    geometry: ThreeNamespace.BufferGeometry,
    material: ThreeNamespace.Material,
    castShadow = true,
    receiveShadow = true
  ): ThreeNamespace.Mesh {
    const m = new this.T.Mesh(geometry, material);
    m.castShadow = castShadow;
    m.receiveShadow = receiveShadow;
    return m;
  }

  roundedRectShape(w: number, h: number, r: number): ThreeNamespace.Shape {
    const s = new this.T.Shape();
    const hw = w / 2;
    const hh = h / 2;
    const cr = Math.min(r, hw, hh);
    s.moveTo(-hw + cr, -hh);
    s.lineTo(hw - cr, -hh);
    s.quadraticCurveTo(hw, -hh, hw, -hh + cr);
    s.lineTo(hw, hh - cr);
    s.quadraticCurveTo(hw, hh, hw - cr, hh);
    s.lineTo(-hw + cr, hh);
    s.quadraticCurveTo(-hw, hh, -hw, hh - cr);
    s.lineTo(-hw, -hh + cr);
    s.quadraticCurveTo(-hw, -hh, -hw + cr, -hh);
    return s;
  }

  extrudeRoundedBox(
    w: number,
    h: number,
    depth: number,
    radius: number,
    bevel = 0.008
  ): ThreeNamespace.ExtrudeGeometry {
    const shape = this.roundedRectShape(w, h, radius);
    const g = new this.T.ExtrudeGeometry(shape, {
      depth: Math.max(0.005, depth - bevel * 2),
      bevelEnabled: bevel > 0,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 3,
      curveSegments: 12,
    });
    g.center();
    return this.geo(g);
  }

  canvasTexture(
    width: number,
    height: number,
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
  ): ThreeNamespace.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      draw(ctx, width, height);
    }
    const texture = new this.T.CanvasTexture(canvas);
    texture.colorSpace = this.T.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;
    return this.tex(texture);
  }
}

function drawNileTronixLogo(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  darkText = true
): void {
  ctx.save();
  ctx.translate(cx, cy);

  // Stylized NileTronix N emblem (teal left/bottom, brand red top/right)
  const iconSize = 26 * scale;
  const x0 = -96 * scale;
  const y0 = -iconSize / 2;

  ctx.lineWidth = 4.2 * scale;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Teal N-left stroke
  ctx.strokeStyle = '#0b7897';
  ctx.beginPath();
  ctx.moveTo(x0, y0 + iconSize);
  ctx.lineTo(x0, y0 + 2 * scale);
  ctx.lineTo(x0 + iconSize * 0.72, y0 + iconSize - 2 * scale);
  ctx.stroke();

  // Brand Red N-right stroke
  ctx.strokeStyle = '#ed1b2f';
  ctx.beginPath();
  ctx.moveTo(x0 + iconSize * 0.28, y0 + 2 * scale);
  ctx.lineTo(x0 + iconSize, y0 + iconSize - 2 * scale);
  ctx.lineTo(x0 + iconSize, y0);
  ctx.stroke();

  // Wordmark
  ctx.fillStyle = darkText ? '#0b688a' : '#ffffff';
  ctx.font = `800 ${Math.round(23 * scale)}px "Space Grotesk", "Segoe UI", sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText('NILETRONIX', x0 + iconSize + 10 * scale, 1 * scale);
  ctx.restore();
}

function createKioskScreenTexture(
  b: AssetBuilder,
  portrait = false
): ThreeNamespace.CanvasTexture {
  const w = portrait ? 512 : 640;
  const h = portrait ? 768 : 480;
  return b.canvasTexture(w, h, (ctx, cw, ch) => {
    const grad = ctx.createLinearGradient(0, 0, cw, ch);
    grad.addColorStop(0, '#f8fbfe');
    grad.addColorStop(1, '#e7f1f7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);

    // Subtle geometric wave accent matching NileTronix brand
    ctx.fillStyle = 'rgba(0, 182, 214, 0.08)';
    ctx.beginPath();
    ctx.moveTo(0, ch * 0.78);
    ctx.quadraticCurveTo(cw * 0.5, ch * 0.66, cw, ch * 0.84);
    ctx.lineTo(cw, ch);
    ctx.lineTo(0, ch);
    ctx.closePath();
    ctx.fill();

    // Logo
    drawNileTronixLogo(ctx, cw * 0.5, ch * (portrait ? 0.28 : 0.34), portrait ? 1.0 : 1.25, true);

    // Language buttons (English / عربي)
    const btnW = portrait ? cw * 0.62 : cw * 0.34;
    const btnH = portrait ? 68 : 58;
    const radius = 10;

    const drawBtn = (x: number, y: number, label: string, primary: boolean) => {
      ctx.fillStyle = primary ? '#0d6ca8' : '#0b7897';
      ctx.beginPath();
      ctx.roundRect(x, y, btnW, btnH, radius);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `700 ${portrait ? 26 : 22}px "Cairo", "Outfit", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x + btnW / 2, y + btnH / 2 + 1);
    };

    if (portrait) {
      const bx = (cw - btnW) / 2;
      drawBtn(bx, ch * 0.5, 'English', true);
      drawBtn(bx, ch * 0.63, 'عربي', false);
    } else {
      const gap = 28;
      const startX = (cw - (btnW * 2 + gap)) / 2;
      const by = ch * 0.58;
      drawBtn(startX, by, 'English', true);
      drawBtn(startX + btnW + gap, by, 'عربي', false);
    }
  });
}

function createKickplateTexture(
  b: AssetBuilder,
  darkBg = false
): ThreeNamespace.CanvasTexture {
  return b.canvasTexture(512, 96, (ctx, w, h) => {
    ctx.fillStyle = darkBg ? '#23282d' : '#eef2f5';
    ctx.fillRect(0, 0, w, h);
    drawNileTronixLogo(ctx, w * 0.52, h * 0.52, 1.05, !darkBg);
  });
}

function createFanGrilleTexture(b: AssetBuilder): ThreeNamespace.CanvasTexture {
  return b.canvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#2c333a';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    ctx.fillStyle = '#12161a';
    ctx.beginPath();
    ctx.arc(cx, cy, 108, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#7c8791';
    ctx.lineWidth = 4;
    for (let r = 24; r <= 104; r += 20) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let a = 0; a < 4; a++) {
      const rad = (a * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(cx - Math.cos(rad) * 106, cy - Math.sin(rad) * 106);
      ctx.lineTo(cx + Math.cos(rad) * 106, cy + Math.sin(rad) * 106);
      ctx.stroke();
    }
  });
}

function createLcdTexture(
  b: AssetBuilder,
  variant: 'ceiling-dual' | 'clinic' | 'counter-stand' | 'wall-signage'
): ThreeNamespace.CanvasTexture {
  return b.canvasTexture(768, 480, (ctx, w, h) => {
    if (variant === 'ceiling-dual') {
      ctx.fillStyle = '#0e5b9c';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(16, 16, w - 32, h - 32);

      // Top title bar
      ctx.fillStyle = '#0c4e8a';
      ctx.font = '700 40px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('تسجيل و تصوير  |  شباك', w / 2, 76);

      // Green tile (2)
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.roundRect(42, 130, 324, 290, 14);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 156px "Space Grotesk", sans-serif';
      ctx.fillText('2', 204, 286);

      // Blue tile (3)
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(402, 130, 324, 290, 14);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillText('3', 564, 286);
    } else if (variant === 'clinic') {
      ctx.fillStyle = '#0d8a55';
      ctx.fillRect(0, 0, w, h);

      // Left hospital brand badge
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(170, 175, 76, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0d8a55';
      ctx.font = '800 30px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('CLINIC', 170, 178);

      // Right white clinic number card
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(320, 42, 405, 195, 14);
      ctx.fill();
      ctx.fillStyle = '#082f43';
      ctx.font = '700 28px "Cairo", sans-serif';
      ctx.fillText('رقم العيادة', 522, 86);
      ctx.font = '800 96px "Space Grotesk", sans-serif';
      ctx.fillText('01', 522, 168);

      // Lower visit card
      ctx.fillStyle = '#0a6f44';
      ctx.beginPath();
      ctx.roundRect(320, 260, 405, 176, 14);
      ctx.fill();
      ctx.fillStyle = '#d1fae5';
      ctx.font = '700 26px "Cairo", sans-serif';
      ctx.fillText('رقم الزيارة', 522, 310);
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 68px "Space Grotesk", sans-serif';
      ctx.fillText('A018', 522, 382);
    } else if (variant === 'counter-stand') {
      ctx.fillStyle = '#f3f7fa';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#082f43';
      ctx.font = '700 36px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Surgical Operations', w * 0.62, 86);

      ctx.fillStyle = '#0b7897';
      ctx.beginPath();
      ctx.roundRect(42, 140, 210, 265, 14);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 132px "Space Grotesk", sans-serif';
      ctx.fillText('4', 147, 282);

      ctx.fillStyle = '#082f43';
      ctx.font = '800 124px "Space Grotesk", sans-serif';
      ctx.fillText('S-5', 510, 282);
    } else {
      // wall-signage
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#eef5fa');
      grad.addColorStop(1, '#dce9f2');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(48, 44, w - 96, h - 88, 16);
      ctx.fill();

      drawNileTronixLogo(ctx, w * 0.5, h * 0.36, 1.6, true);
      ctx.fillStyle = '#082f43';
      ctx.font = '700 34px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('منظومة إدارة قوائم الانتظار الذكية', w / 2, h * 0.62);
      ctx.fillStyle = '#0b7897';
      ctx.font = '600 22px "Outfit", sans-serif';
      ctx.fillText('Q-Control Digital Hall Signage', w / 2, h * 0.74);
    }
  });
}

function createLedTexture(
  b: AssetBuilder,
  variant: 'main-hanging' | 'alpha' | 'four-digit'
): ThreeNamespace.CanvasTexture {
  const w = variant === 'main-hanging' ? 1024 : 768;
  const h = variant === 'main-hanging' ? 320 : 320;
  return b.canvasTexture(w, h, (ctx, cw, ch) => {
    ctx.fillStyle = '#0b0e11';
    ctx.fillRect(0, 0, cw, ch);

    // Subtle dark LED dot grid background
    ctx.fillStyle = 'rgba(255, 45, 45, 0.05)';
    for (let x = 24; x < cw - 20; x += 14) {
      for (let y = 24; y < ch - 20; y += 14) {
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Q-Control mini emblem on left
    ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
    ctx.font = '700 20px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Q-CONTROL', 32, ch - 38);

    // Glowing red LED digits
    ctx.shadowColor = '#ff1e2d';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#ff2a38';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (variant === 'main-hanging') {
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#f1f5f9';
      ctx.font = '700 38px "Cairo", sans-serif';
      ctx.fillText('رقم الشباك', cw * 0.3, 64);
      ctx.fillText('رقم العميل', cw * 0.72, 64);

      ctx.shadowColor = '#ff1e2d';
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#ff2a38';
      ctx.font = '800 132px "Space Grotesk", monospace';
      ctx.fillText('14', cw * 0.3, 200);
      ctx.fillText('A029', cw * 0.72, 200);
    } else if (variant === 'alpha') {
      ctx.font = '800 168px "Space Grotesk", monospace';
      ctx.fillText('A401', cw * 0.56, ch * 0.52);
    } else {
      ctx.font = '800 176px "Space Grotesk", monospace';
      ctx.fillText('1234', cw * 0.56, ch * 0.52);
    }
  });
}

function createQctLcdTexture(b: AssetBuilder): ThreeNamespace.CanvasTexture {
  return b.canvasTexture(512, 192, (ctx, w, h) => {
    ctx.fillStyle = '#1148b8';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, w - 16, h - 16);

    ctx.fillStyle = '#dbeafe';
    ctx.font = '700 36px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Ticket      2', 36, 66);
    ctx.fillText('04   00:26:57', 36, 132);
  });
}

function createQctBrandStripTexture(b: AssetBuilder): ThreeNamespace.CanvasTexture {
  return b.canvasTexture(512, 84, (ctx, w, h) => {
    ctx.fillStyle = '#1d2227';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#e5ebf0';
    ctx.fillRect(0, h - 22, w, 16);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 26px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Q-CONTROL', 24, 34);
    ctx.textAlign = 'right';
    ctx.fillText('QCT-101', w - 24, 34);
  });
}

function createKeyLabelTexture(
  b: AssetBuilder,
  label: string,
  bg: string,
  fg: string
): ThreeNamespace.CanvasTexture {
  return b.canvasTexture(128, 96, (ctx, w, h) => {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, w - 12, h - 12);
    ctx.fillStyle = fg;
    ctx.font = `800 ${label.length > 3 ? 24 : 38}px "Space Grotesk", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, w / 2, h / 2 + 2);
  });
}

/**
 * 1. Flagship Proof of Concept: Q-KIOSK AIO (All-in-One Curved Floor Kiosk)
 * Matches originals/kiosks/curved-floor-kiosk.png:
 * - Arched satin-silver front fascia with ergonomic upper tilt
 * - Dark matte charcoal sculpted upper shield bezel
 * - Recessed 4:3 touch screen with NileTronix bilingual UI
 * - Front recessed thermal printer slot
 * - Bottom angled kick-plate with NileTronix logo
 * - Dark charcoal steel rear chassis + lower equipment housing with side fan grille
 */
function buildKioskCurvedAio(T: THREE, b: AssetBuilder): ThreeNamespace.Group {
  const group = new T.Group();
  group.name = 'Q-KIOSK-AIO';

  const silverMat = b.mat(
    new T.MeshStandardMaterial({
      color: 0xe6ebef,
      roughness: 0.32,
      metalness: 0.28,
    })
  );
  const darkChassisMat = b.mat(
    new T.MeshStandardMaterial({
      color: 0x384048,
      roughness: 0.5,
      metalness: 0.35,
    })
  );
  const darkBezelMat = b.mat(
    new T.MeshStandardMaterial({
      color: 0x22272c,
      roughness: 0.58,
      metalness: 0.12,
    })
  );
  const slotBlackMat = b.mat(
    new T.MeshStandardMaterial({
      color: 0x0e1216,
      roughness: 0.75,
      metalness: 0.1,
    })
  );

  // Lower main body (slight backward rake like the reference photo)
  const lowerBody = b.mesh(b.extrudeRoundedBox(0.54, 0.78, 0.24, 0.02, 0.008), darkChassisMat);
  lowerBody.position.set(0, 0.42, -0.02);
  lowerBody.rotation.x = -0.04;
  group.add(lowerBody);

  // Lower front silver fascia panel
  const lowerFascia = b.mesh(b.extrudeRoundedBox(0.55, 0.77, 0.028, 0.015, 0.006), silverMat);
  lowerFascia.position.set(0, 0.43, 0.105);
  lowerFascia.rotation.x = -0.04;
  group.add(lowerFascia);

  // Thermal printer slot recessed in lower fascia
  const printerSlotFrame = b.mesh(b.geo(new T.BoxGeometry(0.13, 0.028, 0.024)), slotBlackMat);
  printerSlotFrame.position.set(0, 0.66, 0.118);
  printerSlotFrame.rotation.x = -0.04;
  group.add(printerSlotFrame);

  // Upper angled console (ergonomic backward tilt)
  const upperGroup = new T.Group();
  upperGroup.position.set(0, 1.11, 0.02);
  upperGroup.rotation.x = -0.15;

  // Arched silver outer frame for upper console
  const archShape = new T.Shape();
  archShape.moveTo(-0.275, -0.32);
  archShape.lineTo(0.275, -0.32);
  archShape.lineTo(0.275, 0.28);
  archShape.quadraticCurveTo(0, 0.36, -0.275, 0.28);
  archShape.closePath();

  const upperRearGeo = b.geo(
    new T.ExtrudeGeometry(archShape, {
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.008,
      bevelSegments: 3,
    })
  );
  upperRearGeo.center();
  const upperChassis = b.mesh(upperRearGeo, darkChassisMat);
  upperChassis.position.set(0, 0, -0.02);
  upperGroup.add(upperChassis);

  const upperSilverGeo = b.geo(
    new T.ExtrudeGeometry(archShape, {
      depth: 0.022,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.006,
      bevelSegments: 3,
    })
  );
  upperSilverGeo.center();
  const upperFascia = b.mesh(upperSilverGeo, silverMat);
  upperFascia.position.set(0, 0, 0.082);
  upperGroup.add(upperFascia);

  // Sculpted dark charcoal shield bezel (tapered at bottom like reference)
  const shield = new T.Shape();
  shield.moveTo(-0.19, -0.27);
  shield.quadraticCurveTo(0, -0.3, 0.19, -0.27);
  shield.lineTo(0.235, -0.08);
  shield.lineTo(0.235, 0.24);
  shield.quadraticCurveTo(0, 0.31, -0.235, 0.24);
  shield.lineTo(-0.235, -0.08);
  shield.closePath();

  const shieldGeo = b.geo(
    new T.ExtrudeGeometry(shield, {
      depth: 0.014,
      bevelEnabled: true,
      bevelThickness: 0.004,
      bevelSize: 0.004,
      bevelSegments: 2,
    })
  );
  shieldGeo.center();
  const shieldMesh = b.mesh(shieldGeo, darkBezelMat);
  shieldMesh.position.set(0, 0.01, 0.098);
  upperGroup.add(shieldMesh);

  // Recessed touchscreen glass with NileTronix UI
  const screenTex = createKioskScreenTexture(b, false);
  const screenMat = b.mat(
    new T.MeshPhysicalMaterial({
      map: screenTex,
      roughness: 0.12,
      metalness: 0.02,
      clearcoat: 0.85,
      clearcoatRoughness: 0.1,
      emissive: new T.Color(0xffffff),
      emissiveMap: screenTex,
      emissiveIntensity: 0.28,
    })
  );
  const screenMesh = b.mesh(b.geo(new T.PlaneGeometry(0.35, 0.265)), screenMat, false, false);
  screenMesh.position.set(0, 0.06, 0.111);
  upperGroup.add(screenMesh);

  group.add(upperGroup);

  // Rear lower equipment extension box + side ventilation fan grille
  const rearBox = b.mesh(b.extrudeRoundedBox(0.5, 0.42, 0.16, 0.015, 0.006), darkChassisMat);
  rearBox.position.set(0, 0.22, -0.17);
  group.add(rearBox);

  const fanTex = createFanGrilleTexture(b);
  const fanMat = b.mat(
    new T.MeshStandardMaterial({
      map: fanTex,
      roughness: 0.45,
      metalness: 0.6,
    })
  );
  const fanMesh = b.mesh(b.geo(new T.CircleGeometry(0.068, 24)), fanMat, false, false);
  fanMesh.position.set(0.252, 0.21, -0.16);
  fanMesh.rotation.y = Math.PI / 2;
  group.add(fanMesh);

  // Angled bottom kickplate with NileTronix logo
  const kickplateTex = createKickplateTexture(b, false);
  const kickplateMat = b.mat(
    new T.MeshStandardMaterial({
      map: kickplateTex,
      roughness: 0.35,
      metalness: 0.2,
    })
  );
  const kickplate = b.mesh(b.geo(new T.BoxGeometry(0.55, 0.082, 0.03)), kickplateMat);
  kickplate.position.set(0, 0.042, 0.132);
  kickplate.rotation.x = -0.22;
  group.add(kickplate);

  // Heavy base plate under chassis
  const basePlate = b.mesh(b.extrudeRoundedBox(0.56, 0.024, 0.42, 0.015, 0.004), slotBlackMat);
  basePlate.position.set(0, 0.012, -0.03);
  group.add(basePlate);

  return group;
}

/**
 * 2. Q-KIOSK SLIM (Slim Pedestal Kiosk Terminal — Dark Frame)
 */
function buildKioskSlimDark(T: THREE, b: AssetBuilder): ThreeNamespace.Group {
  const group = new T.Group();
  group.name = 'Q-KIOSK-SLIM';

  const matteBlack = b.mat(
    new T.MeshStandardMaterial({ color: 0x22262b, roughness: 0.48, metalness: 0.25 })
  );
  const brushedSteel = b.mat(
    new T.MeshStandardMaterial({ color: 0x8f9aa3, roughness: 0.32, metalness: 0.72 })
  );
  const darkBaseMat = b.mat(
    new T.MeshStandardMaterial({ color: 0x1b1f23, roughness: 0.55, metalness: 0.35 })
  );

  // Weighted floor base plate
  const base = b.mesh(b.extrudeRoundedBox(0.46, 0.03, 0.38, 0.025, 0.005), darkBaseMat);
  base.position.set(0, 0.015, 0);
  group.add(base);

  // Twin vertical steel columns + dark central spine
  for (const xPos of [-0.145, 0.145]) {
    const col = b.mesh(b.geo(new T.CylinderGeometry(0.024, 0.024, 0.58, 20)), brushedSteel);
    col.position.set(xPos, 0.31, 0);
    group.add(col);
  }
  const centerSpine = b.mesh(b.geo(new T.BoxGeometry(0.18, 0.56, 0.06)), matteBlack);
  centerSpine.position.set(0, 0.31, -0.01);
  group.add(centerSpine);

  // Upper dark slim monolith head
  const head = b.mesh(b.extrudeRoundedBox(0.44, 0.88, 0.11, 0.032, 0.008), matteBlack);
  head.position.set(0, 1.02, 0.01);
  group.add(head);

  // Portrait touch display
  const screenTex = createKioskScreenTexture(b, true);
  const screenMat = b.mat(
    new T.MeshPhysicalMaterial({
      map: screenTex,
      roughness: 0.12,
      clearcoat: 0.85,
      emissive: new T.Color(0xffffff),
      emissiveMap: screenTex,
      emissiveIntensity: 0.26,
    })
  );
  const screen = b.mesh(b.geo(new T.PlaneGeometry(0.28, 0.43)), screenMat, false, false);
  screen.position.set(0, 1.15, 0.067);
  group.add(screen);

  // Ticket dispenser recess
  const dispenser = b.mesh(b.geo(new T.CylinderGeometry(0.032, 0.032, 0.016, 20)), darkBaseMat);
  dispenser.rotation.x = Math.PI / 2;
  dispenser.position.set(0.075, 0.81, 0.062);
  group.add(dispenser);

  // NileTronix badge plate on lower dark fascia
  const badgeTex = createKickplateTexture(b, true);
  const badgeMat = b.mat(new T.MeshStandardMaterial({ map: badgeTex, roughness: 0.45 }));
  const badge = b.mesh(b.geo(new T.PlaneGeometry(0.32, 0.06)), badgeMat, false, false);
  badge.position.set(0, 0.69, 0.067);
  group.add(badge);

  return group;
}

/**
 * 3. Q-KIOSK PRO (Angled Touch Ticketing Kiosk)
 */
function buildKioskAngledPro(T: THREE, b: AssetBuilder): ThreeNamespace.Group {
  const group = new T.Group();
  group.name = 'Q-KIOSK-PRO';

  const lightGrey = b.mat(
    new T.MeshStandardMaterial({ color: 0xe3e8ec, roughness: 0.36, metalness: 0.2 })
  );
  const darkBezel = b.mat(
    new T.MeshStandardMaterial({ color: 0x1b2025, roughness: 0.4, metalness: 0.25 })
  );
  const paperWhite = b.mat(new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }));

  // Heavy dark floor base
  const base = b.mesh(b.extrudeRoundedBox(0.46, 0.034, 0.44, 0.016, 0.005), darkBezel);
  base.position.set(0, 0.017, 0);
  group.add(base);

  // Vertical pedestal tower
  const tower = b.mesh(b.extrudeRoundedBox(0.4, 0.96, 0.24, 0.016, 0.008), lightGrey);
  tower.position.set(0, 0.51, -0.02);
  group.add(tower);

  // Front ticket slot + paper lip
  const slot = b.mesh(b.geo(new T.BoxGeometry(0.11, 0.032, 0.02)), darkBezel);
  slot.position.set(0, 0.79, 0.102);
  group.add(slot);

  const ticket = b.mesh(b.geo(new T.BoxGeometry(0.062, 0.068, 0.003)), paperWhite);
  ticket.position.set(0, 0.76, 0.112);
  ticket.rotation.x = 0.22;
  group.add(ticket);

  // Tilted top touchscreen head
  const headGroup = new T.Group();
  headGroup.position.set(0, 1.18, 0.01);
  headGroup.rotation.x = -0.34;

  const headHousing = b.mesh(b.extrudeRoundedBox(0.5, 0.4, 0.08, 0.022, 0.008), darkBezel);
  headGroup.add(headHousing);

  const screenTex = createKioskScreenTexture(b, false);
  const screenMat = b.mat(
    new T.MeshPhysicalMaterial({
      map: screenTex,
      roughness: 0.12,
      clearcoat: 0.85,
      emissive: new T.Color(0xffffff),
      emissiveMap: screenTex,
      emissiveIntensity: 0.28,
    })
  );
  const screen = b.mesh(b.geo(new T.PlaneGeometry(0.42, 0.31)), screenMat, false, false);
  screen.position.set(0, 0, 0.042);
  headGroup.add(screen);

  group.add(headGroup);
  return group;
}

/**
 * 4. Q-KIOSK WIDE (Widescreen Multilingual Kiosk — White Sculpted Stand)
 */
function buildKioskWideWhite(T: THREE, b: AssetBuilder): ThreeNamespace.Group {
  const group = new T.Group();
  group.name = 'Q-KIOSK-WIDE';

  const glossWhite = b.mat(
    new T.MeshPhysicalMaterial({
      color: 0xf4f7f9,
      roughness: 0.24,
      metalness: 0.08,
      clearcoat: 0.55,
      clearcoatRoughness: 0.2,
    })
  );
  const darkSlot = b.mat(new T.MeshStandardMaterial({ color: 0x161b20, roughness: 0.7 }));

  // Sculpted flared base
  const base = b.mesh(b.extrudeRoundedBox(0.58, 0.04, 0.44, 0.08, 0.008), glossWhite);
  base.position.set(0, 0.02, 0);
  group.add(base);

  // Tapered hourglass column
  const stand = b.mesh(b.extrudeRoundedBox(0.38, 0.88, 0.22, 0.04, 0.01), glossWhite);
  stand.position.set(0, 0.48, -0.02);
  group.add(stand);

  // Front ticket slot
  const slot = b.mesh(b.geo(new T.BoxGeometry(0.11, 0.022, 0.02)), darkSlot);
  slot.position.set(0, 0.75, 0.092);
  group.add(slot);

  // Wide landscape tilted white-bezel screen
  const headGroup = new T.Group();
  headGroup.position.set(0, 1.08, 0.02);
  headGroup.rotation.x = -0.32;

  const bezel = b.mesh(b.extrudeRoundedBox(0.66, 0.42, 0.075, 0.022, 0.008), glossWhite);
  headGroup.add(bezel);

  const screenTex = createKioskScreenTexture(b, false);
  const screenMat = b.mat(
    new T.MeshPhysicalMaterial({
      map: screenTex,
      roughness: 0.12,
      clearcoat: 0.85,
      emissive: new T.Color(0xffffff),
      emissiveMap: screenTex,
      emissiveIntensity: 0.28,
    })
  );
  const screen = b.mesh(b.geo(new T.PlaneGeometry(0.57, 0.34)), screenMat, false, false);
  screen.position.set(0, 0, 0.04);
  headGroup.add(screen);

  group.add(headGroup);
  return group;
}

/**
 * 5–8. LCD Displays (Ceiling Dual, Clinic, Desktop Stand, Wall Signage)
 */
function buildLcdDisplay(
  T: THREE,
  b: AssetBuilder,
  variant: 'ceiling-dual' | 'clinic' | 'counter-stand' | 'wall-signage'
): ThreeNamespace.Group {
  const group = new T.Group();
  group.name = `Q-LCD-${variant.toUpperCase()}`;

  const matteBlack = b.mat(
    new T.MeshStandardMaterial({ color: 0x1a1f24, roughness: 0.42, metalness: 0.3 })
  );
  const darkSteel = b.mat(
    new T.MeshStandardMaterial({ color: 0x2b3238, roughness: 0.35, metalness: 0.65 })
  );

  const panelY = variant === 'counter-stand' ? 0.56 : variant === 'wall-signage' ? 0.42 : 0.44;
  const panelW = variant === 'wall-signage' ? 1.15 : 0.96;
  const panelH = variant === 'wall-signage' ? 0.68 : 0.6;

  // Slim LCD bezel enclosure
  const bezel = b.mesh(b.extrudeRoundedBox(panelW, panelH, 0.055, 0.025, 0.007), matteBlack);
  bezel.position.set(0, panelY, 0);
  group.add(bezel);

  // Rear VESA electronics hump
  const rearPack = b.mesh(
    b.extrudeRoundedBox(panelW * 0.52, panelH * 0.5, 0.032, 0.015, 0.005),
    darkSteel
  );
  rearPack.position.set(0, panelY, -0.038);
  group.add(rearPack);

  // Crisp LCD screen glass
  const lcdTex = createLcdTexture(b, variant);
  const lcdMat = b.mat(
    new T.MeshPhysicalMaterial({
      map: lcdTex,
      roughness: 0.14,
      clearcoat: 0.8,
      emissive: new T.Color(0xffffff),
      emissiveMap: lcdTex,
      emissiveIntensity: 0.3,
    })
  );
  const screen = b.mesh(
    b.geo(new T.PlaneGeometry(panelW - 0.075, panelH - 0.075)),
    lcdMat,
    false,
    false
  );
  screen.position.set(0, panelY, 0.029);
  group.add(screen);

  // Mounting hardware matching the specific variant
  if (variant === 'ceiling-dual' || variant === 'clinic') {
    const pole = b.mesh(b.geo(new T.CylinderGeometry(0.026, 0.026, 0.38, 20)), darkSteel);
    pole.position.set(0, panelY + panelH / 2 + 0.19, -0.01);
    group.add(pole);

    const flange = b.mesh(b.geo(new T.CylinderGeometry(0.095, 0.095, 0.018, 24)), matteBlack);
    flange.position.set(0, panelY + panelH / 2 + 0.38, -0.01);
    group.add(flange);
  } else if (variant === 'counter-stand') {
    const pole = b.mesh(b.geo(new T.CylinderGeometry(0.026, 0.026, 0.34, 20)), darkSteel);
    pole.position.set(0, 0.18, -0.01);
    group.add(pole);

    const base = b.mesh(b.geo(new T.CylinderGeometry(0.14, 0.145, 0.02, 28)), matteBlack);
    base.position.set(0, 0.01, -0.01);
    group.add(base);
  } else {
    // Wall-mount rail behind rearPack
    const rail = b.mesh(b.geo(new T.BoxGeometry(0.56, 0.08, 0.024)), darkSteel);
    rail.position.set(0, panelY, -0.06);
    group.add(rail);
  }

  return group;
}

/**
 * 9–11. LED Calling Boards (Dual-Zone Hanging, Alphanumeric Matrix, 4-Digit 7-Segment)
 */
function buildLedBoard(
  T: THREE,
  b: AssetBuilder,
  variant: 'main-hanging' | 'alpha' | 'four-digit'
): ThreeNamespace.Group {
  const group = new T.Group();
  group.name = `Q-LED-${variant.toUpperCase()}`;

  const matteBlack = b.mat(
    new T.MeshStandardMaterial({ color: 0x171b1f, roughness: 0.52, metalness: 0.35 })
  );
  const chromeMat = b.mat(
    new T.MeshStandardMaterial({ color: 0x9aa5ae, roughness: 0.25, metalness: 0.85 })
  );

  const w = variant === 'main-hanging' ? 1.28 : 0.88;
  const h = variant === 'main-hanging' ? 0.38 : 0.36;
  const d = 0.095;

  const box = b.mesh(b.extrudeRoundedBox(w, h, d, 0.024, 0.008), matteBlack);
  box.position.set(0, 0.32, 0);
  group.add(box);

  // Anti-glare smoked acrylic front with glowing red LED matrix
  const ledTex = createLedTexture(b, variant);
  const ledMat = b.mat(
    new T.MeshPhysicalMaterial({
      map: ledTex,
      roughness: 0.22,
      clearcoat: 0.4,
      emissive: new T.Color(0xff2535),
      emissiveMap: ledTex,
      emissiveIntensity: 0.85,
    })
  );
  const face = b.mesh(b.geo(new T.PlaneGeometry(w - 0.06, h - 0.06)), ledMat, false, false);
  face.position.set(0, 0.32, d / 2 + 0.002);
  group.add(face);

  if (variant === 'main-hanging') {
    for (const xPos of [-0.46, 0.46]) {
      const ring = b.mesh(b.geo(new T.TorusGeometry(0.022, 0.005, 10, 20)), chromeMat);
      ring.position.set(xPos, 0.32 + h / 2 + 0.02, 0);
      group.add(ring);

      const rod = b.mesh(b.geo(new T.CylinderGeometry(0.005, 0.005, 0.22, 10)), chromeMat);
      rod.position.set(xPos, 0.32 + h / 2 + 0.14, 0);
      group.add(rod);
    }
  } else {
    // Top mounting lug like reference photo
    const lug = b.mesh(b.geo(new T.BoxGeometry(0.42, 0.022, 0.045)), matteBlack);
    lug.position.set(0, 0.32 + h / 2 + 0.011, -0.01);
    group.add(lug);
  }

  return group;
}

/**
 * 12. QCT-101 Hardware Calling Keypad
 */
function buildQct101Terminal(T: THREE, b: AssetBuilder): ThreeNamespace.Group {
  const group = new T.Group();
  group.name = 'QCT-101';

  const bodyMat = b.mat(
    new T.MeshStandardMaterial({ color: 0x20252a, roughness: 0.48, metalness: 0.2 })
  );
  const bezelMat = b.mat(
    new T.MeshStandardMaterial({ color: 0x12161a, roughness: 0.6, metalness: 0.15 })
  );

  // Wedge-angled ergonomic desktop enclosure
  const wedge = new T.Group();
  wedge.position.set(0, 0.11, 0);
  wedge.rotation.x = 0.24;

  const casing = b.mesh(b.extrudeRoundedBox(0.5, 0.68, 0.12, 0.03, 0.01), bodyMat);
  wedge.add(casing);

  // Recessed blue backlit LCD
  const lcdBezel = b.mesh(b.extrudeRoundedBox(0.4, 0.16, 0.016, 0.012, 0.003), bezelMat);
  lcdBezel.position.set(0, 0.21, 0.058);
  wedge.add(lcdBezel);

  const lcdTex = createQctLcdTexture(b);
  const lcdMat = b.mat(
    new T.MeshPhysicalMaterial({
      map: lcdTex,
      roughness: 0.15,
      clearcoat: 0.7,
      emissive: new T.Color(0x3b82f6),
      emissiveMap: lcdTex,
      emissiveIntensity: 0.55,
    })
  );
  const lcdScreen = b.mesh(b.geo(new T.PlaneGeometry(0.35, 0.125)), lcdMat, false, false);
  lcdScreen.position.set(0, 0.21, 0.068);
  wedge.add(lcdScreen);

  // Q-Control QCT-101 brand strip
  const brandTex = createQctBrandStripTexture(b);
  const brandMat = b.mat(new T.MeshStandardMaterial({ map: brandTex, roughness: 0.45 }));
  const brandStrip = b.mesh(b.geo(new T.PlaneGeometry(0.41, 0.065)), brandMat, false, false);
  brandStrip.position.set(0, 0.085, 0.062);
  wedge.add(brandStrip);

  // 4x4 physical tactile keypad matching QCT-101 layout
  const keys: { label: string; bg: string; fg: string }[][] = [
    [
      { label: '1', bg: '#262b31', fg: '#ffffff' },
      { label: '2', bg: '#262b31', fg: '#ffffff' },
      { label: '3', bg: '#262b31', fg: '#ffffff' },
      { label: 'TRNS', bg: '#1d4ed8', fg: '#ffffff' },
    ],
    [
      { label: '4', bg: '#262b31', fg: '#ffffff' },
      { label: '5', bg: '#262b31', fg: '#ffffff' },
      { label: '6', bg: '#262b31', fg: '#ffffff' },
      { label: 'CALL', bg: '#dc2626', fg: '#ffffff' },
    ],
    [
      { label: '7', bg: '#262b31', fg: '#ffffff' },
      { label: '8', bg: '#262b31', fg: '#ffffff' },
      { label: '9', bg: '#262b31', fg: '#ffffff' },
      { label: 'SAVE', bg: '#2563eb', fg: '#ffffff' },
    ],
    [
      { label: 'CFG', bg: '#eab308', fg: '#111827' },
      { label: '0', bg: '#262b31', fg: '#ffffff' },
      { label: 'ESC', bg: '#1e40af', fg: '#ffffff' },
      { label: 'NEXT', bg: '#16a34a', fg: '#ffffff' },
    ],
  ];

  const keyGeo = b.geo(new T.BoxGeometry(0.082, 0.062, 0.022));
  const startX = -0.145;
  const startY = -0.025;
  const stepX = 0.096;
  const stepY = 0.076;

  keys.forEach((row, r) => {
    row.forEach((k, c) => {
      const tex = createKeyLabelTexture(b, k.label, k.bg, k.fg);
      const sideMat = b.mat(
        new T.MeshStandardMaterial({ color: k.bg, roughness: 0.45, metalness: 0.08 })
      );
      const topMat = b.mat(
        new T.MeshStandardMaterial({ map: tex, roughness: 0.35, metalness: 0.05 })
      );
      const keyMesh = new T.Mesh(keyGeo, [sideMat, sideMat, sideMat, sideMat, topMat, sideMat]);
      keyMesh.castShadow = true;
      keyMesh.receiveShadow = true;
      keyMesh.position.set(startX + c * stepX, startY - r * stepY, 0.064);
      wedge.add(keyMesh);
    });
  });

  group.add(wedge);

  // Rubber desktop feet
  const footGeo = b.geo(new T.CylinderGeometry(0.025, 0.025, 0.012, 14));
  for (const [fx, fz] of [
    [-0.19, -0.22],
    [0.19, -0.22],
    [-0.19, 0.22],
    [0.19, 0.22],
  ]) {
    const foot = b.mesh(footGeo, bezelMat);
    foot.position.set(fx, 0.006, fz);
    group.add(foot);
  }

  return group;
}

/**
 * Normalizes any built or loaded 3D hardware group:
 * - Uniformly scales max dimension to targetSize (default 1.55 world units)
 * - Centers X & Z around origin
 * - Aligns bottom of bounding box cleanly to y = 0 (ground plane)
 */
export function normalizeHardwareRoot(
  T: THREE,
  root: ThreeNamespace.Group,
  targetSize = 1.55
): void {
  root.updateMatrixWorld(true);
  const box = new T.Box3().setFromObject(root);
  const size = new T.Vector3();
  const center = new T.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z, 0.001);
  const scale = targetSize / maxDim;
  root.scale.setScalar(scale);

  root.updateMatrixWorld(true);
  const scaledBox = new T.Box3().setFromObject(root);
  const scaledCenter = new T.Vector3();
  scaledBox.getCenter(scaledCenter);

  root.position.set(-scaledCenter.x, -scaledBox.min.y, -scaledCenter.z);
  root.updateMatrixWorld(true);
}

/**
 * Builds the reference-based procedural 3D hardware model for a given NileTronix product ID.
 */
export function createProceduralHardwareModel(T: THREE, proceduralId: string): BuiltHardwareAsset {
  const builder = new AssetBuilder(T);
  let model: ThreeNamespace.Group;

  switch (proceduralId) {
    case 'kiosk-curved-aio':
      model = buildKioskCurvedAio(T, builder);
      break;
    case 'kiosk-slim-dark':
      model = buildKioskSlimDark(T, builder);
      break;
    case 'kiosk-angled-pro':
      model = buildKioskAngledPro(T, builder);
      break;
    case 'kiosk-compact-white':
      model = buildKioskWideWhite(T, builder);
      break;
    case 'lcd-ceiling-dual':
      model = buildLcdDisplay(T, builder, 'ceiling-dual');
      break;
    case 'lcd-clinic-display':
      model = buildLcdDisplay(T, builder, 'clinic');
      break;
    case 'lcd-counter-stand':
      model = buildLcdDisplay(T, builder, 'counter-stand');
      break;
    case 'lcd-wall-signage':
      model = buildLcdDisplay(T, builder, 'wall-signage');
      break;
    case 'led-main-hanging':
      model = buildLedBoard(T, builder, 'main-hanging');
      break;
    case 'led-dotmatrix-alpha':
      model = buildLedBoard(T, builder, 'alpha');
      break;
    case 'led-4digit-counter':
      model = buildLedBoard(T, builder, 'four-digit');
      break;
    case 'terminal-qct101':
      model = buildQct101Terminal(T, builder);
      break;
    default:
      model = buildKioskCurvedAio(T, builder);
      break;
  }

  const wrapper = new T.Group();
  wrapper.name = `hardware-wrapper-${proceduralId}`;
  wrapper.add(model);
  normalizeHardwareRoot(T, wrapper, 1.55);

  return {
    root: wrapper,
    disposables: {
      geometries: builder.geometries,
      materials: builder.materials,
      textures: builder.textures,
    },
  };
}
