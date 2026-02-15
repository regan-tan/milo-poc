/**
 * In-memory chat history store.
 */

let messages = [];

/**
 * Add a message to history.
 * @param {'user'|'assistant'|'system'} role
 * @param {string} content
 * @param {Array} [commands] - Canvas commands (only for assistant messages)
 * @returns {Object} The added message
 */
export function addMessage(role, content, commands = null) {
  const msg = {
    id: 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
    role,
    content,
    commands,
    timestamp: new Date().toISOString()
  };
  messages.push(msg);
  return msg;
}

/**
 * Get all messages.
 * @returns {Array}
 */
export function getHistory() {
  return messages;
}

/**
 * Clear all messages.
 */
export function clearHistory() {
  messages = [];
}
