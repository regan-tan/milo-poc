/**
 * In-memory canvas state store.
 */

let canvasState = null;

/**
 * Save the canvas state.
 * @param {Object} canvasData - The complete canvas state to persist.
 * @returns {Object} The saved canvas data.
 */
export function saveCanvasState(canvasData) {
  canvasState = {
    ...canvasData,
    updatedAt: new Date().toISOString()
  };
  return canvasState;
}

/**
 * Retrieve the current canvas state.
 * @returns {Object|null} The stored canvas state, or null if none exists.
 */
export function getCanvasState() {
  return canvasState;
}

/**
 * Clear the stored canvas state.
 */
export function clearCanvasState() {
  canvasState = null;
}
