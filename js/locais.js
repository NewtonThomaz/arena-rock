(function () {
    const listaLocais = document.getElementById("lista-locais");

    function criarCartaoLocal(local, indice) {
        const cartao = document.createElement("article");
        cartao.className = "cartao-vitrine";

        cartao.appendChild(
            EventosAPI.criarMidiaVitrine(
                EventosAPI.obterCapaLocal(local, indice),
                local.nome,
                local.bairroCidade,
                "",
                ""
            )
        );

        const corpo = document.createElement("section");
        corpo.className = "corpo-cartao";

        const nome = document.createElement("h3");
        nome.className = "titulo-cartao";
        nome.textContent = local.nome;
        corpo.appendChild(nome);

        const descricao = document.createElement("p");
        descricao.className = "resumo-cartao";
        descricao.textContent = local.descricao;
        corpo.appendChild(descricao);

        const listaMeta = document.createElement("section");
        listaMeta.className = "lista-meta-cartao";

        const linhaEndereco = document.createElement("p");
        linhaEndereco.className = "linha-meta-cartao";
        linhaEndereco.appendChild(EventosAPI.criarMetaIcone("pin", local.endereco));
        listaMeta.appendChild(linhaEndereco);

        if (local.estrutura) {
            const linhaEstrutura = document.createElement("p");
            linhaEstrutura.className = "linha-meta-cartao";
            linhaEstrutura.appendChild(EventosAPI.criarMetaIcone("musica", local.estrutura));
            listaMeta.appendChild(linhaEstrutura);
        }

        corpo.appendChild(listaMeta);

        const rodape = document.createElement("footer");
        rodape.className = "rodape-cartao";

        const destaqueRodape = document.createElement("p");
        destaqueRodape.className = "destaque-rodape-cartao";
        const rotulo = document.createElement("span");
        rotulo.className = "rotulo-rodape-cartao";
        rotulo.textContent = "lotação";
        const valor = document.createElement("strong");
        valor.className = "valor-rodape-cartao";
        valor.textContent = Number(local.capacidade || 0).toLocaleString("pt-BR");
        destaqueRodape.appendChild(rotulo);
        destaqueRodape.appendChild(valor);

        const linkAgenda = document.createElement("a");
        linkAgenda.className = "botao-cartao";
        linkAgenda.href = "index.html#agenda";
        linkAgenda.textContent = "Ver Agenda →";

        rodape.appendChild(destaqueRodape);
        rodape.appendChild(linkAgenda);
        corpo.appendChild(rodape);
        cartao.appendChild(corpo);

        return cartao;
    }

    function renderizarLocais() {
        const locais = EventosAPI.listarLocais();
        const contadorLocais = document.getElementById("contador-locais");
        if (contadorLocais) {
            contadorLocais.textContent = locais.length + (locais.length === 1 ? " casa de show parceira" : " casas de show parceiras");
        }
        listaLocais.innerHTML = "";
        locais.forEach(function (local, indice) {
            listaLocais.appendChild(criarCartaoLocal(local, indice));
        });
    }

    async function inicializar() {
        renderizarLocais();
        await EventosAPI.sincronizarComSupabase();
        renderizarLocais();
    }

    inicializar();
})();

