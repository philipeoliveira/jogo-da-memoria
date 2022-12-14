const playerEl = document.querySelector('#player');
const themeEl = document.querySelector('#theme');
const attemptCounterText = document.querySelector('#attempt-counter');
const timer = document.querySelector('#timer');
const reloadBtn = document.querySelector('#btn-reload');
const gameFeedback = document.querySelector('.game-feedback');
const gameFeedbackText = document.querySelector('.game-feedback p');
const gameFeedbackIcon = document.querySelector('.game-feedback i');
const gridCards = document.querySelector('.grid-cards');

const audioBtn = document.querySelector('#btn-audio');
const successAudio = document.querySelector('#success-audio');
const errorAudio = document.querySelector('#error-audio');

let player = localStorage.getItem('player');
let cardThemeId = localStorage.getItem('themeId');
let cardThemeName = localStorage.getItem('themeName');

let firstCard = '';
let secondCard = '';

//posição e rótulo das cartas no grid
let cardPosition = 0;
let firstCardAriaLabel;
let secondCardAriaLabel;

let alertTime = '29:00'; // 29:00
let limitTime = '30:00'; // 30:00

// contador de tentativas
let attemptCounter = 0;

let totalCards = 10;

/**
 * NOMES DOS ARQUIVOS DE IMAGEM
 */
const cardImages = [];
for (let i = 1; i <= totalCards; i++) {
   cardImages.push(`card-${i}`);
}

const createElement = (tag, className) => {
   const element = document.createElement(tag);
   element.className = className;
   return element;
};

/**
 * CURSOR PADRÃO PARA AS CARTAS REVELADAS,
 * CARTAS DESABILITADAS DEPOIS DO TEMPO LIMITE,
 * CURSOR POINTER QUANDO A CARTA NÃO ESTÁ REVELADA,
 * OUTLINE NO HOVER DAS CARTAS NÃO REVELADAS
 */
const handleCardHover = (cards) => {
   if (timer.innerHTML >= limitTime) {
      cards.forEach((card) => {
         card.classList.remove('handle-card-hover');
         card.classList.add('disabled-card');
      });
   } else {
      cards.forEach((card) => {
         // se a carta estiver revelada
         if (card.className.includes('reveal-card')) {
            card.classList.remove('handle-card-hover');
         } else {
            card.classList.add('handle-card-hover');
         }
      });
   }
};

/**
 * MENSAGEM FINAL
 */
const finalMessage = (icon, message, borderColor, textColor) => {
   setTimeout(() => {
      gameFeedback.style.animation = 'fade-in 1.5s ease';
      gameFeedback.style.border = `2px solid ${borderColor}`;
      gameFeedback.style.color = `${textColor}`;
      gameFeedbackIcon.setAttribute('class', `${icon}`);
      gameFeedbackText.innerHTML = `${message}`;
   }, 400);
};

/**
 * VERIFICA E TRATA O FIM DO JOGO
 */
const checkEndGame = () => {
   const disabledCards = document.querySelectorAll('.disabled-card');
   const confetti = document.querySelector('#confetti-canvas');

   // verifica se a quantidade de cartas desabilitadas é igual ao total de cartas
   // garante que essa mensagem só será mostrada dentro do tempo limite
   if (
      disabledCards.length === cardImages.length * 2 &&
      timer.innerHTML < limitTime
   ) {
      // limpa a contagem do tempo do jogo
      clearInterval(loop);

      setTimeout(() => {
         // mostra cards desabilitados em cores
         disabledCards.forEach((disabledCard) => {
            disabledCard.classList.remove('disabled-card');
         });

         // leva para o topo da tela suavemente
         window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

         finalMessage(
            'ph-trophy',
            `Você venceu! Parabéns, ${player}!`,
            'var(--color-hover)',
            'var(--color-primary)'
         );

         // habilita os confetes
         confetti.classList.add('active');

         // insere efeito shake no botão que reinicia o jogo
         reloadBtn.classList.add('shake');
      }, 200);

      // mensagem de fim do jogo para o leitor de tela
      gameFeedbackText.focus();

      // zera a contagem de tentativas de match
      attemptCounter = 0;
   }
};

/**
 * LIGA OU DESLIGA O AUDIO
 */
const AudioOnOff = () => {
   audioBtn.addEventListener('click', () => {
      if (successAudio.muted == true) {
         // habilita audio
         successAudio.muted = false;
         errorAudio.muted = false;
         audioBtn.children[0].classList.remove('ph-speaker-x');
         audioBtn.children[0].classList.add('ph-speaker-high');
         audioBtn.setAttribute('title', 'Desligar áudio do jogo');
         audioBtn.removeAttribute('style');
      } else {
         // desabilita audio
         successAudio.muted = true;
         errorAudio.muted = true;
         audioBtn.children[0].classList.remove('ph-speaker-high');
         audioBtn.children[0].classList.add('ph-speaker-x');
         audioBtn.setAttribute('title', 'Ligar áudio do jogo');
         audioBtn.style.backgroundColor = 'var(--color-disabled)';
      }
   });
};

