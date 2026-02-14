document.addEventListener("DOMContentLoaded", () => {
    console.log("✨ Gen Z Translator 3000 Loaded");

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
    const robotTalking = document.getElementById("robotTalking");
    const robotThinking = document.getElementById("robotThinking");
    const thinkingIndicator = document.getElementById("thinkingIndicator");

    let currentMode = null;
    let typingTimer;
    let messageCount = 0;
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

    // GIF Control Functions
    function showMainRobot() {
        robotMain.style.display = "block";
        robotTalking.style.display = "none";
        robotThinking.style.display = "none";
        thinkingIndicator.classList.remove("show");
    }

    function showTalkingRobot() {
        robotMain.style.display = "none";
        robotTalking.style.display = "block";
        robotThinking.style.display = "none";
        thinkingIndicator.classList.remove("show");
    }

    function showThinkingRobot() {
        robotMain.style.display = "none";
        robotTalking.style.display = "none";
        robotThinking.style.display = "block";
        thinkingIndicator.classList.add("show");
        isWaitingForResponse = true;
    }

    // Helper Functions
    function addUserMessage(text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "message user-message";
        msgDiv.innerHTML = `<i class="fas fa-user-circle" style="margin-right: 8px;"></i>${text}`;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        messageCount++;
        
        // Switch to talking robot when user types
        if (!isWaitingForResponse) {
            showTalkingRobot();
        }
    }

    function addBotMessage(text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "message bot-message";
        msgDiv.innerHTML = `<i class="fas fa-robot" style="margin-right: 8px;"></i>${text}`;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        
        // After bot responds, go back to main robot
        showMainRobot();
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
        
        // Show thinking GIF
        showThinkingRobot();
    }

    function removeTyping() {
        const typing = document.getElementById("typingIndicator");
        if (typing) typing.remove();
    }

    // Simulate API call (replace with OpenAI)
    async function getAIResponse(userMessage) {
        showTyping();
        
        return new Promise((resolve) => {
            setTimeout(() => {
                removeTyping();
                
                if (currentMode === "chat") {
                    const responses = [
                        "omg tell me more bestie! 👀",
                        "that's so valid actually ✨",
                        "the way I— 💀",
                        "I'm screaming 💅",
                        "the vibes are immaculate fr",
                        "not you saying that 💀",
                        "say it louder for the people in the back 📢",
                        "this ain't it chief 🗿",
                        "oh you're one of THOSE besties",
                        "🐍 delulu core energy fr"
                    ];
                    resolve(responses[Math.floor(Math.random() * responses.length)]);
                } else {
                    const translations = [
                        `"${userMessage}" but make it iconic fr fr`,
                        `bestie said "${userMessage}" and I oop—`,
                        `✨ genzified: "${userMessage}" no cap`,
                        `translation: ${userMessage} (iykyk)`,
                        `"${userMessage}" - sent from my iphone 💅`,
                        `🐍 delulu version: ${userMessage}`
                    ];
                    resolve(translations[Math.floor(Math.random() * translations.length)]);
                }
            }, 2000);
        });
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
        
        // Get AI response
        const response = await getAIResponse(text);
        addBotMessage(response);
    }

    // Show talking robot while typing
    input.addEventListener("input", () => {
        clearTimeout(typingTimer);
        
        if (input.value.length > 0 && !isWaitingForResponse) {
            showTalkingRobot();
        }
        
        typingTimer = setTimeout(() => {
            if (!isWaitingForResponse && input.value.length === 0) {
                showMainRobot();
            }
        }, 1000);
    });

    input.addEventListener("blur", () => {
        clearTimeout(typingTimer);
        if (!isWaitingForResponse && input.value.length === 0) {
            showMainRobot();
        }
    });

    function startMode(mode) {
        currentMode = mode;
        
        modeScreen.style.display = "none";
        chatUI.style.display = "flex";
        
        // Update mode indicator
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
        showMainRobot(); // Start with main robot
        
        const welcomeMessage = mode === "chat" 
            ? "hey bestie! what's on your mind? 👀✨"
            : "drop some text and i'll make it gen z approved! 💅";
        
        addBotMessage(welcomeMessage);
    }

    function goBackHome() {
        chatUI.style.display = "none";
        modeScreen.style.display = "flex";
        currentMode = null;
        chatBox.innerHTML = "";
        input.value = "";
        showMainRobot(); // Reset to main robot
    }

    // Event Listeners
    chatModeBtn.addEventListener("click", () => startMode("chat"));
    translateModeBtn.addEventListener("click", () => startMode("translate"));
    sendBtn.addEventListener("click", sendMessage);
    backBtn.addEventListener("click", goBackHome);

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
});