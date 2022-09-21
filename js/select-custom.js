const themeContainer = document.querySelector('.theme-container');
const selected = document.querySelector('#selected');
const themeList = document.querySelector('.theme-list');
const themeName = document.querySelectorAll('.theme-name');

let inicialText = 'Escolha um tema';
selected.innerHTML = inicialText;

// seleciona o primeiro item (themeName[0]) da lista para o tema padrão
let defaultTheme = themeName[0].children[0].id;

// cria identificação dataset padrão no selected
selected.setAttribute('data-theme-name', defaultTheme);

// abrir ou fechar o theme-list
selected.addEventListener('click', () => {
   themeList.classList.toggle('open');
   selected.classList.toggle('up-arrow');

   selected.style.color = 'var(--color-text)';
   selected.style.border = '2px solid var(--color-hover)';
});

// insere o nome escolhido (com id para o dataset) no select
themeName.forEach((name) => {
   let themeInput = name.querySelector('input');
   // adiciona listner somente ao input[radio] (name.children[0])
   themeInput.addEventListener('click', () => {
      // modifica a identificação dataset padrão do selected
      selected.setAttribute('data-theme-name', themeInput.id);

      selected.innerHTML = name.querySelector('label').innerHTML;
      themeList.classList.remove('open');
      selected.classList.remove('up-arrow');

      selected.style.color = 'var(--color-text)';
   });
});

// fechar theme-list ao clicar fora do theme-container
document.addEventListener('click', (event) => {
   // verifica se não foi encontrado (indexOf == -1)
   // dentro do caminho do evento (composedPath) o themeContainer
   if (event.composedPath().indexOf(themeContainer) === -1) {
      // fecha o select e remove os estilos inline recebidos ao abrir
      themeList.classList.remove('open');
      selected.classList.remove('up-arrow');
      selected.removeAttribute('style');

      if (selected.innerHTML === inicialText) {
         selected.style.color = 'var(--color-opacity)';
      } else {
         selected.style.color = 'var(--color-text)';
      }
   }
});
