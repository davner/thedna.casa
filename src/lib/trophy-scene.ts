import {
  AmbientLight,
  BoxGeometry,
  CanvasTexture,
  CylinderGeometry,
  DirectionalLight,
  Group,
  LinearMipmapLinearFilter,
  Mesh,
  MeshLambertMaterial,
  NearestFilter,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  WebGLRenderer,
  type Material,
} from "three";
import type { Plate } from "./trophy";

export type TrophyData = {
  plates: (Plate | null)[][];
  textures: Record<"wood" | "foil" | "gold" | "rim" | "pumpkin", string>;
  gold: string;
  ink: string;
};

// The PS1 drew to a 320x240 screen with no sub-pixel precision, so vertices snap to that grid and wobble as they move.
const snapGrid = "vec2(320.0, 240.0)";

// Plates turn off the affine warp and dither, so their words stay straight and sharp.
const ps1 = <M extends Material>(material: M, { affine = true, dither = true } = {}): M => {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vAffine;")
      .replace(
        "#include <project_vertex>",
        `#include <project_vertex>
        vec4 snapped = gl_Position;
        snapped.xy = floor(snapped.xy / snapped.w * ${snapGrid}) / ${snapGrid} * snapped.w;
        gl_Position = snapped;
        #ifdef USE_MAP
          vAffine = vec3(vMapUv * gl_Position.w, gl_Position.w);
        #endif`,
      );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      "#include <common>\nvarying vec3 vAffine;",
    );
    if (affine)
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <map_fragment>",
        `#ifdef USE_MAP
          diffuseColor *= texture2D(map, vAffine.xy / vAffine.z);
        #endif`,
      );
    if (dither)
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>
        const float bayer[16] = float[16](0., 8., 2., 10., 12., 4., 14., 6., 3., 11., 1., 9., 15., 7., 13., 5.);
        ivec2 cell = ivec2(mod(gl_FragCoord.xy, 4.0));
        float threshold = bayer[cell.y * 4 + cell.x] / 16.0 - 0.5;
        gl_FragColor.rgb = floor(gl_FragColor.rgb * 31.0 + threshold + 0.5) / 31.0;`,
      );
  };
  return material;
};

const pixelated = (texture: Texture) => {
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = SRGBColorSpace;
  return texture;
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

// A base side is drawn on a canvas: the low-res wood and gold scaled up in hard pixels, then the plates in crisp type.
const sideCanvas = (wood: HTMLImageElement, gold: HTMLImageElement) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(wood, 0, 0, canvas.width, canvas.height);
  return { canvas, ctx, panel: { x: 48, y: 52, w: 928, h: 536 }, gold };
};

const fit = (ctx: CanvasRenderingContext2D, text: string, font: string, room: number) => {
  ctx.font = font;
  const width = ctx.measureText(text).width;
  return width > room ? room / width : 1;
};

const line = (ctx: CanvasRenderingContext2D, text: string, font: string, x: number, y: number, room: number) => {
  const squeeze = fit(ctx, text, font, room);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(squeeze, 1);
  ctx.fillText(text, 0, 0);
  ctx.restore();
};

const serif = '"Averia Serif Libre", serif';

const plateFace = (wood: HTMLImageElement, gold: HTMLImageElement, plates: (Plate | null)[], data: TrophyData) => {
  const { canvas, ctx, panel } = sideCanvas(wood, gold);
  ctx.drawImage(gold, panel.x, panel.y, panel.w, panel.h);
  const pad = 22;
  const gap = 18;
  const cw = (panel.w - pad * 2 - gap) / 2;
  const ch = (panel.h - pad * 2 - gap * 2) / 3;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  plates.forEach((plate, i) => {
    // Down each column first, the way the real plates were added.
    const x = panel.x + pad + Math.floor(i / 3) * (cw + gap);
    const y = panel.y + pad + (i % 3) * (ch + gap);
    if (!plate) {
      ctx.strokeStyle = "rgba(67, 38, 42, 0.55)";
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, cw, ch);
      return;
    }
    ctx.fillStyle = data.ink;
    ctx.fillRect(x, y, cw, ch);
    ctx.strokeStyle = data.gold;
    ctx.lineWidth = 4;
    ctx.strokeRect(x + 2, y + 2, cw - 4, ch - 4);
    ctx.fillStyle = data.gold;
    const cx = x + cw / 2;
    const room = cw - 28;
    line(ctx, String(plate.year), `700 34px ${serif}`, cx, y + ch * 0.32, room);
    line(ctx, plate.names, `700 40px ${serif}`, cx, y + ch * 0.62, room);
    line(ctx, plate.costume, `italic 400 30px ${serif}`, cx, y + ch * 0.88, room);
  });
  return canvas;
};

const plaqueFace = (wood: HTMLImageElement, gold: HTMLImageElement, data: TrophyData) => {
  const { canvas, ctx, panel } = sideCanvas(wood, gold);
  ctx.fillStyle = data.gold;
  ctx.fillRect(panel.x, panel.y, panel.w, panel.h);
  ctx.fillStyle = data.ink;
  ctx.fillRect(panel.x + 12, panel.y + 12, panel.w - 24, panel.h - 24);
  ctx.fillStyle = data.gold;
  ctx.strokeStyle = data.gold;
  ctx.lineWidth = 4;
  const cx = canvas.width / 2;
  for (const y of [150, 330]) {
    ctx.beginPath();
    ctx.moveTo(cx - 150, y);
    ctx.lineTo(cx + 150, y);
    ctx.stroke();
  }
  ctx.textAlign = "center";
  const room = panel.w - 120;
  line(ctx, "BEST COSTUME", `700 96px ${serif}`, cx, 280, room);
  line(ctx, "DnA’s Halloween", `700 76px ${serif}`, cx, 438, room);
  line(ctx, "Party", `700 76px ${serif}`, cx, 524, room);
  return canvas;
};

type Pen = CanvasRenderingContext2D;
const poly = (ctx: Pen, points: number[][]) => {
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fill();
};
// A classic jack-o'-lantern carved around (32, 34) on the 128x64 wrap, where the pumpkin faces the viewer.
const carve = (ctx: Pen) => {
  poly(ctx, [
    [20, 24],
    [28, 24],
    [24, 16],
  ]);
  poly(ctx, [
    [36, 24],
    [44, 24],
    [40, 16],
  ]);
  poly(ctx, [
    [30, 31],
    [34, 31],
    [32, 27],
  ]);
  poly(ctx, [
    [16, 35],
    [48, 35],
    [44, 44],
    [36, 46],
    [36, 42],
    [28, 42],
    [28, 46],
    [20, 44],
  ]);
};

const pumpkinSkin = (metal: HTMLImageElement, ink: string) => {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  for (let x = 0; x < 128; x += 32) ctx.drawImage(metal, x, 0, 32, 64);
  ctx.fillStyle = ink;
  carve(ctx);
  return canvas;
};

export const mountTrophy = async (stage: HTMLElement, data: TrophyData) => {
  await Promise.all([document.fonts.load(`700 40px ${serif}`), document.fonts.load(`italic 400 30px ${serif}`)]);
  const [wood, gold, metal] = await Promise.all(
    [data.textures.wood, data.textures.gold, data.textures.pumpkin].map(loadImage),
  );
  const loader = new TextureLoader();
  const [woodTex, foilTex, goldTex, rimTex, pumpkinTex] = (
    await Promise.all(
      (["wood", "foil", "gold", "rim", "pumpkin"] as const).map((key) => loader.loadAsync(data.textures[key])),
    )
  ).map(pixelated);

  const renderer = new WebGLRenderer({ antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  stage.append(canvas);

  const scene = new Scene();
  scene.add(new AmbientLight(0xffffff, 1.4));
  const sun = new DirectionalLight(0xffffff, 2.2);
  sun.position.set(-6, 14, 10);
  scene.add(sun);

  const lambert = (map: Texture, options?: Parameters<typeof ps1>[1]) => ps1(new MeshLambertMaterial({ map }), options);
  const woodMat = lambert(woodTex);
  const goldMat = lambert(goldTex);
  const crisp = (source: HTMLCanvasElement) => {
    const texture = new CanvasTexture(source);
    texture.colorSpace = SRGBColorSpace;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return ps1(new MeshLambertMaterial({ map: texture }), { affine: false, dither: false });
  };

  const trophy = new Group();
  // Sizes in hundreds of pixels of the straight-on photo, bottom up, so the model keeps the real trophy's build.
  const block = (w: number, h: number, y: number, materials: Material | Material[], segments = 1) => {
    const mesh = new Mesh(new BoxGeometry(w, h, w, segments, segments, segments), materials);
    mesh.position.y = y + h / 2;
    trophy.add(mesh);
    return mesh;
  };
  block(7.7, 0.9, 0, woodMat, 2);
  // BoxGeometry's faces run +x, -x, +y, -y, +z, -z: right, left, top, bottom, front, back.
  block(7.2, 4.5, 0.9, [
    crisp(plateFace(wood, gold, data.plates[0], data)),
    crisp(plateFace(wood, gold, data.plates[2], data)),
    woodMat,
    woodMat,
    crisp(plaqueFace(wood, gold, data)),
    crisp(plateFace(wood, gold, data.plates[1], data)),
  ]);
  const rimMat = lambert(rimTex);
  block(3.1, 0.4, 5.4, [rimMat, rimMat, goldMat, goldMat, rimMat, rimMat]);
  const foilMat = lambert(foilTex);
  block(2.7, 5.9, 5.8, [foilMat, foilMat, goldMat, goldMat, foilMat, foilMat], 3);
  block(3.45, 0.45, 11.7, [rimMat, rimMat, goldMat, goldMat, rimMat, rimMat]);

  const pumpkinMat = lambert(pumpkinTex);
  const neck = new Mesh(new CylinderGeometry(0.42, 0.62, 1.1, 8), pumpkinMat);
  neck.position.y = 12.15 + 0.55;
  // Turns the texture seam to the back.
  neck.rotation.y = Math.PI;
  trophy.add(neck);
  // A low-poly pumpkin: a squashed sphere with eight ribs pressed in, like the cast topper.
  const pumpkinGeo = new SphereGeometry(1.1, 16, 10);
  const p = pumpkinGeo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const [x, y, z] = [p.getX(i), p.getY(i), p.getZ(i)];
    const rib = 1 + 0.12 * Math.abs(Math.cos(4 * Math.atan2(z, x)));
    p.setXYZ(i, x * rib, y * 0.9, z * rib);
  }
  pumpkinGeo.computeVertexNormals();
  const skin = pixelated(new CanvasTexture(pumpkinSkin(metal, data.ink)));
  const pumpkin = new Mesh(pumpkinGeo, lambert(skin));
  pumpkin.position.y = 13.25 + 0.99;
  trophy.add(pumpkin);
  const stem = new Mesh(new CylinderGeometry(0.07, 0.13, 0.45, 5), goldMat);
  stem.position.set(0.05, 14.3, 0);
  stem.rotation.z = -0.25;
  trophy.add(stem);
  scene.add(trophy);

  const camera = new PerspectiveCamera(26, 1, 1, 200);
  camera.position.set(0, 9.5, 37);
  camera.lookAt(0, 7.3, 0);

  const draw = () => renderer.render(scene, camera);
  // Resizing clears a WebGL canvas, so it redraws at once rather than waiting for the next turn.
  const resize = () => {
    const { width, height } = stage.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // A narrow phone stage backs the camera off so the base's corners never leave the frame as it turns.
    camera.position.z = Math.max(37, 26 / camera.aspect);
    camera.updateProjectionMatrix();
    draw();
  };
  new ResizeObserver(resize).observe(stage);
  resize();

  return (turn: number) => {
    trophy.rotation.y = (turn * Math.PI) / 180;
    draw();
  };
};
