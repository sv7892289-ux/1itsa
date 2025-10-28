// Minimal accessible chatbot behavior for demo
(() => {
  const chatToggle = document.getElementById('chat-toggle');
  const chatDialog = document.getElementById('chat-dialog');
  const chatClose = document.getElementById('chat-close');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const openChat = document.getElementById('open-chat');
  const voiceBtn = document.getElementById('voice-btn');
  const tramiteForm = document.getElementById('tramite-form');
  const tramiteFeedback = document.getElementById('tramite-feedback');

  function appendMessage(text, who='bot'){
    const el = document.createElement('div');
    el.className = 'msg ' + (who === 'user' ? 'user' : 'bot');
    el.textContent = text;
    chatMessages.appendChild(el);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function openChatDialog(){
    chatDialog.setAttribute('aria-hidden','false');
    chatToggle.setAttribute('aria-expanded','true');
    chatDialog.style.display = 'flex';
    chatInput.focus();
  }
  function closeChatDialog(){
    chatDialog.setAttribute('aria-hidden','true');
    chatToggle.setAttribute('aria-expanded','false');
    chatDialog.style.display = 'none';
    chatToggle.focus();
  }

  chatToggle.addEventListener('click', ()=>{
    const hidden = chatDialog.getAttribute('aria-hidden') === 'true';
    if(hidden) openChatDialog(); else closeChatDialog();
  });
  openChat && openChat.addEventListener('click', openChatDialog);
  chatClose.addEventListener('click', closeChatDialog);

  chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const text = chatInput.value.trim();
    if(!text) return;
    appendMessage(text,'user');
    chatInput.value = '';
    // Simple demo bot: echo with a delay
    setTimeout(()=>{
      const reply = `Entiendo: "${text}". Para más opciones, escribe "ayuda".`;
      appendMessage(reply,'bot');
      // Optional speech synthesis
      if('speechSynthesis' in window){
        const ut = new SpeechSynthesisUtterance(reply);
        ut.lang = 'es-BO';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(ut);
      }
    }, 600);
  });

  // Simple voice input toggle
  let recognition = null;
  let listening = false;
  if(window.SpeechRecognition || window.webkitSpeechRecognition){
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.lang = 'es-BO';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.addEventListener('result', (ev)=>{
      const transcript = ev.results[0][0].transcript;
      chatInput.value = transcript;
    });

    recognition.addEventListener('end', ()=>{
      listening = false;
      voiceBtn.setAttribute('aria-pressed','false');
    });
  } else {
    voiceBtn.style.display = 'none';
  }

  voiceBtn.addEventListener('click', ()=>{
    if(!recognition) return;
    if(!listening){
      recognition.start();
      listening = true;
      voiceBtn.setAttribute('aria-pressed','true');
    } else {
      recognition.stop();
      listening = false;
      voiceBtn.setAttribute('aria-pressed','false');
    }
  });

  // Demo: handle tramite form submission (no server)
  tramiteForm && tramiteForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    if(!nombre || !correo){
      tramiteFeedback.textContent = 'Rellena los campos requeridos.';
      return;
    }
    tramiteFeedback.textContent = 'Solicitud recibida. En breve recibirá información por correo.';
    tramiteForm.reset();
  });

  // Register service worker if available
  if('serviceWorker' in navigator){
    window.addEventListener('load', ()=>{
      navigator.serviceWorker.register('sw.js').catch(err=>console.warn('SW registro falló', err));
    });
  }
})();
