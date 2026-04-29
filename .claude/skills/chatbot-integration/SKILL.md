---
name: chatbot-integration
description: Use when Azriel wants to add an AI chatbot to a PHP/XAMPP client project. Scans the project, generates OpenAI-powered floating chat widget (CSS, JS, PHP handler), and injects it into the shared footer.
argument-hint: "[optional: project root path]"
disable-model-invocation: true
---

## What This Skill Does

Integrates a floating OpenAI-powered chatbot widget into a PHP/XAMPP web project. Scans the project for branding, auto-generates all chatbot files (HTML/CSS/JS/PHP), and injects a single include line into the shared footer. No setup — just API key swap.

---

## Steps

### Step 1: Scan the Project for Branding

Read files in this order (stop at first successful read for each):

1. **Project name + purpose:**
   - Try `CLAUDE.md` — extract 1-2 sentences describing what the project is
   - Fallback: read `index.php` `<title>` tag
   - Fallback: read `index.html` `<title>` tag
   - If still missing, ask the user for project name

2. **Brand colors** — read `CSS/root-styles.css` (or `assets/css/root-styles.css`):
   - Extract `--primary` (or `--navy`, `--main-color`) → use as primary color, fallback `#1d466e`
   - Extract `--accent` (or `--gold`, `--highlight`) → use as accent color, fallback `#fcb900`
   - Extract `--light-bg` (or `--background`, `--bg-light`) → use as widget bg, fallback `#ffffff`

3. **Injection point:**
   - Read `includes/footer.php` (most common in XAMPP projects)
   - Fallback: check `components/footer.php` or `partials/footer.php`
   - Fallback: look at the bottom of `index.php`
   - If not found, ask the user where the shared footer is

Summarize your findings:
- Project name: [extracted]
- Project purpose: [1-2 sentences]
- Primary color: [hex]
- Accent color: [hex]
- Widget background: [hex]
- Footer path: [relative path]

### Step 2: Generate System Prompt

Create a system prompt string from the scanned data:

```
You are a helpful assistant for [Project Name]. [Project purpose from CLAUDE.md or index].
Answer questions about the organization, services, programs, and how to get in touch.
Keep replies concise and friendly. Do not make up information you are not sure about.
```

Show this to the user before proceeding.

### Step 3: Generate 3 Files

All paths are relative to the project root.

#### File 1: `chatbot/chatbot-config.php`

```php
<?php
// OpenAI chatbot configuration
define('OPENAI_API_KEY', 'YOUR_API_KEY_HERE');
define('CHATBOT_MODEL', 'gpt-4o-mini');
define('CHATBOT_MAX_TOKENS', 500);
define('CHATBOT_SYSTEM_PROMPT', <<<'PROMPT'
[GENERATED SYSTEM PROMPT HERE]
PROMPT
);
?>
```

Instructions:
- Replace `[GENERATED SYSTEM PROMPT HERE]` with the prompt from Step 2
- Do NOT add any PHP logic or comments beyond the above
- User will manually add their OpenAI API key

#### File 2: `chatbot/chatbot-handler.php`

```php
<?php
// OpenAI API proxy
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/chatbot-config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($input['message']) || empty(trim($input['message']))) {
    http_response_code(400);
    echo json_encode(['error' => 'Message is required']);
    exit;
}

$message = substr($input['message'], 0, 1000);
$history = isset($input['history']) && is_array($input['history']) ? $input['history'] : [];

// Build conversation array
$messages = [];
$messages[] = [
    'role' => 'system',
    'content' => CHATBOT_SYSTEM_PROMPT
];

// Add last 10 messages
$recent = array_slice($history, -10);
foreach ($recent as $msg) {
    if (isset($msg['role']) && isset($msg['content'])) {
        $messages[] = [
            'role' => $msg['role'],
            'content' => substr($msg['content'], 0, 2000)
        ];
    }
}

$messages[] = [
    'role' => 'user',
    'content' => $message
];

// Call OpenAI
$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . OPENAI_API_KEY,
        'Content-Type: application/json'
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'model' => CHATBOT_MODEL,
        'messages' => $messages,
        'max_tokens' => CHATBOT_MAX_TOKENS,
        'temperature' => 0.7
    ])
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code !== 200) {
    http_response_code(500);
    echo json_encode(['error' => 'OpenAI API error']);
    exit;
}

$data = json_decode($response, true);
if (!isset($data['choices'][0]['message']['content'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Invalid API response']);
    exit;
}

echo json_encode([
    'reply' => $data['choices'][0]['message']['content']
]);
?>
```

Instructions:
- Create exactly as shown
- No modifications needed — API key comes from chatbot-config.php

#### File 3: `chatbot/chatbot-widget.php`

