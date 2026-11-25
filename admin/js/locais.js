(function () {
    const corpoTabela = document.getElementById("tabela-locais");
    const formulario = document.getElementById("form-cadastro-local");
    const tituloForm = document.getElementById("titulo-form-local");
    const campoNome = document.getElementById("campo-nome-local");
    const campoBairro = document.getElementById("campo-bairro-local");
    const campoCapacidade = document.getElementById("campo-capacidade-local");
    const campoEndereco = document.getElementById("campo-endereco-local");
    const campoEstrutura = document.getElementById("campo-estrutura-local");
    const campoDescricao = document.getElementById("campo-descricao-local");
    const botaoSalvar = document.getElementById("salvar-local");

    let idEmEdicao = null;
    let listaAtual = [];

    function gerarSlug(texto) {
        return texto
            .toString()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    async function listarLocais() {
        if (window.supabaseConfigurado && window.supabaseClient) {
            try {
                const resposta = await window.supabaseClient.from("locais").select("*").order("id", { ascending: true });
                if (!resposta.error && resposta.data) {
                    listaAtual = resposta.data.map(function (loc) {
                        return {
                            id: loc.id,
                            nome: loc.nome,
                            endereco: loc.endereco,
                            bairroCidade: loc.bairro_cidade || loc.bairroCidade || "",
                            capacidade: Number(loc.capacidade || 0),
                            estrutura: loc.estrutura || "",
                            descricao: loc.descricao || ""
                        };
                    });
                    return listaAtual;
                }
            } catch (erro) {
                console.warn("Usando locais salvos localmente:", erro);
            }
        }
        listaAtual = window.EventosAPI ? window.EventosAPI.listarLocais() : [];
        return listaAtual;
    }

    function iniciarEdicao(loc) {
        idEmEdicao = loc.id;
        if (tituloForm) tituloForm.textContent = "Editar Casa de Show: " + loc.nome;
        if (botaoSalvar) botaoSalvar.textContent = "Salvar Alterações";

        campoNome.value = loc.nome || "";
        campoBairro.value = loc.bairroCidade || "";
        campoCapacidade.value = loc.capacidade || 200;
        campoEndereco.value = loc.endereco || "";
        campoEstrutura.value = loc.estrutura || "";
        campoDescricao.value = loc.descricao || "";

        if (window.ControladorModalAdmin) {
            window.ControladorModalAdmin.abrir("formulario-local", true);
        }
    }

    function cancelarEdicao() {
        idEmEdicao = null;
        if (formulario) formulario.reset();
        if (tituloForm) tituloForm.textContent = "Cadastrar Nova Casa de Show";
        if (botaoSalvar) botaoSalvar.textContent = "Salvar Casa de Show";
    }

    async function renderizarTabela() {
        if (!corpoTabela) return;
        const locais = await listarLocais();

        if (locais.length === 0) {
            corpoTabela.innerHTML = '<tr><td colspan="5">Nenhuma casa de show cadastrada.</td></tr>';
            return;
        }

        corpoTabela.innerHTML = locais.map(function (loc) {
            return `
                <tr>
                    <td data-label="Casa de Show"><strong>${loc.nome}</strong></td>
                    <td data-label="Bairro / Cidade">${loc.bairroCidade}</td>
                    <td data-label="Capacidade" class="celula-nowrap">${Number(loc.capacidade || 0).toLocaleString("pt-BR")} pessoas</td>
                    <td data-label="Endereço">${loc.endereco}</td>
                    <td data-label="Ações" class="acoes-tabela">
                        <button type="button" class="botao-pequeno botao-editar" data-id="${loc.id}">Editar</button>
                        <button type="button" class="botao-pequeno botao-excluir" data-id="${loc.id}">Excluir</button>
                    </td>
                </tr>
            `;
        }).join("");

        corpoTabela.querySelectorAll(".botao-editar").forEach(function (botao) {
            botao.addEventListener("click", function () {
                const id = this.getAttribute("data-id");
                const encontrado = listaAtual.find(function (l) {
                    return String(l.id) === String(id);
                });
                if (encontrado) iniciarEdicao(encontrado);
            });
        });

        corpoTabela.querySelectorAll(".botao-excluir").forEach(function (botao) {
            botao.addEventListener("click", async function () {
                const id = this.getAttribute("data-id");
                const confirmado = await window.ArenaUI.confirmar({
                    titulo: "Excluir Casa de Show",
                    mensagem: "Deseja remover esta casa de show da lista de palcos parceiros?",
                    textoConfirmar: "Sim, Excluir",
                    perigoso: true
                });
                if (!confirmado) return;

                if (window.supabaseConfigurado && window.supabaseClient) {
                    await window.supabaseClient.from("locais").delete().eq("id", id);
                }
                if (window.EventosAPI) {
                    window.EventosAPI.removerLocalLocal(id);
                }
                if (String(idEmEdicao) === String(id)) {
                    cancelarEdicao();
                }
                renderizarTabela();
            });
        });
    }

    if (window.ControladorModalAdmin) {
        window.ControladorModalAdmin.registrarReset("formulario-local", cancelarEdicao);
    }

    if (formulario) {
        formulario.addEventListener("submit", async function (evento) {
            evento.preventDefault();
            const nome = (campoNome.value || "").trim();
            const bairroCidade = (campoBairro.value || "").trim();
            const endereco = (campoEndereco.value || "").trim();
            const capacidade = Number(campoCapacidade.value || 250);
            const estrutura = (campoEstrutura.value || "").trim() || "Sistema de som PA e bar";
            const descricao = (campoDescricao.value || "").trim() || "Casa de show parceira do circuito Arena Rock.";

            if (nome.length < 2 || bairroCidade.length < 2 || endereco.length < 4) {
                await window.ArenaUI.alerta({
                    titulo: "Campos Obrigatórios",
                    mensagem: "Preencha nome do palco, bairro/cidade e endereço.",
                    tipo: "erro"
                });
                return;
            }

            const dadosLocais = {
                nome: nome,
                endereco: endereco,
                bairroCidade: bairroCidade,
                capacidade: capacidade,
                estrutura: estrutura,
                descricao: descricao
            };

            const payloadSupabase = {
                nome: nome,
                endereco: endereco,
                bairro_cidade: bairroCidade,
                capacidade: capacidade,
                estrutura: estrutura,
                descricao: descricao
            };

            if (idEmEdicao) {
                if (window.EventosAPI) {
                    window.EventosAPI.atualizarLocalLocal(idEmEdicao, dadosLocais);
                }
                if (window.supabaseConfigurado && window.supabaseClient) {
                    await window.supabaseClient.from("locais").update(payloadSupabase).eq("id", idEmEdicao);
                }
                if (window.ControladorModalAdmin) {
                    window.ControladorModalAdmin.fechar("formulario-local");
                } else {
                    cancelarEdicao();
                }
                await renderizarTabela();
                await window.ArenaUI.alerta({
                    titulo: "Casa de Show Atualizada",
                    mensagem: "Casa de show atualizada com sucesso!",
                    tipo: "sucesso"
                });
            } else {
                const novoId = gerarSlug(nome) || String(Date.now());
                if (window.EventosAPI) {
                    window.EventosAPI.adicionarLocalLocal(Object.assign({ id: novoId }, dadosLocais));
                }
                if (window.supabaseConfigurado && window.supabaseClient) {
                    await window.supabaseClient.from("locais").insert(payloadSupabase);
                }
                if (window.ControladorModalAdmin) {
                    window.ControladorModalAdmin.fechar("formulario-local");
                } else {
                    cancelarEdicao();
                }
                await renderizarTabela();
                await window.ArenaUI.alerta({
                    titulo: "Casa de Show Cadastrada",
                    mensagem: "Casa de show cadastrada com sucesso!",
                    tipo: "sucesso"
                });
            }
        });
    }

    document.addEventListener("DOMContentLoaded", renderizarTabela);
})();
