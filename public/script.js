// DOM Elements
const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const submitBtn = form.querySelector('button[type="submit"]');
const chatContainer = document.getElementById('chat-container');
const toggleBtn = document.getElementById('chat-toggle');
const closeBtn = document.getElementById('chat-close');

// Keep track of the conversation history
let conversation = [];
let greetingLoaded = false;

function sanitizeText(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function normalizeMessage(text) {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .substring(0, 5000);
}

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.style.clear = 'both';
  const cleanedText = normalizeMessage(text);
  msg.textContent = cleanedText;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

function toggleLoading(isLoading) {
  input.disabled = isLoading;
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? 'Proses...' : 'Kirim';
}

function openChat() {
  chatContainer.classList.remove('hidden');
  toggleBtn.style.display = 'none';
  if (!greetingLoaded) {
    loadGreeting();
    greetingLoaded = true;
  }
  input.focus();
}

function closeChat() {
  chatContainer.classList.add('hidden');
  toggleBtn.style.display = '';
}

toggleBtn.addEventListener('click', openChat);
closeBtn.addEventListener('click', closeChat);

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage || userMessage.replace(/\s/g, '').length === 0) {
    return;
  }

  appendMessage('user', userMessage);
  conversation.push({ role: 'user', text: userMessage });
  input.value = '';

  const thinkingMessage = appendMessage('bot', 'Memproses...');

  try {
    toggleLoading(true);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data && data.result) {
      thinkingMessage.textContent = data.result;
      conversation.push({ role: 'model', text: data.result });
    } else {
      throw new Error('Invalid response structure from server');
    }
  } catch (error) {
    console.error('Chat error:', error);
    thinkingMessage.textContent = 'Gagal mendapat jawaban dari server.';
    thinkingMessage.style.backgroundColor = '#f8d7da';
    thinkingMessage.style.color = '#721c24';
  } finally {
    toggleLoading(false);
    input.focus();
  }
});

async function loadGreeting() {
  try {
    const res = await fetch('/api/greeting');
    const data = await res.json();
    if (data && data.result) {
      appendMessage('bot', data.result);
      conversation.push({ role: 'model', text: data.result });
    }
  } catch (e) {
    console.error('Greeting error:', e);
  }
}