/**
 * VERIFICA SE AS CARTAS SÃO IGUAIS (MATCH),
 * REALIZA AÇÃO CORRESPONDENTE,
 * CHAMA A FUNÇÃO QUE VERIFICA O FIM DO JOGO
 */
const checkCards = () => {
   const firstImage = firstCard.getAttribute('data-card-image');
   const secondImage = secondCard.getAttribute('data-card-image');

   if (firstImage === secondImage) {
      // desabilita porque SÃO IGUAIS
      firstCard.firstChild.classList.add('disabled-card');
      secondCard.firstChild.classList.add('disabled-card');

      // toca o audio de sucesso se som estiver habilitado
      !successAudio.muted && successAudio.play();

      // desabilita o acesso via tecla tab da front face
      firstCard.firstChild.removeAttribute('tabindex');
      secondCard.firstChild.removeAttribute('tabindex');

      // zera as variáveis permitindo uma nova rodada
      firstCard = '';
      secondCard = '';

      setTimeout(() => {
         // verifica se é o fim do jogo
         checkEndGame();
      }, 1000);
   } else {
      // esconde as cartas novamente porque SÃO DIFERENTES
      setTimeout(() => {
         firstCard.classList.remove('reveal-card');
         secondCard.classList.remove('reveal-card');

         // toca o audio de erro se som estiver habilitado
         !errorAudio.muted && errorAudio.play();

         handleCardHover([firstCard, secondCard]);

         // habilita o acesso via tecla tab da front face
         firstCard.firstChild.setAttribute('tabindex', 0);
         secondCard.firstChild.setAttribute('tabindex', 0);

         // remove as tags de aviso ao leitor de tela para não acumular mudanças
         firstCard.removeAttribute('role');
         firstCard.removeAttribute('aria-live');
         secondCard.removeAttribute('role');
         secondCard.removeAttribute('aria-live');

         // reinicia o label somente com a posição da carta e sem o número dela revelado
         firstCard.firstChild.setAttribute('aria-label', firstCardAriaLabel);
         secondCard.firstChild.setAttribute('aria-label', secondCardAriaLabel);

         // zera as variáveis permitindo uma nova rodada
         firstCard = '';
         secondCard = '';
      }, 1000);
   }
};

/**
 * ARMAZENA TENTATIVAS DE MATCH,
 * INFORMA QUANTIDADE DE TENTATIVAS
 */
const handleAttemptCounter = () => {
   attemptCounter = attemptCounter + 1;

   attemptCounterText.innerHTML =
      attemptCounter === 1
         ? `${attemptCounter} tentativa`
         : `${attemptCounter} tentativas`;
};

/**
 * LIDA COM A REVELAÇÃO DAS CARTAS,
 * CHAMA A FUNÇÃO QUE TRATA DAS TENTATIVAS DE MATCH,
 * CHAMA A FUNÇÃO QUE VERIFICA O MATCH
 */
const handleRevealCard = (event) => {
   let cardImage;
   let cardImageNumber;

   if (event.type === 'click' || event.key === 'Enter') {
      // garante que NÃO VIRA se já estiver revelada
      // ou que NÃO REVELA se o limite de tempo já estiver sido atingido
      if (
         event.target.parentNode.className.includes('reveal-card') ||
         timer.innerHTML >= limitTime
      ) {
         return;
      }

      // verifica qual é a carta, REVELA e armazena
      // target.classList[0] !== 'card' corrige bug do clique arrastado sobre o li
      if (firstCard === '' && event.target.classList[0] !== 'card') {
         firstCard = event.target.parentNode;
         firstCard.classList.add('reveal-card');
         // o leitor de tela é avisado quando houver alteração no elemento
         firstCard.setAttribute('role', 'status');
         firstCard.setAttribute('aria-live', 'polite');

         // disponibiliza para o leitor de tela o número da carta revelada
         cardImage = firstCard.dataset.cardImage;
         cardImageNumber = cardImage.substring(cardImage.lastIndexOf('-') + 1);
         firstCardAriaLabel = event.target.ariaLabel;
         firstCard.children[0].setAttribute(
            'aria-label',
            'A ' +
               firstCardAriaLabel +
               ' é a Carta de número ' +
               cardImageNumber
         );
      } else if (secondCard === '' && event.target.classList[0] !== 'card') {
         secondCard = event.target.parentNode;
         secondCard.classList.add('reveal-card');
         // o leitor de tela é avisado quando houver alteração no elemento
         secondCard.setAttribute('role', 'status');
         secondCard.setAttribute('aria-live', 'polite');

         // disponibiliza para o leitor de tela o número da carta revelada
         cardImage = secondCard.dataset.cardImage;
         cardImageNumber = cardImage.substring(cardImage.lastIndexOf('-') + 1);
         secondCardAriaLabel = event.target.ariaLabel;
         secondCard.children[0].setAttribute(
            'aria-label',
            'A ' +
               secondCardAriaLabel +
               ' é a carta de número ' +
               cardImageNumber
         );

         handleAttemptCounter();

         checkCards();
      }

      if (event.target.classList[0] !== 'card') {
         handleCardHover([event.target.parentNode]);
      }
   }
};

