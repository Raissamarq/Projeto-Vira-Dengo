document.addEventListener('DOMContentLoaded', () => {
  const botoesFiltro = document.querySelectorAll('.filtro-botao');
  const cards = document.querySelectorAll('.feed .card');
  const btnLimpar = document.getElementById('limparFiltros');
  const inputRaio = document.getElementById('filtroRaio');
  const labelRaio = document.getElementById('raioValor');
  const inputLocalizacao = document.getElementById('filtroLocalizacao');
  const selectOrdenar = document.getElementById('filtroOrdenar');
  const feed = document.querySelector('.feed');

  let filtroAtivo = 'todos';

  // ============================================
  // APLICA O FILTRO NOS CARDS
  // ============================================
  function aplicarFiltro() {
    let visiveis = 0;

    cards.forEach((card) => {
      const categoria = card.dataset.categoria;
      const corresponde = filtroAtivo === 'todos' || categoria === filtroAtivo;

      card.hidden = !corresponde;
      if (corresponde) visiveis++;
    });

    mensagemVazia.hidden = visiveis > 0;
  }

  // ============================================
  // SELEÇÃO DO BOTÃO DE FILTRO (seleção única)
  // ============================================
  botoesFiltro.forEach((botao) => {
    botao.addEventListener('click', () => {
      botoesFiltro.forEach((b) => b.classList.remove('ativo'));
      botao.classList.add('ativo');

      filtroAtivo = botao.dataset.filtro;
      aplicarFiltro();
    });
  });

  // ============================================
  // RAIO DE BUSCA (atualiza o valor exibido)
  // ============================================
  if (inputRaio && labelRaio) {
    inputRaio.addEventListener('input', () => {
      labelRaio.textContent = `${inputRaio.value} km`;
    });
  }

  // ============================================
  // ORDENAR POR (mais recentes / mais antigos)
  // ============================================
  if (selectOrdenar) {
    selectOrdenar.addEventListener('change', () => {
      const cardsArray = Array.from(cards);

      if (selectOrdenar.value === 'antigos') {
        cardsArray.reverse();
      }

      cardsArray.forEach((card) => feed.insertBefore(card, mensagemVazia));
    });
  }

  // ============================================
  // LIMPAR FILTROS
  // ============================================
  if (btnLimpar) {
    btnLimpar.addEventListener('click', () => {
      botoesFiltro.forEach((b) => b.classList.remove('ativo'));
      document.querySelector('[data-filtro="todos"]').classList.add('ativo');
      filtroAtivo = 'todos';

      if (inputLocalizacao) inputLocalizacao.value = '';
      if (inputRaio) {
        inputRaio.value = 25;
        labelRaio.textContent = '25 km';
      }
      if (selectOrdenar) selectOrdenar.value = 'recentes';

      aplicarFiltro();
    });
  }

  // Inicializa mostrando todos os posts
  aplicarFiltro();

  // ============================================
  // CHAT TOGGLE - Mostrar/Esconder painel lateral
  // ============================================
  const btnToggleChat = document.getElementById('btnToggleChat');
  const btnFecharChat = document.querySelector('.chat-fechar');
  const chatPanel = document.querySelector('.chat-panel');
  const conteudoDireita = document.querySelector('.conteudo-direita');
  const conteudoCentral = document.querySelector('.conteudo-central');
  const conteudoGeral = document.querySelector('.conteudo-geral');

  let chatVisivel = true;

  function mostrarChat() {
    chatVisivel = true;
    chatPanel.style.display = 'flex';
    conteudoDireita.style.display = 'flex';
    conteudoDireita.style.flex = '0 1 28%';
    conteudoCentral.style.flex = '0 1 40%';
    btnToggleChat.classList.remove('chat-fechado');
    btnToggleChat.innerHTML = '<img src="../img/icons/messenger.png" alt="" /> Mensagem';
  }

  function esconderChat() {
    chatVisivel = false;
    chatPanel.style.display = 'none';
    conteudoDireita.style.display = 'none';
    conteudoDireita.style.flex = '0 1 0%';
    conteudoCentral.style.flex = '0 1 68%';
    btnToggleChat.classList.add('chat-fechado');
    btnToggleChat.innerHTML = '<img src="../img/icons/messenger.png" alt="" /> Mensagem';
  }

  if (btnToggleChat && chatPanel && conteudoDireita && conteudoCentral) {
    btnToggleChat.addEventListener('click', () => {
      if (chatVisivel) {
        esconderChat();
      } else {
        mostrarChat();
      }
    });
  }

  if (btnFecharChat) {
    btnFecharChat.addEventListener('click', (e) => {
      e.stopPropagation();
      if (chatVisivel) {
        esconderChat();
      }
    });
  }

  // ============================================
  // CHAT - DEMO DE ENVIO DE MENSAGEM
  // ============================================
  const chatForm = document.querySelector('.chat-input-form');
  const chatInput = document.querySelector('.chat-input');
  const chatMensagens = document.querySelector('.chat-mensagens');

  if (chatForm && chatInput && chatMensagens) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const texto = chatInput.value.trim();
      if (!texto) return;

      // Adiciona mensagem enviada
      const agora = new Date();
      const hora = agora.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const msgDiv = document.createElement('div');
      msgDiv.className = 'mensagem enviada';
      msgDiv.innerHTML = `
        <div class="mensagem-bolha">
          <p>${texto}</p>
          <span class="mensagem-hora">${hora}</span>
        </div>
      `;
      chatMensagens.appendChild(msgDiv);

      // Limpa input
      chatInput.value = '';

      // Scroll para baixo
      chatMensagens.scrollTop = chatMensagens.scrollHeight;

      // Simula resposta automática depois de 1s (demo)
      setTimeout(() => {
        const respostas = [
          'Entendido! Vou verificar e te retorno.',
          'Ok, combinado então!',
          'Perfeito, obrigado!',
          'Legal, avisarei quando tiver novidades.',
          'Certo, até mais!',
        ];
        const resposta =
          respostas[Math.floor(Math.random() * respostas.length)];
        const horaResposta = new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        });

        const respostaDiv = document.createElement('div');
        respostaDiv.className = 'mensagem recebida';
        respostaDiv.innerHTML = `
          <div class="mensagem-bolha">
            <p>${resposta}</p>
            <span class="mensagem-hora">${horaResposta}</span>
          </div>
        `;
        chatMensagens.appendChild(respostaDiv);
        chatMensagens.scrollTop = chatMensagens.scrollHeight;
      }, 1000);
    });
  }
});

