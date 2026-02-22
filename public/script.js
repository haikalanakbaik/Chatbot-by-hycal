const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // 1. Add user message to UI
  appendMessage('user', userMessage);
  input.value = '';

  // 2. Add "Thinking..." placeholder
  const thinkingMessageId = 'thinking-' + Date.now();
  appendMessage('bot', 'Thinking...', thinkingMessageId);

  try {
    // 3. Send POST request to backend
    const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation: [
          { role: 'user', text: userMessage }
        ]
      }),
    });

    const data = await response.json();

    // 4. Handle response
    if (response.ok && data.result) {
      updateMessage(thinkingMessageId, data.result);
    } else {
      updateMessage(thinkingMessageId, 'Sorry, no response received.');
    }
  } catch (error) {
    console.error('Fetch error:', error);
    updateMessage(thinkingMessageId, 'Failed to get response from server.');
  }
});

/**
 * Appends a message to the chat box
 * @param {string} sender - 'user' or 'bot'
 * @param {string} text - The message content
 * @param {string} id - Optional ID to target this element later
 */
function appendMessage(sender, text, id = null) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  if (id) msg.id = id;
  msg.textContent = text;
  
  chatBox.appendChild(msg);
  
  // Auto-scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

/**
 * Updates an existing message (used to replace "Thinking...")
 */
function updateMessage(id, newText) {
  const msgElement = document.getElementById(id);
  if (msgElement) {
    msgElement.textContent = newText;
    // Adjust scroll in case the response is long
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}