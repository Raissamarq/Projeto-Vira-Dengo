const botoesPlano = document.querySelectorAll('.btn-plano');

const cardsPlano = document.querySelectorAll('.card-plano');

const textoPlanoSelecionado = document.querySelector('#plano-selecionado');

botoesPlano.forEach(function (botao) {
  botao.addEventListener('click', function () {
    cardsPlano.forEach(function (card) {
      card.classList.remove('selecionado');
    });

    const cardAtual = botao.closest('.card-plano');

    cardAtual.classList.add('selecionado');

    const plano = botao.dataset.plano;

    textoPlanoSelecionado.textContent = 'Plano selecionado: ' + plano;
  });
});
