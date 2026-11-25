(function () {
    const inscricaoVazio = document.getElementById("inscricao-vazio");
    const inscricaoConteudo = document.getElementById("inscricao-conteudo");
    const inscricaoConfirmada = document.getElementById("inscricao-confirmada");
    const resumoEvento = document.getElementById("resumo-evento");
    const formulario = document.getElementById("formulario-inscricao");
    const campoNome = document.getElementById("campo-nome");
    const campoEmail = document.getElementById("campo-email");
    const campoSetor = document.getElementById("campo-setor");
    const codigoConfirmacao = document.getElementById("codigo-confirmacao");
    const resumoSetorConfirmado = document.getElementById("resumo-setor-confirmado");
    const linkVoltarEvento = document.getElementById("link-voltar-evento");

    const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let eventoAtual;

    function obterIdDaUrl() {
        return new URLSearchParams(window.location.search).get("id");
    }

    function renderizarResumo(evento) {
        resumoEvento.innerHTML = "";

        const intro = document.createElement("p");
        intro.className = "local-evento";
        intro.textContent = "Você está reservando ingresso para:";

        const titulo = document.createElement("h1");
        titulo.className = "titulo-evento";
        titulo.textContent = evento.titulo;

        const atracao = document.createElement("p");
        atracao.className = "atracao-principal";
        atracao.textContent = "Line-up: " + (evento.bandaPrincipal || "Atrações Confirmadas");

        const etiquetas = document.createElement("header");
        etiquetas.className = "etiquetas-cartao";

        const categoria = document.createElement("span");
        categoria.className = "categoria-evento";
        categoria.textContent = evento.categoria;
        etiquetas.appendChild(categoria);

        const data = document.createElement("time");
        data.className = "data-evento";
        data.textContent = EventosAPI.formatarData(evento.dataISO) + " • " + evento.horario;
        etiquetas.appendChild(data);

        const local = document.createElement("p");
        local.className = "local-evento";
        local.textContent = evento.local + ", " + evento.enderecoCompleto;

        resumoEvento.appendChild(intro);
        resumoEvento.appendChild(titulo);
        resumoEvento.appendChild(atracao);
        resumoEvento.appendChild(etiquetas);
        resumoEvento.appendChild(local);
    }

    async function carregarEvento() {
        await EventosAPI.sincronizarComSupabase();
        const id = obterIdDaUrl();
        eventoAtual = id ? EventosAPI.buscarEventoPorId(id) : undefined;

        if (!eventoAtual) {
            inscricaoVazio.hidden = false;
            return;
        }

        renderizarResumo(eventoAtual);
        inscricaoConteudo.hidden = false;
    }

    function exibirErro(campo, mensagemId, mensagem) {
        const erro = document.getElementById(mensagemId);
        erro.textContent = mensagem;
        erro.hidden = false;
        campo.classList.add("invalido");
    }

    function limparErro(campo, mensagemId) {
        const erro = document.getElementById(mensagemId);
        erro.hidden = true;
        campo.classList.remove("invalido");
    }

    function validarFormulario() {
        let valido = true;

        if (campoNome.value.trim().length < 3) {
            exibirErro(campoNome, "erro-nome", "Digite seu nome com pelo menos 3 letras.");
            valido = false;
        } else {
            limparErro(campoNome, "erro-nome");
        }

        if (!REGEX_EMAIL.test(campoEmail.value.trim())) {
            exibirErro(campoEmail, "erro-email", "Digite um e-mail válido para receber o ingresso.");
            valido = false;
        } else {
            limparErro(campoEmail, "erro-email");
        }

        return valido;
    }

    async function tratarEnvio(evento) {
        evento.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        const resultado = await EventosAPI.inscreverEvento(eventoAtual.id, {
            nome: campoNome.value.trim(),
            email: campoEmail.value.trim(),
            setorIngresso: campoSetor ? campoSetor.value : "Pista Rock"
        });

        codigoConfirmacao.textContent = resultado.codigoConfirmacao;
        if (resumoSetorConfirmado) {
            resumoSetorConfirmado.textContent = "Titular: " + resultado.nome + " | Setor: " + resultado.setorIngresso;
        }
        linkVoltarEvento.href = "evento.html?id=" + encodeURIComponent(eventoAtual.id);

        inscricaoConteudo.hidden = true;
        inscricaoConfirmada.hidden = false;
    }

    function inicializar() {
        carregarEvento();
        formulario.addEventListener("submit", tratarEnvio);
        campoNome.addEventListener("input", function () {
            limparErro(campoNome, "erro-nome");
        });
        campoEmail.addEventListener("input", function () {
            limparErro(campoEmail, "erro-email");
        });
    }

    inicializar();
})();
