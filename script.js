let rsvpForm;
let rsvpMessage;
let giftListContainer;
let giftMessage;
let testimonialForm;
let testimonialList;
let testimonialMessage;
let galleryForm;
let galleryInput;
let galleryGrid;
let galleryMessage;

const gifts = [
  { id: 'anel', title: 'Conjunto de Aliança', description: 'Alianças de prata com acabamento acetinado.' },
  { id: 'jantar', title: 'Jantar de Boas-Vindas', description: 'Contribuição para o coquetel de recepção.' },
  { id: 'decoracao', title: 'Decoração do Salão', description: 'Flores e iluminação para a festa.' },
  { id: 'fotografia', title: 'Foto e Vídeo', description: 'Recordações profissionais do dia.' },
  { id: 'bolo', title: 'Bolo de Casamento', description: 'Bolo especial para a festa.' },
  { id: 'musica', title: 'DJ e Banda', description: 'Trilha sonora da nossa celebração.' }
];

function getReservedGifts() {
  const saved = localStorage.getItem('reservedGifts');
  return saved ? JSON.parse(saved) : [];
}

function setReservedGifts(reserved) {
  localStorage.setItem('reservedGifts', JSON.stringify(reserved));
}

function getTestimonials() {
  const saved = localStorage.getItem('weddingTestimonials');
  return saved ? JSON.parse(saved) : [];
}

function setTestimonials(testimonials) {
  localStorage.setItem('weddingTestimonials', JSON.stringify(testimonials));
}

function getGalleryItems() {
  const saved = localStorage.getItem('weddingGallery');
  return saved ? JSON.parse(saved) : [];
}

function setGalleryItems(items) {
  localStorage.setItem('weddingGallery', JSON.stringify(items));
}

function renderGiftList() {
  if (!giftListContainer) return;

  const reserved = getReservedGifts();
  const available = gifts.filter((gift) => !reserved.includes(gift.id));

  giftListContainer.innerHTML = '';

  if (available.length === 0) {
    giftListContainer.innerHTML = '<p>Todos os presentes foram reservados. Obrigado!</p>';
    return;
  }

  available.forEach((gift) => {
    const card = document.createElement('div');
    card.className = 'gift-card';
    card.innerHTML = `
      <h3>${gift.title}</h3>
      <p>${gift.description}</p>
      <button type="button" data-gift-id="${gift.id}">Reservar presente</button>
    `;

    giftListContainer.appendChild(card);
  });
}

