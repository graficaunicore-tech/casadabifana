const API = "https://script.google.com/macros/s/AKfycbxf1EVkMulRizWsDcje1T1LAIh597qBgScLEk8_pVs8dNTvoFJnpjZ9FqUOWJJYkwF1bg/exec";

let categorias = [];
const adicionais = [
  { nome: "Bacon", preco: 10 },
  { nome: "Calabresa", preco: 8 },
  { nome: "Frango Desfiado", preco: 8.5 },
  { nome: "Mussarela", preco: 8 },
  { nome: "Presunto", preco: 7 },
  { nome: "Bife de Picanha", preco: 7 },
  { nome: "Bife de Boi", preco: 6 },
  { nome: "Catupiry", preco: 7 },
  { nome: "Cheddar", preco: 7 },
  { nome: "Cebola Caramelizada", preco: 5 },
  { nome: "Ovo", preco: 5 },
  { nome: "Banana", preco: 4 },
  { nome: "Abacaxi", preco: 4.5 },
  { nome: "Molho Verde", preco: 2 },
];

let bairros = [
  { nome: "Amaro Lanari", taxa: 0 }
]

let carrinho = [];
let total = 0;

// ACCORDION ANIMADO
document.querySelectorAll(".toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const categoria = btn.parentElement;
    const content = btn.nextElementSibling;

    categoria.classList.toggle("ativa");

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

// ADD ITEM COM FEEDBACK
function addItem(nome, preco) {
  const itemExistente = carrinho.find(item => item.nome === nome);

  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    carrinho.push({
      nome,
      preco,
      quantidade: 1
    });
  }

  atualizarCarrinho();
}

function aumentarQuantidade(index) {
  carrinho[index].quantidade++;
  atualizarCarrinho();
}

function diminuirQuantidade(index) {
  if (carrinho[index].quantidade > 1) {
    carrinho[index].quantidade--;
  } else {
    carrinho.splice(index, 1); // remove se zerar
  }

  atualizarCarrinho();
}

// ATUALIZA
function atualizarCarrinho() {
  let lista = document.getElementById("itens");
  lista.innerHTML = "";

  total = 0;

  carrinho.forEach((item, index) => {
    total += item.preco * item.quantidade;

    lista.innerHTML += `
  <div class="carrinho-item">
    <span>${item.nome}</span>

    <div class="direita">
      <div class="controle">
<button onclick="diminuirQuantidade(${index})">
  <i data-lucide="minus"></i>
</button>

<span>${item.quantidade}</span>

<button onclick="aumentarQuantidade(${index})">
  <i data-lucide="plus"></i>
</button>
      </div>

      <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
    </div>
  </div>
`;
  });

  document.getElementById("total").innerText = total.toFixed(2);

  const carrinhoEl = document.querySelector(".carrinho");

  if (carrinho.length === 0) {
    carrinhoEl.classList.remove("ativo");
  } else {
    carrinhoEl.classList.add("ativo");
  }


  lucide.createIcons();
}

// CHECKOUT SLIDE
function abrirCheckout() {
  document.getElementById("checkout").classList.add("ativo");
}



function atualizarStatusLoja() {
  const agora = new Date();
  const dia = agora.getDay(); // 0 = domingo, 1 = segunda...
  const hora = agora.getHours();
  const minutos = agora.getMinutes();

  const horarioAtual = hora + minutos / 60;

  const abre = 18;
  const fecha = 23.5; // 23:30

  const status = document.getElementById("statusLoja");

  // TERÇA FECHADO
  if (dia === 2) {
    status.className = "status fechado";
    status.innerText = "Fechado hoje. Abre quarta às 18h";
    return;
  }

  // ANTES DE ABRIR
  if (horarioAtual < abre) {
    status.className = "status aviso";
    status.innerText = "Abre hoje às 18h • Agende seu pedido";
    return;
  }

  // ABERTO
  if (horarioAtual >= abre && horarioAtual <= fecha) {
    status.className = "status aberto";
    status.innerText = "Aberto agora até 23:30";
    return;
  }

  // DEPOIS QUE FECHOU
  let proximoDia = dia + 1;

  if (proximoDia === 2) {
    status.className = "status fechado";
    status.innerText = "Fechado. Abre quarta às 18h";
  } else {
    status.className = "status fechado";
    status.innerText = "Fechado. Abre amanhã às 18h";
  }
}

// RODA AO CARREGAR
atualizarStatusLoja();

function fecharCheckout() {
  document.getElementById("checkout").classList.remove("ativo");
}

function removerItem(index) {
  let item = carrinho[index];

  // remove do total
  total -= item.preco;

  // remove do array
  carrinho.splice(index, 1);

  atualizarCarrinho();

  navigator.vibrate?.(30);
}

