const logoutEl = document.querySelector('#logout');

/**
 * REMOVE TODOS OS DADOS GRAVADOS NO LOCALSTORAGE
 * REDIRECIONA PARA A PÁGINA DE LOGIN
 */
const clearLocalStorage = () => {
   localStorage.clear();

   window.location = '../index.html';
};

logoutEl.addEventListener('click', clearLocalStorage);

/**
 * RECARREGA A PÁGINA
 */
const reloadPage = (btn) => {
   btn.addEventListener('click', () => {
      window.location.reload();
   });
};
