// CRUD de produtos com persistência no localStorage.
(() => {
    'use strict';

    const CHAVE_PRODUTOS = 'produtos';
    const CHAVE_CATEGORIAS = 'categorias';

    const modalProduto = document.getElementById('modalProduto');
    const modalEditarProduto = document.getElementById('modalEditarProduto');
    const abrirModal = document.getElementById('abrirModalProduto');
    const fecharModal = document.getElementById('fecharModalProduto');
    const fecharModalEditar = document.getElementById('fecharModalEditarProduto');
    const cancelarModalEditar = document.getElementById('cancelarModalEditarProduto');
    const formProduto = document.getElementById('formProduto');
    const formEditarProduto = document.getElementById('formEditarProduto');
    const produtosTbody = document.getElementById('produtos-tbody');
    const filtroCategoriaProduto = document.getElementById('filtroCategoriaProduto');
    const filtroStatusProduto = document.getElementById('filtroStatusProduto');
    const limparFiltroProduto = document.getElementById('limparFiltroProduto');
    const botaoFiltrarProdutos = document.getElementById('filtrarProdutos');
    const campoBuscaProduto = document.getElementById('buscaProduto');
    const botaoBuscarProduto = document.getElementById('botaoBuscarProduto');

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

    function obterCategorias() {
        return lerLista(CHAVE_CATEGORIAS);
    }

    function obterProdutos() {
        return lerLista(CHAVE_PRODUTOS);
    }

    function salvarProdutos(produtos) {
        salvarLista(CHAVE_PRODUTOS, produtos);
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

    function moeda(valor) {
        return Number(valor || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    function mostrarModal(modal) {
        if (modal) modal.removeAttribute('hidden');
    }

    function esconderModal(modal) {
        if (modal) modal.setAttribute('hidden', '');
    }

    function preencherSelectCategorias(select, valorSelecionado = '') {
        if (!select) return;

        const categorias = obterCategorias();
        select.innerHTML = '<option value="">Selecione uma categoria</option>';

        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = String(categoria.id_categoria);
            option.textContent = categoria.nome_categoria;
            select.appendChild(option);
        });

        select.value = String(valorSelecionado || '');
    }

    function atualizarFiltroCategorias() {
        if (!filtroCategoriaProduto) return;

        const valorAtual = filtroCategoriaProduto.value;
        filtroCategoriaProduto.innerHTML = '<option value="">Todas</option>';

        obterCategorias().forEach(categoria => {
            const option = document.createElement('option');
            option.value = String(categoria.id_categoria);
            option.textContent = categoria.nome_categoria;
            filtroCategoriaProduto.appendChild(option);
        });

        filtroCategoriaProduto.value = valorAtual;
    }

    function abrirCadastro() {
        const categorias = obterCategorias();

        if (categorias.length === 0) {
            alert('Cadastre pelo menos uma categoria antes de adicionar um produto.');
            return;
        }

        formProduto.reset();
        preencherSelectCategorias(document.getElementById('categoriaProduto'));
        mostrarModal(modalProduto);
    }

    function obterProdutoPorId(id) {
        return obterProdutos().find(produto => Number(produto.id) === Number(id));
    }

    function abrirEdicao(produto) {
        document.getElementById('idProdutoEdicao').value = produto.id;
        document.getElementById('nomeProdutoEdicao').value = produto.nome;
        document.getElementById('quantidadeProdutoEdicao').value = produto.quantidade;
        document.getElementById('quantidadeMinimaProdutoEdicao').value = produto.quantidadeMinima;
        document.getElementById('precoProdutoEdicao').value = produto.preco;
        preencherSelectCategorias(
            document.getElementById('categoriaProdutoEdicao'),
            produto.id_categoria
        );
        mostrarModal(modalEditarProduto);
    }

    function lerFormulario(prefixoEdicao = false) {
        const sufixo = prefixoEdicao ? 'Edicao' : '';
        const nome = document.getElementById(`nomeProduto${sufixo}`).value.trim();
        const selectCategoria = document.getElementById(`categoriaProduto${sufixo}`);
        const quantidade = Number(document.getElementById(`quantidadeProduto${sufixo}`).value);
        const quantidadeMinima = Number(document.getElementById(`quantidadeMinimaProduto${sufixo}`).value);
        const preco = Number(document.getElementById(`precoProduto${sufixo}`).value);

        if (!nome) {
            alert('Digite o nome do produto.');
            return null;
        }

        if (!selectCategoria.value) {
            alert('Selecione uma categoria.');
            return null;
        }

        if (![quantidade, quantidadeMinima, preco].every(Number.isFinite) || quantidade < 0 || quantidadeMinima < 0 || preco < 0) {
            alert('Quantidade, quantidade mínima e preço devem ser valores iguais ou maiores que zero.');
            return null;
        }

        const categoria = obterCategorias().find(
            item => Number(item.id_categoria) === Number(selectCategoria.value)
        );

        if (!categoria) {
            alert('A categoria selecionada não existe mais. Atualize a página e tente novamente.');
            return null;
        }

        return {
            nome,
            id_categoria: Number(categoria.id_categoria),
            categoria: categoria.nome_categoria,
            quantidade,
            quantidadeMinima,
            preco
        };
    }

    function produtosFiltrados() {
        const categoriasValidas = new Set(obterCategorias().map(c => Number(c.id_categoria)));
        let produtos = obterProdutos().filter(produto => categoriasValidas.has(Number(produto.id_categoria)));

        // Remove do armazenamento produtos órfãos, caso existam dados antigos.
        salvarProdutos(produtos);

        const busca = normalizar(campoBuscaProduto?.value);
        const categoria = filtroCategoriaProduto?.value || '';
        const status = filtroStatusProduto?.value || '';

        if (busca) {
            produtos = produtos.filter(produto => normalizar(produto.nome).includes(busca));
        }

        if (categoria) {
            produtos = produtos.filter(produto => Number(produto.id_categoria) === Number(categoria));
        }

        if (status) {
            produtos = produtos.filter(produto => {
                const atual = Number(produto.quantidade) <= Number(produto.quantidadeMinima) ? 'critico' : 'normal';
                return atual === status;
            });
        }

        return produtos;
    }

    function renderizarProdutos() {
        atualizarFiltroCategorias();
        const produtos = produtosFiltrados();
        produtosTbody.innerHTML = '';

        if (produtos.length === 0) {
            produtosTbody.innerHTML = '<tr><td colspan="8">Nenhum produto encontrado.</td></tr>';
            return;
        }

        produtos.slice().reverse().forEach(produto => {
            const status = Number(produto.quantidade) <= Number(produto.quantidadeMinima) ? 'Crítico' : 'Normal';
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${Number(produto.id)}</td>
                <td>${escaparHTML(produto.nome)}</td>
                <td>${escaparHTML(produto.categoria)}</td>
                <td>${Number(produto.quantidade)}</td>
                <td>${Number(produto.quantidadeMinima)}</td>
                <td>${status}</td>
                <td>${moeda(produto.preco)}</td>
                <td class="celula-acoes">
                    <button class="btn-icone btn-editar" type="button" data-id="${Number(produto.id)}" aria-label="Editar produto">
                        <img src="../images/page_categorias/editicon.png" alt="Editar">
                    </button>
                    <button class="btn-icone btn-remover" type="button" data-id="${Number(produto.id)}" aria-label="Excluir produto">
                        <img src="../images/page_categorias/removeicon.png" alt="Excluir">
                    </button>
                </td>
            `;
            produtosTbody.appendChild(linha);
        });
    }

    abrirModal?.addEventListener('click', abrirCadastro);
    fecharModal?.addEventListener('click', () => esconderModal(modalProduto));
    fecharModalEditar?.addEventListener('click', () => esconderModal(modalEditarProduto));
    cancelarModalEditar?.addEventListener('click', () => esconderModal(modalEditarProduto));

    formProduto?.addEventListener('submit', event => {
        event.preventDefault();
        const dados = lerFormulario(false);
        if (!dados) return;

        const produtos = obterProdutos();
        produtos.push({ id: Date.now(), ...dados });
        salvarProdutos(produtos);

        formProduto.reset();
        esconderModal(modalProduto);
        renderizarProdutos();
    });

    formEditarProduto?.addEventListener('submit', event => {
        event.preventDefault();
        const id = Number(document.getElementById('idProdutoEdicao').value);
        const dados = lerFormulario(true);
        if (!dados) return;

        const produtos = obterProdutos();
        const indice = produtos.findIndex(produto => Number(produto.id) === id);
        if (indice === -1) {
            alert('Produto não encontrado.');
            return;
        }

        produtos[indice] = { id, ...dados };
        salvarProdutos(produtos);
        esconderModal(modalEditarProduto);
        renderizarProdutos();
    });

    produtosTbody?.addEventListener('click', event => {
        const botaoEditar = event.target.closest('.btn-editar');
        if (botaoEditar) {
            const produto = obterProdutoPorId(Number(botaoEditar.dataset.id));
            if (produto) abrirEdicao(produto);
            return;
        }

        const botaoRemover = event.target.closest('.btn-remover');
        if (!botaoRemover) return;

        const id = Number(botaoRemover.dataset.id);
        const produto = obterProdutoPorId(id);
        if (!produto) return;

        if (!confirm(`Deseja realmente excluir o produto "${produto.nome}"?`)) return;

        salvarProdutos(obterProdutos().filter(item => Number(item.id) !== id));
        renderizarProdutos();
    });

    botaoFiltrarProdutos?.addEventListener('click', renderizarProdutos);
    botaoBuscarProduto?.addEventListener('click', renderizarProdutos);

    campoBuscaProduto?.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            renderizarProdutos();
        }
    });

    limparFiltroProduto?.addEventListener('click', () => {
        if (filtroCategoriaProduto) filtroCategoriaProduto.value = '';
        if (filtroStatusProduto) filtroStatusProduto.value = '';
        if (campoBuscaProduto) campoBuscaProduto.value = '';
        renderizarProdutos();
    });

    [modalProduto, modalEditarProduto].forEach(modal => {
        modal?.addEventListener('click', event => {
            if (event.target === modal) esconderModal(modal);
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            esconderModal(modalProduto);
            esconderModal(modalEditarProduto);
        }
    });

    renderizarProdutos();
})();
