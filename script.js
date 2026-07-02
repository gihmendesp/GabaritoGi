// ===============================
// GABARITO DA GI v2.0
// PARTE 1 - BASE DO SISTEMA
// ===============================

// Banco de dados
let questoes =
JSON.parse(localStorage.getItem("questoes")) || [];

// Elementos da interface
const lista = document.getElementById("lista");

const disciplina = document.getElementById("disciplina");
const banca = document.getElementById("banca");
const assunto = document.getElementById("assunto");
const concurso = document.getElementById("concurso");
const ano = document.getElementById("ano");
const enunciado = document.getElementById("enunciado");
const resposta = document.getElementById("resposta");

const btnAdicionar = document.getElementById("btnAdicionar");

// Estatísticas
const totalEl = document.getElementById("total");
const respondidasEl = document.getElementById("respondidas");
const acertosEl = document.getElementById("acertos");
const errosEl = document.getElementById("erros");

const progresso = document.getElementById("progresso");
const mensagem = document.getElementById("mensagem");

// Filtros
const filtroTexto = document.getElementById("filtroTexto");
const filtroStatus = document.getElementById("filtroStatus");

// ===============================
// SALVAR NO LOCALSTORAGE
// ===============================

function salvar(){
    localStorage.setItem(
        "questoes",
        JSON.stringify(questoes)
    );
}

// ===============================
// ADICIONAR QUESTÃO
// ===============================

function adicionarQuestao(){

    if(
        !disciplina.value ||
        !banca.value ||
        !assunto.value ||
        !enunciado.value
    ){
        alert("Preencha os campos obrigatórios.");
        return;
    }

    const nova = {
        id: Date.now(),
        disciplina: disciplina.value,
        banca: banca.value,
        assunto: assunto.value,
        concurso: concurso.value,
        ano: ano.value,
        enunciado: enunciado.value,
        resposta: resposta.value,

        status: "nao", // nao, acerto, erro
        favorito: false
    };

    questoes.push(nova);

    salvar();

    limparCampos();

    renderizar();
}

// ===============================
// LIMPAR CAMPOS
// ===============================

function limparCampos(){
    disciplina.value = "";
    banca.value = "";
    assunto.value = "";
    concurso.value = "";
    ano.value = "";
    enunciado.value = "";
    resposta.value = "";
}

// ===============================
// ALTERAR STATUS
// ===============================

function marcarAcerto(id){
    const q = questoes.find(q => q.id === id);
    q.status = "acerto";
    salvar();
    renderizar();
}

function marcarErro(id){
    const q = questoes.find(q => q.id === id);
    q.status = "erro";
    salvar();
    renderizar();
}

// ===============================
// FAVORITO
// ===============================

function toggleFavorito(id){
    const q = questoes.find(q => q.id === id);
    q.favorito = !q.favorito;
    salvar();
    renderizar();
}
// ===============================
// PARTE 2 - RENDERIZAÇÃO + ESTATÍSTICAS
// ===============================

// ===============================
// RENDERIZAR LISTA
// ===============================

function renderizar(){

    lista.innerHTML = "";

    let filtradas = questoes.filter(q => {

        const textoMatch =
        q.enunciado.toLowerCase().includes(
            filtroTexto.value.toLowerCase()
        ) ||
        q.disciplina.toLowerCase().includes(
            filtroTexto.value.toLowerCase()
        ) ||
        q.assunto.toLowerCase().includes(
            filtroTexto.value.toLowerCase()
        );

        const statusMatch =
        filtroStatus.value === "todos" ||
        q.status === filtroStatus.value;

        return textoMatch && statusMatch;
    });

    filtradas.forEach(q => {

        const div = document.createElement("div");

        div.className = "questao";

        div.innerHTML = `
            <strong>${q.disciplina}</strong>
            <small>${q.banca} - ${q.concurso || ""} ${q.ano || ""}</small>

            <p>${q.enunciado}</p>

            <small><strong>Resposta:</strong> ${q.resposta || "—"}</small>

            <small>Status: ${q.status.toUpperCase()}</small>

            <div class="acoes">

                <button class="btn-acerto"
                onclick="marcarAcerto(${q.id})">
                ✔ Acertei
                </button>

                <button class="btn-erro"
                onclick="marcarErro(${q.id})">
                ✖ Errei
                </button>

                <button class="btn-fav"
                onclick="toggleFavorito(${q.id})">
                ⭐ Favorito
                </button>

                <button class="btn-remove"
                onclick="remover(${q.id})">
                🗑 Excluir
                </button>

            </div>
        `;

        lista.appendChild(div);
    });

    atualizarEstatisticas();
}

// ===============================
// REMOVER QUESTÃO
// ===============================

function remover(id){
    questoes = questoes.filter(q => q.id !== id);
    salvar();
    renderizar();
}

// ===============================
// ESTATÍSTICAS
// ===============================

function atualizarEstatisticas(){

    const total = questoes.length;

    const respondidas =
    questoes.filter(q => q.status !== "nao").length;

    const acertos =
    questoes.filter(q => q.status === "acerto").length;

    const erros =
    questoes.filter(q => q.status === "erro").length;

    totalEl.textContent = total;
    respondidasEl.textContent = respondidas;
    acertosEl.textContent = acertos;
    errosEl.textContent = erros;

    let percentual = 0;

    if(respondidas > 0){
        percentual = Math.round((acertos / respondidas) * 100);
    }

    progresso.style.width = percentual + "%";

    // cor da barra
    if(percentual >= 80){
        progresso.style.background = "#22c55e";
        mensagem.textContent = "Excelente desempenho! Você está indo muito bem.";
    }
    else if(percentual >= 60){
        progresso.style.background = "#facc15";
        mensagem.textContent = "Bom desempenho, mas ainda pode melhorar.";
    }
    else{
        progresso.style.background = "#ef4444";
        mensagem.textContent = "Foco nos estudos! Revise os erros.";
    }
}

// ===============================
// EVENTOS
// ===============================

btnAdicionar.addEventListener("click", adicionarQuestao);

filtroTexto.addEventListener("input", renderizar);

filtroStatus.addEventListener("change", renderizar);

// ===============================
// TEMA ESCURO
// ===============================

const toggleTema = document.getElementById("toggleTema");

toggleTema.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// ===============================
// INICIALIZAÇÃO
// ===============================

renderizar();
atualizarEstatisticas();
