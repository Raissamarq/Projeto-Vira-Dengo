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
  const chatPanel = document.querySelector('.chat-panel');
  const conteudoDireita = document.querySelector('.conteudo-direita');
  const conteudoCentral = document.querySelector('.conteudo-central');
  const conteudoGeral = document.querySelector('.conteudo-geral');

  if (btnToggleChat && chatPanel && conteudoDireita && conteudoCentral) {
    let chatVisivel = true;

    btnToggleChat.addEventListener('click', () => {
      chatVisivel = !chatVisivel;

      if (chatVisivel) {
        chatPanel.style.display = 'flex';
        conteudoDireita.style.display = 'flex';
        conteudoDireita.style.flex = '0 1 28%';
        conteudoCentral.style.flex = '0 1 40%';
        btnToggleChat.classList.remove('chat-fechado');
        btnToggleChat.innerHTML = '<img src="../img/icons/messenger.png" alt="" /> Mensagem';
      } else {
        chatPanel.style.display = 'none';
        conteudoDireita.style.display = 'none';
        conteudoDireita.style.flex = '0 1 0%';
        conteudoCentral.style.flex = '0 1 68%';
        btnToggleChat.classList.add('chat-fechado');
        btnToggleChat.innerHTML = '<img src="../img/icons/messenger.png" alt="" /> Mensagem';
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