```php
<?php
// ChatBot Widget
if (!defined('CHATBOT_SYSTEM_PROMPT')) {
    require_once __DIR__ . '/chatbot-config.php';
}

// Color defaults
$primary_color = '#1d466e';
$accent_color = '#fcb900';
$bg_color = '#ffffff';
$text_color = '#333333';

// Try to read CSS vars if available
if (file_exists(__DIR__ . '/../CSS/root-styles.css')) {
    $css_content = file_get_contents(__DIR__ . '/../CSS/root-styles.css');
    preg_match('/--(primary|navy|main-color):\s*([#\da-f]+)/i', $css_content, $matches);
    if (!empty($matches[2])) $primary_color = $matches[2];
    preg_match('/--(accent|gold|highlight):\s*([#\da-f]+)/i', $css_content, $matches);
    if (!empty($matches[2])) $accent_color = $matches[2];
    preg_match('/--(light-bg|background|bg-light):\s*([#\da-f]+)/i', $css_content, $matches);
    if (!empty($matches[2])) $bg_color = $matches[2];
}

// Base path support
$base_path = (defined('BASE_PATH') ? BASE_PATH : '') . 'chatbot/';
?>

<style>
#chatbot-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: <?php echo $primary_color; ?>;
    color: white;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    z-index: 9998;
    transition: all 0.3s ease;
    font-family: system-ui, -apple-system, sans-serif;
}

#chatbot-btn:hover {
    background-color: <?php echo $primary_color; ?>;
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

#chatbot-panel {
    position: fixed;
    bottom: 90px;
    right: 20px;
    width: 350px;
    max-height: 500px;
    background-color: <?php echo $bg_color; ?>;
    border-radius: 12px;
    box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
    display: none;
    flex-direction: column;
    z-index: 9999;
    font-family: system-ui, -apple-system, sans-serif;
    overflow: hidden;
}

#chatbot-panel.open {
    display: flex;
}

#chatbot-header {
    background-color: <?php echo $primary_color; ?>;
    color: white;
    padding: 16px;
    border-radius: 12px 12px 0 0;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#chatbot-close {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
}

#chatbot-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.chatbot-message {
    display: flex;
    gap: 8px;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.chatbot-message.user {
    justify-content: flex-end;
}

.chatbot-bubble {
    max-width: 80%;
    padding: 10px 14px;
    border-radius: 12px;
    word-wrap: break-word;
    font-size: 14px;
    line-height: 1.4;
}

.chatbot-message.user .chatbot-bubble {
    background-color: <?php echo $primary_color; ?>;
    color: white;
    border-radius: 18px 18px 4px 18px;
}

.chatbot-message.bot .chatbot-bubble {
    background-color: #f1f1f1;
    color: <?php echo $text_color; ?>;
    border-radius: 18px 18px 18px 4px;
}

.chatbot-typing {
    display: flex;
    gap: 4px;
    padding: 10px 14px;
}

.chatbot-typing span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: <?php echo $primary_color; ?>;
    animation: bounce 1.4s infinite;
}

.chatbot-typing span:nth-child(2) {
    animation-delay: 0.2s;
}

.chatbot-typing span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes bounce {
    0%, 80%, 100% {
        opacity: 0.3;
        transform: translateY(0);
    }
    40% {
        opacity: 1;
        transform: translateY(-8px);
    }
}

#chatbot-input-area {
    display: flex;
    gap: 8px;
    padding: 12px;
    border-top: 1px solid #eee;
    background-color: <?php echo $bg_color; ?>;
}

#chatbot-input {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 10px 14px;
    font-size: 14px;
    font-family: system-ui, -apple-system, sans-serif;
    outline: none;
    transition: border-color 0.2s;
}

#chatbot-input:focus {
    border-color: <?php echo $primary_color; ?>;
}

#chatbot-send {
    background-color: <?php echo $accent_color; ?>;
    color: <?php echo $text_color; ?>;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: all 0.2s;
    flex-shrink: 0;
}

#chatbot-send:hover {
    background-color: <?php echo $primary_color; ?>;
    color: white;
}

#chatbot-send:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (max-width: 480px) {
    #chatbot-panel {
        width: 100%;
        max-width: calc(100vw - 20px);
        bottom: 70px;
        right: 10px;
    }
}
</style>

<div id="chatbot-btn">
    💬
</div>

<div id="chatbot-panel">
    <div id="chatbot-header">
        <span>Chat with us</span>
        <button id="chatbot-close">×</button>
    </div>
    <div id="chatbot-messages"></div>
    <div id="chatbot-input-area">
        <input id="chatbot-input" type="text" placeholder="Type your message..." />
        <button id="chatbot-send" disabled>▶</button>
    </div>
</div>

<script>
const chatbot = {
    isOpen: false,
    messages: [],
    apiBase: '<?php echo $base_path; ?>chatbot-handler.php',
    
    init() {
        const btn = document.getElementById('chatbot-btn');
        const panel = document.getElementById('chatbot-panel');
        const closeBtn = document.getElementById('chatbot-close');
        const input = document.getElementById('chatbot-input');
        const send = document.getElementById('chatbot-send');
        
        btn.addEventListener('click', () => this.toggle());
        closeBtn.addEventListener('click', () => this.close());
        send.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        input.addEventListener('input', () => {
            send.disabled = input.value.trim() === '';
        });
        
        send.disabled = true;
    },
    
    toggle() {
        this.isOpen ? this.close() : this.open();
    },
    
    open() {
        this.isOpen = true;
        document.getElementById('chatbot-panel').classList.add('open');
        document.getElementById('chatbot-input').focus();
    },
    
    close() {
        this.isOpen = false;
        document.getElementById('chatbot-panel').classList.remove('open');
    },
    
    addMessage(text, role = 'user') {
        this.messages.push({ role, content: text });
        this.render();
    },
    
    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const text = input.value.trim();
        if (!text) return;
        
        this.addMessage(text, 'user');
        input.value = '';
        document.getElementById('chatbot-send').disabled = true;
        
        this.showTyping();
        
        fetch(this.apiBase, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: text,
                history: this.messages.slice(0, -1)
            })
        })
        .then(r => r.json())
        .then(data => {
            this.removeTyping();
            if (data.error) {
                this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
            } else {
                this.addMessage(data.reply, 'bot');
            }
        })
        .catch(() => {
            this.removeTyping();
            this.addMessage('Sorry, I could not connect. Please try again.', 'bot');
        });
    },
    
    showTyping() {
        const msgs = document.getElementById('chatbot-messages');
        const typing = document.createElement('div');
        typing.id = 'typing-indicator';
        typing.className = 'chatbot-typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        msgs.appendChild(typing);
        msgs.scrollTop = msgs.scrollHeight;
    },
    
    removeTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    },
    
    render() {
        const msgs = document.getElementById('chatbot-messages');
        const typing = document.getElementById('typing-indicator');
        if (typing) {
            msgs.removeChild(typing);
        }
        
        this.messages.forEach(msg => {
            if (document.querySelector(`[data-msg-id="${msg.role}-${msg.content}"]`)) return;
            
            const div = document.createElement('div');
            div.className = `chatbot-message ${msg.role}`;
            div.dataset.msgId = `${msg.role}-${msg.content}`;
            
            const bubble = document.createElement('div');
            bubble.className = 'chatbot-bubble';
            bubble.textContent = msg.content;
            
            div.appendChild(bubble);
            msgs.appendChild(div);
        });
        
        if (typing) {
            msgs.appendChild(typing);
        }
        
        msgs.scrollTop = msgs.scrollHeight;
    }
};

document.addEventListener('DOMContentLoaded', () => chatbot.init());
</script>
```

