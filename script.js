document.addEventListener("DOMContentLoaded", () => {
    console.log("✨ Delulu Core Loaded");

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
    
    // GIF Elements - CORRECT ORDER
    const robotMain = document.getElementById("robotMain");          // FIRST: Six_Seven.gif (default/idle)
    const robotThinking = document.getElementById("robotThinking");  // SECOND: IMG_3241.gif (while AI is thinking)
    const robotTalking = document.getElementById("robotTalking");    // THIRD: IMG_3206.gif (random response - talking)
    const robotOk = document.getElementById("robotOk");              // FOURTH: A_ok.gif (random response - ok gesture)

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

    // ========================================
    // GIF STATE MANAGEMENT - CORRECTED ORDER
    // ========================================
    
    // FIRST: Six_Seven.gif - Default/Idle state
    function showMainRobot() {
        console.log("🎭 STATE: IDLE - Showing Six_Seven.gif (main robot)");
        robotMain.style.display = "block";
        robotThinking.style.display = "none";
        robotTalking.style.display = "none";
        robotOk.style.display = "none";
        thinkingIndicator.classList.remove("show");
    }

    // SECOND: IMG_3241.gif - Thinking state (when AI is processing)
    function showThinkingRobot() {
        console.log("💭 STATE: THINKING - Showing IMG_3241.gif (thinking robot)");
        robotMain.style.display = "none";
        robotThinking.style.display = "block";
        robotTalking.style.display = "none";
        robotOk.style.display = "none";
        thinkingIndicator.classList.add("show");
        isWaitingForResponse = true;
    }

    // THIRD: IMG_3206.gif - Talking state (response option 1)
    function showTalkingRobot() {
        console.log("💬 STATE: TALKING - Showing IMG_3206.gif (talking robot)");
        robotMain.style.display = "none";
        robotThinking.style.display = "none";
        robotTalking.style.display = "block";
        robotOk.style.display = "none";
        thinkingIndicator.classList.remove("show");
    }

    // FOURTH: A_ok.gif - OK gesture state (response option 2)
    function showOkRobot() {
        console.log("👌 STATE: OK GESTURE - Showing A_ok.gif (ok robot)");
        robotMain.style.display = "none";
        robotThinking.style.display = "none";
        robotTalking.style.display = "none";
        robotOk.style.display = "block";
        thinkingIndicator.classList.remove("show");
    }

    // Random response selector - 50/50 chance between talking and OK
    function showRandomResponseRobot() {
        const random = Math.random();
        if (random < 0.5) {
            showTalkingRobot(); // 50% chance - IMG_3206.gif
        } else {
            showOkRobot();      // 50% chance - A_ok.gif
        }
    }

    // ========================================
    // CHAT MESSAGE FUNCTIONS
    // ========================================

    function addUserMessage(text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "message user-message";
        msgDiv.innerHTML = `<i class="fas fa-user-circle" style="margin-right: 8px;"></i>${text}`;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        messageCount++;
        
        console.log("📤 User sent message:", text);
    }

    function addBotMessage(text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "message bot-message";
        msgDiv.innerHTML = `<i class="fas fa-robot" style="margin-right: 8px;"></i>${text}`;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        
        console.log("📥 Bot responded:", text);
        
        // After bot message appears, show random response robot for 2 seconds, then return to idle
        showRandomResponseRobot();
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
        
        // Show thinking GIF (SECOND - IMG_3241.gif)
        showThinkingRobot();
    }

    function removeTyping() {
        const typing = document.getElementById("typingIndicator");
        if (typing) typing.remove();
    }

    // ========================================
    // AI RESPONSE SIMULATION
    // ========================================

    async function getAIResponse(userMessage) {
        showTyping(); // Triggers IMG_3241.gif (thinking state)
        
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
        
        // Reset to main robot after user sends message
        showMainRobot();
        
        // Get AI response - this will trigger thinking robot (IMG_3241.gif)
        const response = await getAIResponse(text);
        addBotMessage(response); // This will show random response (talking OR ok), then return to main
    }

    // ========================================
    // INPUT FIELD TYPING DETECTION
    // ========================================

    // User is typing - no GIF change while typing, keep current state
    input.addEventListener("input", () => {
        clearTimeout(typingTimer);
        
        // Only show main robot if not waiting for response and input becomes empty
        if (!isWaitingForResponse && input.value.length === 0) {
            typingTimer = setTimeout(() => {
                showMainRobot();
            }, 500);
        }
    });

    // When input loses focus, return to main if not waiting and input is empty
    input.addEventListener("blur", () => {
        clearTimeout(typingTimer);
        if (!isWaitingForResponse && input.value.length === 0) {
            setTimeout(() => {
                showMainRobot();
            }, 300);
        }
    });

    // When input gains focus, don't change state (keep current)
    input.addEventListener("focus", () => {
        clearTimeout(typingTimer);
    });

    // ========================================
    // MODE MANAGEMENT
    // ========================================

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
        showMainRobot(); // Start with Six_Seven.gif (FIRST)
        
        const welcomeMessage = mode === "chat" 
            ? "hey bestie! what's on your mind? 👀✨"
            : "drop some text and i'll make it gen z approved! 💅";
        
        // Add welcome message and briefly show random response robot
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
        showMainRobot(); // Reset to main robot
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

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

    // Add shake animation for empty input
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    // Initialize with main robot
    console.log("🚀 Initialization complete - Default state: Six_Seven.gif");
});