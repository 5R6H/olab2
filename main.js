(function () {
  const canvas = document.getElementById("scene");
  const frame = document.getElementById("frame");
  const frameShell = document.getElementById("frame-shell");
  const resizeHandle = document.getElementById("resize-handle");

  const shapeColorInput = document.getElementById("shape-color");
  const frustumLengthRange = document.getElementById("frustum-length-range");
  const frustumLengthNumber = document.getElementById("frustum-length-number");
  const frustumDiameterRange = document.getElementById("frustum-diameter-range");
  const frustumDiameterNumber = document.getElementById("frustum-diameter-number");
  const shadingModeSelect = document.getElementById("shading-mode");
  const playModeSelect = document.getElementById("play-mode");
  const proportionLockInput = document.getElementById("proportion-lock");
  const zoomRange = document.getElementById("zoom-range");
  const frameWidthInput = document.getElementById("frame-width-input");
  const frameHeightInput = document.getElementById("frame-height-input");
  const frameImageInput = document.getElementById("frame-image-input");
  const clearImageButton = document.getElementById("clear-image-btn");
  const resetButton = document.getElementById("reset-btn");
  const copySvgButton = document.getElementById("copy-svg-btn");
  const rotXInput = document.getElementById("rot-x-input");
  const rotYInput = document.getElementById("rot-y-input");
  const rotZInput = document.getElementById("rot-z-input");
  const frameBgImage = document.getElementById("frame-bg-image");
  const copyStatus = document.getElementById("copy-status");

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
    gapSvg: 192.003,
    minLengthSvg: 476.745,
    maxLengthSvg: 2400,
    minLargeDiameterSvg: 239.78,
    maxLargeDiameterSvg: 1400,
    minFrameWidth: 260,
    maxFrameWidth: 2200,
    minFrameHeight: 300,
    maxFrameHeight: 2200,
    minCameraZ: 5,
    maxCameraZ: 220,
    defaultCameraZ: 12.2,
    defaultFrameWidth: 600,
    defaultFrameHeight: 800,
    defaultColorHex: "#1c1c1c",
    defaultLightDir: [0.45, 0.75, 0.7],
    maxDiameterToLengthRatio: 1 / 1.5,
    playMode2MaxDiameterToLengthRatio: 1 / 2,
  };

  const worldPerSvgUnit = (2 * constants.sphereRadiusWorld) / constants.sphereDiameterSvg;
  const svgToWorld = (value) => value * worldPerSvgUnit;

  const state = {
    frameWidth: constants.defaultFrameWidth,
    frameHeight: constants.defaultFrameHeight,
    frustumLengthSvg: constants.defaultFrustumLengthSvg,
    frustumLargeDiameterSvg: constants.defaultFrustumLargeDiameterSvg,
    lockProportion: proportionLockInput.checked,
    lockedRatio:
      constants.defaultFrustumLargeDiameterSvg / constants.defaultFrustumLengthSvg,
    cameraZ: constants.defaultCameraZ,
    shadingMode: "lit",
    playMode: "off",
  };
  const vertexSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;

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

    varying vec3 vNormal;
    varying vec3 vWorldPos;

    void main() {
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

    const rightCenter = addVertex(half, 0, 0, 1, 0, 0);
    const rightRing = [];
    for (let i = 0; i <= segments; i += 1) {
      const t = (i / segments) * Math.PI * 2;
      rightRing.push(
        addVertex(half, rightRadius * Math.cos(t), rightRadius * Math.sin(t), 1, 0, 0),
      );
    }
    for (let i = 0; i < segments; i += 1) {
      indices.push(rightCenter, rightRing[i], rightRing[i + 1]);
    }

    return { positions, normals, indices };
  }

  function createMeshBuffers(mesh) {
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    const vertexCount = mesh.positions.length / 3;
    const interleaved = new Float32Array(vertexCount * 6);
    for (let i = 0; i < vertexCount; i += 1) {
      interleaved[i * 6 + 0] = mesh.positions[i * 3 + 0];
      interleaved[i * 6 + 1] = mesh.positions[i * 3 + 1];
      interleaved[i * 6 + 2] = mesh.positions[i * 3 + 2];
      interleaved[i * 6 + 3] = mesh.normals[i * 3 + 0];
      interleaved[i * 6 + 4] = mesh.normals[i * 3 + 1];
      interleaved[i * 6 + 5] = mesh.normals[i * 3 + 2];
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

  const attribPosition = gl.getAttribLocation(program, "aPosition");
  const attribNormal = gl.getAttribLocation(program, "aNormal");
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

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.disable(gl.CULL_FACE);

  gl.uniform1f(uFovY, (38 * Math.PI) / 180);
  gl.uniform1f(uNear, 0.1);
  gl.uniform1f(uFar, 1000.0);
  gl.uniform3f(uLightDir, staticLightDir[0], staticLightDir[1], staticLightDir[2]);
  gl.uniform1f(uFlatMode, 0);

  const stage = {
    pos: [0, 0, 0],
    rotX: -0.2,
    rotY: -0.5,
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
  let frustumLocalPositions = [];
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
    gl.vertexAttribPointer(attribPosition, 3, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(attribPosition);
    gl.vertexAttribPointer(attribNormal, 3, gl.FLOAT, false, 24, 12);
    gl.enableVertexAttribArray(attribNormal);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo);
  }

  function drawObject(object) {
    bindMesh(object.mesh);
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
  }

  function rebuildFrustumFor(lengthSvg, largeDiameterSvg) {
    const worldLength = svgToWorld(lengthSvg);
    const largeRadiusWorld = svgToWorld(largeDiameterSvg) * 0.5;
    const smallRadiusWorld = svgToWorld(constants.defaultFrustumSmallDiameterSvg) * 0.5;

    deleteMeshBuffers(frustumObject.mesh);
    const frustumRawMesh = buildFrustum(smallRadiusWorld, largeRadiusWorld, worldLength, 120);
    frustumLocalPositions = frustumRawMesh.positions.slice();
    frustumLocalIndices = frustumRawMesh.indices.slice();
    frustumObject.mesh = createMeshBuffers(frustumRawMesh);

    const sphereRadius = constants.sphereRadiusWorld;
    const gapWorld = svgToWorld(constants.gapSvg);
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
      return;
    }

    const minX = sphereCenterX - sphereRadius;
    const maxX = frustumLeftX + worldLength;
    const centerX = (minX + maxX) * 0.5;
    sphereObject.pos[0] = sphereCenterX - centerX;
    frustumObject.pos[0] = frustumCenterX - centerX;
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

  function updateShadingMode(mode) {
    state.shadingMode = mode === "flat" ? "flat" : "lit";
    gl.uniform1f(uFlatMode, state.shadingMode === "flat" ? 1 : 0);
  }

  function syncDimensionInputs() {
    frustumLengthRange.value = String(state.frustumLengthSvg);
    frustumLengthNumber.value = state.frustumLengthSvg.toFixed(3);
    frustumDiameterRange.value = String(state.frustumLargeDiameterSvg);
    frustumDiameterNumber.value = state.frustumLargeDiameterSvg.toFixed(3);
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
    frameWidthInput.value = String(Math.round(state.frameWidth));
    frameHeightInput.value = String(Math.round(state.frameHeight));
    resizeCanvasToFrame();
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

  function randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function sampleOrganicWave(tSec, freq, phase1, phase2) {
    return (
      Math.sin(tSec * freq + phase1) * 0.58 +
      Math.sin(tSec * (freq * 1.73) + phase2) * 0.3 +
      Math.sin(tSec * (freq * 2.51) + phase1 * 0.6 - phase2 * 0.4) * 0.12
    );
  }

  function setupPlayYSpin(mode) {
    const base = mode === "play3" ? 0.84 : 0.96;
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
      zoomRange.value = state.cameraZ.toFixed(1);
      updateCameraUniforms();
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

  playModeSelect.addEventListener("change", () => {
    state.playMode = playModeSelect.value;
    rotVelX = 0;
    rotVelY = 0;
    rotVelZ = 0;
    const now = performance.now();
    if (state.playMode === "play1" || state.playMode === "play2" || state.playMode === "play3") {
      setupPlayYSpin(state.playMode);
      playMotion.vy = samplePlayYSpinSpeed(now);
    }
    if (state.playMode === "play1" || state.playMode === "play2") {
      schedulePlayOrbitTargets(now);
    } else if (state.playMode === "play3") {
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
  });

  frameWidthInput.addEventListener("input", () => {
    applyFrameSize(Number(frameWidthInput.value), state.frameHeight);
  });

  frameHeightInput.addEventListener("input", () => {
    applyFrameSize(state.frameWidth, Number(frameHeightInput.value));
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

  window.addEventListener("beforeunload", () => {
    clearFrameImage(true);
  });

  function resetScene() {
    state.frustumLengthSvg = constants.defaultFrustumLengthSvg;
    state.frustumLargeDiameterSvg = constants.defaultFrustumLargeDiameterSvg;
    state.lockProportion = true;
    state.lockedRatio =
      constants.defaultFrustumLargeDiameterSvg / constants.defaultFrustumLengthSvg;
    state.cameraZ = constants.defaultCameraZ;

    stage.pos[0] = 0;
    stage.pos[1] = 0;
    stage.pos[2] = 0;
    stage.rotX = -0.2;
    stage.rotY = -0.5;
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
    setupPlayYSpin("play1");
    schedulePlayDimensionTargets(performance.now());
    shadingModeSelect.value = "lit";
    updateShadingMode("lit");
    shapeColorInput.value = constants.defaultColorHex;
    updateShapeColor(constants.defaultColorHex);
    syncDimensionInputs();
    rebuildFrustumFor(state.frustumLengthSvg, state.frustumLargeDiameterSvg);
    zoomRange.value = state.cameraZ.toFixed(1);
    updateCameraUniforms();
    applyFrameSize(constants.defaultFrameWidth, constants.defaultFrameHeight);
    updateRotationInputs();
  }

  resetButton.addEventListener("click", resetScene);

  window.addEventListener("resize", () => {
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
    let d = `M ${hull[0].x.toFixed(2)} ${hull[0].y.toFixed(2)}`;
    for (let i = 1; i < hull.length; i += 1) {
      d += ` L ${hull[i].x.toFixed(2)} ${hull[i].y.toFixed(2)}`;
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

    const sphereSamples = sampleSpherePoints(constants.sphereRadiusWorld, 22, 44);
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
      const hull = simplifyHull(sphereProj.hull, 64);
      shapes.push({
        path: hullToPath(hull),
        depth: sphereProj.depth,
        fill: rgb01ToCss(sphereObject.color),
      });
    }
    if (frustumProj && frustumProj.hull.length >= 3) {
      const hull = simplifyHull(frustumProj.hull, 72);
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
  setupPlayYSpin("play1");
  schedulePlayDimensionTargets(performance.now());
  shadingModeSelect.value = "lit";
  updateShadingMode("lit");
  syncDimensionInputs();
  rebuildFrustumFor(state.frustumLengthSvg, state.frustumLargeDiameterSvg);
  updateCameraUniforms();
  applyFrameSize(state.frameWidth, state.frameHeight);
  zoomRange.value = state.cameraZ.toFixed(1);
  updateRotationInputs();

  let lastFrameMs = performance.now();
  function render(timeMs) {
    const dt = Math.min(0.06, Math.max(0.001, (timeMs - lastFrameMs) * 0.001));
    lastFrameMs = timeMs;

    if (state.playMode === "play1" || state.playMode === "play2" || state.playMode === "play3") {
      if (state.playMode === "play1" || state.playMode === "play2") {
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

    if (state.shadingMode === "lit") {
      if (
        state.playMode === "play1" ||
        state.playMode === "play2" ||
        state.playMode === "play3"
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

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform3fv(uStagePos, stage.pos);
    gl.uniform3f(uStageRot, stage.rotX, stage.rotY, stage.rotZ);
    updateRotationInputs();

    drawObject(sphereObject);
    drawObject(frustumObject);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
