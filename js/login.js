const form = document.querySelector('.login-form');
const playerInput = document.querySelector('.login-form #player');
const placeholder = playerInput.placeholder;
const selectedInput = document.querySelector('.login-form #selected');
const btn = document.querySelector('.login-form button');

/**
 * VALIDAÇÃO DE CARACTERES PARA HABILITAR BOTÃO SUBMIT
 */
const validateInput = ({ target }) => {
   if (target.value.trim().length > 1) {
      btn.removeAttribute('disabled');
      btn.classList.add('active');
   } else {
      btn.setAttribute('disabled', '');
      btn.removeAttribute('class');
   }
};

/**
 * GRAVA NO LOCALSTORAGE O NOME DO PLAYER,
 * E O ID DO TEMA ESCOLHIDO (RECEBIDO POR DATASET),
 * ACESSA PÁGINA DO JOGO
 */
const handleSubmit = (event) => {
   event.preventDefault();
   localStorage.setItem('player', playerInput.value);
   localStorage.setItem('theme', selectedInput['dataset'].themeName);
   window.location = 'pages/game.html';
};

// lidando com placeholder
playerInput.addEventListener('focus', () => (playerInput.placeholder = ''));
playerInput.addEventListener(
   'focusout',
   () => (playerInput.placeholder = placeholder)
);

playerInput.addEventListener('input', validateInput);

form.addEventListener('submit', handleSubmit);
