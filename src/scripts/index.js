// Calcula e exibe os indicadores e a tabela de produtos críticos do dashboard.
const totalProdutos =
document.getElementById("totalProdutos");

const qtdAbaixoMinimo =
document.getElementById("qtdAbaixoMinimo");

const valorTotalEstoque =
document.getElementById("valorTotalEstoque");

const tabelaCriticosBody =
document.getElementById("tabelaCriticosBody");

function atualizarDashboard() {

    const produtos =
        JSON.parse(localStorage.getItem("produtos")) || [];

    // Total de produtos
    totalProdutos.textContent = produtos.length;

    // Produtos críticos
    const abaixoMinimo = produtos.filter(produto =>
        produto.quantidade <= produto.quantidadeMinima
    );

    qtdAbaixoMinimo.textContent =
        abaixoMinimo.length;

    // Valor total
    const valorTotal = produtos.reduce(
        (total, produto) =>
            total + (produto.quantidade * produto.preco),
        0
    );

    valorTotalEstoque.textContent =
        valorTotal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    // Tabela de críticos
    tabelaCriticosBody.innerHTML = "";

    if (abaixoMinimo.length === 0) {

        tabelaCriticosBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Nenhum produto crítico.
                </td>
            </tr>
        `;

        return;
    }

    abaixoMinimo.forEach(produto => {

        tabelaCriticosBody.innerHTML += `
            <tr>
                <td>${produto.nome}</td>
                <td>${produto.quantidade}</td>
                <td>${produto.quantidadeMinima}</td>
                <td>R$ ${produto.preco.toFixed(2)}</td>
                <td>Crítico</td>
            </tr>
        `;
    });
}

// Iniciar dashboard
atualizarDashboard();

