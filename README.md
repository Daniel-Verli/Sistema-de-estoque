# Estoque Fácil

Sistema de controle de estoque desenvolvido com HTML, CSS e JavaScript puro. A aplicação permite acompanhar produtos, categorias e itens com estoque abaixo do mínimo diretamente no navegador.

## Estado atual

- Aplicação frontend estática, sem servidor ou banco de dados.
- Dados persistidos no `localStorage` do navegador.
- Não há autenticação real: o botão `Logout` apenas exibe um alerta.
- As páginas compartilham os dados quando são abertas na mesma origem do navegador.

## Como executar

1. Abra o projeto no VS Code ou outro editor.
2. Inicie um servidor HTTP local, como a extensão Live Server.
3. Acesse `index.html` pelo endereço fornecido pelo servidor.

O servidor local é recomendado porque a aplicação usa JavaScript e `localStorage`. A página inicial do projeto é `index.html`, na raiz do repositório.

Não existem dependências externas, `package.json`, processo de build ou suíte de testes configurada.

## Funcionalidades

### Dashboard

Arquivos: `index.html`, `src/scripts/index.js` e `src/styles/index.css`.

- Exibe a quantidade total de produtos cadastrados.
- Conta produtos cujo estoque atual é menor ou igual à quantidade mínima.
- Calcula o valor total do estoque com `quantidade * preco`.
- Lista os produtos em situação crítica com nome, quantidade atual, quantidade mínima, preço unitário e status.
- Disponibiliza navegação para Dashboard, Produtos e Categorias.
- O botão Logout mostra um alerta, mas não encerra uma sessão.

O script lê a chave `produtos` do `localStorage` e atualiza os indicadores quando a página é carregada. O CSS organiza o menu lateral, os cards e a tabela.

### Produtos

Arquivos: `src/pages/produtos.html`, `src/scripts/page_produtos/produtos.js` e `src/styles/produtos.css`.

A tabela apresenta ID, nome, categoria, quantidade, quantidade mínima, status, preço e ações.

#### Cadastro

- Abre pelo botão `Cadastrar produto`.
- A categoria é carregada a partir da chave `categorias`.
- Campos disponíveis: nome, categoria, quantidade, quantidade mínima e preço.
- Nome e categoria são obrigatórios.
- O registro recebe um ID baseado em `Date.now()` e é salvo em `localStorage`.

#### Edição e exclusão

- O ícone de edição abre um modal preenchido com os dados do produto.
- Salvar alterações substitui o registro existente pelo mesmo ID.
- O ícone de exclusão solicita confirmação antes de remover o produto.
- Os modais podem ser fechados pelos botões correspondentes.

#### Busca e filtros

- Busca produtos pelo nome, ignorando maiúsculas, minúsculas e acentos.
- Filtra por categoria.
- Filtra por status: `Crítico` ou `Normal`.
- Os filtros podem ser combinados.
- `Limpar` remove a busca e os filtros ativos.
- Pressionar Enter no campo de busca executa a busca.

O status é calculado assim:

```text
Crítico: quantidade <= quantidadeMinima
Normal:  quantidade > quantidadeMinima
```

Ao carregar a tabela, produtos cuja categoria não existe mais são removidos do armazenamento. A listagem é renderizada do mais recente para o mais antigo.

### Categorias

Arquivos: `src/pages/categorias.html`, `src/scripts/page_categorias/categoria.js`, `src/scripts/page_categorias/operaçõesTabelaCategorias.js` e `src/styles/categorias.css`.

- Lista ID, nome da categoria e ações.
- Adiciona categoria pelo campo inferior ou pressionando Enter.
- Impede categoria sem nome.
- Gera o próximo ID usando o maior ID existente mais um.
- Ordena a lista alfabeticamente após alterações.
- Pesquisa categorias por prefixo do nome enquanto o usuário digita.
- Edita o nome usando um prompt e rejeita nomes vazios.
- Remove uma categoria após confirmação.
- Produtos vinculados a uma categoria removida deixam de ser exibidos quando a tela de produtos é carregada.
- Persiste os dados na chave `categorias` do `localStorage`.

## Modelo de dados

### Produto

