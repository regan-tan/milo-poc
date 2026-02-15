import { ref } from 'vue';
import axios from 'axios';

/**
 * Composable for chat panel state and API communication.
 */
export function useChat() {
  const messages = ref([]);
  const selectedModel = ref('gpt-4');
  const isLoading = ref(false);
  const apiKeyConfigured = ref(false);

  const availableModels = [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
  ];

  /**
   * Check if the OpenAI API key is configured.
   */
  async function checkApiKey() {
    try {
      const { data } = await axios.get('/api/config/openai-key/status');
      apiKeyConfigured.value = data.configured;
    } catch {
      apiKeyConfigured.value = false;
    }
  }

  /**
   * Set the OpenAI API key at runtime.
   */
  async function setApiKey(key) {
    try {
      await axios.post('/api/config/openai-key', { apiKey: key });
      apiKeyConfigured.value = true;
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  }

  /**
   * Send a message and get AI response + commands.
   * @param {string} text
   * @param {Object} canvasContext
   * @returns {Object|null} { message, commands } or null on error
   */
  async function sendMessage(text, canvasContext) {
    // Add user message locally
    messages.value.push({
      id: 'msg-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    });

    isLoading.value = true;

    try {
      const { data } = await axios.post('/api/chat/message', {
        message: text,
        model: selectedModel.value,
        canvasContext
      });

      // Add AI response locally
      messages.value.push({
        id: 'msg-' + Date.now() + '-ai',
        role: 'assistant',
        content: data.message,
        commands: data.commands,
        timestamp: new Date().toISOString()
      });

      return { message: data.message, commands: data.commands };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Network error — could not reach server.';
      messages.value.push({
        id: 'msg-' + Date.now() + '-err',
        role: 'assistant',
        content: `⚠️ ${errorMsg}`,
        timestamp: new Date().toISOString()
      });
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Clear all chat messages.
   */
  async function clearMessages() {
    try {
      await axios.post('/api/chat/clear');
    } catch { /* ignore */ }
    messages.value = [];
  }

  /**
   * Load chat history from server.
   */
  async function loadHistory() {
    try {
      const { data } = await axios.get('/api/chat/history');
      if (Array.isArray(data.messages)) {
        messages.value = data.messages;
      }
    } catch { /* ignore */ }
  }

  return {
    messages,
    selectedModel,
    isLoading,
    apiKeyConfigured,
    availableModels,
    checkApiKey,
    setApiKey,
    sendMessage,
    clearMessages,
    loadHistory
  };
}
