(function () {
    const esqueleto = document.getElementById("detalhe-esqueleto");
    const conteudo = document.getElementById("detalhe-conteudo");
    const naoEncontrado = document.getElementById("detalhe-nao-encontrado");
    const migalhaTitulo = document.getElementById("migalha-titulo");

    function obterIdDaUrl() {
        return new URLSearchParams(window.location.search).get("id");
    }

    function criarLinhaInfo(rotulo, valor) {
        const linha = document.createElement("li");
        const forte = document.createElement("strong");
        forte.textContent = rotulo;
        linha.appendChild(forte);
        linha.appendChild(document.createTextNode(valor || "A confirmar"));
        return linha;
    }

    function renderizarDetalhe(evento) {
        const cartao = document.createElement("article");
        cartao.className = "cartao-detalhe";

        const cabecalho = document.createElement("header");
        cabecalho.className = "cabecalho-cartao";

        if (evento.destaque) {
            const destaque = document.createElement("span");
            destaque.className = "selo-destaque";
            destaque.textContent = "Headliner / Destaque";
            cabecalho.appendChild(destaque);
        }

        const data = document.createElement("time");
        data.className = "data-evento";
        data.textContent = EventosAPI.formatarData(evento.dataISO) + " • " + evento.horario;
        cabecalho.appendChild(data);

        const etiquetas = document.createElement("header");
        etiquetas.className = "etiquetas-cartao";

        const categoria = document.createElement("span");
        categoria.className = "categoria-evento";
        categoria.textContent = evento.categoria;
        etiquetas.appendChild(categoria);

        if (evento.vertenteRock) {
            const subgenero = document.createElement("span");
            subgenero.className = "subgenero-rock";
            subgenero.textContent = evento.vertenteRock;
            etiquetas.appendChild(subgenero);
        }

        const titulo = document.createElement("h1");
        titulo.className = "titulo-evento";
        titulo.textContent = evento.titulo;

        const atracao = document.createElement("p");
        atracao.className = "atracao-principal";
        atracao.textContent = "Bandas / Line-up: " + (evento.bandaPrincipal || "Atrações Confirmadas");

        const local = document.createElement("p");
        local.className = "local-evento";
        local.textContent = "Casa de Show: " + evento.local;

        const ocupacao = document.createElement("section");
        ocupacao.className = "info-ocupacao";

        const quantidade = document.createElement("span");
        quantidade.className = "quantidade-vagas";
        quantidade.textContent = evento.vagasRestantes > 0
            ? evento.vagasRestantes + " de " + evento.vagasTotais + " ingressos disponíveis"
            : "Ingressos Esgotados (Sold Out)";

        const percentual = EventosAPI.calcularPercentualOcupacao(evento);
        const percentagem = document.createElement("span");
        percentagem.className = "percentual-vagas";
        percentagem.textContent = percentual + "% vendido";

        const barraProgresso = document.createElement("figure");
        barraProgresso.className = "barra-progresso";
        const preenchimentoProgresso = document.createElement("span");
        preenchimentoProgresso.className = "preenchimento-progresso";
        preenchimentoProgresso.style.width = percentual + "%";
        barraProgresso.appendChild(preenchimentoProgresso);

        ocupacao.appendChild(quantidade);
        ocupacao.appendChild(percentagem);
        ocupacao.appendChild(barraProgresso);

        const descricao = document.createElement("p");
        descricao.className = "descricao-completa";
        descricao.textContent = evento.descricaoCompleta;

        const infoLista = document.createElement("ul");
        infoLista.className = "lista-informacoes";
        infoLista.appendChild(criarLinhaInfo("Abertura dos Portões / Horário", evento.horario));
        infoLista.appendChild(criarLinhaInfo("Endereço da Casa de Show", evento.enderecoCompleto));
        infoLista.appendChild(criarLinhaInfo("Vertente Musical", evento.vertenteRock || "Rock / Metal"));
        infoLista.appendChild(criarLinhaInfo("Classificação Etária", evento.classificacao || "16 anos"));
        infoLista.appendChild(criarLinhaInfo("Produção / Realização", evento.organizador));

        const inscricao = document.createElement("a");
        inscricao.className = "botao-principal";
        inscricao.href = "inscricao.html?id=" + encodeURIComponent(evento.id);
        inscricao.textContent = evento.vagasRestantes > 0
            ? "Garantir meu Ingresso / Inscrição"
            : "Lista de Espera / Reservar";

        cartao.appendChild(cabecalho);
        cartao.appendChild(etiquetas);
        cartao.appendChild(titulo);
        cartao.appendChild(atracao);
        cartao.appendChild(local);
        cartao.appendChild(ocupacao);
        cartao.appendChild(descricao);
        cartao.appendChild(infoLista);
        cartao.appendChild(inscricao);

        conteudo.innerHTML = "";
        conteudo.appendChild(cartao);

        migalhaTitulo.textContent = evento.titulo;
        document.title = evento.titulo + " | Arena Rock";
    }

    function exibirNaoEncontrado() {
        esqueleto.hidden = true;
        conteudo.hidden = true;
        naoEncontrado.hidden = false;
        migalhaTitulo.textContent = "Show não encontrado";
    }

    async function inicializar() {
        const id = obterIdDaUrl();
        await EventosAPI.sincronizarComSupabase();

        setTimeout(function () {
            const evento = id ? EventosAPI.buscarEventoPorId(id) : undefined;

            esqueleto.hidden = true;

            if (!evento) {
                exibirNaoEncontrado();
                return;
            }

            renderizarDetalhe(evento);
            conteudo.hidden = false;
        }, 200);
    }

    inicializar();
})();
