Uma painel CRUD para estoque de produtos. 



Nome
  ID - 
  Peso
  Autor
  Categoria
  Status
  valor
  TAG_DISPONIBILIDADE

Evitar a duplicidade de categorias



let listaCategorias = []


let categoria = {
	id_categoria;        <- inteiro
	 nome_categoria; <- string
}

**Planejamento de funções (CRUD):**

**adicionarCategoria(categoria)**
	 
**removerCategoria(categoria)**
	 Permite ao usuário remover a categoria pelo nome
**atualizarCategoria(categoria)**
	 Permite ao usuário atualizar categorias existentes
	
**listarCategorias(categoria)**
	 Lista as categorias existentes


buscarCategoria()



**Detalhamento:**

categoriaExiste(categoria) {
    let categoriaExiste = false;

    if (listaCategorias.includes(categoria.id_categoria)) {
        categoriaExiste = true;
    }

    return categoriaExiste;
}

**adicionarCategoria(categoria)**{
	  if (!categoriaExiste(categoria)){
		  listaCategorias.push(categoria)
	  } else {
		  // Aviso: categoria já existente
	  }
}

removerCategoria(categoria){
	 if (categoriaExiste(categoria)){
		 listaCategorias.pop(categoria)
	 } 
}

atualizarCategoria(categoriaAtual, categoriaAtualizada){
		let indice = listaCategorias.findIndex( item => item.id_categoria === categoriaAtual.id_categoria );

		if (indice != -1){
			listaCategoria[indice] = categoriaAtualizada;
		}
}

buscarCategoria(nome_categoria){
	listaCategorias.forEach()
}