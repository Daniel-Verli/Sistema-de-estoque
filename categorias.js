// CRUD de categorias com persistência no localStorage.
(() => {
    'use strict';

    const CHAVE_CATEGORIAS = 'categorias';
    const CHAVE_PRODUTOS = 'produtos';

    const tbody = document.getElementById('categorias-tbody');
    const inputNovaCategoria = document.getElementById('novaCategoriaInput');
    const inputBuscaCategoria = document.getElementById('buscarCategoriaInput');
    const botaoInserirCategoria = document.querySelector('.botaoInserirCategoria');

    if (!tbody || !inputNovaCategoria || !inputBuscaCategoria || !botaoInserirCategoria) {
        console.error('Elementos da página de categorias não foram encontrados.');
        return;
    }

    function lerLista(chave) {
        try {
            const valor = JSON.parse(localStorage.getItem(chave));
            return Array.isArray(valor) ? valor : [];
        } catch (erro) {
            console.error(`Erro ao ler ${chave} do localStorage:`, erro);
            return [];
        }
    }

    function salvarLista(chave, lista) {
        localStorage.setItem(chave, JSON.stringify(lista));
    }

    function normalizar(texto) {
        return String(texto || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    }

    function escaparHTML(texto) {
        return String(texto)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function obterCategorias() {
        return lerLista(CHAVE_CATEGORIAS);
    }

    function salvarCategorias(categorias) {
        const ordenadas = categorias.slice().sort((a, b) =>
            String(a.nome_categoria).localeCompare(String(b.nome_categoria), 'pt-BR')
        );
        salvarLista(CHAVE_CATEGORIAS, ordenadas);
    }

    function proximoId(categorias) {
        return categorias.reduce((maior, categoria) => {
            return Math.max(maior, Number(categoria.id_categoria) || 0);
        }, 0) + 1;
    }

    function renderizar() {
        const termo = normalizar(inputBuscaCategoria.value);
        const categorias = obterCategorias().filter(categoria =>
            normalizar(categoria.nome_categoria).includes(termo)
        );

        tbody.innerHTML = '';

        if (categorias.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">Nenhuma categoria cadastrada.</td></tr>';
            return;
        }

        categorias.forEach(categoria => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${Number(categoria.id_categoria)}</td>
                <td>${escaparHTML(categoria.nome_categoria)}</td>
                <td class="celula-acoes">
                    <button class="btn-icone btn-editar" type="button" data-id="${Number(categoria.id_categoria)}" aria-label="Editar categoria">
                        <img src="../images/page_categorias/editicon.png" alt="Editar">
                    </button>
                    <button class="btn-icone btn-remover" type="button" data-id="${Number(categoria.id_categoria)}" aria-label="Excluir categoria">
                        <img src="../images/page_categorias/removeicon.png" alt="Excluir">
                    </button>
                </td>
            `;
            tbody.appendChild(linha);
        });
    }

    function adicionarCategoria() {
        const nome = inputNovaCategoria.value.trim();

        if (!nome) {
            alert('Digite o nome da categoria.');
            inputNovaCategoria.focus();
            return;
        }

        const categorias = obterCategorias();
        const duplicada = categorias.some(categoria =>
            normalizar(categoria.nome_categoria) === normalizar(nome)
        );

        if (duplicada) {
            alert('Essa categoria já está cadastrada.');
            inputNovaCategoria.focus();
            return;
        }

        categorias.push({
            id_categoria: proximoId(categorias),
            nome_categoria: nome
        });

        salvarCategorias(categorias);
        inputNovaCategoria.value = '';
        renderizar();
        inputNovaCategoria.focus();
    }

    function editarCategoria(idCategoria) {
        const categorias = obterCategorias();
        const categoria = categorias.find(item => Number(item.id_categoria) === idCategoria);

        if (!categoria) return;

        const novoNomeDigitado = prompt('Digite o novo nome da categoria:', categoria.nome_categoria);
        if (novoNomeDigitado === null) return;

        const novoNome = novoNomeDigitado.trim();
        if (!novoNome) {
            alert('O nome da categoria não pode ficar vazio.');
            return;
        }

        const duplicada = categorias.some(item =>
            Number(item.id_categoria) !== idCategoria &&
            normalizar(item.nome_categoria) === normalizar(novoNome)
        );

        if (duplicada) {
            alert('Já existe outra categoria com esse nome.');
            return;
        }

        categoria.nome_categoria = novoNome;
        salvarCategorias(categorias);

        // Mantém o nome da categoria sincronizado nos produtos existentes.
        const produtos = lerLista(CHAVE_PRODUTOS);
        produtos.forEach(produto => {
            if (Number(produto.id_categoria) === idCategoria) {
                produto.categoria = novoNome;
            }
        });
        salvarLista(CHAVE_PRODUTOS, produtos);

        renderizar();
    }

    function removerCategoria(idCategoria) {
        const categorias = obterCategorias();
        const categoria = categorias.find(item => Number(item.id_categoria) === idCategoria);
        if (!categoria) return;

        const confirmou = confirm(
            `Deseja excluir a categoria "${categoria.nome_categoria}"? Os produtos vinculados a ela também serão excluídos.`
        );
        if (!confirmou) return;

        const categoriasAtualizadas = categorias.filter(
            item => Number(item.id_categoria) !== idCategoria
        );
        salvarCategorias(categoriasAtualizadas);

        const produtos = lerLista(CHAVE_PRODUTOS).filter(
            produto => Number(produto.id_categoria) !== idCategoria
        );
        salvarLista(CHAVE_PRODUTOS, produtos);

        renderizar();
    }

    botaoInserirCategoria.addEventListener('click', adicionarCategoria);

    inputNovaCategoria.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            adicionarCategoria();
        }
    });

    inputBuscaCategoria.addEventListener('input', renderizar);

    tbody.addEventListener('click', event => {
        const botaoEditar = event.target.closest('.btn-editar');
        if (botaoEditar) {
            editarCategoria(Number(botaoEditar.dataset.id));
            return;
        }

        const botaoRemover = event.target.closest('.btn-remover');
        if (botaoRemover) {
            removerCategoria(Number(botaoRemover.dataset.id));
        }
    });

    renderizar();
})();
