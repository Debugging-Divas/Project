// Wait for page to load
document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Script loaded successfully!");
    
    // DOM Elements
    const modeScreen = document.getElementById("modeScreen");
    const chatUI = document.getElementById("chatUI");
    const chatModeBtn = document.getElementById("chatMode");
    const translateModeBtn = document.getElementById("translateMode");
    const backBtn = document.getElementById("backBtn");
    const chatBox = document.getElementById("chatBox");
    const input = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const modeIndicator = document.getElementById("modeIndicator");
    const floatingTag = document.getElementById("floatingTag");
    
    // GIF Elements
    const robotMain = document.getElementById("robotMain");
    const robotThinking = document.getElementById("robotThinking");
    const robotTalking = document.getElementById("robotTalking");
    const thinkingIndicator = document.getElementById("thinkingIndicator");

    // Session management
    let sessionId = localStorage.getItem('genzSessionId') || 'user_' + Date.now();
    localStorage.setItem('genzSessionId', sessionId);
    
    let currentMode = null;
    let typingTimer;
    let isWaitingForResponse = false;

    // Floating tag messages
    const tagMessages = [
        { icon: "✨", text: "Certified Delulu AI" },
        { icon: "💅", text: "Slay Mode Activated" },
        { icon: "🤪", text: "Main Character Energy" },
        { icon: "🧠", text: "2 Braincells Left" },
        { icon: "💀", text: "Cringe Max Level" },
        { icon: "🐍", text: "Delulu Core" }
    ];

    // Rotate floating tag every 8 seconds
    setInterval(() => {
        if (currentMode && !isWaitingForResponse) {
            const randomTag = tagMessages[Math.floor(Math.random() * tagMessages.length)];
            floatingTag.innerHTML = `<span class="tag-icon">${randomTag.icon}</span>
                                    <span class="tag-text">${randomTag.text}</span>`;
        }
    }, 8000);

    // ========================================
    // GIF STATE MANAGEMENT
    // ========================================
    
    function showMainRobot() {
        console.log("🎭 Showing Six_Seven.gif (main robot)");
        robotMain.style.display = "block";
        robotThinking.style.display = "none";
        robotTalking.style.display = "none";
        thinkingIndicator.classList.remove("show");
    }

    function showThinkingRobot() {
        console.log("💭 Showing IMG_3241.gif (thinking robot)");
        robotMain.style.display = "none";
        robotThinking.style.display = "block";
        robotTalking.style.display = "none";
        thinkingIndicator.classList.add("show");
        isWaitingForResponse = true;
    }

    function showTalkingRobot() {
        console.log("💬 Showing IMG_3206.gif (talking robot)");
        robotMain.style.display = "none";
        robotThinking.style.display = "none";
        robotTalking.style.display = "block";
        thinkingIndicator.classList.remove("show");
    }

    // ========================================
    // CHAT FUNCTIONS
    // ========================================

    function addUserMessage(text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "message user-message";
        msgDiv.innerHTML = `<i class="fas fa-user-circle"></i> ${text}`;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function addBotMessage(text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "message bot-message";
        msgDiv.innerHTML = `<i class="fas fa-robot"></i> ${text}`;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        
        showTalkingRobot();
        setTimeout(() => {
            if (!isWaitingForResponse) {
                showMainRobot();
            }
        }, 2000);
        
        isWaitingForResponse = false;
    }

    function showTyping() {
        const typingDiv = document.createElement("div");
        typingDiv.className = "typing";
        typingDiv.id = "typingIndicator";
        typingDiv.innerHTML = `
            <i class="fas fa-robot"></i>
            <span>thinking</span>
            <span>.</span><span>.</span><span>.</span>
        `;
        chatBox.appendChild(typingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        showThinkingRobot();
    }

    function removeTyping() {
        const typing = document.getElementById("typingIndicator");
        if (typing) typing.remove();
    }

    async function getAIResponse(userMessage) {
        showTyping();
        
        try {
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    mode: currentMode,
                    session_id: sessionId
                })
            });
            
            const data = await response.json();
            removeTyping();
            
            if (data.error) {
                return "oop— something broke fr fr 😭 try again bestie!";
            }
            
            return data.response;
            
        } catch (error) {
            console.error('Error:', error);
            removeTyping();
            return "yo my brain's buffering rn bestie 💀 is the backend running?";
        }
    }

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) {
            input.style.animation = "shake 0.3s ease";
            setTimeout(() => {
                input.style.animation = "";
            }, 300);
            return;
        }
        
        addUserMessage(text);
        input.value = "";
        showMainRobot();
        
        const response = await getAIResponse(text);
        addBotMessage(response);
    }

    // ========================================
    // MODE MANAGEMENT
    // ========================================

    function startMode(mode) {
        console.log("Starting mode:", mode);
        currentMode = mode;
        
        modeScreen.style.display = "none";
        chatUI.style.display = "flex";
        
        if (mode === "chat") {
            modeIndicator.innerHTML = "🔥 Chat Mode Active";
            floatingTag.innerHTML = `<span class="tag-icon">💬</span>
                                    <span class="tag-text">Chat Bestie Activated</span>`;
        } else {
            modeIndicator.innerHTML = "🔁 Translate Mode Activated";
            floatingTag.innerHTML = `<span class="tag-icon">🔄</span>
                                    <span class="tag-text">Translation Era</span>`;
        }
        
        chatBox.innerHTML = "";
        showMainRobot();
        
        const welcomeMessage = mode === "chat" 
            ? "hey bestie! what's on your mind? 👀✨"
            : "drop some text and i'll make it gen z approved! 💅";
        
        setTimeout(() => {
            addBotMessage(welcomeMessage);
        }, 500);
    }

    function goBackHome() {
        chatUI.style.display = "none";
        modeScreen.style.display = "flex";
        currentMode = null;
        chatBox.innerHTML = "";
        input.value = "";
        isWaitingForResponse = false;
        showMainRobot();
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    chatModeBtn.addEventListener("click", function() {
        console.log("Chat button clicked!");
        startMode("chat");
    });
    
    translateModeBtn.addEventListener("click", function() {
        console.log("Translate button clicked!");
        startMode("translate");
    });
    
    sendBtn.addEventListener("click", sendMessage);
    backBtn.addEventListener("click", goBackHome);

    input.addEventListener("keydown", function(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Input typing detection
    input.addEventListener("input", function() {
        clearTimeout(typingTimer);
        
        if (!isWaitingForResponse && input.value.length === 0) {
            typingTimer = setTimeout(() => {
                showMainRobot();
            }, 500);
        }
    });

    input.addEventListener("blur", function() {
        clearTimeout(typingTimer);
        if (!isWaitingForResponse && input.value.length === 0) {
            setTimeout(() => {
                showMainRobot();
            }, 300);
        }
    });

    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    console.log("🚀 Ready - Click buttons now!");
    showMainRobot();
});