// ============================================
// STORY VIEWER (estilo Instagram)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const storyViewer = document.getElementById('storyViewer');
  const storyMedia = document.getElementById('storyMedia');
  const storyProgress = document.getElementById('storyProgress');
  const storyViewerName = document.querySelector('.story-viewer-name');
  const storyViewerTime = document.querySelector('.story-viewer-time');
  const storyViewerAvatar = document.querySelector('.story-viewer-avatar');
  const storyNavPrev = document.querySelector('.story-nav-prev');
  const storyNavNext = document.querySelector('.story-nav-next');
  const storyViewerClose = document.querySelector('.story-viewer-close');
  const storyReplyForm = document.querySelector('.story-reply-form');
  const storyReplyInput = document.querySelector('.story-reply-input');
  const reactionBtns = document.querySelectorAll('.reaction-btn');

  // Dados dos stories (exemplo)
  const storiesData = [
    {
      id: 1,
      user: 'Amigos de Patas',
      avatar: '../img/woman.jpg',
      time: '2h atrás',
      media: '../img/cachorroSelfie.jpg',
      type: 'image'
    },
    {
      id: 2,
      user: 'Patinhas Felizes',
      avatar: '../img/isa.png',
      time: '4h atrás',
      media: '../img/cachorroSelfie.jpg',
      type: 'image'
    },
    {
      id: 3,
      user: 'Lar Doce Lar',
      avatar: '../img/julia.png',
      time: '6h atrás',
      media: '../img/cachorroSelfie.jpg',
      type: 'image'
    },
    {
      id: 4,
      user: 'Cão sem Dono',
      avatar: '../img/kat.png',
      time: '8h atrás',
      media: '../img/cachorroSelfie.jpg',
      type: 'image'
    }
  ];

  let currentStoryIndex = 0;
  let progressInterval = null;
  const STORY_DURATION = 5000; // 5 segundos por story

  // Elementos dos stories na lista
  const storyElements = document.querySelectorAll('.stories-lista .story:not(.story-add)');

  // Abrir story viewer
  function openStoryViewer(index) {
    currentStoryIndex = index;
    loadStory(currentStoryIndex);
    storyViewer.classList.add('active');
    document.body.style.overflow = 'hidden';
    startProgress();
  }

  // Fechar story viewer
  function closeStoryViewer() {
    storyViewer.classList.remove('active');
    document.body.style.overflow = '';
    stopProgress();
    resetProgress();
  }

  // Carregar story
  function loadStory(index) {
    const story = storiesData[index];
    if (!story) return;

    storyMedia.src = story.media;
    storyMedia.alt = `Story de ${story.user}`;
    storyViewerName.textContent = story.user;
    storyViewerTime.textContent = story.time;
    storyViewerAvatar.src = story.avatar;

    resetProgress();
    startProgress();
  }

  // Próximo story
  function nextStory() {
    if (currentStoryIndex < storiesData.length - 1) {
      currentStoryIndex++;
      loadStory(currentStoryIndex);
    } else {
      closeStoryViewer();
    }
  }

  // Story anterior
  function prevStory() {
    if (currentStoryIndex > 0) {
      currentStoryIndex--;
      loadStory(currentStoryIndex);
    }
  }

  // Progress bar
  function startProgress() {
    stopProgress();
    const bars = storyProgress.querySelectorAll('.story-progress-bar');
    if (bars[currentStoryIndex]) {
      const fill = bars[currentStoryIndex].querySelector('.story-progress-fill');
      if (fill) {
        fill.classList.add('active');
      }
    }
    progressInterval = setTimeout(() => {
      nextStory();
    }, STORY_DURATION);
  }

  function stopProgress() {
    if (progressInterval) {
      clearTimeout(progressInterval);
      progressInterval = null;
    }
    const bars = storyProgress.querySelectorAll('.story-progress-bar');
    bars.forEach(bar => {
      const fill = bar.querySelector('.story-progress-fill');
      if (fill) fill.classList.remove('active');
    });
  }

  function resetProgress() {
    stopProgress();
    // Recriar as barras de progresso
    storyProgress.innerHTML = '';
    storiesData.forEach((_, i) => {
      const bar = document.createElement('div');
      bar.className = 'story-progress-bar';
      bar.innerHTML = '<div class="story-progress-fill"></div>';
      storyProgress.appendChild(bar);
    });
  }

  // Event listeners
  storyElements.forEach((storyEl, index) => {
    storyEl.addEventListener('click', () => openStoryViewer(index));
  });

  storyNavNext.addEventListener('click', (e) => {
    e.stopPropagation();
    nextStory();
  });

  storyNavPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    prevStory();
  });

  storyViewerClose.addEventListener('click', closeStoryViewer);

  // Fechar ao clicar fora do conteúdo
  storyViewer.addEventListener('click', (e) => {
    if (e.target === storyViewer) {
      closeStoryViewer();
    }
  });

  // Navegação por teclado
  document.addEventListener('keydown', (e) => {
    if (!storyViewer.classList.contains('active')) return;

    switch (e.key) {
      case 'ArrowRight':
        nextStory();
        break;
      case 'ArrowLeft':
        prevStory();
        break;
      case 'Escape':
        closeStoryViewer();
        break;
      case ' ':
        // Pausar/continuar com espaço
        e.preventDefault();
        if (progressInterval) {
          stopProgress();
        } else {
          startProgress();
        }
        break;
    }
  });

  // Pausar progresso ao hover no conteúdo
  const storyContent = document.querySelector('.story-viewer-content');
  if (storyContent) {
    storyContent.addEventListener('mouseenter', stopProgress);
    storyContent.addEventListener('mouseleave', startProgress);
  }

  // Formulário de resposta
  if (storyReplyForm) {
    storyReplyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = storyReplyInput.value.trim();
      if (message) {
        alert(`Resposta enviada: "${message}"`);
        storyReplyInput.value = '';
      }
    });
  }

  // Reações
  reactionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const reaction = btn.dataset.reaction;
      btn.style.transform = 'scale(1.3)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 200);
      // Aqui você pode adicionar lógica para enviar a reação para o backend
      console.log('Reação:', reaction);
    });
  });

  // Inicializar barras de progresso
  resetProgress();
});
