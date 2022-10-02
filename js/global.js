const logoutEl = document.querySelector('#logout');
const targetBlank = document.querySelectorAll("a[target='_blank']");

/**
 * ADICIONA ÍCONE AOS LINKS COM TARGET BLANK
 */
for (let i = 0; i < targetBlank.length; i++) {
   targetBlank[i].innerHTML += '<i class="ph-arrow-square-out"></i>';
}

/**
 * REMOVE TODOS OS DADOS GRAVADOS NO LOCALSTORAGE
 * REDIRECIONA PARA A PÁGINA DE LOGIN
 */
const clearLocalStorage = () => {
   localStorage.clear();

   window.location = '../index.html';
};

if (logoutEl) logoutEl.addEventListener('click', clearLocalStorage);

/**
 * RECARREGA A PÁGINA
 */
const reloadPage = (btn) => {
   btn.addEventListener('click', () => {
      window.location.reload();
   });
};
