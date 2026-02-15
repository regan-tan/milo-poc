import OpenAI from 'openai';
import config from '../config/config.js';
import { addMessage, getHistory, clearHistory } from '../models/chatModel.js';

// ──────────────────────────────────────────────
// Runtime API key (can be overridden via POST)
// ──────────────────────────────────────────────
let runtimeApiKey = config.openaiApiKey || '';

function getOpenAIClient() {
  const key = runtimeApiKey;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

// ──────────────────────────────────────────────
// System prompt
// ──────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an AI assistant helping users manipulate a canvas drawing application. Users can create and edit text boxes on a canvas.

You have access to the current canvas state and must return your responses **strictly** as a JSON object with two keys: "message" and "commands".

When a user gives you an instruction:
1. Understand what they want to change or create.
2. Analyse the current canvas context (provided in the next message) to understand existing elements.
3. Generate appropriate commands to fulfill the request.
4. Return a friendly "message" explaining what you did, along with the "commands" array.

Available command actions:
- **create** – Add a new text box. Properties: position {x,y}, content (string), style {fontSize, fontFamily, color, bold, italic, underline, alignment}.
- **modify** – Update properties of an existing element identified by targetId.
- **move** – Reposition an element. Properties: position {x,y}  (absolute) or delta {dx,dy} (relative).
- **delete** – Remove an element by targetId.

Position system: Canvas uses x,y coordinates where (0,0) is top-left.
Canvas dimensions are provided in the context.

Example response:
{
  "message": "I created a text box saying 'Hello World' in the center of the canvas.",
  "commands": [
    {
      "action": "create",
      "type": "text",
      "properties": {
        "position": { "x": 310, "y": 220 },
        "content": "Hello World",
        "style": { "fontSize": 16, "color": "#000000", "bold": false }
      }
    }
  ]
}

IMPORTANT: Respond ONLY with valid JSON. Do not wrap it in markdown code fences. Do not include any text outside the JSON object.`;

// ──────────────────────────────────────────────
// Controller handlers
// ──────────────────────────────────────────────

/**
 * POST /api/chat/message
 */
export const sendMessage = async (req, res) => {
  try {
    const { message, model = 'gpt-4', canvasContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    const client = getOpenAIClient();
    if (!client) {
      return res.status(400).json({
        error: 'OpenAI API key is not configured. Use POST /api/config/openai-key to set it.'
      });
    }

    // Store user message
    addMessage('user', message);

    // Build messages array for OpenAI
    const openaiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Current canvas state:\n${JSON.stringify(canvasContext, null, 2)}`
      },
      { role: 'user', content: message }
    ];

    const completion = await client.chat.completions.create({
      model,
      messages: openaiMessages,
      temperature: 0.3,
      max_tokens: 2048
    });

    const rawContent = completion.choices[0]?.message?.content || '';

    // Parse JSON response from AI
    let parsed;
    try {
      // Strip possible markdown fences
      const cleaned = rawContent.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // If parsing fails, treat entire content as message with no commands
      parsed = { message: rawContent, commands: [] };
    }

    const aiMessage = parsed.message || rawContent;
    const commands = Array.isArray(parsed.commands) ? parsed.commands : [];

    // Store AI response
    addMessage('assistant', aiMessage, commands);

    res.status(200).json({
      message: aiMessage,
      commands
    });
  } catch (err) {
    console.error('[ChatController] sendMessage error:', err.message);
    res.status(500).json({ error: 'Failed to process chat message: ' + err.message });
  }
};

/**
 * GET /api/chat/history
 */
export const getChatHistory = (req, res) => {
  res.status(200).json({ messages: getHistory() });
};

/**
 * POST /api/chat/clear
 */
export const clearChat = (req, res) => {
  clearHistory();
  res.status(200).json({ message: 'Chat history cleared' });
};

/**
 * POST /api/config/openai-key
 */
export const setApiKey = (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    return res.status(400).json({ error: 'A valid apiKey string is required' });
  }
  runtimeApiKey = apiKey.trim();
  res.status(200).json({ message: 'API key configured successfully' });
};

/**
 * GET /api/config/openai-key/status
 */
export const getApiKeyStatus = (req, res) => {
  res.status(200).json({ configured: !!runtimeApiKey });
};
