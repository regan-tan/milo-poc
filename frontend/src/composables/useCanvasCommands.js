/**
 * Composable for serialising canvas state and executing AI commands.
 */
export function useCanvasCommands() {
  const CANVAS_WIDTH = 720;
  const CANVAS_HEIGHT = 540;

  /**
   * Serialise the current canvas state into context for the AI.
   * @param {Array} textBoxes - Reactive text box array.
   * @returns {Object}
   */
  function getCanvasContext(textBoxes) {
    return {
      canvasDimensions: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
      elements: textBoxes.map(tb => ({
        id: tb.id,
        type: 'text',
        content: tb.content,
        position: { x: tb.x, y: tb.y },
        style: {
          fontSize: tb.fontSize || 14,
          fontFamily: tb.fontFamily || 'Inter',
          color: tb.color || '#1f2937',
          bold: tb.bold || false,
          italic: tb.italic || false,
          underline: tb.underline || false
        }
      }))
    };
  }

  /**
   * Execute an array of AI commands against the text boxes array.
   * Mutates the reactive array in-place.
   *
   * @param {Array} commands
   * @param {import('vue').Ref<Array>} textBoxesRef
   * @param {Function} idGenerator - Returns a unique id string.
   * @returns {number} Number of commands executed successfully.
   */
  function executeCommands(commands, textBoxesRef, idGenerator) {
    if (!Array.isArray(commands)) return 0;

    let executed = 0;

    for (const cmd of commands) {
      try {
        switch (cmd.action) {
          case 'create':
            handleCreate(cmd, textBoxesRef, idGenerator);
            executed++;
            break;
          case 'modify':
          case 'restyle':
            handleModify(cmd, textBoxesRef);
            executed++;
            break;
          case 'move':
            handleMove(cmd, textBoxesRef);
            executed++;
            break;
          case 'delete':
            handleDelete(cmd, textBoxesRef);
            executed++;
            break;
          case 'resize':
            // Text boxes don't have explicit size; treat as modify
            handleModify(cmd, textBoxesRef);
            executed++;
            break;
          default:
            console.warn('[CanvasCommands] Unknown action:', cmd.action);
        }
      } catch (err) {
        console.error('[CanvasCommands] Error executing command:', err, cmd);
      }
    }

    return executed;
  }

  // ── Internal handlers ─────────────────────────

  function handleCreate(cmd, textBoxesRef, idGenerator) {
    const props = cmd.properties || {};
    const pos = props.position || { x: 50, y: 50 };
    const style = props.style || {};

    textBoxesRef.value.push({
      id: idGenerator(),
      x: clamp(pos.x, 0, CANVAS_WIDTH - 80),
      y: clamp(pos.y, 0, CANVAS_HEIGHT - 30),
      content: props.content || '',
      fontSize: style.fontSize || 14,
      fontFamily: style.fontFamily || 'Inter',
      color: style.color || '#1f2937',
      bold: style.bold || false,
      italic: style.italic || false,
      underline: style.underline || false
    });
  }

  function handleModify(cmd, textBoxesRef) {
    const tb = textBoxesRef.value.find(t => t.id === cmd.targetId);
    if (!tb) {
      console.warn('[CanvasCommands] Element not found:', cmd.targetId);
      return;
    }
    const props = cmd.properties || {};
    if (props.content !== undefined) tb.content = props.content;
    if (props.position) {
      if (props.position.x !== undefined) tb.x = clamp(props.position.x, 0, CANVAS_WIDTH - 80);
      if (props.position.y !== undefined) tb.y = clamp(props.position.y, 0, CANVAS_HEIGHT - 30);
    }
    const style = props.style || {};
    if (style.fontSize !== undefined) tb.fontSize = style.fontSize;
    if (style.fontFamily !== undefined) tb.fontFamily = style.fontFamily;
    if (style.color !== undefined) tb.color = style.color;
    if (style.bold !== undefined) tb.bold = style.bold;
    if (style.italic !== undefined) tb.italic = style.italic;
    if (style.underline !== undefined) tb.underline = style.underline;
  }

  function handleMove(cmd, textBoxesRef) {
    const tb = textBoxesRef.value.find(t => t.id === cmd.targetId);
    if (!tb) {
      console.warn('[CanvasCommands] Element not found:', cmd.targetId);
      return;
    }
    const props = cmd.properties || {};
    if (props.position) {
      if (props.position.x !== undefined) tb.x = clamp(props.position.x, 0, CANVAS_WIDTH - 80);
      if (props.position.y !== undefined) tb.y = clamp(props.position.y, 0, CANVAS_HEIGHT - 30);
    }
    if (props.delta) {
      tb.x = clamp(tb.x + (props.delta.dx || 0), 0, CANVAS_WIDTH - 80);
      tb.y = clamp(tb.y + (props.delta.dy || 0), 0, CANVAS_HEIGHT - 30);
    }
  }

  function handleDelete(cmd, textBoxesRef) {
    const idx = textBoxesRef.value.findIndex(t => t.id === cmd.targetId);
    if (idx === -1) {
      console.warn('[CanvasCommands] Element not found:', cmd.targetId);
      return;
    }
    textBoxesRef.value.splice(idx, 1);
  }

  function clamp(val, min, max) {
    return Math.max(min, Math.min(val, max));
  }

  return {
    getCanvasContext,
    executeCommands
  };
}
