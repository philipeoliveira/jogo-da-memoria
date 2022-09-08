const input = document.querySelector('.login-form input');
const placeholder = input.placeholder;
const btn = document.querySelector('.login-form button');
const form = document.querySelector('.login-form');

const validateInput = ({ target }) => {
   if (target.value.length > 1) {
      btn.removeAttribute('disabled');
      btn.classList.add('active');
   } else {
      btn.setAttribute('disabled', '');
      btn.removeAttribute('class');
   }
};

const handleSubmit = (event) => {
   event.preventDefault();
   localStorage.setItem('player', input.value);
   window.location = 'pages/game.html';
};

input.addEventListener('focus', () => (input.placeholder = ''));
input.addEventListener('focusout', () => (input.placeholder = placeholder));

input.addEventListener('input', validateInput);

form.addEventListener('submit', handleSubmit);
