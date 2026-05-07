(function () {
  const shell = document.getElementById("vi-manual-shell");
  const frameShell = document.getElementById("frame-shell");
  const uiPanel = document.querySelector(".ui-panel");
  const tabButtons = Array.from(document.querySelectorAll("[data-tab-target]"));
  const exportPdfButton = document.getElementById("vi-export-pdf-btn");
  const exportFigmaButton = document.getElementById("vi-export-figma-btn");
  const exportStatus = document.getElementById("vi-export-status");

  if (!shell) return;

  const pageWidth = 1920;
  const pageHeight = 1080;
  const columns = 14;
  const rows = 10;
  const margin = pageHeight / 26;
  const gutter = 14;
  let manualGridVisible = false;

  function repeatSpans(count) {
    return Array.from({ length: count }, () => "<span></span>").join("");
  }

  function buildBodyText() {
    return [
      "文段内容文段内容文段内容文段内容文段内容文",
      "段内容文段内容文段内容文段内容文段内容文段",
      "内容文段内容文段内容文段内容文段内容文段内",
      "容文段内容文段内容文段内容文段内容文段内容",
      "文段内容文段内容文段内容文段内容文段内容文",
      "段内容文段内容文段内容文段内容文段内容文段",
      "内容文段内容文段内容文段内容文段内容文段内",
      "容文段内容文段内容文段内容文段内容",
    ].join("<br>");
  }

  function getTypesetClass(text) {
    return /[\u3400-\u9fff]/.test(String(text)) ? "vi-type-cn" : "vi-type-en";
  }

  function buildTypesetHtml(markup) {
    return String(markup)
      .split(/(<br\s*\/?>)/i)
      .map((part) => {
        if (/^<br\s*\/?>$/i.test(part)) return part;
        return `<span class="${getTypesetClass(part)}">${part}</span>`;
      })
      .join("");
  }

  function buildShapeMarkMarkup() {
    return `
      <path d="M458.867 8.59961L169.969 29.3402V84.013L458.867 104.754V8.59961Z" fill="currentColor"/>
      <ellipse cx="56.6559" cy="56.6588" rx="56.6559" ry="56.6588" fill="currentColor"/>
    `;
  }

  function buildCompactWordmarkMarkup() {
    return `
      <g>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M67.8354 36.6297H77.8176V46.1561H67.4966C65.9109 46.1561 64.391 45.5224 63.2748 44.3959L60.071 41.1625C58.9683 40.0495 58.3496 38.5461 58.3496 36.9794L58.3496 0H67.8354V36.6297Z" fill="currentColor"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M99.0328 8.7989C106.7 8.79955 112.915 15.0164 112.915 22.6835V36.6675H117.485V46.1289H105.853V36.9833H103.513L100.893 41.4563C99.0394 44.6208 95.647 46.5654 91.9796 46.5654L91.3666 46.5491H91.3544C85.0505 46.2304 80.2625 41.7082 79.9362 35.3866V35.3745L79.9199 34.7614V34.7513C79.92 28.1611 85.4693 22.6663 92.2882 22.6815L97.9005 22.6926L103.513 22.7038V22.1862C103.512 19.7118 101.507 17.7069 99.0328 17.7061L83.9594 17.7041L83.9635 8.79688L99.0328 8.7989ZM92.2679 30.7219C90.3013 30.7177 88.7138 32.2959 88.7135 34.2296C88.7135 36.0873 90.2015 37.7718 92.3592 37.7718C96.7149 37.7714 103.178 31.3239 103.178 31.3239V30.7219H92.2679Z" fill="currentColor"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M129.517 16.9707H131.866L134.06 13.2678C135.791 10.3461 138.94 8.55895 142.336 8.57027C150.042 8.5759 154.988 15.9028 154.988 25.1932V29.8234C154.988 38.9702 150.301 46.5641 142.336 46.5641C138.939 46.5641 135.795 44.7687 134.069 41.8431L131.866 38.1097H129.517V46.1621H119.977V0H129.517V16.9707ZM138.246 17.7921C133.951 17.7926 130.934 22.2185 130.934 25.1932V29.8234C130.934 33.4949 134.609 37.334 138.246 37.3341C142.716 37.3333 145.559 33.3132 145.559 29.8234V25.1932C145.558 22.2654 143.177 17.7921 138.246 17.7921Z" fill="currentColor"/>
        ${buildCompactOPathMarkup()}
      </g>
    `;
  }

  function buildCompactOPathMarkup() {
    return `<path fill-rule="evenodd" clip-rule="evenodd" d="M18.9553 8.63281C29.423 8.63336 37.9085 17.1203 37.9085 27.5881C37.9083 38.0557 29.4228 46.5408 18.9553 46.5414C8.48735 46.5414 0.00026142 38.0561 0 27.5881C0 17.12 8.48715 8.63281 18.9553 8.63281ZM18.9492 18.4434C13.8993 18.4437 9.8065 22.538 9.80649 27.5881C9.80649 32.6382 13.8993 36.7325 18.9492 36.7328C23.9995 36.7328 28.0939 32.6384 28.0939 27.5881C28.0939 22.5378 23.9995 18.4434 18.9492 18.4434Z" fill="currentColor"/>`;
  }

  function buildTeenageEngineeringMarkup() {
    return `
      <path d="M266.7 145H186.9L147 75.9L186.9 6.8H266.7L306.6 75.9L266.7 145ZM200 60.3C191.4 75.1 196.5 94.1 211.3 102.6C226.1 111.2 245.1 106.1 253.6 91.3C262.2 76.5 257.1 57.5 242.3 49C227.5 40.4 208.5 45.5 200 60.3ZM42.8 52.9L57.8 61.5L45.6 82.7L30.6 74.1L0 127L44.9 152.9L69.3 110.6L123 141.6C134.7 148.4 149.6 144.3 156.4 132.7C163.1 121 159.1 106.1 147.5 99.3L93.8 68.3L118.2 26L73.3 0L42.8 52.9Z" fill="currentColor"/>
      <path d="M280 6.5C281.8 6.5 283.3 8 283.3 9.8C283.3 11.6 281.8 13.1 280 13.1C278.2 13.1 276.7 11.6 276.7 9.8C276.7 8 278.1 6.5 280 6.5ZM280 12.8C281.7 12.8 283 11.5 283 9.8C283 8.1 281.7 6.8 280 6.8C278.3 6.8 277 8.1 277 9.8C277 11.5 278.3 12.8 280 12.8ZM281.1 11.6C281 11.5 281 11.3 281 10.9C281 10.2 280.6 10 279.8 10H279V11.6H278.7V8H280C280.8 8 281.4 8.2 281.4 9C281.4 9.4 281.1 9.7 280.7 9.9C281.2 10.1 281.3 10.4 281.3 11.1C281.3 11.3 281.4 11.5 281.4 11.6H281.1ZM280.2 8.3H279.1V9.8H280C280.8 9.8 281.1 9.5 281.1 9.1C281.1 8.5 280.8 8.3 280.2 8.3Z" fill="currentColor"/>
    `;
  }

  function buildOppoWordmarkMarkup() {
    return `
      <path fill-rule="evenodd" clip-rule="evenodd" d="M41.4,52.9L41.4,52.9L41.4,52.9c-17.6-0.2-29-8.6-29-21.3s11.4-21.1,29-21.3c17.6,0.2,29,8.6,29,21.3S59,52.8,41.4,52.9z M42,0c0,0-0.4,0-0.5,0c-0.2,0-0.5,0-0.5,0C16.8,0.4,0,13.4,0,31.6s16.8,31.2,40.9,31.6c0,0,0.4,0,0.5,0c0.2,0,0.5,0,0.5,0C66,62.9,82.8,49.8,82.8,31.6S66,0.4,42,0z" fill="currentColor"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M307.7,52.9L307.7,52.9L307.7,52.9c-17.6-0.2-29-8.6-29-21.3s11.4-21.1,29-21.3c17.6,0.2,29,8.6,29,21.3S325.3,52.8,307.7,52.9z M308.2,0c0,0-0.4,0-0.5,0c-0.2,0-0.5,0-0.5,0c-24.1,0.4-40.9,13.4-40.9,31.6s16.8,31.2,40.9,31.6c0,0,0.4,0,0.5,0c0.2,0,0.5,0,0.5,0c24.1-0.4,40.9-13.4,40.9-31.6S332.3,0.4,308.2,0z" fill="currentColor"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M219.1,52.9L219.1,52.9L219.1,52.9c-17.6-0.2-29-8.6-29-21.3s11.4-21.1,29-21.3c17.6,0.2,29,8.6,29,21.3S236.7,52.8,219.1,52.9z M219.6,0c0,0-0.4,0-0.5,0c-0.2,0-0.5,0-0.5,0c-11.5,0.2-21.3,3.2-28.4,8.3V3h-12.5v80h12.5V54.9c7.1,5.1,17,8.2,28.4,8.3c0,0,0.4,0,0.5,0c0.2,0,0.5,0,0.5,0c24.1-0.4,40.9-13.4,40.9-31.6S243.7,0.4,219.6,0z" fill="currentColor"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M130.3,52.9L130.3,52.9L130.3,52.9c-17.6-0.2-29-8.6-29-21.3s11.4-21.1,29-21.3c17.6,0.2,29,8.6,29,21.3S147.9,52.8,130.3,52.9z M130.8,0c0,0-0.4,0-0.5,0c-0.2,0-0.5,0-0.5,0c-11.5,0.2-21.3,3.2-28.4,8.3V3H88.8v80h12.5V54.9c7.1,5.1,17,8.2,28.4,8.3c0,0,0.4,0,0.5,0c0.2,0,0.5,0,0.5,0c24.1-0.4,40.9-13.4,40.9-31.6S154.9,0.4,130.8,0z" fill="currentColor"/>
    `;
  }

  function buildOnePlusWordmarkMarkup() {
    return `
      <path d="M88.56 28.51v17.47H17.14v119.99h120.71V94.71h17.05v88.27H.1V28.51zM154.9.01v28.5h28.56v17.47H154.9v28.5h-17.05v-28.5h-29.02V28.51h29.02V.01zM71.05 142.98V94.71H54.92V82.3h1.85c5.06 0 9.21-.92 11.98-3.22 2.76-2.3 4.6-6.43 4.6-11.49h15.21v75.39zM203.74 106.21c0-27.13 17.04-47.36 43.76-47.36 26.73 0 43.77 20.23 43.77 47.36 0 27.12-17.04 46.89-43.77 46.89-26.72 0-43.76-19.77-43.76-46.89zm68.64 0c0-17.93-8.29-32.19-24.88-32.19-16.58 0-25.34 14.26-25.34 32.19s8.3 32.18 25.34 32.18c17.05-.46 24.88-14.25 24.88-32.18zm34.56-45.52h18.89l30.4 50.57c2.77 5.06 6.45 12.88 6.45 12.88h.46s-.46-9.2-.46-15.64V60.69h17.97v90.57h-17.97l-31.33-50.11c-2.76-4.6-6.45-12.41-6.45-12.41h-.46s.46 9.65.46 15.63v46.89h-17.96zm93.98 0h66.81v15.17h-48.38v20.23h42.39v15.17h-42.39v24.37h48.84v15.63h-67.27zm125.32 0c10.6 0 18.43 3.22 23.96 8.28 5.06 5.05 8.29 12.41 8.29 20.69 0 17.01-11.52 28.5-30.41 28.5h-22.11v32.64h-18.89V60.69zm-21.19 42.76h18.89c9.67 0 14.74-5.52 14.74-13.33 0-8.28-5.53-13.34-14.28-13.34h-19.35zm66.34-42.76h18.43v74.94h42.38v15.63h-60.81zm70.95 0h18.43v61.61c0 9.19 4.61 16.09 17.05 16.09 11.51 0 17.04-6.9 17.04-16.09V60.69h18.43v61.61c0 19.3-11.98 30.8-35.01 30.8-23.96-.46-35.94-11.5-35.94-31.26zm101.82 62.53c1.38 11.03 7.37 15.17 20.27 15.17 9.21 0 17.51-3.22 17.51-11.5 0-8.73-8.76-10.57-22.58-13.79-16.12-3.68-31.33-7.81-31.33-26.66 0-17.93 14.75-27.13 34.56-27.13 20.27 0 33.63 10.12 35.01 28.05h-17.51c-.92-9.2-8.29-13.8-17.5-13.8-9.68 0-16.59 4.14-16.59 10.58 0 7.35 6.45 9.65 19.81 12.41 18.89 4.14 34.1 8.28 34.1 28.04 0 18.39-14.75 28.51-35.48 28.51-23.96 0-37.78-11.04-38.24-29.88z" fill="currentColor"/>
    `;
  }

  function buildCombinationMarkMarkup() {
    return `
      ${buildShapeMarkMarkup()}
      <path fill-rule="evenodd" clip-rule="evenodd" d="M198.323 224.072H228.161V252.549H194.829C190.879 252.549 187.168 250.658 184.847 247.462L172.325 230.225C170.793 228.117 169.969 225.579 169.969 222.973L169.969 114.062H198.323V224.072Z" fill="currentColor"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M56.6597 140.434C87.9489 140.435 113.313 165.805 113.313 197.096C113.312 228.387 87.9483 253.751 56.6597 253.753C25.3697 253.753 0.000781417 228.388 0 197.096C0 165.804 25.3691 140.434 56.6597 140.434ZM56.6415 169.76C41.5467 169.761 29.3128 182 29.3128 197.096C29.3128 212.192 41.5467 224.431 56.6415 224.432C71.7373 224.432 83.9762 212.193 83.9762 197.096C83.9762 182 71.7373 169.76 56.6415 169.76Z" fill="currentColor"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M291.572 140.865C314.491 140.867 333.067 159.451 333.069 182.37V224.172H346.727V252.454H311.959V228.738H304.964L298.044 239.059C291.884 248.246 281.55 253.759 270.489 253.759L268.657 253.711H268.62C249.777 252.758 235.465 239.24 234.49 220.343V220.306L234.441 218.474V218.444C234.442 198.744 251.029 182.318 271.412 182.364L288.188 182.397L304.964 182.43V180.883C304.962 173.487 298.968 167.493 291.572 167.491L248.809 167.486L248.822 140.859L291.572 140.865ZM271.351 206.399C265.473 206.386 260.727 211.104 260.726 216.884C260.727 222.437 265.174 227.473 271.624 227.473C284.644 227.472 303.962 206.477 303.962 206.477V206.399H271.351Z" fill="currentColor"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M382.678 163.139H389.699L395.697 153.888C401.253 145.319 410.782 140.161 420.995 140.195C444.03 140.211 458.812 162.113 458.812 189.885V203.726C458.812 231.068 444.802 253.768 420.995 253.768C410.835 253.768 401.424 248.421 396.224 239.693L389.699 228.743H382.678V252.567H354.16L354.16 114.062H382.678V163.139ZM408.771 167.761C395.931 167.763 386.913 180.993 386.913 189.885V203.726C386.913 214.701 397.898 226.177 408.771 226.177C422.132 226.175 430.628 214.158 430.628 203.726V189.885C430.625 181.133 423.509 167.761 408.771 167.761Z" fill="currentColor"/>
    `;
  }

  function buildSafeDistanceDiagram(kind) {
    const configs = {
      shape: {
        box: { x: 91, y: 101, width: 720, height: 358 },
        edges: { left: 210, right: 691.8, top: 220, bottom: 339 },
        mark: `<g class="vi-safe-mark" transform="translate(210 220) scale(1.05)">${buildShapeMarkMarkup()}</g>`,
        circles: [
          { cx: 150.5, cy: 160.5, r: 59.5 },
          { cx: 751.5, cy: 160.5, r: 59.5 },
          { cx: 150.5, cy: 399.5, r: 59.5 },
          { cx: 751.5, cy: 399.5, r: 59.5 },
        ],
      },
      wordmark: {
        box: { x: 100, y: 108, width: 716, height: 380 },
        edges: { left: 218, right: 698.5, top: 226, bottom: 370.4 },
        mark: `<g class="vi-safe-mark" transform="translate(218 226) scale(3.1)">${buildCompactWordmarkMarkup()}</g>`,
        circles: [
          { cx: 159, cy: 167, r: 59, kind: "wordmark-o" },
          { cx: 757, cy: 167, r: 59, kind: "wordmark-o" },
          { cx: 159, cy: 429, r: 59, kind: "wordmark-o" },
          { cx: 757, cy: 429, r: 59, kind: "wordmark-o" },
        ],
      },
      combination: {
        box: { x: 91, y: 31, width: 720, height: 506 },
        edges: { left: 210, right: 691.8, top: 150, bottom: 416.5 },
        mark: `<g class="vi-safe-mark" transform="translate(210 150) scale(1.05)">${buildCombinationMarkMarkup()}</g>`,
        circles: [
          { cx: 150.5, cy: 90.5, r: 59.5 },
          { cx: 751.5, cy: 90.5, r: 59.5 },
          { cx: 150.5, cy: 477.5, r: 59.5 },
          { cx: 751.5, cy: 477.5, r: 59.5 },
        ],
      },
    };
    const config = configs[kind] || configs.shape;
    const { box } = config;
    const boxRight = box.x + box.width;
    const boxBottom = box.y + box.height;

    return `
      <svg class="vi-safe-diagram-svg" viewBox="0 0 900 560" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect class="vi-safe-box" x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}"/>
        <g class="vi-safe-edge-lines">
          <line x1="${config.edges.left}" y1="${box.y}" x2="${config.edges.left}" y2="${boxBottom}"/>
          <line x1="${config.edges.right}" y1="${box.y}" x2="${config.edges.right}" y2="${boxBottom}"/>
          <line x1="${box.x}" y1="${config.edges.top}" x2="${boxRight}" y2="${config.edges.top}"/>
          <line x1="${box.x}" y1="${config.edges.bottom}" x2="${boxRight}" y2="${config.edges.bottom}"/>
        </g>
        ${config.mark}
        <g class="vi-safe-unit">
          ${config.circles
            .map((circle) =>
              circle.kind === "wordmark-o"
                ? `<g transform="translate(${circle.cx} ${circle.cy}) scale(3.1) translate(-18.9553 -27.5881)">${buildCompactOPathMarkup()}</g>`
                : `<circle cx="${circle.cx}" cy="${circle.cy}" r="${circle.r}"/>`
            )
            .join("")}
        </g>
      </svg>
    `;
  }

  function buildTemplateContent(pageNumber, title, body, frameMarkup, frameClass = "", sectionLabel = "Content") {
    const bodyMarkup = body ? `<p class="vi-template-body">${buildTypesetHtml(body)}</p>` : "";

    return `
      <div class="vi-template-gray-frame ${frameClass}">${frameMarkup}</div>
      <p class="vi-template-brand">o lab</p>
      <p class="vi-template-section">${sectionLabel}</p>
      <p class="vi-template-version">Version 1.0</p>
      <h1 class="vi-template-title">${buildTypesetHtml(title)}</h1>
      ${bodyMarkup}
      <p class="vi-template-page">${String(pageNumber).padStart(2, "0")}</p>
    `;
  }

  function buildSafeDistancePage(pageNumber, title, body, diagramKind) {
    return buildTemplateContent(pageNumber, title, body, buildSafeDistanceDiagram(diagramKind), "vi-safe-frame");
  }

  function buildTemplateBody(pageNumber) {
    if (pageNumber === 1) {
      return buildSafeDistancePage(
        pageNumber,
        "图形符号<br>安全距离",
        "为了最大程度确保图形符号清晰易辩，图形符号应始终保持一个明确的安全范围，其周边必须保留足够的空间作为预留空间，在预留空间内禁止出现任何文字、图案或其他元素。<br><br>留白空间的最小值应等于图形符号中圆圈的直径。",
        "shape"
      );
    }

    if (pageNumber === 2) {
      return buildSafeDistancePage(
        pageNumber,
        "字标<br>安全距离",
        "为了最大程度确保清晰易辩，字标应始终保持一个明确的安全范围，其周边必须保留足够的空间作为预留空间，在预留空间内禁止出现任何文字、图案或其他元素。<br><br>留白空间的最小值应等于字标中“o”字母的高度。",
        "wordmark"
      );
    }

    if (pageNumber === 3) {
      return buildSafeDistancePage(
        pageNumber,
        "组合标识<br>安全距离",
        "为了最大程度确保清晰易辩，组合标识应始终保持一个明确的安全范围，其周边必须保留足够的空间作为预留空间，在预留空间内禁止出现任何文字、图案或其他元素。<br><br>留白空间的最小值应等于图形符号中圆圈的直径。",
        "combination"
      );
    }

    return buildTemplateContent(pageNumber, "标题内容", buildBodyText(), "", "");
  }

  function buildContentPage(contentMarkup, pageClass = "") {
    return `
      <div class="vi-page-frame">
        <article class="vi-page ${pageClass}">
          <div class="vi-grid vi-grid-columns" aria-hidden="true">${repeatSpans(columns)}</div>
          <div class="vi-grid vi-grid-rows" aria-hidden="true">${repeatSpans(rows)}</div>
          <div class="vi-page-content">
            ${contentMarkup}
          </div>
        </article>
      </div>
    `;
  }

  function buildManualPage(pageNumber) {
    return buildContentPage(buildTemplateBody(pageNumber));
  }

  function buildMarkDisplaySvg(kind) {
    if (kind === "wordmark") {
      return `
        <svg class="vi-mark-display-svg vi-mark-display-wordmark" viewBox="0 0 155 47" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          ${buildCompactWordmarkMarkup()}
        </svg>
      `;
    }

    if (kind === "combination") {
      return `
        <svg class="vi-mark-display-svg vi-mark-display-combination" viewBox="0 0 459 254" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          ${buildCombinationMarkMarkup()}
        </svg>
      `;
    }

    return `
      <svg class="vi-mark-display-svg vi-mark-display-shape" viewBox="0 0 459 114" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        ${buildShapeMarkMarkup()}
      </svg>
    `;
  }

  function buildMarkDisplayPage(kind, reversed = false, pageNumber = 1) {
    const markTitles = {
      shape: "图形符号",
      wordmark: "字标",
      combination: "组合标识",
    };
    const title = `${markTitles[kind] || markTitles.shape}${reversed ? " 反白" : ""}`;
    const frameClass = `vi-mark-frame${reversed ? " is-reversed" : ""}`;
    const contentMarkup = buildTemplateContent(pageNumber, title, "", buildMarkDisplaySvg(kind), frameClass);

    return buildContentPage(contentMarkup);
  }

  function buildLogoFormsPage(pageNumber) {
    const note =
      "Logo 系统包含组合标识、图形符号与字标三种基础形式。三种形式可根据版面空间、信息层级与应用场景选择使用。";
    const frameMarkup = `
      <div class="vi-logo-forms">
        <section class="vi-logo-form-panel" aria-label="组合标识">
          <svg class="vi-logo-form-svg vi-logo-form-combination-svg" viewBox="0 0 459 254" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            ${buildCombinationMarkMarkup()}
          </svg>
        </section>
        <section class="vi-logo-form-panel" aria-label="图形符号">
          <svg class="vi-logo-form-svg vi-logo-form-shape-svg" viewBox="0 0 459 114" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            ${buildShapeMarkMarkup()}
          </svg>
        </section>
        <section class="vi-logo-form-panel" aria-label="字标">
          <svg class="vi-logo-form-svg vi-logo-form-wordmark-svg" viewBox="0 0 155 47" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            ${buildCompactWordmarkMarkup()}
          </svg>
        </section>
      </div>
    `;

    return buildContentPage(
      `
        <div class="vi-logo-forms-frame">${frameMarkup}</div>
        <p class="vi-template-brand">o lab</p>
        <p class="vi-template-section">Content</p>
        <p class="vi-template-version">Version 1.0</p>
        <h1 class="vi-template-title">${buildTypesetHtml("介绍")}</h1>
        <p class="vi-logo-forms-note">${buildTypesetHtml(note)}</p>
        <p class="vi-template-page">${String(pageNumber).padStart(2, "0")}</p>
      `
    );
  }

  function buildLogoFormsSplitPage(pageNumber) {
    const note =
      "Logo 系统包含组合标识、图形符号与字标三种基础形式。三种形式可根据版面空间、信息层级与应用场景选择使用。";
    const frameMarkup = `
      <div class="vi-logo-forms-split">
        <section class="vi-logo-split-panel vi-logo-split-combination" aria-label="组合标识">
          <svg class="vi-logo-split-svg vi-logo-split-combination-svg" viewBox="0 0 459 254" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            ${buildCombinationMarkMarkup()}
          </svg>
        </section>
        <div class="vi-logo-split-right">
          <section class="vi-logo-split-panel vi-logo-split-shape" aria-label="图形符号">
            <svg class="vi-logo-split-svg vi-logo-split-shape-svg" viewBox="0 0 459 114" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              ${buildShapeMarkMarkup()}
            </svg>
          </section>
          <section class="vi-logo-split-panel vi-logo-split-wordmark" aria-label="字标">
            <svg class="vi-logo-split-svg vi-logo-split-wordmark-svg" viewBox="0 0 155 47" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              ${buildCompactWordmarkMarkup()}
            </svg>
          </section>
        </div>
      </div>
    `;

    return buildContentPage(
      buildTemplateContent(pageNumber, "介绍", note, frameMarkup, "vi-logo-forms-split-frame")
    );
  }

  function buildSectionCoverPage(pageNumber, sectionCode, title, englishTitle, pageClass = "") {
    return buildContentPage(`
      <p class="vi-template-brand">o lab</p>
      <p class="vi-template-section">${englishTitle}</p>
      <p class="vi-template-version">Version 1.0</p>
      <p class="vi-section-cover-index">${sectionCode}</p>
      <h1 class="vi-section-cover-title">
        <span>${title}</span>
        <span>${englishTitle}</span>
      </h1>
      <p class="vi-template-page">${String(pageNumber).padStart(2, "0")}</p>
    `, pageClass);
  }

  function buildPlacementMarkSvg(kind, className) {
    if (kind === "combination") {
      return `<svg class="vi-placement-mark vi-placement-combination-mark ${className}" viewBox="0 0 459 254" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${buildCombinationMarkMarkup()}</svg>`;
    }

    return `<svg class="vi-placement-mark vi-placement-shape-mark ${className}" viewBox="0 0 459 114" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${buildShapeMarkMarkup()}</svg>`;
  }

  function buildPlacementSlotsMarkup(kind) {
    const placements = [
      "top-left",
      "top-center",
      "top-right",
      "middle-left",
      "middle-center",
      "middle-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ];

    return placements
      .map(
        (placement) => `
          <span class="vi-placement-slot vi-placement-slot-${placement}">
            ${buildPlacementMarkSvg(kind, "vi-placement-mini-mark")}
          </span>
        `,
      )
      .join("");
  }

  function buildPlacementGuideMarkup(kind) {
    return `
      <div class="vi-placement-layout">
        <section class="vi-placement-map" aria-label="边缘摆放位置">
          ${buildPlacementSlotsMarkup(kind)}
        </section>
      </div>
    `;
  }

  function buildPlacementGuidePage(kind, pageNumber) {
    const title = `${kind === "combination" ? "组合标识" : "图形符号"}<br>摆放位置`;
    const body =
      "标识摆放遵循 Layout 1 的网格逻辑。标识尺寸通过 end column 控制，位置通过九宫格控制；当标识撑满六栏时，横向位置被锁定，只保留垂直方向上的上、中、下摆放。";

    return buildContentPage(
      buildTemplateContent(pageNumber, title, body, buildPlacementGuideMarkup(kind), "vi-placement-frame")
    );
  }

  function buildCobrandingGuideMarkup() {
    return `
      <svg class="vi-cobrand-svg" viewBox="0 0 1000 680" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g class="vi-cobrand-guides">
          <line x1="0" y1="257" x2="1000" y2="257"/>
          <line x1="0" y1="423" x2="1000" y2="423"/>
          <line x1="500" y1="0" x2="500" y2="680"/>
          <line x1="374" y1="0" x2="374" y2="680"/>
          <line x1="626" y1="0" x2="626" y2="680"/>
        </g>
        <line class="vi-cobrand-divider" x1="500" y1="257" x2="500" y2="423"/>
        <g class="vi-cobrand-unit" transform="translate(416 465)">
          <circle r="42"/>
        </g>
        <g class="vi-cobrand-unit" transform="translate(500 465)">
          <circle r="42"/>
        </g>
        <g class="vi-cobrand-unit" transform="translate(584 465)">
          <circle r="42"/>
        </g>
        <g class="vi-cobrand-mark" transform="translate(98.6 263.8) scale(0.6)">
          ${buildCombinationMarkMarkup()}
        </g>
        <g class="vi-cobrand-mark" transform="translate(626 275.8) scale(0.84)">
          ${buildTeenageEngineeringMarkup()}
        </g>
      </svg>
    `;
  }

  function buildCobrandingGuidePage(pageNumber) {
    return buildContentPage(
      buildTemplateContent(
        pageNumber,
        "品牌联名<br>组合规范",
        "品牌联名时，组合标识与合作方标识应保持清晰的视觉分隔。两个标识以视觉中心对齐，中间预留空间应以三个图形符号中的圆圈直径作为最小参考值。",
        buildCobrandingGuideMarkup(),
        "vi-cobrand-frame"
      )
    );
  }

  function buildCobrandingVerticalGuideMarkup() {
    return `
      <svg class="vi-cobrand-svg vi-cobrand-vertical-svg" viewBox="0 0 1000 680" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g class="vi-cobrand-guides">
          <line x1="0" y1="340" x2="1000" y2="340"/>
          <line x1="500" y1="0" x2="500" y2="680"/>
          <line x1="0" y1="233.5" x2="1000" y2="233.5"/>
          <line x1="0" y1="446.5" x2="1000" y2="446.5"/>
        </g>
        <line class="vi-cobrand-divider" x1="380.4" y1="340" x2="619.6" y2="340"/>
        <g class="vi-cobrand-unit" transform="translate(655 269)">
          <circle r="35.5"/>
        </g>
        <g class="vi-cobrand-unit" transform="translate(655 340)">
          <circle r="35.5"/>
        </g>
        <g class="vi-cobrand-unit" transform="translate(655 411)">
          <circle r="35.5"/>
        </g>
        <g class="vi-cobrand-mark" transform="translate(385.3 106.5) scale(0.5)">
          ${buildCombinationMarkMarkup()}
        </g>
        <g class="vi-cobrand-mark" transform="translate(380.4 446.5) scale(0.78)">
          ${buildTeenageEngineeringMarkup()}
        </g>
      </svg>
    `;
  }

  function buildCobrandingVerticalGuidePage(pageNumber) {
    return buildContentPage(
      buildTemplateContent(
        pageNumber,
        "品牌联名<br>竖向规范",
        "竖向组合用于横向空间不足或信息需要上下分层的场景。组合标识与合作方标识应以视觉中心对齐，中间预留空间应以三个图形符号中的圆圈直径作为最小参考值。",
        buildCobrandingVerticalGuideMarkup(),
        "vi-cobrand-frame"
      )
    );
  }

  function buildCobrandExampleLogo(kind) {
    if (kind === "oppo") {
      return `
        <svg class="vi-cobrand-example-partner vi-cobrand-example-oppo" viewBox="0 0 349.1 83" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          ${buildOppoWordmarkMarkup()}
        </svg>
      `;
    }

    if (kind === "oneplus") {
      return `
        <svg class="vi-cobrand-example-partner vi-cobrand-example-oneplus" viewBox="0.1 0.01 799.81 182.97" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          ${buildOnePlusWordmarkMarkup()}
        </svg>
      `;
    }

    return `
      <svg class="vi-cobrand-example-partner vi-cobrand-example-teenage" viewBox="0 0 306.6 152.9" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        ${buildTeenageEngineeringMarkup()}
      </svg>
    `;
  }

  function buildCobrandExampleMarkup() {
    const examples = [
      { name: "oppo", label: "o lab 联名 oppo" },
      { name: "oneplus", label: "o lab 联名 1+ 手机" },
      { name: "teenage", label: "o lab 联名 teenage engineering" },
    ];

    return `
      <div class="vi-cobrand-examples">
        ${examples
          .map(
            (example) => `
              <section class="vi-cobrand-example" aria-label="${example.label}">
                <div class="vi-cobrand-example-lockup">
                  <svg class="vi-cobrand-example-olab" viewBox="0 0 459 254" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    ${buildCombinationMarkMarkup()}
                  </svg>
                  <span class="vi-cobrand-example-divider" aria-hidden="true"></span>
                  ${buildCobrandExampleLogo(example.name)}
                </div>
              </section>
            `
          )
          .join("")}
      </div>
    `;
  }

  function buildCobrandVerticalExampleMarkup() {
    const examples = [
      { name: "oppo", label: "o lab 竖向联名 oppo" },
      { name: "oneplus", label: "o lab 竖向联名 1+ 手机" },
      { name: "teenage", label: "o lab 竖向联名 teenage engineering" },
    ];

    return `
      <div class="vi-cobrand-vertical-examples">
        ${examples
          .map(
            (example) => `
              <section class="vi-cobrand-vertical-example vi-cobrand-vertical-example-${example.name}" aria-label="${example.label}">
                <svg class="vi-cobrand-vertical-olab" viewBox="0 0 459 254" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  ${buildCombinationMarkMarkup()}
                </svg>
                <span class="vi-cobrand-vertical-divider" aria-hidden="true"></span>
                ${buildCobrandExampleLogo(example.name)}
              </section>
            `
          )
          .join("")}
      </div>
    `;
  }

  function buildCobrandingVerticalExamplePage(pageNumber) {
    return buildContentPage(
      buildTemplateContent(
        pageNumber,
        "竖向组合<br>示范",
        "",
        buildCobrandVerticalExampleMarkup(),
        "vi-cobrand-vertical-example-frame"
      )
    );
  }

  function buildCobrandingExamplePage(pageNumber) {
    return buildContentPage(
      buildTemplateContent(
        pageNumber,
        "联名组合<br>示范",
        "",
        buildCobrandExampleMarkup(),
        "vi-cobrand-example-frame"
      )
    );
  }

  function buildBrandColorRow(color) {
    const rowStart = Math.max(1, Number(color.rowStart) || 1);
    const rowSpan = Math.max(1, Number(color.rowSpan) || 1);
    const style = [
      `--vi-color-row-bg: ${color.hex}`,
      `--vi-color-row-text: ${color.text || "#3c3a36"}`,
      `--vi-color-row-start: ${rowStart}`,
      `--vi-color-row-span: ${rowSpan}`,
    ].join("; ");
    return `
      <div class="vi-color-row ${color.tall ? "is-tall" : ""}" style="${style}">
        <span>${color.name}</span>
        <span>${color.hex}</span>
        <span>${color.cmyk}</span>
        <span>${color.rgb}</span>
        <span>${color.pantone}</span>
      </div>
    `;
  }

  function buildBrandColorSectionLabelMarkup(group) {
    const rowStart = Math.max(1, Number(group.rowStart) || 1);
    const rowSpan = Math.max(1, Number(group.rowSpan) || 1);
    return `
      <div class="vi-color-section-label vi-color-section-label-${group.key}" style="--vi-color-section-start: ${rowStart}; --vi-color-section-span: ${rowSpan}">
        <h2>${group.label}</h2>
      </div>
    `;
  }

  function buildBrandColorSystemMarkup(colorGroups) {
    return `
      <div class="vi-color-system">
        ${colorGroups.map(buildBrandColorSectionLabelMarkup).join("")}
        ${colorGroups.flatMap((group) => group.colors).map(buildBrandColorRow).join("")}
      </div>
    `;
  }

  function buildBrandColorPresetPage(pageNumber) {
    const colorGroups = [
      {
        key: "brand",
        label: "品牌色",
        rowStart: 1,
        rowSpan: 12,
        colors: [
          {
            name: "olab Yellow",
            hex: "#E7FF85",
            cmyk: "C9 M0 Y48 K0",
            rgb: "R231 G255 B133",
            pantone: "PANTONE 587 C",
            tall: true,
            rowStart: 1,
            rowSpan: 4,
          },
          {
            name: "White",
            hex: "#FFFFFF",
            cmyk: "C0 M0 Y0 K0",
            rgb: "R255 G255 B255",
            pantone: "PANTONE White",
            rowStart: 5,
            rowSpan: 4,
          },
          {
            name: "Black",
            hex: "#131411",
            cmyk: "C5 M0 Y15 K92",
            rgb: "R19 G20 B17",
            pantone: "PANTONE Black C",
            text: "#dad7d2",
            tall: true,
            rowStart: 9,
            rowSpan: 4,
          },
        ],
      },
      {
        key: "support",
        label: "辅助色",
        rowStart: 14,
        rowSpan: 2,
        colors: [
          {
            name: "Sky Blue",
            hex: "#CDE8FF",
            cmyk: "C20 M9 Y0 K0",
            rgb: "R205 G232 B255",
            pantone: "PANTONE 2707 C",
            rowStart: 14,
            rowSpan: 1,
          },
          {
            name: "Mint",
            hex: "#DEFEDD",
            cmyk: "C13 M0 Y13 K0",
            rgb: "R222 G254 B221",
            pantone: "PANTONE 9063 C",
            rowStart: 15,
            rowSpan: 1,
          },
        ],
      },
      {
        key: "neutral",
        label: "主色",
        rowStart: 17,
        rowSpan: 4,
        colors: [
          {
            name: "Warm Gray 1",
            hex: "#F4F3F0",
            cmyk: "C0 M0 Y2 K4",
            rgb: "R244 G243 B240",
            pantone: "PANTONE Warm Gray 1 C",
            rowStart: 17,
            rowSpan: 1,
          },
          {
            name: "Warm Gray 3",
            hex: "#DAD7D2",
            cmyk: "C0 M1 Y4 K15",
            rgb: "R218 G215 B210",
            pantone: "PANTONE Warm Gray 3 C",
            rowStart: 18,
            rowSpan: 1,
          },
          {
            name: "Warm Gray 7",
            hex: "#989590",
            cmyk: "C0 M2 Y5 K40",
            rgb: "R152 G149 B144",
            pantone: "PANTONE Warm Gray 7 C",
            rowStart: 19,
            rowSpan: 1,
          },
          {
            name: "Warm Gray 11",
            hex: "#3C3A36",
            cmyk: "C0 M3 Y10 K76",
            rgb: "R60 G58 B54",
            pantone: "PANTONE Warm Gray 11 C",
            text: "#dad7d2",
            rowStart: 20,
            rowSpan: 1,
          },
        ],
      },
    ];

    const body =
      "品牌色彩系统由品牌色、辅助色与主色组成。所有色彩数值应按应用介质选择对应模式，并保持一致的视觉识别。";

    return buildContentPage(buildTemplateContent(
      pageNumber,
      "品牌色彩",
      body,
      buildBrandColorSystemMarkup(colorGroups),
      "vi-color-frame",
      "Brand Color"
    ));
  }

  function buildTypographyIntroMarkup() {
    return `
      <div class="vi-typography-system">
        <section class="vi-typography-row vi-typography-cn">
          <div>
            <p class="vi-typography-label">中文字体</p>
            <p class="vi-typography-name">OPPO Sans</p>
          </div>
          <p class="vi-typography-sample">品牌字体系统</p>
        </section>
        <section class="vi-typography-row vi-typography-en">
          <div>
            <p class="vi-typography-label">English Typeface</p>
            <p class="vi-typography-name">Aeonik Fono</p>
          </div>
          <p class="vi-typography-sample">Brand typography</p>
        </section>
      </div>
    `;
  }

  function buildTypographyIntroPage(pageNumber) {
    const body =
      "中文使用 OPPO Sans，英文、数字与系统参数使用 Aeonik Fono。中英文混排时英文比例保持 1:1.09，并启用 Aeonik Fono 的 stylistic alternative，使小写 a 使用 straight a 形式。";

    return buildContentPage(
      buildTemplateContent(
        pageNumber,
        "中英文字体",
        body,
        buildTypographyIntroMarkup(),
        "vi-typography-frame",
        "Typography"
      )
    );
  }

  function buildTypographyMixMarkup() {
    const rules = [
      {
        label: "Ratio",
        body: "中文为基准，英文、数字与符号放大至 1.09 倍，形成稳定的中英文混排节奏。",
      },
      {
        label: "Feature",
        body: "Aeonik Fono 启用 stylistic alternative，让小写 a 使用 straight a 形式。",
      },
      {
        label: "Spacing",
        body: "中英文之间不额外加空格；必要时通过同一行距系统保持基线与阅读密度。",
      },
    ];

    return `
      <div class="vi-typography-mix-system">
        <section class="vi-typography-mix-specimen">
          <p class="vi-typography-mix-sample"><span class="cn">视觉实验室</span><span class="en">Motion 01</span></p>
          <p class="vi-typography-mix-sample"><span class="cn">品牌系统</span><span class="en">Brand Kit 2026</span></p>
        </section>
        <dl class="vi-typography-mix-rules">
          ${rules
            .map(
              (rule) => `
                <div class="vi-typography-mix-rule">
                  <dt>${rule.label}</dt>
                  <dd>${rule.body}</dd>
                </div>
              `
            )
            .join("")}
        </dl>
      </div>
    `;
  }

  function buildTypographyMixPage(pageNumber) {
    return buildContentPage(
      buildTemplateContent(
        pageNumber,
        "中英文<br>混排规则",
        "混排规则用于所有标题、参数、标注与说明文字。中文保持 OPPO Sans 的结构密度，英文与数字使用 Aeonik Fono，并按 1:1.09 的比例进入同一视觉层级。",
        buildTypographyMixMarkup(),
        "vi-typography-mix-frame",
        "Typography"
      )
    );
  }

  const motionForms = [
    {
      index: "01",
      title: "图形环绕",
      english: "Symbol Orbit",
      type: "symbol-orbit",
      body: "图形符号作为独立主体持续环绕。它保留清晰的正面识别，同时通过 Y 轴翻转呈现几何体的空间感。",
    },
    {
      index: "02",
      title: "符号标识切换",
      english: "Symbol / Mark Switch",
      type: "symbol-mark-switch",
      body: "图形符号与 OLAB 组合标识沿同一轴线切换。转换发生在侧面角度附近，让抽象符号自然过渡到完整品牌识别。",
    },
    {
      index: "03",
      title: "有机环绕",
      english: "Organic Orbit",
      type: "organic-orbit",
      body: "组合标识以三轴缓慢漂移的方式游动。X/Z 倾角持续变化，Y 轴保持主旋转，形成更自然的空间循环。",
    },
    {
      index: "04",
      title: "停留旋转",
      english: "Hold & Spin",
      type: "hold-spin",
      body: "先保持正面识别，再快速完成一圈旋转。停留与旋转的对比让标识既稳定可读，也能承担转场节奏。",
    },
    {
      index: "05",
      title: "文字环绕",
      english: "Text Orbit",
      type: "text-orbit",
      body: "文字围绕图形符号进入与离开焦点。适合关键词、活动主题或信息标签的动态呈现。",
    },
  ];

  function buildMotionOverviewMarkup() {
    return `
      <div class="vi-motion-overview">
        ${motionForms
          .map(
            (form) => `
              <section class="vi-motion-form">
                <p class="vi-motion-form-index">${form.index}</p>
                <div>
                  <h2 class="vi-motion-form-title">${form.title}<span>${form.english}</span></h2>
                  <p class="vi-motion-form-body">${form.body}</p>
                </div>
              </section>
            `
          )
          .join("")}
      </div>
    `;
  }

  function buildMotionOverviewPage(pageNumber) {
    return buildContentPage(
      buildTemplateContent(
        pageNumber,
        "动态语言<br>形式总览",
        "动态语言共包含五种形式。它们从图形符号环绕、符号与标识切换，到组合标识的空间运动与文字轨道表达，覆盖展示、转场与信息播报三类场景。",
        buildMotionOverviewMarkup(),
        "vi-motion-frame",
        "Motion Language"
      )
    );
  }

  function buildMotionDetailMarkup(form) {
    return `
      <div class="vi-motion-demo vi-motion-demo-${form.type}" aria-label="${form.title} ${form.english}">
        <div class="vi-motion-demo-stage">
          <div class="vi-motion-demo-orbit" aria-hidden="true"></div>
          <svg class="vi-motion-symbol" viewBox="0 0 459 114" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            ${buildShapeMarkMarkup()}
          </svg>
          <svg class="vi-motion-mark" viewBox="0 0 459 254" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            ${buildCombinationMarkMarkup()}
          </svg>
          <div class="vi-motion-text-orbit" aria-hidden="true">
            <span>Motion</span>
            <span>System</span>
            <span>Signal</span>
          </div>
        </div>
      </div>
    `;
  }

  function buildMotionDetailPage(form, pageNumber) {
    return buildContentPage(
      buildTemplateContent(
        pageNumber,
        `${form.title}<br>运动规则`,
        form.body,
        buildMotionDetailMarkup(form),
        "vi-motion-demo-frame",
        "Motion Language"
      )
    );
  }

  function buildCoverPage() {
    return `
      <div class="vi-page-frame">
        <article class="vi-page vi-cover-page">
          <div class="vi-grid vi-grid-columns" aria-hidden="true">${repeatSpans(columns)}</div>
          <div class="vi-grid vi-grid-rows" aria-hidden="true">${repeatSpans(rows)}</div>
          <div class="vi-page-content vi-cover-content">
            <p class="vi-template-brand">o lab</p>
            <p class="vi-template-section">Content</p>
            <p class="vi-template-version">Version 1.0</p>
            <svg class="vi-cover-mark vi-cover-combination" viewBox="0 0 459 254" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              ${buildCombinationMarkMarkup()}
            </svg>
          </div>
        </article>
      </div>
    `;
  }

  function buildManual() {
    shell.innerHTML = `
      <div class="vi-viewer">
        <div class="vi-viewer-meta">
          <span>VI</span>
        </div>
        <div class="vi-pages">
          ${buildCoverPage()}
          ${buildLogoFormsPage(1)}
          ${buildLogoFormsSplitPage(2)}
          ${buildSectionCoverPage(3, "A", "标识系统", "Logo System", "vi-main-section-page")}
          ${buildSectionCoverPage(4, "A1", "组合标识", "Combination Mark", "vi-sub-section-page")}
          ${buildMarkDisplayPage("combination", false, 5)}
          ${buildMarkDisplayPage("combination", true, 6)}
          ${buildContentPage(
            buildSafeDistancePage(
              7,
              "组合标识<br>安全距离",
              "为了最大程度确保清晰易辩，组合标识应始终保持一个明确的安全范围，其周边必须保留足够的空间作为预留空间，在预留空间内禁止出现任何文字、图案或其他元素。<br><br>留白空间的最小值应等于图形符号中圆圈的直径。",
              "combination"
            )
          )}
          ${buildCobrandingGuidePage(8)}
          ${buildCobrandingExamplePage(9)}
          ${buildCobrandingVerticalGuidePage(10)}
          ${buildCobrandingVerticalExamplePage(11)}
          ${buildPlacementGuidePage("combination", 12)}
          ${buildSectionCoverPage(13, "A2", "图形符号", "Symbol", "vi-sub-section-page")}
          ${buildMarkDisplayPage("shape", false, 14)}
          ${buildMarkDisplayPage("shape", true, 15)}
          ${buildContentPage(
            buildSafeDistancePage(
              16,
              "图形符号<br>安全距离",
              "为了最大程度确保图形符号清晰易辩，图形符号应始终保持一个明确的安全范围，其周边必须保留足够的空间作为预留空间，在预留空间内禁止出现任何文字、图案或其他元素。<br><br>留白空间的最小值应等于图形符号中圆圈的直径。",
              "shape"
            )
          )}
          ${buildPlacementGuidePage("shape", 17)}
          ${buildSectionCoverPage(18, "A3", "字标", "Wordmark", "vi-sub-section-page")}
          ${buildMarkDisplayPage("wordmark", false, 19)}
          ${buildMarkDisplayPage("wordmark", true, 20)}
          ${buildContentPage(
            buildSafeDistancePage(
              21,
              "字标<br>安全距离",
              "为了最大程度确保清晰易辩，字标应始终保持一个明确的安全范围，其周边必须保留足够的空间作为预留空间，在预留空间内禁止出现任何文字、图案或其他元素。<br><br>留白空间的最小值应等于字标中“o”字母的高度。",
              "wordmark"
            )
          )}
          ${buildSectionCoverPage(22, "B", "品牌色彩", "Brand Color", "vi-main-section-page")}
          ${buildBrandColorPresetPage(23)}
          ${buildSectionCoverPage(24, "C", "品牌字体", "Typography", "vi-main-section-page")}
          ${buildTypographyIntroPage(25)}
          ${buildTypographyMixPage(26)}
          ${buildSectionCoverPage(27, "D", "动态语言", "Motion Language", "vi-main-section-page")}
          ${buildMotionOverviewPage(28)}
          ${motionForms.map((form, index) => buildMotionDetailPage(form, 29 + index)).join("")}
        </div>
      </div>
    `;
  }

  function updateWorkspaceBounds() {
    if (window.matchMedia("(max-width: 640px)").matches || !uiPanel) {
      shell.style.setProperty("--vi-workspace-left", "0px");
      return;
    }
    const panelRect = uiPanel.getBoundingClientRect();
    shell.style.setProperty("--vi-workspace-left", `${Math.max(0, Math.round(panelRect.right + 12))}px`);
  }

  function updateScale() {
    if (shell.hidden) return;
    updateWorkspaceBounds();
    const rect = shell.getBoundingClientRect();
    const availableWidth = Math.max(1, rect.width - 56);
    const availableHeight = Math.max(1, rect.height - 56);
    const scale = Math.min(1, availableWidth / pageWidth, availableHeight / pageHeight);
    shell.style.setProperty("--vi-scale", scale.toFixed(5));
    shell.style.setProperty("--vi-scaled-width", `${(pageWidth * scale).toFixed(2)}px`);
    shell.style.setProperty("--vi-scaled-height", `${(pageHeight * scale).toFixed(2)}px`);
  }

  function getActiveTabName() {
    const active = document.querySelector(".ui-tab.is-active");
    return active ? active.dataset.tabTarget : "";
  }

  function isEditableShortcutTarget(target) {
    if (!(target instanceof HTMLElement)) return false;
    if (target.isContentEditable || target.closest("[contenteditable='true']")) return true;
    const tagName = target.tagName.toLowerCase();
    return tagName === "input" || tagName === "select" || tagName === "textarea";
  }

  function syncManualGridVisibility() {
    shell.classList.toggle("vi-grid-visible", manualGridVisible);
  }

  function syncVisibility() {
    const isActive = getActiveTabName() === "vi-manual";
    shell.hidden = !isActive;
    document.body.classList.toggle("vi-manual-active", isActive);
    syncManualGridVisibility();
    if (isActive) updateScale();
  }

  function setExportStatus(message) {
    if (!exportStatus) return;
    exportStatus.textContent = message;
  }

  function downloadBlob(filename, blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function downloadTextFile(filename, text, mimeType) {
    downloadBlob(filename, new Blob([text], { type: mimeType }));
  }

  function downloadBytesFile(filename, bytes, mimeType) {
    downloadBlob(filename, new Blob([bytes], { type: mimeType }));
  }

  function collectExportCssText(includeFontFace = true) {
    const chunks = [];
    Array.from(document.styleSheets).forEach((sheet) => {
      try {
        const rules = Array.from(sheet.cssRules || []);
        chunks.push(
          rules
            .map((rule) => rule.cssText)
            .filter((cssText) => includeFontFace || !cssText.trim().startsWith("@font-face"))
            .join("\n"),
        );
      } catch (error) {
        // Some browser/security combinations block stylesheet reads; the export still carries inline structure.
      }
    });
    chunks.push(`
      .vi-export-page-wrap {
        width: ${pageWidth}px;
        height: ${pageHeight}px;
        overflow: hidden;
      }
      .vi-export-page-wrap .vi-page {
        position: relative !important;
        left: auto !important;
        top: auto !important;
        width: ${pageWidth}px !important;
        height: ${pageHeight}px !important;
        transform: none !important;
        transform-origin: 0 0 !important;
      }
      .vi-export-page-wrap:not(.vi-grid-visible) .vi-grid {
        display: none !important;
      }
    `);
    return chunks.join("\n");
  }

  function serializePageForRaster(page, scale, includeFontFace) {
    const wrapper = document.createElement("div");
    const style = document.createElement("style");
    const clone = page.cloneNode(true);
    wrapper.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
    wrapper.className = `vi-export-page-wrap${manualGridVisible ? " vi-grid-visible" : ""}`;
    style.textContent = collectExportCssText(includeFontFace);
    wrapper.append(style, clone);
    const html = new XMLSerializer().serializeToString(wrapper);
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${pageWidth * scale}" height="${pageHeight * scale}" viewBox="0 0 ${pageWidth} ${pageHeight}">
  <foreignObject x="0" y="0" width="${pageWidth}" height="${pageHeight}">
    ${html}
  </foreignObject>
</svg>`;
  }

  function loadImageFromBlob(blob) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Slide image render failed."));
      };
      image.src = url;
    });
  }

  async function renderPageToDataUrl(page, options = {}) {
    const scale = Math.max(1, Number(options.scale) || 1);
    const type = options.type || "image/jpeg";
    const quality = Number.isFinite(options.quality) ? options.quality : 0.94;
    const includeFontFace = options.includeFontFace !== false;
    const svgText = serializePageForRaster(page, scale, includeFontFace);
    const image = await loadImageFromBlob(new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }));
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas export is not supported.");
    canvas.width = Math.round(pageWidth * scale);
    canvas.height = Math.round(pageHeight * scale);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL(type, quality);
  }

  async function renderManualPagesToImages(options = {}) {
    const pages = Array.from(shell.querySelectorAll(".vi-page"));
    const images = [];
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    for (let index = 0; index < pages.length; index += 1) {
      if (typeof options.onProgress === "function") {
        options.onProgress(index + 1, pages.length);
      }
      try {
        images.push(await renderPageToDataUrl(pages[index], options));
      } catch (error) {
        if (options.includeFontFace === false) throw error;
        images.push(await renderPageToDataUrl(pages[index], { ...options, includeFontFace: false }));
      }
    }
    return images;
  }

  function buildFigmaSlidesSvg(imageDataUrls) {
    const pageMarkup = imageDataUrls
      .map(
        (dataUrl, index) => `
          <g id="slide-${String(index + 1).padStart(2, "0")}" transform="translate(0 ${index * pageHeight})">
            <image href="${dataUrl}" xlink:href="${dataUrl}" x="0" y="0" width="${pageWidth}" height="${pageHeight}" preserveAspectRatio="none"/>
          </g>
        `,
      )
      .join("");

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${pageWidth}" height="${pageHeight * imageDataUrls.length}" viewBox="0 0 ${pageWidth} ${pageHeight * imageDataUrls.length}">
${pageMarkup}
</svg>`;
  }

  function dataUrlToBytes(dataUrl) {
    const base64 = String(dataUrl).split(",")[1] || "";
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  }

  function asciiBytes(text) {
    const bytes = new Uint8Array(text.length);
    for (let index = 0; index < text.length; index += 1) {
      bytes[index] = text.charCodeAt(index) & 0xff;
    }
    return bytes;
  }

  function buildPdfFromJpegs(imageDataUrls) {
    const pageCount = imageDataUrls.length;
    const objectCount = 2 + pageCount * 3;
    const objects = new Array(objectCount + 1);
    const kids = [];

    objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
    for (let index = 0; index < pageCount; index += 1) {
      const imageObject = 3 + index * 3;
      const contentObject = imageObject + 1;
      const pageObject = imageObject + 2;
      const imageBytes = dataUrlToBytes(imageDataUrls[index]);
      const content = `q\n${pageWidth} 0 0 ${pageHeight} 0 0 cm\n/Im${index} Do\nQ`;
      objects[imageObject] = [
        `<< /Type /XObject /Subtype /Image /Width ${pageWidth} /Height ${pageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`,
        imageBytes,
        "\nendstream",
      ];
      objects[contentObject] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
      objects[pageObject] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im${index} ${imageObject} 0 R >> >> /Contents ${contentObject} 0 R >>`;
      kids.push(`${pageObject} 0 R`);
    }
    objects[2] = `<< /Type /Pages /Count ${pageCount} /Kids [${kids.join(" ")}] >>`;

    const parts = [asciiBytes("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n")];
    const offsets = [0];
    let byteLength = parts[0].length;

    for (let objectNumber = 1; objectNumber <= objectCount; objectNumber += 1) {
      offsets[objectNumber] = byteLength;
      const prefix = asciiBytes(`${objectNumber} 0 obj\n`);
      const content = objects[objectNumber];
      const suffix = asciiBytes("\nendobj\n");
      parts.push(prefix);
      byteLength += prefix.length;
      if (Array.isArray(content)) {
        content.forEach((part) => {
          const bytes = typeof part === "string" ? asciiBytes(part) : part;
          parts.push(bytes);
          byteLength += bytes.length;
        });
      } else {
        const bytes = asciiBytes(String(content));
        parts.push(bytes);
        byteLength += bytes.length;
      }
      parts.push(suffix);
      byteLength += suffix.length;
    }

    const xrefOffset = byteLength;
    const xrefRows = ["xref", `0 ${objectCount + 1}`, "0000000000 65535 f "];
    for (let objectNumber = 1; objectNumber <= objectCount; objectNumber += 1) {
      xrefRows.push(`${String(offsets[objectNumber]).padStart(10, "0")} 00000 n `);
    }
    xrefRows.push(
      "trailer",
      `<< /Size ${objectCount + 1} /Root 1 0 R >>`,
      "startxref",
      String(xrefOffset),
      "%%EOF",
    );
    const tail = asciiBytes(`${xrefRows.join("\n")}\n`);
    parts.push(tail);
    byteLength += tail.length;

    const pdf = new Uint8Array(byteLength);
    let offset = 0;
    parts.forEach((part) => {
      pdf.set(part, offset);
      offset += part.length;
    });
    return pdf;
  }

  async function exportManualPdf() {
    if (getActiveTabName() !== "vi-manual") {
      setExportStatus("Switch to VI手册 first.");
      return;
    }
    if (!exportPdfButton) return;
    exportPdfButton.disabled = true;
    if (exportFigmaButton) exportFigmaButton.disabled = true;
    try {
      const imageDataUrls = await renderManualPagesToImages({
        scale: 1,
        type: "image/jpeg",
        quality: 0.95,
        onProgress: (current, total) => setExportStatus(`Rendering PDF ${current}/${total}...`),
      });
      const pdfBytes = buildPdfFromJpegs(imageDataUrls);
      downloadBytesFile("olab-vi-manual.pdf", pdfBytes, "application/pdf");
      setExportStatus("PDF downloaded.");
    } catch (error) {
      setExportStatus("PDF export failed.");
    } finally {
      exportPdfButton.disabled = false;
      if (exportFigmaButton) exportFigmaButton.disabled = false;
    }
  }

  async function exportManualForFigma() {
    if (getActiveTabName() !== "vi-manual") {
      setExportStatus("Switch to VI手册 first.");
      return;
    }
    if (!exportFigmaButton) return;
    exportFigmaButton.disabled = true;
    if (exportPdfButton) exportPdfButton.disabled = true;
    try {
      const imageDataUrls = await renderManualPagesToImages({
        scale: 1,
        type: "image/jpeg",
        quality: 0.95,
        onProgress: (current, total) => setExportStatus(`Rendering Figma SVG ${current}/${total}...`),
      });
      const svgText = buildFigmaSlidesSvg(imageDataUrls);
      downloadTextFile("olab-vi-manual-figma-slides.svg", svgText, "image/svg+xml;charset=utf-8");
      setExportStatus("Figma SVG downloaded. Import or drag it into Figma.");
    } catch (error) {
      setExportStatus("Figma SVG export failed.");
    } finally {
      exportFigmaButton.disabled = false;
      if (exportPdfButton) exportPdfButton.disabled = false;
    }
  }

  buildManual();
  syncVisibility();

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      window.requestAnimationFrame(syncVisibility);
    });
  });

  const tabObserver = new MutationObserver(syncVisibility);
  tabButtons.forEach((button) => {
    tabObserver.observe(button, { attributes: true, attributeFilter: ["class", "aria-selected"] });
  });

  if (exportPdfButton) {
    exportPdfButton.addEventListener("click", exportManualPdf);
  }

  if (exportFigmaButton) {
    exportFigmaButton.addEventListener("click", exportManualForFigma);
  }

  document.addEventListener("keydown", (event) => {
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      isEditableShortcutTarget(event.target) ||
      getActiveTabName() !== "vi-manual"
    ) {
      return;
    }

    const key = String(event.key || "").toLowerCase();
    if (event.shiftKey && key === "g") {
      event.preventDefault();
      manualGridVisible = !manualGridVisible;
      syncManualGridVisibility();
    }
  });

  window.addEventListener("resize", updateScale);
})();
