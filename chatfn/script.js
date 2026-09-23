document.addEventListener("DOMContentLoaded", () => {
  const config = window.FUNIL_CONFIG || {};
  const profile = config.profile || {};
  const delays = config.delays || {};
  const steps = config.steps || [];

  // Elements
  const chatArea = document.getElementById("chat-area");
  const optionsContainer = document.getElementById("options-container");
  const profileNameEl = document.getElementById("profile-name");
  const profileStatusEl = document.getElementById("profile-status");
  const profileAvatarEl = document.getElementById("profile-avatar");
  const audioNotification = document.getElementById("audio-notification");
  const imgModal = document.getElementById("img-modal");
  const modalImg = document.getElementById("modal-img");

  let currentStepIndex = 0;
  let audioUnlocked = false;

  // Initialize Profile info
  if (profile.name && profileNameEl) profileNameEl.innerText = profile.name;
  if (profile.avatar && profileAvatarEl) profileAvatarEl.src = profile.avatar;
  if (profile.notificationSound && audioNotification) {
    audioNotification.src = profile.notificationSound;
  }

  // Unlock audio on first user gesture (se som estiver configurado)
  const unlockAudio = () => {
    if (!audioUnlocked && audioNotification && profile.notificationSound) {
      audioNotification.play().then(() => {
        audioNotification.pause();
        audioNotification.currentTime = 0;
        audioUnlocked = true;
      }).catch(() => {});
    }
  };
  if (profile.notificationSound) {
    window.addEventListener("click", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });
  }

  const playNotificationSound = () => {
    if (audioNotification && profile.notificationSound) {
      audioNotification.currentTime = 0;
      audioNotification.play().catch(() => {});
    }
  };

  const scrollToBottom = () => {
    chatArea.scrollTop = chatArea.scrollHeight;
  };

  const getFormattedTime = () => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  };

  // Typing indicator
  let typingBubbleEl = null;

  const showTyping = () => {
    if (profileStatusEl) {
      profileStatusEl.innerText = profile.statusTyping || "digitando...";
      profileStatusEl.classList.add("typing");
    }
    if (!typingBubbleEl) {
      typingBubbleEl = document.createElement("div");
      typingBubbleEl.className = "wa-typing-row";
      typingBubbleEl.innerHTML = `
        <div class="wa-typing-bubble">
          <div class="wa-typing-dot"></div>
          <div class="wa-typing-dot"></div>
          <div class="wa-typing-dot"></div>
        </div>
      `;
      chatArea.appendChild(typingBubbleEl);
      scrollToBottom();
    }
  };

  const hideTyping = () => {
    if (profileStatusEl) {
      profileStatusEl.innerText = profile.statusOnline || "Online";
      profileStatusEl.classList.remove("typing");
    }
    if (typingBubbleEl && typingBubbleEl.parentNode) {
      typingBubbleEl.parentNode.removeChild(typingBubbleEl);
      typingBubbleEl = null;
    }
  };

  // Add Host Message
  const addHostMessage = (msg) => {
    const time = getFormattedTime();
    const row = document.createElement("div");
    row.className = "msg-row bot";

    if (msg.type === "text") {
      row.innerHTML = `
        <div class="wa-bubble">
          <span>${msg.text}</span>
          <div class="wa-bubble-meta">
            <span>${time}</span>
          </div>
        </div>
      `;
    } else if (msg.type === "image") {
      row.innerHTML = `
        <div class="wa-bubble image-bubble">
          <img src="${msg.src}" alt="${msg.alt || 'Comprovante'}" class="wa-bubble-img" />
          <div class="wa-bubble-meta" style="position: absolute; right: 10px; bottom: 8px; background: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 10px; color: #fff;">
            <span>${time}</span>
          </div>
        </div>
      `;
      const imgEl = row.querySelector(".wa-bubble-img");
      imgEl.addEventListener("click", () => {
        if (modalImg && imgModal) {
          modalImg.src = msg.src;
          imgModal.classList.add("active");
        }
      });
    }

    chatArea.appendChild(row);
    scrollToBottom();
    playNotificationSound();
  };

  // Add User Message
  const addUserMessage = (text) => {
    const time = getFormattedTime();
    const row = document.createElement("div");
    row.className = "msg-row user";
    row.innerHTML = `
      <div class="wa-bubble">
        <span>${text}</span>
        <div class="wa-bubble-meta">
          <span>${time}</span>
          <span class="wa-checks">
            <svg viewBox="0 0 16 11">
              <path d="M1 5.5L5 9.5L15 1" stroke-width="1.8" fill="none" stroke-linecap="round"/>
              <path d="M5 5.5L9 9.5L15 3.5" stroke-width="1.8" fill="none" stroke-linecap="round"/>
            </svg>
          </span>
        </div>
      </div>
    `;
    chatArea.appendChild(row);
    scrollToBottom();
  };

  // Render User Choice Buttons
  const renderInputOptions = (inputConfig) => {
    optionsContainer.innerHTML = "";
    if (!inputConfig || !inputConfig.options) return;

    inputConfig.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "wa-btn-option";
      btn.innerText = opt.text;
      btn.addEventListener("click", () => {
        optionsContainer.innerHTML = "";
        addUserMessage(opt.text);
        
        if (opt.nextStep === "REDIRECT") {
          showTyping();
          setTimeout(() => {
            hideTyping();
            window.location.href = config.checkoutUrl;
          }, delays.redirectDelay || 1500);
        } else {
          setTimeout(() => {
            executeStep(opt.nextStep);
          }, delays.afterUserChoice || 600);
        }
      });
      optionsContainer.appendChild(btn);
    });
    scrollToBottom();
  };

  // Execute Step Sequence
  const executeStep = async (stepId) => {
    const currentStep = steps.find((s) => s.stepId === stepId);
    if (!currentStep) return;

    for (const msg of currentStep.messages) {
      showTyping();
      
      let waitDuration = delays.minTypingTime || 1200;
      if (msg.type === "text") {
        const calculated = (msg.text.length || 20) * (delays.typingSpeed || 30);
        waitDuration = Math.max(delays.minTypingTime || 1200, Math.min(delays.maxTypingTime || 2400, calculated));
      } else if (msg.type === "image") {
        waitDuration = 1800;
      }

      await new Promise((resolve) => setTimeout(resolve, waitDuration));
      hideTyping();
      addHostMessage(msg);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }

    if (currentStep.input) {
      renderInputOptions(currentStep.input);
    }
  };

  // Close image modal
  if (imgModal) {
    imgModal.addEventListener("click", () => {
      imgModal.classList.remove("active");
    });
  }

  // Start funnel
  setTimeout(() => {
    executeStep(1);
  }, delays.initialDelay || 1000);
});