const controladorEventos = {
    gerarSlug: function (texto) {
        return texto
            .toString()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
    },

    templateItem: function (item) {
        const nomeShow = item.nome || item.titulo;
        const banda = item.banda_principal || item.bandaPrincipal || "Atrações Confirmadas";
        const nomeCategoria = item.categoria && item.categoria.nome ? item.categoria.nome : (item.categoria || "Show");
        const dataShow = item.data || item.dataISO;
        const vagasRestantes = item.vagas_restantes ?? item.vagasRestantes ?? 0;
        const vagasTotais = item.vagas_totais ?? item.vagasTotais ?? 0;

        return `
            <tr>
                <td data-label="Show / Evento"><strong>${nomeShow}</strong></td>
                <td data-label="Line-up / Banda">${banda}</td>
                <td data-label="Categoria"><span class="categoria-evento">${nomeCategoria}</span></td>
                <td data-label="Data">${dataShow}</td>
                <td data-label="Casa de Show">${item.local}</td>
                <td data-label="Ingressos">${vagasRestantes} / ${vagasTotais}</td>
                <td data-label="Ações" class="acoes-tabela">
                    <a class="botao-pequeno botao-editar" href="inscritos.html?evento=${encodeURIComponent(item.id)}">Inscritos</a>
                    <button type="button" class="botao-pequeno botao-excluir" data-id="${item.id}">Excluir</button>
                </td>
            </tr>
        `;
    },

    listar: async function () {
        if (window.supabaseConfigurado && window.supabaseClient) {
            try {
                const [resEventos, resInscricoes] = await Promise.all([
                    window.supabaseClient.from("eventos").select("*, categoria:categorias(*)").order("data", { ascending: true }),
                    window.supabaseClient.from("inscricoes").select("evento_id")
                ]);
                if (!resEventos.error && resEventos.data) {
                    const contagemPorEvento = {};
                    if (!resInscricoes.error && resInscricoes.data) {
                        resInscricoes.data.forEach(function (ins) {
                            const chave = String(ins.evento_id);
                            contagemPorEvento[chave] = (contagemPorEvento[chave] || 0) + 1;
                        });
                    }
                    return resEventos.data.map(function (ev) {
                        const inscritosReais = contagemPorEvento[String(ev.id)] || 0;
                        ev.vagas_restantes = Math.max(0, Number(ev.vagas_totais || 0) - inscritosReais);
                        return ev;
                    });
                }
            } catch (erro) {
                console.warn("Usando lista local de eventos:", erro);
            }
        }
        return window.EventosAPI ? window.EventosAPI.listarEventos() : [];
    },

    montarCategorias: async function () {
        const seletor = document.querySelector("#campo-categoria");
        if (!seletor) return;

        const categorias = await controladorCategorias.listar();
        seletor.innerHTML = categorias.map(function (item) {
            return `<option value="${item.id}" data-nome="${item.nome}">${item.nome}</option>`;
        }).join("");
    },

    validar: function (idCampo, valor, tamanhoMinimo) {
        const elementoErro = document.querySelector(`#campo-${idCampo} + .erro-campo`);
        if (!valor || valor.trim().length < tamanhoMinimo) {
            if (elementoErro) elementoErro.classList.add("visivel");
            return false;
        }
        if (elementoErro) elementoErro.classList.remove("visivel");
        return true;
    },

    obterDadosFormulario: function () {
        const nome = document.querySelector("#campo-titulo").value;
        if (!controladorEventos.validar("titulo", nome, 3)) return null;

        const seletorCategoria = document.querySelector("#campo-categoria");
        const categoria_id = seletorCategoria.value;
        const opcaoSelecionada = seletorCategoria.options[seletorCategoria.selectedIndex];
        const nomeCategoria = opcaoSelecionada ? opcaoSelecionada.getAttribute("data-nome") : "Show";

        const data = document.querySelector("#campo-data").value;
        if (!controladorEventos.validar("data", data, 3)) return null;

        const horario = document.querySelector("#campo-horario").value;
        if (!controladorEventos.validar("horario", horario, 2)) return null;

        const local = document.querySelector("#campo-local").value;
        if (!controladorEventos.validar("local", local, 2)) return null;

        const endereco = document.querySelector("#campo-endereco").value || local;
        const vagas_totais = Number(document.querySelector("#campo-vagas-totais").value || 200);
        const vagas_restantes = Number(document.querySelector("#campo-vagas-restantes").value || vagas_totais);
        const destaque = document.querySelector("#campo-destaque").checked;
        const descricao = document.querySelector("#campo-descricao").value || "Show confirmado no circuito Arena Rock.";
        const responsavel = document.querySelector("#campo-organizador").value || "Produção Arena Rock";
        const banda_principal = document.querySelector("#campo-banda-principal").value || "Bandas Convidadas";
        const vertente_rock = document.querySelector("#campo-vertente").value || "Rock / Metal";
        const classificacao = document.querySelector("#campo-classificacao").value || "16 anos";
        const slug = controladorEventos.gerarSlug(nome);

        return {
            nome: nome,
            categoria_id: categoria_id,
            nomeCategoria: nomeCategoria,
            data: data,
            horario: horario,
            local: local,
            endereco: endereco,
            vagas_totais: vagas_totais,
            vagas_restantes: vagas_restantes,
            destaque: destaque,
            descricao: descricao,
            responsavel: responsavel,
            banda_principal: banda_principal,
            vertente_rock: vertente_rock,
            classificacao: classificacao,
            slug: slug
        };
    },

    configurarBotaoSalvar: function () {
        const botaoSalvar = document.querySelector("#salvar-evento");
        if (!botaoSalvar) return;

        botaoSalvar.addEventListener("click", async function () {
            const dados = controladorEventos.obterDadosFormulario();
            if (!dados) return;

            if (window.EventosAPI) {
                window.EventosAPI.adicionarEventoLocal({
                    id: dados.slug,
                    categoria: dados.nomeCategoria,
                    titulo: dados.nome,
                    bandaPrincipal: dados.banda_principal,
                    vertenteRock: dados.vertente_rock,
                    classificacao: dados.classificacao,
                    destaque: dados.destaque,
                    dataISO: dados.data,
                    horario: dados.horario,
                    local: dados.local,
                    enderecoCompleto: dados.endereco,
                    organizador: dados.responsavel,
                    vagasTotais: dados.vagas_totais,
                    vagasRestantes: dados.vagas_restantes,
                    descricaoCompleta: dados.descricao
                });
            }

            if (window.supabaseConfigurado && window.supabaseClient) {
                const payloadSupabase = {
                    nome: dados.nome,
                    categoria_id: dados.categoria_id,
                    data: dados.data,
                    horario: dados.horario,
                    local: dados.local,
                    endereco: dados.endereco,
                    vagas_totais: dados.vagas_totais,
                    vagas_restantes: dados.vagas_restantes,
                    destaque: dados.destaque,
                    descricao: dados.descricao,
                    responsavel: dados.responsavel,
                    banda_principal: dados.banda_principal,
                    vertente_rock: dados.vertente_rock,
                    classificacao: dados.classificacao,
                    slug: dados.slug
                };
                const resposta = await window.supabaseClient.from("eventos").insert(payloadSupabase).select();
                if (resposta.error) {
                    console.warn(resposta.error);
                }
            }

            const formulario = document.getElementById("form-cadastro-evento");
            if (formulario) formulario.reset();

            await controladorEventos.popularTabelaEventos();
            alert("Show cadastrado com sucesso na programação!");
        });
    },

    popularTabelaEventos: async function () {
        const corpoTabela = document.querySelector("#tabela-eventos");
        if (!corpoTabela) return;

        corpoTabela.innerHTML = "";
        const eventos = await controladorEventos.listar();

        corpoTabela.innerHTML = eventos.map(function (item) {
            return controladorEventos.templateItem(item);
        }).join("");

        corpoTabela.querySelectorAll(".botao-excluir").forEach(function (botao) {
            botao.addEventListener("click", async function () {
                const id = this.getAttribute("data-id");
                if (window.supabaseConfigurado && window.supabaseClient) {
                    await window.supabaseClient.from("eventos").delete().eq("id", id);
                }
                if (window.EventosAPI) {
                    window.EventosAPI.removerEventoLocal(id);
                }
                controladorEventos.popularTabelaEventos();
            });
        });
    },

    inicializar: async function () {
        await controladorEventos.montarCategorias();
        controladorEventos.configurarBotaoSalvar();
        await controladorEventos.popularTabelaEventos();
    }
};

document.addEventListener("DOMContentLoaded", controladorEventos.inicializar);