```js
{
  id: 1710000000000,
  nome: "Teclado",
  id_categoria: 1,
  categoria: "Informática",
  quantidade: 10,
  quantidadeMinima: 3,
  preco: 89.90
}
```

### Categoria

```js
{
  id_categoria: 1,
  nome_categoria: "Informática"
}
```

### Armazenamento

| Chave | Conteúdo |
| --- | --- |
| `produtos` | Array de produtos armazenado em JSON |
| `categorias` | Array de categorias armazenado em JSON |

Para reiniciar os dados durante o desenvolvimento, execute no console do navegador:

```js
localStorage.removeItem("produtos");
localStorage.removeItem("categorias");
```

## Estrutura do projeto

```text
.
├── index.html
├── README.md
├── Esboços/
│   ├── Esboço_filtrarPorBuscaBinaria.txt
│   └── Esboço_filtrarPorPesquisa_produtos.txt
├── ObsidianFiles/
│   └── EstoqueFacil/
│       └── Esboço_categoriasBackend.md
└── src/
    ├── images/page_categorias/
    │   ├── editicon.png
    │   └── removeicon.png
    ├── pages/
    │   ├── index.html
    │   ├── produtos.html
    │   └── categorias.html
    ├── scripts/
    │   ├── index.js
    │   ├── page_produtos/produtos.js
    │   └── page_categorias/
    │       ├── categoria.js
    │       └── operaçõesTabelaCategorias.js
    └── styles/
        ├── index.css
        ├── produtos.css
        └── categorias.css
```

## Responsabilidade dos arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Estrutura do dashboard e navegação principal. |
| `src/pages/produtos.html` | Tabela, filtros e modais de cadastro e edição. |
| `src/pages/categorias.html` | Tabela, busca e formulário de categorias. |
| `src/scripts/index.js` | Indicadores e tabela de produtos críticos. |
| `src/scripts/page_produtos/produtos.js` | CRUD de produtos, filtros, busca e integração com categorias. |
| `src/scripts/page_categorias/categoria.js` | Eventos da interface e renderização da tela de categorias. |
| `src/scripts/page_categorias/operaçõesTabelaCategorias.js` | CRUD, ordenação, busca e persistência de categorias. |
| `src/styles/index.css` | Estilos do dashboard, menu, cards e tabela. |
| `src/styles/produtos.css` | Estilos da tela de produtos, filtros e modais. |
| `src/styles/categorias.css` | Estilos da tela de categorias e botões de ação. |
| `src/images/page_categorias/editicon.png` | Ícone de edição. |
| `src/images/page_categorias/removeicon.png` | Ícone de remoção. |

## Esboços e documentação de apoio

- `Esboços/Esboço_filtrarPorBuscaBinaria.txt`: ideia inicial para busca binária. A implementação atual usa percursos lineares sobre arrays.
- `Esboços/Esboço_filtrarPorPesquisa_produtos.txt`: rascunho de busca por produto, categoria e status. As funções ativas estão em `produtos.js`.
- `ObsidianFiles/EstoqueFacil/Esboço_categoriasBackend.md`: planejamento inicial do CRUD de categorias. O projeto atual continua sem backend.

## Demonstração online com GitHub Pages

O projeto está preparado para ser publicado a partir da raiz do branch `main`. No GitHub, acesse **Settings > Pages**, selecione **Deploy from a branch**, escolha `main` e `/(root)`.

## Limitações conhecidas

- Os dados são locais ao navegador e não são sincronizados entre usuários ou computadores.
- Limpar os dados do site apaga o estoque cadastrado.
- Não há API, banco de dados, autenticação ou controle de sessão.
- A validação de produtos depende principalmente dos atributos HTML (`required`, `min` e `step`) e de validações básicas no JavaScript.
- As páginas precisam compartilhar a mesma origem para acessar o mesmo `localStorage`.
- Alguns textos e comentários antigos podem apresentar caracteres corrompidos por problemas de codificação.

## Próximos passos possíveis

- Criar um backend e banco de dados para persistência compartilhada.
- Centralizar a validação de produtos e categorias.
- Adicionar testes automatizados para CRUD, filtros e cálculo do dashboard.
- Melhorar acessibilidade dos modais e mensagens de validação.
- Corrigir textos com caracteres corrompidos e padronizar os caminhos dos links.
