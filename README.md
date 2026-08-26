# Estoque Fácil

Sistema de controle de estoque desenvolvido com **HTML, CSS e JavaScript puro**. A aplicação funciona totalmente no navegador e utiliza `localStorage` para persistir categorias e produtos.

## Demonstração

GitHub Pages: https://daniel-verli.github.io/Sistema-de-estoque/

## Funcionalidades

- Dashboard com quantidade de produtos, itens em estoque crítico e valor total em estoque.
- Cadastro, edição, exclusão, busca e filtro de produtos.
- Cadastro, edição, exclusão e busca de categorias.
- Exclusão em cascata: ao excluir uma categoria, os produtos vinculados a ela também são removidos.
- Sincronização do nome da categoria nos produtos após edição.
- Persistência local dos dados pelo `localStorage`.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- LocalStorage
- Git e GitHub
- GitHub Pages

## Estrutura

```text
Sistema-de-estoque/
├── index.html
├── README.md
└── src/
    ├── images/
    ├── pages/
    │   ├── categorias.html
    │   └── produtos.html
    ├── scripts/
    │   ├── index.js
    │   ├── page_categorias/
    │   │   └── categorias.js
    │   └── page_produtos/
    │       └── produtos.js
    └── styles/
        ├── categorias.css
        ├── index.css
        └── produtos.css
```

## Como usar

1. Abra **Categorias** e cadastre pelo menos uma categoria.
2. Abra **Produtos** e clique em **Cadastrar produto**.
3. Preencha os dados e escolha uma das categorias cadastradas.
4. Retorne ao **Dashboard** para visualizar os indicadores.

## Observação sobre os dados

Os dados são gravados apenas no navegador usado para acessar o sistema. Como o projeto não possui servidor nem banco de dados, dados salvos em outro navegador, computador ou domínio não são compartilhados automaticamente.

## Desenvolvimento

Projeto desenvolvido em dupla. O trabalho inclui construção das páginas do sistema e implementação das funcionalidades de gerenciamento de estoque.
