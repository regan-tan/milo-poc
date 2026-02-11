import { saveCanvasState, getCanvasState, clearCanvasState } from '../models/canvasModel.js';

/**
 * Save the canvas state.
 * POST /api/canvas/save
 */
export const saveCanvas = async (req, res) => {
  try {
    const canvasData = req.body;

    if (!canvasData || Object.keys(canvasData).length === 0) {
      return res.status(400).json({ error: 'Canvas data is required' });
    }

    const saved = saveCanvasState(canvasData);
    res.status(200).json({ message: 'Canvas saved successfully', data: saved });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save canvas state' });
  }
};

/**
 * Load the canvas state.
 * GET /api/canvas/load
 */
export const loadCanvas = async (req, res) => {
  try {
    const state = getCanvasState();

    if (!state) {
      return res.status(200).json({ message: 'No saved canvas state', data: null });
    }

    res.status(200).json({ message: 'Canvas loaded successfully', data: state });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load canvas state' });
  }
};

/**
 * Clear the canvas state.
 * DELETE /api/canvas/clear
 */
export const clearCanvas = async (req, res) => {
  try {
    clearCanvasState();
    res.status(200).json({ message: 'Canvas cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear canvas state' });
  }
};