Instructions:
- Create exactly as shown
- Colors will auto-detect from `CSS/root-styles.css`
- JavaScript requires no build step, runs in browser

### Step 4: Inject into Footer

Open `includes/footer.php` and add this line just before the closing `</body>` tag:

```php
<?php include __DIR__ . '/../chatbot/chatbot-widget.php'; ?>
```

If there is no closing `</body>` (rare), add the line right before the final `?>`.

### Step 5: Report

Print a summary:

```
✅ Chatbot Integration Complete

📁 Files created:
  - chatbot/chatbot-config.php          [configuration]
  - chatbot/chatbot-handler.php         [API proxy]
  - chatbot/chatbot-widget.php          [widget code]
  - includes/footer.php                 [MODIFIED - added include]

🔑 Next: Replace 'YOUR_API_KEY_HERE' in chatbot/chatbot-config.php with your OpenAI API key

📝 System Prompt Generated:
[Print the exact system prompt from Step 2]

🧪 Test: Open http://localhost/[project-folder]/ 
   Look for 💬 button in bottom-right corner
```

---

## Notes

- **No build tools:** Widget is pure HTML/CSS/JS. No npm, no bundler.
- **Brand colors:** Automatically detected from `CSS/root-styles.css`. Falls back to defaults if not found.
- **Security:** API key never exposed to browser. All OpenAI calls go through PHP proxy.
- **Mobile:** Widget is responsive, works on phones.
- **Conversation history:** Limited to 10 messages to control token usage.
- **Fallback:** If OpenAI is down or key is invalid, user sees a clear error message.

## Edge Cases

- **No CSS vars:** Widget uses hardcoded defaults (`#1d466e` navy, `#fcb900` gold).
- **No footer.php:** Alert the user — need to know where the shared footer is.
- **Subdirectory XAMPP:** Widget respects `BASE_PATH` if defined in the project.
- **Multiple projects:** Skill generates independent chatbots for each project. Each has its own API key slot in `chatbot-config.php`.
