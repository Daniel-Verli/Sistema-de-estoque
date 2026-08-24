// Mantém o CRUD, a ordenação, a busca e a persistência das categorias.
/**
 * ============================================================
 * Documentação do Projeto: Sistema de Estoque
 * ============================================================
 *
 * Módulo: operaçõesTabelaCategorias.js
 *
 * Descrição:
 * Este módulo é responsável pelo gerenciamento das categorias
 * de produtos do sistema, permitindo operações de criação,
 * consulta, edição e remoção de categorias.
 *
 * Tipo:
 * Back-end / Front-end / Full Stack
 *
 * Versão:
 * 1.0.0
 *
 * Status:
 * Em desenvolvimento
 *
 * Autor(es):
 * Alexandre
 *
 * Data de criação:
 * DD/MM/AAAA
 *
 * Última atualização:
 * DD/MM/AAAA
 *
 * Dependências:
 * Nenhuma
 *
 * ============================================================
 */

export let listaCategorias = []; 
const localStorageCategoriasKEY = 'categorias';

/**
 * Define uma lista de categoriase e a organiza corretamente
 * 
 * @param {listaCategorias} categoria 
 * @returns {void} 
 */
export function definirListaCategorias(categorias) {
    listaCategorias.length = 0;

    if (Array.isArray(categorias) && categorias.length > 0) {
        listaCategorias.push(...categorias);
    }

    organizarCategorias();
}


/**
 * Verifica se a categoria está duplicada
 * 
 * @param {string} categoria - O nome digitado pelo usuário (ex: "Informática").
 * @returns {boolean} Esta função retorna se a categoria está duplicada.
 */
function categoriaExiste(categoria) {
    return listaCategorias.some(item => item.id_categoria === categoria.id_categoria);
}

/**
 * Adiciona uma categoria válida em listaCategorias, desde que a mesma não esteja duplicada.
 * 
 * @param {string} categoria - O nome digitado pelo usuário (ex: "Informática").
 * @returns {boolean} Esta função retorna se a inserção ocorreu corretamente.
 */
export function adicionarCategoria(categoria) {
    if (!categoria || !categoria.nome_categoria || categoria.nome_categoria.trim() === '') {
        return false;
    }

    if (categoriaExiste(categoria)) {
        return false;
    }

    listaCategorias.push(categoria);
    organizarCategorias();
    return true;
}

/**
 * Remove a categoria com o ID especificado
 * 
 * @param {int} idCategoria - O ID do item especificado.
 * @returns {boolean} Esta função retornase se a remoção correu corretamente.
 */
export function removerCategoria(idCategoria) {
    const indice = listaCategorias.findIndex(item => item.id_categoria === idCategoria);

    //Indice não existe
    if (indice === -1) {
        return false;
    }

    listaCategorias.splice(indice, 1);
    organizarCategorias();
    return true;
}

/**
 * Sobreescreve o conteúdo do ID especificado
 * 
 * @param {int} idCategoria - O ID do item especificado.
 * @returns {boolean} Esta função retornase se a remoção correu corretamente.
 */
export function editarCategoria(categoriaAtual, nome_categoria) {
   
    categoriaAtual.nome_categoria = nome_categoria;
    const indice = listaCategorias.findIndex(item => item.id_categoria === categoriaAtual.id_categoria);

    if (indice === -1) {
        return false;
    }

    listaCategorias[indice] = categoriaAtual;
    organizarCategorias();
    return true;
}


/**
 * Organiza a lista de categorias alfabeticamente.
 * 
 * @returns {boolean} Esta função retornas e se a ordenação ocorreu corretamente
 */
function organizarCategorias(){
    if(!listaCategorias || listaCategorias.length === 0) {
        return false;
    }
    listaCategorias.sort((a, b) => a.nome_categoria.localeCompare(b.nome_categoria));
    return true;
}


/**
 * Filtra categorias com proximidade com o nome especificado na entrada
 * 
 * @param {string} nomeBusca_categoria Uma string com nome do item de busca
 * @returns {listaFiltrados} Esta função retorna uma lista de categorias filtradas
 */
export function buscarCategorias(nomeBusca_categoria){
    let listaFiltrados;
    nomeBusca_categoria = nomeBusca_categoria.trim().toLowerCase();
    listaFiltrados = []; //Cria uma lista vazia de categorias filtradas

    // Varre a lista até tamanhoLista
    for (let i = 0; i < listaCategorias.length; i++) {
        let categoriaAtual = listaCategorias[i].nome_categoria.toLowerCase(); //Obtém a categoria no índice i
        let nomeIgual = true;
        let k = 0;
        while (k < categoriaAtual.length && k < nomeBusca_categoria.length) {
           if(categoriaAtual[k] !== nomeBusca_categoria[k]){
                nomeIgual = false;
                break;
            }
            k++;
        }

        //Se nomeIgual verdadeiro, filtra nomeDoIndice
        if (nomeIgual) {
            listaFiltrados.push(listaCategorias[i]);
        }
            
    }

   
    return listaFiltrados;

}


/**
 * Salva as alterações da lista de categorias no armazenamento local.
 * 
 * @returns {boolean} Esta função retorna se se a remoção correu corretamente.
 */
export function salvarAlteracoesCategoria(){
    const categoriasParaPersistir = Array.isArray(listaCategorias) ? listaCategorias : [];
    localStorage.setItem(localStorageCategoriasKEY, JSON.stringify(categoriasParaPersistir));
    return true;
}

/**
 * Obtém as alterações salvas no LocalStorage
 * 
 * @returns {categoria} Esta função retorna uma lista de categorias
 */
export function obterCategoriasDoLocalStorage() {
    const categoriasSalvas = localStorage.getItem(localStorageCategoriasKEY);

    if (!categoriasSalvas) {
        return [];
    }

    try {
        const categoriasCarregadas = JSON.parse(categoriasSalvas);
        return Array.isArray(categoriasCarregadas) ? categoriasCarregadas : [];
    } catch (erro) {
        console.error('Erro ao carregar categorias do localStorage:', erro);
        return [];
    }
}