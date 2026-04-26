(function () {
  const canvas = document.getElementById("scene");
  const frame = document.getElementById("frame");
  const frameShell = document.getElementById("frame-shell");
  const resizeHandle = document.getElementById("resize-handle");
  const uiPanel = document.querySelector(".ui-panel");
  const typeGridToggle = document.getElementById("type-grid-toggle");
  const typeLayoutSelect = document.getElementById("type-layout-select");
  const typeMarkModeSelect = document.getElementById("type-mark-mode-select");
  const typeAddTextButton = document.getElementById("type-add-text-btn");
  const typeTextScaleUpButton = document.getElementById("type-text-scale-up-btn");
  const typeTextScaleDownButton = document.getElementById("type-text-scale-down-btn");
  const typeTextAlignSelect = document.getElementById("type-text-align-select");
  const typeLayout1EndColInput = document.getElementById("type-layout1-end-col-input");
  const typeGridColumnsInput = document.getElementById("type-grid-columns-input");
  const typeGridMarginInput = document.getElementById("type-grid-margin-input");
  const typeGridGutterInput = document.getElementById("type-grid-gutter-input");
  const typeGridBaselineInput = document.getElementById("type-grid-baseline-input");
  const typeGrid = document.getElementById("type-grid");
  const typeGridColumnsLayer = document.getElementById("type-grid-columns");
  const typeGridRowsLayer = document.getElementById("type-grid-baselines");
  const typeTextLayer = document.getElementById("type-text-layer");

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
  const mode1Controls = document.getElementById("mode1-controls");
  const mode4Controls = document.getElementById("mode4-controls");
  const mode5Controls = document.getElementById("mode5-controls");
  const mode6Controls = document.getElementById("mode6-controls");
  const mode5CenterModeSelect = document.getElementById("mode5-center-mode");
  const mode5StackToggle = document.getElementById("mode5-stack-toggle");
  const mode6SegmentsList = document.getElementById("mode6-segments-list");
  const mode6PositionEditor = document.getElementById("mode6-position-editor");
  const mode6AddSegmentButton = document.getElementById("mode6-add-segment-btn");
  const mode6DistributionSelect = document.getElementById("mode6-distribution-mode");
  const mode6SphereRadiusRange = document.getElementById("mode6-sphere-radius-range");
  const mode6SphereRadiusNumber = document.getElementById("mode6-sphere-radius-number");
  const mode6HoldSecondsRange = document.getElementById("mode6-hold-seconds-range");
  const mode6HoldSecondsNumber = document.getElementById("mode6-hold-seconds-number");
  const mode6ShiftSecondsRange = document.getElementById("mode6-shift-seconds-range");
  const mode6ShiftSecondsNumber = document.getElementById("mode6-shift-seconds-number");
  const mode6DriftHoldToggle = document.getElementById("mode6-drift-hold-toggle");
  const mode6FillTextToggle = document.getElementById("mode6-fill-text-toggle");
  const play1EnvironmentToggle = document.getElementById("play1-environment-toggle");
  const play1EnvironmentInput = document.getElementById("play1-environment-input");
  const clearPlay1EnvironmentButton = document.getElementById("clear-play1-environment-btn");
  const proportionLockInput = document.getElementById("proportion-lock");
  const zoomRange = document.getElementById("zoom-range");
  const zoomNumber = document.getElementById("zoom-number");
  const perspectiveRange = document.getElementById("perspective-range");
  const perspectiveNumber = document.getElementById("perspective-number");
  const framePresetSelect = document.getElementById("frame-preset-select");
  const framePresetNote = document.getElementById("frame-preset-note");
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
  const exportVideoButton = document.getElementById("export-video-btn");
  const rotXInput = document.getElementById("rot-x-input");
  const rotYInput = document.getElementById("rot-y-input");
  const rotZInput = document.getElementById("rot-z-input");
  const frameBgImage = document.getElementById("frame-bg-image");
  const play1Environment = document.getElementById("play1-environment");
  const mode6TextOrbit = document.getElementById("mode6-text-orbit");
  const mode6TextCarrier = document.getElementById("mode6-text-carrier");
  const mode6MiddleText = document.getElementById("mode6-middle-text");
  const mode5OlabWrap = document.getElementById("mode5-olab-wrap");
  const mode5OlabSvg = document.getElementById("mode5-olab-svg");
  const mode5OlabLabGroup = document.getElementById("mode5-olab-lab");
  const copyStatus = document.getElementById("copy-status");
  let mode5OlabOPath = null;
  const uiTabButtons = Array.from(document.querySelectorAll("[data-tab-target]"));
  const uiTabPanels = Array.from(document.querySelectorAll("[data-tab-panel]"));
  const rangeInputs = Array.from(document.querySelectorAll('input[type="range"]'));

  function setActiveUiTab(tabName) {
    uiTabButtons.forEach((button) => {
      const isActive = button.dataset.tabTarget === tabName;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    uiTabPanels.forEach((panel) => {
      const isActive = panel.dataset.tabPanel === tabName;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
      if (isActive) {
        panel.scrollTop = 0;
      }
    });
  }

  uiTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveUiTab(button.dataset.tabTarget || "foundation");
    });
  });

  function updateRangeFill(input) {
    if (!input) return;
    const min = Number(input.min || 0);
    const max = Number(input.max || 100);
    const value = Number(input.value || 0);
    const span = max - min;
    const progress = span > 0 ? ((value - min) / span) * 100 : 0;
    input.style.setProperty(
      "--range-progress",
      `${Math.max(0, Math.min(100, progress)).toFixed(2)}%`,
    );
  }

  function updateAllRangeFills() {
    rangeInputs.forEach(updateRangeFill);
  }

  rangeInputs.forEach((input) => {
    input.addEventListener("input", () => updateRangeFill(input));
    input.addEventListener("change", () => updateRangeFill(input));
  });

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
    svg.setAttribute("class", "mode5-olab-o-svg");
    svg.setAttribute("viewBox", "0 0 155 47");
    svg.setAttribute("aria-hidden", "true");
    svg.appendChild(clonedOPath);
    mode5OlabWrap.appendChild(svg);
    return svg;
  })();

  const mode5OlabPrimary = {
    wrap: mode5OlabWrap,
    svg: mode5OlabSvg,
    labGroup: mode5OlabLabGroup,
    oSvg: mode5OlabOSvg,
    oPath: mode5OlabOPath,
  };

  function createOlabCloneInstance(cloneId, suffix) {
    if (!frame || !mode5OlabWrap) return null;
    const clone = mode5OlabWrap.cloneNode(true);
    clone.id = cloneId;
    clone.querySelectorAll("[id]").forEach((element) => {
      element.id = `${element.id}-${suffix}`;
    });
    clone.style.display = "none";
    frame.appendChild(clone);
    return {
      wrap: clone,
      svg: clone.querySelector(".mode5-olab-svg"),
      labGroup: clone.querySelector(".mode5-olab-lab"),
      oSvg: clone.querySelector(".mode5-olab-o-svg"),
      oPath: clone.querySelector(".mode5-olab-o-svg path"),
    };
  }

  const mode5OlabSecondary = createOlabCloneInstance(
    "mode5-olab-wrap-secondary",
    "secondary",
  );

  const mode6OlabInstance = createOlabCloneInstance(
    "mode6-olab-wrap",
    "mode6",
  );

  const typeOlabInstance = createOlabCloneInstance(
    "type-olab-wrap",
    "type",
  );

  const mode5OlabInstances = [mode5OlabPrimary, mode5OlabSecondary].filter(Boolean);
  const olabColorInstances = [
    mode5OlabPrimary,
    mode5OlabSecondary,
    mode6OlabInstance,
    typeOlabInstance,
  ].filter(Boolean);

  function createMode6TextLayer(orbit, carrier, text, suffix) {
    if (!orbit || !carrier || !text) return null;
    if (!suffix) {
      return { orbit, carrier, text };
    }
    const clone = orbit.cloneNode(true);
    clone.id = `${orbit.id}-${suffix}`;
    clone.querySelectorAll("[id]").forEach((element) => {
      element.id = `${element.id}-${suffix}`;
    });
    clone.style.display = "none";
    frame.appendChild(clone);
    return {
      orbit: clone,
      carrier: clone.querySelector("[id^='mode6-text-carrier']"),
      text: clone.querySelector("[id^='mode6-middle-text']"),
    };
  }

  const mode6TextPrimary = createMode6TextLayer(
    mode6TextOrbit,
    mode6TextCarrier,
    mode6MiddleText,
    "",
  );
  const mode6TextSecondary = createMode6TextLayer(
    mode6TextOrbit,
    mode6TextCarrier,
    mode6MiddleText,
    "secondary",
  );
  const mode6TextLayers = [mode6TextPrimary, mode6TextSecondary].filter(Boolean);
  const mode6TextCanvas = document.createElement("canvas");
  mode6TextCanvas.id = "mode6-text-projection";
  mode6TextCanvas.setAttribute("aria-hidden", "true");
  mode6TextCanvas.style.position = "absolute";
  mode6TextCanvas.style.inset = "0";
  mode6TextCanvas.style.width = "100%";
  mode6TextCanvas.style.height = "100%";
  mode6TextCanvas.style.pointerEvents = "none";
  mode6TextCanvas.style.zIndex = "2";
  mode6TextCanvas.style.display = "none";
  frame.appendChild(mode6TextCanvas);
  const mode6TextGl = mode6TextCanvas.getContext("webgl", {
    antialias: true,
    alpha: true,
    premultipliedAlpha: true,
  });

  const gl = canvas.getContext("webgl", { antialias: true, alpha: true });
  if (!gl) {
    throw new Error("WebGL is unavailable in this browser.");
  }

  const constants = {
    sphereDiameterSvg: 192.003,
    sphereRadiusWorld: 1.18,
    defaultFrustumLengthSvg: 489.493138,
    defaultFrustumLargeDiameterSvg: 160.829039,
    defaultFrustumSmallDiameterSvg: 91.446885,
    gapSvg: 103.529133,
    minGapRatio: 0,
    maxGapRatio: 8,
    minLengthSvg: 489.493138,
    maxLengthSvg: 10000,
    minLargeDiameterSvg: 160.829039,
    maxLargeDiameterSvg: 3285.623973,
    minMode4ExpandedLengthSvg: 489.493138,
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
    minFrameWidth: 100,
    maxFrameWidth: 2200,
    minFrameHeight: 100,
    maxFrameHeight: 2200,
    minCameraZ: 5,
    maxCameraZ: 5000,
    defaultCameraZ: 12.2,
    defaultFrameWidth: 600,
    defaultFrameHeight: 800,
    defaultFrameBgColor: "#ffffff",
    defaultTypeGridVisible: true,
    defaultTypeLayout: "layout1",
    defaultTypeMarkMode: "icon",
    defaultTypeLayout1EndColumn: 3,
    defaultTypeGridColumns: 6,
    minTypeGridColumns: 2,
    maxTypeGridColumns: 12,
    defaultTypeGridMargin: 48,
    minTypeGridMargin: 0,
    maxTypeGridMargin: 240,
    defaultTypeGridGutter: 16,
    minTypeGridGutter: 0,
    maxTypeGridGutter: 120,
    defaultTypeGridBaseline: 6,
    minTypeGridBaseline: 6,
    maxTypeGridBaseline: 6,
    typeFontUnitsPerEm: 1000,
    typeFontCapHeight: 700,
    typeFontDescender: 205,
    typeFontRasterAlphaThreshold: 24,
    typeFontRasterVerticalAlphaThreshold: 1,
    defaultColorHex: "#1c1c1c",
    defaultPerspectiveFovDeg: 0,
    minPerspectiveFovDeg: 0,
    maxPerspectiveFovDeg: 200,
    maxPerspectiveEffectiveFovDeg: 170,
    minPerspectiveEffectiveFovDeg: 12,
    defaultPlay1EnvironmentEnabled: false,
    defaultPlay6ZoomZ: 57.6,
    defaultPlay6PerspectiveFovDeg: 130,
    playMode4BaseGreen: [0, 1, 0],
    mode5OlabViewWidthSvg: 155,
    mode5OlabViewHeightSvg: 47,
    mode5OlabODiameterSvg: 37.9085,
    mode5OlabOCenterXSvg: 18.95425,
    mode5OlabOCenterYSvg: 27.587105,
    mode5OlabLabShiftSvg: 0,
    defaultMode5CenterMode: "anchor",
    defaultMode6Text: "C1",
    defaultMode6Texts: [
      "C1",
      "Turntable",
      "32MP Telephoto\nSnapdragon",
    ],
    defaultMode6CameraZ: 78,
    defaultMode6TopPaddingRatio: 0.08,
    defaultMode6BottomPaddingRatio: 0.08,
    defaultMode6TextDistribution: "sphere",
    defaultMode6TextFillRatio: 1,
    defaultMode6SphereRadiusScale: 1,
    minMode6SphereRadiusScale: 0.45,
    maxMode6SphereRadiusScale: 1.8,
    defaultMode6FocusTransitionMs: 1200,
    defaultMode6FocusHoldMs: 500,
    minMode6FocusHoldMs: 100,
    maxMode6FocusHoldMs: 12000,
    minMode6FocusTransitionMs: 100,
    maxMode6FocusTransitionMs: 8000,
    defaultMode6DriftHold: false,
    mode6HoldDriftProgress: 0.08,
    mode6DriftTransitionLinearBlend: 0.08,
    mode6GoldenAngle: Math.PI * (3 - Math.sqrt(5)),
    mode6PositionMaxPitchRad: Math.PI * 0.46,
    typeCombinationGapWidthRatio: 0.020285594736601235,
    defaultMode6TextFontSizeRatio: 44.15 / 600,
    defaultLightDir: [0.45, 0.75, 0.7],
    defaultPlay2SpinYSpeed: 3.7,
    play1EnvironmentFollowX: 0.2,
    play1EnvironmentFollowY: 0.2,
    play1EnvironmentFollowZ: 0.2,
    maxDiameterToLengthRatio: 1 / 1.5,
    playMode2MaxDiameterToLengthRatio: 1 / 2,
    mode5StackCenterGapRatio:
      (203.697 - 51.6738) / 103.347,
  };

  mode5OlabInstances.forEach((instance) => {
    if (instance && instance.labGroup) {
      instance.labGroup.setAttribute("transform", `translate(${constants.mode5OlabLabShiftSvg} 0)`);
    }
  });

  const worldPerSvgUnit = (2 * constants.sphereRadiusWorld) / constants.sphereDiameterSvg;
  const svgToWorld = (value) => value * worldPerSvgUnit;
  const mmToCssPx = (value) => (value * 96) / 25.4;
  const inToCssPx = (value) => value * 96;
  const framePresets = {
    custom: {
      width: constants.defaultFrameWidth,
      height: constants.defaultFrameHeight,
      note: "",
      print: false,
    },
    "a4-portrait": {
      width: mmToCssPx(210),
      height: mmToCssPx(297),
      note: "Print preset: A4 portrait, mapped from 210 × 297 mm using CSS physical units.",
      print: true,
    },
    "a4-landscape": {
      width: mmToCssPx(297),
      height: mmToCssPx(210),
      note: "Print preset: A4 landscape, mapped from 297 × 210 mm using CSS physical units.",
      print: true,
    },
    "a5-portrait": {
      width: mmToCssPx(148),
      height: mmToCssPx(210),
      note: "Print preset: A5 portrait, mapped from 148 × 210 mm using CSS physical units.",
      print: true,
    },
    "letter-portrait": {
      width: inToCssPx(8.5),
      height: inToCssPx(11),
      note: "Print preset: US Letter portrait, mapped from 8.5 × 11 in using CSS physical units.",
      print: true,
    },
    "letter-landscape": {
      width: inToCssPx(11),
      height: inToCssPx(8.5),
      note: "Print preset: US Letter landscape, mapped from 11 × 8.5 in using CSS physical units.",
      print: true,
    },
    "instagram-post": {
      width: 1080,
      height: 1080,
      note: "Digital preset: Instagram square post, 1080 × 1080 px.",
      print: false,
    },
    "instagram-portrait": {
      width: 1080,
      height: 1350,
      note: "Digital preset: Instagram portrait post, 1080 × 1350 px.",
      print: false,
    },
    "instagram-story": {
      width: 1080,
      height: 1920,
      note: "Digital preset: Instagram Story / Reel, 1080 × 1920 px.",
      print: false,
    },
    "youtube-thumb": {
      width: 1280,
      height: 720,
      note: "Digital preset: YouTube thumbnail, 1280 × 720 px.",
      print: false,
    },
    "presentation-16x9": {
      width: 1920,
      height: 1080,
      note: "Digital preset: presentation slide, 1920 × 1080 px.",
      print: false,
    },
  };

  const state = {
    frameWidth: constants.defaultFrameWidth,
    frameHeight: constants.defaultFrameHeight,
    framePreset: "custom",
    frameBgColor: constants.defaultFrameBgColor,
    typeGridVisible: constants.defaultTypeGridVisible,
    typeLayout: constants.defaultTypeLayout,
    typeMarkMode: constants.defaultTypeMarkMode,
    typeLayout1EndColumn: constants.defaultTypeLayout1EndColumn,
    typeGridColumns: constants.defaultTypeGridColumns,
    typeGridMargin: constants.defaultTypeGridMargin,
    typeGridGutter: constants.defaultTypeGridGutter,
    typeGridBaseline: constants.defaultTypeGridBaseline,
    typeTextBoxes: [],
    activeTypeTextBoxId: null,
    frustumLengthSvg: constants.defaultFrustumLengthSvg,
    frustumLargeDiameterSvg: constants.defaultFrustumLargeDiameterSvg,
    gapRatio: constants.gapSvg / constants.sphereDiameterSvg,
    lockProportion: proportionLockInput.checked,
    lockedRatio:
      constants.defaultFrustumLargeDiameterSvg / constants.defaultFrustumLengthSvg,
    cameraZ: constants.defaultCameraZ,
    perspectiveFovDeg: constants.defaultPerspectiveFovDeg,
    shadingMode: "flat",
    depthBlur: false,
    depthDynamic: false,
    playMode: "off",
  };
  const videoExport = {
    active: false,
  };

  const typeTextBoxElements = new Map();
  let nextTypeTextBoxId = 1;
  let typeTextDrag = null;
  const svgNs = "http://www.w3.org/2000/svg";
  const typeTextMeasureCanvas = document.createElement("canvas");
  const typeTextMeasureContext = typeTextMeasureCanvas.getContext("2d");
  const typeTextMeasureSvgState = (() => {
    if (!document.body) return null;
    const svg = document.createElementNS(svgNs, "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("width", "4096");
    svg.setAttribute("height", "4096");
    svg.style.position = "fixed";
    svg.style.left = "-10000px";
    svg.style.top = "-10000px";
    svg.style.overflow = "visible";
    svg.style.pointerEvents = "none";
    svg.style.opacity = "0";

    const text = document.createElementNS(svgNs, "text");
    text.setAttributeNS("http://www.w3.org/XML/1998/namespace", "space", "preserve");
    text.setAttribute("fill", "#000");
    text.setAttribute("text-rendering", "geometricPrecision");
    svg.appendChild(text);
    document.body.appendChild(svg);
    return { svg, text };
  })();

  function applyTypeTextMeasureFont(node, fontSizeCss) {
    if (!node) return;
    node.style.fontFamily = '"Aeonik Fono Exact", Arial, "Helvetica Neue", sans-serif';
    node.style.fontWeight = "500";
    node.style.fontSize = `${fontSizeCss}px`;
    node.style.letterSpacing = "0";
  }

  function getTypeTextSvgBBox(text, fontSizeCss, lineHeightCss) {
    if (!typeTextMeasureSvgState) return null;
    const safeFontSize = Math.max(1, Number(fontSizeCss) || 1);
    const safeLineHeight = Math.max(safeFontSize, Number(lineHeightCss) || safeFontSize);
    const lines = String(text || "").split(/\r?\n/);
    const safeLines = lines.length ? lines : [""];
    const textNode = typeTextMeasureSvgState.text;
    textNode.replaceChildren();
    applyTypeTextMeasureFont(textNode, safeFontSize);

    for (let index = 0; index < safeLines.length; index += 1) {
      const tspan = document.createElementNS(svgNs, "tspan");
      tspan.setAttribute("x", "0");
      tspan.setAttribute("y", `${index * safeLineHeight}`);
      tspan.textContent = safeLines[index] || " ";
      textNode.appendChild(tspan);
    }

    try {
      const bbox = textNode.getBBox();
      if (
        Number.isFinite(bbox.x) &&
        Number.isFinite(bbox.y) &&
        Number.isFinite(bbox.width) &&
        Number.isFinite(bbox.height)
      ) {
        return bbox;
      }
    } catch (_error) {
      return null;
    }
    return null;
  }

  function getFramePresetKeyForSize(width, height) {
    const safeWidth = Math.round(Number(width));
    const safeHeight = Math.round(Number(height));
    for (const [key, preset] of Object.entries(framePresets)) {
      if (key === "custom") continue;
      if (
        Math.abs(Math.round(preset.width) - safeWidth) <= 1 &&
        Math.abs(Math.round(preset.height) - safeHeight) <= 1
      ) {
        return key;
      }
    }
    return "custom";
  }

  function createPlay1EnvironmentSvgDataUrl() {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#d9e1ea"/>
            <stop offset="38%" stop-color="#eef3f8"/>
            <stop offset="57%" stop-color="#f8f8f3"/>
            <stop offset="72%" stop-color="#d8d4cf"/>
            <stop offset="100%" stop-color="#b6b1ab"/>
          </linearGradient>
          <radialGradient id="sun" cx="50%" cy="44%" r="34%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.96"/>
            <stop offset="45%" stop-color="#ffffff" stop-opacity="0.42"/>
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#64605a" stop-opacity="0.18"/>
          </linearGradient>
          <filter id="blurSoft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="22"/>
          </filter>
        </defs>
        <rect width="1600" height="900" fill="url(#bg)"/>
        <ellipse cx="800" cy="402" rx="610" ry="180" fill="url(#sun)"/>
        <rect x="0" y="512" width="1600" height="388" fill="url(#floor)"/>
        <g opacity="0.58">
          <rect x="210" y="164" width="120" height="360" rx="60" fill="white" filter="url(#blurSoft)"/>
          <rect x="520" y="136" width="148" height="402" rx="74" fill="white" filter="url(#blurSoft)"/>
          <rect x="932" y="136" width="148" height="402" rx="74" fill="white" filter="url(#blurSoft)"/>
          <rect x="1270" y="164" width="120" height="360" rx="60" fill="white" filter="url(#blurSoft)"/>
        </g>
        <g opacity="0.18" stroke="#ffffff" stroke-width="2" fill="none">
          <path d="M0 556 Q800 418 1600 556"/>
          <path d="M0 604 Q800 458 1600 604"/>
          <path d="M0 664 Q800 516 1600 664"/>
          <path d="M0 736 Q800 598 1600 736"/>
        </g>
        <g opacity="0.09" stroke="#7d868f" stroke-width="1">
          <path d="M268 0 V900"/>
          <path d="M532 0 V900"/>
          <path d="M800 0 V900"/>
          <path d="M1068 0 V900"/>
          <path d="M1332 0 V900"/>
        </g>
      </svg>
    `;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  const playMode1 = {
    environmentEnabled: constants.defaultPlay1EnvironmentEnabled,
    builtInEnvironmentUrl: createPlay1EnvironmentSvgDataUrl(),
    environmentUrl: "",
    customEnvironmentObjectUrl: null,
    environmentTexture: null,
    environmentTextureWidth: 1,
    environmentTextureHeight: 1,
    environmentLoadVersion: 0,
  };

  const PLAY1_EXR_FLOAT_TYPE = 1015;
  const PLAY1_EXR_MAX_LONG_EDGE = 4096;
  let play1ExrParserPromise = null;

  playMode1.environmentUrl = playMode1.builtInEnvironmentUrl;

  function disposePlay1EnvironmentTexture() {
    if (playMode1.environmentTexture) {
      gl.deleteTexture(playMode1.environmentTexture);
      playMode1.environmentTexture = null;
    }
    playMode1.environmentTextureWidth = 1;
    playMode1.environmentTextureHeight = 1;
  }

  async function refreshPlay1EnvironmentTextureFromUrl(url) {
    const safeUrl = url || playMode1.builtInEnvironmentUrl;
    const loadVersion = ++playMode1.environmentLoadVersion;
    const image = await loadImageFromObjectUrl(safeUrl);
    const nextTexture = createTextureFromImage(image);
    if (loadVersion !== playMode1.environmentLoadVersion) {
      gl.deleteTexture(nextTexture);
      return false;
    }
    if (playMode1.environmentTexture) {
      gl.deleteTexture(playMode1.environmentTexture);
    }
    playMode1.environmentTexture = nextTexture;
    playMode1.environmentTextureWidth = Math.max(
      1,
      Number(image.naturalWidth) || Number(image.width) || 1,
    );
    playMode1.environmentTextureHeight = Math.max(
      1,
      Number(image.naturalHeight) || Number(image.height) || 1,
    );
    return true;
  }

  async function applyPlay1EnvironmentSource(url) {
    playMode1.environmentUrl = url || playMode1.builtInEnvironmentUrl;
    return refreshPlay1EnvironmentTextureFromUrl(playMode1.environmentUrl);
  }

  function clearPlay1EnvironmentResources() {
    if (playMode1.customEnvironmentObjectUrl) {
      URL.revokeObjectURL(playMode1.customEnvironmentObjectUrl);
      playMode1.customEnvironmentObjectUrl = null;
    }
    playMode1.environmentLoadVersion += 1;
    disposePlay1EnvironmentTexture();
  }

  async function clearPlay1EnvironmentCustomPhoto(keepInputValue) {
    if (playMode1.customEnvironmentObjectUrl) {
      URL.revokeObjectURL(playMode1.customEnvironmentObjectUrl);
      playMode1.customEnvironmentObjectUrl = null;
    }
    await applyPlay1EnvironmentSource(playMode1.builtInEnvironmentUrl);
    if (!keepInputValue && play1EnvironmentInput) {
      play1EnvironmentInput.value = "";
    }
  }

  function setPlay1EnvironmentFromFile(file) {
    if (!file) return Promise.resolve({ ok: false, reason: "missing" });
    const fileName = String(file.name || "").toLowerCase();
    const mimeType = String(file.type || "").toLowerCase();
    const isExr = fileName.endsWith(".exr") || mimeType.includes("exr");
    const isBrowserImage = mimeType.startsWith("image/") || /\.(png|jpe?g|webp|avif|gif|bmp|svg)$/i.test(fileName);
    if (!isExr && !isBrowserImage) {
      return Promise.resolve({ ok: false, reason: "unsupported" });
    }

    return (async () => {
      const objectUrl = isExr
        ? await createToneMappedPlay1EnvironmentUrlFromExr(file)
        : URL.createObjectURL(file);
      if (!objectUrl) {
        return { ok: false, reason: isExr ? "exr-decode" : "image-decode" };
      }
      if (playMode1.customEnvironmentObjectUrl) {
        URL.revokeObjectURL(playMode1.customEnvironmentObjectUrl);
      }
      playMode1.customEnvironmentObjectUrl = objectUrl;
      await applyPlay1EnvironmentSource(objectUrl);
      return { ok: true, source: isExr ? "exr" : "image" };
    })();
  }

  async function loadPlay1ExrParser() {
    if (!play1ExrParserPromise) {
      play1ExrParserPromise = import("https://esm.sh/parse-exr?bundle")
        .then((module) => module.default || module.parseExr || module)
        .catch((error) => {
          play1ExrParserPromise = null;
          throw error;
        });
    }
    return play1ExrParserPromise;
  }

  function toneMapPlay1HdrValue(value) {
    const safe = Math.max(0, Number.isFinite(value) ? value : 0);
    const exposed = safe * 1.35;
    const mapped = exposed / (1 + exposed);
    return Math.pow(clamp(mapped, 0, 1), 1 / 2.2);
  }

  async function createToneMappedPlay1EnvironmentUrlFromExr(file) {
    const parseExr = await loadPlay1ExrParser();
    const buffer = await file.arrayBuffer();
    const parsed = parseExr(buffer, PLAY1_EXR_FLOAT_TYPE);
    const width = Math.max(1, Number(parsed.width) || 0);
    const height = Math.max(1, Number(parsed.height) || 0);
    const sourceData = parsed.data;
    if (!width || !height || !sourceData || !sourceData.length) {
      throw new Error("Invalid EXR image data.");
    }

    const pixelCount = width * height;
    const stride = Math.max(1, Math.round(sourceData.length / pixelCount));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas 2D unavailable.");
    }

    const imageData = ctx.createImageData(width, height);
    const target = imageData.data;

    for (let i = 0; i < pixelCount; i += 1) {
      const src = i * stride;
      const r = sourceData[src];
      const g = stride > 1 ? sourceData[src + 1] : r;
      const b = stride > 2 ? sourceData[src + 2] : r;
      const a = stride > 3 ? clamp(sourceData[src + 3], 0, 1) : 1;
      const dst = i * 4;
      target[dst] = Math.round(toneMapPlay1HdrValue(r) * 255);
      target[dst + 1] = Math.round(toneMapPlay1HdrValue(g) * 255);
      target[dst + 2] = Math.round(toneMapPlay1HdrValue(b) * 255);
      target[dst + 3] = Math.round(a * 255);
    }

    ctx.putImageData(imageData, 0, 0);

    let outputCanvas = canvas;
    const longestEdge = Math.max(width, height);
    if (longestEdge > PLAY1_EXR_MAX_LONG_EDGE) {
      const scale = PLAY1_EXR_MAX_LONG_EDGE / longestEdge;
      const resized = document.createElement("canvas");
      resized.width = Math.max(1, Math.round(width * scale));
      resized.height = Math.max(1, Math.round(height * scale));
      const resizedCtx = resized.getContext("2d");
      if (!resizedCtx) {
        throw new Error("Canvas resize unavailable.");
      }
      resizedCtx.drawImage(canvas, 0, 0, resized.width, resized.height);
      outputCanvas = resized;
    }

    const blob = await new Promise((resolve) => {
      outputCanvas.toBlob((result) => resolve(result), "image/png");
    });
    if (!blob) {
      throw new Error("EXR conversion failed.");
    }
    return URL.createObjectURL(blob);
  }

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
    const eased = easeInOutExpo01(t);
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

  function easeInOutExtreme01(value) {
    const t = clamp(value, 0, 1);
    if (t < 0.5) {
      return 64 * t * t * t * t * t * t * t;
    }
    const inv = -2 * t + 2;
    return 1 - (inv * inv * inv * inv * inv * inv * inv) / 2;
  }

  function easeInOutExpo01(value) {
    const t = clamp(value, 0, 1);
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    if (t < 0.5) {
      return Math.pow(2, 20 * t - 10) / 2;
    }
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
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

  function compileShaderFor(glContext, type, source) {
    const shader = glContext.createShader(type);
    glContext.shaderSource(shader, source);
    glContext.compileShader(shader);
    if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
      const log = glContext.getShaderInfoLog(shader) || "Unknown shader compile error";
      glContext.deleteShader(shader);
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

  function createProgramFor(glContext, vs, fs) {
    const program = glContext.createProgram();
    glContext.attachShader(program, vs);
    glContext.attachShader(program, fs);
    glContext.linkProgram(program);
    if (!glContext.getProgramParameter(program, glContext.LINK_STATUS)) {
      const log = glContext.getProgramInfoLog(program) || "Unknown program link error";
      glContext.deleteProgram(program);
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

  const mode6TextVertexSource = `
    attribute vec3 aWorldPos;
    attribute vec2 aUv;

    uniform float uFovY;
    uniform float uAspect;
    uniform float uCameraZ;

    varying vec2 vUv;

    void main() {
      float f = 1.0 / tan(uFovY * 0.5);
      vec3 view = vec3(aWorldPos.x, aWorldPos.y, aWorldPos.z - uCameraZ);
      float clipX = view.x * (f / uAspect);
      float clipY = view.y * f;
      float clipW = -view.z;
      gl_Position = vec4(clipX, clipY, 0.0, clipW);
      vUv = aUv;
    }
  `;

  const mode6TextFragmentSource = `
    precision mediump float;

    uniform sampler2D uTex;
    uniform float uOpacity;

    varying vec2 vUv;

    void main() {
      vec4 tex = texture2D(uTex, vUv);
      if (tex.a < 0.01) {
        discard;
      }
      gl_FragColor = vec4(tex.rgb, tex.a * uOpacity);
    }
  `;

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

  const envFragmentSource = `
    precision mediump float;

    uniform sampler2D uEnvTex;
    uniform vec2 uViewportSize;
    uniform float uFovY;
    uniform vec3 uEnvRot;

    varying vec2 vUv;

    const float PI = 3.1415926535897932384626433832795;

    vec3 rotateX(vec3 p, float a) {
      float c = cos(a);
      float s = sin(a);
      return vec3(
        p.x,
        p.y * c - p.z * s,
        p.y * s + p.z * c
      );
    }

    vec3 rotateY(vec3 p, float a) {
      float c = cos(a);
      float s = sin(a);
      return vec3(
        p.x * c + p.z * s,
        p.y,
        -p.x * s + p.z * c
      );
    }

    vec3 rotateZ(vec3 p, float a) {
      float c = cos(a);
      float s = sin(a);
      return vec3(
        p.x * c - p.y * s,
        p.x * s + p.y * c,
        p.z
      );
    }

    vec3 applyInverseStageRotation(vec3 p, vec3 rot) {
      p = rotateZ(p, -rot.z);
      p = rotateY(p, -rot.y);
      p = rotateX(p, -rot.x);
      return p;
    }

    void main() {
      float aspect = max(0.0001, uViewportSize.x / max(1.0, uViewportSize.y));
      float tanHalfFov = tan(uFovY * 0.5);
      vec2 ndc = vec2(vUv.x * 2.0 - 1.0, vUv.y * 2.0 - 1.0);
      vec3 rayDir = normalize(vec3(
        ndc.x * aspect * tanHalfFov,
        ndc.y * tanHalfFov,
        -1.0
      ));
      rayDir = applyInverseStageRotation(rayDir, uEnvRot);

      float u = fract(atan(rayDir.x, -rayDir.z) / (2.0 * PI) + 0.5);
      float v = acos(clamp(rayDir.y, -1.0, 1.0)) / PI;
      vec3 color = texture2D(uEnvTex, vec2(u, clamp(v, 0.001, 0.999))).rgb;
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const envProgram = createProgram(
    compileShader(gl.VERTEX_SHADER, postVertexSource),
    compileShader(gl.FRAGMENT_SHADER, envFragmentSource),
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
  const envAttribPosition = gl.getAttribLocation(envProgram, "aPosition");
  const envTextureUniform = gl.getUniformLocation(envProgram, "uEnvTex");
  const envViewportSizeUniform = gl.getUniformLocation(envProgram, "uViewportSize");
  const envFovUniform = gl.getUniformLocation(envProgram, "uFovY");
  const envRotUniform = gl.getUniformLocation(envProgram, "uEnvRot");

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

  gl.uniform1f(uFovY, getPerspectiveFovRad());
  gl.uniform1f(uNear, 0.1);
  gl.uniform1f(uFar, 1000.0);
  gl.uniform3f(uLightDir, staticLightDir[0], staticLightDir[1], staticLightDir[2]);
  gl.uniform1f(uFlatMode, 1);
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

  let mode6TextProgram = null;
  let mode6TextAttribWorldPos = -1;
  let mode6TextAttribUv = -1;
  let mode6TextUniformAspect = null;
  let mode6TextUniformFov = null;
  let mode6TextUniformCameraZ = null;
  let mode6TextUniformTexture = null;
  let mode6TextUniformOpacity = null;
  let mode6TextQuadBuffer = null;

  if (mode6TextGl) {
    mode6TextProgram = createProgramFor(
      mode6TextGl,
      compileShaderFor(mode6TextGl, mode6TextGl.VERTEX_SHADER, mode6TextVertexSource),
      compileShaderFor(mode6TextGl, mode6TextGl.FRAGMENT_SHADER, mode6TextFragmentSource),
    );
    mode6TextAttribWorldPos = mode6TextGl.getAttribLocation(mode6TextProgram, "aWorldPos");
    mode6TextAttribUv = mode6TextGl.getAttribLocation(mode6TextProgram, "aUv");
    mode6TextUniformAspect = mode6TextGl.getUniformLocation(mode6TextProgram, "uAspect");
    mode6TextUniformFov = mode6TextGl.getUniformLocation(mode6TextProgram, "uFovY");
    mode6TextUniformCameraZ = mode6TextGl.getUniformLocation(mode6TextProgram, "uCameraZ");
    mode6TextUniformTexture = mode6TextGl.getUniformLocation(mode6TextProgram, "uTex");
    mode6TextUniformOpacity = mode6TextGl.getUniformLocation(mode6TextProgram, "uOpacity");
    mode6TextQuadBuffer = mode6TextGl.createBuffer();
    mode6TextGl.enable(mode6TextGl.BLEND);
    mode6TextGl.blendFunc(mode6TextGl.SRC_ALPHA, mode6TextGl.ONE_MINUS_SRC_ALPHA);
    mode6TextGl.disable(mode6TextGl.DEPTH_TEST);
  }

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

  function drawShapeGroupAtStageOffset(yOffsetWorld, yRotWorld) {
    const baseStageX = stage.pos[0];
    const baseStageY = stage.pos[1];
    const baseStageZ = stage.pos[2];
    const baseRotX = stage.rotX;
    const baseRotY = stage.rotY;
    const baseRotZ = stage.rotZ;
    gl.uniform3f(uStagePos, baseStageX, baseStageY + yOffsetWorld, baseStageZ);
    gl.uniform3f(
      uStageRot,
      baseRotX,
      Number.isFinite(yRotWorld) ? yRotWorld : baseRotY,
      baseRotZ,
    );
    drawObject(sphereObject);
    drawObject(frustumObject);
    drawObject(frustumLargeBaseObject);
    gl.uniform3f(uStagePos, baseStageX, baseStageY, baseStageZ);
    gl.uniform3f(uStageRot, baseRotX, baseRotY, baseRotZ);
  }

  function getEffectivePerspectiveFovDeg(rawValue = state.perspectiveFovDeg) {
    const safeRaw = clamp(
      Number.isFinite(rawValue) ? rawValue : constants.defaultPerspectiveFovDeg,
      constants.minPerspectiveFovDeg,
      constants.maxPerspectiveFovDeg,
    );
    if (safeRaw <= 90) {
      const lowT = safeRaw / 90;
      return (
        constants.minPerspectiveEffectiveFovDeg +
        (90 - constants.minPerspectiveEffectiveFovDeg) * lowT
      );
    }
    const t = (safeRaw - 90) / Math.max(0.0001, constants.maxPerspectiveFovDeg - 90);
    const eased = 1 - Math.pow(1 - t, 1.65);
    return 90 + (constants.maxPerspectiveEffectiveFovDeg - 90) * eased;
  }

  function getPerspectiveFovRad() {
    return (getEffectivePerspectiveFovDeg() * Math.PI) / 180;
  }

  function getActiveCameraZ(baseCameraZ) {
    const safeBaseCameraZ = Number.isFinite(baseCameraZ) ? baseCameraZ : state.cameraZ;
    const referenceTan = Math.tan(
      (getEffectivePerspectiveFovDeg(constants.defaultPerspectiveFovDeg) * Math.PI / 180) * 0.5,
    );
    const currentTan = Math.tan(getPerspectiveFovRad() * 0.5);
    return safeBaseCameraZ * (referenceTan / Math.max(0.0001, currentTan));
  }

  function syncPerspectiveInputs() {
    if (perspectiveRange && document.activeElement !== perspectiveRange) {
      perspectiveRange.value = state.perspectiveFovDeg.toFixed(1);
    }
    if (perspectiveNumber && document.activeElement !== perspectiveNumber) {
      perspectiveNumber.value = state.perspectiveFovDeg.toFixed(1);
    }
    updateAllRangeFills();
  }

  function setPerspectiveFov(value) {
    const raw = Number(value);
    if (!Number.isFinite(raw)) return;
    state.perspectiveFovDeg = clamp(
      raw,
      constants.minPerspectiveFovDeg,
      constants.maxPerspectiveFovDeg,
    );
    gl.uniform1f(uFovY, getPerspectiveFovRad());
    updateCameraUniforms();
    syncPerspectiveInputs();
    refreshMode6BaseLayout();
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
    const cssColor = rgb01ToCss(rgb);
    olabColorInstances.forEach((instance) => {
      if (instance && instance.svg) {
        instance.svg.style.color = cssColor;
      }
      if (instance && instance.oSvg) {
        instance.oSvg.style.color = cssColor;
      }
    });
    mode6TextLayers.forEach((layer) => {
      if (layer && layer.text) {
        layer.text.style.color = cssColor;
      }
    });
    syncMode6TextEntries();
    renderMode6TextCanvas();
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

    if (state.playMode !== "off" && state.playMode !== "play5") {
      sphereObject.pos[0] = sphereCenterX;
      frustumObject.pos[0] = frustumCenterX;
      frustumLargeBaseObject.pos[0] = frustumCenterX;
      refreshMode6BaseLayout();
      return;
    }

    const minX = sphereCenterX - sphereRadius;
    const maxX = frustumLeftX + worldLength;
    const centerX = (minX + maxX) * 0.5;
    sphereObject.pos[0] = sphereCenterX - centerX;
    frustumObject.pos[0] = frustumCenterX - centerX;
    frustumLargeBaseObject.pos[0] = frustumCenterX - centerX;
    refreshMode6BaseLayout();
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

  function addScaled3(base, dir, scalar) {
    return [
      base[0] + dir[0] * scalar,
      base[1] + dir[1] * scalar,
      base[2] + dir[2] * scalar,
    ];
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
    const activeCameraZ = getActiveCameraZ(cameraForFit);
    const aspect = width / height;
    const f = 1 / Math.tan(getPerspectiveFovRad() * 0.5);
    const viewZ = worldVec[2] - activeCameraZ;
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

  function getWorldUnitsPerCssPixelAtDepth(depth, rectWidth, rectHeight) {
    const safeDepth = Math.max(0.001, Number.isFinite(depth) ? depth : getActiveCameraZ());
    const safeRectWidth = Math.max(1, rectWidth);
    const safeRectHeight = Math.max(1, rectHeight);
    const width = Math.max(2, canvas.width);
    const height = Math.max(2, canvas.height);
    const aspect = width / height;
    const f = 1 / Math.tan(getPerspectiveFovRad() * 0.5);
    const worldPerCanvasPixelX = (2 * safeDepth * aspect) / (width * f);
    const worldPerCanvasPixelY = (2 * safeDepth) / (height * f);
    return {
      x: worldPerCanvasPixelX * (width / safeRectWidth),
      y: worldPerCanvasPixelY * (height / safeRectHeight),
    };
  }

  function getModelPanWorldPerCssPixel() {
    const rect = frame.getBoundingClientRect();
    const width = Math.max(2, canvas.width);
    const height = Math.max(2, canvas.height);
    const sphereCenterWorld = transformToWorld([0, 0, 0], sphereObject);
    const sphereCenterScreen = projectWorldToScreen(
      sphereCenterWorld,
      width,
      height,
      state.cameraZ,
    );
    const depth = sphereCenterScreen
      ? Math.max(0.25, sphereCenterScreen.depth)
      : Math.max(0.25, getActiveCameraZ() - sphereCenterWorld[2]);
    const aspect = width / height;
    const f = 1 / Math.tan(getPerspectiveFovRad() * 0.5);
    const cssToCanvasX = width / Math.max(1, rect.width);
    const cssToCanvasY = height / Math.max(1, rect.height);
    const worldPerCanvasPixelX = (2 * depth * aspect) / (width * f);
    const worldPerCanvasPixelY = (2 * depth) / (height * f);
    return {
      x: worldPerCanvasPixelX * cssToCanvasX,
      y: worldPerCanvasPixelY * cssToCanvasY,
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

  function drawPlay1EnvironmentPass() {
    if (!playMode1.environmentTexture) return;
    const envRotX = stage.rotX * constants.play1EnvironmentFollowX;
    const envRotY = stage.rotY * constants.play1EnvironmentFollowY;
    const envRotZ = stage.rotZ * constants.play1EnvironmentFollowZ;
    gl.useProgram(envProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, postQuadBuffer);
    gl.vertexAttribPointer(envAttribPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(envAttribPosition);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, playMode1.environmentTexture);
    gl.uniform1i(envTextureUniform, 0);
    gl.uniform2f(envViewportSizeUniform, canvas.width, canvas.height);
    gl.uniform1f(envFovUniform, getPerspectiveFovRad());
    gl.uniform3f(envRotUniform, envRotX, envRotY, envRotZ);
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
    const V = normalizeVec3([
      0 - centerWorld[0],
      0 - centerWorld[1],
      getActiveCameraZ() - centerWorld[2],
    ]);
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
    const f = 1 / Math.tan(getPerspectiveFovRad() * 0.5);
    const cameraZ = getActiveCameraZ(cameraForFit);

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
    const activeCameraZ = getActiveCameraZ();
    gl.uniform1f(uCameraZ, activeCameraZ);
    gl.uniform3f(uEyePos, 0, 0, activeCameraZ);
  }

  function syncZoomInputs() {
    if (document.activeElement !== zoomRange) {
      zoomRange.value = state.cameraZ.toFixed(1);
    }
    if (document.activeElement !== zoomNumber) {
      zoomNumber.value = state.cameraZ.toFixed(1);
    }
    updateAllRangeFills();
  }

  function setCameraZoom(value) {
    const next = clamp(
      Number(value),
      constants.minCameraZ,
      constants.maxCameraZ,
    );
    if (!Number.isFinite(next)) return;
    state.cameraZ = next;
    if (state.playMode === "play6") {
      playMode4.zoomZ = next;
    }
    updateCameraUniforms();
    syncZoomInputs();
    refreshMode6BaseLayout();
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
    updateAllRangeFills();
  }

  function syncPlay1EnvironmentToggle() {
    if (!play1EnvironmentToggle) return;
    if (document.activeElement !== play1EnvironmentToggle) {
      play1EnvironmentToggle.checked = !!playMode1.environmentEnabled;
    }
  }

  function updatePlay1EnvironmentVisual() {
    if (!frame || !play1Environment) return;
    frame.classList.remove("play1-environment-active");
    play1Environment.style.backgroundImage = "";
    play1Environment.style.backgroundPosition = "0 0";
    play1Environment.style.transform = "none";
  }

  function syncModePanels() {
    if (mode1Controls) {
      mode1Controls.hidden = !(state.playMode === "play1" || state.playMode === "play2");
    }
    if (mode4Controls) {
      mode4Controls.hidden = state.playMode !== "play6";
    }
    if (mode5Controls) {
      mode5Controls.hidden = state.playMode !== "play7";
    }
    if (mode6Controls) {
      mode6Controls.hidden = state.playMode !== "play5";
    }
    syncPlay1EnvironmentToggle();
    syncMode5StackToggleInput();
    syncMode6FillTextToggleInput();
    syncMode6DistributionInput();
    syncMode6SphereRadiusInputs();
    syncMode6TimingInputs();
    syncMode6DriftHoldToggleInput();
    renderMode6SegmentsEditor();
    syncOutputControls();
  }

  function syncOutputControls() {
    if (!exportVideoButton) return;
    const hasActivePlayMode = state.playMode !== "off";
    exportVideoButton.hidden = !hasActivePlayMode;
    exportVideoButton.disabled = !hasActivePlayMode || videoExport.active;
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

    if (state.playMode === "play6" && playMode4.phase === "hold") {
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
    if (mode === "lit") {
      state.shadingMode = "lit";
    } else {
      state.shadingMode = "flat";
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
    updateAllRangeFills();
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
    state.framePreset = getFramePresetKeyForSize(state.frameWidth, state.frameHeight);
    frame.style.width = `${Math.round(state.frameWidth)}px`;
    frame.style.height = `${Math.round(state.frameHeight)}px`;
    frameShell.style.setProperty("--frame-w", `${Math.round(state.frameWidth)}px`);
    frameShell.style.setProperty("--frame-h", `${Math.round(state.frameHeight)}px`);
    if (framePresetSelect && document.activeElement !== framePresetSelect) {
      framePresetSelect.value = state.framePreset;
    }
    if (framePresetNote) {
      const preset = framePresets[state.framePreset] || framePresets.custom;
      framePresetNote.textContent = preset.note || "";
    }
    if (document.activeElement !== frameWidthInput) {
      frameWidthInput.value = String(Math.round(state.frameWidth));
    }
    if (document.activeElement !== frameHeightInput) {
      frameHeightInput.value = String(Math.round(state.frameHeight));
    }
    resizeCanvasToFrame();
    resizeMode6TextCanvas();
    updatePlay1EnvironmentVisual();
    refreshMode6BaseLayout();
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

  function syncTypeGridInputs() {
    const effectiveGridSpacing = getEffectiveTypeGridSpacing();
    if (typeLayoutSelect && document.activeElement !== typeLayoutSelect) {
      typeLayoutSelect.value = state.typeLayout;
    }
    if (typeMarkModeSelect) {
      const combinationOption = typeMarkModeSelect.querySelector('option[value="combination"]');
      if (combinationOption) {
        combinationOption.disabled = state.typeLayout1EndColumn !== 1;
      }
    }
    if (typeMarkModeSelect && document.activeElement !== typeMarkModeSelect) {
      typeMarkModeSelect.value = state.typeMarkMode;
    }
    if (typeLayout1EndColInput && document.activeElement !== typeLayout1EndColInput) {
      typeLayout1EndColInput.value = String(state.typeLayout1EndColumn);
    }
    if (typeGridToggle && document.activeElement !== typeGridToggle) {
      typeGridToggle.checked = !!state.typeGridVisible;
    }
    if (typeGridColumnsInput && document.activeElement !== typeGridColumnsInput) {
      typeGridColumnsInput.value = String(state.typeGridColumns);
    }
    if (typeGridMarginInput && document.activeElement !== typeGridMarginInput) {
      typeGridMarginInput.value = String(Math.round(effectiveGridSpacing.marginCss));
    }
    if (typeGridGutterInput && document.activeElement !== typeGridGutterInput) {
      typeGridGutterInput.value = String(Math.round(effectiveGridSpacing.gutterCss));
    }
    if (typeGridBaselineInput && document.activeElement !== typeGridBaselineInput) {
      typeGridBaselineInput.value = String(state.typeGridBaseline);
    }
    syncTypeTextControls();
  }

  function getEffectiveTypeGridSpacing(rect) {
    const safeRect = rect || frame.getBoundingClientRect();
    if (state.typeLayout === "layout1" && state.playMode === "off") {
      const screenMetrics =
        safeRect.width > 1 && safeRect.height > 1 ? getMode5SphereScreenMetrics(safeRect) : null;
      if (screenMetrics) {
        const gapCss = Math.max(0, screenMetrics.sphereDiameterCss * state.gapRatio);
        const shortSideCss = Math.min(safeRect.width, safeRect.height);
        return {
          marginCss: shortSideCss / 24,
          gutterCss: gapCss,
        };
      }
    }
    return {
      marginCss: Math.max(0, state.typeGridMargin),
      gutterCss: Math.max(0, state.typeGridGutter),
    };
  }

  function canUseTypeLayoutEditing() {
    return state.playMode === "off" && state.typeLayout === "layout1";
  }

  function dedupeSnapLines(lines) {
    const unique = [];
    for (const value of lines) {
      if (!Number.isFinite(value)) continue;
      if (!unique.length || Math.abs(unique[unique.length - 1] - value) > 0.5) {
        unique.push(value);
      }
    }
    return unique;
  }

  function getTypeGridSnapMetrics(rect) {
    const safeRect = rect || frame.getBoundingClientRect();
    const effectiveGridSpacing = getEffectiveTypeGridSpacing(safeRect);
    const columns = Math.max(constants.minTypeGridColumns, state.typeGridColumns);
    const rows = Math.max(constants.minTypeGridBaseline, state.typeGridBaseline);
    const availableWidth =
      safeRect.width -
      effectiveGridSpacing.marginCss * 2 -
      effectiveGridSpacing.gutterCss * Math.max(0, columns - 1);
    const availableHeight =
      safeRect.height -
      effectiveGridSpacing.marginCss * 2 -
      effectiveGridSpacing.gutterCss * Math.max(0, rows - 1);
    const columnWidth = Math.max(1, availableWidth / Math.max(1, columns));
    const rowHeight = Math.max(1, availableHeight / Math.max(1, rows));
    const xLines = [];
    const yLines = [];
    for (let index = 0; index < columns; index += 1) {
      const start = effectiveGridSpacing.marginCss + index * (columnWidth + effectiveGridSpacing.gutterCss);
      xLines.push(start, start + columnWidth);
    }
    for (let index = 0; index < rows; index += 1) {
      const start = effectiveGridSpacing.marginCss + index * (rowHeight + effectiveGridSpacing.gutterCss);
      yLines.push(start, start + rowHeight);
    }
    return {
      marginCss: effectiveGridSpacing.marginCss,
      gutterCss: effectiveGridSpacing.gutterCss,
      columns,
      rows,
      xLines: dedupeSnapLines(xLines),
      yLines: dedupeSnapLines(yLines),
    };
  }

  function findNearestSnapIndex(lines, value) {
    if (!Array.isArray(lines) || !lines.length) return 0;
    let bestIndex = 0;
    let bestDistance = Infinity;
    for (let index = 0; index < lines.length; index += 1) {
      const distance = Math.abs(lines[index] - value);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    }
    return bestIndex;
  }

  function getTypeTextSphereHeightCss(rect) {
    const safeRect = rect || frame.getBoundingClientRect();
    const screenMetrics =
      safeRect.width > 1 && safeRect.height > 1 ? getMode5SphereScreenMetrics(safeRect) : null;
    return Math.max(12, screenMetrics ? screenMetrics.sphereDiameterCss : 48);
  }

  function getTypeTextFontSizeForActualHeight(targetHeightCss) {
    const target = Math.max(12, Number(targetHeightCss) || 0);
    const measureSize = 200;
    const svgBox = getTypeTextSvgBBox("O", measureSize, measureSize);
    if (svgBox && Number.isFinite(svgBox.height) && svgBox.height > 1) {
      return target * (measureSize / svgBox.height);
    }
    if (!typeTextMeasureContext) {
      return target;
    }
    typeTextMeasureContext.font = `500 ${measureSize}px "Aeonik Fono Exact", Arial, "Helvetica Neue", sans-serif`;
    const metrics = typeTextMeasureContext.measureText("O");
    const actualHeight =
      Math.abs(metrics.actualBoundingBoxAscent || 0) +
      Math.abs(metrics.actualBoundingBoxDescent || 0);
    if (!Number.isFinite(actualHeight) || actualHeight < 1) {
      return target;
    }
    return target * (measureSize / actualHeight);
  }

  function getTypeTextInkMetrics(text, fontSizeCss, lineHeightCss) {
    const safeFontSize = Math.max(1, Number(fontSizeCss) || 1);
    const safeLineHeight = Math.max(safeFontSize, Number(lineHeightCss) || safeFontSize);
    const svgBox = getTypeTextSvgBBox(text, safeFontSize, safeLineHeight);
    if (svgBox) {
      return {
        left: svgBox.x,
        top: svgBox.y,
        width: Math.max(1, svgBox.width),
        height: Math.max(1, svgBox.height),
        capTop: svgBox.y,
        descBottom: svgBox.y + svgBox.height,
      };
    }
    if (!typeTextMeasureContext) {
      return { left: 0, top: 0, width: safeFontSize, height: safeLineHeight };
    }
    typeTextMeasureContext.font = `500 ${safeFontSize}px "Aeonik Fono Exact", Arial, "Helvetica Neue", sans-serif`;
    const metrics = typeTextMeasureContext.measureText(String(text || "") || "O");
    const left = Number.isFinite(metrics.actualBoundingBoxLeft)
      ? -metrics.actualBoundingBoxLeft
      : 0;
    const top = Number.isFinite(metrics.actualBoundingBoxAscent)
      ? -metrics.actualBoundingBoxAscent
      : 0;
    const width = Number.isFinite(metrics.actualBoundingBoxLeft) &&
      Number.isFinite(metrics.actualBoundingBoxRight)
      ? metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight
      : Math.max(1, metrics.width || safeFontSize);
    const height = Number.isFinite(metrics.actualBoundingBoxAscent) &&
      Number.isFinite(metrics.actualBoundingBoxDescent)
      ? metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
      : safeLineHeight;
    return {
      left,
      top,
      width: Math.max(1, width),
      height: Math.max(1, height),
      capTop: top,
      descBottom: top + height,
    };
  }

  function getTypeTextEdgeInsetCss(fontSizeCss) {
    const baseInset = clamp((Number(fontSizeCss) || 0) * 0.012, 0.75, 2.5);
    return {
      x: baseInset,
      y: baseInset + 0.95,
    };
  }

  function getTypeTextBoxById(id) {
    return state.typeTextBoxes.find((item) => item.id === id) || null;
  }

  function normalizeTypeTextValue(value) {
    return String(value || "")
      .replace(/\r\n?/g, "\n")
      .replace(/\u00a0/g, " ")
      .replace(/\n$/, "");
  }

  function readTypeTextContent(element) {
    if (!element) return "";
    const raw = typeof element.innerText === "string" ? element.innerText : element.textContent || "";
    return normalizeTypeTextValue(raw);
  }

  function setActiveTypeTextBox(id) {
    state.activeTypeTextBoxId = getTypeTextBoxById(id) ? id : null;
    syncTypeTextControls();
  }

  function getActiveTypeTextBox() {
    return getTypeTextBoxById(state.activeTypeTextBoxId);
  }

  function syncTypeTextControls() {
    const activeBox = getActiveTypeTextBox();
    syncTypeTextButton();
    if (typeTextScaleUpButton) {
      typeTextScaleUpButton.disabled = !activeBox || !canUseTypeLayoutEditing();
    }
    if (typeTextScaleDownButton) {
      typeTextScaleDownButton.disabled = !activeBox || !canUseTypeLayoutEditing();
    }
    if (typeTextAlignSelect) {
      typeTextAlignSelect.disabled = !activeBox || !canUseTypeLayoutEditing();
      if (activeBox && document.activeElement !== typeTextAlignSelect) {
        typeTextAlignSelect.value = activeBox.align || "left";
      }
    }
  }

  function getClosestTypeTextCorner(localX, localY, width, height) {
    const corners = [
      { key: "tl", x: 0, y: 0 },
      { key: "tr", x: width, y: 0 },
      { key: "bl", x: 0, y: height },
      { key: "br", x: width, y: height },
    ];
    let bestKey = "tl";
    let bestDistance = Infinity;
    for (const corner of corners) {
      const distance = Math.hypot(localX - corner.x, localY - corner.y);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestKey = corner.key;
      }
    }
    return bestKey;
  }

  function getTypeTextRootPositionForCorner(corner, xTarget, yTarget, width, height) {
    switch (corner) {
      case "tr":
        return { left: xTarget - width, top: yTarget };
      case "bl":
        return { left: xTarget, top: yTarget - height };
      case "br":
        return { left: xTarget - width, top: yTarget - height };
      case "tl":
      default:
        return { left: xTarget, top: yTarget };
    }
  }

  function getTypeTextVerticalAnchor(corner) {
    return corner === "bl" || corner === "br" ? "bottom" : "top";
  }

  function getTypeTextAnchorOffsets(corner, inset) {
    const horizontal = corner === "tr" || corner === "br" ? -inset.x : inset.x;
    const vertical = corner === "bl" || corner === "br" ? -inset.y : inset.y;
    return { x: horizontal, y: vertical };
  }

  function beginTypeTextEditing(item, entry) {
    if (!item || !entry) return;
    setActiveTypeTextBox(item.id);
    item.isEditing = true;
    entry.root.classList.add("is-editing");
    entry.content.contentEditable = "true";
    entry.content.focus();
    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(entry.content);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  function endTypeTextEditing(item, entry) {
    if (!item || !entry) return;
    item.isEditing = false;
    entry.root.classList.remove("is-editing");
    entry.content.contentEditable = "false";
    item.text = readTypeTextContent(entry.content);
  }

  function scaleActiveTypeTextBox(multiplier) {
    const activeBox = getActiveTypeTextBox();
    if (!activeBox) return;
    const base = Number(activeBox.scaleMultiplier) || 1;
    activeBox.scaleMultiplier = clamp(base * multiplier, 0.125, 64);
    updateTypeTextLayer();
  }

  function setActiveTypeTextAlign(value) {
    const activeBox = getActiveTypeTextBox();
    if (!activeBox) return;
    activeBox.align = value === "center" ? "center" : "left";
    if (activeBox.align === "center") {
      activeBox.anchorCorner = getTypeTextVerticalAnchor(activeBox.anchorCorner) === "bottom" ? "bl" : "tl";
    }
    updateTypeTextLayer();
  }

  function removeTypeTextBoxElement(id) {
    const entry = typeTextBoxElements.get(id);
    if (entry && entry.root && entry.root.parentNode) {
      entry.root.parentNode.removeChild(entry.root);
    }
    typeTextBoxElements.delete(id);
    if (state.activeTypeTextBoxId === id) {
      state.activeTypeTextBoxId = null;
      syncTypeTextControls();
    }
  }

  function createTypeTextBoxElement(item) {
    if (!typeTextLayer) return null;
    const root = document.createElement("div");
    root.className = "type-text-box";
    root.dataset.id = item.id;

    const content = document.createElement("div");
    content.className = "type-text-box-content";
    content.contentEditable = "false";
    content.spellcheck = false;
    content.setAttribute("data-placeholder", "Text");
    content.textContent = item.text;
    ["tl", "tr", "bl", "br"].forEach((corner) => {
      const dot = document.createElement("span");
      dot.className = "type-text-box-corner";
      dot.dataset.corner = corner;
      root.appendChild(dot);
    });

    root.addEventListener("pointerdown", (event) => {
      if (!canUseTypeLayoutEditing() || item.isEditing) return;
      if (event.button !== 0) return;
      const target = getTypeTextBoxById(item.id);
      if (!target) return;
      const rootRect = root.getBoundingClientRect();
      const localX = event.clientX - rootRect.left;
      const localY = event.clientY - rootRect.top;
      if (target.align === "center") {
        typeTextDrag = {
          id: item.id,
          pointerId: event.pointerId,
          startClientX: event.clientX,
          startClientY: event.clientY,
          active: false,
          pendingAnchorCorner: localY <= rootRect.height * 0.5 ? "tl" : "bl",
        };
      } else {
        typeTextDrag = {
          id: item.id,
          pointerId: event.pointerId,
          startClientX: event.clientX,
          startClientY: event.clientY,
          active: false,
          pendingAnchorCorner: getClosestTypeTextCorner(
            localX,
            localY,
            rootRect.width,
            rootRect.height,
          ),
        };
      }
      setActiveTypeTextBox(item.id);
      root.setPointerCapture(event.pointerId);
    });

    root.addEventListener("pointermove", (event) => {
      if (!typeTextDrag || typeTextDrag.id !== item.id || typeTextDrag.pointerId !== event.pointerId) {
        return;
      }
      const target = getTypeTextBoxById(item.id);
      if (!target) return;
      if (!typeTextDrag.active) {
        const moved = Math.hypot(
          event.clientX - typeTextDrag.startClientX,
          event.clientY - typeTextDrag.startClientY,
        );
        if (moved < 4) {
          return;
        }
        typeTextDrag.active = true;
        target.anchorCorner = typeTextDrag.pendingAnchorCorner || target.anchorCorner || "tl";
        root.classList.add("is-dragging");
      }
      const rect = frame.getBoundingClientRect();
      const gridMetrics = getTypeGridSnapMetrics(rect);
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      if (target.align !== "center") {
        target.xLine = findNearestSnapIndex(gridMetrics.xLines, localX);
      }
      target.yLine = findNearestSnapIndex(gridMetrics.yLines, localY);
      updateTypeTextLayer();
    });

    const endDrag = (event) => {
      if (!typeTextDrag || typeTextDrag.id !== item.id) return;
      if (event && "pointerId" in event && typeTextDrag.pointerId !== event.pointerId) {
        return;
      }
      if (event && root.hasPointerCapture(event.pointerId)) {
        root.releasePointerCapture(event.pointerId);
      }
      typeTextDrag = null;
      root.classList.remove("is-dragging");
    };

    root.addEventListener("pointerup", endDrag);
    root.addEventListener("pointercancel", endDrag);

    root.addEventListener("dblclick", (event) => {
      if (!canUseTypeLayoutEditing()) return;
      event.preventDefault();
      event.stopPropagation();
      beginTypeTextEditing(item, typeTextBoxElements.get(item.id));
    });

    content.addEventListener("input", () => {
      const target = getTypeTextBoxById(item.id);
      if (!target) return;
      target.text = readTypeTextContent(content);
      updateTypeTextLayer();
    });

    content.addEventListener("focus", () => {
      root.classList.add("is-editing");
    });

    content.addEventListener("blur", () => {
      const target = getTypeTextBoxById(item.id);
      if (!target) return;
      endTypeTextEditing(target, typeTextBoxElements.get(item.id));
      updateTypeTextLayer();
    });

    root.appendChild(content);
    typeTextLayer.appendChild(root);

    const entry = { root, content };
    typeTextBoxElements.set(item.id, entry);
    return entry;
  }

  function syncTypeTextButton() {
    if (!typeAddTextButton) return;
    typeAddTextButton.disabled = !canUseTypeLayoutEditing();
  }

  function updateTypeTextLayer() {
    if (!typeTextLayer || !frame) return;
    const active = canUseTypeLayoutEditing();
    frame.classList.toggle("type-text-active", active && state.typeTextBoxes.length > 0);
    typeTextLayer.setAttribute("aria-hidden", active && state.typeTextBoxes.length > 0 ? "false" : "true");
    syncTypeTextControls();

    const validIds = new Set(state.typeTextBoxes.map((item) => item.id));
    for (const id of typeTextBoxElements.keys()) {
      if (!validIds.has(id)) {
        removeTypeTextBoxElement(id);
      }
    }

    if (!active) {
      return;
    }

    const rect = frame.getBoundingClientRect();
    const gridMetrics = getTypeGridSnapMetrics(rect);
    const sphereHeightCss = getTypeTextSphereHeightCss(rect);
    for (const item of state.typeTextBoxes) {
      let entry = typeTextBoxElements.get(item.id);
      if (!entry) {
        entry = createTypeTextBoxElement(item);
      }
      if (!entry) continue;
      const maxXIndex = Math.max(0, gridMetrics.xLines.length - 1);
      const maxYIndex = Math.max(0, gridMetrics.yLines.length - 1);
      item.xLine = clamp(Math.round(item.xLine || 0), 0, maxXIndex);
      item.yLine = clamp(Math.round(item.yLine || 0), 0, maxYIndex);
      const targetLeftCss = gridMetrics.xLines[item.xLine] || gridMetrics.marginCss;
      const targetTopCss = gridMetrics.yLines[item.yLine] || gridMetrics.marginCss;
      const scaleMultiplier = Math.max(0.125, Number(item.scaleMultiplier) || 1);
      const actualFontSizeCss = getTypeTextFontSizeForActualHeight(sphereHeightCss) * scaleMultiplier;
      const lineHeightCss = actualFontSizeCss;
      const inkMetrics = getTypeTextInkMetrics(item.text, actualFontSizeCss, lineHeightCss);
      entry.content.style.fontSize = `${actualFontSizeCss}px`;
      entry.content.style.lineHeight = `${lineHeightCss}px`;
      entry.content.style.textAlign = item.align === "center" ? "center" : "left";
      entry.content.style.width =
        item.align === "center"
          ? `${Math.max(1, inkMetrics.width)}px`
          : "max-content";
      if (document.activeElement !== entry.content && entry.content.textContent !== item.text) {
        entry.content.textContent = item.text;
      }
      const visibleBounds = {
        left: inkMetrics.left,
        top: inkMetrics.top,
        width: Math.max(1, inkMetrics.width),
        height: Math.max(1, inkMetrics.height),
      };
      const rootWidth = Math.max(1, visibleBounds.width);
      const rootHeight = Math.max(1, visibleBounds.height);
      const anchorCorner = item.anchorCorner || "tl";
      const verticalAnchor = getTypeTextVerticalAnchor(anchorCorner);
      const rootTop = verticalAnchor === "bottom" ? targetTopCss - rootHeight : targetTopCss;
      let rootLeft = 0;
      if (item.align === "center") {
        rootLeft = rect.width * 0.5 - rootWidth * 0.5;
      } else if (anchorCorner === "tr" || anchorCorner === "br") {
        rootLeft = targetLeftCss - rootWidth;
      } else {
        rootLeft = targetLeftCss;
      }
      entry.root.style.left = `${rootLeft}px`;
      entry.root.style.top = `${rootTop}px`;
      entry.root.style.width = `${rootWidth}px`;
      entry.root.style.height = `${rootHeight}px`;
      entry.root.classList.toggle("is-active", state.activeTypeTextBoxId === item.id);
      entry.root.classList.toggle("is-editing", !!item.isEditing);
      entry.content.style.left = `${-visibleBounds.left}px`;
      entry.content.style.top = `${-visibleBounds.top}px`;
    }
  }

  function addTypeTextBox() {
    if (!canUseTypeLayoutEditing()) return;
    const rect = frame.getBoundingClientRect();
    const gridMetrics = getTypeGridSnapMetrics(rect);
    const startIndex = Math.min(
      state.typeTextBoxes.length * 2,
      Math.max(0, gridMetrics.yLines.length - 1),
    );
    const item = {
      id: `type-text-${nextTypeTextBoxId++}`,
      text: "Text",
      xLine: 0,
      yLine: startIndex,
      anchorCorner: "tl",
      scaleMultiplier: 1,
      align: "left",
      isEditing: false,
    };
    state.typeTextBoxes.push(item);
    setActiveTypeTextBox(item.id);
    updateTypeTextLayer();
    const entry = typeTextBoxElements.get(item.id);
    if (entry) {
      beginTypeTextEditing(item, entry);
    }
  }

  function renderTypeGridColumns() {
    if (!typeGridColumnsLayer) return;
    const targetCount = Math.max(constants.minTypeGridColumns, state.typeGridColumns);
    while (typeGridColumnsLayer.children.length < targetCount) {
      const column = document.createElement("span");
      column.className = "type-grid-column";
      typeGridColumnsLayer.appendChild(column);
    }
    while (typeGridColumnsLayer.children.length > targetCount) {
      typeGridColumnsLayer.removeChild(typeGridColumnsLayer.lastChild);
    }
  }

  function renderTypeGridRows() {
    if (!typeGridRowsLayer) return;
    const targetCount = Math.max(constants.minTypeGridBaseline, state.typeGridBaseline);
    while (typeGridRowsLayer.children.length < targetCount) {
      const row = document.createElement("span");
      row.className = "type-grid-row";
      typeGridRowsLayer.appendChild(row);
    }
    while (typeGridRowsLayer.children.length > targetCount) {
      typeGridRowsLayer.removeChild(typeGridRowsLayer.lastChild);
    }
  }

  function applyTypeGridState() {
    if (!frame || !typeGrid) return;
    const effectiveGridSpacing = getEffectiveTypeGridSpacing();
    frame.classList.toggle("type-grid-visible", !!state.typeGridVisible);
    frame.style.setProperty("--type-grid-columns", String(state.typeGridColumns));
    frame.style.setProperty("--type-grid-rows", String(state.typeGridBaseline));
    frame.style.setProperty("--type-grid-margin", `${effectiveGridSpacing.marginCss}px`);
    frame.style.setProperty("--type-grid-gutter", `${effectiveGridSpacing.gutterCss}px`);
    renderTypeGridColumns();
    renderTypeGridRows();
    syncTypeGridInputs();
    updateTypeTextLayer();
  }

  function setTypeGridVisible(value) {
    state.typeGridVisible = !!value;
    applyTypeGridState();
  }

  function setTypeLayout(value) {
    const next = value === "layout1" ? "layout1" : "free";
    state.typeLayout = next;
    typeTextDrag = null;
    if (next !== "free") {
      isDraggingModel = false;
      dragModelMode = "rotate";
      rotVelX = 0;
      rotVelY = 0;
      rotVelZ = 0;
    }
    updateTypographyShapeVisibility();
    syncTypeGridInputs();
  }

  function setTypeMarkMode(value) {
    if (state.typeLayout1EndColumn !== 1) {
      state.typeMarkMode =
        value === "separate" || value === "wordmark" ? value : "icon";
    } else {
      state.typeMarkMode =
        value === "combination" || value === "separate" || value === "wordmark"
          ? value
          : "icon";
    }
    updateTypographyShapeVisibility();
    syncTypeGridInputs();
  }

  function setTypeLayout1EndColumn(value) {
    const raw = Math.round(Number(value));
    const next =
      raw === 1 || raw === 2 || raw === 3 || raw === 6
        ? raw
        : constants.defaultTypeLayout1EndColumn;
    state.typeLayout1EndColumn = next;
    if (next !== 1 && state.typeMarkMode === "combination") {
      state.typeMarkMode = "icon";
    }
    syncTypeGridInputs();
  }

  function updateTypographyShapeVisibility() {
    if (!canvas) return;
    const hideShape =
      state.playMode === "off" &&
      state.typeLayout === "layout1" &&
      state.typeMarkMode === "wordmark";
    canvas.style.opacity = hideShape ? "0" : "1";
    canvas.style.pointerEvents = hideShape ? "none" : "";
  }

  function setTypeGridColumns(value) {
    const next = clamp(
      Math.round(Number(value)),
      constants.minTypeGridColumns,
      constants.maxTypeGridColumns,
    );
    if (!Number.isFinite(next)) return;
    state.typeGridColumns = next;
    applyTypeGridState();
  }

  function setTypeGridMargin(value) {
    const next = clamp(
      Math.round(Number(value)),
      constants.minTypeGridMargin,
      constants.maxTypeGridMargin,
    );
    if (!Number.isFinite(next)) return;
    state.typeGridMargin = next;
    applyTypeGridState();
  }

  function setTypeGridGutter(value) {
    const next = clamp(
      Math.round(Number(value)),
      constants.minTypeGridGutter,
      constants.maxTypeGridGutter,
    );
    if (!Number.isFinite(next)) return;
    state.typeGridGutter = next;
    applyTypeGridState();
  }

  function setTypeGridBaseline(value) {
    const next = clamp(
      Math.round(Number(value)),
      constants.minTypeGridBaseline,
      constants.maxTypeGridBaseline,
    );
    if (!Number.isFinite(next)) return;
    state.typeGridBaseline = next;
    applyTypeGridState();
  }

  function applyTypographyLayout() {
    if (state.playMode !== "off") return;
    if (state.typeLayout !== "layout1") return;
    const rect = frame.getBoundingClientRect();
    const metrics = computeShapeProjectedMetrics();
    if (!metrics) return;
    const totalColumns = Math.max(1, Math.min(6, state.typeGridColumns));
    const endColumn = clamp(state.typeLayout1EndColumn, 1, totalColumns);
    let effectiveGridSpacing = getEffectiveTypeGridSpacing(rect);
    const availableCssWidth =
      rect.width -
      effectiveGridSpacing.marginCss * 2 -
      effectiveGridSpacing.gutterCss * (totalColumns - 1);
    const columnWidthCss = Math.max(1, availableCssWidth / totalColumns);
    const targetWidthCss =
      columnWidthCss * endColumn +
      effectiveGridSpacing.gutterCss * Math.max(0, endColumn - 1);
    const targetWidthPx = targetWidthCss * (metrics.width / Math.max(1, rect.width));
    if (targetWidthPx > 1 && Number.isFinite(targetWidthPx)) {
      const widthRatio = metrics.boundsWidthPx / targetWidthPx;
      if (Math.abs(1 - widthRatio) > 0.002) {
        setCameraZoom(state.cameraZ * widthRatio);
      }
    }
    effectiveGridSpacing = getEffectiveTypeGridSpacing(rect);
    const refreshedMetrics = computeShapeProjectedMetrics();
    if (!refreshedMetrics) return;
    const insetCss = effectiveGridSpacing.marginCss;
    const cssToCanvasX = refreshedMetrics.width / Math.max(1, rect.width);
    const cssToCanvasY = refreshedMetrics.height / Math.max(1, rect.height);
    const targetLeftPx = insetCss * cssToCanvasX;
    const targetTopPx = insetCss * cssToCanvasY;
    const targetCenterX = targetLeftPx + refreshedMetrics.boundsWidthPx * 0.5;
    const targetCenterY = targetTopPx + refreshedMetrics.boundsHeightPx * 0.5;
    const offset = computeShapeProjectedOffsetWorld(targetCenterX, targetCenterY, refreshedMetrics);
    stage.pos[0] += offset.x;
    stage.pos[1] += offset.y;
  }

  function updateTypographyOlabLockup() {
    if (!typeOlabInstance || !typeOlabInstance.wrap || !typeOlabInstance.svg) return;
    if (
      state.playMode !== "off" ||
      state.typeLayout !== "layout1" ||
      state.typeMarkMode === "icon"
    ) {
      typeOlabInstance.wrap.style.display = "none";
      typeOlabInstance.wrap.setAttribute("aria-hidden", "true");
      return;
    }
    const metrics = computeShapeProjectedMetrics();
    if (!metrics) {
      typeOlabInstance.wrap.style.display = "none";
      typeOlabInstance.wrap.setAttribute("aria-hidden", "true");
      return;
    }
    const rect = frame.getBoundingClientRect();
    const effectiveGridSpacing = getEffectiveTypeGridSpacing(rect);
    const totalColumns = Math.max(1, Math.min(6, state.typeGridColumns));
    const endColumn = clamp(state.typeLayout1EndColumn, 1, totalColumns);
    const availableCssWidth =
      rect.width -
      effectiveGridSpacing.marginCss * 2 -
      effectiveGridSpacing.gutterCss * (totalColumns - 1);
    const columnWidthCss = Math.max(1, availableCssWidth / totalColumns);
    const targetWidthCss =
      columnWidthCss * endColumn +
      effectiveGridSpacing.gutterCss * Math.max(0, endColumn - 1);
    const pxToCssX = rect.width / Math.max(1, metrics.width);
    const pxToCssY = rect.height / Math.max(1, metrics.height);
    const leftCss =
      state.typeMarkMode === "wordmark" ? effectiveGridSpacing.marginCss : metrics.minX * pxToCssX;
    const topCss =
      state.typeMarkMode === "wordmark" ? effectiveGridSpacing.marginCss : metrics.maxY * pxToCssY;
    const widthCss =
      state.typeMarkMode === "wordmark" ? targetWidthCss : metrics.boundsWidthPx * pxToCssX;
    const heightCss =
      widthCss * (constants.mode5OlabViewHeightSvg / constants.mode5OlabViewWidthSvg);
    const gapCss = widthCss * constants.typeCombinationGapWidthRatio;
    const targetTopCss =
      state.typeMarkMode === "wordmark"
        ? topCss
        : state.typeMarkMode === "separate"
        ? Math.max(
            effectiveGridSpacing.marginCss,
            rect.height - effectiveGridSpacing.marginCss - heightCss,
          )
        : topCss + gapCss;
    const olabCenterX = (constants.mode5OlabOCenterXSvg / constants.mode5OlabViewWidthSvg) * widthCss;
    const olabCenterY = (constants.mode5OlabOCenterYSvg / constants.mode5OlabViewHeightSvg) * heightCss;

    typeOlabInstance.wrap.style.left = `${leftCss}px`;
    typeOlabInstance.wrap.style.top = `${targetTopCss}px`;
    typeOlabInstance.wrap.style.width = `${widthCss}px`;
    typeOlabInstance.wrap.style.height = `${heightCss}px`;
    typeOlabInstance.wrap.style.transformOrigin = `${olabCenterX}px ${olabCenterY}px`;
    typeOlabInstance.wrap.style.transform = "none";
    typeOlabInstance.svg.style.transform = "none";
    typeOlabInstance.wrap.style.display = "block";
    typeOlabInstance.wrap.setAttribute("aria-hidden", "false");
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
      mode4ImagesStatus.textContent = "Play mode 4 mask images: none.";
      renderMode4ImagesList();
      return;
    }
    normalizePlayMode4TextureIndex();
    mode4ImagesStatus.textContent =
      `Play mode 4 mask images: ${count} loaded (current ${playMode4TextureIndex + 1}/${count}).`;
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

  function createMode6TextTextureFromCanvas(sourceCanvas) {
    if (!mode6TextGl || !sourceCanvas) return null;
    const tex = mode6TextGl.createTexture();
    mode6TextGl.activeTexture(mode6TextGl.TEXTURE0);
    mode6TextGl.bindTexture(mode6TextGl.TEXTURE_2D, tex);
    mode6TextGl.pixelStorei(mode6TextGl.UNPACK_FLIP_Y_WEBGL, 1);
    mode6TextGl.texImage2D(
      mode6TextGl.TEXTURE_2D,
      0,
      mode6TextGl.RGBA,
      mode6TextGl.RGBA,
      mode6TextGl.UNSIGNED_BYTE,
      sourceCanvas,
    );
    mode6TextGl.texParameteri(mode6TextGl.TEXTURE_2D, mode6TextGl.TEXTURE_WRAP_S, mode6TextGl.CLAMP_TO_EDGE);
    mode6TextGl.texParameteri(mode6TextGl.TEXTURE_2D, mode6TextGl.TEXTURE_WRAP_T, mode6TextGl.CLAMP_TO_EDGE);
    mode6TextGl.texParameteri(mode6TextGl.TEXTURE_2D, mode6TextGl.TEXTURE_MIN_FILTER, mode6TextGl.LINEAR);
    mode6TextGl.texParameteri(mode6TextGl.TEXTURE_2D, mode6TextGl.TEXTURE_MAG_FILTER, mode6TextGl.LINEAR);
    mode6TextGl.bindTexture(mode6TextGl.TEXTURE_2D, null);
    return tex;
  }

  function deleteMode6TextTexture(texture) {
    if (!mode6TextGl || !texture) return;
    mode6TextGl.deleteTexture(texture);
  }

  function loadImageFromObjectUrl(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Image load failed."));
      image.src = url;
    });
  }

  applyPlay1EnvironmentSource(playMode1.environmentUrl).catch(() => {
    clearPlay1EnvironmentResources();
  });

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
  let dragModelMode = "rotate";
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
    zoomZ: constants.defaultPlay6ZoomZ,
    zoomOutExtra: constants.defaultMode4ZoomOutExtra,
    zoomOutPeakPhase: 0.68,
    easeAmount: constants.defaultMode4Ease,
    imageMode: constants.defaultMode4ImageMode,
    spinStartRampPhase: 0.24,
    expandedLengthSvg: constants.defaultFrustumLengthSvg,
    defaultScaleRatio:
      constants.defaultFrustumLargeDiameterSvg / constants.defaultFrustumLengthSvg,
    lengthCurrent: constants.defaultFrustumLengthSvg,
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
    stackMode: false,
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

  const playMode6 = {
    texts: constants.defaultMode6Texts.slice(),
    entries: [],
    activeIndex: 0,
    cycleStartMs: 0,
    focusStartMs: 0,
    previousIndex: 0,
    distributionMode: constants.defaultMode6TextDistribution,
    distributionPhase: 0.4,
    positionOverrides: [],
    positionSelectedIndex: 0,
    positionViewYawRad: 0,
    positionViewPitchRad: 0,
    sphereRadiusScale: constants.defaultMode6SphereRadiusScale,
    holdMs: constants.defaultMode6FocusHoldMs,
    transitionMs: constants.defaultMode6FocusTransitionMs,
    driftHold: constants.defaultMode6DriftHold,
    shapeAngleRad: 0,
    userYawRad: 0,
    userPitchRad: 0,
    pointerDown: false,
    pointerX: 0,
    pointerY: 0,
    baseShapeWidthRatio: 0.24,
    canvasShiftCssY: 0,
    fillTextSize: true,
  };
  let mode6PositionDrag = null;

  function syncMode5CenterModeInput() {
    if (!mode5CenterModeSelect) return;
    const normalized = normalizeMode5CenterMode(playMode5.centerMode);
    playMode5.centerMode = normalized;
    if (document.activeElement !== mode5CenterModeSelect) {
      mode5CenterModeSelect.value = normalized;
    }
  }

  function syncMode5StackToggleInput() {
    if (!mode5StackToggle) return;
    if (document.activeElement !== mode5StackToggle) {
      mode5StackToggle.checked = !!playMode5.stackMode;
    }
  }

  function syncMode6FillTextToggleInput() {
    if (!mode6FillTextToggle) return;
    if (document.activeElement !== mode6FillTextToggle) {
      mode6FillTextToggle.checked = !!playMode6.fillTextSize;
    }
  }

  function normalizeMode6DistributionMode(value) {
    const mode = String(value || "").trim();
    return mode === "cap" || mode === "band"
      ? mode
      : constants.defaultMode6TextDistribution;
  }

  function syncMode6DistributionInput() {
    if (!mode6DistributionSelect) return;
    const normalized = normalizeMode6DistributionMode(playMode6.distributionMode);
    playMode6.distributionMode = normalized;
    if (document.activeElement !== mode6DistributionSelect) {
      mode6DistributionSelect.value = normalized;
    }
  }

  function getMode6SphereRadiusScale(value) {
    const raw = Number(value);
    return clamp(
      Number.isFinite(raw) ? raw : constants.defaultMode6SphereRadiusScale,
      constants.minMode6SphereRadiusScale,
      constants.maxMode6SphereRadiusScale,
    );
  }

  function syncMode6SphereRadiusInputs() {
    const value = getMode6SphereRadiusScale(playMode6.sphereRadiusScale);
    playMode6.sphereRadiusScale = value;
    if (mode6SphereRadiusRange && document.activeElement !== mode6SphereRadiusRange) {
      mode6SphereRadiusRange.value = value.toFixed(2);
      updateRangeFill(mode6SphereRadiusRange);
    }
    if (mode6SphereRadiusNumber && document.activeElement !== mode6SphereRadiusNumber) {
      mode6SphereRadiusNumber.value = value.toFixed(2);
    }
  }

  function setMode6SphereRadiusScale(value) {
    playMode6.sphereRadiusScale = getMode6SphereRadiusScale(value);
    syncMode6SphereRadiusInputs();
    updateMode6TextOrbit();
    updateMode6PositionCameraPreview();
  }

  function normalizeMode6DurationMs(value, fallbackMs, minMs, maxMs) {
    const raw = Number(value);
    return clamp(Number.isFinite(raw) ? raw : fallbackMs, minMs, maxMs);
  }

  function getMode6HoldMs(value = playMode6.holdMs) {
    return normalizeMode6DurationMs(
      value,
      constants.defaultMode6FocusHoldMs,
      constants.minMode6FocusHoldMs,
      constants.maxMode6FocusHoldMs,
    );
  }

  function getMode6TransitionMs(value = playMode6.transitionMs) {
    return normalizeMode6DurationMs(
      value,
      constants.defaultMode6FocusTransitionMs,
      constants.minMode6FocusTransitionMs,
      constants.maxMode6FocusTransitionMs,
    );
  }

  function getMode6CycleMs() {
    return getMode6HoldMs() + getMode6TransitionMs();
  }

  function formatMode6Seconds(ms) {
    return (ms / 1000).toFixed(2);
  }

  function syncMode6TimingInputs() {
    const holdMs = getMode6HoldMs();
    const transitionMs = getMode6TransitionMs();
    playMode6.holdMs = holdMs;
    playMode6.transitionMs = transitionMs;
    const holdValue = formatMode6Seconds(holdMs);
    const shiftValue = formatMode6Seconds(transitionMs);
    if (mode6HoldSecondsRange && document.activeElement !== mode6HoldSecondsRange) {
      mode6HoldSecondsRange.value = holdValue;
      updateRangeFill(mode6HoldSecondsRange);
    }
    if (mode6HoldSecondsNumber && document.activeElement !== mode6HoldSecondsNumber) {
      mode6HoldSecondsNumber.value = holdValue;
    }
    if (mode6ShiftSecondsRange && document.activeElement !== mode6ShiftSecondsRange) {
      mode6ShiftSecondsRange.value = shiftValue;
      updateRangeFill(mode6ShiftSecondsRange);
    }
    if (mode6ShiftSecondsNumber && document.activeElement !== mode6ShiftSecondsNumber) {
      mode6ShiftSecondsNumber.value = shiftValue;
    }
  }

  function preserveMode6CyclePhaseDuring(updateFn) {
    const now = performance.now();
    const oldCycleMs = Math.max(1, getMode6CycleMs());
    const oldElapsed = Math.max(0, now - playMode6.cycleStartMs);
    const cyclePhase = (oldElapsed % oldCycleMs) / oldCycleMs;
    updateFn();
    const nextCycleMs = Math.max(1, getMode6CycleMs());
    playMode6.cycleStartMs = now - cyclePhase * nextCycleMs;
    playMode6.focusStartMs = playMode6.cycleStartMs;
  }

  function setMode6HoldSeconds(value) {
    preserveMode6CyclePhaseDuring(() => {
      playMode6.holdMs = getMode6HoldMs(Number(value) * 1000);
      syncMode6TimingInputs();
    });
    updateMode6TextOrbit();
    updateMode6PositionCameraPreview();
  }

  function setMode6ShiftSeconds(value) {
    preserveMode6CyclePhaseDuring(() => {
      playMode6.transitionMs = getMode6TransitionMs(Number(value) * 1000);
      syncMode6TimingInputs();
    });
    updateMode6TextOrbit();
    updateMode6PositionCameraPreview();
  }

  function syncMode6DriftHoldToggleInput() {
    if (!mode6DriftHoldToggle) return;
    if (document.activeElement !== mode6DriftHoldToggle) {
      mode6DriftHoldToggle.checked = !!playMode6.driftHold;
    }
  }

  function setMode6DriftHold(value) {
    playMode6.driftHold = Boolean(value);
    syncMode6DriftHoldToggleInput();
    updateMode6TextOrbit();
    updateMode6PositionCameraPreview();
  }

  function setMode5CenterMode(value) {
    playMode5.centerMode = normalizeMode5CenterMode(value);
    syncMode5CenterModeInput();
    playMode5.centerFilterReady = false;
    if (state.playMode === "play7" && playMode5.centerMode !== "full") {
      stage.pos[0] = 0;
      stage.pos[1] = 0;
    }
  }

  function setMode5StackMode(value) {
    playMode5.stackMode = Boolean(value);
    syncMode5StackToggleInput();
    playMode5.centerFilterReady = false;
  }

  function setMode6FillTextSize(value) {
    playMode6.fillTextSize = Boolean(value);
    syncMode6FillTextToggleInput();
    renderMode6TextCanvas();
  }

  function setMode6DistributionMode(value) {
    playMode6.distributionMode = normalizeMode6DistributionMode(value);
    playMode6.distributionPhase = 0.4;
    playMode6.activeIndex = 0;
    playMode6.previousIndex = 0;
    playMode6.focusStartMs = performance.now();
    playMode6.cycleStartMs = playMode6.focusStartMs;
    syncMode6DistributionInput();
    renderMode6SegmentsEditor();
    updateMode6PositionEditor();
    renderMode6TextCanvas();
  }

  function normalizeMode6Segments(value) {
    const rawSegments = Array.isArray(value) ? value : [value];
    const segments = rawSegments.map((segment) => String(segment ?? "").replace(/\r\n?/g, "\n"));
    if (!segments.length || segments.every((segment) => !segment.trim())) {
      return constants.defaultMode6Texts.slice();
    }
    return segments;
  }

  function normalizeMode6PositionCoords(value) {
    if (!value || typeof value !== "object") return null;
    const x = Number(value.x);
    const y = Number(value.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    return {
      x: clamp(x, -1, 1),
      y: clamp(y, -1, 1),
    };
  }

  function syncMode6PositionOverrides(count, source) {
    const safeCount = Math.max(0, Number.isFinite(count) ? Math.floor(count) : 0);
    const raw = Array.isArray(source) ? source : playMode6.positionOverrides;
    playMode6.positionOverrides = Array.from({ length: safeCount }, (_, index) =>
      normalizeMode6PositionCoords(raw[index]),
    );
  }

  function getMode6DirectionFromPositionCoords(coords) {
    const safe = normalizeMode6PositionCoords(coords) || { x: 0, y: 0 };
    const yaw = safe.x * Math.PI;
    const pitch = safe.y * constants.mode6PositionMaxPitchRad;
    const cosPitch = Math.cos(pitch);
    return normalizeVec3([
      Math.sin(yaw) * cosPitch,
      Math.sin(pitch),
      Math.cos(yaw) * cosPitch,
    ]);
  }

  function getMode6PositionCoordsFromDirection(direction) {
    const safe = normalizeVec3(direction);
    const yaw = Math.atan2(safe[0], safe[2]);
    const pitch = Math.asin(clamp(safe[1], -1, 1));
    return {
      x: clamp(yaw / Math.PI, -1, 1),
      y: clamp(pitch / constants.mode6PositionMaxPitchRad, -1, 1),
    };
  }

  function getMode6SegmentPositionCoords(index, total) {
    const override = normalizeMode6PositionCoords(playMode6.positionOverrides[index]);
    if (override) return override;
    return getMode6PositionCoordsFromDirection(
      getMode6DistributionDirection(index, total, playMode6.distributionMode),
    );
  }

  function setMode6SegmentPosition(index, coords) {
    if (!Number.isInteger(index) || index < 0 || index >= playMode6.texts.length) return;
    const safe = normalizeMode6PositionCoords(coords);
    if (!safe) return;
    syncMode6PositionOverrides(playMode6.texts.length);
    playMode6.positionOverrides[index] = safe;
    playMode6.positionSelectedIndex = index;
    updateMode6PositionEditor();
    updateMode6TextOrbit();
  }

  function resetMode6SegmentPosition(index) {
    if (!Number.isInteger(index) || index < 0 || index >= playMode6.texts.length) return;
    syncMode6PositionOverrides(playMode6.texts.length);
    playMode6.positionOverrides[index] = null;
    playMode6.positionSelectedIndex = index;
    updateMode6PositionEditor();
    updateMode6TextOrbit();
  }

  function getMode6SegmentLabel(index) {
    const raw = String(playMode6.texts[index] || "").trim();
    const firstLine = raw.split(/\n/).find((line) => line.trim()) || `Segment ${index + 1}`;
    return firstLine.length > 18 ? `${firstLine.slice(0, 17)}...` : firstLine;
  }

  function clampMode6PositionSelectedIndex() {
    const maxIndex = Math.max(0, playMode6.texts.length - 1);
    playMode6.positionSelectedIndex = clamp(
      Number.isInteger(playMode6.positionSelectedIndex) ? playMode6.positionSelectedIndex : 0,
      0,
      maxIndex,
    );
    return playMode6.positionSelectedIndex;
  }

  function rotateMode6DirectionToEditorView(direction) {
    let [x, y, z] = normalizeVec3(direction);
    [x, y, z] = rotateY3(x, y, z, -playMode6.positionViewYawRad);
    [x, y, z] = rotateX3(x, y, z, -playMode6.positionViewPitchRad);
    return normalizeVec3([x, y, z]);
  }

  function rotateMode6DirectionFromEditorView(direction) {
    let [x, y, z] = normalizeVec3(direction);
    [x, y, z] = rotateX3(x, y, z, playMode6.positionViewPitchRad);
    [x, y, z] = rotateY3(x, y, z, playMode6.positionViewYawRad);
    return normalizeVec3([x, y, z]);
  }

  function getMode6DisplayDirectionForEditor(rawDirection) {
    return normalizeVec3(rawDirection);
  }

  function getMode6RawDirectionFromEditorDisplay(displayDirection) {
    return normalizeVec3(displayDirection);
  }

  function ensureMode6PositionEditorStructure() {
    if (!mode6PositionEditor) return null;
    if (!mode6PositionEditor.dataset.ready) {
      mode6PositionEditor.replaceChildren();

      const header = document.createElement("div");
      header.className = "mode6-position-editor-header";

      const title = document.createElement("h3");
      title.className = "mode6-position-editor-title";
      title.textContent = "Position";
      header.appendChild(title);

      const actions = document.createElement("div");
      actions.className = "mode6-position-editor-actions";

      const resetPointButton = document.createElement("button");
      resetPointButton.type = "button";
      resetPointButton.className = "mode6-position-editor-reset";
      resetPointButton.dataset.mode6PositionAction = "reset-point";
      resetPointButton.textContent = "Reset point";
      actions.appendChild(resetPointButton);

      const resetViewButton = document.createElement("button");
      resetViewButton.type = "button";
      resetViewButton.className = "mode6-position-editor-reset";
      resetViewButton.dataset.mode6PositionAction = "reset-view";
      resetViewButton.textContent = "Reset view";
      actions.appendChild(resetViewButton);

      header.appendChild(actions);

      const sphere = document.createElement("div");
      sphere.className = "mode6-sphere-map";
      sphere.tabIndex = 0;
      sphere.setAttribute("role", "application");
      sphere.setAttribute("aria-label", "Text orbit sphere position editor");

      const canvas = document.createElement("canvas");
      canvas.className = "mode6-sphere-canvas";
      sphere.appendChild(canvas);

      const markers = document.createElement("div");
      markers.className = "mode6-sphere-markers";
      sphere.appendChild(markers);

      const chips = document.createElement("div");
      chips.className = "mode6-position-chips";

      mode6PositionEditor.appendChild(header);
      mode6PositionEditor.appendChild(sphere);
      mode6PositionEditor.appendChild(chips);
      mode6PositionEditor.dataset.ready = "true";
    }

    return {
      sphere: mode6PositionEditor.querySelector(".mode6-sphere-map"),
      canvas: mode6PositionEditor.querySelector(".mode6-sphere-canvas"),
      markers: mode6PositionEditor.querySelector(".mode6-sphere-markers"),
      chips: mode6PositionEditor.querySelector(".mode6-position-chips"),
      resetPointButton: mode6PositionEditor.querySelector('[data-mode6-position-action="reset-point"]'),
    };
  }

  function projectMode6EditorDirection(direction, sphereElement) {
    const rect = sphereElement.getBoundingClientRect();
    const radius = Math.max(1, Math.min(rect.width, rect.height) * 0.5 - 10);
    const view = rotateMode6DirectionToEditorView(direction);
    return {
      x: rect.width * 0.5 + view[0] * radius,
      y: rect.height * 0.5 - view[1] * radius,
      z: view[2],
      radius,
    };
  }

  function rotateMode6PointToEditorView(point) {
    let [x, y, z] = point;
    [x, y, z] = rotateY3(x, y, z, -playMode6.positionViewYawRad);
    [x, y, z] = rotateX3(x, y, z, -playMode6.positionViewPitchRad);
    return [x, y, z];
  }

  function projectMode6EditorPoint(point, sphereElement) {
    const rect = sphereElement.getBoundingClientRect();
    const radius = Math.max(1, Math.min(rect.width, rect.height) * 0.5 - 10);
    const view = rotateMode6PointToEditorView(point);
    return {
      x: rect.width * 0.5 + view[0] * radius,
      y: rect.height * 0.5 - view[1] * radius,
      z: view[2],
      radius,
    };
  }

  function drawMode6EditorPath(ctx, sphereElement, points, color) {
    const projected = points.map((point) =>
      projectMode6EditorDirection(
        getMode6DisplayDirectionForEditor(point),
        sphereElement,
      ),
    );
    ctx.beginPath();
    projected.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  function getMode6EditorSelectedCameraBasis() {
    const total = Math.max(1, playMode6.texts.length);
    const index = clampMode6PositionSelectedIndex();
    const direction = getMode6DisplayDirectionForEditor(
      getMode6TextDirection(index, total, playMode6.distributionMode),
    );
    return getMode6ViewBasisForDirection(direction);
  }

  function getMode6EditorCurrentCameraBasis(timeMs = performance.now()) {
    if (state.playMode !== "play5" || !playMode6.texts.length) {
      return getMode6EditorSelectedCameraBasis();
    }
    return getMode6FocusBasis(Math.max(1, playMode6.texts.length), timeMs);
  }

  function getMode6EditorCameraRay(basis, xRatio, yRatio) {
    const safeBasis = basis || getMode6EditorSelectedCameraBasis();
    const rect = frame.getBoundingClientRect();
    const aspect = rect.height > 0 ? rect.width / rect.height : 1;
    const halfFovY = clamp(getPerspectiveFovRad() * 0.5, 0.01, Math.PI * 0.495);
    const tanY = Math.tan(halfFovY);
    const tanX = tanY * Math.max(0.05, aspect);
    return normalizeVec3(addScaled3(
      addScaled3(safeBasis.forward, safeBasis.right, tanX * xRatio),
      safeBasis.up,
      tanY * yRatio,
    ));
  }

  function getMode6EditorCameraFrustumBoundary(basis) {
    const samplesPerEdge = 14;
    const points = [];
    const pushRay = (x, y) => {
      points.push(getMode6EditorCameraRay(basis, x, y));
    };
    for (let i = 0; i <= samplesPerEdge; i += 1) {
      pushRay(-1 + (i / samplesPerEdge) * 2, 1);
    }
    for (let i = 1; i <= samplesPerEdge; i += 1) {
      pushRay(1, 1 - (i / samplesPerEdge) * 2);
    }
    for (let i = 1; i <= samplesPerEdge; i += 1) {
      pushRay(1 - (i / samplesPerEdge) * 2, -1);
    }
    for (let i = 1; i < samplesPerEdge; i += 1) {
      pushRay(-1, -1 + (i / samplesPerEdge) * 2);
    }
    return points;
  }

  function getMode6EditorCameraModelPoint(basis, x, y, z) {
    return addScaled3(
      addScaled3(
        addScaled3([0, 0, 0], basis.right, x),
        basis.up,
        y,
      ),
      basis.forward,
      z,
    );
  }

  function drawMode6EditorProjectedPolygon(ctx, projected, fillStyle, strokeStyle, lineWidth = 1) {
    if (!projected.length) return;
    ctx.beginPath();
    projected.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.closePath();
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  }

  function drawMode6EditorProjectedLine(ctx, projected, strokeStyle, lineWidth = 1.4) {
    if (projected.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(projected[0].x, projected[0].y);
    for (let i = 1; i < projected.length; i += 1) {
      ctx.lineTo(projected[i].x, projected[i].y);
    }
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  function drawMode6EditorCameraModel(ctx, sphereElement, basis) {
    const modelScale = 1.75;
    const w = 0.18 * modelScale;
    const h = 0.13 * modelScale;
    const backZ = -0.075 * modelScale;
    const frontZ = 0.075 * modelScale;
    const lensZ = 0.18 * modelScale;
    const topY = h * 0.5;
    const bottomY = -h * 0.5;
    const leftX = -w * 0.5;
    const rightX = w * 0.5;

    const point = (x, y, z) =>
      projectMode6EditorPoint(
        getMode6EditorCameraModelPoint(basis, x, y, z),
        sphereElement,
      );
    const vertices = {
      btl: point(leftX, topY, backZ),
      btr: point(rightX, topY, backZ),
      bbr: point(rightX, bottomY, backZ),
      bbl: point(leftX, bottomY, backZ),
      ftl: point(leftX, topY, frontZ),
      ftr: point(rightX, topY, frontZ),
      fbr: point(rightX, bottomY, frontZ),
      fbl: point(leftX, bottomY, frontZ),
    };
    const faces = [
      {
        points: [vertices.btl, vertices.btr, vertices.bbr, vertices.bbl],
        fill: "rgba(255, 255, 255, 0.92)",
        stroke: "rgba(16, 17, 20, 0.42)",
      },
      {
        points: [vertices.ftl, vertices.ftr, vertices.fbr, vertices.fbl],
        fill: "rgba(16, 17, 20, 0.94)",
        stroke: "rgba(255, 255, 255, 0.7)",
      },
      {
        points: [vertices.btl, vertices.ftl, vertices.fbl, vertices.bbl],
        fill: "rgba(38, 40, 46, 0.82)",
        stroke: "rgba(16, 17, 20, 0.36)",
      },
      {
        points: [vertices.btr, vertices.ftr, vertices.fbr, vertices.bbr],
        fill: "rgba(25, 26, 31, 0.86)",
        stroke: "rgba(16, 17, 20, 0.36)",
      },
      {
        points: [vertices.btl, vertices.btr, vertices.ftr, vertices.ftl],
        fill: "rgba(55, 58, 66, 0.82)",
        stroke: "rgba(16, 17, 20, 0.36)",
      },
      {
        points: [vertices.bbl, vertices.bbr, vertices.fbr, vertices.fbl],
        fill: "rgba(13, 14, 18, 0.82)",
        stroke: "rgba(16, 17, 20, 0.36)",
      },
    ];
    faces
      .map((face) => ({
        ...face,
        depth: face.points.reduce((sum, point) => sum + point.z, 0) / face.points.length,
      }))
      .sort((a, b) => a.depth - b.depth)
      .forEach((face) => {
        drawMode6EditorProjectedPolygon(ctx, face.points, face.fill, face.stroke, 0.9);
      });

    const sensorTop = point(0, topY + 0.018, backZ - 0.004);
    const sensorBottom = point(0, bottomY - 0.002, backZ - 0.004);
    drawMode6EditorProjectedLine(ctx, [sensorBottom, sensorTop], "rgba(36, 87, 255, 0.72)", 2);

    const lensBase = [
      point(leftX * 0.46, topY * 0.46, frontZ),
      point(rightX * 0.46, topY * 0.46, frontZ),
      point(rightX * 0.46, bottomY * 0.46, frontZ),
      point(leftX * 0.46, bottomY * 0.46, frontZ),
    ];
    const lensTip = point(0, 0, lensZ);
    drawMode6EditorProjectedPolygon(
      ctx,
      lensBase,
      "rgba(255, 255, 255, 0.16)",
      "rgba(255, 255, 255, 0.72)",
      1,
    );
    lensBase.forEach((basePoint) => {
      drawMode6EditorProjectedLine(ctx, [basePoint, lensTip], "rgba(16, 17, 20, 0.52)", 0.9);
    });
    ctx.fillStyle = "rgba(16, 17, 20, 0.95)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.78)";
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.arc(lensTip.x, lensTip.y, 3.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const origin = point(0, 0, 0);
    const rightTip = point(0.24, 0, 0);
    const upTip = point(0, 0.21, 0);
    const forwardTip = point(0, 0, 0.27);
    ctx.lineCap = "round";
    drawMode6EditorProjectedLine(ctx, [origin, rightTip], "rgba(16, 17, 20, 0.34)", 1.4);
    drawMode6EditorProjectedLine(ctx, [origin, upTip], "rgba(16, 17, 20, 0.78)", 1.6);
    drawMode6EditorProjectedLine(ctx, [origin, forwardTip], "rgba(36, 87, 255, 0.82)", 2);
    [rightTip, upTip, forwardTip].forEach((tip, index) => {
      ctx.fillStyle = index === 2 ? "rgba(36, 87, 255, 0.94)" : "rgba(16, 17, 20, 0.78)";
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, index === 2 ? 2.8 : 2.2, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawMode6EditorCameraView(ctx, sphereElement, centerX, centerY, radius, timeMs) {
    const basis = getMode6EditorCurrentCameraBasis(timeMs);
    const focusDirection = normalizeVec3(basis.forward);
    const boundary = getMode6EditorCameraFrustumBoundary(basis);
    const projectedBoundary = boundary.map((direction) =>
      projectMode6EditorDirection(direction, sphereElement),
    );
    const focusPoint = projectMode6EditorDirection(focusDirection, sphereElement);
    const cornerPoints = [
      getMode6EditorCameraRay(basis, -1, 1),
      getMode6EditorCameraRay(basis, 1, 1),
      getMode6EditorCameraRay(basis, 1, -1),
      getMode6EditorCameraRay(basis, -1, -1),
    ].map((direction) => projectMode6EditorDirection(direction, sphereElement));

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.beginPath();
    projectedBoundary.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.closePath();
    ctx.fillStyle = "rgba(36, 87, 255, 0.105)";
    ctx.fill();
    ctx.strokeStyle = "rgba(36, 87, 255, 0.5)";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.strokeStyle = "rgba(36, 87, 255, 0.26)";
    ctx.lineWidth = 1;
    cornerPoints.forEach((point) => {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    });

    ctx.strokeStyle = focusPoint.z < 0
      ? "rgba(16, 17, 20, 0.24)"
      : "rgba(16, 17, 20, 0.48)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash(focusPoint.z < 0 ? [4, 4] : []);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(focusPoint.x, focusPoint.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    drawMode6EditorCameraModel(ctx, sphereElement, basis);
  }

  function drawMode6PositionSphere(timeMs = performance.now()) {
    const parts = ensureMode6PositionEditorStructure();
    if (!parts || !parts.canvas || !parts.sphere) return;
    const { canvas: editorCanvas, sphere } = parts;
    const rect = sphere.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    const size = Math.max(2, Math.round(Math.min(rect.width, rect.height)));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(2, Math.round(rect.width * dpr));
    const height = Math.max(2, Math.round(rect.height * dpr));
    if (editorCanvas.width !== width) editorCanvas.width = width;
    if (editorCanvas.height !== height) editorCanvas.height = height;
    const ctx = editorCanvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const centerX = rect.width * 0.5;
    const centerY = rect.height * 0.5;
    const radius = Math.max(1, size * 0.5 - 10);
    const outerGradient = ctx.createRadialGradient(
      centerX - radius * 0.28,
      centerY - radius * 0.36,
      radius * 0.05,
      centerX,
      centerY,
      radius,
    );
    outerGradient.addColorStop(0, "rgba(255, 255, 255, 0.98)");
    outerGradient.addColorStop(0.58, "rgba(247, 248, 249, 0.92)");
    outerGradient.addColorStop(1, "rgba(229, 232, 236, 0.86)");
    ctx.fillStyle = outerGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(16, 17, 20, 0.14)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.lineWidth = 1;

    const steps = 72;
    const frontLine = "rgba(16, 17, 20, 0.18)";
    const softLine = "rgba(16, 17, 20, 0.08)";
    [-60, -30, 0, 30, 60].forEach((pitchDeg) => {
      const pitch = (pitchDeg * Math.PI) / 180;
      const cosPitch = Math.cos(pitch);
      const points = [];
      for (let i = 0; i <= steps; i += 1) {
        const yaw = (i / steps) * Math.PI * 2;
        points.push([
          Math.sin(yaw) * cosPitch,
          Math.sin(pitch),
          Math.cos(yaw) * cosPitch,
        ]);
      }
      drawMode6EditorPath(ctx, sphere, points, pitchDeg === 0 ? frontLine : softLine);
    });
    [-120, -60, 0, 60, 120].forEach((yawDeg) => {
      const yaw = (yawDeg * Math.PI) / 180;
      const points = [];
      for (let i = 0; i <= steps; i += 1) {
        const pitch = -Math.PI * 0.5 + (i / steps) * Math.PI;
        points.push([
          Math.sin(yaw) * Math.cos(pitch),
          Math.sin(pitch),
          Math.cos(yaw) * Math.cos(pitch),
        ]);
      }
      drawMode6EditorPath(ctx, sphere, points, yawDeg === 0 ? frontLine : softLine);
    });
    ctx.restore();

    drawMode6EditorCameraView(ctx, sphere, centerX, centerY, radius, timeMs);
  }

  function updateMode6PositionEditorMarkers(timeMs = performance.now()) {
    const parts = ensureMode6PositionEditorStructure();
    if (!parts || !parts.sphere || !parts.markers || !parts.chips) return;
    clampMode6PositionSelectedIndex();
    drawMode6PositionSphere(timeMs);
    parts.markers.replaceChildren();
    parts.chips.replaceChildren();

    const total = Math.max(1, playMode6.texts.length);
    for (let index = 0; index < playMode6.texts.length; index += 1) {
      const direction = getMode6DisplayDirectionForEditor(
        getMode6TextDirection(index, total, playMode6.distributionMode),
      );
      const projected = projectMode6EditorDirection(direction, parts.sphere);
      const label = getMode6SegmentLabel(index);
      const isSelected = index === playMode6.positionSelectedIndex;
      const hasOverride = !!normalizeMode6PositionCoords(playMode6.positionOverrides[index]);

      const marker = document.createElement("button");
      marker.type = "button";
      marker.className = "mode6-sphere-marker";
      marker.classList.toggle("is-selected", isSelected);
      marker.classList.toggle("is-back", projected.z < 0);
      marker.classList.toggle("has-override", hasOverride);
      marker.dataset.segmentIndex = String(index);
      marker.style.left = `${projected.x.toFixed(3)}px`;
      marker.style.top = `${projected.y.toFixed(3)}px`;
      marker.textContent = String(index + 1);
      marker.title = label;
      parts.markers.appendChild(marker);

      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "mode6-position-chip";
      chip.classList.toggle("is-selected", isSelected);
      chip.dataset.segmentIndex = String(index);
      chip.textContent = `${index + 1} ${label}`;
      parts.chips.appendChild(chip);
    }

    if (parts.resetPointButton) {
      parts.resetPointButton.disabled =
        !normalizeMode6PositionCoords(playMode6.positionOverrides[playMode6.positionSelectedIndex]);
    }
  }

  function updateMode6PositionEditor(timeMs = performance.now()) {
    if (!mode6PositionEditor) return;
    mode6PositionEditor.hidden = state.playMode !== "play5";
    if (mode6PositionEditor.hidden) return;
    updateMode6PositionEditorMarkers(timeMs);
  }

  function updateMode6PositionCameraPreview(timeMs = performance.now()) {
    if (!mode6PositionEditor || mode6PositionEditor.hidden) return;
    drawMode6PositionSphere(timeMs);
  }

  function getMode6PositionCoordsFromEditorPointer(sphereElement, event) {
    const rect = sphereElement.getBoundingClientRect();
    const radius = Math.max(1, Math.min(rect.width, rect.height) * 0.5 - 10);
    const centerX = rect.left + rect.width * 0.5;
    const centerY = rect.top + rect.height * 0.5;
    let x = (event.clientX - centerX) / radius;
    let y = (centerY - event.clientY) / radius;
    const distance = Math.hypot(x, y);
    if (distance > 1) {
      x /= distance;
      y /= distance;
    }
    const z = Math.sqrt(Math.max(0, 1 - x * x - y * y));
    const displayDirection = rotateMode6DirectionFromEditorView([x, y, z]);
    return getMode6PositionCoordsFromDirection(
      getMode6RawDirectionFromEditorDisplay(displayDirection),
    );
  }

  function selectMode6PositionSegment(index) {
    if (!Number.isInteger(index) || index < 0 || index >= playMode6.texts.length) return;
    playMode6.positionSelectedIndex = index;
    updateMode6PositionEditorMarkers();
  }

  function createMode6SegmentEditor(index, text, totalCount) {
    const item = document.createElement("div");
    item.className = "mode6-segment";

    const header = document.createElement("div");
    header.className = "mode6-segment-header";

    const title = document.createElement("div");
    title.className = "mode6-segment-title";
    title.textContent = `Segment ${index + 1}`;
    header.appendChild(title);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "mode6-segment-remove";
    removeButton.dataset.segmentIndex = String(index);
    removeButton.textContent = "Remove";
    removeButton.disabled = totalCount <= 1;
    header.appendChild(removeButton);

    const textarea = document.createElement("textarea");
    textarea.className = "mode6-segment-input";
    textarea.rows = 4;
    textarea.placeholder = constants.defaultMode6Text;
    textarea.dataset.segmentIndex = String(index);
    textarea.value = text;

    item.appendChild(header);
    item.appendChild(textarea);
    return item;
  }

  function getMode6TextCssColor() {
    const raw = shapeColorInput && /^#([0-9a-f]{6})$/i.test(shapeColorInput.value)
      ? shapeColorInput.value
      : constants.defaultColorHex;
    return raw;
  }

  function layoutMode6Text(text, context, maxWidth) {
    const sourceLines = String(text ?? "").replace(/\r\n?/g, "\n").split("\n");
    const output = [];
    sourceLines.forEach((sourceLine) => {
      const chars = Array.from(sourceLine.trim());
      if (!chars.length) {
        output.push("");
        return;
      }
      let line = "";
      chars.forEach((char) => {
        const nextLine = line + char;
        if (line && context.measureText(nextLine).width > maxWidth) {
          output.push(line);
          line = char.trimStart();
        } else {
          line = nextLine;
        }
      });
      output.push(line);
    });
    return output.length ? output : [""];
  }

  function getMode6CanvasInkBounds(sourceCanvas, renderScale) {
    const width = sourceCanvas && sourceCanvas.width ? sourceCanvas.width : 0;
    const height = sourceCanvas && sourceCanvas.height ? sourceCanvas.height : 0;
    if (!width || !height) return null;
    const context = sourceCanvas.getContext("2d");
    if (!context) return null;
    const data = context.getImageData(0, 0, width, height).data;
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const alpha = data[(y * width + x) * 4 + 3];
        if (alpha <= 0) continue;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + 1);
        maxY = Math.max(maxY, y + 1);
      }
    }
    if (maxX <= minX || maxY <= minY) return null;
    const scale = Math.max(0.0001, renderScale || 1);
    return {
      left: minX / scale,
      top: minY / scale,
      right: maxX / scale,
      bottom: maxY / scale,
      width: (maxX - minX) / scale,
      height: (maxY - minY) / scale,
    };
  }

  function buildMode6TextEntry(text) {
    const baseFontPx = 256;
    const lineHeightPx = baseFontPx * 1.12;
    const paddingX = baseFontPx * 0.36;
    const paddingTop = baseFontPx * 0.28;
    const paddingBottom = baseFontPx * 0.24;
    const measureCanvas = document.createElement("canvas");
    const measureCtx = measureCanvas.getContext("2d");
    measureCtx.font = `500 ${baseFontPx}px "Aeonik Fono Exact", Arial, sans-serif`;
    measureCtx.textAlign = "center";
    measureCtx.textBaseline = "alphabetic";
    const safeLines = layoutMode6Text(text, measureCtx, baseFontPx * 10.6);
    const lineWidths = safeLines.map((line) => measureCtx.measureText(line || " ").width);
    const maxLineWidth = Math.max(1, ...lineWidths);
    const metrics = measureCtx.measureText("Mg");
    const ascent = metrics.actualBoundingBoxAscent || baseFontPx * 0.76;
    const descent = metrics.actualBoundingBoxDescent || baseFontPx * 0.22;
    const logicalWidth = Math.ceil(maxLineWidth + paddingX * 2);
    const logicalHeight = Math.ceil(
      paddingTop + ascent + descent + Math.max(0, safeLines.length - 1) * lineHeightPx + paddingBottom,
    );
    const renderScale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(2, Math.ceil(logicalWidth * renderScale));
    canvas.height = Math.max(2, Math.ceil(logicalHeight * renderScale));
    const ctx = canvas.getContext("2d");
    ctx.scale(renderScale, renderScale);
    ctx.clearRect(0, 0, logicalWidth, logicalHeight);
    ctx.font = `500 ${baseFontPx}px "Aeonik Fono Exact", Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = getMode6TextCssColor();
    let baselineY = paddingTop + ascent;
    safeLines.forEach((line, index) => {
      if (index > 0) baselineY += lineHeightPx;
      ctx.fillText(line || " ", logicalWidth * 0.5, baselineY);
    });
    const inkBounds =
      getMode6CanvasInkBounds(canvas, renderScale) || {
        left: paddingX,
        top: paddingTop,
        right: paddingX + maxLineWidth,
        bottom: paddingTop + ascent + descent + Math.max(0, safeLines.length - 1) * lineHeightPx,
        width: maxLineWidth,
        height: ascent + descent + Math.max(0, safeLines.length - 1) * lineHeightPx,
      };
    return {
      text: String(text ?? ""),
      canvas,
      logicalWidth,
      logicalHeight,
      inkLeft: inkBounds.left,
      inkTop: inkBounds.top,
      inkRight: inkBounds.right,
      inkBottom: inkBounds.bottom,
      inkWidth: inkBounds.width,
      inkHeight: inkBounds.height,
      baseFontPx,
      texture: createMode6TextTextureFromCanvas(canvas),
    };
  }

  function syncMode6TextEntries() {
    playMode6.entries.forEach((entry) => {
      if (entry && entry.texture) {
        deleteMode6TextTexture(entry.texture);
      }
    });
    playMode6.entries = playMode6.texts.map((text) => buildMode6TextEntry(text));
  }

  function renderMode6SegmentsEditor(focusIndex = -1) {
    if (!mode6SegmentsList) return;
    mode6SegmentsList.innerHTML = "";
    playMode6.texts.forEach((text, index) => {
      mode6SegmentsList.appendChild(
        createMode6SegmentEditor(index, text, playMode6.texts.length),
      );
    });
    if (Number.isInteger(focusIndex) && focusIndex >= 0) {
      playMode6.positionSelectedIndex = clamp(focusIndex, 0, Math.max(0, playMode6.texts.length - 1));
      const textarea = mode6SegmentsList.querySelector(
        `.mode6-segment-input[data-segment-index="${focusIndex}"]`,
      );
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      }
    }
    updateMode6PositionEditor();
  }

  function setMode6Texts(value, options = {}) {
    const nextTexts = normalizeMode6Segments(value);
    playMode6.texts = nextTexts;
    syncMode6PositionOverrides(playMode6.texts.length, options.positionOverrides);
    playMode6.activeIndex =
      ((playMode6.activeIndex % playMode6.texts.length) + playMode6.texts.length) %
      playMode6.texts.length;
    playMode6.previousIndex =
      ((playMode6.previousIndex % playMode6.texts.length) + playMode6.texts.length) %
      playMode6.texts.length;
    if (Number.isInteger(options.focusIndex)) {
      playMode6.positionSelectedIndex = clamp(
        options.focusIndex,
        0,
        Math.max(0, playMode6.texts.length - 1),
      );
    } else {
      clampMode6PositionSelectedIndex();
    }
    if (options.render !== false) {
      renderMode6SegmentsEditor(options.focusIndex);
    }
    syncMode6TextEntries();
    updateMode6PositionEditor();
  }

  function resetPlayMode6(nowMs) {
    const now = Number.isFinite(nowMs) ? nowMs : performance.now();
    const currentTexts = normalizeMode6Segments(playMode6.texts);
    playMode6.cycleStartMs = now;
    playMode6.focusStartMs = now;
    playMode6.activeIndex = 0;
    playMode6.previousIndex = 0;
    playMode6.shapeAngleRad = 0;
    playMode6.userYawRad = 0;
    playMode6.userPitchRad = 0;
    playMode6.pointerDown = false;
    playMode6.positionOverrides = [];
    playMode6.positionSelectedIndex = 0;
    playMode6.positionViewYawRad = 0;
    playMode6.positionViewPitchRad = 0;
    playMode6.sphereRadiusScale = constants.defaultMode6SphereRadiusScale;
    playMode6.holdMs = constants.defaultMode6FocusHoldMs;
    playMode6.transitionMs = constants.defaultMode6FocusTransitionMs;
    playMode6.driftHold = constants.defaultMode6DriftHold;
    playMode6.baseShapeWidthRatio = 0.24;
    playMode6.canvasShiftCssY = 0;
    playMode6.fillTextSize = true;
    playMode6.distributionMode = normalizeMode6DistributionMode(playMode6.distributionMode);
    playMode6.distributionPhase = 0.4;
    syncMode6FillTextToggleInput();
    syncMode6DistributionInput();
    syncMode6SphereRadiusInputs();
    syncMode6TimingInputs();
    syncMode6DriftHoldToggleInput();
    setMode6Texts(currentTexts);
  }

  function computeMode6NeutralShapeMetrics() {
    const previousRotX = stage.rotX;
    const previousRotY = stage.rotY;
    const previousRotZ = stage.rotZ;
    const previousPosX = stage.pos[0];
    const previousPosY = stage.pos[1];
    stage.rotX = 0;
    stage.rotY = 0;
    stage.rotZ = 0;
    stage.pos[0] = 0;
    stage.pos[1] = 0;
    const metrics = computeShapeProjectedMetrics();
    stage.rotX = previousRotX;
    stage.rotY = previousRotY;
    stage.rotZ = previousRotZ;
    stage.pos[0] = previousPosX;
    stage.pos[1] = previousPosY;
    return metrics;
  }

  function captureMode6BaseShapeMetrics() {
    const metrics = computeMode6NeutralShapeMetrics();
    const rect = frame.getBoundingClientRect();
    if (!metrics || canvas.width < 2 || rect.width < 2 || rect.height < 2) return;
    playMode6.baseShapeWidthRatio = clamp(
      metrics.boundsWidthPx / Math.max(1, canvas.width),
      0.08,
      0.8,
    );
    const topPaddingCss = Math.min(rect.width, rect.height) * constants.defaultMode6TopPaddingRatio;
    const topCss =
      (metrics.centerY - metrics.boundsHeightPx * 0.5) *
      (rect.height / Math.max(1, canvas.height));
    playMode6.canvasShiftCssY = topPaddingCss - topCss;
  }

  function refreshMode6BaseLayout() {
    if (state.playMode !== "play5") return;
    captureMode6BaseShapeMetrics();
    updateMode6CanvasTransform();
    updateMode6TextOrbit();
    updateMode6PositionEditor();
    updateMode6OlabTransform();
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
    const base = mode === "play5" ? 0.84 : 0.96;
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

  function applyPlay2State(dt) {
    stage.rotX = 0;
    stage.rotZ = 0;
    stage.rotY += constants.defaultPlay2SpinYSpeed * dt;
    stage.pos[0] = 0;
    stage.pos[1] = 0;
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

  function resetPlayMode4ToInitialState(nowMs) {
    const now = Number.isFinite(nowMs) ? nowMs : performance.now();
    playMode4.phase = "hold";
    playMode4.phaseStartMs = now;
    playMode4.startYRad = -Math.PI / 2;
    playMode4.zoomZ = constants.defaultPlay6ZoomZ;
    playMode4.expandedLengthSvg = constants.defaultFrustumLengthSvg;
    playMode4.lengthCurrent = constants.defaultFrustumLengthSvg;
    playMode4.diameterCurrent = constants.defaultFrustumLargeDiameterSvg;
    playMode4.baseGreenActive = true;
    playMode4.photoSwitchedInSpin = false;
    playMode4.fixedXRad = 0;
    playMode4.fixedZRad = 0;
    playMode4.holdFromXRad = 0;
    playMode4.holdFromZRad = 0;
    playMode4.nextXRad = 0;
    playMode4.nextZRad = 0;
  }

  function setMode5LabAngle(primaryRad, secondaryRad) {
    playMode5.labAngleRad = primaryRad;
    if (mode5OlabPrimary && mode5OlabPrimary.svg) {
      mode5OlabPrimary.svg.style.transform = `rotateY(${primaryRad}rad)`;
    }
    if (mode5OlabSecondary && mode5OlabSecondary.svg) {
      const resolvedSecondary = Number.isFinite(secondaryRad) ? secondaryRad : primaryRad;
      mode5OlabSecondary.svg.style.transform = `rotateY(${resolvedSecondary}rad)`;
    }
  }

  function resetPlayMode5(nowMs) {
    const now = Number.isFinite(nowMs) ? nowMs : performance.now();
    playMode5.phase = "shape";
    playMode5.phaseStartMs = now;
    playMode5.baseAngleRad = 0;
    playMode5.currentAngleRad = 0;
    playMode5.showOlab = false;
    playMode5.stackMode = false;
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
    setMode5LabAngle(0, 0);
  }

  function setMode5OlabInstanceVisible(instance, visible) {
    if (!instance || !instance.wrap) return;
    instance.wrap.style.display = visible ? "block" : "none";
    instance.wrap.setAttribute("aria-hidden", visible ? "false" : "true");
  }

  function syncMode5OlabFrameState() {
    if (!frame) return;
    const anyVisible = mode5OlabInstances.some(
      (instance) => instance && instance.wrap && instance.wrap.style.display !== "none",
    );
    frame.classList.toggle("mode5-olab-active", anyVisible);
  }

  function setMode5OlabVisible(visible) {
    setMode5OlabInstanceVisible(mode5OlabPrimary, visible);
    if (mode5OlabSecondary) {
      setMode5OlabInstanceVisible(mode5OlabSecondary, false);
    }
    syncMode5OlabFrameState();
  }

  function setMode6Visible(visible) {
    if (frame) {
      frame.classList.toggle("mode6-text-active", !!visible);
    }
    if (canvas && !visible) {
      canvas.style.transform = "none";
    }
    mode6TextLayers.forEach((layer) => {
      if (!layer || !layer.orbit) return;
      layer.orbit.style.display = "none";
      layer.orbit.setAttribute("aria-hidden", "true");
    });
    if (mode6TextCanvas) {
      mode6TextCanvas.style.display = visible ? "block" : "none";
    }
    if (!visible) {
      clearMode6TextCanvas();
    }
    if (mode6OlabInstance && mode6OlabInstance.wrap) {
      mode6OlabInstance.wrap.style.display = "none";
      mode6OlabInstance.wrap.setAttribute("aria-hidden", "true");
    }
  }

  function updateMode6CanvasTransform() {
    if (!canvas) return;
    if (state.playMode !== "play5") {
      canvas.style.transform = "none";
      return;
    }
    const shiftCssY = Number.isFinite(playMode6.canvasShiftCssY) ? playMode6.canvasShiftCssY : 0;
    canvas.style.transform = `translate3d(0, ${shiftCssY.toFixed(3)}px, 0)`;
  }

  function updateMode6OlabTransform() {
    if (mode6OlabInstance && mode6OlabInstance.wrap) {
      mode6OlabInstance.wrap.style.display = "none";
      mode6OlabInstance.wrap.setAttribute("aria-hidden", "true");
    }
  }

  function hideMode6TextLayers() {
    mode6TextLayers.forEach((layer) => {
      if (!layer || !layer.orbit) return;
      layer.orbit.style.display = "none";
    });
  }

  function clearMode6TextCanvas() {
    if (!mode6TextGl || !mode6TextCanvas) return;
    mode6TextGl.viewport(0, 0, mode6TextCanvas.width, mode6TextCanvas.height);
    mode6TextGl.clearColor(0, 0, 0, 0);
    mode6TextGl.clear(mode6TextGl.COLOR_BUFFER_BIT);
  }

  function resizeMode6TextCanvas() {
    if (!mode6TextCanvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = frame.getBoundingClientRect();
    mode6TextCanvas.width = Math.max(2, Math.floor(rect.width * dpr));
    mode6TextCanvas.height = Math.max(2, Math.floor(rect.height * dpr));
    clearMode6TextCanvas();
  }

  function getMode6DistributionDirection(index, total, mode) {
    const safeTotal = Math.max(total, 1);
    const t = (index + 0.5) / safeTotal;
    const theta = index * constants.mode6GoldenAngle + playMode6.distributionPhase;
    const normalizedMode = normalizeMode6DistributionMode(mode);

    if (normalizedMode === "cap") {
      const maxAngle = (66 * Math.PI) / 180;
      const cosAngle = 1 - t * (1 - Math.cos(maxAngle));
      const ringRadius = Math.sqrt(Math.max(0, 1 - cosAngle * cosAngle));
      return normalizeVec3([
        Math.cos(theta) * ringRadius,
        Math.sin(theta) * ringRadius,
        -cosAngle,
      ]);
    }

    if (normalizedMode === "band") {
      const y = (t - 0.5) * 0.62;
      const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
      return normalizeVec3([
        Math.cos(theta) * ringRadius,
        y,
        -Math.sin(theta) * ringRadius,
      ]);
    }

    const y = 1 - t * 2;
    const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
    return normalizeVec3([
      Math.cos(theta) * ringRadius,
      y,
      -Math.sin(theta) * ringRadius,
    ]);
  }

  function getMode6TextDirection(index, total, mode) {
    const override = normalizeMode6PositionCoords(playMode6.positionOverrides[index]);
    if (override) {
      return getMode6DirectionFromPositionCoords(override);
    }
    return getMode6DistributionDirection(index, total, mode);
  }

  function normalizeMode6Quat(q) {
    const len = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
    return [q[0] / len, q[1] / len, q[2] / len, q[3] / len];
  }

  function mode6AxisAngleQuat(axis, angleRad) {
    const safeAxis = normalizeVec3(axis);
    const half = angleRad * 0.5;
    const s = Math.sin(half);
    return [safeAxis[0] * s, safeAxis[1] * s, safeAxis[2] * s, Math.cos(half)];
  }

  function getMode6ShortestArcQuat(fromDir, toDir, fallbackAxis = [1, 0, 0]) {
    const from = normalizeVec3(fromDir);
    const to = normalizeVec3(toDir);
    const cosine = clamp(dot3(from, to), -1, 1);
    if (cosine > 0.999999) {
      return [0, 0, 0, 1];
    }
    if (cosine < -0.999999) {
      let axis = normalizeVec3([
        fallbackAxis[0] - from[0] * dot3(fallbackAxis, from),
        fallbackAxis[1] - from[1] * dot3(fallbackAxis, from),
        fallbackAxis[2] - from[2] * dot3(fallbackAxis, from),
      ]);
      if (Math.hypot(axis[0], axis[1], axis[2]) < 0.0001) {
        axis = Math.abs(from[1]) < 0.95
          ? normalizeVec3(cross3(from, [0, 1, 0]))
          : normalizeVec3(cross3(from, [1, 0, 0]));
      }
      return mode6AxisAngleQuat(axis, Math.PI);
    }
    const axis = cross3(from, to);
    return normalizeMode6Quat([axis[0], axis[1], axis[2], 1 + cosine]);
  }

  function rotateMode6VecByQuat(vector, quat) {
    const q = normalizeMode6Quat(quat);
    const u = [q[0], q[1], q[2]];
    const s = q[3];
    const uvDot = dot3(u, vector);
    const uuDot = dot3(u, u);
    const uvCross = cross3(u, vector);
    return [
      2 * uvDot * u[0] + (s * s - uuDot) * vector[0] + 2 * s * uvCross[0],
      2 * uvDot * u[1] + (s * s - uuDot) * vector[1] + 2 * s * uvCross[1],
      2 * uvDot * u[2] + (s * s - uuDot) * vector[2] + 2 * s * uvCross[2],
    ];
  }

  function slerpMode6Direction(fromDir, toDir, amount) {
    const from = normalizeVec3(fromDir);
    const to = normalizeVec3(toDir);
    const t = clamp(amount, 0, 1);
    const cosine = clamp(dot3(from, to), -1, 1);
    if (cosine > 0.9995) {
      return normalizeVec3([
        from[0] + (to[0] - from[0]) * t,
        from[1] + (to[1] - from[1]) * t,
        from[2] + (to[2] - from[2]) * t,
      ]);
    }
    if (cosine < -0.9995) {
      const fallbackAxis = Math.abs(from[1]) < 0.95 ? [0, 1, 0] : [1, 0, 0];
      const axis = normalizeVec3(cross3(from, fallbackAxis));
      return normalizeVec3(rotateMode6VecByQuat(
        from,
        mode6AxisAngleQuat(axis, Math.PI * t),
      ));
    }
    const omega = Math.acos(cosine);
    const sinOmega = Math.sin(omega);
    const fromScale = Math.sin((1 - t) * omega) / sinOmega;
    const toScale = Math.sin(t * omega) / sinOmega;
    return normalizeVec3([
      from[0] * fromScale + to[0] * toScale,
      from[1] * fromScale + to[1] * toScale,
      from[2] * fromScale + to[2] * toScale,
    ]);
  }

  function getMode6ProjectedUp(faceDir, primaryUp = [0, 1, 0]) {
    const normal = normalizeVec3(faceDir);
    const candidates = [primaryUp, [0, 0, 1], [1, 0, 0]];
    for (const candidate of candidates) {
      const projected = [
        candidate[0] - normal[0] * dot3(candidate, normal),
        candidate[1] - normal[1] * dot3(candidate, normal),
        candidate[2] - normal[2] * dot3(candidate, normal),
      ];
      if (Math.hypot(projected[0], projected[1], projected[2]) > 0.0001) {
        return normalizeVec3(projected);
      }
    }
    return [0, 1, 0];
  }

  function getMode6ViewBasisForDirection(direction) {
    const forward = normalizeVec3(direction);
    const up = getMode6ProjectedUp(forward);
    const right = normalizeVec3(cross3(forward, up));
    return {
      right,
      up: normalizeVec3(cross3(right, forward)),
      forward,
    };
  }

  function orthonormalizeMode6ViewBasis(right, forward) {
    const safeForward = normalizeVec3(forward);
    let safeRight = [
      right[0] - safeForward[0] * dot3(right, safeForward),
      right[1] - safeForward[1] * dot3(right, safeForward),
      right[2] - safeForward[2] * dot3(right, safeForward),
    ];
    if (Math.hypot(safeRight[0], safeRight[1], safeRight[2]) < 0.0001) {
      safeRight = getMode6ViewBasisForDirection(safeForward).right;
    } else {
      safeRight = normalizeVec3(safeRight);
    }
    return {
      right: safeRight,
      up: normalizeVec3(cross3(safeRight, safeForward)),
      forward: safeForward,
    };
  }

  function getMode6SignedAngleAroundAxis(fromVec, toVec, axisVec) {
    const axis = normalizeVec3(axisVec);
    let from = [
      fromVec[0] - axis[0] * dot3(fromVec, axis),
      fromVec[1] - axis[1] * dot3(fromVec, axis),
      fromVec[2] - axis[2] * dot3(fromVec, axis),
    ];
    let to = [
      toVec[0] - axis[0] * dot3(toVec, axis),
      toVec[1] - axis[1] * dot3(toVec, axis),
      toVec[2] - axis[2] * dot3(toVec, axis),
    ];
    if (Math.hypot(from[0], from[1], from[2]) < 0.0001 ||
        Math.hypot(to[0], to[1], to[2]) < 0.0001) {
      return 0;
    }
    from = normalizeVec3(from);
    to = normalizeVec3(to);
    return Math.atan2(dot3(axis, cross3(from, to)), clamp(dot3(from, to), -1, 1));
  }

  function getMode6TransportViewBasis(fromDir, toDir, amount) {
    const fromForward = normalizeVec3(fromDir);
    const toForward = normalizeVec3(toDir);
    const t = clamp(amount, 0, 1);
    const fromBasis = getMode6ViewBasisForDirection(fromForward);
    const currentForward = slerpMode6Direction(fromForward, toForward, t);
    const currentTransportQuat = getMode6ShortestArcQuat(
      fromForward,
      currentForward,
      fromBasis.right,
    );
    const transportedRight = rotateMode6VecByQuat(fromBasis.right, currentTransportQuat);
    return {
      basis: orthonormalizeMode6ViewBasis(transportedRight, currentForward),
      fromBasis,
      currentForward,
      transportedRight,
    };
  }

  function getMode6TransitionViewBasis(fromDir, toDir, amount, rollStartAmount = 0) {
    const fromForward = normalizeVec3(fromDir);
    const toForward = normalizeVec3(toDir);
    const t = clamp(amount, 0, 1);
    const transport = getMode6TransportViewBasis(fromForward, toForward, t);
    const toBasis = getMode6ViewBasisForDirection(toForward);
    const endTransportQuat = getMode6ShortestArcQuat(
      fromForward,
      toForward,
      transport.fromBasis.right,
    );
    const transportedEndRight = rotateMode6VecByQuat(transport.fromBasis.right, endTransportQuat);
    const rollDelta = getMode6SignedAngleAroundAxis(
      transportedEndRight,
      toBasis.right,
      toForward,
    );
    const rollStart = clamp(rollStartAmount, 0, 0.95);
    const rollMix = t <= rollStart ? 0 : clamp((t - rollStart) / Math.max(0.0001, 1 - rollStart), 0, 1);
    const correctedRight = rotateMode6VecByQuat(
      transport.transportedRight,
      mode6AxisAngleQuat(transport.currentForward, rollDelta * rollMix),
    );
    return orthonormalizeMode6ViewBasis(correctedRight, transport.currentForward);
  }

  function getMode6FocusTiming(timeMs) {
    const transitionMs = Math.max(1, getMode6TransitionMs());
    const holdMs = Math.max(1, getMode6HoldMs());
    const elapsed = Math.max(0, timeMs - playMode6.focusStartMs);
    const progress = clamp(elapsed / transitionMs, 0, 1);
    const eased = easeInOutStrong01(progress);
    const driftLead = playMode6.driftHold
      ? clamp(constants.mode6HoldDriftProgress, 0, 0.35)
      : 0;
    const linearBlend = playMode6.driftHold
      ? clamp(constants.mode6DriftTransitionLinearBlend, 0, 0.35)
      : 0;
    const shiftCurve = eased + (progress - eased) * linearBlend;
    const holdProgress = clamp((elapsed - transitionMs) / holdMs, 0, 1);
    return {
      progress,
      eased,
      shiftAmount: driftLead + (1 - driftLead) * shiftCurve,
      driftLead,
      driftAmount: driftLead * holdProgress,
      holdProgress,
      transitioning: progress < 1,
    };
  }

  function getMode6VisibleTextIndices(total, timeMs) {
    const safeTotal = Math.max(total, 1);
    const activeIndex =
      ((playMode6.activeIndex % safeTotal) + safeTotal) % safeTotal;
    const previousIndex =
      ((playMode6.previousIndex % safeTotal) + safeTotal) % safeTotal;
    const timing = getMode6FocusTiming(timeMs);
    if (!timing.transitioning || previousIndex === activeIndex) {
      return new Set([activeIndex]);
    }
    return new Set([previousIndex, activeIndex]);
  }

  function getMode6FocusBasis(total, timeMs) {
    const safeTotal = Math.max(total, 1);
    const fromIndex =
      ((playMode6.previousIndex % safeTotal) + safeTotal) % safeTotal;
    const toIndex =
      ((playMode6.activeIndex % safeTotal) + safeTotal) % safeTotal;
    const fromDir = applyMode6UserRotation(
      getMode6TextDirection(
        fromIndex,
        safeTotal,
        playMode6.distributionMode,
      ),
    );
    const toDir = applyMode6UserRotation(
      getMode6TextDirection(
        toIndex,
        safeTotal,
        playMode6.distributionMode,
      ),
    );
    const timing = getMode6FocusTiming(timeMs);
    if (!timing.transitioning || fromIndex === toIndex) {
      if (playMode6.driftHold && safeTotal > 1 && timing.driftAmount > 0.0001) {
        const nextIndex = (toIndex + 1) % safeTotal;
        const nextDir = applyMode6UserRotation(
          getMode6TextDirection(
            nextIndex,
            safeTotal,
            playMode6.distributionMode,
          ),
        );
        const driftBasis = getMode6TransportViewBasis(toDir, nextDir, timing.driftAmount).basis;
        return {
          ...driftBasis,
          focusDirection: driftBasis.forward,
        };
      }
      const settledBasis = getMode6ViewBasisForDirection(toDir);
      return {
        ...settledBasis,
        focusDirection: toDir,
      };
    }
    const transitionBasis = getMode6TransitionViewBasis(
      fromDir,
      toDir,
      timing.shiftAmount,
      playMode6.driftHold ? timing.driftLead : 0,
    );
    return {
      ...transitionBasis,
      focusDirection: transitionBasis.forward,
    };
  }

  function applyMode6ViewBasis(direction, basis) {
    if (basis && basis.quat) {
      return normalizeVec3(rotateMode6VecByQuat(direction, basis.quat));
    }
    return normalizeVec3([
      dot3(direction, basis.right),
      dot3(direction, basis.up),
      dot3(direction, basis.forward),
    ]);
  }

  function mode6ViewToCameraVec(vector) {
    return [vector[0], vector[1], -vector[2]];
  }

  function getMode6TextTangentBasis(direction) {
    const normal = normalizeVec3(direction);
    const up = getMode6ProjectedUp(normal);
    const right = normalizeVec3(cross3(normal, up));
    return {
      right,
      up: normalizeVec3(cross3(right, normal)),
    };
  }

  function applyMode6UserRotation(direction) {
    let rotated = rotateY3(
      direction[0],
      direction[1],
      direction[2],
      playMode6.userYawRad,
    );
    rotated = rotateX3(
      rotated[0],
      rotated[1],
      rotated[2],
      playMode6.userPitchRad,
    );
    return normalizeVec3(rotated);
  }

  function getMode6TextFillTargetCss(rect) {
    if (!rect || rect.width < 2 || rect.height < 2) {
      return { width: 1, height: 1 };
    }
    const gridMargin = getEffectiveTypeGridSpacing(rect).marginCss;
    const safeMargin = clamp(
      Number.isFinite(gridMargin) ? gridMargin : 0,
      0,
      Math.min(rect.width, rect.height) * 0.45,
    );
    return {
      width: Math.max(1, rect.width - safeMargin * 2),
      height: Math.max(1, rect.height - safeMargin * 2),
    };
  }

  function getMode6TextCssMetrics(entry, rect) {
    let baseFontSizeCss = clamp(
      rect.width * constants.defaultMode6TextFontSizeRatio,
      22,
      96,
    );
    if (playMode6.fillTextSize) {
      const fill = clamp(constants.defaultMode6TextFillRatio, 0.18, 1);
      const target = getMode6TextFillTargetCss(rect);
      const inkWidth = Math.max(1, entry.inkWidth || entry.logicalWidth);
      const inkHeight = Math.max(1, entry.inkHeight || entry.logicalHeight);
      const widthFontSize = (target.width * fill * entry.baseFontPx) / inkWidth;
      const heightFontSize = (target.height * fill * entry.baseFontPx) / inkHeight;
      baseFontSizeCss = Math.max(22, Math.min(widthFontSize, heightFontSize));
    }
    const widthCss = entry.logicalWidth * (baseFontSizeCss / entry.baseFontPx);
    const heightCss = entry.logicalHeight * (baseFontSizeCss / entry.baseFontPx);
    const cssPerLogical = baseFontSizeCss / entry.baseFontPx;
    const inkCenterX =
      (Number.isFinite(entry.inkLeft) && Number.isFinite(entry.inkRight))
        ? (entry.inkLeft + entry.inkRight) * 0.5
        : entry.logicalWidth * 0.5;
    const inkCenterY =
      (Number.isFinite(entry.inkTop) && Number.isFinite(entry.inkBottom))
        ? (entry.inkTop + entry.inkBottom) * 0.5
        : entry.logicalHeight * 0.5;
    return {
      widthCss,
      heightCss,
      inkOffsetCssX: (inkCenterX - entry.logicalWidth * 0.5) * cssPerLogical,
      inkOffsetCssY: (entry.logicalHeight * 0.5 - inkCenterY) * cssPerLogical,
      referenceDepth: Math.max(0.35, getActiveCameraZ() * 0.58),
    };
  }

  function getMode6TextWorldMetrics(entry, rect, depthOverride) {
    const cssMetrics = getMode6TextCssMetrics(entry, rect);
    const depth = Math.max(
      0.05,
      Number.isFinite(depthOverride) ? depthOverride : cssMetrics.referenceDepth,
    );
    const worldPerCss = getWorldUnitsPerCssPixelAtDepth(depth, rect.width, rect.height);
    return {
      widthWorld: cssMetrics.widthCss * worldPerCss.x,
      heightWorld: cssMetrics.heightCss * worldPerCss.y,
      inkOffsetWorldX: cssMetrics.inkOffsetCssX * worldPerCss.x,
      inkOffsetWorldY: cssMetrics.inkOffsetCssY * worldPerCss.y,
      referenceDepth: cssMetrics.referenceDepth,
    };
  }

  function getMode6SphereRadius(entries, rect) {
    const metricsList = entries
      .map((entry) => getMode6TextWorldMetrics(entry, rect))
      .filter(Boolean);
    const radiusScale = getMode6SphereRadiusScale(playMode6.sphereRadiusScale);
    if (!metricsList.length) {
      return Math.max(0.8, getActiveCameraZ() * 0.58) * radiusScale;
    }
    return Math.max(...metricsList.map((metrics) => metrics.referenceDepth)) * radiusScale;
  }

  function getMode6TextPlacement(entry, index, total, basis, rect, sphereRadius) {
    if (!entry || !entry.canvas || !entry.texture || rect.width < 2 || rect.height < 2) {
      return null;
    }
    const referenceMetrics = getMode6TextWorldMetrics(entry, rect);
    const radius = Math.max(
      0.1,
      Number.isFinite(sphereRadius) ? sphereRadius : referenceMetrics.referenceDepth,
    );
    const localDirection = applyMode6UserRotation(
      getMode6TextDirection(index, total, playMode6.distributionMode),
    );
    const viewDirection = applyMode6ViewBasis(localDirection, basis);
    const relCenter = mode6ViewToCameraVec([
      viewDirection[0] * radius,
      viewDirection[1] * radius,
      viewDirection[2] * radius,
    ]);
    const depth = -relCenter[2];
    if (depth <= 0.05) return null;

    const metricsDepth = playMode6.fillTextSize ? depth : referenceMetrics.referenceDepth;
    const metrics = getMode6TextWorldMetrics(entry, rect, metricsDepth);
    const localBasis = getMode6TextTangentBasis(localDirection);
    const rightDir = normalizeVec3(mode6ViewToCameraVec(
      applyMode6ViewBasis(localBasis.right, basis),
    ));
    const upDir = normalizeVec3(mode6ViewToCameraVec(
      applyMode6ViewBasis(localBasis.up, basis),
    ));
    const halfW = metrics.widthWorld * 0.5;
    const halfH = metrics.heightWorld * 0.5;
    const activeCameraZ = getActiveCameraZ();
    const inkCenterWorld = [
      relCenter[0],
      relCenter[1],
      activeCameraZ + relCenter[2],
    ];
    const textWorld = addScaled3(
      addScaled3(inkCenterWorld, rightDir, -metrics.inkOffsetWorldX),
      upDir,
      -metrics.inkOffsetWorldY,
    );
    const topLeftWorld = addScaled3(addScaled3(textWorld, rightDir, -halfW), upDir, halfH);
    const topRightWorld = addScaled3(addScaled3(textWorld, rightDir, halfW), upDir, halfH);
    const bottomLeftWorld = addScaled3(addScaled3(textWorld, rightDir, -halfW), upDir, -halfH);
    const bottomRightWorld = addScaled3(addScaled3(textWorld, rightDir, halfW), upDir, -halfH);
    return {
      entry,
      depth,
      opacity: 1,
      topLeftWorld,
      topRightWorld,
      bottomLeftWorld,
      bottomRightWorld,
    };
  }

  function drawMode6ProjectedTextEntry(placement) {
    if (!mode6TextGl || !mode6TextCanvas || !mode6TextProgram || !mode6TextQuadBuffer) return;
    if (!placement || !placement.entry) return;
    const { entry } = placement;
    if (!entry || !entry.canvas || !entry.texture) return;
    const {
      topLeftWorld,
      topRightWorld,
      bottomLeftWorld,
      bottomRightWorld,
    } = placement;
    const vertexData = new Float32Array([
      topLeftWorld[0], topLeftWorld[1], topLeftWorld[2], 0, 1,
      topRightWorld[0], topRightWorld[1], topRightWorld[2], 1, 1,
      bottomLeftWorld[0], bottomLeftWorld[1], bottomLeftWorld[2], 0, 0,
      bottomRightWorld[0], bottomRightWorld[1], bottomRightWorld[2], 1, 0,
    ]);
    mode6TextGl.useProgram(mode6TextProgram);
    mode6TextGl.bindBuffer(mode6TextGl.ARRAY_BUFFER, mode6TextQuadBuffer);
    mode6TextGl.bufferData(mode6TextGl.ARRAY_BUFFER, vertexData, mode6TextGl.DYNAMIC_DRAW);
    mode6TextGl.vertexAttribPointer(mode6TextAttribWorldPos, 3, mode6TextGl.FLOAT, false, 20, 0);
    mode6TextGl.enableVertexAttribArray(mode6TextAttribWorldPos);
    mode6TextGl.vertexAttribPointer(mode6TextAttribUv, 2, mode6TextGl.FLOAT, false, 20, 12);
    mode6TextGl.enableVertexAttribArray(mode6TextAttribUv);
    mode6TextGl.uniform1f(mode6TextUniformAspect, mode6TextCanvas.width / Math.max(1, mode6TextCanvas.height));
    mode6TextGl.uniform1f(mode6TextUniformFov, getPerspectiveFovRad());
    mode6TextGl.uniform1f(mode6TextUniformCameraZ, getActiveCameraZ());
    mode6TextGl.activeTexture(mode6TextGl.TEXTURE0);
    mode6TextGl.bindTexture(mode6TextGl.TEXTURE_2D, entry.texture);
    mode6TextGl.uniform1i(mode6TextUniformTexture, 0);
    if (mode6TextUniformOpacity) {
      mode6TextGl.uniform1f(mode6TextUniformOpacity, placement.opacity);
    }
    mode6TextGl.drawArrays(mode6TextGl.TRIANGLE_STRIP, 0, 4);
  }

  function renderMode6TextCanvas(timeMs = performance.now()) {
    clearMode6TextCanvas();
    hideMode6TextLayers();
    if (state.playMode !== "play5" || !mode6TextGl) return;
    mode6TextGl.viewport(0, 0, mode6TextCanvas.width, mode6TextCanvas.height);
    mode6TextGl.disable(mode6TextGl.DEPTH_TEST);
    mode6TextGl.enable(mode6TextGl.BLEND);
    const rect = frame.getBoundingClientRect();
    const entries = playMode6.entries.length
      ? playMode6.entries
      : constants.defaultMode6Texts.map((text) => buildMode6TextEntry(text));
    if (!entries.length || rect.width < 2 || rect.height < 2) return;
    const basis = getMode6FocusBasis(entries.length, timeMs);
    const sphereRadius = getMode6SphereRadius(entries, rect);
    const visibleIndices = getMode6VisibleTextIndices(entries.length, timeMs);
    const placements = entries
      .map((entry, index) => {
        if (!visibleIndices.has(index)) return null;
        return getMode6TextPlacement(entry, index, entries.length, basis, rect, sphereRadius);
      })
      .filter(Boolean)
      .sort((a, b) => b.depth - a.depth);
    placements.forEach(drawMode6ProjectedTextEntry);
  }

  function updateMode6TextOrbit(timeMs) {
    renderMode6TextCanvas(timeMs);
  }

  function getMode5StackHalfOffsetCssFromSphereDiameter(sphereDiameterCss) {
    return sphereDiameterCss * constants.mode5StackCenterGapRatio * 0.5;
  }

  function getMode5StackHalfOffsetWorld(rect, sphereDiameterCss) {
    const safeRect = rect || frame.getBoundingClientRect();
    const cssOffset = getMode5StackHalfOffsetCssFromSphereDiameter(sphereDiameterCss);
    const sphereCenterWorld = transformToWorld([0, 0, 0], sphereObject);
    const sphereCenterScreen = projectWorldToScreen(
      sphereCenterWorld,
      Math.max(2, canvas.width),
      Math.max(2, canvas.height),
      state.cameraZ,
    );
    if (!sphereCenterScreen) {
      return 0;
    }
    const depth = Math.max(0.25, sphereCenterScreen.depth);
    const height = Math.max(2, canvas.height);
    const f = 1 / Math.tan(getPerspectiveFovRad() * 0.5);
    const deltaPx = cssOffset * (canvas.height / Math.max(1, safeRect.height));
    const worldPerPixelY = (2 * depth) / (height * f);
    return deltaPx * worldPerPixelY;
  }

  function getMode5SphereScreenMetrics(rect) {
    const pxScaleX = canvas.width / Math.max(1, rect.width);
    const pxScaleY = canvas.height / Math.max(1, rect.height);
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
      return null;
    }
    const sphereRadiusPx = Math.hypot(
      sphereEdgePx.x - sphereCenterPx.x,
      sphereEdgePx.y - sphereCenterPx.y,
    );
    const pixelToCss = 1 / Math.max(0.0001, (pxScaleX + pxScaleY) * 0.5);
    const sphereDiameterCss = sphereRadiusPx * 2 * pixelToCss;
    return {
      pxScaleX,
      pxScaleY,
      sphereCenterWorld,
      sphereEdgeWorld,
      sphereCenterPx,
      sphereEdgePx,
      sphereDiameterCss,
    };
  }

  function updateMode5OlabInstanceTransform(instance, rect, metrics) {
    if (!instance || !instance.wrap || !instance.svg) return;
    const {
      pxScaleX,
      pxScaleY,
      sphereCenterWorld,
      sphereEdgeWorld,
      verticalOffsetCss,
      isFullCenterMode,
    } = metrics;
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
      setMode5OlabInstanceVisible(instance, false);
      return;
    }

    const sphereRadiusPx = Math.hypot(
      sphereEdgePx.x - sphereCenterPx.x,
      sphereEdgePx.y - sphereCenterPx.y,
    );
    const pixelToCss = 1 / Math.max(0.0001, (pxScaleX + pxScaleY) * 0.5);
    const sphereDiameterCss = sphereRadiusPx * 2 * pixelToCss;
    const unitScale = sphereDiameterCss / constants.mode5OlabODiameterSvg;
    const widthCss = constants.mode5OlabViewWidthSvg * unitScale;
    const heightCss = constants.mode5OlabViewHeightSvg * unitScale;
    const anchorCssX = isFullCenterMode ? rect.width * 0.5 : sphereCenterPx.x / pxScaleX;
    const anchorCssY = isFullCenterMode
      ? rect.height * 0.5 + verticalOffsetCss
      : sphereCenterPx.y / pxScaleY + verticalOffsetCss;
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

    instance.wrap.style.left = `${anchorCssX - olabAnchorX}px`;
    instance.wrap.style.top = `${anchorCssY - olabAnchorY}px`;
    instance.wrap.style.width = `${widthCss}px`;
    instance.wrap.style.height = `${heightCss}px`;
    instance.wrap.style.transformOrigin = `${olabCenterX}px ${olabCenterY}px`;
    instance.wrap.style.transform = "none";
    setMode5OlabInstanceVisible(instance, true);

    if (!isFullCenterMode) return;

    const labRect = instance.labGroup ? instance.labGroup.getBoundingClientRect() : null;
    const oRect = instance.oPath ? instance.oPath.getBoundingClientRect() : null;
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
    if (!hasLabRect && !hasORect) return;

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
    const targetCenterY = rect.top + rect.height * 0.5 + verticalOffsetCss;
    const deltaX = targetCenterX - currentCenterX;
    const deltaY = targetCenterY - currentCenterY;
    if (Math.abs(deltaX) > 0.05 || Math.abs(deltaY) > 0.05) {
      const left = parseFloat(instance.wrap.style.left) || 0;
      const top = parseFloat(instance.wrap.style.top) || 0;
      instance.wrap.style.left = `${left + deltaX}px`;
      instance.wrap.style.top = `${top + deltaY}px`;
    }
  }

  function updateMode5OlabTransform() {
    if (!mode5OlabPrimary.wrap || !mode5OlabPrimary.svg) return;
    const isPlay7 = state.playMode === "play7";
    const isStackMode = isPlay7 && playMode5.stackMode;
    const showPrimary = isPlay7 && playMode5.showOlab;
    const showSecondary = isPlay7 && isStackMode && !playMode5.showOlab;
    if (!showPrimary && !showSecondary) {
      setMode5OlabVisible(false);
      return;
    }

    const rect = frame.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) {
      setMode5OlabVisible(false);
      return;
    }

    const screenMetrics = getMode5SphereScreenMetrics(rect);
    if (!screenMetrics) {
      setMode5OlabVisible(false);
      return;
    }
    const {
      pxScaleX,
      pxScaleY,
      sphereCenterWorld,
      sphereEdgeWorld,
      sphereDiameterCss,
    } = screenMetrics;
    const stackHalfOffsetCss = isStackMode
      ? getMode5StackHalfOffsetCssFromSphereDiameter(sphereDiameterCss)
      : 0;
    const stackHalfOffsetWorld = isStackMode
      ? getMode5StackHalfOffsetWorld(rect, sphereDiameterCss)
      : 0;
    const isFullCenterMode = isPlay7 && playMode5.centerMode === "full";

    if (showPrimary) {
      updateMode5OlabInstanceTransform(mode5OlabPrimary, rect, {
        pxScaleX,
        pxScaleY,
        sphereCenterWorld,
        sphereEdgeWorld,
        verticalOffsetCss: isStackMode ? -stackHalfOffsetCss : 0,
        isFullCenterMode,
      });
    } else {
      setMode5OlabInstanceVisible(mode5OlabPrimary, false);
    }

    if (showSecondary && mode5OlabSecondary) {
      updateMode5OlabInstanceTransform(mode5OlabSecondary, rect, {
        pxScaleX,
        pxScaleY,
        sphereCenterWorld,
        sphereEdgeWorld,
        verticalOffsetCss: stackHalfOffsetCss,
        isFullCenterMode,
      });
    } else if (mode5OlabSecondary) {
      setMode5OlabInstanceVisible(mode5OlabSecondary, false);
    }

    syncMode5OlabFrameState();
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
    const f = 1 / Math.tan(getPerspectiveFovRad() * 0.5);
    const worldPerPixelX = (2 * depth * aspect) / (width * f);
    const worldPerPixelY = (2 * depth) / (height * f);
    return {
      x: clamp(deltaPxX * worldPerPixelX, -24, 24),
      y: clamp(-deltaPxY * worldPerPixelY, -24, 24),
    };
  }

  function computeShapeProjectedMetrics() {
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
      return null;
    }

    return {
      width,
      height,
      minX: stats.minX,
      maxX: stats.maxX,
      minY: stats.minY,
      maxY: stats.maxY,
      centerX: (stats.minX + stats.maxX) * 0.5,
      centerY: (stats.minY + stats.maxY) * 0.5,
      boundsWidthPx: Math.max(1, stats.maxX - stats.minX),
      boundsHeightPx: Math.max(1, stats.maxY - stats.minY),
      depth: Math.max(0.25, stats.depthSum / Math.max(1, stats.count)),
    };
  }

  function computeShapeProjectedOffsetWorld(targetCenterX, targetCenterY, metrics) {
    const safeMetrics = metrics || computeShapeProjectedMetrics();
    if (!safeMetrics) {
      return { x: 0, y: 0 };
    }
    const deltaPxX = targetCenterX - safeMetrics.centerX;
    const deltaPxY = targetCenterY - safeMetrics.centerY;
    const aspect = safeMetrics.width / safeMetrics.height;
    const f = 1 / Math.tan(getPerspectiveFovRad() * 0.5);
    const worldPerPixelX = (2 * safeMetrics.depth * aspect) / (safeMetrics.width * f);
    const worldPerPixelY = (2 * safeMetrics.depth) / (safeMetrics.height * f);
    return {
      x: clamp(deltaPxX * worldPerPixelX, -48, 48),
      y: clamp(-deltaPxY * worldPerPixelY, -48, 48),
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
    setMode5LabAngle(angle, playMode5.stackMode ? -angle : angle);
  }

  function applyPlayMode6State(timeMs) {
    const cycleMs = Math.max(1, getMode6CycleMs());
    let elapsed = Math.max(0, timeMs - playMode6.cycleStartMs);
    while (elapsed >= cycleMs) {
      elapsed -= cycleMs;
      playMode6.cycleStartMs = timeMs - elapsed;
      playMode6.previousIndex = playMode6.activeIndex;
      playMode6.activeIndex =
        (playMode6.activeIndex + 1) % Math.max(1, playMode6.texts.length);
      playMode6.focusStartMs = timeMs - elapsed;
    }

    const focusTiming = getMode6FocusTiming(timeMs);
    const transitionSpin = focusTiming.eased * Math.PI * 0.18;
    const shapeAngle = -timeMs * 0.00018 - transitionSpin;
    playMode6.shapeAngleRad = shapeAngle;
    stage.rotX = 0;
    stage.rotY = shapeAngle;
    stage.rotZ = 0;
    stage.pos[0] = 0;
    stage.pos[1] = 0;
    updateMode6CanvasTransform();
    updateMode6TextOrbit(timeMs);
    updateMode6PositionCameraPreview(timeMs);
    updateMode6OlabTransform();
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
      const easedSpin = applyMode4Ease01(spinProgress);
      nextY = playMode4.startYRad - Math.PI * 2 * playMode4.yTurns * easedSpin;

      nextCameraZ = playMode4.zoomZ;

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
    if (state.playMode === "play5") {
      if (event.button !== 0) return;
      playMode6.pointerDown = true;
      playMode6.pointerX = event.clientX;
      playMode6.pointerY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
      event.preventDefault();
      return;
    }
    if (state.playMode !== "off") return;
    if (state.typeLayout !== "free") return;
    if (event.button !== 0 && event.button !== 2) return;
    isDraggingModel = true;
    dragModelMode = event.button === 2 ? "pan" : "rotate";
    prevPointerX = event.clientX;
    prevPointerY = event.clientY;
    if (dragModelMode === "pan") {
      rotVelX = 0;
      rotVelY = 0;
      rotVelZ = 0;
      event.preventDefault();
    }
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (playMode6.pointerDown && state.playMode === "play5") {
      const dx = event.clientX - playMode6.pointerX;
      const dy = event.clientY - playMode6.pointerY;
      playMode6.pointerX = event.clientX;
      playMode6.pointerY = event.clientY;
      playMode6.userYawRad += dx * 0.006;
      playMode6.userPitchRad = clamp(
        playMode6.userPitchRad + dy * 0.004,
        -Math.PI * 0.45,
        Math.PI * 0.45,
      );
      updateMode6TextOrbit();
      event.preventDefault();
      return;
    }
    if (!isDraggingModel) return;
    const dx = event.clientX - prevPointerX;
    const dy = event.clientY - prevPointerY;
    prevPointerX = event.clientX;
    prevPointerY = event.clientY;
    if (dragModelMode === "pan") {
      const worldPerCssPixel = getModelPanWorldPerCssPixel();
      stage.pos[0] += dx * worldPerCssPixel.x;
      stage.pos[1] -= dy * worldPerCssPixel.y;
      rotVelX = 0;
      rotVelY = 0;
      rotVelZ = 0;
      event.preventDefault();
      return;
    }
    stage.rotY += dx * 0.012;
    stage.rotX += dy * 0.012;
    stage.rotZ += (dx - dy) * 0.0025;
    rotVelY = dx * 0.0019;
    rotVelX = dy * 0.0019;
    rotVelZ = (dx - dy) * 0.00055;
  });

  canvas.addEventListener("pointerup", (event) => {
    if (playMode6.pointerDown) {
      playMode6.pointerDown = false;
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      return;
    }
    if (!isDraggingModel) return;
    isDraggingModel = false;
    dragModelMode = "rotate";
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
  });

  canvas.addEventListener("pointercancel", () => {
    playMode6.pointerDown = false;
    isDraggingModel = false;
    dragModelMode = "rotate";
  });

  canvas.addEventListener("contextmenu", (event) => {
    if (state.playMode !== "off") return;
    event.preventDefault();
  });

  function handleZoomWheel(event) {
    event.preventDefault();
    if (state.playMode === "off" && state.typeLayout !== "free") {
      return;
    }
    setCameraZoom(state.cameraZ + event.deltaY * 0.03);
  }

  canvas.addEventListener("wheel", handleZoomWheel, { passive: false });
  if (frame) {
    frame.addEventListener("wheel", handleZoomWheel, { passive: false });
  }

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

  if (play1EnvironmentToggle) {
    play1EnvironmentToggle.addEventListener("change", () => {
      playMode1.environmentEnabled = play1EnvironmentToggle.checked;
      syncPlay1EnvironmentToggle();
      updatePlay1EnvironmentVisual();
    });
  }

  if (play1EnvironmentInput) {
    play1EnvironmentInput.addEventListener("change", async () => {
      const file = play1EnvironmentInput.files && play1EnvironmentInput.files[0];
      if (!file) return;
      let result;
      try {
        result = await setPlay1EnvironmentFromFile(file);
      } catch (error) {
        result = { ok: false, reason: "exr-runtime" };
      }
      if (result.ok) {
        playMode1.environmentEnabled = true;
        syncPlay1EnvironmentToggle();
      }
      copyStatus.textContent = result.ok
        ? (result.source === "exr"
            ? "360 EXR environment converted and loaded."
            : "360 environment photo loaded.")
        : result.reason === "unsupported"
          ? "Selected file is not an image or EXR."
          : result.reason === "exr-runtime"
            ? "EXR parser failed to load. Check network once, then try again."
            : "Environment image load failed.";
      if (!result.ok) {
        play1EnvironmentInput.value = "";
      }
      updatePlay1EnvironmentVisual();
    });
  }

  if (clearPlay1EnvironmentButton) {
    clearPlay1EnvironmentButton.addEventListener("click", async () => {
      try {
        await clearPlay1EnvironmentCustomPhoto();
        copyStatus.textContent = "Environment photo cleared.";
      } catch (error) {
        copyStatus.textContent = "Built-in environment reload failed.";
      }
      updatePlay1EnvironmentVisual();
    });
  }

  if (mode5StackToggle) {
    mode5StackToggle.addEventListener("change", () => {
      setMode5StackMode(mode5StackToggle.checked);
    });
  }

  playModeSelect.addEventListener("change", () => {
    state.playMode = playModeSelect.value;
    syncModePanels();
    isDraggingModel = false;
    dragModelMode = "rotate";
    rotVelX = 0;
    rotVelY = 0;
    rotVelZ = 0;
    stage.pos[0] = 0;
    stage.pos[1] = 0;
    const now = performance.now();
    setMode5OlabVisible(false);
    setMode6Visible(false);
    playMode5.showOlab = false;
    if (state.playMode === "play6") {
      resetPlayMode4ToInitialState(now);
      setPerspectiveFov(constants.defaultPlay6PerspectiveFovDeg);
      stage.rotX = 0;
      stage.rotY = playMode4.startYRad;
      stage.rotZ = 0;
      stage.pos[1] = 0;
      setCameraZoom(playMode4.zoomZ);
      syncMode4ExpandedLengthInput();
      syncMode4MotionInputs();
      rebuildFrustumFor(playMode4.lengthCurrent, playMode4.diameterCurrent);
      return;
    }
    if (state.playMode === "play7") {
      resetPlayMode5(now);
      stage.rotX = playMode5.fixedXRad;
      stage.rotY = 0;
      stage.rotZ = playMode5.fixedZRad;
      setMode5CenterMode(mode5CenterModeSelect ? mode5CenterModeSelect.value : playMode5.centerMode);
      setMode5StackMode(mode5StackToggle ? mode5StackToggle.checked : false);
      rebuildFrustumFor(state.frustumLengthSvg, state.frustumLargeDiameterSvg);
      return;
    }
    if (state.playMode === "play5") {
      resetPlayMode6(now);
      stage.rotX = 0;
      stage.rotY = 0;
      stage.rotZ = 0;
      stage.pos[0] = 0;
      stage.pos[1] = 0;
      setMode6Visible(true);
      setPerspectiveFov(constants.defaultPlay6PerspectiveFovDeg);
      setCameraZoom(constants.defaultMode6CameraZ);
      rebuildFrustumFor(state.frustumLengthSvg, state.frustumLargeDiameterSvg);
      refreshMode6BaseLayout();
      return;
    }
    if (state.playMode === "play2") {
      stage.rotX = 0;
      stage.rotY = 0;
      stage.rotZ = 0;
      rebuildFrustumFor(state.frustumLengthSvg, state.frustumLargeDiameterSvg);
      return;
    }
    if (
      state.playMode === "play1" ||
      state.playMode === "play4"
    ) {
      setupPlayYSpin(state.playMode);
      playMotion.vy = samplePlayYSpinSpeed(now);
    }
    if (
      state.playMode === "play1" ||
      state.playMode === "play4"
    ) {
      schedulePlayOrbitTargets(now);
    }
    if (state.playMode === "play4") {
      rebuildFrustumFor(constants.fixedPlay3LengthSvg, getFixedPlay3DiameterSvg());
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
    setCameraZoom(zoomRange.value);
  });

  zoomNumber.addEventListener("input", () => {
    setCameraZoom(zoomNumber.value);
  });

  zoomNumber.addEventListener("blur", () => {
    zoomNumber.value = state.cameraZ.toFixed(1);
  });

  if (perspectiveRange) {
    perspectiveRange.addEventListener("input", () => {
      setPerspectiveFov(perspectiveRange.value);
    });
  }

  if (perspectiveNumber) {
    perspectiveNumber.addEventListener("input", () => {
      setPerspectiveFov(perspectiveNumber.value);
    });
    perspectiveNumber.addEventListener("blur", () => {
      syncPerspectiveInputs();
    });
  }

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

  if (mode6SegmentsList) {
    mode6SegmentsList.addEventListener("focusin", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const segmentInput = target.closest(".mode6-segment-input");
      if (!segmentInput) return;
      const index = Number(segmentInput.dataset.segmentIndex);
      selectMode6PositionSegment(index);
    });
    mode6SegmentsList.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLTextAreaElement)) return;
      const index = Number(target.dataset.segmentIndex);
      if (!Number.isInteger(index) || index < 0 || index >= playMode6.texts.length) return;
      playMode6.texts[index] = String(target.value ?? "").replace(/\r\n?/g, "\n");
      if (playMode6.entries[index] && playMode6.entries[index].texture) {
        deleteMode6TextTexture(playMode6.entries[index].texture);
      }
      playMode6.entries[index] = buildMode6TextEntry(playMode6.texts[index]);
      updateMode6PositionEditorMarkers();
      renderMode6TextCanvas();
    });
    mode6SegmentsList.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const removeButton = target.closest(".mode6-segment-remove");
      if (!removeButton) return;
      const index = Number(removeButton.dataset.segmentIndex);
      if (!Number.isInteger(index) || playMode6.texts.length <= 1) return;
      const nextTexts = playMode6.texts.slice();
      const nextPositions = playMode6.positionOverrides.slice();
      nextTexts.splice(index, 1);
      nextPositions.splice(index, 1);
      setMode6Texts(nextTexts, {
        focusIndex: Math.max(0, Math.min(index, nextTexts.length - 1)),
        positionOverrides: nextPositions,
      });
      updateMode6TextOrbit();
    });
  }

  if (mode6PositionEditor) {
    mode6PositionEditor.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const actionButton = target.closest("[data-mode6-position-action]");
      if (actionButton instanceof HTMLElement) {
        const action = actionButton.dataset.mode6PositionAction;
        if (action === "reset-point") {
          resetMode6SegmentPosition(clampMode6PositionSelectedIndex());
        } else if (action === "reset-view") {
          playMode6.positionViewYawRad = 0;
          playMode6.positionViewPitchRad = 0;
          updateMode6PositionEditorMarkers();
        }
        event.preventDefault();
        return;
      }

      const marker = target.closest(".mode6-sphere-marker, .mode6-position-chip");
      if (marker instanceof HTMLElement) {
        selectMode6PositionSegment(Number(marker.dataset.segmentIndex));
        event.preventDefault();
      }
    });

    mode6PositionEditor.addEventListener("pointerdown", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const sphere = target.closest(".mode6-sphere-map");
      if (!(sphere instanceof HTMLElement)) return;
      const marker = target.closest(".mode6-sphere-marker");
      const index =
        marker instanceof HTMLElement
          ? Number(marker.dataset.segmentIndex)
          : clampMode6PositionSelectedIndex();
      if (!Number.isInteger(index) || index < 0 || index >= playMode6.texts.length) return;
      playMode6.positionSelectedIndex = index;
      mode6PositionDrag = {
        type: marker instanceof HTMLElement ? "marker" : "view",
        index,
        sphere,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startYaw: playMode6.positionViewYawRad,
        startPitch: playMode6.positionViewPitchRad,
      };
      sphere.setPointerCapture(event.pointerId);
      if (mode6PositionDrag.type === "marker") {
        setMode6SegmentPosition(
          index,
          getMode6PositionCoordsFromEditorPointer(sphere, event),
        );
      } else {
        updateMode6PositionEditorMarkers();
      }
      event.preventDefault();
      event.stopPropagation();
    });

    mode6PositionEditor.addEventListener("pointermove", (event) => {
      if (!mode6PositionDrag || mode6PositionDrag.pointerId !== event.pointerId) return;
      if (mode6PositionDrag.type === "marker") {
        setMode6SegmentPosition(
          mode6PositionDrag.index,
          getMode6PositionCoordsFromEditorPointer(mode6PositionDrag.sphere, event),
        );
      } else {
        playMode6.positionViewYawRad =
          mode6PositionDrag.startYaw + (event.clientX - mode6PositionDrag.startX) * 0.012;
        playMode6.positionViewPitchRad = clamp(
          mode6PositionDrag.startPitch - (event.clientY - mode6PositionDrag.startY) * 0.012,
          -Math.PI * 0.5,
          Math.PI * 0.5,
        );
        updateMode6PositionEditorMarkers();
      }
      event.preventDefault();
      event.stopPropagation();
    });

    const endMode6PositionEditorDrag = (event) => {
      if (!mode6PositionDrag || mode6PositionDrag.pointerId !== event.pointerId) return;
      try {
        mode6PositionDrag.sphere.releasePointerCapture(event.pointerId);
      } catch (_) {
        // Pointer capture may already be released by the browser.
      }
      mode6PositionDrag = null;
      event.preventDefault();
      event.stopPropagation();
    };

    mode6PositionEditor.addEventListener("pointerup", endMode6PositionEditorDrag);
    mode6PositionEditor.addEventListener("pointercancel", endMode6PositionEditorDrag);
    mode6PositionEditor.addEventListener("keydown", (event) => {
      if (!(event.target instanceof HTMLElement)) return;
      const isEditorTarget = !!event.target.closest(".mode6-sphere-map");
      if (!isEditorTarget) return;
      const index = clampMode6PositionSelectedIndex();
      const step = event.shiftKey ? 0.12 : 0.035;
      let dx = 0;
      let dy = 0;
      if (event.key === "ArrowLeft") dx = -step;
      if (event.key === "ArrowRight") dx = step;
      if (event.key === "ArrowUp") dy = step;
      if (event.key === "ArrowDown") dy = -step;
      if (!dx && !dy) return;
      const current = getMode6SegmentPositionCoords(index, playMode6.texts.length);
      setMode6SegmentPosition(index, { x: current.x + dx, y: current.y + dy });
      event.preventDefault();
    });
  }

  if (mode6AddSegmentButton) {
    mode6AddSegmentButton.addEventListener("click", () => {
      const nextTexts = playMode6.texts.slice();
      const nextPositions = playMode6.positionOverrides.slice();
      nextTexts.push("");
      nextPositions.push(null);
      setMode6Texts(nextTexts, {
        focusIndex: nextTexts.length - 1,
        positionOverrides: nextPositions,
      });
      updateMode6TextOrbit();
    });
  }

  if (mode6DistributionSelect) {
    mode6DistributionSelect.addEventListener("change", () => {
      setMode6DistributionMode(mode6DistributionSelect.value);
    });
  }

  if (mode6SphereRadiusRange) {
    mode6SphereRadiusRange.addEventListener("input", () => {
      setMode6SphereRadiusScale(mode6SphereRadiusRange.value);
    });
  }

  if (mode6SphereRadiusNumber) {
    mode6SphereRadiusNumber.addEventListener("input", () => {
      setMode6SphereRadiusScale(mode6SphereRadiusNumber.value);
    });
    mode6SphereRadiusNumber.addEventListener("blur", () => {
      syncMode6SphereRadiusInputs();
    });
  }

  if (mode6HoldSecondsRange) {
    mode6HoldSecondsRange.addEventListener("input", () => {
      setMode6HoldSeconds(mode6HoldSecondsRange.value);
    });
  }

  if (mode6HoldSecondsNumber) {
    mode6HoldSecondsNumber.addEventListener("input", () => {
      setMode6HoldSeconds(mode6HoldSecondsNumber.value);
    });
    mode6HoldSecondsNumber.addEventListener("blur", () => {
      syncMode6TimingInputs();
    });
  }

  if (mode6ShiftSecondsRange) {
    mode6ShiftSecondsRange.addEventListener("input", () => {
      setMode6ShiftSeconds(mode6ShiftSecondsRange.value);
    });
  }

  if (mode6ShiftSecondsNumber) {
    mode6ShiftSecondsNumber.addEventListener("input", () => {
      setMode6ShiftSeconds(mode6ShiftSecondsNumber.value);
    });
    mode6ShiftSecondsNumber.addEventListener("blur", () => {
      syncMode6TimingInputs();
    });
  }

  if (mode6DriftHoldToggle) {
    mode6DriftHoldToggle.addEventListener("change", () => {
      setMode6DriftHold(mode6DriftHoldToggle.checked);
    });
  }

  if (mode6FillTextToggle) {
    mode6FillTextToggle.addEventListener("change", () => {
      setMode6FillTextSize(mode6FillTextToggle.checked);
    });
  }

  if (frameBgColorInput) {
    frameBgColorInput.addEventListener("input", () => {
      applyFrameBackgroundColor(frameBgColorInput.value);
    });
  }

  if (framePresetSelect) {
    framePresetSelect.addEventListener("change", () => {
      const preset = framePresets[framePresetSelect.value] || framePresets.custom;
      state.framePreset = framePresetSelect.value in framePresets ? framePresetSelect.value : "custom";
      applyFrameSize(preset.width, preset.height);
    });
  }

  if (typeGridToggle) {
    typeGridToggle.addEventListener("change", () => {
      setTypeGridVisible(typeGridToggle.checked);
    });
  }

  if (typeLayoutSelect) {
    typeLayoutSelect.addEventListener("change", () => {
      setTypeLayout(typeLayoutSelect.value);
    });
  }

  if (typeMarkModeSelect) {
    typeMarkModeSelect.addEventListener("change", () => {
      setTypeMarkMode(typeMarkModeSelect.value);
    });
  }

  if (typeAddTextButton) {
    typeAddTextButton.addEventListener("click", () => {
      addTypeTextBox();
    });
  }

  if (typeTextScaleUpButton) {
    typeTextScaleUpButton.addEventListener("click", () => {
      scaleActiveTypeTextBox(2);
    });
  }

  if (typeTextScaleDownButton) {
    typeTextScaleDownButton.addEventListener("click", () => {
      scaleActiveTypeTextBox(0.5);
    });
  }

  if (typeTextAlignSelect) {
    typeTextAlignSelect.addEventListener("change", () => {
      setActiveTypeTextAlign(typeTextAlignSelect.value);
    });
  }

  if (typeLayout1EndColInput) {
    typeLayout1EndColInput.addEventListener("input", () => {
      setTypeLayout1EndColumn(typeLayout1EndColInput.value);
    });
    typeLayout1EndColInput.addEventListener("blur", () => {
      syncTypeGridInputs();
    });
  }

  if (typeGridColumnsInput) {
    typeGridColumnsInput.addEventListener("input", () => {
      setTypeGridColumns(typeGridColumnsInput.value);
    });
    typeGridColumnsInput.addEventListener("blur", () => {
      syncTypeGridInputs();
    });
  }

  if (typeGridMarginInput) {
    typeGridMarginInput.addEventListener("input", () => {
      setTypeGridMargin(typeGridMarginInput.value);
    });
    typeGridMarginInput.addEventListener("blur", () => {
      syncTypeGridInputs();
    });
  }

  if (typeGridGutterInput) {
    typeGridGutterInput.addEventListener("input", () => {
      setTypeGridGutter(typeGridGutterInput.value);
    });
    typeGridGutterInput.addEventListener("blur", () => {
      syncTypeGridInputs();
    });
  }

  if (typeGridBaselineInput) {
    typeGridBaselineInput.addEventListener("input", () => {
      setTypeGridBaseline(typeGridBaselineInput.value);
    });
    typeGridBaselineInput.addEventListener("blur", () => {
      syncTypeGridInputs();
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
        ? `${added} image${added > 1 ? "s" : ""} added for play mode 4 mask.`
        : "No valid images were added for play mode 4 mask.";
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
        ? "Image removed from play mode 4 mask."
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
      ? "Image replaced for play mode 4 mask."
      : "Image replace failed.";
    pendingMode4ReplaceIndex = -1;
    mode4ReplaceInput.value = "";
  });

  clearMode4ImagesButton.addEventListener("click", () => {
    clearPlayMode4Images();
    copyStatus.textContent = "Play mode 4 mask images cleared.";
  });

  window.addEventListener("beforeunload", () => {
    clearPlay1EnvironmentResources();
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
    state.perspectiveFovDeg = constants.defaultPerspectiveFovDeg;
    state.framePreset = "custom";
    state.frameBgColor = constants.defaultFrameBgColor;
    state.typeGridVisible = constants.defaultTypeGridVisible;
    state.typeLayout = constants.defaultTypeLayout;
    state.typeMarkMode = constants.defaultTypeMarkMode;
    state.typeLayout1EndColumn = constants.defaultTypeLayout1EndColumn;
    state.typeGridColumns = constants.defaultTypeGridColumns;
    state.typeGridMargin = constants.defaultTypeGridMargin;
    state.typeGridGutter = constants.defaultTypeGridGutter;
    state.typeGridBaseline = constants.defaultTypeGridBaseline;
    state.typeTextBoxes = [];
    state.activeTypeTextBoxId = null;
    state.depthBlur = false;
    state.depthDynamic = false;
    playMode1.environmentEnabled = constants.defaultPlay1EnvironmentEnabled;

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
    resetPlayMode4ToInitialState(performance.now());
    playMode4.zoomOutExtra = constants.defaultMode4ZoomOutExtra;
    playMode4.easeAmount = constants.defaultMode4Ease;
    playMode4.imageMode = constants.defaultMode4ImageMode;
    resetPlayMode5(performance.now());
    playMode6.distributionMode = constants.defaultMode6TextDistribution;
    playMode6.distributionPhase = 0.4;
    resetPlayMode6(performance.now());
    setMode5CenterMode(constants.defaultMode5CenterMode);
    setMode5StackMode(false);
    setMode5OlabVisible(false);
    setMode6Visible(false);
    setMode6Texts(constants.defaultMode6Texts);
    setupPlayYSpin("play1");
    shadingModeSelect.value = "flat";
    updateShadingMode("flat");
    shapeColorInput.value = constants.defaultColorHex;
    updateShapeColor(constants.defaultColorHex);
    syncAppearancePanels();
    syncDimensionInputs();
    syncPerspectiveInputs();
    syncMode4ExpandedLengthInput();
    syncMode4MotionInputs();
    syncModePanels();
    syncPlay1EnvironmentToggle();
    mode4ImageModeSelect.value = playMode4.imageMode;
    rebuildFrustumFor(state.frustumLengthSvg, state.frustumLargeDiameterSvg);
    updateCameraUniforms();
    syncZoomInputs();
    applyFrameBackgroundColor(state.frameBgColor);
    applyTypeGridState();
    applyFrameSize(constants.defaultFrameWidth, constants.defaultFrameHeight);
    updatePlay1EnvironmentVisual();
    updateRotationInputs();
  }

  resetButton.addEventListener("click", resetScene);

  window.addEventListener("resize", () => {
    updateWorkspaceShellBounds();
    resizeCanvasToFrame();
    resizeMode6TextCanvas();
    updateMode6PositionEditor();
    renderMode6TextCanvas();
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

  function getFrameExportSize() {
    const rect = frame.getBoundingClientRect();
    return {
      width: Math.max(2, Math.round(rect.width || state.frameWidth)),
      height: Math.max(2, Math.round(rect.height || state.frameHeight)),
    };
  }

  function getCssVariableColor(name, fallback) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  function drawExportBackgroundImage(ctx, width, height) {
    if (!frame.classList.contains("has-image")) return;
    if (!frameBgImage || !frameBgImage.complete || !frameBgImage.naturalWidth) return;
    const scale = Math.min(width / frameBgImage.naturalWidth, height / frameBgImage.naturalHeight);
    const drawWidth = frameBgImage.naturalWidth * scale;
    const drawHeight = frameBgImage.naturalHeight * scale;
    ctx.drawImage(
      frameBgImage,
      (width - drawWidth) * 0.5,
      (height - drawHeight) * 0.5,
      drawWidth,
      drawHeight,
    );
  }

  function drawExportTypeGrid(ctx, width, height) {
    if (!state.typeGridVisible) return;
    const spacing = getEffectiveTypeGridSpacing({ width, height });
    const margin = Math.max(0, spacing.marginCss || 0);
    const gutter = Math.max(0, spacing.gutterCss || 0);
    const columns = Math.max(constants.minTypeGridColumns, state.typeGridColumns);
    const rows = Math.max(constants.minTypeGridBaseline, state.typeGridBaseline);
    const innerWidth = Math.max(1, width - margin * 2);
    const innerHeight = Math.max(1, height - margin * 2);
    const columnWidth = Math.max(1, (innerWidth - gutter * Math.max(0, columns - 1)) / columns);
    const rowHeight = Math.max(1, (innerHeight - gutter * Math.max(0, rows - 1)) / rows);
    const gridLine = getCssVariableColor("--grid-line", "rgba(16, 17, 20, 0.1)");
    const gridFill = getCssVariableColor("--grid-fill", "rgba(16, 17, 20, 0.035)");

    ctx.save();
    ctx.fillStyle = gridFill;
    ctx.strokeStyle = gridLine;
    ctx.lineWidth = 1;

    for (let index = 0; index < columns; index += 1) {
      const x = margin + index * (columnWidth + gutter);
      ctx.fillRect(x, margin, columnWidth, innerHeight);
      ctx.beginPath();
      ctx.moveTo(x + 0.5, margin);
      ctx.lineTo(x + 0.5, margin + innerHeight);
      ctx.moveTo(x + columnWidth - 0.5, margin);
      ctx.lineTo(x + columnWidth - 0.5, margin + innerHeight);
      ctx.stroke();
    }

    for (let index = 0; index < rows; index += 1) {
      const y = margin + index * (rowHeight + gutter);
      ctx.fillRect(margin, y, innerWidth, rowHeight);
      ctx.beginPath();
      ctx.moveTo(margin, y + 0.5);
      ctx.lineTo(margin + innerWidth, y + 0.5);
      ctx.moveTo(margin, y + rowHeight - 0.5);
      ctx.lineTo(margin + innerWidth, y + rowHeight - 0.5);
      ctx.stroke();
    }

    ctx.strokeRect(margin + 0.5, margin + 0.5, Math.max(1, innerWidth - 1), Math.max(1, innerHeight - 1));
    ctx.restore();
  }

  function drawCanvasLayerForExport(ctx, sourceCanvas, width, height) {
    if (!sourceCanvas || sourceCanvas.width < 2 || sourceCanvas.height < 2) return;
    ctx.drawImage(sourceCanvas, 0, 0, width, height);
  }

  function getMode5OlabExportBounds(instance) {
    if (!instance || !instance.wrap) return null;
    const wrapStyle = instance.wrap.style;
    const left = parseFloat(wrapStyle.left);
    const top = parseFloat(wrapStyle.top);
    const width = parseFloat(wrapStyle.width);
    const height = parseFloat(wrapStyle.height);
    if (
      Number.isFinite(left) &&
      Number.isFinite(top) &&
      Number.isFinite(width) &&
      Number.isFinite(height) &&
      width > 0 &&
      height > 0
    ) {
      return { left, top, width, height };
    }
    const frameRect = frame.getBoundingClientRect();
    const wrapRect = instance.wrap.getBoundingClientRect();
    if (!wrapRect.width || !wrapRect.height) return null;
    return {
      left: wrapRect.left - frameRect.left,
      top: wrapRect.top - frameRect.top,
      width: wrapRect.width,
      height: wrapRect.height,
    };
  }

  function getRotateYAngleFromTransform(transformValue) {
    const match = String(transformValue || "").match(/rotateY\(([-+0-9.eE]+)rad\)/);
    return match ? Number(match[1]) || 0 : 0;
  }

  function drawSvgPathsForExport(ctx, svgElement) {
    if (!svgElement || typeof Path2D === "undefined") return;
    const paths = Array.from(svgElement.querySelectorAll("path"));
    paths.forEach((pathElement) => {
      if (pathElement.style && pathElement.style.display === "none") return;
      const pathData = pathElement.getAttribute("d");
      if (!pathData) return;
      const path = new Path2D(pathData);
      const fillRule = pathElement.getAttribute("fill-rule") === "evenodd" ? "evenodd" : "nonzero";
      ctx.fill(path, fillRule);
    });
  }

  function drawMode5OlabInstanceForExport(ctx, instance) {
    if (!instance || !instance.wrap || instance.wrap.style.display === "none") return;
    const bounds = getMode5OlabExportBounds(instance);
    if (!bounds) return;
    const scaleX = bounds.width / constants.mode5OlabViewWidthSvg;
    const scaleY = bounds.height / constants.mode5OlabViewHeightSvg;
    const textColor = getComputedStyle(instance.wrap).color || getCssVariableColor("--text", "#101114");

    ctx.save();
    ctx.translate(bounds.left, bounds.top);
    ctx.scale(scaleX, scaleY);
    ctx.fillStyle = textColor;

    if (instance.svg) {
      const angle = getRotateYAngleFromTransform(instance.svg.style.transform);
      const rotateScale = Math.cos(angle);
      ctx.save();
      ctx.translate(constants.mode5OlabOCenterXSvg, constants.mode5OlabOCenterYSvg);
      ctx.scale(rotateScale, 1);
      ctx.translate(-constants.mode5OlabOCenterXSvg, -constants.mode5OlabOCenterYSvg);
      drawSvgPathsForExport(ctx, instance.svg);
      ctx.restore();
    }

    drawSvgPathsForExport(ctx, instance.oSvg);
    ctx.restore();
  }

  function drawMode5OlabForExport(ctx) {
    if (state.playMode !== "play7") return;
    mode5OlabInstances.forEach((instance) => {
      drawMode5OlabInstanceForExport(ctx, instance);
    });
  }

  function drawCurrentFrameToExportCanvas(exportCanvas, exportCtx) {
    const { width, height } = getFrameExportSize();
    if (exportCanvas.width !== width) exportCanvas.width = width;
    if (exportCanvas.height !== height) exportCanvas.height = height;
    exportCtx.clearRect(0, 0, width, height);
    exportCtx.fillStyle = state.frameBgColor || constants.defaultFrameBgColor;
    exportCtx.fillRect(0, 0, width, height);
    drawExportBackgroundImage(exportCtx, width, height);
    drawExportTypeGrid(exportCtx, width, height);
    drawCanvasLayerForExport(exportCtx, canvas, width, height);
    drawMode5OlabForExport(exportCtx);
    drawCanvasLayerForExport(exportCtx, mode6TextCanvas, width, height);
  }

  function getSupportedVideoMimeType() {
    if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported) {
      return "";
    }
    return [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
    ].find((type) => MediaRecorder.isTypeSupported(type)) || "";
  }

  async function exportPlayModeVideo() {
    if (state.playMode === "off") {
      copyStatus.textContent = "Turn on a play mode before exporting video.";
      syncOutputControls();
      return;
    }
    if (videoExport.active) return;
    const exportCanvas = document.createElement("canvas");
    const exportCtx = exportCanvas.getContext("2d");
    if (!exportCtx || !exportCanvas.captureStream || typeof MediaRecorder === "undefined") {
      copyStatus.textContent = "Video export is not supported in this browser.";
      return;
    }

    const fps = 30;
    const durationMs = 4000;
    const mimeType = getSupportedVideoMimeType();
    const stream = exportCanvas.captureStream(fps);
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const chunks = [];
    let frameId = 0;
    videoExport.active = true;
    syncOutputControls();
    copyStatus.textContent = "Recording play mode video...";

    const finished = new Promise((resolve, reject) => {
      recorder.addEventListener("dataavailable", (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      });
      recorder.addEventListener("stop", resolve, { once: true });
      recorder.addEventListener("error", () => reject(new Error("Video recording failed.")), {
        once: true,
      });
    });

    const startedAt = performance.now();
    const draw = () => {
      if (!videoExport.active) return;
      if (state.playMode === "play5") {
        renderMode6TextCanvas(performance.now());
      }
      drawCurrentFrameToExportCanvas(exportCanvas, exportCtx);
      if (performance.now() - startedAt >= durationMs) {
        if (recorder.state === "recording") recorder.stop();
        return;
      }
      frameId = requestAnimationFrame(draw);
    };

    try {
      drawCurrentFrameToExportCanvas(exportCanvas, exportCtx);
      recorder.start(100);
      frameId = requestAnimationFrame(draw);
      await finished;
      const blob = new Blob(chunks, { type: mimeType || "video/webm" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `olab-playmode-${new Date().toISOString().replace(/[:.]/g, "-")}.webm`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      copyStatus.textContent = "Exported play mode video.";
    } catch (_error) {
      copyStatus.textContent = "Video export failed.";
    } finally {
      videoExport.active = false;
      cancelAnimationFrame(frameId);
      stream.getTracks().forEach((track) => track.stop());
      syncOutputControls();
    }
  }

  rotXInput.addEventListener("input", () => setRotationFromInput(rotXInput, "x"));
  rotYInput.addEventListener("input", () => setRotationFromInput(rotYInput, "y"));
  rotZInput.addEventListener("input", () => setRotationFromInput(rotZInput, "z"));

  copySvgButton.addEventListener("click", () => {
    copyCurrentFrameSvg();
  });

  if (exportVideoButton) {
    exportVideoButton.addEventListener("click", () => {
      exportPlayModeVideo();
    });
  }

  shapeColorInput.value = constants.defaultColorHex;
  updateShapeColor(constants.defaultColorHex);
  playModeSelect.value = "off";
  state.playMode = "off";
  playDims.lengthCurrent = state.frustumLengthSvg;
  playDims.diameterCurrent = state.frustumLargeDiameterSvg;
  resetPlayMode4ToInitialState(performance.now());
  playMode4.imageMode = constants.defaultMode4ImageMode;
  resetPlayMode5(performance.now());
  resetPlayMode6(performance.now());
  setMode5CenterMode(constants.defaultMode5CenterMode);
  setMode5StackMode(false);
  setMode6Texts(constants.defaultMode6Texts);
  setupPlayYSpin("play1");
  state.depthBlur = false;
  state.depthDynamic = false;
  state.perspectiveFovDeg = constants.defaultPerspectiveFovDeg;
  shadingModeSelect.value = "flat";
  syncPerspectiveInputs();
  gl.uniform1f(uFovY, getPerspectiveFovRad());
  updateShadingMode("flat");
  mode4ImageModeSelect.value = playMode4.imageMode;
  setMode5OlabVisible(false);
  setMode6Visible(false);
  updateMode4ImagesStatus();
  syncAppearancePanels();
  syncDimensionInputs();
  syncMode4ExpandedLengthInput();
  syncMode4MotionInputs();
  syncModePanels();
  rebuildFrustumFor(state.frustumLengthSvg, state.frustumLargeDiameterSvg);
  updateCameraUniforms();
  applyFrameBackgroundColor(state.frameBgColor);
  applyTypeGridState();
  updateWorkspaceShellBounds();
  applyFrameSize(state.frameWidth, state.frameHeight);
  updateTypographyShapeVisibility();
  updateTypeTextLayer();
  updateTypographyOlabLockup();
  syncZoomInputs();
  updateRotationInputs();

  let lastFrameMs = performance.now();
  function render(timeMs) {
    const dt = Math.min(0.06, Math.max(0.001, (timeMs - lastFrameMs) * 0.001));
    lastFrameMs = timeMs;

    if (state.playMode === "play2") {
      isDraggingModel = false;
      dragModelMode = "rotate";
      rotVelX = 0;
      rotVelY = 0;
      rotVelZ = 0;
      applyPlay2State(dt);
    } else if (state.playMode === "play5") {
      isDraggingModel = false;
      dragModelMode = "rotate";
      rotVelX = 0;
      rotVelY = 0;
      rotVelZ = 0;
      applyPlayMode6State(timeMs);
    } else if (state.playMode === "play6") {
      isDraggingModel = false;
      dragModelMode = "rotate";
      rotVelX = 0;
      rotVelY = 0;
      rotVelZ = 0;
      applyPlayMode4State(timeMs);
    } else if (state.playMode === "play7") {
      isDraggingModel = false;
      dragModelMode = "rotate";
      rotVelX = 0;
      rotVelY = 0;
      rotVelZ = 0;
      applyPlayMode5State(timeMs);
    } else if (
      state.playMode === "play1" ||
      state.playMode === "play4"
    ) {
      if (
        state.playMode === "play1" ||
        state.playMode === "play4"
      ) {
        if (timeMs >= playMotion.nextChangeMs) {
          schedulePlayOrbitTargets(timeMs);
        }
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
      dragModelMode = "rotate";
      rotVelX = 0;
      rotVelY = 0;

      if (state.playMode === "play4") {
        const fixedPlay3Length = constants.fixedPlay3LengthSvg;
        const fixedPlay3Diameter = getFixedPlay3DiameterSvg();
        if (
          Math.abs(frustumLayout.lengthSvg - fixedPlay3Length) > 0.7 ||
          Math.abs(frustumLayout.largeDiameterSvg - fixedPlay3Diameter) > 0.7
        ) {
          rebuildFrustumFor(fixedPlay3Length, fixedPlay3Diameter);
        }
      }

    } else {
      stage.rotY += rotVelY;
      stage.rotX += rotVelX;
      stage.rotZ += rotVelZ;
      rotVelY *= 0.92;
      rotVelX *= 0.92;
      rotVelZ *= 0.92;
      if (state.typeLayout === "layout1") {
        applyTypeGridState();
      }
      applyTypographyLayout();
    }

    updateTypographyShapeVisibility();
    updateTypeTextLayer();
    updateTypographyOlabLockup();

    sphereObject.rot[1] = 0;
    frustumObject.rot[0] = 0;
    frustumObject.rot[1] = 0;
    frustumLargeBaseObject.rot[0] = 0;
    frustumLargeBaseObject.rot[1] = 0;
    frustumLargeBaseObject.rot[2] = 0;
    const mode4MaskImage =
      state.playMode === "play6" && playMode4.baseGreenActive
        ? getCurrentPlayMode4Image()
        : null;
    if (state.playMode === "play6" && playMode4.baseGreenActive && !mode4MaskImage) {
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
        state.playMode === "play4" ||
        state.playMode === "play5" ||
        state.playMode === "play6" ||
        state.playMode === "play7"
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
    const showPlay1Environment =
      (state.playMode === "play1" || state.playMode === "play2") &&
      playMode1.environmentEnabled &&
      !!playMode1.environmentTexture;
    if (showPlay1Environment) {
      gl.depthMask(false);
      gl.disable(gl.DEPTH_TEST);
      drawPlay1EnvironmentPass();
      gl.enable(gl.DEPTH_TEST);
      gl.depthMask(true);
    }
    gl.uniform3fv(uStagePos, stage.pos);
    gl.uniform3f(uStageRot, stage.rotX, stage.rotY, stage.rotZ);
    if (useDepthPostFx) {
      updateDepthModeUniforms(timeMs);
    }
    updateRotationInputs();
    updatePlay1EnvironmentVisual();

    const normalFlatMode = state.shadingMode === "flat" ? 1 : 0;
    const mode5ShowOlab = state.playMode === "play7" && playMode5.showOlab;
    const mode5StackMode = state.playMode === "play7" && playMode5.stackMode;
    const mode5TopAngle = playMode5.currentAngleRad;
    const mode5BottomAngle = mode5StackMode ? -playMode5.currentAngleRad : playMode5.currentAngleRad;
    gl.uniform1f(uFlatMode, normalFlatMode);
    if (mode5StackMode) {
      const rect = frame.getBoundingClientRect();
      const screenMetrics = rect.width > 1 && rect.height > 1 ? getMode5SphereScreenMetrics(rect) : null;
      const stackHalfOffsetWorld = screenMetrics
        ? getMode5StackHalfOffsetWorld(rect, screenMetrics.sphereDiameterCss)
        : 0;
      if (!mode5ShowOlab) {
        drawShapeGroupAtStageOffset(stackHalfOffsetWorld, mode5TopAngle);
      } else {
        drawShapeGroupAtStageOffset(-stackHalfOffsetWorld, mode5BottomAngle);
      }
    } else if (!mode5ShowOlab && state.playMode !== "play5") {
      drawObject(sphereObject);
      drawObject(frustumObject);
      if (state.playMode === "play6" && playMode4.baseGreenActive) {
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
    setMode6Visible(state.playMode === "play5");
    if (state.playMode !== "play5") {
      updateMode6TextOrbit();
      updateMode6OlabTransform();
    }

    if (useDepthPostFx) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.disable(gl.DEPTH_TEST);
      drawPostFxPass();
      gl.enable(gl.DEPTH_TEST);
    }

    requestAnimationFrame(render);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      updateTypeTextLayer();
    });
  }

  requestAnimationFrame(render);
})();