const pagamentoSelect = document.getElementById("pagamento");
const trocoInput = document.getElementById("troco");

function verificarPagamento() {
  if (pagamentoSelect.value === "Dinheiro") {
    trocoInput.style.display = "block";
  } else {
    trocoInput.style.display = "none";
    trocoInput.value = "";
  }
}

// roda quando mudar
pagamentoSelect.addEventListener("change", verificarPagamento);

// 🔥 roda ao carregar a página
verificarPagamento();

// CAMPOS
const nomeInput = document.getElementById("nome");
const enderecoInput = document.getElementById("endereco");

// SALVAR AUTOMATICAMENTE
function salvarDados() {
  localStorage.setItem("nomeCliente", nomeInput.value);
  localStorage.setItem("enderecoCliente", enderecoInput.value);
}

// dispara ao digitar
nomeInput.addEventListener("input", salvarDados);
enderecoInput.addEventListener("input", salvarDados);

function carregarDados() {
  const nomeSalvo = localStorage.getItem("nomeCliente");
  const enderecoSalvo = localStorage.getItem("enderecoCliente");

  if (nomeSalvo) nomeInput.value = nomeSalvo;
  if (enderecoSalvo) enderecoInput.value = enderecoSalvo;
}

// roda quando carregar
carregarDados();

const track = document.querySelector(".carousel-track");

let isDown = false;
let startX;
let scrollLeft;



function renderizarMenu() {
  const menu = document.getElementById("menu");
  menu.innerHTML = "";

  categorias.forEach(categoria => {
    let htmlItens = "";

    categoria.itens.forEach(item => {

      let adicionaisHTML = "";

      if (categoria.adicionais) {
        adicionaisHTML = `
          <div class="adicionais-container">

            <button class="btn-add" onclick="toggleDropdown(this)">
              + Adicionais
            </button>

            <div class="adicionais-box" style="display:none;">
              ${adicionais.map((add, index) => `
                <label>
                  <input type="checkbox" value="${index}" onchange="atualizarPrecoAdicionais(this.closest('.item'))">
                  ${add.nome} (+R$${add.preco})
                </label>
              `).join("")}
            </div>

          </div>
        `;
      }

      htmlItens += `
  <div class="item">
   <div class="info-produto">
  <span class="nome">${item.nome}</span>
  ${item.descricao ? `<small class="descricao">${item.descricao}</small>` : ""}
</div>

<div class="linha-topo">

  <div class="info-esquerda">
    <span class="preco">R$ ${item.preco.toFixed(2)}</span>
  </div>

  <div class="acoes-direita">
    ${categoria.adicionais ? `
      <button class="btn-add" onclick="toggleDropdown(this)">
        + Adicionais
      </button>
    ` : ""}

    <button class="btn-carrinho"
      data-preco-base="${item.preco}"
      onclick="addItemComAdicionais(this, '${item.nome}', ${item.preco})">
      Adicionar
    </button>
  </div>

</div>

    ${categoria.adicionais ? `
      <div class="adicionais-box" style="display:none;">
        ${adicionais.map((add, index) => `
          <label>
<input type="checkbox" value="${index}" onchange="atualizarPrecoAdicionais(this.closest('.item'))">            ${add.nome} (+R$${add.preco})
          </label>
        `).join("")}
      </div>
    ` : ""}

  </div>
`;
    });

    menu.innerHTML += `
      <div class="categoria">
        <button class="toggle">${categoria.nome}</button>
        <div class="conteudo">
          ${htmlItens}
        </div>
      </div>
    `;
  });

  // accordion
  document.querySelectorAll(".toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const categoria = btn.parentElement;
      const content = btn.nextElementSibling;

      categoria.classList.toggle("ativa");

      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}

function toggleDropdown(botao) {
  const itemDiv = botao.closest(".item");
  const box = itemDiv.querySelector(".adicionais-box");

  const categoria = botao.closest(".categoria");
  const content = categoria.querySelector(".conteudo");

  const isOpen = box.style.display === "block";

  box.style.display = isOpen ? "none" : "block";

  // 🔥 RECALCULA ALTURA
  setTimeout(() => {
    content.style.maxHeight = content.scrollHeight + "px";
  }, 100);
}

function addItemComAdicionais(botao, nome, preco) {
  const itemDiv = botao.closest(".item"); // 🔥 mais confiável

  const checkboxes = itemDiv.querySelectorAll(".adicionais-box input:checked");

  let adicionaisSelecionados = [];
  let totalAdicionais = 0;

  checkboxes.forEach(cb => {
    const add = adicionais[cb.value];
    adicionaisSelecionados.push(add.nome);
    totalAdicionais += add.preco;
  });

  let nomeFinal = nome;

  if (adicionaisSelecionados.length > 0) {
    nomeFinal += " + " + adicionaisSelecionados.join(", ");
  }

  const precoFinal = preco + totalAdicionais;

  // 🔥 AQUI resolve o problema de duplicação correta
  const itemExistente = carrinho.find(item => item.nome === nomeFinal);

  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    carrinho.push({
      nome: nomeFinal,
      preco: precoFinal,
      quantidade: 1
    });
  }

  atualizarCarrinho();

  // 🔥 limpa seleção depois de adicionar
  checkboxes.forEach(cb => cb.checked = false);

  const box = itemDiv.querySelector(".adicionais-box");
  if (box) box.style.display = "none";

  // 🔥 resetar preço do botão
  const precoEl = itemDiv.querySelector(".preco");
  const precoBase = parseFloat(botao.dataset.precoBase);

  precoEl.innerText = `R$ ${precoBase.toFixed(2)}`;
}
function toggleAdicionais(checkbox) {
  const container = checkbox.closest(".adicionais-container");
  const box = container.querySelector(".adicionais-box");

  if (checkbox.checked) {
    box.style.display = "block";
  } else {
    box.style.display = "none";

    // desmarca tudo ao fechar (melhor UX)
    box.querySelectorAll("input[type='checkbox']").forEach(cb => {
      cb.checked = false;
    });
  }
}



