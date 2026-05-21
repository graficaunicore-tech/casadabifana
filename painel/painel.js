const API = "https://script.google.com/macros/s/AKfycbxvlYy5ne6ERiknhrlylLIsut-bcTzJiCrLw_gFcUbTh_MwdXSfMT4BQ_YuQ1yy3MECuA/exec";

let senhaGlobal = "1234";
let produtos = [];

window.addEventListener("load", () => {

    const senhaSalva = localStorage.getItem("senhaPainelTony");

    if (senhaSalva === "1234") {

        senhaGlobal = senhaSalva;

        document.getElementById("login").style.display = "none";
        document.getElementById("painel").style.display = "block";

        carregarProdutos();
    }

});

function entrar() {
    senhaGlobal = document.getElementById("senha").value.trim();
    localStorage.setItem("senhaPainelTony", senhaGlobal);

    if (senhaGlobal !== "1234") {
        alert("Senha incorreta");
        return;
    }

    document.getElementById("login").style.display = "none";
    document.getElementById("painel").style.display = "block";

    carregarProdutos();
}

async function carregarProdutos() {
    const lista = document.getElementById("lista");
    lista.innerHTML = "Carregando...";

    const res = await fetch(API + "?acao=listar");
    const data = await res.json();

    produtos = data.produtos || [];
    renderizarProdutos();
}

function abrirFormulario() {
    const lista = document.getElementById("lista");

    const formNovo = `
    <div class="card novo-card">
      <h2>Novo produto</h2>

      <label>Categoria</label>

        <select id="categoriaSelect-novo">
        ${montarOptionsCategoria()}
        </select>

        <input id="novaCategoria-novo" placeholder="Digite a nova categoria" style="display:none;">

        <button class="cinza" onclick="usarNovaCategoria('novo')">
        + Criar nova categoria
        </button>

        <button class="cinza" onclick="usarCategoriaExistente('novo')">
        Usar categoria existente
        </button>

      <label>Nome</label>
      <input id="novoNome" placeholder="Ex: Boi (Alcatra)">

      <label>Preço</label>
      <input id="novoPreco" type="number" step="0.01" placeholder="Ex: 12">

      <label>Descrição</label>
      <textarea id="novoDescricao" placeholder="Ex: 160g de alcatra assado na brasa."></textarea>

      <label class="check">
        <input id="novoAdicionais" type="checkbox">
        Permitir adicionais
      </label>

      <button onclick="adicionarProduto()">Salvar novo produto</button>
      <button class="cinza" onclick="carregarProdutos()">Cancelar</button>
    </div>
  `;

    lista.innerHTML = formNovo + lista.innerHTML;
}

function renderizarProdutos() {
    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    produtos.forEach(p => {

        lista.innerHTML += `
      <div class="card">

        <div class="visualizacao" id="view-${p.id}">
          <div class="card-topo">

            <div>
              <div class="nome">${p.nome}</div>

              <div class="categoria">
                ${p.categoria}
              </div>

              ${p.descricao ? `
                <div class="descricao-card">
                  ${p.descricao}
                </div>
              ` : ""}

            </div>

            <div class="preco">
              R$ ${Number(p.preco).toFixed(2)}
            </div>

          </div>

          <span class="tag">
            ${p.adicionais ? "Com adicionais" : "Sem adicionais"}
          </span>

          <div class="acoes">
            <button onclick="abrirEdicao(${p.id})">
              Editar
            </button>

            <button class="remover" onclick="removerProduto(${p.id})">
              Remover
            </button>
          </div>
        </div>

        <div class="edicao" id="edit-${p.id}" style="display:none;">

          <label>Categoria</label>

            <select id="categoriaSelect-${p.id}">
            ${montarOptionsCategoria(p.categoria)}
            </select>

            <input id="novaCategoria-${p.id}" placeholder="Digite a nova categoria" style="display:none;">

            <button class="cinza" onclick="usarNovaCategoria(${p.id})">
            + Criar nova categoria
            </button>

            <button class="cinza" onclick="usarCategoriaExistente(${p.id})">
            Usar categoria existente
            </button>
            
          <label>Nome</label>
          <input id="nome-${p.id}" value="${p.nome}">

          <label>Preço</label>
          <input id="preco-${p.id}" type="number" step="0.01" value="${p.preco}">

          <label>Descrição</label>
          <textarea id="descricao-${p.id}">${p.descricao || ""}</textarea>

          <label class="check">
            <input id="adicionais-${p.id}" type="checkbox"
              ${p.adicionais ? "checked" : ""}>
            Permitir adicionais
          </label>

          <div class="acoes">
            <button onclick="salvarEdicao(${p.id})">
              Salvar
            </button>

            <button class="cinza" onclick="cancelarEdicao(${p.id})">
              Cancelar
            </button>
          </div>

        </div>

      </div>
    `;
    });
}