function renderTestimonials() {
  if (!testimonialList) return;

  const testimonials = getTestimonials();
  testimonialList.innerHTML = '';

  if (testimonials.length === 0) {
    testimonialList.innerHTML = '<p>Nenhum depoimento enviado ainda. Seja o primeiro a deixar uma mensagem!</p>';
    return;
  }

  testimonials.slice().reverse().forEach((item) => {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.text}</p>
    `;
    testimonialList.appendChild(card);
    // append media player if media is attached
    if (item.mediaId) {
      getMediaUrl(item.mediaId).then((info) => {
        if (!info) return;
        const mediaWrap = document.createElement('div');
        mediaWrap.className = 'testimonial-media';

        const h3 = card.querySelector('h3');
        const badge = document.createElement('span');
        badge.className = 'media-badge';
        const isAudio = info.type && info.type.startsWith('audio');
        if (isAudio) {
          badge.innerHTML = `
            <svg class="badge-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 11v1a7 7 0 0 1-14 0v-1" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Áudio
          `;
        } else {
          badge.innerHTML = `
            <svg class="badge-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="3" y="6" width="12" height="11" rx="2" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 15l-4-3v6l4-3z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Vídeo
          `;
        }
        if (h3) h3.appendChild(badge);

        let mediaEl;
        if (info.type && info.type.startsWith('audio')) {
          const audio = document.createElement('audio');
          audio.controls = true;
          audio.src = info.url;
          mediaEl = audio;
          mediaWrap.appendChild(audio);
        } else if (info.type && info.type.startsWith('video')) {
          const video = document.createElement('video');
          video.controls = true;
          video.src = info.url;
          video.style.maxWidth = '100%';
          mediaEl = video;
          mediaWrap.appendChild(video);
        }

        // duration element
        const durEl = document.createElement('div');
        durEl.className = 'testimonial-duration';
        durEl.textContent = 'Duração: --:--';
        mediaWrap.appendChild(durEl);

        if (mediaEl) {
          mediaEl.addEventListener('loadedmetadata', () => {
            const d = Math.floor(mediaEl.duration || 0);
            const mm = String(Math.floor(d / 60)).padStart(2, '0');
            const ss = String(d % 60).padStart(2, '0');
            durEl.textContent = `Duração: ${mm}:${ss}`;
          });
        }

        card.appendChild(mediaWrap);
      }).catch(() => {});
    }
  });
}

function renderGallery() {
  if (!galleryGrid) return;

  const items = getGalleryItems();
  galleryGrid.innerHTML = '';

  if (items.length === 0) {
    galleryGrid.innerHTML = '<p>O álbum ainda está vazio. Depois da festa, envie suas fotos!</p>';
    return;
  }

  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'gallery-item';
    card.innerHTML = `
      <img src="${item.dataUrl}" alt="Foto do casamento enviada por ${item.name}" />
      <span>${item.name}</span>
    `;
    galleryGrid.appendChild(card);
  });
}

function handleGiftSelection(event) {
  const button = event.target.closest('button[data-gift-id]');
  if (!button) return;

  const giftId = button.dataset.giftId;
  const reserved = getReservedGifts();

  if (reserved.includes(giftId)) {
    return;
  }

  reserved.push(giftId);
  setReservedGifts(reserved);
  renderGiftList();

  const gift = gifts.find((item) => item.id === giftId);
  if (gift && giftMessage) {
    giftMessage.textContent = `Obrigado! Você reservou: ${gift.title}.`;
    giftMessage.style.color = '#c5e8c5';
  }
}

function handleTestimonialSubmit(event) {
  event.preventDefault();
  if (!testimonialForm) return;

  const name = testimonialForm['testimonial-name'].value.trim();
  const text = testimonialForm['testimonial-text'].value.trim();
  if (!name || !text) {
    if (testimonialMessage) {
      testimonialMessage.textContent = 'Por favor, preencha seu nome e depoimento.';
      testimonialMessage.style.color = '#ffb0b0';
    }
    return;
  }

  const mediaId = testimonialForm.dataset.mediaId || null;
  const testimonials = getTestimonials();
  testimonials.push({ id: Date.now().toString(), name, text, mediaId });
  setTestimonials(testimonials);
  testimonialForm.reset();
  // clear temporary media reference
  delete testimonialForm.dataset.mediaId;
  renderTestimonials();

  if (testimonialMessage) {
    testimonialMessage.textContent = 'Depoimento enviado com sucesso! Obrigado.';
    testimonialMessage.style.color = '#c5e8c5';
  }
}

function handleGallerySubmit(event) {
  event.preventDefault();
  if (!galleryInput) return;

  const files = Array.from(galleryInput.files);
  if (files.length === 0) {
    if (galleryMessage) {
      galleryMessage.textContent = 'Selecione pelo menos uma imagem para enviar.';
      galleryMessage.style.color = '#ffb0b0';
    }
    return;
  }

  const validFiles = files.filter((file) => file.type.startsWith('image/'));
  if (validFiles.length === 0) {
    if (galleryMessage) {
      galleryMessage.textContent = 'Apenas arquivos de imagem são permitidos.';
      galleryMessage.style.color = '#ffb0b0';
    }
    return;
  }

  const readerPromises = validFiles.map((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function () {
        resolve({ name: file.name, dataUrl: reader.result });
      };
      reader.readAsDataURL(file);
    });
  });

  Promise.all(readerPromises).then((images) => {
    const galleryItems = getGalleryItems();
    setGalleryItems([...galleryItems, ...images]);
    renderGallery();
    galleryInput.value = '';

    if (galleryMessage) {
      galleryMessage.textContent = 'Fotos enviadas! Nosso álbum está crescendo.';
      galleryMessage.style.color = '#c5e8c5';
    }
  });
}

if (giftListContainer) {
  giftListContainer.addEventListener('click', handleGiftSelection);
  renderGiftList();
}

if (testimonialList) {
  renderTestimonials();
}

if (galleryGrid) {
  renderGallery();
}
function bindPageElements() {
  rsvpForm = document.querySelector('#rsvp-form');
  rsvpMessage = document.querySelector('#rsvp-message');
  giftListContainer = document.querySelector('#gift-list');
  giftMessage = document.querySelector('#gift-message');
  testimonialForm = document.querySelector('#testimonial-form');
  testimonialList = document.querySelector('#testimonial-list');
  testimonialMessage = document.querySelector('#testimonial-message');
  galleryForm = document.querySelector('#gallery-form');
  galleryInput = document.querySelector('#gallery-input');
  galleryGrid = document.querySelector('#gallery-grid');
  galleryMessage = document.querySelector('#gallery-message');

  if (giftListContainer) {
    giftListContainer.addEventListener('click', handleGiftSelection);
    renderGiftList();
  }

  if (testimonialList) renderTestimonials();
  if (galleryGrid) renderGallery();

  if (testimonialForm) testimonialForm.addEventListener('submit', handleTestimonialSubmit);
  // Media recording / upload controls for testimonials
  const recordAudioBtn = document.getElementById('record-audio');
  const recordVideoBtn = document.getElementById('record-video');
  const mediaInput = document.getElementById('media-input');

  if (mediaInput) {
    mediaInput.addEventListener('change', function (e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      // Save file to IndexedDB and attach to testimonial draft
      addMediaBlob(file).then((mediaId) => {
        // store media id temporarily on form dataset
        testimonialForm.dataset.mediaId = mediaId;
      });
    });
  }

  if (recordAudioBtn) {
    recordAudioBtn.addEventListener('click', function () {
      // trigger native file capture on mobile as fallback
      if (mediaInput) {
        mediaInput.setAttribute('accept', 'audio/*');
        mediaInput.setAttribute('capture', 'microphone');
        mediaInput.click();
        return;
      }
      openRecorder('audio');
    });
  }

  if (recordVideoBtn) {
    recordVideoBtn.addEventListener('click', function () {
      if (mediaInput) {
        mediaInput.setAttribute('accept', 'video/*');
        mediaInput.setAttribute('capture', 'camcorder');
        mediaInput.click();
        return;
      }
      openRecorder('video');
    });
  }
  const exportBtn = document.getElementById('export-media-btn');
  if (exportBtn) exportBtn.addEventListener('click', exportAllMedia);
  if (galleryForm) galleryForm.addEventListener('submit', handleGallerySubmit);

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const nome = rsvpForm.nome.value.trim();
      const presenca = rsvpForm.presenca.value;

      if (!nome || !presenca) {
        rsvpMessage.textContent = 'Por favor, preencha todos os campos antes de enviar.';
        rsvpMessage.style.color = '#ffb0b0';
        return;
      }

      rsvpMessage.textContent = `Obrigado, ${nome}! Sua confirmação foi enviada com sucesso.`;
      rsvpMessage.style.color = '#c5e8c5';
      rsvpForm.reset();
    });
  }
}

function exportAllMedia() {
  const statusEl = document.getElementById('testimonial-message');
  (async () => {
    try {
      const db = await openMediaDB();
      const tx = db.transaction('media', 'readonly');
      const store = tx.objectStore('media');
      const req = store.getAll();
      req.onsuccess = function (e) {
        const all = e.target.result || [];
        if (!all.length) {
          alert('Nenhuma mídia encontrada para exportar.');
          return;
        }
        all.forEach((rec) => {
          const url = URL.createObjectURL(rec.blob);
          const a = document.createElement('a');
          const safeName = (rec.name || rec.id).replace(/[^a-zA-Z0-9._-]/g, '_');
          a.href = url;
          a.download = `media_${rec.id}_${safeName}`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        });
        if (statusEl) {
          statusEl.textContent = `Iniciados ${all.length} downloads de mídia para backup.`;
          statusEl.style.color = '#c5e8c5';
        }
      };
      req.onerror = function () { alert('Falha ao recuperar mídias do IndexedDB.'); };
    } catch (err) {
      alert('Erro ao exportar mídias: ' + (err && err.message));
    }
  })();
}

/* IndexedDB helper for media blobs */
function openMediaDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('wedding-media', 1);
    req.onupgradeneeded = function (e) {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('media')) {
        db.createObjectStore('media', { keyPath: 'id' });
      }
    };
    req.onsuccess = function (e) {
      resolve(e.target.result);
    };
    req.onerror = function (e) {
      reject(e.target.error);
    };
  });
}

function addMediaBlob(file) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openMediaDB();
      const tx = db.transaction('media', 'readwrite');
      const store = tx.objectStore('media');
      const id = Date.now().toString() + '-' + Math.random().toString(36).slice(2, 9);
      const record = { id, type: file.type, name: file.name, blob: file };
      const req = store.add(record);
      req.onsuccess = function () {
        resolve(id);
      };
      req.onerror = function (e) {
        reject(e.target.error);
      };
    } catch (err) {
      reject(err);
    }
  });
}

function getMediaUrl(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openMediaDB();
      const tx = db.transaction('media', 'readonly');
      const store = tx.objectStore('media');
      const req = store.get(id);
      req.onsuccess = function (e) {
        const rec = e.target.result;
        if (!rec) return resolve(null);
        const url = URL.createObjectURL(rec.blob);
        resolve({ url, type: rec.type, name: rec.name });
      };
      req.onerror = function (e) {
        reject(e.target.error);
      };
    } catch (err) {
      reject(err);
    }
  });
}

/* Simple recorder using MediaRecorder (desktop fallback) */
function openRecorder(kind) {
  const constraints = kind === 'video' ? { audio: true, video: true } : { audio: true };
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    let timerInterval = null;
    let seconds = 0;
    const overlay = document.getElementById('recorder-overlay');
    const stopBtn = document.getElementById('rec-stop');
    const timerEl = document.getElementById('rec-timer');

    function startTimer() {
      seconds = 0;
      if (timerEl) timerEl.textContent = '00:00';
      timerInterval = setInterval(() => {
        seconds += 1;
        const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
        const ss = String(seconds % 60).padStart(2, '0');
        if (timerEl) timerEl.textContent = `${mm}:${ss}`;
      }, 1000);
    }

    function stopRecorder() {
      if (recorder && recorder.state !== 'inactive') recorder.stop();
      if (timerInterval) clearInterval(timerInterval);
      if (overlay) overlay.style.display = 'none';
      stream.getTracks().forEach((t) => t.stop());
    }

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: chunks[0]?.type || (kind === 'video' ? 'video/webm' : 'audio/webm') });
      const mediaId = await addMediaBlob(new File([blob], `${kind}-${Date.now()}.${kind === 'video' ? 'webm' : 'webm'}`, { type: blob.type }));
      if (testimonialForm) testimonialForm.dataset.mediaId = mediaId;
      if (testimonialMessage) {
        testimonialMessage.textContent = 'Mídia gravada com sucesso. Envie o depoimento para publicar.';
        testimonialMessage.style.color = '#c5e8c5';
      }
    };

    recorder.start();
    if (overlay) overlay.style.display = 'flex';
    startTimer();

    const stopAfter = 180 * 1000; // 180s (3 minutes) max
    const stopTimeout = setTimeout(() => {
      stopRecorder();
    }, stopAfter);

    if (stopBtn) {
      stopBtn.onclick = () => {
        clearTimeout(stopTimeout);
        stopRecorder();
      };
    }
  }).catch((err) => {
    alert('Não foi possível acessar o microfone/câmera: ' + err.message);
  });
}

function loadPagePartial(name) {
  const container = document.getElementById('app');
  if (!container) return;
  fetch(`pages/${name}.html`)
    .then((res) => {
      if (!res.ok) throw new Error('Não foi possível carregar a página');
      return res.text();
    })
    .then((html) => {
      container.innerHTML = html;
      // After inserting HTML, bind interactive elements
      bindPageElements();
    })
    .catch((err) => {
      container.innerHTML = `<div class="container"><p>Erro ao carregar a página: ${err.message}</p></div>`;
    });
}

function route() {
  const hash = location.hash.replace(/^#/, '') || 'home';
  loadPagePartial(hash);
}

window.addEventListener('hashchange', route);
window.addEventListener('load', route);
