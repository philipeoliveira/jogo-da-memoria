const themeContainer = document.querySelector('.theme-container');
const selected = document.querySelector('#selected');
const themeList = document.querySelector('.theme-list');

let inicialText = 'Escolha um tema';
selected.innerHTML = inicialText;

/**
 * NOMES DOS DIRETÓRIOS DOS TEMAS USADOS COMO ID
 */
const themeProps = [
   { id: 'profissoes', name: 'Profissões' },
   { id: 'animais', name: 'Animais' },
   { id: 'baralho', name: 'Baralho' },
   { id: 'programacao', name: 'Programação' },
];

// seleciona o primeiro item da lista para o tema padrão,
// evitando enviar undefined para o localStorage
let defaultTheme = themeProps[0].id;
selected.setAttribute('data-theme-name', defaultTheme);

/**
 * LIDA COM O INPUT CLICADO
 */
const handleSelect = (event) => {
   // modifica a identificação dataset padrão do selected
   selected.setAttribute('data-theme-name', event.target.htmlFor);

   selected.innerHTML = event.target.innerHTML;
   themeList.classList.remove('open');
   selected.classList.remove('up-arrow');

   selected.style.color = 'var(--color-text)';
};

/**
 * CRIA ITEM DA LISTA DE TEMAS
 */
const createTheme = (themeProps) => {
   const themeItem = document.createElement('li');
   const themeInput = document.createElement('input');
   const themeLabel = document.createElement('label');

   themeItem.classList.add('theme-name');
   themeInput.setAttribute('type', 'radio');
   themeInput.setAttribute('name', 'theme');
   themeInput.setAttribute('id', themeProps.id);
   themeLabel.setAttribute('for', themeProps.id);
   themeLabel.innerHTML = themeProps.name;

   themeItem.appendChild(themeInput);
   themeItem.appendChild(themeLabel);

   themeLabel.addEventListener('click', handleSelect);

   return themeItem;
};

// adiciona todos os itens na lista
themeProps.forEach((props) => {
   const theme = createTheme(props);
   themeList.appendChild(theme);
});

// abrir ou fechar o theme-list
selected.addEventListener('click', () => {
   themeList.classList.toggle('open');
   selected.classList.toggle('up-arrow');

   selected.style.color = 'var(--color-text)';
   selected.style.border = '2px solid var(--color-hover)';
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
