(function () {
  const shell = document.getElementById("vi-manual-shell");
  const frameShell = document.getElementById("frame-shell");
  const uiPanel = document.querySelector(".ui-panel");
  const tabButtons = Array.from(document.querySelectorAll("[data-tab-target]"));

  if (!shell) return;

  const pageWidth = 1920;
  const pageHeight = 1080;
  const columns = 14;
  const rows = 10;
  const margin = 50;
  const gutter = 14;

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

  function buildManual() {
    shell.innerHTML = `
      <div class="vi-viewer">
        <div class="vi-viewer-meta">
          <span>VI</span>
        </div>
        <div class="vi-page-frame">
          <article class="vi-page">
            <div class="vi-grid vi-grid-columns" aria-hidden="true">${repeatSpans(columns)}</div>
            <div class="vi-grid vi-grid-rows" aria-hidden="true">${repeatSpans(rows)}</div>
            <div class="vi-page-content">
              <p class="vi-template-brand">oppo lab</p>
              <p class="vi-template-section">Content</p>
              <p class="vi-template-version">Version 1.0</p>
              <h1 class="vi-template-title">标题内容</h1>
              <p class="vi-template-body">${buildBodyText()}</p>
              <p class="vi-template-page">01</p>
            </div>
          </article>
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

  function syncVisibility() {
    const isActive = getActiveTabName() === "vi-manual";
    shell.hidden = !isActive;
    document.body.classList.toggle("vi-manual-active", isActive);
    if (isActive) updateScale();
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

  window.addEventListener("resize", updateScale);
})();