function abrirEdicao(id) {
    document.getElementById(`view-${id}`).style.display = "none";
    document.getElementById(`edit-${id}`).style.display = "block";
}

function cancelarEdicao(id) {
    document.getElementById(`view-${id}`).style.display = "block";
    document.getElementById(`edit-${id}`).style.display = "none";
}

async function adicionarProduto() {
    let categoria = document.getElementById("novaCategoria-novo").value.trim();

    if (!categoria) {
        categoria = document.getElementById("categoriaSelect-novo").value.trim();
    }
    const nome = document.getElementById("novoNome").value.trim();
    const preco = document.getElementById("novoPreco").value;
    const descricao = document.getElementById("novoDescricao").value.trim();
    const adicionais = document.getElementById("novoAdicionais").checked;

    if (!categoria || !nome || !preco) {
        alert("Preencha categoria, nome e preço.");
        return;
    }

    const resposta = await fetch(API, {
        method: "POST",
        body: JSON.stringify({
            acao: "adicionar",
            categoria,
            nome,
            preco,
            descricao,
            adicionais,
            senha: senhaGlobal
        })
    });

    const data = await resposta.json();

    if (!data.sucesso) {
        alert(data.erro || "Erro ao adicionar.");
        return;
    }

    carregarProdutos();
}

async function salvarEdicao(id) {
    let categoria = document.getElementById(`novaCategoria-${id}`).value.trim();

    if (!categoria) {
        categoria = document.getElementById(`categoriaSelect-${id}`).value.trim();
    }
    const nome = document.getElementById(`nome-${id}`).value.trim();
    const preco = document.getElementById(`preco-${id}`).value;
    const descricao = document.getElementById(`descricao-${id}`).value.trim();
    const adicionais = document.getElementById(`adicionais-${id}`).checked;

    if (!categoria || !nome || !preco) {
        alert("Preencha categoria, nome e preço.");
        return;
    }

    const resposta = await fetch(API, {
        method: "POST",
        body: JSON.stringify({
            acao: "editar",
            id,
            categoria,
            nome,
            preco,
            descricao,
            adicionais,
            senha: senhaGlobal
        })
    });

    const data = await resposta.json();

    if (!data.sucesso) {
        alert(data.erro || "Erro ao salvar.");
        return;
    }

    alert("Produto salvo!");
    carregarProdutos();
}

async function removerProduto(id) {
    if (!confirm("Tem certeza que deseja remover este produto?")) return;

    const resposta = await fetch(API, {
        method: "POST",
        body: JSON.stringify({
            acao: "remover",
            id,
            senha: senhaGlobal
        })
    });

    const data = await resposta.json();

    if (!data.sucesso) {
        alert(data.erro || "Erro ao remover.");
        return;
    }

    carregarProdutos();
}

function obterCategorias() {
    return [...new Set(produtos.map(p => p.categoria))];
}

function montarOptionsCategoria(categoriaAtual = "") {
    const categorias = obterCategorias();

    return categorias.map(cat => `
    <option value="${cat}" ${cat === categoriaAtual ? "selected" : ""}>
      ${cat}
    </option>
  `).join("");
}

function usarNovaCategoria(id) {
    document.getElementById(`categoriaSelect-${id}`).style.display = "none";
    document.getElementById(`novaCategoria-${id}`).style.display = "block";
}

function usarCategoriaExistente(id) {
    document.getElementById(`categoriaSelect-${id}`).style.display = "block";
    document.getElementById(`novaCategoria-${id}`).style.display = "none";
    document.getElementById(`novaCategoria-${id}`).value = "";
}

function sair() {
    localStorage.removeItem("senhaPainelTony");
    location.reload();
}