/**
 * CRIA AS CARTAS COM AS FACES,
 * IDENTIFICA AS CARTAS
 */
const createCard = (cardImage) => {
   const cardItem = createElement('li', 'card handle-card-hover');
   const frontFace = createElement('div', 'face front-face');
   const backFace = createElement('div', 'face back-face');

   cardItem.appendChild(frontFace);
   cardItem.appendChild(backFace);

   // cria a imagem frontal da carta
   frontFace.style.backgroundImage = `url(../images/${cardThemeId}/${cardImage}.png)`;

   // cria identificação para cada carta
   cardItem.setAttribute('data-card-image', cardImage);

   // cria recursos para acessibilidade via teclado
   cardPosition = cardPosition + 1;
   frontFace.setAttribute('aria-label', 'Carta na posição ' + cardPosition);
   frontFace.setAttribute('tabindex', 0);

   cardItem.addEventListener('keyup', handleRevealCard);

   cardItem.addEventListener('click', handleRevealCard);

   return cardItem;
};

/**
 * DUPLICA E GERA AS CARTAS EM ORDEM ALEATÓRIA
 */
const loadGame = () => {
   const duplicateImages = [...cardImages, ...cardImages];
   const shuffledImages = duplicateImages.sort(() => Math.random() - 0.5);

   shuffledImages.forEach((cardImage) => {
      const card = createCard(cardImage);
      gridCards.appendChild(card);
   });
};

/**
 * FORMATA O TIMER
 */
const formatTimer = (timerInMs) => {
   const seconds = parseInt((timerInMs / 1000) % 60);
   const minutes = parseInt((timerInMs / (1000 * 60)) % 60);

   if (minutes > 0) {
      return `${minutes.toString().padStart(2, '0')}:${seconds
         .toString()
         .padStart(2, '0')}`;
   }
   if (seconds > 0) {
      return `00:${seconds.toString().padStart(2, '0')}`;
   }

   // estado inicial do timer
   return '00:00';
};

/**
 * AÇÕES PARA O TEMPO MÁXIMO DE JOGO
 */
const checkTimeLimit = () => {
   // insere efeitos visuais para alertar a proximidade do tempo limite
   if (timer.innerHTML > alertTime) {
      timer.classList.add('text-alert');
      gridCards.classList.add('box-alert');
   }

   // tempo limite
   if (timer.innerHTML === limitTime) {
      const cardsHover = document.querySelectorAll('.handle-card-hover');

      // parando o timer
      clearInterval(loop);

      // remove os efeitos de hover das cartas
      handleCardHover(cardsHover);

      setTimeout(() => {
         // remove os efeitos visuais do tempo limite
         timer.classList.remove('text-alert');
         gridCards.classList.remove('box-alert');
         // adiciona cor de alerta ao timer
         timer.style.color = 'var(--color-hover)';

         // leva para o topo da tela suavemente
         window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

         finalMessage(
            'ph-smiley-sad',
            'Tempo esgotado... <a href="./game.html" title="Reiniciar o jogo">Tente novamente!</a>',
            'var(--color-hover)',
            'var(--color-hover)'
         );
      }, 200);

      // mensagem de fim do jogo para o leitor de tela
      gameFeedbackText.focus();

      // zera a contagem de tentativas de match
      attemptCounter = 0;
   }
};

/**
 * TIMER DO JOGO
 */
const timerOn = () => {
   // cria número de milisegundos decorridos desde 1/1/1970
   const startTimer = Date.now();

   // insere no this uma chave chamada loop para recuperá-la externamente
   this.loop = setInterval(() => {
      timer.innerHTML = formatTimer(Date.now() - startTimer);

      checkTimeLimit();
   }, 100);
};

/**
 * MOSTRA MENSAGEM INICIAL AO JOGADOR,
 * DEFINE TEMA PADRÃO,
 * CARREGA O TIMER,
 * CARREGA TODAS AS CARTAS DO JOGO
 */
window.onload = () => {
   if (!player) {
      player = 'Anônimo';
   }
   // quando o localStorage estiver vazio
   if (!cardThemeId) {
      cardThemeId = 'programacao';
   }
   if (!cardThemeName) {
      cardThemeName = 'Programação';
   }

   playerEl.innerHTML = player;
   playerEl.setAttribute('title', player);
   themeEl.innerHTML = cardThemeName;
   themeEl.setAttribute('title', cardThemeName);

   if (window.location.pathname === '/pages/game.html') {
      timerOn();
      loadGame();
      reloadPage(reloadBtn);
      AudioOnOff();
   }
};
