(function () {
  const canvas = document.getElementById("scene");
  const frame = document.getElementById("frame");
  const frameShell = document.getElementById("frame-shell");
  const resizeHandle = document.getElementById("resize-handle");
  const uiPanel = document.querySelector(".ui-panel");

  const shapeColorInput = document.getElementById("shape-color");
  const frustumLengthRange = document.getElementById("frustum-length-range");
  const frustumLengthNumber = document.getElementById("frustum-length-number");
  const frustumDiameterRange = document.getElementById("frustum-diameter-range");
  const frustumDiameterNumber = document.getElementById("frustum-diameter-number");
  const gapRange = document.getElementById("gap-range");
  const gapNumber = document.getElementById("gap-number");
  const shadingModeSelect = document.getElementById("shading-mode");
  const depthControls = document.getElementById("depth-controls");
  const depthBlurToggle = document.getElementById("depth-blur-toggle");
  const depthDynamicToggle = document.getElementById("depth-dynamic-toggle");
  const playModeSelect = document.getElementById("play-mode");
  const mode4ExpandedLengthInput = document.getElementById("mode4-expanded-length-input");
  const mode4EaseRange = document.getElementById("mode4-ease-range");
  const mode4EaseNumber = document.getElementById("mode4-ease-number");
  const mode4ZoomAmountRange = document.getElementById("mode4-zoom-amount-range");
  const mode4ZoomAmountNumber = document.getElementById("mode4-zoom-amount-number");
  const mode4ImageModeSelect = document.getElementById("mode4-image-mode");
  const mode4Controls = document.getElementById("mode4-controls");
  const mode5Controls = document.getElementById("mode5-controls");
  const mode5CenterModeSelect = document.getElementById("mode5-center-mode");
  const proportionLockInput = document.getElementById("proportion-lock");
  const zoomRange = document.getElementById("zoom-range");
  const zoomNumber = document.getElementById("zoom-number");
  const frameBgColorInput = document.getElementById("frame-bg-color");
  const frameWidthInput = document.getElementById("frame-width-input");
  const frameHeightInput = document.getElementById("frame-height-input");
  const frameImageInput = document.getElementById("frame-image-input");
  const clearImageButton = document.getElementById("clear-image-btn");
  const mode4ImagesInput = document.getElementById("mode4-images-input");
  const clearMode4ImagesButton = document.getElementById("clear-mode4-images-btn");
  const mode4ReplaceInput = document.getElementById("mode4-replace-input");
  const mode4ImagesList = document.getElementById("mode4-images-list");
  const mode4ImagesStatus = document.getElementById("mode4-images-status");
  const resetButton = document.getElementById("reset-btn");
  const copySvgButton = document.getElementById("copy-svg-btn");
  const rotXInput = document.getElementById("rot-x-input");
  const rotYInput = document.getElementById("rot-y-input");
  const rotZInput = document.getElementById("rot-z-input");
  const frameBgImage = document.getElementById("frame-bg-image");
  const mode5OlabWrap = document.getElementById("mode5-olab-wrap");
  const mode5OlabSvg = document.getElementById("mode5-olab-svg");
  const mode5OlabLabGroup = document.getElementById("mode5-olab-lab");
  const copyStatus = document.getElementById("copy-status");
  let mode5OlabOPath = null;

  const mode5OlabOSvg = (() => {
    if (!mode5OlabWrap || !mode5OlabSvg) return null;
    const directPaths = Array.from(mode5OlabSvg.children).filter(
      (node) => node && node.tagName && node.tagName.toLowerCase() === "path",
    );
    const oPath = directPaths.length ? directPaths[directPaths.length - 1] : null;
    if (!oPath) return null;
    const clonedOPath = oPath.cloneNode(true);
    mode5OlabOPath = clonedOPath;
    if (clonedOPath.style) clonedOPath.style.display = "";
    oPath.style.display = "none";
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.id = "mode5-olab-o-svg";
    svg.setAttribute("viewBox", "0 0 73 22");
    svg.setAttribute("aria-hidden", "true");
    svg.appendChild(clonedOPath);
    mode5OlabWrap.appendChild(svg);
    return svg;
  })();

  const gl = canvas.getContext("webgl", { antialias: true, alpha: true });
  if (!gl) {
    throw new Error("WebGL is unavailable in this browser.");
  }

  const constants = {
    sphereDiameterSvg: 192.003,
    sphereRadiusWorld: 1.18,
    defaultFrustumLengthSvg: 476.745,
    defaultFrustumLargeDiameterSvg: 239.78,
    defaultFrustumSmallDiameterSvg: 63.5857,
    gapSvg: 115.2018,
    minGapRatio: 0,
    maxGapRatio: 8,
    minLengthSvg: 476.745,
    maxLengthSvg: 10000,
    minLargeDiameterSvg: 239.78,
    maxLargeDiameterSvg:
      (239.78 / 476.745) * 10000,
    minMode4ExpandedLengthSvg: 476.745,
    maxMode4ExpandedLengthSvg: 10000,
    defaultMode4ExpandedLengthSvg: 3500,
    fixedPlay3LengthSvg: 10000,
    minMode4Ease: 0,
    maxMode4Ease: 1,
    defaultMode4Ease: 1,
    minMode4ZoomOutExtra: 0,
    maxMode4ZoomOutExtra: 120,
    defaultMode4ZoomOutExtra: 120,
    defaultMode4ImageMode: "mask",
    minFrameWidth: 260,
    maxFrameWidth: 2200,
    minFrameHeight: 300,
    maxFrameHeight: 2200,
    minCameraZ: 5,
    maxCameraZ: 220,
    defaultCameraZ: 12.2,
    defaultFrameWidth: 600,
    defaultFrameHeight: 800,
    defaultFrameBgColor: "#ffffff",
    defaultColorHex: "#1c1c1c",
    playMode4BaseGreen: [0, 1, 0],
    mode5OlabViewWidthSvg: 73,
    mode5OlabViewHeightSvg: 22,
    mode5OlabODiameterSvg: 17.494,
    mode5OlabOCenterXSvg: 8.747,
    mode5OlabOCenterYSvg: 12.8291,
    defaultMode5CenterMode: "anchor",
    defaultLightDir: [0.45, 0.75, 0.7],
    maxDiameterToLengthRatio: 1 / 1.5,
    playMode2MaxDiameterToLengthRatio: 1 / 2,
  };

  const worldPerSvgUnit = (2 * constants.sphereRadiusWorld) / constants.sphereDiameterSvg;
  const svgToWorld = (value) => value * worldPerSvgUnit;

  const state = {
    frameWidth: constants.defaultFrameWidth,
    frameHeight: constants.defaultFrameHeight,
    frameBgColor: constants.defaultFrameBgColor,
    frustumLengthSvg: constants.defaultFrustumLengthSvg,
    frustumLargeDiameterSvg: constants.defaultFrustumLargeDiameterSvg,
    gapRatio: constants.gapSvg / constants.sphereDiameterSvg,
    lockProportion: proportionLockInput.checked,
    lockedRatio:
      constants.defaultFrustumLargeDiameterSvg / constants.defaultFrustumLengthSvg,
    cameraZ: constants.defaultCameraZ,
    shadingMode: "lit",
    depthBlur: false,
    depthDynamic: false,
    playMode: "off",
  };
  const vertexSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aUv;

    uniform vec3 uObjPos;
    uniform vec3 uObjRot;
    uniform vec3 uStagePos;
    uniform vec3 uStageRot;
    uniform float uAspect;
    uniform float uFovY;
    uniform float uNear;
    uniform float uFar;
    uniform float uCameraZ;

    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying vec2 vUv;

    vec3 rotateX(vec3 p, float a) {
      float c = cos(a);
      float s = sin(a);
      return vec3(p.x, p.y * c - p.z * s, p.y * s + p.z * c);
    }

    vec3 rotateY(vec3 p, float a) {
      float c = cos(a);
      float s = sin(a);
      return vec3(p.x * c + p.z * s, p.y, -p.x * s + p.z * c);
    }

    vec3 rotateZ(vec3 p, float a) {
      float c = cos(a);
      float s = sin(a);
      return vec3(p.x * c - p.y * s, p.x * s + p.y * c, p.z);
    }

    void main() {
      vec3 p = aPosition;
      vec3 n = aNormal;

      p = rotateX(p, uObjRot.x);
      p = rotateY(p, uObjRot.y);
      p = rotateZ(p, uObjRot.z);

      n = rotateX(n, uObjRot.x);
      n = rotateY(n, uObjRot.y);
      n = rotateZ(n, uObjRot.z);

      p += uObjPos;

      p = rotateX(p, uStageRot.x);
      p = rotateY(p, uStageRot.y);
      p = rotateZ(p, uStageRot.z);
      n = rotateX(n, uStageRot.x);
      n = rotateY(n, uStageRot.y);
      n = rotateZ(n, uStageRot.z);

      p += uStagePos;

      vNormal = normalize(n);
      vWorldPos = p;
      vUv = aUv;

      float f = 1.0 / tan(uFovY * 0.5);
      vec3 view = vec3(p.x, p.y, p.z - uCameraZ);

      float clipX = view.x * (f / uAspect);
      float clipY = view.y * f;
      float clipZ = ((uFar + uNear) / (uNear - uFar)) * view.z +
                    ((2.0 * uFar * uNear) / (uNear - uFar));
      float clipW = -view.z;

      gl_Position = vec4(clipX, clipY, clipZ, clipW);
    }
  `;

  const fragmentSource = `
    precision mediump float;

    uniform vec3 uColor;
    uniform vec3 uLightDir;
    uniform vec3 uEyePos;
    uniform float uFlatMode;
    uniform float uDepthMode;
    uniform vec3 uDepthOrigin;
    uniform float uDepthMaxDistance;
    uniform float uDepthDynamic;
    uniform float uDepthShiftPhase;
    uniform sampler2D uTex;
    uniform float uUseTex;
    uniform float uTexMapMode;
    uniform vec2 uCanvasSize;
    uniform vec2 uTexSize;

    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying vec2 vUv;

    void main() {
      if (uDepthMode > 0.5) {
        float radialDepth = distance(vWorldPos, uDepthOrigin);
        float baseDepth01 = clamp(
          radialDepth / max(0.0001, uDepthMaxDistance),
          0.0,
          1.0
        );
        float depth01 = baseDepth01;
        if (uDepthDynamic > 0.5) {
          float centerLock = smoothstep(0.015, 0.08, baseDepth01);
          float outerFalloff = 1.0 - smoothstep(0.72, 1.0, baseDepth01);
          float travelWave =
            sin(6.2831853 * (baseDepth01 * 0.95 - uDepthShiftPhase)) * 0.12 +
            sin(6.2831853 * (baseDepth01 * 1.9 - uDepthShiftPhase * 1.35)) * 0.035;
          depth01 = clamp(
            baseDepth01 + travelWave * centerLock * outerFalloff,
            0.0,
            1.0
          );
        }
        depth01 = mix(0.08, 0.92, depth01);
        gl_FragColor = vec4(vec3(depth01), 1.0);
        return;
      }
      if (uUseTex > 0.5) {
        vec2 screenUv = vec2(
          gl_FragCoord.x / max(1.0, uCanvasSize.x),
          gl_FragCoord.y / max(1.0, uCanvasSize.y)
        );
        vec2 baseUv = (uTexMapMode > 0.5) ? vUv : screenUv;
        float baseAspect = (uTexMapMode > 0.5)
          ? 1.0
          : (uCanvasSize.x / max(1.0, uCanvasSize.y));
        float texAspect = uTexSize.x / max(1.0, uTexSize.y);
        vec2 uv = baseUv;
        if (texAspect > baseAspect) {
          float sx = baseAspect / texAspect;
          uv.x = (baseUv.x - 0.5) * sx + 0.5;
        } else {
          float sy = texAspect / baseAspect;
          uv.y = (baseUv.y - 0.5) * sy + 0.5;
        }
        vec4 tex = texture2D(uTex, uv);
        gl_FragColor = vec4(tex.rgb, 1.0);
        return;
      }
      if (uFlatMode > 0.5) {
        gl_FragColor = vec4(uColor, 1.0);
        return;
      }

      vec3 N = normalize(vNormal);
      vec3 L = normalize(-uLightDir);
      vec3 V = normalize(uEyePos - vWorldPos);
      vec3 H = normalize(L + V);

      float diffuse = max(dot(N, L), 0.0);
      float backDiffuse = max(dot(N, -L), 0.0);
      float spec = pow(max(dot(N, H), 0.0), 18.0) * 0.08;
      float ambient = 0.78;

      vec3 base = uColor * (ambient + diffuse * 0.35 + backDiffuse * 0.12);
      vec3 softLift = vec3(0.08) * diffuse;
      vec3 color = min(vec3(1.0), base + softLift + vec3(spec));
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function roundToOneDecimal(value) {
    return Math.round(value * 10) / 10;
  }

  function smootherStep01(value) {
    const t = clamp(value, 0, 1);
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function easeInOutSine01(value) {
    const t = clamp(value, 0, 1);
    return 0.5 - 0.5 * Math.cos(Math.PI * t);
  }

  function applyMode4Ease01(value) {
    const t = clamp(value, 0, 1);
    const easedSoft = easeInOutSine01(t);
    const easedStrong = easeInOutStrong01(t);
    const eased = easedSoft + (easedStrong - easedSoft) * 0.72;
    return t + (eased - t) * playMode4.easeAmount;
  }

  function applyMode4SpinStartRamp(value) {
    const t = clamp(value, 0, 1);
    const rampPhase = clamp(playMode4.spinStartRampPhase, 0.05, 0.95);
    if (t >= rampPhase) return t;
    const rampPhaseSq = rampPhase * rampPhase;
    return (t * t * (2 * rampPhase - t)) / Math.max(0.000001, rampPhaseSq);
  }

  function computeMode4SizeBlend01(value) {
    const t = clamp(value, 0, 1);
    const returnPhase = 0.75;
    if (t <= 0.5) {
      return smootherStep01(t / 0.5);
    }
    if (t <= returnPhase) {
      return 1 - smootherStep01((t - 0.5) / Math.max(0.0001, returnPhase - 0.5));
    }
    return 0;
  }

  function easeInOutStrong01(value) {
    const t = clamp(value, 0, 1);
    if (t < 0.5) {
      return 16 * t * t * t * t * t;
    }
    const inv = -2 * t + 2;
    return 1 - (inv * inv * inv * inv * inv) / 2;
  }

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader) || "Unknown shader compile error";
      gl.deleteShader(shader);
      throw new Error(log);
    }
    return shader;
  }

  function createProgram(vs, fs) {
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program) || "Unknown program link error";
      gl.deleteProgram(program);
      throw new Error(log);
    }
    return program;
  }

  function normalize3(x, y, z) {
    const length = Math.hypot(x, y, z) || 1;
    return [x / length, y / length, z / length];
  }

  const staticLightDir = normalize3(
    constants.defaultLightDir[0],
    constants.defaultLightDir[1],
    constants.defaultLightDir[2],
  );
  const currentLightDir = [staticLightDir[0], staticLightDir[1], staticLightDir[2]];

  function buildSphere(radius, lonSegments, latSegments) {
    const positions = [];
    const normals = [];
    const indices = [];

    for (let y = 0; y <= latSegments; y += 1) {
      const v = y / latSegments;
      const phi = v * Math.PI;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      for (let x = 0; x <= lonSegments; x += 1) {
        const u = x / lonSegments;
        const theta = u * Math.PI * 2;
        const px = Math.cos(theta) * sinPhi;
        const py = cosPhi;
        const pz = Math.sin(theta) * sinPhi;
        positions.push(px * radius, py * radius, pz * radius);
        normals.push(px, py, pz);
      }
    }

    const row = lonSegments + 1;
    for (let y = 0; y < latSegments; y += 1) {
      for (let x = 0; x < lonSegments; x += 1) {
        const a = y * row + x;
        const b = a + row;
        const c = b + 1;
        const d = a + 1;
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    return { positions, normals, indices };
  }

  function buildFrustum(leftRadius, rightRadius, length, segments) {
    const positions = [];
    const normals = [];
    const indices = [];
    const half = length * 0.5;
    const slopeX = (leftRadius - rightRadius) / length;

    function addVertex(px, py, pz, nx, ny, nz) {
      positions.push(px, py, pz);
      normals.push(nx, ny, nz);
      return positions.length / 3 - 1;
    }

    const sideLeft = [];
    const sideRight = [];
    for (let i = 0; i <= segments; i += 1) {
      const t = (i / segments) * Math.PI * 2;
      const cy = Math.cos(t);
      const sz = Math.sin(t);
      const n = normalize3(slopeX, cy, sz);
      sideLeft.push(addVertex(-half, leftRadius * cy, leftRadius * sz, n[0], n[1], n[2]));
      sideRight.push(addVertex(half, rightRadius * cy, rightRadius * sz, n[0], n[1], n[2]));
    }

    for (let i = 0; i < segments; i += 1) {
      const a = sideLeft[i];
      const b = sideRight[i];
      const c = sideLeft[i + 1];
      const d = sideRight[i + 1];
      indices.push(a, b, c);
      indices.push(b, d, c);
    }

    const leftCenter = addVertex(-half, 0, 0, -1, 0, 0);
    const leftRing = [];
    for (let i = 0; i <= segments; i += 1) {
      const t = (i / segments) * Math.PI * 2;
      leftRing.push(
        addVertex(-half, leftRadius * Math.cos(t), leftRadius * Math.sin(t), -1, 0, 0),
      );
    }
    for (let i = 0; i < segments; i += 1) {
      indices.push(leftCenter, leftRing[i + 1], leftRing[i]);
    }

    return { positions, normals, indices };
  }

  function buildFrustumRightCap(rightRadius, length, segments) {
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];
    const half = length * 0.5;

    function addVertex(px, py, pz, nx, ny, nz, u, v) {
      positions.push(px, py, pz);
      normals.push(nx, ny, nz);
      uvs.push(u, v);
      return positions.length / 3 - 1;
    }

    const rightCenter = addVertex(half, 0, 0, 1, 0, 0, 0.5, 0.5);
    const rightRing = [];
    for (let i = 0; i <= segments; i += 1) {
      const t = (i / segments) * Math.PI * 2;
      const cu = Math.cos(t);
      const sv = Math.sin(t);
      rightRing.push(addVertex(half, rightRadius * cu, rightRadius * sv, 1, 0, 0, 0.5 + cu * 0.5, 0.5 + sv * 0.5));
    }
    for (let i = 0; i < segments; i += 1) {
      indices.push(rightCenter, rightRing[i], rightRing[i + 1]);
    }
    return { positions, normals, indices, uvs };
  }

  function createMeshBuffers(mesh) {
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    const vertexCount = mesh.positions.length / 3;
    const interleaved = new Float32Array(vertexCount * 8);
    const sourceUvs = mesh.uvs || [];
    for (let i = 0; i < vertexCount; i += 1) {
      interleaved[i * 8 + 0] = mesh.positions[i * 3 + 0];
      interleaved[i * 8 + 1] = mesh.positions[i * 3 + 1];
      interleaved[i * 8 + 2] = mesh.positions[i * 3 + 2];
      interleaved[i * 8 + 3] = mesh.normals[i * 3 + 0];
      interleaved[i * 8 + 4] = mesh.normals[i * 3 + 1];
      interleaved[i * 8 + 5] = mesh.normals[i * 3 + 2];
      interleaved[i * 8 + 6] = sourceUvs[i * 2 + 0] || 0;
      interleaved[i * 8 + 7] = sourceUvs[i * 2 + 1] || 0;
    }
    gl.bufferData(gl.ARRAY_BUFFER, interleaved, gl.STATIC_DRAW);

    const ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);

    return { vbo, ibo, indexCount: mesh.indices.length };
  }

  function deleteMeshBuffers(mesh) {
    if (!mesh) return;
    gl.deleteBuffer(mesh.vbo);
    gl.deleteBuffer(mesh.ibo);
  }

  const program = createProgram(
    compileShader(gl.VERTEX_SHADER, vertexSource),
    compileShader(gl.FRAGMENT_SHADER, fragmentSource),
  );
  gl.useProgram(program);

  const postVertexSource = `
    attribute vec2 aPosition;
    varying vec2 vUv;

    void main() {
      vUv = aPosition * 0.5 + 0.5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  const postFragmentSource = `
    precision mediump float;

    uniform sampler2D uSceneTex;
    uniform vec2 uTexelSize;
    uniform vec2 uBlurCenterUv;
    uniform float uBlurEnabled;

    varying vec2 vUv;

    vec4 sampleScene(vec2 uv) {
      return texture2D(uSceneTex, clamp(uv, 0.0, 1.0));
    }

    void main() {
      if (uBlurEnabled < 0.5) {
        gl_FragColor = sampleScene(vUv);
        return;
      }

      float distToCenter = distance(vUv, uBlurCenterUv);
      float blurMix = smoothstep(0.06, 0.88, distToCenter);
      vec2 blurStep = uTexelSize * (2.0 + blurMix * 40.0);

      vec4 color = sampleScene(vUv) * 0.08;
      color += sampleScene(vUv + vec2( blurStep.x, 0.0)) * 0.09;
      color += sampleScene(vUv + vec2(-blurStep.x, 0.0)) * 0.09;
      color += sampleScene(vUv + vec2(0.0,  blurStep.y)) * 0.09;
      color += sampleScene(vUv + vec2(0.0, -blurStep.y)) * 0.09;
      color += sampleScene(vUv + vec2( blurStep.x,  blurStep.y)) * 0.07;
      color += sampleScene(vUv + vec2(-blurStep.x,  blurStep.y)) * 0.07;
      color += sampleScene(vUv + vec2( blurStep.x, -blurStep.y)) * 0.07;
      color += sampleScene(vUv + vec2(-blurStep.x, -blurStep.y)) * 0.07;
      color += sampleScene(vUv + vec2( blurStep.x * 2.0, 0.0)) * 0.055;
      color += sampleScene(vUv + vec2(-blurStep.x * 2.0, 0.0)) * 0.055;
      color += sampleScene(vUv + vec2(0.0,  blurStep.y * 2.0)) * 0.055;
      color += sampleScene(vUv + vec2(0.0, -blurStep.y * 2.0)) * 0.055;
      color += sampleScene(vUv + vec2( blurStep.x * 1.6,  blurStep.y * 1.6)) * 0.045;
      color += sampleScene(vUv + vec2(-blurStep.x * 1.6,  blurStep.y * 1.6)) * 0.045;
      color += sampleScene(vUv + vec2( blurStep.x * 1.6, -blurStep.y * 1.6)) * 0.045;
      color += sampleScene(vUv + vec2(-blurStep.x * 1.6, -blurStep.y * 1.6)) * 0.045;
      color *= 0.892857;

      gl_FragColor = mix(sampleScene(vUv), color, min(1.0, blurMix * 1.18));
    }
  `;

  const postProgram = createProgram(
    compileShader(gl.VERTEX_SHADER, postVertexSource),
    compileShader(gl.FRAGMENT_SHADER, postFragmentSource),
  );

  const attribPosition = gl.getAttribLocation(program, "aPosition");
  const attribNormal = gl.getAttribLocation(program, "aNormal");
  const attribUv = gl.getAttribLocation(program, "aUv");
  const uObjPos = gl.getUniformLocation(program, "uObjPos");
  const uObjRot = gl.getUniformLocation(program, "uObjRot");
  const uStagePos = gl.getUniformLocation(program, "uStagePos");
  const uStageRot = gl.getUniformLocation(program, "uStageRot");
  const uAspect = gl.getUniformLocation(program, "uAspect");
  const uFovY = gl.getUniformLocation(program, "uFovY");
  const uNear = gl.getUniformLocation(program, "uNear");
  const uFar = gl.getUniformLocation(program, "uFar");
  const uCameraZ = gl.getUniformLocation(program, "uCameraZ");
  const uColor = gl.getUniformLocation(program, "uColor");
  const uLightDir = gl.getUniformLocation(program, "uLightDir");
  const uEyePos = gl.getUniformLocation(program, "uEyePos");
  const uFlatMode = gl.getUniformLocation(program, "uFlatMode");
  const uDepthMode = gl.getUniformLocation(program, "uDepthMode");
  const uDepthOrigin = gl.getUniformLocation(program, "uDepthOrigin");
  const uDepthMaxDistance = gl.getUniformLocation(program, "uDepthMaxDistance");
  const uDepthDynamic = gl.getUniformLocation(program, "uDepthDynamic");
  const uDepthShiftPhase = gl.getUniformLocation(program, "uDepthShiftPhase");
  const uTex = gl.getUniformLocation(program, "uTex");
  const uUseTex = gl.getUniformLocation(program, "uUseTex");
  const uTexMapMode = gl.getUniformLocation(program, "uTexMapMode");
  const uCanvasSize = gl.getUniformLocation(program, "uCanvasSize");
  const uTexSize = gl.getUniformLocation(program, "uTexSize");

  const postAttribPosition = gl.getAttribLocation(postProgram, "aPosition");
  const postSceneTex = gl.getUniformLocation(postProgram, "uSceneTex");
  const postTexelSize = gl.getUniformLocation(postProgram, "uTexelSize");
  const postBlurCenterUv = gl.getUniformLocation(postProgram, "uBlurCenterUv");
  const postBlurEnabled = gl.getUniformLocation(postProgram, "uBlurEnabled");

  const postQuadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, postQuadBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]),
    gl.STATIC_DRAW,
  );

  const postFx = {
    framebuffer: gl.createFramebuffer(),
    colorTexture: gl.createTexture(),
    depthBuffer: gl.createRenderbuffer(),
    width: 0,
    height: 0,
  };

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.disable(gl.CULL_FACE);

  gl.uniform1f(uFovY, (38 * Math.PI) / 180);
  gl.uniform1f(uNear, 0.1);
  gl.uniform1f(uFar, 1000.0);
  gl.uniform3f(uLightDir, staticLightDir[0], staticLightDir[1], staticLightDir[2]);
  gl.uniform1f(uFlatMode, 0);
  if (uDepthMode) {
    gl.uniform1f(uDepthMode, 0);
  }
  if (uDepthOrigin) {
    gl.uniform3f(uDepthOrigin, 0, 0, 0);
  }
  if (uDepthMaxDistance) {
    gl.uniform1f(uDepthMaxDistance, 5);
  }
  if (uDepthDynamic) {
    gl.uniform1f(uDepthDynamic, 0);
  }
  if (uDepthShiftPhase) {
    gl.uniform1f(uDepthShiftPhase, 0);
  }
  gl.uniform1i(uTex, 0);
  gl.uniform1f(uUseTex, 0);
  gl.uniform1f(uTexMapMode, 0);
  gl.uniform2f(uCanvasSize, 1, 1);
  gl.uniform2f(uTexSize, 1, 1);

  const stage = {
    pos: [0, 0, 0],
    rotX: 0,
    rotY: 0,
    rotZ: 0,
  };

  const sphereRawMesh = buildSphere(constants.sphereRadiusWorld, 88, 56);
  const sphereObject = {
    mesh: createMeshBuffers(sphereRawMesh),
    pos: [0, 0, 0],
    rot: [0, 0, 0],
    color: [0.11, 0.11, 0.11],
  };

  const frustumObject = {
    mesh: null,
    pos: [0, 0, 0],
    rot: [0, 0, 0],
    color: [0.11, 0.11, 0.11],
  };
  const frustumLargeBaseObject = {
    mesh: null,
    pos: [0, 0, 0],
    rot: [0, 0, 0],
    color: [0.11, 0.11, 0.11],
  };
  const mode5SphereCenterPositions = sphereRawMesh.positions.slice();
  let frustumLocalPositions = [];
  let frustumCapLocalPositions = [];
  let frustumLocalIndices = [];
  const frustumLayout = {
    leftX: 0,
    lengthWorld: 0,
    centerX: 0,
    lengthSvg: constants.defaultFrustumLengthSvg,
    largeDiameterSvg: constants.defaultFrustumLargeDiameterSvg,
  };

  function bindMesh(mesh) {
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbo);
    gl.vertexAttribPointer(attribPosition, 3, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(attribPosition);
    gl.vertexAttribPointer(attribNormal, 3, gl.FLOAT, false, 32, 12);
    gl.enableVertexAttribArray(attribNormal);
    if (attribUv >= 0) {
      gl.vertexAttribPointer(attribUv, 2, gl.FLOAT, false, 32, 24);
      gl.enableVertexAttribArray(attribUv);
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo);
  }

  function drawObject(object, options) {
    if (!object.mesh) return;
    bindMesh(object.mesh);
    const texture = options && options.texture ? options.texture : null;
    const textureWidth = options && options.textureWidth ? options.textureWidth : 1;
    const textureHeight = options && options.textureHeight ? options.textureHeight : 1;
    const textureMapMode = options && options.textureMapMode ? options.textureMapMode : 0;
    gl.uniform1f(uUseTex, texture ? 1 : 0);
    gl.uniform1f(uTexMapMode, textureMapMode);
    gl.uniform2f(uTexSize, textureWidth, textureHeight);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform3fv(uObjPos, object.pos);
    gl.uniform3fv(uObjRot, object.rot);
    gl.uniform3fv(uColor, object.color);
    gl.drawElements(gl.TRIANGLES, object.mesh.indexCount, gl.UNSIGNED_SHORT, 0);
  }

  function hexToRgb01(hex) {
    const safeHex = String(hex || "#1c1c1c").trim();
    const parsed = /^#?([0-9a-f]{6})$/i.exec(safeHex);
    if (!parsed) return [0.11, 0.11, 0.11];
    const value = parsed[1];
    return [
      parseInt(value.slice(0, 2), 16) / 255,
      parseInt(value.slice(2, 4), 16) / 255,
      parseInt(value.slice(4, 6), 16) / 255,
    ];
  }

  function updateShapeColor(hex) {
    const rgb = hexToRgb01(hex);
    sphereObject.color = rgb.slice();
    frustumObject.color = rgb.slice();
    frustumLargeBaseObject.color = rgb.slice();
    if (mode5OlabSvg) {
      mode5OlabSvg.style.color = rgb01ToCss(rgb);
    }
    if (mode5OlabOSvg) {
      mode5OlabOSvg.style.color = rgb01ToCss(rgb);
    }
  }

  function rebuildFrustumFor(lengthSvg, largeDiameterSvg) {
    const worldLength = svgToWorld(lengthSvg);
    const largeRadiusWorld = svgToWorld(largeDiameterSvg) * 0.5;
    const smallRadiusWorld = svgToWorld(constants.defaultFrustumSmallDiameterSvg) * 0.5;

    deleteMeshBuffers(frustumObject.mesh);
    deleteMeshBuffers(frustumLargeBaseObject.mesh);
    const frustumRawMesh = buildFrustum(smallRadiusWorld, largeRadiusWorld, worldLength, 120);
    const frustumCapRawMesh = buildFrustumRightCap(largeRadiusWorld, worldLength, 120);
    frustumLocalPositions = frustumRawMesh.positions.slice();
    frustumCapLocalPositions = frustumCapRawMesh.positions.slice();
    frustumLocalIndices = frustumRawMesh.indices.slice();
    frustumObject.mesh = createMeshBuffers(frustumRawMesh);
    frustumLargeBaseObject.mesh = createMeshBuffers(frustumCapRawMesh);

    const sphereRadius = constants.sphereRadiusWorld;
    const gapSvg = state.gapRatio * constants.sphereDiameterSvg;
    const gapWorld = svgToWorld(gapSvg);
    const sphereCenterX = 0;
    const frustumLeftX = sphereCenterX + sphereRadius + gapWorld;
    const frustumCenterX = frustumLeftX + worldLength * 0.5;
    frustumLayout.leftX = frustumLeftX;
    frustumLayout.lengthWorld = worldLength;
    frustumLayout.centerX = frustumCenterX;
    frustumLayout.lengthSvg = lengthSvg;
    frustumLayout.largeDiameterSvg = largeDiameterSvg;

    if (state.playMode !== "off") {
      sphereObject.pos[0] = sphereCenterX;
      frustumObject.pos[0] = frustumCenterX;
      frustumLargeBaseObject.pos[0] = frustumCenterX;
      return;
    }

    const minX = sphereCenterX - sphereRadius;
    const maxX = frustumLeftX + worldLength;
    const centerX = (minX + maxX) * 0.5;
    sphereObject.pos[0] = sphereCenterX - centerX;
    frustumObject.pos[0] = frustumCenterX - centerX;
    frustumLargeBaseObject.pos[0] = frustumCenterX - centerX;
  }

  function rotateX3(vx, vy, vz, a) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return [vx, vy * c - vz * s, vy * s + vz * c];
  }

  function rotateY3(vx, vy, vz, a) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return [vx * c + vz * s, vy, -vx * s + vz * c];
  }

  function rotateZ3(vx, vy, vz, a) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return [vx * c - vy * s, vx * s + vy * c, vz];
  }

  function sub3(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }

  function cross3(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
  }

  function dot3(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function normalizeVec3(v) {
    const len = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / len, v[1] / len, v[2] / len];
  }

  function rotateVecByEuler(v, rot) {
    let x = v[0];
    let y = v[1];
    let z = v[2];
    [x, y, z] = rotateX3(x, y, z, rot[0]);
    [x, y, z] = rotateY3(x, y, z, rot[1]);
    [x, y, z] = rotateZ3(x, y, z, rot[2]);
    return [x, y, z];
  }

  function transformToWorld(localVec, object) {
    let p = rotateVecByEuler(localVec, object.rot);
    p[0] += object.pos[0];
    p[1] += object.pos[1];
    p[2] += object.pos[2];
    p = rotateVecByEuler(p, [stage.rotX, stage.rotY, stage.rotZ]);
    p[0] += stage.pos[0];
    p[1] += stage.pos[1];
    p[2] += stage.pos[2];
    return p;
  }

  function projectWorldToScreen(worldVec, width, height, cameraForFit) {
    const aspect = width / height;
    const f = 1 / Math.tan((38 * Math.PI / 180) * 0.5);
    const viewZ = worldVec[2] - cameraForFit;
    const clipW = -viewZ;
    if (clipW <= 0.001) return null;
    const clipX = worldVec[0] * (f / aspect);
    const clipY = worldVec[1] * f;
    const ndcX = clipX / clipW;
    const ndcY = clipY / clipW;
    return {
      x: (ndcX * 0.5 + 0.5) * width,
      y: (1 - (ndcY * 0.5 + 0.5)) * height,
      depth: clipW,
    };
  }

  function ensurePostFxTargets(width, height) {
    const safeWidth = Math.max(2, Math.floor(width));
    const safeHeight = Math.max(2, Math.floor(height));
    if (
      postFx.width === safeWidth &&
      postFx.height === safeHeight
    ) {
      return;
    }

    postFx.width = safeWidth;
    postFx.height = safeHeight;

    gl.bindTexture(gl.TEXTURE_2D, postFx.colorTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      safeWidth,
      safeHeight,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );

    gl.bindRenderbuffer(gl.RENDERBUFFER, postFx.depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, safeWidth, safeHeight);

    gl.bindFramebuffer(gl.FRAMEBUFFER, postFx.framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      postFx.colorTexture,
      0,
    );
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER,
      postFx.depthBuffer,
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  }

  function accumulateDepthDistanceRange(localPositions, object, originWorld, vertexStep, stats) {
    const step = Math.max(1, Math.floor(vertexStep));
    let vertexIndex = 0;
    for (let i = 0; i < localPositions.length; i += 3, vertexIndex += 1) {
      if (vertexIndex % step !== 0) continue;
      const world = transformToWorld(
        [localPositions[i], localPositions[i + 1], localPositions[i + 2]],
        object,
      );
      const dx = world[0] - originWorld[0];
      const dy = world[1] - originWorld[1];
      const dz = world[2] - originWorld[2];
      const radialDepth = Math.hypot(dx, dy, dz);
      if (!Number.isFinite(radialDepth)) continue;
      stats.max = Math.max(stats.max, radialDepth);
      stats.count += 1;
    }
  }

  function updateDepthModeUniforms(timeMs) {
    if (!uDepthOrigin || !uDepthMaxDistance) return;
    const sphereCenterWorld = transformToWorld([0, 0, 0], sphereObject);
    const stats = {
      max: -Infinity,
      count: 0,
    };

    accumulateDepthDistanceRange(sphereRawMesh.positions, sphereObject, sphereCenterWorld, 1, stats);
    accumulateDepthDistanceRange(frustumLocalPositions, frustumObject, sphereCenterWorld, 1, stats);
    accumulateDepthDistanceRange(
      frustumCapLocalPositions,
      frustumLargeBaseObject,
      sphereCenterWorld,
      1,
      stats,
    );

    if (
      stats.count < 3 ||
      !Number.isFinite(stats.max)
    ) {
      gl.uniform3f(uDepthOrigin, sphereCenterWorld[0], sphereCenterWorld[1], sphereCenterWorld[2]);
      gl.uniform1f(uDepthMaxDistance, 5);
      if (uDepthDynamic) {
        gl.uniform1f(uDepthDynamic, state.depthDynamic ? 1 : 0);
      }
      if (uDepthShiftPhase) {
        const shiftCycles = ((timeMs || 0) * 0.00022) % 1;
        gl.uniform1f(uDepthShiftPhase, shiftCycles);
      }
      return;
    }

    gl.uniform3f(uDepthOrigin, sphereCenterWorld[0], sphereCenterWorld[1], sphereCenterWorld[2]);
    gl.uniform1f(uDepthMaxDistance, Math.max(constants.sphereRadiusWorld, stats.max));
    if (uDepthDynamic) {
      gl.uniform1f(uDepthDynamic, state.depthDynamic ? 1 : 0);
    }
    if (uDepthShiftPhase) {
      const shiftCycles = ((timeMs || 0) * 0.00022) % 1;
      gl.uniform1f(uDepthShiftPhase, shiftCycles);
    }
  }

  function getDepthBlurCenterUv() {
    const centerWorld = transformToWorld([0, 0, 0], sphereObject);
    const centerScreen = projectWorldToScreen(
      centerWorld,
      Math.max(2, canvas.width),
      Math.max(2, canvas.height),
      state.cameraZ,
    );
    if (!centerScreen) {
      return [0.5, 0.5];
    }
    return [
      clamp(centerScreen.x / Math.max(1, canvas.width), 0, 1),
      clamp(1 - centerScreen.y / Math.max(1, canvas.height), 0, 1),
    ];
  }

  function drawPostFxPass() {
    ensurePostFxTargets(canvas.width, canvas.height);
    const blurCenterUv = getDepthBlurCenterUv();

    gl.useProgram(postProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, postQuadBuffer);
    gl.vertexAttribPointer(postAttribPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(postAttribPosition);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, postFx.colorTexture);
    gl.uniform1i(postSceneTex, 0);
    gl.uniform2f(postTexelSize, 1 / Math.max(1, canvas.width), 1 / Math.max(1, canvas.height));
    gl.uniform2f(postBlurCenterUv, blurCenterUv[0], blurCenterUv[1]);
    gl.uniform1f(postBlurEnabled, state.depthBlur ? 1 : 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.useProgram(program);
  }

  function rgb01ToCss(rgb) {
    const r = Math.round(clamp(rgb[0], 0, 1) * 255);
    const g = Math.round(clamp(rgb[1], 0, 1) * 255);
    const b = Math.round(clamp(rgb[2], 0, 1) * 255);
    return `rgb(${r},${g},${b})`;
  }

  function shadeFaceColor(baseColor, nWorld, centerWorld) {
    if (state.shadingMode === "flat") return baseColor.slice();
    const N = normalizeVec3(nWorld);
    const L = normalizeVec3([-currentLightDir[0], -currentLightDir[1], -currentLightDir[2]]);
    const V = normalizeVec3([0 - centerWorld[0], 0 - centerWorld[1], state.cameraZ - centerWorld[2]]);
    const H = normalizeVec3([L[0] + V[0], L[1] + V[1], L[2] + V[2]]);
    const diffuse = Math.max(0, dot3(N, L));
    const backDiffuse = Math.max(0, dot3(N, [-L[0], -L[1], -L[2]]));
    const spec = Math.pow(Math.max(0, dot3(N, H)), 18) * 0.08;
    const ambient = 0.78;
    const lift = 0.08 * diffuse;
    return [
      clamp(baseColor[0] * (ambient + diffuse * 0.35 + backDiffuse * 0.12) + lift + spec, 0, 1),
      clamp(baseColor[1] * (ambient + diffuse * 0.35 + backDiffuse * 0.12) + lift + spec, 0, 1),
      clamp(baseColor[2] * (ambient + diffuse * 0.35 + backDiffuse * 0.12) + lift + spec, 0, 1),
    ];
  }

  function computeFrustumProjectedBounds(cameraForFit) {
    if (!frustumLocalPositions.length) return null;
    const width = Math.max(2, canvas.width);
    const height = Math.max(2, canvas.height);
    const aspect = width / height;
    const f = 1 / Math.tan((38 * Math.PI / 180) * 0.5);
    const cameraZ = cameraForFit;

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    let count = 0;

    for (let i = 0; i < frustumLocalPositions.length; i += 3) {
      let x = frustumLocalPositions[i];
      let y = frustumLocalPositions[i + 1];
      let z = frustumLocalPositions[i + 2];

      [x, y, z] = rotateX3(x, y, z, frustumObject.rot[0]);
      [x, y, z] = rotateY3(x, y, z, frustumObject.rot[1]);
      [x, y, z] = rotateZ3(x, y, z, frustumObject.rot[2]);
      x += frustumObject.pos[0];
      y += frustumObject.pos[1];
      z += frustumObject.pos[2];

      [x, y, z] = rotateX3(x, y, z, stage.rotX);
      [x, y, z] = rotateY3(x, y, z, stage.rotY);
      [x, y, z] = rotateZ3(x, y, z, stage.rotZ);
      x += stage.pos[0];
      y += stage.pos[1];
      z += stage.pos[2];

      const viewZ = z - cameraZ;
      const clipW = -viewZ;
      if (clipW <= 0.06) continue;

      const clipX = x * (f / aspect);
      const clipY = y * f;
      const ndcX = clipX / clipW;
      const ndcY = clipY / clipW;
      const ndcClamp = 6.0;
      const safeNdcX = clamp(ndcX, -ndcClamp, ndcClamp);
      const safeNdcY = clamp(ndcY, -ndcClamp, ndcClamp);
      const px = (safeNdcX * 0.5 + 0.5) * width;
      const py = (1 - (safeNdcY * 0.5 + 0.5)) * height;
      minX = Math.min(minX, px);
      maxX = Math.max(maxX, px);
      minY = Math.min(minY, py);
      maxY = Math.max(maxY, py);
      count += 1;
    }

    if (count < 20 || !Number.isFinite(minX) || !Number.isFinite(maxX)) {
      return null;
    }
    return {
      w: Math.max(1, maxX - minX),
      h: Math.max(1, maxY - minY),
    };
  }

  function computeFrustumFillScale(cameraForFit) {
    const width = Math.max(2, canvas.width);
    const height = Math.max(2, canvas.height);
    const targetW = width * 0.94;
    const targetH = height * 0.94;

    const baseBounds = computeFrustumProjectedBounds(cameraForFit);
    if (!baseBounds) return 1;
    const factor = Math.min(targetW / baseBounds.w, targetH / baseBounds.h);
    return clamp(factor, 0.35, 3.6);
  }

  function updateCameraUniforms() {
    gl.uniform1f(uCameraZ, state.cameraZ);
    gl.uniform3f(uEyePos, 0, 0, state.cameraZ);
  }

  function syncZoomInputs() {
    if (document.activeElement !== zoomRange) {
      zoomRange.value = state.cameraZ.toFixed(1);
    }
    if (document.activeElement !== zoomNumber) {
      zoomNumber.value = state.cameraZ.toFixed(1);
    }
  }

  function syncMode4ExpandedLengthInput() {
    if (!mode4ExpandedLengthInput) return;
    if (document.activeElement !== mode4ExpandedLengthInput) {
      mode4ExpandedLengthInput.value = String(Math.round(playMode4.expandedLengthSvg));
    }
  }

  function syncMode4MotionInputs() {
    if (mode4EaseRange && document.activeElement !== mode4EaseRange) {
      mode4EaseRange.value = playMode4.easeAmount.toFixed(2);
    }
    if (mode4EaseNumber && document.activeElement !== mode4EaseNumber) {
      mode4EaseNumber.value = playMode4.easeAmount.toFixed(2);
    }
    if (mode4ZoomAmountRange && document.activeElement !== mode4ZoomAmountRange) {
      mode4ZoomAmountRange.value = playMode4.zoomOutExtra.toFixed(1);
    }
    if (mode4ZoomAmountNumber && document.activeElement !== mode4ZoomAmountNumber) {
      mode4ZoomAmountNumber.value = playMode4.zoomOutExtra.toFixed(1);
    }
  }

  function syncModePanels() {
    if (mode4Controls) {
      mode4Controls.hidden = state.playMode !== "play5";
    }
    if (mode5Controls) {
      mode5Controls.hidden = state.playMode !== "play6";
    }
  }

  function syncAppearancePanels() {
    if (depthControls) {
      depthControls.hidden = state.shadingMode !== "depth";
    }
    if (depthBlurToggle && document.activeElement !== depthBlurToggle) {
      depthBlurToggle.checked = state.depthBlur;
    }
    if (depthDynamicToggle && document.activeElement !== depthDynamicToggle) {
      depthDynamicToggle.checked = state.depthDynamic;
    }
  }

  function setMode4ExpandedLength(value) {
    const raw = Number(value);
    if (!Number.isFinite(raw)) return;
    const next = clamp(
      raw,
      constants.minMode4ExpandedLengthSvg,
      constants.maxMode4ExpandedLengthSvg,
    );
    playMode4.expandedLengthSvg = next;

    if (state.playMode === "play5" && playMode4.phase === "hold") {
      playMode4.lengthCurrent = playMode4.expandedLengthSvg;
      playMode4.diameterCurrent = playMode4.expandedLengthSvg * playMode4.defaultScaleRatio;
      rebuildFrustumFor(playMode4.lengthCurrent, playMode4.diameterCurrent);
    }
    syncMode4ExpandedLengthInput();
  }

  function setMode4EaseAmount(value) {
    const raw = Number(value);
    if (!Number.isFinite(raw)) return;
    playMode4.easeAmount = clamp(raw, constants.minMode4Ease, constants.maxMode4Ease);
    syncMode4MotionInputs();
  }

  function setMode4ZoomOutAmount(value) {
    const raw = Number(value);
    if (!Number.isFinite(raw)) return;
    playMode4.zoomOutExtra = clamp(
      raw,
      constants.minMode4ZoomOutExtra,
      constants.maxMode4ZoomOutExtra,
    );
    syncMode4MotionInputs();
  }

  function getFixedPlay3DiameterSvg() {
    return constants.fixedPlay3LengthSvg * playMode4.defaultScaleRatio;
  }

  function updateShadingMode(mode) {
    if (mode === "flat") {
      state.shadingMode = "flat";
    } else if (mode === "depth") {
      state.shadingMode = "depth";
    } else {
      state.shadingMode = "lit";
    }
    gl.uniform1f(uFlatMode, state.shadingMode === "flat" ? 1 : 0);
    if (uDepthMode) {
      gl.uniform1f(uDepthMode, state.shadingMode === "depth" ? 1 : 0);
    }
    syncAppearancePanels();
  }

  function syncDimensionInputs() {
    const maxLargeDiameterText = constants.maxLargeDiameterSvg.toFixed(4);
    frustumDiameterRange.max = maxLargeDiameterText;
    frustumDiameterNumber.max = maxLargeDiameterText;
    frustumLengthRange.value = String(state.frustumLengthSvg);
    frustumLengthNumber.value = state.frustumLengthSvg.toFixed(3);
    frustumDiameterRange.value = String(state.frustumLargeDiameterSvg);
    frustumDiameterNumber.value = state.frustumLargeDiameterSvg.toFixed(3);
    if (document.activeElement !== gapRange) {
      gapRange.value = state.gapRatio.toFixed(1);
    }
    if (document.activeElement !== gapNumber) {
      gapNumber.value = state.gapRatio.toFixed(1);
    }
  }

  function setGap(value) {
    const raw = Number(value);
    if (!Number.isFinite(raw)) return;
    const next = clamp(
      roundToOneDecimal(raw),
      constants.minGapRatio,
      constants.maxGapRatio,
    );
    state.gapRatio = next;
    syncDimensionInputs();
    rebuildFrustumFor(state.frustumLengthSvg, state.frustumLargeDiameterSvg);
  }

  function getMaxLargeDiameterForLength(lengthSvg) {
    const safeLength = clamp(
      Number(lengthSvg),
      constants.minLengthSvg,
      constants.maxLengthSvg,
    );
    return Math.min(
      constants.maxLargeDiameterSvg,
      safeLength * constants.maxDiameterToLengthRatio,
    );
  }

  function setFrustumLength(value) {
    const next = clamp(
      Number(value),
      constants.minLengthSvg,
      constants.maxLengthSvg,
    );
    if (!Number.isFinite(next)) return;
    state.frustumLengthSvg = next;
    if (state.lockProportion) {
      state.frustumLargeDiameterSvg = clamp(
        state.frustumLengthSvg * state.lockedRatio,
        constants.minLargeDiameterSvg,
        getMaxLargeDiameterForLength(state.frustumLengthSvg),
      );
      if (state.frustumLengthSvg !== 0) {
        state.lockedRatio = state.frustumLargeDiameterSvg / state.frustumLengthSvg;
      }
    } else {
      state.frustumLargeDiameterSvg = Math.min(
        state.frustumLargeDiameterSvg,
        getMaxLargeDiameterForLength(state.frustumLengthSvg),
      );
    }
    syncDimensionInputs();
    rebuildFrustumFor(state.frustumLengthSvg, state.frustumLargeDiameterSvg);
  }

  function setFrustumLargeDiameter(value) {
    if (state.lockProportion) {
      const raw = clamp(
        Number(value),
        constants.minLargeDiameterSvg,
        constants.maxLargeDiameterSvg,
      );
      if (!Number.isFinite(raw)) return;
      state.lockedRatio = clamp(
        state.lockedRatio,
        0.0001,
        constants.maxDiameterToLengthRatio,
      );
      state.frustumLengthSvg = clamp(
        raw / state.lockedRatio,
        constants.minLengthSvg,
        constants.maxLengthSvg,
      );
      state.frustumLargeDiameterSvg = clamp(
        raw,
        constants.minLargeDiameterSvg,
        getMaxLargeDiameterForLength(state.frustumLengthSvg),
      );
      if (state.frustumLengthSvg !== 0) {
        state.lockedRatio = state.frustumLargeDiameterSvg / state.frustumLengthSvg;
      }
    } else {
      const next = clamp(
        Number(value),
        constants.minLargeDiameterSvg,
        getMaxLargeDiameterForLength(state.frustumLengthSvg),
      );
      if (!Number.isFinite(next)) return;
      state.frustumLargeDiameterSvg = next;
    }
    syncDimensionInputs();
    rebuildFrustumFor(state.frustumLengthSvg, state.frustumLargeDiameterSvg);
  }

  function resizeCanvasToFrame() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = frame.getBoundingClientRect();
    const width = Math.max(2, Math.floor(rect.width * dpr));
    const height = Math.max(2, Math.floor(rect.height * dpr));
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${Math.round(rect.width)}px`;
    canvas.style.height = `${Math.round(rect.height)}px`;
    gl.viewport(0, 0, width, height);
    gl.uniform1f(uAspect, width / height);
    gl.uniform2f(uCanvasSize, width, height);
  }

  function applyFrameSize(width, height) {
    const safeWidth = Number.isFinite(width) ? width : state.frameWidth;
    const safeHeight = Number.isFinite(height) ? height : state.frameHeight;
    state.frameWidth = clamp(safeWidth, constants.minFrameWidth, constants.maxFrameWidth);
    state.frameHeight = clamp(safeHeight, constants.minFrameHeight, constants.maxFrameHeight);
    frame.style.width = `${Math.round(state.frameWidth)}px`;
    frame.style.height = `${Math.round(state.frameHeight)}px`;
    frameShell.style.setProperty("--frame-w", `${Math.round(state.frameWidth)}px`);
    frameShell.style.setProperty("--frame-h", `${Math.round(state.frameHeight)}px`);
    if (document.activeElement !== frameWidthInput) {
      frameWidthInput.value = String(Math.round(state.frameWidth));
    }
    if (document.activeElement !== frameHeightInput) {
      frameHeightInput.value = String(Math.round(state.frameHeight));
    }
    resizeCanvasToFrame();
  }

  function updateWorkspaceShellBounds() {
    if (!frameShell) return;
    if (window.matchMedia("(max-width: 640px)").matches || !uiPanel) {
      frameShell.style.setProperty("--workspace-left", "0px");
      return;
    }
    const panelRect = uiPanel.getBoundingClientRect();
    const workspaceLeft = Math.max(0, Math.round(panelRect.right + 12));
    frameShell.style.setProperty("--workspace-left", `${workspaceLeft}px`);
  }

  function applyFrameBackgroundColor(value) {
    const next = /^#([0-9a-f]{6})$/i.test(String(value || "").trim())
      ? String(value).trim()
      : constants.defaultFrameBgColor;
    state.frameBgColor = next;
    frame.style.backgroundColor = next;
    if (frameBgColorInput && document.activeElement !== frameBgColorInput) {
      frameBgColorInput.value = next;
    }
  }

  let frameImageObjectUrl = null;

  function clearFrameImage(keepInputValue) {
    if (frameImageObjectUrl) {
      URL.revokeObjectURL(frameImageObjectUrl);
      frameImageObjectUrl = null;
    }
    frameBgImage.removeAttribute("src");
    frame.classList.remove("has-image");
    if (!keepInputValue) {
      frameImageInput.value = "";
    }
  }

  function setFrameImageFromFile(file) {
    if (!file || !String(file.type || "").startsWith("image/")) return false;
    const objectUrl = URL.createObjectURL(file);
    if (frameImageObjectUrl) {
      URL.revokeObjectURL(frameImageObjectUrl);
    }
    frameImageObjectUrl = objectUrl;
    frameBgImage.src = objectUrl;
    frame.classList.add("has-image");
    return true;
  }

  let playMode4TextureIndex = 0;
  const playMode4Images = [];
  let pendingMode4ReplaceIndex = -1;

  function normalizeMode4ImageMode(value) {
    return value === "follow" ? "follow" : "mask";
  }

  function normalizeMode5CenterMode(value) {
    return value === "full" ? "full" : "anchor";
  }

  function normalizePlayMode4TextureIndex() {
    if (!playMode4Images.length) {
      playMode4TextureIndex = 0;
      return;
    }
    playMode4TextureIndex =
      ((playMode4TextureIndex % playMode4Images.length) + playMode4Images.length) %
      playMode4Images.length;
  }

  function renderMode4ImagesList() {
    if (!mode4ImagesList) return;
    mode4ImagesList.textContent = "";
    if (!playMode4Images.length) {
      const empty = document.createElement("div");
      empty.className = "mode4-images-empty";
      empty.textContent = "No images uploaded.";
      mode4ImagesList.appendChild(empty);
      return;
    }

    normalizePlayMode4TextureIndex();
    for (let i = 0; i < playMode4Images.length; i += 1) {
      const item = playMode4Images[i];
      const row = document.createElement("div");
      row.className = `mode4-image-item${i === playMode4TextureIndex ? " is-current" : ""}`;

      const thumb = document.createElement("img");
      thumb.className = "mode4-image-thumb";
      thumb.src = item.url;
      thumb.alt = item.name;

      const main = document.createElement("div");
      main.className = "mode4-image-main";

      const label = document.createElement("div");
      label.className = "mode4-image-label";
      label.title = item.name;
      label.textContent = `${i + 1}. ${item.name}`;

      const actions = document.createElement("div");
      actions.className = "mode4-image-actions";

      const replaceBtn = document.createElement("button");
      replaceBtn.type = "button";
      replaceBtn.textContent = "Replace";
      replaceBtn.dataset.action = "replace";
      replaceBtn.dataset.index = String(i);

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.textContent = "Delete";
      removeBtn.dataset.action = "delete";
      removeBtn.dataset.index = String(i);

      actions.appendChild(replaceBtn);
      actions.appendChild(removeBtn);
      main.appendChild(label);
      main.appendChild(actions);
      row.appendChild(thumb);
      row.appendChild(main);
      mode4ImagesList.appendChild(row);
    }
  }

  function updateMode4ImagesStatus() {
    const count = playMode4Images.length;
    if (!mode4ImagesStatus) return;
    if (!count) {
      mode4ImagesStatus.textContent = "Play mode 5 mask images: none.";
      renderMode4ImagesList();
      return;
    }
    normalizePlayMode4TextureIndex();
    mode4ImagesStatus.textContent =
      `Play mode 5 mask images: ${count} loaded (current ${playMode4TextureIndex + 1}/${count}).`;
    renderMode4ImagesList();
  }

  function createTextureFromImage(image) {
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
  }

  function loadImageFromObjectUrl(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Image load failed."));
      image.src = url;
    });
  }

  async function createPlayMode4ImageEntry(file) {
    if (!file || !String(file.type || "").startsWith("image/")) return null;
    const objectUrl = URL.createObjectURL(file);
    try {
      const image = await loadImageFromObjectUrl(objectUrl);
      return {
        texture: createTextureFromImage(image),
        url: objectUrl,
        name: String(file.name || "image"),
        width: Math.max(1, Number(image.naturalWidth) || Number(image.width) || 1),
        height: Math.max(1, Number(image.naturalHeight) || Number(image.height) || 1),
      };
    } catch (error) {
      URL.revokeObjectURL(objectUrl);
      return null;
    }
  }

  function disposePlayMode4ImageEntry(entry) {
    if (!entry) return;
    if (entry.texture) gl.deleteTexture(entry.texture);
    if (entry.url) URL.revokeObjectURL(entry.url);
  }

  async function appendPlayMode4Images(fileList) {
    const files = Array.from(fileList || []);
    let loaded = 0;
    for (const file of files) {
      const entry = await createPlayMode4ImageEntry(file);
      if (!entry) continue;
      playMode4Images.push(entry);
      loaded += 1;
    }
    normalizePlayMode4TextureIndex();
    updateMode4ImagesStatus();
    return loaded;
  }

  function clearPlayMode4Images(keepInputValue) {
    for (let i = 0; i < playMode4Images.length; i += 1) {
      disposePlayMode4ImageEntry(playMode4Images[i]);
    }
    playMode4Images.length = 0;
    playMode4TextureIndex = 0;
    pendingMode4ReplaceIndex = -1;
    if (!keepInputValue && mode4ImagesInput) {
      mode4ImagesInput.value = "";
    }
    if (!keepInputValue && mode4ReplaceInput) {
      mode4ReplaceInput.value = "";
    }
    updateMode4ImagesStatus();
  }

  function deletePlayMode4ImageAt(index) {
    const idx = Number(index);
    if (!Number.isInteger(idx) || idx < 0 || idx >= playMode4Images.length) return false;
    const removed = playMode4Images.splice(idx, 1)[0];
    disposePlayMode4ImageEntry(removed);
    if (playMode4TextureIndex >= playMode4Images.length) {
      playMode4TextureIndex = Math.max(0, playMode4Images.length - 1);
    } else if (idx < playMode4TextureIndex) {
      playMode4TextureIndex -= 1;
    }
    normalizePlayMode4TextureIndex();
    updateMode4ImagesStatus();
    return true;
  }

  async function replacePlayMode4ImageAt(index, file) {
    const idx = Number(index);
    if (!Number.isInteger(idx) || idx < 0 || idx >= playMode4Images.length) return false;
    const nextEntry = await createPlayMode4ImageEntry(file);
    if (!nextEntry) return false;
    const prevEntry = playMode4Images[idx];
    playMode4Images[idx] = nextEntry;
    disposePlayMode4ImageEntry(prevEntry);
    normalizePlayMode4TextureIndex();
    updateMode4ImagesStatus();
    return true;
  }

  function getCurrentPlayMode4Image() {
    if (!playMode4Images.length) return null;
    normalizePlayMode4TextureIndex();
    return playMode4Images[playMode4TextureIndex];
  }

  let isDraggingModel = false;
  let prevPointerX = 0;
  let prevPointerY = 0;
  let rotVelX = 0;
  let rotVelY = 0;
  let rotVelZ = 0;
  const playMotion = {
    vx: 0.22,
    vy: 0.36,
    vz: 0.15,
    targetX: 0.22,
    targetZ: 0.15,
    nextChangeMs: 0,
    yBaseSpeed: 0.95,
    yFreq1: 0.62,
    yFreq2: 1.21,
    yPhase1: 0,
    yPhase2: 1.4,
  };
  const playDims = {
    lengthCurrent: state.frustumLengthSvg,
    diameterCurrent: state.frustumLargeDiameterSvg,
    fitLengthCurrent: state.frustumLengthSvg,
    fitDiameterCurrent: state.frustumLargeDiameterSvg,
    flowStartSec: 0,
    lengthFreq: 0.24,
    lengthPhase1: 0.8,
    lengthPhase2: 2.3,
    diameterFreq: 0.31,
    diameterPhase1: 1.9,
    diameterPhase2: 0.4,
  };
  const playMode4 = {
    phase: "hold",
    phaseStartMs: 0,
    holdMs: 3000,
    spinMs: 1000,
    startYRad: -Math.PI / 2,
    yTurns: 1,
    zoomZ: 70,
    zoomOutExtra: constants.defaultMode4ZoomOutExtra,
    zoomOutPeakPhase: 0.68,
    easeAmount: constants.defaultMode4Ease,
    imageMode: constants.defaultMode4ImageMode,
    spinStartRampPhase: 0.24,
    expandedLengthSvg: constants.defaultMode4ExpandedLengthSvg,
    defaultScaleRatio:
      constants.defaultFrustumLargeDiameterSvg / constants.defaultFrustumLengthSvg,
    lengthCurrent: constants.defaultMode4ExpandedLengthSvg,
    diameterCurrent: 0,
    pickXMinRad: (-80 * Math.PI) / 180,
    pickXMaxRad: (80 * Math.PI) / 180,
    pickZMinRad: (-80 * Math.PI) / 180,
    pickZMaxRad: (80 * Math.PI) / 180,
    fixedXRad: 0,
    fixedZRad: 0,
    holdFromXRad: 0,
    holdFromZRad: 0,
    nextXRad: 0,
    nextZRad: 0,
    baseGreenActive: true,
    photoSwitchedInSpin: false,
  };
  playMode4.diameterCurrent = playMode4.expandedLengthSvg * playMode4.defaultScaleRatio;

  const playMode5 = {
    spinMs: 1700,
    phase: "shape",
    phaseStartMs: 0,
    switchAngleProgress: 0.75,
    baseAngleRad: 0,
    currentAngleRad: 0,
    showOlab: false,
    centerMode: constants.defaultMode5CenterMode,
    fixedXRad: 0,
    fixedZRad: 0,
    labAngleRad: 0,
    centerOffsetX: 0,
    centerOffsetY: 0,
    centerDeadbandWorld: 0.0003,
    centerFilterAlpha: 0.34,
    centerFilterMaxLeadWorld: 0.01,
    centerFilterReady: false,
    centerEma1X: 0,
    centerEma1Y: 0,
    centerEma2X: 0,
    centerEma2Y: 0,
    lastShowOlab: false,
  };

  function syncMode5CenterModeInput() {
    if (!mode5CenterModeSelect) return;
    const normalized = normalizeMode5CenterMode(playMode5.centerMode);
    playMode5.centerMode = normalized;
    if (document.activeElement !== mode5CenterModeSelect) {
      mode5CenterModeSelect.value = normalized;
    }
  }

  function setMode5CenterMode(value) {
    playMode5.centerMode = normalizeMode5CenterMode(value);
    syncMode5CenterModeInput();
    playMode5.centerFilterReady = false;
    if (state.playMode === "play6" && playMode5.centerMode !== "full") {
      stage.pos[0] = 0;
      stage.pos[1] = 0;
    }
  }

  function randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function randomMode4TiltX() {
    return randomRange(playMode4.pickXMinRad, playMode4.pickXMaxRad);
  }

  function randomMode4TiltZ() {
    return randomRange(playMode4.pickZMinRad, playMode4.pickZMaxRad);
  }

  function sampleOrganicWave(tSec, freq, phase1, phase2) {
    return (
      Math.sin(tSec * freq + phase1) * 0.58 +
      Math.sin(tSec * (freq * 1.73) + phase2) * 0.3 +
      Math.sin(tSec * (freq * 2.51) + phase1 * 0.6 - phase2 * 0.4) * 0.12
    );
  }

  function setupPlayYSpin(mode) {
    const base = mode === "play4" ? 0.84 : 0.96;
    playMotion.yBaseSpeed = base;
    playMotion.yFreq1 = randomRange(0.42, 0.9);
    playMotion.yFreq2 = randomRange(0.95, 1.9);
    playMotion.yPhase1 = randomRange(0, Math.PI * 2);
    playMotion.yPhase2 = randomRange(0, Math.PI * 2);
  }

  function samplePlayYSpinSpeed(timeMs) {
    const tSec = timeMs * 0.001;
    const wobble =
      Math.sin(tSec * playMotion.yFreq1 + playMotion.yPhase1) * 0.24 +
      Math.sin(tSec * playMotion.yFreq2 + playMotion.yPhase2) * 0.11;
    return clamp(playMotion.yBaseSpeed + wobble, 0.28, 1.95);
  }

  function schedulePlayTargets(nowMs) {
    playMotion.targetX = (Math.random() * 2 - 1) * 0.9;
    playMotion.targetZ = (Math.random() * 2 - 1) * 0.9;
    playMotion.nextChangeMs = nowMs + 1400 + Math.random() * 2200;
  }

  function schedulePlayOrbitTargets(nowMs) {
    playMotion.targetX = (Math.random() * 2 - 1) * 0.9;
    playMotion.targetZ = (Math.random() * 2 - 1) * 0.9;
    playMotion.nextChangeMs = nowMs + 1200 + Math.random() * 2000;
  }

  function schedulePlayDimensionTargets(nowMs) {
    playDims.flowStartSec = nowMs * 0.001;
    playDims.lengthFreq = randomRange(0.16, 0.33);
    playDims.lengthPhase1 = randomRange(0, Math.PI * 2);
    playDims.lengthPhase2 = randomRange(0, Math.PI * 2);
    playDims.diameterFreq = randomRange(0.22, 0.42);
    playDims.diameterPhase1 = randomRange(0, Math.PI * 2);
    playDims.diameterPhase2 = randomRange(0, Math.PI * 2);
  }

  function setMode5LabAngle(rad) {
    playMode5.labAngleRad = rad;
    if (mode5OlabSvg) {
      mode5OlabSvg.style.transform = `rotateY(${rad}rad)`;
    }
  }

  function resetPlayMode5(nowMs) {
    const now = Number.isFinite(nowMs) ? nowMs : performance.now();
    playMode5.phase = "shape";
    playMode5.phaseStartMs = now;
    playMode5.baseAngleRad = 0;
    playMode5.currentAngleRad = 0;
    playMode5.showOlab = false;
    playMode5.fixedXRad = 0;
    playMode5.fixedZRad = 0;
    playMode5.centerOffsetX = 0;
    playMode5.centerOffsetY = 0;
    playMode5.centerFilterReady = false;
    playMode5.centerEma1X = 0;
    playMode5.centerEma1Y = 0;
    playMode5.centerEma2X = 0;
    playMode5.centerEma2Y = 0;
    playMode5.lastShowOlab = false;
    setMode5LabAngle(0);
  }

  function setMode5OlabVisible(visible) {
    if (!frame || !mode5OlabWrap) return;
    if (visible) {
      frame.classList.add("mode5-olab-active");
    } else {
      frame.classList.remove("mode5-olab-active");
    }
  }

  function updateMode5OlabTransform() {
    if (!mode5OlabWrap || !mode5OlabSvg) return;
    const isVisible = state.playMode === "play6" && playMode5.showOlab;
    if (!isVisible) {
      setMode5OlabVisible(false);
      return;
    }

    const rect = frame.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) {
      setMode5OlabVisible(false);
      return;
    }

    const pxScaleX = canvas.width / Math.max(1, rect.width);
    const pxScaleY = canvas.height / Math.max(1, rect.height);
    const pixelToCss = 1 / Math.max(0.0001, (pxScaleX + pxScaleY) * 0.5);

    const sphereCenterWorld = transformToWorld([0, 0, 0], sphereObject);
    const sphereEdgeWorld = transformToWorld([0, constants.sphereRadiusWorld, 0], sphereObject);
    const sphereCenterPx = projectWorldToScreen(
      sphereCenterWorld,
      canvas.width,
      canvas.height,
      state.cameraZ,
    );
    const sphereEdgePx = projectWorldToScreen(
      sphereEdgeWorld,
      canvas.width,
      canvas.height,
      state.cameraZ,
    );

    if (!sphereCenterPx || !sphereEdgePx) {
      setMode5OlabVisible(false);
      return;
    }

    const sphereRadiusPx = Math.hypot(
      sphereEdgePx.x - sphereCenterPx.x,
      sphereEdgePx.y - sphereCenterPx.y,
    );
    const sphereDiameterCss = sphereRadiusPx * 2 * pixelToCss;
    const unitScale = sphereDiameterCss / constants.mode5OlabODiameterSvg;
    const widthCss = constants.mode5OlabViewWidthSvg * unitScale;
    const heightCss = constants.mode5OlabViewHeightSvg * unitScale;
    const isFullCenterMode = state.playMode === "play6" && playMode5.centerMode === "full";
    const anchorCssX = isFullCenterMode ? rect.width * 0.5 : sphereCenterPx.x / pxScaleX;
    const anchorCssY = isFullCenterMode ? rect.height * 0.5 : sphereCenterPx.y / pxScaleY;
    const anchorSvgX = isFullCenterMode
      ? constants.mode5OlabViewWidthSvg * 0.5
      : constants.mode5OlabOCenterXSvg;
    const anchorSvgY = isFullCenterMode
      ? constants.mode5OlabViewHeightSvg * 0.5
      : constants.mode5OlabOCenterYSvg;
    const olabAnchorX = anchorSvgX * unitScale;
    const olabAnchorY = anchorSvgY * unitScale;
    const olabCenterX = constants.mode5OlabOCenterXSvg * unitScale;
    const olabCenterY = constants.mode5OlabOCenterYSvg * unitScale;

    mode5OlabWrap.style.left = `${anchorCssX - olabAnchorX}px`;
    mode5OlabWrap.style.top = `${anchorCssY - olabAnchorY}px`;
    mode5OlabWrap.style.width = `${widthCss}px`;
    mode5OlabWrap.style.height = `${heightCss}px`;
    mode5OlabWrap.style.transformOrigin = `${olabCenterX}px ${olabCenterY}px`;
    mode5OlabWrap.style.transform = "none";
    setMode5OlabVisible(true);

    if (isFullCenterMode) {
      const labRect = mode5OlabLabGroup ? mode5OlabLabGroup.getBoundingClientRect() : null;
      const oRect = mode5OlabOPath ? mode5OlabOPath.getBoundingClientRect() : null;
      const hasLabRect =
        labRect &&
        Number.isFinite(labRect.left) &&
        Number.isFinite(labRect.top) &&
        labRect.width > 0 &&
        labRect.height > 0;
      const hasORect =
        oRect &&
        Number.isFinite(oRect.left) &&
        Number.isFinite(oRect.top) &&
        oRect.width > 0 &&
        oRect.height > 0;
      if (hasLabRect || hasORect) {
        let minX = hasLabRect ? labRect.left : oRect.left;
        let maxX = hasLabRect ? labRect.right : oRect.right;
        let minY = hasLabRect ? labRect.top : oRect.top;
        let maxY = hasLabRect ? labRect.bottom : oRect.bottom;
        if (hasORect) {
          minX = Math.min(minX, oRect.left);
          maxX = Math.max(maxX, oRect.right);
          minY = Math.min(minY, oRect.top);
          maxY = Math.max(maxY, oRect.bottom);
        }
        const currentCenterX = (minX + maxX) * 0.5;
        const currentCenterY = (minY + maxY) * 0.5;
        const targetCenterX = rect.left + rect.width * 0.5;
        const targetCenterY = rect.top + rect.height * 0.5;
        const deltaX = targetCenterX - currentCenterX;
        const deltaY = targetCenterY - currentCenterY;
        if (Math.abs(deltaX) > 0.05 || Math.abs(deltaY) > 0.05) {
          const left = parseFloat(mode5OlabWrap.style.left) || 0;
          const top = parseFloat(mode5OlabWrap.style.top) || 0;
          mode5OlabWrap.style.left = `${left + deltaX}px`;
          mode5OlabWrap.style.top = `${top + deltaY}px`;
        }
      }
    }
  }

  function accumulateProjectedStats(localPositions, object, width, height, cameraForFit, vertexStep, stats) {
    const step = Math.max(1, Math.floor(vertexStep));
    let vertexIndex = 0;
    for (let i = 0; i < localPositions.length; i += 3, vertexIndex += 1) {
      if (vertexIndex % step !== 0) continue;
      const world = transformToWorld(
        [localPositions[i], localPositions[i + 1], localPositions[i + 2]],
        object,
      );
      const screen = projectWorldToScreen(world, width, height, cameraForFit);
      if (!screen) continue;
      stats.minX = Math.min(stats.minX, screen.x);
      stats.maxX = Math.max(stats.maxX, screen.x);
      stats.minY = Math.min(stats.minY, screen.y);
      stats.maxY = Math.max(stats.maxY, screen.y);
      stats.depthSum += screen.depth;
      stats.count += 1;
    }
  }

  function computeMode5CenterOffsetWorld() {
    const width = Math.max(2, canvas.width);
    const height = Math.max(2, canvas.height);
    const stats = {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity,
      depthSum: 0,
      count: 0,
    };

    accumulateProjectedStats(
      mode5SphereCenterPositions,
      sphereObject,
      width,
      height,
      state.cameraZ,
      1,
      stats,
    );
    accumulateProjectedStats(
      frustumLocalPositions,
      frustumObject,
      width,
      height,
      state.cameraZ,
      1,
      stats,
    );
    accumulateProjectedStats(
      frustumCapLocalPositions,
      frustumLargeBaseObject,
      width,
      height,
      state.cameraZ,
      1,
      stats,
    );

    if (
      stats.count < 20 ||
      !Number.isFinite(stats.minX) ||
      !Number.isFinite(stats.maxX) ||
      !Number.isFinite(stats.minY) ||
      !Number.isFinite(stats.maxY)
    ) {
      return { x: 0, y: 0 };
    }

    const centerX = (stats.minX + stats.maxX) * 0.5;
    const centerY = (stats.minY + stats.maxY) * 0.5;
    const targetX = width * 0.5;
    const targetY = height * 0.5;
    const deltaPxX = targetX - centerX;
    const deltaPxY = targetY - centerY;

    const depth = Math.max(0.25, stats.depthSum / Math.max(1, stats.count));
    const aspect = width / height;
    const f = 1 / Math.tan((38 * Math.PI / 180) * 0.5);
    const worldPerPixelX = (2 * depth * aspect) / (width * f);
    const worldPerPixelY = (2 * depth) / (height * f);
    return {
      x: clamp(deltaPxX * worldPerPixelX, -24, 24),
      y: clamp(-deltaPxY * worldPerPixelY, -24, 24),
    };
  }

  function applyPlayMode5State(timeMs) {
    const spinMs = Math.max(300, playMode5.spinMs);
    let elapsed = Math.max(0, timeMs - playMode5.phaseStartMs);
    while (elapsed >= spinMs) {
      elapsed -= spinMs;
      playMode5.phaseStartMs = timeMs - elapsed;
      playMode5.baseAngleRad -= Math.PI * 2;
      playMode5.phase = playMode5.phase === "shape" ? "olab" : "shape";
    }
    const progress = clamp(elapsed / spinMs, 0, 1);
    const eased = easeInOutStrong01(progress);
    const angle = playMode5.baseAngleRad - Math.PI * 2 * eased;
    const starterIsOlab = playMode5.phase === "olab";
    const switchAngleProgress = clamp(playMode5.switchAngleProgress, 0.05, 0.95);
    const previousShowOlab = playMode5.lastShowOlab;

    playMode5.currentAngleRad = angle;
    playMode5.showOlab = eased < switchAngleProgress ? starterIsOlab : !starterIsOlab;
    const didSwitchVisual = playMode5.showOlab !== previousShowOlab;
    playMode5.lastShowOlab = playMode5.showOlab;
    stage.rotX = playMode5.fixedXRad;
    stage.rotY = angle;
    stage.rotZ = playMode5.fixedZRad;
    stage.pos[0] = 0;
    stage.pos[1] = 0;
    let posX = 0;
    let posY = 0;
    if (playMode5.centerMode === "full") {
      const centerOffset = computeMode5CenterOffsetWorld();
      const alpha = clamp(playMode5.centerFilterAlpha, 0.05, 0.95);
      if (!playMode5.centerFilterReady || didSwitchVisual) {
        playMode5.centerEma1X = centerOffset.x;
        playMode5.centerEma1Y = centerOffset.y;
        playMode5.centerEma2X = centerOffset.x;
        playMode5.centerEma2Y = centerOffset.y;
        playMode5.centerFilterReady = true;
        posX = Math.abs(centerOffset.x) < playMode5.centerDeadbandWorld ? 0 : centerOffset.x;
        posY = Math.abs(centerOffset.y) < playMode5.centerDeadbandWorld ? 0 : centerOffset.y;
      } else {
        playMode5.centerEma1X += (centerOffset.x - playMode5.centerEma1X) * alpha;
        playMode5.centerEma1Y += (centerOffset.y - playMode5.centerEma1Y) * alpha;
        playMode5.centerEma2X += (playMode5.centerEma1X - playMode5.centerEma2X) * alpha;
        playMode5.centerEma2Y += (playMode5.centerEma1Y - playMode5.centerEma2Y) * alpha;
        const maxLead = Math.max(0.0001, playMode5.centerFilterMaxLeadWorld);
        const filteredX = 2 * playMode5.centerEma1X - playMode5.centerEma2X;
        const filteredY = 2 * playMode5.centerEma1Y - playMode5.centerEma2Y;
        const correctedX = clamp(filteredX, centerOffset.x - maxLead, centerOffset.x + maxLead);
        const correctedY = clamp(filteredY, centerOffset.y - maxLead, centerOffset.y + maxLead);

        posX = Math.abs(correctedX) < playMode5.centerDeadbandWorld ? 0 : correctedX;
        posY = Math.abs(correctedY) < playMode5.centerDeadbandWorld ? 0 : correctedY;
      }
      playMode5.centerOffsetX = posX;
      playMode5.centerOffsetY = posY;
    } else {
      playMode5.centerOffsetX = 0;
      playMode5.centerOffsetY = 0;
      playMode5.centerFilterReady = false;
    }
    stage.pos[0] = posX;
    stage.pos[1] = posY;
    setMode5LabAngle(angle);
  }

  function applyPlayMode4State(timeMs) {
    const expandedLength = playMode4.expandedLengthSvg;
    const expandedDiameter = playMode4.expandedLengthSvg * playMode4.defaultScaleRatio;
    const wasBaseGreenActive = playMode4.baseGreenActive;
    let nextLength = expandedLength;
    let nextDiameter = expandedDiameter;
    let nextY = playMode4.startYRad;
    let nextX = playMode4.fixedXRad;
    let nextZ = playMode4.fixedZRad;
    let nextCameraZ = playMode4.zoomZ;
    let baseGreenActive = true;

    if (playMode4.phase === "hold") {
      const holdElapsed = Math.max(0, timeMs - playMode4.phaseStartMs);
      const holdProgress = clamp(holdElapsed / Math.max(1, playMode4.holdMs), 0, 1);
      const holdEase = applyMode4Ease01(holdProgress);
      nextX = playMode4.holdFromXRad + (playMode4.nextXRad - playMode4.holdFromXRad) * holdEase;
      nextZ = playMode4.holdFromZRad + (playMode4.nextZRad - playMode4.holdFromZRad) * holdEase;

      if (holdElapsed >= playMode4.holdMs) {
        playMode4.phase = "spin";
        playMode4.phaseStartMs = timeMs - (holdElapsed - playMode4.holdMs);
        playMode4.photoSwitchedInSpin = false;
        playMode4.fixedXRad = playMode4.nextXRad;
        playMode4.fixedZRad = playMode4.nextZRad;
        nextX = playMode4.fixedXRad;
        nextZ = playMode4.fixedZRad;
      }
    }

    if (playMode4.phase === "spin") {
      const spinElapsed = Math.max(0, timeMs - playMode4.phaseStartMs);
      const spinProgress = clamp(spinElapsed / Math.max(1, playMode4.spinMs), 0, 1);
      const spinProgressRamped = applyMode4SpinStartRamp(spinProgress);
      const easedSpin = applyMode4Ease01(spinProgressRamped);
      nextY = playMode4.startYRad - Math.PI * 2 * playMode4.yTurns * easedSpin;

      // Zoom motion in spin:
      // hold steady before spin, then move away, then come back near the end.
      const peakPhase = clamp(playMode4.zoomOutPeakPhase, 0.35, 0.9);
      let zoomBlend = 0;
      if (spinProgressRamped <= peakPhase) {
        zoomBlend = applyMode4Ease01(spinProgressRamped / Math.max(0.001, peakPhase));
      } else {
        zoomBlend =
          1 -
          applyMode4Ease01(
            (spinProgressRamped - peakPhase) / Math.max(0.001, 1 - peakPhase),
          );
      }
      nextCameraZ = clamp(
        playMode4.zoomZ + playMode4.zoomOutExtra * zoomBlend,
        constants.minCameraZ,
        constants.maxCameraZ,
      );

      // Green only near start/end; middle interval (side-facing) returns to original color.
      baseGreenActive = easedSpin <= 0.125 || easedSpin >= 0.875;
      if (
        !playMode4.photoSwitchedInSpin &&
        !wasBaseGreenActive &&
        baseGreenActive &&
        easedSpin >= 0.875 &&
        playMode4Images.length > 1
      ) {
        playMode4TextureIndex = (playMode4TextureIndex + 1) % playMode4Images.length;
        playMode4.photoSwitchedInSpin = true;
        updateMode4ImagesStatus();
      }

      // x/z stay fixed per spin cycle.
      nextX = playMode4.fixedXRad;
      nextZ = playMode4.fixedZRad;

      // Size returns to the expanded/original state before the spin fully ends:
      // expanded -> default -> expanded by 3/4 turn -> hold expanded through the final quarter.
      const sizePhase = easedSpin;
      const sizeBlend = computeMode4SizeBlend01(sizePhase);
      nextLength =
        expandedLength + (constants.defaultFrustumLengthSvg - expandedLength) * sizeBlend;
      nextDiameter =
        expandedDiameter + (constants.defaultFrustumLargeDiameterSvg - expandedDiameter) * sizeBlend;

      if (spinElapsed >= playMode4.spinMs) {
        playMode4.phase = "hold";
        playMode4.phaseStartMs = timeMs - (spinElapsed - playMode4.spinMs);
        nextY = playMode4.startYRad;
        nextX = playMode4.fixedXRad;
        nextZ = playMode4.fixedZRad;
        nextLength = expandedLength;
        nextDiameter = expandedDiameter;
        baseGreenActive = true;
        nextCameraZ = playMode4.zoomZ;
        playMode4.holdFromXRad = playMode4.fixedXRad;
        playMode4.holdFromZRad = playMode4.fixedZRad;
        playMode4.nextXRad = randomMode4TiltX();
        playMode4.nextZRad = randomMode4TiltZ();
        const holdCarry = Math.max(0, spinElapsed - playMode4.spinMs);
        const holdProgress = clamp(holdCarry / Math.max(1, playMode4.holdMs), 0, 1);
        const holdEase = applyMode4Ease01(holdProgress);
        nextX = playMode4.holdFromXRad + (playMode4.nextXRad - playMode4.holdFromXRad) * holdEase;
        nextZ = playMode4.holdFromZRad + (playMode4.nextZRad - playMode4.holdFromZRad) * holdEase;
      }
    }

    stage.rotX = nextX;
    stage.rotY = nextY;
    stage.rotZ = nextZ;
    stage.pos[1] = 0;
    state.cameraZ = nextCameraZ;
    updateCameraUniforms();
    syncZoomInputs();

    if (
      Math.abs(nextLength - playMode4.lengthCurrent) > 0.2 ||
      Math.abs(nextDiameter - playMode4.diameterCurrent) > 0.2
    ) {
      playMode4.lengthCurrent = nextLength;
      playMode4.diameterCurrent = nextDiameter;
      rebuildFrustumFor(playMode4.lengthCurrent, playMode4.diameterCurrent);
    }
    playMode4.baseGreenActive = baseGreenActive;
  }

  canvas.addEventListener("pointerdown", (event) => {
    if (state.playMode !== "off") return;
    isDraggingModel = true;
    prevPointerX = event.clientX;
    prevPointerY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!isDraggingModel) return;
    const dx = event.clientX - prevPointerX;
    const dy = event.clientY - prevPointerY;
    prevPointerX = event.clientX;
    prevPointerY = event.clientY;
    stage.rotY += dx * 0.012;
    stage.rotX += dy * 0.012;
    stage.rotZ += (dx - dy) * 0.0025;
    rotVelY = dx * 0.0019;
    rotVelX = dy * 0.0019;
    rotVelZ = (dx - dy) * 0.00055;
  });

  canvas.addEventListener("pointerup", (event) => {
    if (!isDraggingModel) return;
    isDraggingModel = false;
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
  });

  canvas.addEventListener("pointercancel", () => {
    isDraggingModel = false;
  });

  canvas.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      state.cameraZ = clamp(
        state.cameraZ + event.deltaY * 0.03,
        constants.minCameraZ,
        constants.maxCameraZ,
      );
      updateCameraUniforms();
      syncZoomInputs();
    },
    { passive: false },
  );

  let isResizingFrame = false;
  let resizeStartX = 0;
  let resizeStartY = 0;
  let resizeStartWidth = 0;
  let resizeStartHeight = 0;

  resizeHandle.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    isResizingFrame = true;
    resizeStartX = event.clientX;
    resizeStartY = event.clientY;
    resizeStartWidth = state.frameWidth;
    resizeStartHeight = state.frameHeight;
    resizeHandle.classList.add("active");
    resizeHandle.setPointerCapture(event.pointerId);
  });

  resizeHandle.addEventListener("pointermove", (event) => {
    if (!isResizingFrame) return;
    const dx = event.clientX - resizeStartX;
    const dy = event.clientY - resizeStartY;
    applyFrameSize(resizeStartWidth + dx * 2, resizeStartHeight + dy * 2);
  });

  resizeHandle.addEventListener("pointerup", (event) => {
    isResizingFrame = false;
    resizeHandle.classList.remove("active");
    resizeHandle.releasePointerCapture(event.pointerId);
  });

  resizeHandle.addEventListener("pointercancel", () => {
    isResizingFrame = false;
    resizeHandle.classList.remove("active");
  });

  shapeColorInput.addEventListener("input", () => {
    updateShapeColor(shapeColorInput.value);
  });

  shadingModeSelect.addEventListener("change", () => {
    updateShadingMode(shadingModeSelect.value);
  });

  if (depthBlurToggle) {
    depthBlurToggle.addEventListener("change", () => {
      state.depthBlur = depthBlurToggle.checked;
      syncAppearancePanels();
    });
  }

  if (depthDynamicToggle) {
    depthDynamicToggle.addEventListener("change", () => {
      state.depthDynamic = depthDynamicToggle.checked;
      syncAppearancePanels();
    });
  }

  playModeSelect.addEventListener("change", () => {
    state.playMode = playModeSelect.value;
    syncModePanels();
    rotVelX = 0;
    rotVelY = 0;
    rotVelZ = 0;
    stage.pos[0] = 0;
    stage.pos[1] = 0;
    const now = performance.now();
    setMode5OlabVisible(false);
    playMode5.showOlab = false;
    if (state.playMode === "play5") {
      playMode4.phase = "hold";
      playMode4.phaseStartMs = now;
      playMode4.lengthCurrent = playMode4.expandedLengthSvg;
      playMode4.diameterCurrent = playMode4.expandedLengthSvg * playMode4.defaultScaleRatio;
      playMode4.baseGreenActive = true;
      playMode4.photoSwitchedInSpin = false;
      playMode4.fixedXRad = 0;
      playMode4.fixedZRad = 0;
      playMode4.holdFromXRad = 0;
      playMode4.holdFromZRad = 0;
      playMode4.nextXRad = randomMode4TiltX();
      playMode4.nextZRad = randomMode4TiltZ();
      stage.rotX = 0;
      stage.rotY = playMode4.startYRad;
      stage.rotZ = 0;
      stage.pos[1] = 0;
      state.cameraZ = playMode4.zoomZ;
      updateCameraUniforms();
      syncZoomInputs();
      syncMode4ExpandedLengthInput();
      syncMode4MotionInputs();
      rebuildFrustumFor(playMode4.lengthCurrent, playMode4.diameterCurrent);
      return;
    }
    if (state.playMode === "play6") {
      resetPlayMode5(now);
      stage.rotX = playMode5.fixedXRad;
      stage.rotY = 0;
      stage.rotZ = playMode5.fixedZRad;
      setMode5CenterMode(mode5CenterModeSelect ? mode5CenterModeSelect.value : playMode5.centerMode);
      rebuildFrustumFor(state.frustumLengthSvg, state.frustumLargeDiameterSvg);
      return;
    }
    if (
      state.playMode === "play1" ||
      state.playMode === "play2" ||
      state.playMode === "play3" ||
      state.playMode === "play4"
    ) {
      setupPlayYSpin(state.playMode);
      playMotion.vy = samplePlayYSpinSpeed(now);
    }
    if (
      state.playMode === "play1" ||
      state.playMode === "play2" ||
      state.playMode === "play3"
    ) {
      schedulePlayOrbitTargets(now);
    } else if (state.playMode === "play4") {
      schedulePlayTargets(now);
    }
    if (state.playMode === "play2") {
      const play2MinLength = Math.max(
        constants.minLengthSvg,
        constants.minLargeDiameterSvg / constants.playMode2MaxDiameterToLengthRatio,
      );
      playDims.lengthCurrent = Math.max(state.frustumLengthSvg, play2MinLength);
      playDims.diameterCurrent = clamp(
        state.frustumLargeDiameterSvg,
        constants.minLargeDiameterSvg,
        Math.min(
          constants.maxLargeDiameterSvg,
          playDims.lengthCurrent * constants.playMode2MaxDiameterToLengthRatio,
        ),
      );
      schedulePlayDimensionTargets(now);
      rebuildFrustumFor(playDims.lengthCurrent, playDims.diameterCurrent);
      return;
    }
    if (state.playMode === "play3") {
      rebuildFrustumFor(constants.fixedPlay3LengthSvg, getFixedPlay3DiameterSvg());
      return;
    }
    if (state.playMode === "play4") {
      playDims.fitLengthCurrent = state.frustumLengthSvg;
      playDims.fitDiameterCurrent = state.frustumLargeDiameterSvg;
      rebuildFrustumFor(playDims.fitLengthCurrent, playDims.fitDiameterCurrent);
      return;
    }
    rebuildFrustumFor(state.frustumLengthSvg, state.frustumLargeDiameterSvg);
  });

  frustumLengthRange.addEventListener("input", () => {
    setFrustumLength(frustumLengthRange.value);
  });
  frustumLengthNumber.addEventListener("input", () => {
    setFrustumLength(frustumLengthNumber.value);
  });

  frustumDiameterRange.addEventListener("input", () => {
    setFrustumLargeDiameter(frustumDiameterRange.value);
  });
  frustumDiameterNumber.addEventListener("input", () => {
    setFrustumLargeDiameter(frustumDiameterNumber.value);
  });

  gapRange.addEventListener("input", () => {
    setGap(gapRange.value);
  });
  gapNumber.addEventListener("input", () => {
    setGap(gapNumber.value);
  });
  gapNumber.addEventListener("blur", () => {
    gapNumber.value = state.gapRatio.toFixed(1);
  });

  proportionLockInput.addEventListener("change", () => {
    state.lockProportion = proportionLockInput.checked;
    if (state.lockProportion && state.frustumLengthSvg !== 0) {
      state.lockedRatio = Math.min(
        state.frustumLargeDiameterSvg / state.frustumLengthSvg,
        constants.maxDiameterToLengthRatio,
      );
    }
  });

  zoomRange.addEventListener("input", () => {
    state.cameraZ = clamp(
      Number(zoomRange.value),
      constants.minCameraZ,
      constants.maxCameraZ,
    );
    updateCameraUniforms();
    syncZoomInputs();
  });

  zoomNumber.addEventListener("input", () => {
    const raw = Number(zoomNumber.value);
    if (!Number.isFinite(raw)) return;
    state.cameraZ = clamp(
      raw,
      constants.minCameraZ,
      constants.maxCameraZ,
    );
    updateCameraUniforms();
    syncZoomInputs();
  });

  zoomNumber.addEventListener("blur", () => {
    zoomNumber.value = state.cameraZ.toFixed(1);
  });

  mode4ExpandedLengthInput.addEventListener("input", () => {
    setMode4ExpandedLength(mode4ExpandedLengthInput.value);
  });

  mode4ExpandedLengthInput.addEventListener("blur", () => {
    syncMode4ExpandedLengthInput();
  });

  mode4EaseRange.addEventListener("input", () => {
    setMode4EaseAmount(mode4EaseRange.value);
  });
  mode4EaseNumber.addEventListener("input", () => {
    setMode4EaseAmount(mode4EaseNumber.value);
  });
  mode4EaseNumber.addEventListener("blur", () => {
    syncMode4MotionInputs();
  });

  mode4ZoomAmountRange.addEventListener("input", () => {
    setMode4ZoomOutAmount(mode4ZoomAmountRange.value);
  });
  mode4ZoomAmountNumber.addEventListener("input", () => {
    setMode4ZoomOutAmount(mode4ZoomAmountNumber.value);
  });
  mode4ZoomAmountNumber.addEventListener("blur", () => {
    syncMode4MotionInputs();
  });

  mode4ImageModeSelect.addEventListener("change", () => {
    playMode4.imageMode = normalizeMode4ImageMode(mode4ImageModeSelect.value);
    mode4ImageModeSelect.value = playMode4.imageMode;
  });

  if (mode5CenterModeSelect) {
    mode5CenterModeSelect.addEventListener("change", () => {
      setMode5CenterMode(mode5CenterModeSelect.value);
    });
  }

  if (frameBgColorInput) {
    frameBgColorInput.addEventListener("input", () => {
      applyFrameBackgroundColor(frameBgColorInput.value);
    });
  }

  frameWidthInput.addEventListener("input", () => {
    const raw = Number(frameWidthInput.value);
    if (!Number.isFinite(raw)) return;
    applyFrameSize(raw, state.frameHeight);
  });

  frameHeightInput.addEventListener("input", () => {
    const raw = Number(frameHeightInput.value);
    if (!Number.isFinite(raw)) return;
    applyFrameSize(state.frameWidth, raw);
  });

  frameWidthInput.addEventListener("blur", () => {
    frameWidthInput.value = String(Math.round(state.frameWidth));
  });

  frameHeightInput.addEventListener("blur", () => {
    frameHeightInput.value = String(Math.round(state.frameHeight));
  });

  frameImageInput.addEventListener("change", () => {
    const file = frameImageInput.files && frameImageInput.files[0];
    if (!file) return;
    const ok = setFrameImageFromFile(file);
    copyStatus.textContent = ok
      ? "Background image loaded."
      : "Selected file is not an image.";
    if (!ok) {
      frameImageInput.value = "";
    }
  });

  clearImageButton.addEventListener("click", () => {
    clearFrameImage();
    copyStatus.textContent = "Background image cleared.";
  });

  mode4ImagesInput.addEventListener("change", async () => {
    const files = mode4ImagesInput.files;
    if (!files || !files.length) return;
    const added = await appendPlayMode4Images(files);
    copyStatus.textContent =
      added > 0
        ? `${added} image${added > 1 ? "s" : ""} added for play mode 5 mask.`
        : "No valid images were added for play mode 5 mask.";
    mode4ImagesInput.value = "";
  });

  mode4ImagesList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const action = target.dataset.action;
    const index = Number(target.dataset.index);
    if (!Number.isInteger(index)) return;

    if (action === "delete") {
      const removed = deletePlayMode4ImageAt(index);
      copyStatus.textContent = removed
        ? "Image removed from play mode 5 mask."
        : "Image remove failed.";
      return;
    }

    if (action === "replace") {
      pendingMode4ReplaceIndex = index;
      mode4ReplaceInput.value = "";
      mode4ReplaceInput.click();
    }
  });

  mode4ReplaceInput.addEventListener("change", async () => {
    if (pendingMode4ReplaceIndex < 0) return;
    const file = mode4ReplaceInput.files && mode4ReplaceInput.files[0];
    if (!file) return;
    const ok = await replacePlayMode4ImageAt(pendingMode4ReplaceIndex, file);
    copyStatus.textContent = ok
      ? "Image replaced for play mode 5 mask."
      : "Image replace failed.";
    pendingMode4ReplaceIndex = -1;
    mode4ReplaceInput.value = "";
  });

  clearMode4ImagesButton.addEventListener("click", () => {
    clearPlayMode4Images();
    copyStatus.textContent = "Play mode 5 mask images cleared.";
  });

  window.addEventListener("beforeunload", () => {
    clearFrameImage(true);
    clearPlayMode4Images(true);
  });

  function resetScene() {
    state.frustumLengthSvg = constants.defaultFrustumLengthSvg;
    state.frustumLargeDiameterSvg = constants.defaultFrustumLargeDiameterSvg;
    state.gapRatio = constants.gapSvg / constants.sphereDiameterSvg;
    state.lockProportion = true;
    state.lockedRatio =
      constants.defaultFrustumLargeDiameterSvg / constants.defaultFrustumLengthSvg;
    state.cameraZ = constants.defaultCameraZ;
    state.frameBgColor = constants.defaultFrameBgColor;
    state.depthBlur = false;
    state.depthDynamic = false;

    stage.pos[0] = 0;
    stage.pos[1] = 0;
    stage.pos[2] = 0;
    stage.rotX = 0;
    stage.rotY = 0;
    stage.rotZ = 0;
    rotVelX = 0;
    rotVelY = 0;
    rotVelZ = 0;

    proportionLockInput.checked = true;
    playModeSelect.value = "off";
    state.playMode = "off";
    playDims.lengthCurrent = state.frustumLengthSvg;
    playDims.diameterCurrent = state.frustumLargeDiameterSvg;
    playDims.fitLengthCurrent = state.frustumLengthSvg;
    playDims.fitDiameterCurrent = state.frustumLargeDiameterSvg;
    playMode4.phase = "hold";
    playMode4.phaseStartMs = performance.now();
    playMode4.expandedLengthSvg = constants.defaultMode4ExpandedLengthSvg;
    playMode4.zoomOutExtra = constants.defaultMode4ZoomOutExtra;
    playMode4.easeAmount = constants.defaultMode4Ease;
    playMode4.imageMode = constants.defaultMode4ImageMode;
    playMode4.lengthCurrent = playMode4.expandedLengthSvg;
    playMode4.diameterCurrent = playMode4.expandedLengthSvg * playMode4.defaultScaleRatio;
    playMode4.baseGreenActive = true;
    playMode4.photoSwitchedInSpin = false;
    playMode4.fixedXRad = 0;
    playMode4.fixedZRad = 0;
    playMode4.holdFromXRad = 0;
    playMode4.holdFromZRad = 0;
    playMode4.nextXRad = randomMode4TiltX();
    playMode4.nextZRad = randomMode4TiltZ();
    resetPlayMode5(performance.now());
    setMode5CenterMode(constants.defaultMode5CenterMode);
    setMode5OlabVisible(false);
    setupPlayYSpin("play1");
    schedulePlayDimensionTargets(performance.now());
    shadingModeSelect.value = "lit";
    updateShadingMode("lit");
    shapeColorInput.value = constants.defaultColorHex;
    updateShapeColor(constants.defaultColorHex);
    syncAppearancePanels();
    syncDimensionInputs();
    syncMode4ExpandedLengthInput();
    syncMode4MotionInputs();
    syncModePanels();
    mode4ImageModeSelect.value = playMode4.imageMode;
    rebuildFrustumFor(state.frustumLengthSvg, state.frustumLargeDiameterSvg);
    updateCameraUniforms();
    syncZoomInputs();
    applyFrameBackgroundColor(state.frameBgColor);
    applyFrameSize(constants.defaultFrameWidth, constants.defaultFrameHeight);
    updateRotationInputs();
  }

  resetButton.addEventListener("click", resetScene);

  window.addEventListener("resize", () => {
    updateWorkspaceShellBounds();
    resizeCanvasToFrame();
  });

  function wrapDeg(valueDeg) {
    let d = valueDeg % 360;
    if (d > 180) d -= 360;
    if (d <= -180) d += 360;
    return d;
  }

  function updateRotationInputs() {
    const xDeg = wrapDeg((stage.rotX * 180) / Math.PI);
    const yDeg = wrapDeg((stage.rotY * 180) / Math.PI);
    const zDeg = wrapDeg((stage.rotZ * 180) / Math.PI);
    if (document.activeElement !== rotXInput) rotXInput.value = xDeg.toFixed(1);
    if (document.activeElement !== rotYInput) rotYInput.value = yDeg.toFixed(1);
    if (document.activeElement !== rotZInput) rotZInput.value = zDeg.toFixed(1);
  }

  function setRotationFromInput(input, axis) {
    const raw = Number(input.value);
    if (!Number.isFinite(raw)) return;
    const rad = (raw * Math.PI) / 180;
    if (axis === "x") stage.rotX = rad;
    if (axis === "y") stage.rotY = rad;
    if (axis === "z") stage.rotZ = rad;
    rotVelX = 0;
    rotVelY = 0;
    rotVelZ = 0;
  }

  function copyTextFallback(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }

  function convexHull(points) {
    if (points.length < 3) return points.slice();
    const sorted = points.slice().sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x));
    const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

    const lower = [];
    for (const p of sorted) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
        lower.pop();
      }
      lower.push(p);
    }

    const upper = [];
    for (let i = sorted.length - 1; i >= 0; i -= 1) {
      const p = sorted[i];
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
        upper.pop();
      }
      upper.push(p);
    }

    lower.pop();
    upper.pop();
    return lower.concat(upper);
  }

  function sampleSpherePoints(radius, latSegments, lonSegments) {
    const pts = [];
    for (let iy = 0; iy <= latSegments; iy += 1) {
      const v = iy / latSegments;
      const phi = v * Math.PI;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      for (let ix = 0; ix < lonSegments; ix += 1) {
        const u = ix / lonSegments;
        const theta = u * Math.PI * 2;
        pts.push([
          radius * Math.cos(theta) * sinPhi,
          radius * cosPhi,
          radius * Math.sin(theta) * sinPhi,
        ]);
      }
    }
    return pts;
  }

  function projectPointsToHull(localPoints, object, width, height) {
    const projected = [];
    let depthSum = 0;
    let count = 0;
    for (const p of localPoints) {
      const world = transformToWorld(p, object);
      const screen = projectWorldToScreen(world, width, height, state.cameraZ);
      if (!screen) continue;
      projected.push({ x: screen.x, y: screen.y });
      depthSum += screen.depth;
      count += 1;
    }
    if (projected.length < 3) return null;
    return {
      hull: convexHull(projected),
      depth: count > 0 ? depthSum / count : 0,
    };
  }

  function hullToPath(hull) {
    if (!hull || hull.length < 3) return "";
    let d = `M ${hull[0].x.toFixed(3)} ${hull[0].y.toFixed(3)}`;
    for (let i = 1; i < hull.length; i += 1) {
      d += ` L ${hull[i].x.toFixed(3)} ${hull[i].y.toFixed(3)}`;
    }
    d += " Z";
    return d;
  }

  function simplifyHull(hull, maxPoints) {
    if (!hull || hull.length <= maxPoints) return hull;
    const result = [];
    const step = hull.length / maxPoints;
    for (let i = 0; i < maxPoints; i += 1) {
      result.push(hull[Math.floor(i * step)]);
    }
    return result;
  }

  function buildProjectedSvgText() {
    const rect = frame.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));

    const sphereSamples = sampleSpherePoints(constants.sphereRadiusWorld, 42, 96);
    const frustumSamples = [];
    for (let i = 0; i < frustumLocalPositions.length; i += 3) {
      frustumSamples.push([
        frustumLocalPositions[i],
        frustumLocalPositions[i + 1],
        frustumLocalPositions[i + 2],
      ]);
    }

    const sphereProj = projectPointsToHull(sphereSamples, sphereObject, width, height);
    const frustumProj = projectPointsToHull(frustumSamples, frustumObject, width, height);

    const shapes = [];
    if (sphereProj && sphereProj.hull.length >= 3) {
      const hull = simplifyHull(sphereProj.hull, 168);
      shapes.push({
        path: hullToPath(hull),
        depth: sphereProj.depth,
        fill: rgb01ToCss(sphereObject.color),
      });
    }
    if (frustumProj && frustumProj.hull.length >= 3) {
      const hull = simplifyHull(frustumProj.hull, 240);
      shapes.push({
        path: hullToPath(hull),
        depth: frustumProj.depth,
        fill: rgb01ToCss(frustumObject.color),
      });
    }

    shapes.sort((a, b) => b.depth - a.depth);

    let paths = "";
    for (const shape of shapes) {
      paths += `<path d="${shape.path}" fill="${shape.fill}"/>`;
    }

    return (
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
      `viewBox="0 0 ${width} ${height}">` +
      paths +
      `</svg>`
    );
  }

  async function copyCurrentFrameSvg() {
    const svgText = buildProjectedSvgText();

    try {
      if (navigator.clipboard && window.ClipboardItem && navigator.clipboard.write) {
        const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
        const textBlob = new Blob([svgText], { type: "text/plain" });
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/svg+xml": svgBlob,
            "text/plain": textBlob,
          }),
        ]);
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(svgText);
      } else {
        const ok = copyTextFallback(svgText);
        if (!ok) throw new Error("copy command failed");
      }
      copyStatus.textContent = "Copied 2-shape projected SVG to clipboard.";
    } catch (err) {
      const ok = copyTextFallback(svgText);
      copyStatus.textContent = ok
        ? "Copied 2-shape projected SVG to clipboard."
        : "Copy failed. Browser blocked clipboard access.";
    }
  }

  rotXInput.addEventListener("input", () => setRotationFromInput(rotXInput, "x"));
  rotYInput.addEventListener("input", () => setRotationFromInput(rotYInput, "y"));
  rotZInput.addEventListener("input", () => setRotationFromInput(rotZInput, "z"));

  copySvgButton.addEventListener("click", () => {
    copyCurrentFrameSvg();
  });

  shapeColorInput.value = constants.defaultColorHex;
  updateShapeColor(constants.defaultColorHex);
  playModeSelect.value = "off";
  state.playMode = "off";
  playDims.lengthCurrent = state.frustumLengthSvg;
  playDims.diameterCurrent = state.frustumLargeDiameterSvg;
  playDims.fitLengthCurrent = state.frustumLengthSvg;
  playDims.fitDiameterCurrent = state.frustumLargeDiameterSvg;
  playMode4.phase = "hold";
  playMode4.phaseStartMs = performance.now();
  playMode4.lengthCurrent = playMode4.expandedLengthSvg;
  playMode4.diameterCurrent = playMode4.expandedLengthSvg * playMode4.defaultScaleRatio;
  playMode4.baseGreenActive = true;
  playMode4.photoSwitchedInSpin = false;
  playMode4.fixedXRad = 0;
  playMode4.fixedZRad = 0;
  playMode4.holdFromXRad = 0;
  playMode4.holdFromZRad = 0;
  playMode4.nextXRad = randomMode4TiltX();
  playMode4.nextZRad = randomMode4TiltZ();
  playMode4.imageMode = constants.defaultMode4ImageMode;
  resetPlayMode5(performance.now());
  setMode5CenterMode(constants.defaultMode5CenterMode);
  setupPlayYSpin("play1");
  schedulePlayDimensionTargets(performance.now());
  state.depthBlur = false;
  state.depthDynamic = false;
  shadingModeSelect.value = "lit";
  updateShadingMode("lit");
  mode4ImageModeSelect.value = playMode4.imageMode;
  setMode5OlabVisible(false);
  updateMode4ImagesStatus();
  syncAppearancePanels();
  syncDimensionInputs();
  syncMode4ExpandedLengthInput();
  syncMode4MotionInputs();
  syncModePanels();
  rebuildFrustumFor(state.frustumLengthSvg, state.frustumLargeDiameterSvg);
  updateCameraUniforms();
  applyFrameBackgroundColor(state.frameBgColor);
  updateWorkspaceShellBounds();
  applyFrameSize(state.frameWidth, state.frameHeight);
  syncZoomInputs();
  updateRotationInputs();

  let lastFrameMs = performance.now();
  function render(timeMs) {
    const dt = Math.min(0.06, Math.max(0.001, (timeMs - lastFrameMs) * 0.001));
    lastFrameMs = timeMs;

    if (state.playMode === "play5") {
      isDraggingModel = false;
      rotVelX = 0;
      rotVelY = 0;
      rotVelZ = 0;
      applyPlayMode4State(timeMs);
    } else if (state.playMode === "play6") {
      isDraggingModel = false;
      rotVelX = 0;
      rotVelY = 0;
      rotVelZ = 0;
      applyPlayMode5State(timeMs);
    } else if (
      state.playMode === "play1" ||
      state.playMode === "play2" ||
      state.playMode === "play3" ||
      state.playMode === "play4"
    ) {
      if (
        state.playMode === "play1" ||
        state.playMode === "play2" ||
        state.playMode === "play3"
      ) {
        if (timeMs >= playMotion.nextChangeMs) {
          schedulePlayOrbitTargets(timeMs);
        }
      } else if (timeMs >= playMotion.nextChangeMs) {
        schedulePlayTargets(timeMs);
      }
      const blend = 1 - Math.exp(-dt * 1.8);
      playMotion.vx += (playMotion.targetX - playMotion.vx) * blend;
      playMotion.vy = samplePlayYSpinSpeed(timeMs);
      playMotion.vz += (playMotion.targetZ - playMotion.vz) * blend;
      stage.rotX += playMotion.vx * dt;
      stage.rotY += playMotion.vy * dt;
      stage.rotZ += playMotion.vz * dt;
      stage.pos[1] = 0;
      isDraggingModel = false;
      rotVelX = 0;
      rotVelY = 0;

      if (state.playMode === "play2") {
        const play2MinLength = Math.max(
          constants.minLengthSvg,
          constants.minLargeDiameterSvg / constants.playMode2MaxDiameterToLengthRatio,
        );
        const tFlow = timeMs * 0.001 - playDims.flowStartSec;
        const lengthWave =
          sampleOrganicWave(
            tFlow,
            playDims.lengthFreq,
            playDims.lengthPhase1,
            playDims.lengthPhase2,
          ) * 0.5 +
          0.5;
        const targetLength = clamp(
          play2MinLength + lengthWave * (constants.maxLengthSvg - play2MinLength),
          play2MinLength,
          constants.maxLengthSvg,
        );
        const maxDiameterForLength = Math.min(
          constants.maxLargeDiameterSvg,
          targetLength * constants.playMode2MaxDiameterToLengthRatio,
        );
        const diameterWave =
          sampleOrganicWave(
            tFlow + 1.73,
            playDims.diameterFreq,
            playDims.diameterPhase1,
            playDims.diameterPhase2,
          ) * 0.5 +
          0.5;
        const targetDiameter = clamp(
          constants.minLargeDiameterSvg +
            diameterWave * (maxDiameterForLength - constants.minLargeDiameterSvg),
          constants.minLargeDiameterSvg,
          maxDiameterForLength,
        );

        const dimBlend = 1 - Math.exp(-dt * 4.6);
        playDims.lengthCurrent += (targetLength - playDims.lengthCurrent) * dimBlend;
        playDims.diameterCurrent += (targetDiameter - playDims.diameterCurrent) * dimBlend;
        playDims.diameterCurrent = Math.min(
          playDims.diameterCurrent,
          Math.min(
            constants.maxLargeDiameterSvg,
            playDims.lengthCurrent * constants.playMode2MaxDiameterToLengthRatio,
          ),
        );
        if (
          Math.abs(playDims.lengthCurrent - frustumLayout.lengthSvg) > 0.7 ||
          Math.abs(playDims.diameterCurrent - frustumLayout.largeDiameterSvg) > 0.7
        ) {
          rebuildFrustumFor(playDims.lengthCurrent, playDims.diameterCurrent);
        }
      }

      if (state.playMode === "play3") {
        const fixedPlay3Length = constants.fixedPlay3LengthSvg;
        const fixedPlay3Diameter = getFixedPlay3DiameterSvg();
        if (
          Math.abs(frustumLayout.lengthSvg - fixedPlay3Length) > 0.7 ||
          Math.abs(frustumLayout.largeDiameterSvg - fixedPlay3Diameter) > 0.7
        ) {
          rebuildFrustumFor(fixedPlay3Length, fixedPlay3Diameter);
        }
      }

      if (state.playMode === "play4") {
        const fitFactor = computeFrustumFillScale(state.cameraZ);
        const safeFitFactor =
          Number.isFinite(fitFactor) && fitFactor > 0 ? fitFactor : 1;
        const targetLength = clamp(
          frustumLayout.lengthSvg * safeFitFactor,
          constants.minLengthSvg,
          constants.maxLengthSvg,
        );
        const targetDiameter = clamp(
          frustumLayout.largeDiameterSvg * safeFitFactor,
          constants.minLargeDiameterSvg,
          constants.maxLargeDiameterSvg,
        );
        playDims.fitLengthCurrent = targetLength;
        playDims.fitDiameterCurrent = targetDiameter;
        rebuildFrustumFor(playDims.fitLengthCurrent, playDims.fitDiameterCurrent);
      }
    } else {
      stage.rotY += rotVelY;
      stage.rotX += rotVelX;
      stage.rotZ += rotVelZ;
      rotVelY *= 0.92;
      rotVelX *= 0.92;
      rotVelZ *= 0.92;
    }

    sphereObject.rot[1] = 0;
    frustumObject.rot[0] = 0;
    frustumObject.rot[1] = 0;
    frustumLargeBaseObject.rot[0] = 0;
    frustumLargeBaseObject.rot[1] = 0;
    frustumLargeBaseObject.rot[2] = 0;
    const mode4MaskImage =
      state.playMode === "play5" && playMode4.baseGreenActive
        ? getCurrentPlayMode4Image()
        : null;
    if (state.playMode === "play5" && playMode4.baseGreenActive && !mode4MaskImage) {
      frustumLargeBaseObject.color[0] = constants.playMode4BaseGreen[0];
      frustumLargeBaseObject.color[1] = constants.playMode4BaseGreen[1];
      frustumLargeBaseObject.color[2] = constants.playMode4BaseGreen[2];
    } else {
      frustumLargeBaseObject.color[0] = frustumObject.color[0];
      frustumLargeBaseObject.color[1] = frustumObject.color[1];
      frustumLargeBaseObject.color[2] = frustumObject.color[2];
    }

    if (state.shadingMode === "lit") {
      if (
        state.playMode === "play1" ||
        state.playMode === "play2" ||
        state.playMode === "play3" ||
        state.playMode === "play4" ||
        state.playMode === "play5" ||
        state.playMode === "play6"
      ) {
        const lx = constants.defaultLightDir[0] + Math.sin(timeMs * 0.00063) * 0.65;
        const ly = constants.defaultLightDir[1] + Math.cos(timeMs * 0.00051) * 0.35;
        const lz = constants.defaultLightDir[2] + Math.sin(timeMs * 0.00044 + 1.3) * 0.55;
        const movingLight = normalize3(lx, ly, lz);
        currentLightDir[0] = movingLight[0];
        currentLightDir[1] = movingLight[1];
        currentLightDir[2] = movingLight[2];
        gl.uniform3f(uLightDir, movingLight[0], movingLight[1], movingLight[2]);
      } else {
        currentLightDir[0] = staticLightDir[0];
        currentLightDir[1] = staticLightDir[1];
        currentLightDir[2] = staticLightDir[2];
        gl.uniform3f(uLightDir, staticLightDir[0], staticLightDir[1], staticLightDir[2]);
      }
    }

    const useDepthPostFx = state.shadingMode === "depth";
    if (useDepthPostFx) {
      ensurePostFxTargets(canvas.width, canvas.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, postFx.framebuffer);
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform3fv(uStagePos, stage.pos);
    gl.uniform3f(uStageRot, stage.rotX, stage.rotY, stage.rotZ);
    if (useDepthPostFx) {
      updateDepthModeUniforms(timeMs);
    }
    updateRotationInputs();

    const normalFlatMode = state.shadingMode === "flat" ? 1 : 0;
    const mode5ShowOlab = state.playMode === "play6" && playMode5.showOlab;
    gl.uniform1f(uFlatMode, normalFlatMode);
    if (!mode5ShowOlab) {
      drawObject(sphereObject);
      drawObject(frustumObject);
      if (state.playMode === "play5" && playMode4.baseGreenActive) {
        gl.uniform1f(uFlatMode, 1);
        if (mode4MaskImage) {
          drawObject(frustumLargeBaseObject, {
            texture: mode4MaskImage.texture,
            textureWidth: mode4MaskImage.width,
            textureHeight: mode4MaskImage.height,
            textureMapMode: playMode4.imageMode === "follow" ? 1 : 0,
          });
        } else {
          drawObject(frustumLargeBaseObject);
        }
        gl.uniform1f(uFlatMode, normalFlatMode);
      } else {
        drawObject(frustumLargeBaseObject);
      }
    }
    updateMode5OlabTransform();

    if (useDepthPostFx) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.disable(gl.DEPTH_TEST);
      drawPostFxPass();
      gl.enable(gl.DEPTH_TEST);
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
