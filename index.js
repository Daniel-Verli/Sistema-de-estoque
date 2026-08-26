// Atualiza os indicadores do dashboard usando os produtos salvos no localStorage.
(() => {
    'use strict';

    const totalProdutos = document.getElementById('totalProdutos');
    const qtdAbaixoMinimo = document.getElementById('qtdAbaixoMinimo');
    const valorTotalEstoque = document.getElementById('valorTotalEstoque');
    const tabelaCriticosBody = document.getElementById('tabelaCriticosBody');

    function lerProdutos() {
        try {
            const produtos = JSON.parse(localStorage.getItem('produtos'));
            return Array.isArray(produtos) ? produtos : [];
        } catch (erro) {
            console.error('Erro ao carregar produtos:', erro);
            return [];
        }
    }

    function moeda(valor) {
        return Number(valor || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    function escaparHTML(texto) {
        return String(texto)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function atualizarDashboard() {
        const produtos = lerProdutos();
        const criticos = produtos.filter(
            produto => Number(produto.quantidade) <= Number(produto.quantidadeMinima)
        );
        const valorTotal = produtos.reduce(
            (total, produto) => total + Number(produto.quantidade || 0) * Number(produto.preco || 0),
            0
        );

        totalProdutos.textContent = String(produtos.length);
        qtdAbaixoMinimo.textContent = String(criticos.length);
        valorTotalEstoque.textContent = moeda(valorTotal);
        tabelaCriticosBody.innerHTML = '';

        if (criticos.length === 0) {
            tabelaCriticosBody.innerHTML = '<tr><td colspan="5">Nenhum produto crítico.</td></tr>';
            return;
        }

        criticos.forEach(produto => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${escaparHTML(produto.nome)}</td>
                <td>${Number(produto.quantidade)}</td>
                <td>${Number(produto.quantidadeMinima)}</td>
                <td>${moeda(produto.preco)}</td>
                <td>Crítico</td>
            `;
            tabelaCriticosBody.appendChild(linha);
        });
    }

    atualizarDashboard();
})();
