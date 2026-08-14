document.addEventListener('DOMContentLoaded', () => {
  const etapas = document.querySelectorAll('.form-step');
  const btnsProximo = document.querySelectorAll('.btn-proximo');
  const btnsVoltar = document.querySelectorAll('.btn-voltar-etapa');
  const form = document.querySelector('.form-cadastro-prestador');
  const progressBar = document.querySelector('.progresso-etapas__barra');
  const progressFill = document.querySelector('.progresso-etapas__preenchimento');
  const progressItems = document.querySelectorAll('.progresso-etapas__item');
  const telaSucesso = document.querySelector('.tela-sucesso');
  const emailConfirmacao = document.getElementById('emailConfirmacao');

  let etapaAtual = 1;
  const totalEtapas = etapas.length;

  // ============================================
  // MÁSCARAS DE INPUT (CPF / TELEFONE)
  // ============================================
  function aplicarMascara(input, mascara) {
    let valor = input.value.replace(/\D/g, '');

    switch (mascara) {
      case 'cpf':
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

  document.querySelectorAll('[data-mask]').forEach((input) => {
    const maskType = input.dataset.mask;

    input.addEventListener('input', () => aplicarMascara(input, maskType));
    input.addEventListener('paste', (e) => {
      setTimeout(() => aplicarMascara(input, maskType), 0);
    });
    if (input.value) aplicarMascara(input, maskType);
  });

  // ============================================
  // MULTI-SELECT "COM O QUE VOCÊ TRABALHA?"
  // ============================================
  const multiSelect = document.getElementById('areasAtuacao');

  if (multiSelect) {
    const toggle = multiSelect.querySelector('.multi-select__toggle');
    const painel = multiSelect.querySelector('.multi-select__painel');
    const texto = multiSelect.querySelector('.multi-select__texto');
    const checkboxes = multiSelect.querySelectorAll('input[type="checkbox"]');

    function atualizarTexto() {
      const selecionadas = Array.from(checkboxes).filter((c) => c.checked);

      if (selecionadas.length === 0) {
        texto.textContent = 'Selecione suas áreas de atuação';
        texto.classList.remove('preenchido');
      } else if (selecionadas.length === 1) {
        texto.textContent =
          selecionadas[0].closest('.multi-select__opcao').textContent.trim();
        texto.classList.add('preenchido');
      } else {
        texto.textContent = `${selecionadas.length} áreas selecionadas`;
        texto.classList.add('preenchido');
      }
    }

    toggle.addEventListener('click', () => {
      const abrir = painel.hidden;
      painel.hidden = !abrir;
      multiSelect.classList.toggle('aberto', abrir);
    });

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', atualizarTexto);
    });

    document.addEventListener('click', (e) => {
      if (!multiSelect.contains(e.target)) {
        painel.hidden = true;
        multiSelect.classList.remove('aberto');
      }
    });
  }

  // ============================================
  // CONTADOR DE CARACTERES DA DESCRIÇÃO
  // ============================================
  const descricao = document.getElementById('descricaoTrabalho');
  const contador = document.getElementById('contDescricao');

  if (descricao && contador) {
    descricao.addEventListener('input', () => {
      contador.textContent = descricao.value.length;
    });
  }

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
  configurarUpload('uploadPortfolio', 'portfolio');

  // ============================================
  // VALIDAÇÃO DE SENHA
  // ============================================
  const senha = document.getElementById('senha');
  const confirmarSenha = document.getElementById('confirmarSenha');
  const erroSenha = document.getElementById('erroSenha');

  function validarSenhas() {
    if (!senha || !confirmarSenha) return true;

    if (confirmarSenha.value && senha.value !== confirmarSenha.value) {
      erroSenha.hidden = false;
      confirmarSenha.setCustomValidity('As senhas não coincidem.');
      return false;
    }

    erroSenha.hidden = true;
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
    if (progressFill) {
      const percentual = ((numero - 1) / (totalEtapas - 1)) * 100;
      progressFill.style.width = `${percentual}%`;
    }

    if (progressBar) {
      progressBar.setAttribute('aria-valuenow', numero);
    }

    progressItems.forEach((item) => {
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

    etapas.forEach((etapa) => {
      etapa.classList.toggle('ativo', Number(etapa.dataset.step) === numero);
    });

    atualizarProgresso(numero);
    etapaAtual = numero;

    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validarEtapaAtual() {
    // Etapa de Credenciais avança independente do preenchimento
    if (etapaAtual === 2) return true;

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

  btnsProximo.forEach((botao) => {
    botao.addEventListener('click', () => {
      if (!validarEtapaAtual()) return;
      if (etapaAtual < totalEtapas) {
        mostrarEtapa(etapaAtual + 1);
      }
    });
  });

  btnsVoltar.forEach((botao) => {
    botao.addEventListener('click', () => {
      if (etapaAtual > 1) {
        mostrarEtapa(etapaAtual - 1);
      }
    });
  });

  // ============================================
  // SUBMIT DO FORMULÁRIO
  // ============================================
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validarEtapaAtual()) return;

      const formData = new FormData(form);
      const emailPrestador = formData.get('email');

      const btnSubmit = form.querySelector('.btn-continuar');
      const textoOriginal = btnSubmit.innerHTML;
      btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
      btnSubmit.disabled = true;

      try {
        // Simula delay de rede
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Esconde o formulário e a barra de progresso, mostra a tela de sucesso
        form.hidden = true;
        document.querySelector('.progresso-etapas').hidden = true;
        telaSucesso.hidden = false;

        if (emailConfirmacao && emailPrestador) {
          emailConfirmacao.textContent = emailPrestador;
        }

        atualizarProgresso(totalEtapas);

        telaSucesso.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (error) {
        console.error('Erro ao cadastrar:', error);
        alert('Ocorreu um erro ao realizar o cadastro. Tente novamente.');
      } finally {
        btnSubmit.innerHTML = textoOriginal;
        btnSubmit.disabled = false;
      }
    });
  }

  // Inicializa o progresso
  atualizarProgresso(1);
});
