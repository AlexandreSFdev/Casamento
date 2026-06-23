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

  const testimonials = getTestimonials();
  testimonials.push({ id: Date.now().toString(), name, text });
  setTestimonials(testimonials);
  testimonialForm.reset();
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
