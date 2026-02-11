import { ref } from 'vue';

/**
 * Composable for drag-and-drop within a bounding box.
 *
 * @param {Object} boundaries - { minX, minY, maxX, maxY }
 * @returns drag utilities
 */
export function useDrag() {
  const isDragging = ref(false);

  /**
   * Constrain (x, y) within boundaries.
   */
  function constrainToBounds(x, y, boundaries) {
    return {
      x: Math.max(boundaries.minX, Math.min(x, boundaries.maxX)),
      y: Math.max(boundaries.minY, Math.min(y, boundaries.maxY))
    };
  }

  /**
   * Start a drag operation.
   *
   * @param {MouseEvent} e        - The mousedown event.
   * @param {number}     currentX - Current left position.
   * @param {number}     currentY - Current top position.
   * @param {Object}     boundaries - { minX, minY, maxX, maxY }
   * @param {Function}   onMove   - Called with { x, y } on each move.
   * @param {Function}  [onEnd]   - Called when drag ends.
   */
  function startDrag(e, currentX, currentY, boundaries, onMove, onEnd) {
    if (e.button !== 0) return; // left click only

    isDragging.value = true;
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const originX = currentX;
    const originY = currentY;

    function handleMouseMove(ev) {
      const dx = ev.clientX - startMouseX;
      const dy = ev.clientY - startMouseY;
      const pos = constrainToBounds(originX + dx, originY + dy, boundaries);
      onMove(pos);
    }

    function handleMouseUp() {
      isDragging.value = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (onEnd) onEnd();
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  }

  return {
    isDragging,
    startDrag,
    constrainToBounds
  };
}