function carregarBairros() {
  const select = document.getElementById("bairro");

  select.innerHTML = "";

  bairros.forEach((b, index) => {
    select.innerHTML += `
      <option value="${index}">
        ${b.nome} ${b.taxa > 0 ? `(+R$${b.taxa})` : "(Grátis)"}
      </option>
    `;
  });
}

function enviarWhats() {
  const nome = document.getElementById("nome").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const bairroIndex = document.getElementById("bairro").value;
  const pagamento = document.getElementById("pagamento").value;
  const troco = document.getElementById("troco").value;
  const observacoes = document.getElementById("observacoes").value.trim();

  if (!nome || !endereco || carrinho.length === 0) {
    alert("Preencha os dados e adicione itens ao carrinho.");
    return;
  }

  const bairro = bairros[bairroIndex];

  let mensagem = `*Pedido*\n\n`;

  carrinho.forEach(item => {
    mensagem += `- ${item.nome} x${item.quantidade} (R$${item.preco.toFixed(2)})\n`;
  });

  mensagem += `\n*Total:* R$${total.toFixed(2)}`;

  if (bairro.taxa > 0) {
    mensagem += `\n*Entrega:* R$${bairro.taxa.toFixed(2)}`;
    mensagem += `\n*Total com entrega:* R$${(total + bairro.taxa).toFixed(2)}`;
  }

  mensagem += `\n\n*Nome:* ${nome}`;
  mensagem += `\n*Endereço:* ${endereco}`;
  mensagem += `\n*Bairro:* ${bairro.nome}`;
  mensagem += `\n*Pagamento:* ${pagamento}`;

  if (pagamento === "Dinheiro" && troco) {
    mensagem += `\n*Troco para:* R$${troco}`;
  }

  if (observacoes) {
    mensagem += `\n*Observações:* ${observacoes}`;
  }

  const url = `https://wa.me/553187018834?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
}



navigator.vibrate?.(30);

function atualizarPrecoAdicionais(itemDiv) {
  const precoEl = itemDiv.querySelector(".preco");
  const botao = itemDiv.querySelector(".btn-carrinho");
  const precoBase = parseFloat(botao.dataset.precoBase);

  const checkboxes = itemDiv.querySelectorAll(".adicionais-box input:checked");

  let totalAdicionais = 0;

  checkboxes.forEach(cb => {
    const add = adicionais[cb.value];
    totalAdicionais += add.preco;
  });

  const precoFinal = precoBase + totalAdicionais;

  precoEl.innerText = `R$ ${precoFinal.toFixed(2)}`;
}

async function carregarProdutosDaPlanilha() {
  const resposta = await fetch(API + "?acao=listar");
  const data = await resposta.json();

  const grupos = {};

  data.produtos.forEach(produto => {
    const categoria = produto.categoria;
    const nome = produto.nome;
    const preco = Number(produto.preco);
    const temAdicionais = produto.adicionais === true;

    if (!grupos[categoria]) {
      grupos[categoria] = {
        nome: categoria,
        adicionais: temAdicionais,
        itens: []
      };
    }

    grupos[categoria].itens.push({
      nome,
      preco,
      descricao: produto.descricao || ""
    });
  });

  categorias = Object.values(grupos);

  renderizarMenu();
  carregarBairros();
}

function limpar(valor) {
  return valor.replaceAll('"', '').trim();
}

// chama ao carregar
carregarProdutosDaPlanilha();

document.getElementById("loading").style.display = "none";
