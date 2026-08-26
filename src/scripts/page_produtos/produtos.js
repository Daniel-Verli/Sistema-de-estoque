// Controla o CRUD de produtos, os modais, a busca e os filtros da tabela.
const modalProduto = document.getElementById("modalProduto");
const modalEditarProduto = document.getElementById("modalEditarProduto");
const abrirModal = document.getElementById("abrirModalProduto");
const fecharModal = document.getElementById("fecharModalProduto");
const fecharModalEditar = document.getElementById("fecharModalEditarProduto");
const cancelarModalEditar = document.getElementById("cancelarModalEditarProduto");

const formProduto = document.getElementById("formProduto");
const formEditarProduto = document.getElementById("formEditarProduto");
const produtosTbody = document.getElementById("produtos-tbody");
const filtroCategoriaProduto = document.getElementById("filtroCategoriaProduto");
const filtroStatusProduto = document.getElementById("filtroStatusProduto");
const limparFiltroProduto = document.getElementById("limparFiltroProduto");
const botaoFiltrarProdutos = document.getElementById("filtrarProdutos");
const campoBuscaProduto = document.getElementById("buscaProduto");
const botaoBuscarProduto = document.getElementById("botaoBuscarProduto");

function removerAcentos(texto) {
    return (texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function buscarProdutosPorPesquisa(nomeBusca_produto, listaProdutos) {
    const nomeBusca = removerAcentos(nomeBusca_produto || "").trim();
    const listaFiltrados = [];

    if (!nomeBusca) {
        return listaProdutos;
    }

    for (let i = 0; i < listaProdutos.length; i++) {
        const produtoAtual = removerAcentos(listaProdutos[i].nome || "");

        if (produtoAtual.includes(nomeBusca)) {
            listaFiltrados.push(listaProdutos[i]);
        }
    }

    return listaFiltrados;
}

function buscarProdutosPorCategoria(id_categoria, listaProdutos) {
    const buscaCategoria = removerAcentos(String(id_categoria || "")).trim();
    const listaFiltradosPorCategoria = [];

    for (let i = 0; i < listaProdutos.length; i++) {
        const categoriaProduto = removerAcentos(String(listaProdutos[i].categoria || ""));
        const categoriaId = removerAcentos(String(listaProdutos[i].id_categoria || ""));

        if (categoriaId === buscaCategoria || categoriaProduto.includes(buscaCategoria)) {
            listaFiltradosPorCategoria.push(listaProdutos[i]);
        }
    }

    return listaFiltradosPorCategoria;
}

function buscarProdutosPorStatus(id_status, listaProdutos) {
    const buscaStatus = removerAcentos(String(id_status || "")).trim();
    const listaFiltradosPorStatus = [];

    for (let i = 0; i < listaProdutos.length; i++) {
        const statusProduto =
            listaProdutos[i].quantidade <= (listaProdutos[i].quantidadeMinima || 0)
                ? "critico"
                : "normal";

        if (removerAcentos(statusProduto) === buscaStatus) {
            listaFiltradosPorStatus.push(listaProdutos[i]);
        }
    }

    return listaFiltradosPorStatus;
}

function filtrarProdutos(listaProdutos) {
    let listaFiltrada = listaProdutos;

    if (filtroCategoriaProduto && filtroCategoriaProduto.value) {
        listaFiltrada = buscarProdutosPorCategoria(filtroCategoriaProduto.value, listaFiltrada);
    }

    if (filtroStatusProduto && filtroStatusProduto.value) {
        listaFiltrada = buscarProdutosPorStatus(filtroStatusProduto.value, listaFiltrada);
    }

    if (campoBuscaProduto && campoBuscaProduto.value.trim()) {
        listaFiltrada = buscarProdutosPorPesquisa(campoBuscaProduto.value, listaFiltrada);
    }

    return listaFiltrada;
}

function carregarOpcoesFiltro() {
    const produtos = obterProdutosDoStorage();

    if (filtroCategoriaProduto) {
        const categorias = JSON.parse(localStorage.getItem("categorias")) || [];
        filtroCategoriaProduto.innerHTML = '<option value="">Selecione aqui</option>';

        categorias.forEach(categoria => {
            const option = document.createElement("option");
            option.value = String(categoria.id_categoria);
            option.textContent = categoria.nome_categoria;
            filtroCategoriaProduto.appendChild(option);
        });
    }

    if (filtroStatusProduto) {
        filtroStatusProduto.innerHTML = `
            <option value="">Selecione aqui</option>
            <option value="critico">Crítico</option>
            <option value="normal">Normal</option>
        `;
    }
}

function obterProdutosDoStorage() {
    return JSON.parse(localStorage.getItem("produtos")) || [];
}

function salvarProdutosNoStorage(produtos) {
    localStorage.setItem("produtos", JSON.stringify(produtos));
}

function carregarCategoriasNoSelect(select) {
    if (!select) return;

    const categorias =
        JSON.parse(localStorage.getItem("categorias")) || [];

    select.innerHTML =
        '<option value="">Selecione uma categoria</option>';

    categorias.forEach(categoria => {
        const option = document.createElement("option");

        option.value = categoria.id_categoria;
        option.textContent = categoria.nome_categoria;

        select.appendChild(option);
    });
}

function mostrarModal(modal) {
    if (modal) {
        modal.removeAttribute("hidden");
    }
}

function esconderModal(modal) {
    if (modal) {
        modal.setAttribute("hidden", "");
    }
}

function abrirModalCadastroProduto() {
    carregarCategoriasNoSelect(document.getElementById("categoriaProduto"));
    formProduto.reset();
    mostrarModal(modalProduto);
}

function fecharModalCadastroProduto() {
    esconderModal(modalProduto);
}

function preencherFormularioEdicao(produto) {
    const selectEdicao = document.getElementById("categoriaProdutoEdicao");

    carregarCategoriasNoSelect(selectEdicao);

    document.getElementById("idProdutoEdicao").value = produto.id;
    document.getElementById("nomeProdutoEdicao").value = produto.nome;
    document.getElementById("quantidadeProdutoEdicao").value = produto.quantidade;
    document.getElementById("quantidadeMinimaProdutoEdicao").value = produto.quantidadeMinima;
    document.getElementById("precoProdutoEdicao").value = produto.preco;

    selectEdicao.value = String(produto.id_categoria);
}

function abrirModalEdicaoProduto(produto) {
    preencherFormularioEdicao(produto);
    mostrarModal(modalEditarProduto);
}

function fecharModalEdicaoProduto() {
    esconderModal(modalEditarProduto);
}

function salvarProduto(produto) {
    const produtos = obterProdutosDoStorage();
    produtos.push(produto);
    salvarProdutosNoStorage(produtos);
}

function editarProduto(produtoEditado) {
    const produtos = obterProdutosDoStorage();
    const indice = produtos.findIndex(produto => produto.id === produtoEditado.id);

    if (indice !== -1) {
        produtos[indice] = produtoEditado;
        salvarProdutosNoStorage(produtos);
    }
}

function buscarProdutoPorId(idProduto) {
    return obterProdutosDoStorage().find(produto => produto.id === idProduto);
}

function validarDadosDoProduto(nome, categoriaSelect) {
    if (!nome) {
        alert("Digite um nome.");
        return false;
    }

    if (!categoriaSelect.value) {
        alert("Selecione uma categoria.");
        return false;
    }

    return true;
}

function carregarProdutos() {
    let produtos = obterProdutosDoStorage();
    const categorias =
        JSON.parse(localStorage.getItem("categorias")) || [];

    produtos = produtos.filter(produto =>
        categorias.some(categoria =>
            categoria.id_categoria === produto.id_categoria
        )
    );

    salvarProdutosNoStorage(produtos);

    const produtosFiltrados = filtrarProdutos(produtos);

    produtosTbody.innerHTML = "";

    if (produtosFiltrados.length === 0) {
        produtosTbody.innerHTML = `
            <tr>
                <td colspan="8">
                    Nenhum produto encontrado
                </td>
            </tr>
        `;
        return;
    }

    produtosFiltrados.slice().reverse().forEach(produto => {
        const status =
            produto.quantidade <= (produto.quantidadeMinima || 0)
                ? "Crítico"
                : "Normal";

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>${produto.categoria}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.quantidadeMinima || 0}</td>
            <td>${status}</td>
            <td>R$ ${Number(produto.preco).toFixed(2)}</td>
            <td class="celula-acoes">
                <button
                    class="btn-icone btn-editar"
                    type="button"
                    aria-label="Editar produto"
                    data-id="${produto.id}">
                    <img src="../images/page_categorias/editicon.png" alt="Editar">
                </button>

                <button
                    class="btn-icone btn-remover"
                    type="button"
                    aria-label="Excluir produto"
                    data-id="${produto.id}">
                    <img src="../images/page_categorias/removeicon.png" alt="Excluir">
                </button>
            </td>
        `;

        produtosTbody.appendChild(linha);
    });
}

if (abrirModal) {
    abrirModal.addEventListener("click", abrirModalCadastroProduto);
}

if (fecharModal) {
    fecharModal.addEventListener("click", fecharModalCadastroProduto);
}

if (fecharModalEditar) {
    fecharModalEditar.addEventListener("click", fecharModalEdicaoProduto);
}

if (cancelarModalEditar) {
    cancelarModalEditar.addEventListener("click", fecharModalEdicaoProduto);
}

if (formProduto) {
    formProduto.addEventListener("submit", function (e) {
        e.preventDefault();

        const nome =
            document.getElementById("nomeProduto").value.trim();

        const categoriaSelect =
            document.getElementById("categoriaProduto");

        const quantidade =
            Number(document.getElementById("quantidadeProduto").value);

        const quantidadeMinima =
            Number(document.getElementById("quantidadeMinimaProduto").value);

        const preco =
            Number(document.getElementById("precoProduto").value);

        if (!validarDadosDoProduto(nome, categoriaSelect)) {
            return;
        }

        const produto = {
            id: Date.now(),
            nome: nome,
            id_categoria: Number(categoriaSelect.value),
            categoria:
                categoriaSelect.options[
                    categoriaSelect.selectedIndex
                ].text,
            quantidade: quantidade,
            quantidadeMinima: quantidadeMinima,
            preco: preco
        };

        salvarProduto(produto);
        carregarProdutos();
        formProduto.reset();
        fecharModalCadastroProduto();
    });
}

if (formEditarProduto) {
    formEditarProduto.addEventListener("submit", function (e) {
        e.preventDefault();

        const idProduto = Number(
            document.getElementById("idProdutoEdicao").value
        );

        const nome =
            document.getElementById("nomeProdutoEdicao").value.trim();

        const categoriaSelect =
            document.getElementById("categoriaProdutoEdicao");

        const quantidade =
            Number(document.getElementById("quantidadeProdutoEdicao").value);

        const quantidadeMinima =
            Number(document.getElementById("quantidadeMinimaProdutoEdicao").value);

        const preco =
            Number(document.getElementById("precoProdutoEdicao").value);

        if (!validarDadosDoProduto(nome, categoriaSelect)) {
            return;
        }

        const produtoEditado = {
            id: idProduto,
            nome: nome,
            id_categoria: Number(categoriaSelect.value),
            categoria:
                categoriaSelect.options[
                    categoriaSelect.selectedIndex
                ].text,
            quantidade: quantidade,
            quantidadeMinima: quantidadeMinima,
            preco: preco
        };

        editarProduto(produtoEditado);
        carregarProdutos();
        formEditarProduto.reset();
        fecharModalEdicaoProduto();
    });
}

if (botaoFiltrarProdutos) {
    botaoFiltrarProdutos.addEventListener("click", carregarProdutos);
}

if (botaoBuscarProduto) {
    botaoBuscarProduto.addEventListener("click", carregarProdutos);
}

if (campoBuscaProduto) {
    campoBuscaProduto.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            carregarProdutos();
        }
    });
}

if (limparFiltroProduto) {
    limparFiltroProduto.addEventListener("click", () => {
        if (filtroCategoriaProduto) {
            filtroCategoriaProduto.value = "";
        }

        if (filtroStatusProduto) {
            filtroStatusProduto.value = "";
        }

        if (campoBuscaProduto) {
            campoBuscaProduto.value = "";
        }

        carregarProdutos();
    });
}

produtosTbody.addEventListener("click", (e) => {
    const botaoEditar = e.target.closest(".btn-editar");

    if (botaoEditar) {
        const idProduto = Number(botaoEditar.dataset.id);
        const produto = buscarProdutoPorId(idProduto);

        if (produto) {
            abrirModalEdicaoProduto(produto);
        }

        return;
    }

    const botaoRemover = e.target.closest(".btn-remover");

    if (!botaoRemover) return;

    const idProduto = Number(botaoRemover.dataset.id);

    const confirmar =
        confirm(`Deseja realmente excluir o produto ID ${idProduto}?`);

    if (!confirmar) return;

    let produtos = obterProdutosDoStorage();

    produtos = produtos.filter(produto => produto.id !== idProduto);

    salvarProdutosNoStorage(produtos);

    carregarProdutos();
});

carregarOpcoesFiltro();
carregarProdutos();