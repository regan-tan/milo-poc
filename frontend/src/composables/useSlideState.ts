import { reactive, readonly } from 'vue'

export interface SlideState {
  currentHtml: string
  currentCss: string
  initialHtml: string
  initialCss: string
}

/* ---- Default blank slide ---- */
const DEFAULT_HTML = `<div class="slide-root">
  <p class="slide-placeholder">SLIDE BLANK CANVAS</p>
</div>`

const DEFAULT_CSS = `.slide-root {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

.slide-placeholder {
  font-size: 18px;
  font-weight: 600;
  color: #b0b0b0;
  letter-spacing: 2px;
  user-select: none;
}`

/* ---- Reactive singleton state ---- */
const state = reactive<SlideState>({
  currentHtml: DEFAULT_HTML,
  currentCss: DEFAULT_CSS,
  initialHtml: DEFAULT_HTML,
  initialCss: DEFAULT_CSS,
})

export function useSlideState() {
  /** Overwrite the "initial" baseline (e.g. when loading a saved slide). */
  function setInitial(html: string, css: string) {
    state.initialHtml = html
    state.initialCss = css
    state.currentHtml = html
    state.currentCss = css
  }

  /** Apply an incremental update from the AI. */
  function applyUpdate(update: { html: string; css: string }) {
    state.currentHtml = update.html
    state.currentCss = update.css
  }

  /** Reset the slide to its initial state. */
  function resetToInitial() {
    state.currentHtml = state.initialHtml
    state.currentCss = state.initialCss
  }

  return {
    state: readonly(state),
    setInitial,
    applyUpdate,
    resetToInitial,
  }
}
