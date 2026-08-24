// Conecta os controles da página de categorias ao módulo de operações.
/**
 * ============================================================
 * Documentação do Projeto: Sistema de Estoque
 * ============================================================
 *
 * Módulo: Gerenciamento de Categorias
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
 * - operaçõesTabelaCategorias.js
 *
 * ============================================================
 */


let localStorageCategoriasKEY = "categorias";

import { listaCategorias, adicionarCategoria, removerCategoria, editarCategoria, salvarAlteracoesCategoria, obterCategoriasDoLocalStorage, definirListaCategorias, buscarCategorias } from './operaçõesTabelaCategorias.js';


 

document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('categorias-tbody');
    const inputNovaCategoria = document.getElementById('novaCategoriaInput');
    const inputBuscaCategoria = document.getElementById('buscarCategoriaInput')
    const botaoInserirCategoria = document.querySelector('.botaoInserirCategoria');

    if (!tbody || !inputNovaCategoria || !botaoInserirCategoria) {
        console.error('Elemento tbody não encontrado.');
        return;
    }

    /**
    * Obter um próximo id baseado no maior ID da lista
    * 
    * 
    * @returns {int} Esta função retorna o próximo ID disponível.
    */
    function obterProximoIdCategoria() {
        return listaCategorias.reduce((maiorId, categoria) => {
            return Math.max(maiorId, Number(categoria.id_categoria) || 0);
        }, 0) + 1;
    }

        function atualizarTabelaCategorias(listaParaRenderizar = listaCategorias) {
            renderizarTodosItensTabelaCategoria(listaParaRenderizar);
            eventoRemoverCategoria();
            eventoEditarCategoria();
        }


    /**
    * Renderiza todos os itens da tabela
    * 
    * @returns {void} Esta função retorna se a categoria está duplicada.
    */

    function renderizarTodosItensTabelaCategoria(listaCategorias) {
        tbody.innerHTML = '';

        if (!Array.isArray(listaCategorias) || listaCategorias.length === 0) {
            const linhaVazia = document.createElement('tr');
            linhaVazia.innerHTML = '<td colspan="3">Nenhuma categoria cadastrada.</td>';
            tbody.appendChild(linhaVazia);
            return;
        }

        listaCategorias.forEach((categoria) => {
            const novaLinha = document.createElement('tr');
            novaLinha.innerHTML = `
                <td>${categoria.id_categoria}</td>
                <td>${categoria.nome_categoria}</td>
                <td class="celula-acoes">
                    <button class="btn-icone btn-editar" type="button" aria-label="Editar categoria" data-id="${categoria.id_categoria}">
                        <img src="../images/page_categorias/editicon.png" alt="Editar">
                    </button>

                    <button class="btn-icone btn-remover" type="button" aria-label="Excluir categoria" data-id="${categoria.id_categoria}">
                        <img src="../images/page_categorias/removeicon.png" alt="Excluir">
                    </button>
                </td>
            `;
            tbody.appendChild(novaLinha);
        });

    }

    /**
    * Evento de remoção de categorias
    * 
    * @returns {boolean} Esta função retorna se a edição ocorreu corretamente.
    */
    function eventoRemoverCategoria() {
        tbody.querySelectorAll('.btn-remover').forEach((botao) => {
            botao.addEventListener('click', () => {
                const idCategoria = Number(botao.dataset.id);
                if (confirm(`Deseja realmente remover a categoria com ID ${idCategoria}? Todos os produtos vinculados a esta categoria também serão removidos.`)) {
                    removerCategoria(idCategoria);
                    atualizarTabelaCategorias();
                    salvarAlteracoesCategoria();
                }
            });
        });
    }

    /**
    * Evento de acionamento da edição de categorias
    * 
    * @returns {boolean} Esta função retorna se a edição ocorreu corretamente.
    */
    function eventoEditarCategoria() {
        tbody.querySelectorAll('.btn-editar').forEach((botao) => {
            botao.addEventListener('click', () => {
                const idCategoria = Number(botao.dataset.id);
                const categoriaSelecionada = listaCategorias.find((item) => item.id_categoria === idCategoria);

                if (!categoriaSelecionada) {
                    return;
                }

                const novoNome = prompt('Digite o novo nome da categoria:', categoriaSelecionada.nome_categoria);

                if (novoNome === null) {
                    return;
                }

                const nomeTrim = novoNome.trim();

                if (!nomeTrim) {
                    alert('O nome da categoria não pode ficar vazio.');
                    return;
                }

                editarCategoria(categoriaSelecionada, nomeTrim);
                salvarAlteracoesCategoria();
                atualizarTabelaCategorias();
            });
        });
    }




    /**
    * Insere um novaCategoria com nome baseado no input
    * 
    * @param {string} categoria - O nome digitado pelo usuário (ex: "Informática").
    * @returns {void} Esta função retorna se a inserção ocorreu corretamente.
    */
    function inserirNovaCategoria() {
        const nomeCategoria = inputNovaCategoria.value.trim();

        if (!nomeCategoria) {
            inputNovaCategoria.focus();
            return;
        }

        const categoriaFoiAdicionada = adicionarCategoria({
            id_categoria: obterProximoIdCategoria(),
            nome_categoria: nomeCategoria,
        });

        if (!categoriaFoiAdicionada) {
            return;
        }

        inputNovaCategoria.value = '';
        atualizarTabelaCategorias();
        salvarAlteracoesCategoria();
        inputNovaCategoria.focus();

    }



    botaoInserirCategoria.addEventListener('click', inserirNovaCategoria);
    //botaoRemoverCategoria.addEventListener('click', removerCategoria());
    //botaoEditarCategoria.addEventListener('click', editarCategoria());

    inputNovaCategoria.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            inserirNovaCategoria();
        }
    });

    inputBuscaCategoria.addEventListener('input', () => {
        const termoBusca = inputBuscaCategoria.value.trim();

        if (termoBusca === '') {
            atualizarTabelaCategorias();
            return;
        }

        const termoNormalizado = termoBusca.toLowerCase();
        const categoriasFiltradas = buscarCategorias(termoNormalizado)
        atualizarTabelaCategorias(categoriasFiltradas);
    });

    definirListaCategorias(obterCategoriasDoLocalStorage());
    atualizarTabelaCategorias();
    


    /*
    const categoriasIniciais = [
        { id_categoria: 1, nome_categoria: 'Informática' },
        { id_categoria: 2, nome_categoria: 'Papelaria' },
        { id_categoria: 3, nome_categoria: 'Móveis para Escritório' },
        { id_categoria: 4, nome_categoria: 'Limpeza e Higiene' },
        { id_categoria: 5, nome_categoria: 'Explosivos' },
        { id_categoria: 6, nome_categoria: 'Qualquer coisa2' }
    ];
    */

});