document.addEventListener('DOMContentLoaded', () => {
  const etapas = document.querySelectorAll('.form-step');
  const btnsProximo = document.querySelectorAll('.btn-proximo');
  const btnsVoltar = document.querySelectorAll('.btn-voltar-etapa');
  const form = document.querySelector('.form-cadastro-usuario');
  const progressBar = document.querySelector('.progresso-etapas__barra');
  const progressItems = document.querySelectorAll('.progresso-etapas__item');
  const telaSucesso = document.querySelector('.tela-sucesso');
  const emailConfirmacao = document.getElementById('emailConfirmacao');

  let etapaAtual = 1;
  const totalEtapas = 2;

  // ============================================
  // POPULAR ESTADOS (UF) - se houver campo estado
  // ============================================
  const selectEstado = document.getElementById('estado');
  if (selectEstado) {
    const estados = [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
      'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
      'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];
    estados.forEach(uf => {
      const option = document.createElement('option');
      option.value = uf;
      option.textContent = uf;
      selectEstado.appendChild(option);
    });
  }

  // ============================================
  // MÁSCARAS DE INPUT (CPF / TELEFONE)
  // ============================================
  function aplicarMascara(input, mascara) {
    let valor = input.value.replace(/\D/g, '');

    switch (mascara) {
      case 'cpf':
        // 000.000.000-00 (máx 11 dígitos)
        valor = valor.substring(0, 11);
        if (valor.length <= 3) {
          valor = valor;
        } else if (valor.length <= 6) {
          valor = valor.replace(/(\d{3})(\d+)/, '$1.$2');
        } else if (valor.length <= 9) {
          valor = valor.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
        } else {
          valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
        }
        break;

      case 'telefone':
        // (00) 00000-0000 (máx 11 dígitos)
        valor = valor.substring(0, 11);
        if (valor.length <= 2) {
          valor = valor.replace(/(\d{0,2})/, '($1');
        } else if (valor.length <= 7) {
          valor = valor.replace(/(\d{2})(\d+)/, '($1) $2');
        } else {
          valor = valor.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
        }
        break;
    }

    input.value = valor;
  }

  // Aplicar máscaras nos campos com data-mask
  document.querySelectorAll('[data-mask]').forEach(input => {
    const maskType = input.dataset.mask;

    input.addEventListener('input', () => {
      aplicarMascara(input, maskType);
    });

    // Permitir colar e aplicar máscara depois
    input.addEventListener('paste', (e) => {
      setTimeout(() => {
        aplicarMascara(input, maskType);
      }, 0);
    });

    // Formatar valor inicial se já tiver valor
    if (input.value) {
      aplicarMascara(input, maskType);
    }
  });

  // ============================================
  // ÁREAS DE UPLOAD (clique abre o seletor de arquivo)
  // ============================================
  function configurarUpload(areaId, inputId) {
    const area = document.getElementById(areaId);
    const input = document.getElementById(inputId);
    if (!area || !input) return;

    const textoOriginal = area.querySelector('.upload-area__texto').innerHTML;
    const ajudaOriginal = area.querySelector('.upload-area__ajuda').textContent;

    area.addEventListener('click', () => input.click());

    input.addEventListener('change', () => {
      const arquivos = Array.from(input.files);
      const textoEl = area.querySelector('.upload-area__texto');
      const ajudaEl = area.querySelector('.upload-area__ajuda');

      if (arquivos.length === 0) {
        textoEl.innerHTML = textoOriginal;
        ajudaEl.textContent = ajudaOriginal;
        area.classList.remove('tem-arquivo');
        return;
      }

      area.classList.add('tem-arquivo');

      if (arquivos.length === 1) {
        textoEl.textContent = arquivos[0].name;
      } else {
        textoEl.textContent = `${arquivos.length} arquivos selecionados`;
      }
      ajudaEl.textContent = 'Clique para alterar';
    });
  }

  configurarUpload('uploadFoto', 'fotoPerfil');

  // ============================================
  // VALIDAÇÃO DE SENHA
  // ============================================
  const senha = document.getElementById('senha');
  const confirmarSenha = document.getElementById('confirmarSenha');
  let erroSenhaEl = document.getElementById('erroSenha');

  function validarSenhas() {
    if (!senha || !confirmarSenha) return true;

    if (confirmarSenha.value && senha.value !== confirmarSenha.value) {
      if (!erroSenhaEl) {
        erroSenhaEl = document.createElement('p');
        erroSenhaEl.id = 'erroSenha';
        erroSenhaEl.style.color = '#d32f2f';
        erroSenhaEl.style.fontSize = '12px';
        erroSenhaEl.style.marginTop = '4px';
        confirmarSenha.parentNode.appendChild(erroSenhaEl);
      }
      erroSenhaEl.textContent = 'As senhas não coincidem.';
      erroSenhaEl.hidden = false;
      confirmarSenha.setCustomValidity('As senhas não coincidem.');
      return false;
    }

    if (erroSenhaEl) {
      erroSenhaEl.hidden = true;
    }
    confirmarSenha.setCustomValidity('');
    return true;
  }

  if (senha && confirmarSenha) {
    senha.addEventListener('input', validarSenhas);
    confirmarSenha.addEventListener('input', validarSenhas);
  }

  // ============================================
  // NAVEGAÇÃO ENTRE ETAPAS
  // ============================================
  function atualizarProgresso(numero) {
    // Atualiza a barra de progresso
    if (progressBar) {
      progressBar.setAttribute('data-progress', numero);
      progressBar.setAttribute('aria-valuenow', numero);
    }

    // Atualiza os itens de progresso
    progressItems.forEach(item => {
      const step = Number(item.dataset.step);
      item.classList.remove('ativo', 'concluido');

      if (step === numero) {
        item.classList.add('ativo');
      } else if (step < numero) {
        item.classList.add('concluido');
      }
    });
  }

  function mostrarEtapa(numero) {
    if (numero < 1 || numero > totalEtapas) return;

    etapas.forEach(etapa => {
      etapa.classList.toggle('ativo', Number(etapa.dataset.step) === numero);
    });

    atualizarProgresso(numero);
    etapaAtual = numero;

    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validarEtapaAtual() {
    const etapaAtiva = document.querySelector(`.form-step[data-step="${etapaAtual}"]`);
    const camposObrigatorios = etapaAtiva.querySelectorAll('[required]');

    for (const campo of camposObrigatorios) {
      if (!campo.checkValidity()) {
        campo.reportValidity();
        return false;
      }
    }

    // Validação extra de senha na etapa de credenciais
    if (etapaAtual === 2 && !validarSenhas()) {
      confirmarSenha.reportValidity();
      return false;
    }

    return true;
  }

  btnsProximo.forEach(botao => {
    botao.addEventListener('click', () => {
      if (!validarEtapaAtual()) return;
      if (etapaAtual < totalEtapas) {
        mostrarEtapa(etapaAtual + 1);
      }
    });
  });

  btnsVoltar.forEach(botao => {
    botao.addEventListener('click', () => {
      if (etapaAtual > 1) {
        mostrarEtapa(etapaAtual - 1);
      }
    });
  });

  // ============================================
  // SUBMIT DO FORMULÁRIO
  // ============================================
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validarEtapaAtual()) return;

    // Coleta os dados do formulário
    const formData = new FormData(form);
    const emailUsuario = formData.get('email');

    // Simula envio (aqui você faria a chamada real para a API)
    const btnSubmit = form.querySelector('.btn-continuar');
    const textoOriginal = btnSubmit.innerHTML;
    btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
    btnSubmit.disabled = true;

    try {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Esconde o formulário e mostra a tela de sucesso
      form.hidden = true;
      telaSucesso.hidden = false;

      // Preenche o e-mail de confirmação
      if (emailConfirmacao && emailUsuario) {
        emailConfirmacao.textContent = emailUsuario;
      }

      // Atualiza progresso para completo
      atualizarProgresso(totalEtapas);

      // Scroll para o topo da tela de sucesso
      telaSucesso.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Ocorreu um erro ao realizar o cadastro. Tente novamente.');
    } finally {
      btnSubmit.innerHTML = textoOriginal;
      btnSubmit.disabled = false;
    }
  });

  // Inicializa o progresso
  atualizarProgresso(1);
});