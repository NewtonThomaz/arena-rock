const controladorEventos = {
    idEmEdicao: null,
    idBancoEmEdicao: null,
    eventosAtuais: [],
    etapaAtual: 1,
    totalEtapas: 4,

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

    formatarDataTabela: function (dataISO) {
        if (!dataISO) return "-";
        const partes = String(dataISO).split("-");
        if (partes.length === 3) {
            return partes[2] + "/" + partes[1] + "/" + partes[0];
        }
        return dataISO;
    },

    templateItem: function (item) {
        const nomeShow = item.nome || item.titulo;
        const banda = item.banda_principal || item.bandaPrincipal || "Atrações Confirmadas";
        const nomeCategoria = item.categoria && item.categoria.nome ? item.categoria.nome : (item.categoria || "Show");
        const dataShow = controladorEventos.formatarDataTabela(item.data || item.dataISO);
        const vagasRestantes = item.vagas_restantes ?? item.vagasRestantes ?? 0;
        const vagasTotais = item.vagas_totais ?? item.vagasTotais ?? 0;
        const idRef = item.id;
        const slugRef = item.slug || item.id;

        return `
            <tr>
                <td data-label="Show / Evento"><strong>${nomeShow}</strong></td>
                <td data-label="Line-up / Banda">${banda}</td>
                <td data-label="Categoria"><span class="categoria-evento">${nomeCategoria}</span></td>
                <td data-label="Data" class="celula-nowrap">${dataShow}</td>
                <td data-label="Casa de Show">${item.local}</td>
                <td data-label="Ingressos" class="celula-nowrap">${vagasRestantes} / ${vagasTotais}</td>
                <td data-label="Ações" class="acoes-tabela">
                    <button type="button" class="botao-pequeno botao-editar botao-editar-evento" data-id="${idRef}">Editar</button>
                    <a class="botao-pequeno botao-editar" href="inscritos.html?evento=${encodeURIComponent(slugRef)}">Inscritos</a>
                    <button type="button" class="botao-pequeno botao-excluir" data-id="${idRef}">Excluir</button>
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
                    controladorEventos.eventosAtuais = resEventos.data.map(function (ev) {
                        const inscritosReais = contagemPorEvento[String(ev.id)] || 0;
                        ev.vagas_restantes = Math.max(0, Number(ev.vagas_totais || 0) - inscritosReais);
                        return ev;
                    });
                    return controladorEventos.eventosAtuais;
                }
            } catch (erro) {
                console.warn("Usando lista local de eventos:", erro);
            }
        }
        controladorEventos.eventosAtuais = window.EventosAPI ? window.EventosAPI.listarEventos() : [];
        return controladorEventos.eventosAtuais;
    },

    montarCategorias: async function () {
        const seletor = document.querySelector("#campo-categoria");
        if (!seletor) return;

        const categorias = await controladorCategorias.listar();
        seletor.innerHTML = categorias.map(function (item) {
            return `<option value="${item.id}" data-nome="${item.nome}">${item.nome}</option>`;
        }).join("");
    },

    montarSugestoes: function () {
        if (!window.EventosAPI) return;

        const datalistBandas = document.getElementById("lista-sugestoes-bandas");
        if (datalistBandas) {
            const bandas = window.EventosAPI.listarBandas();
            datalistBandas.innerHTML = bandas.map(function (b) {
                return `<option value="${b.nome}"></option>`;
            }).join("");
        }

        const datalistLocais = document.getElementById("lista-sugestoes-locais");
        const locais = window.EventosAPI.listarLocais();
        if (datalistLocais) {
            datalistLocais.innerHTML = locais.map(function (l) {
                return `<option value="${l.nome}"></option>`;
            }).join("");
        }

        const campoLocal = document.getElementById("campo-local");
        const campoEndereco = document.getElementById("campo-endereco");
        if (campoLocal && campoEndereco && campoLocal.dataset.autoEndereco !== "sim") {
            campoLocal.dataset.autoEndereco = "sim";
            campoLocal.addEventListener("change", function () {
                const encontrado = locais.find(function (l) {
                    return l.nome.toLowerCase() === campoLocal.value.trim().toLowerCase();
                });
                if (encontrado && !campoEndereco.value.trim()) {
                    campoEndereco.value = encontrado.endereco + (encontrado.bairroCidade ? " - " + encontrado.bairroCidade : "");
                }
            });
        }
    },

    atualizarSelecaoCapa: function (valorCapa) {
        const opcoes = document.querySelectorAll("#seletor-capas-admin .opcao-capa-admin");
        const campoImagem = document.getElementById("campo-imagem");
        if (campoImagem && campoImagem.value !== valorCapa) {
            campoImagem.value = valorCapa || "";
        }
        opcoes.forEach(function (btn) {
            const capaBtn = btn.getAttribute("data-capa") || "";
            btn.classList.toggle("selecionada", capaBtn === (valorCapa || ""));
        });
    },

    configurarSeletorCapas: function () {
        const container = document.getElementById("seletor-capas-admin");
        const campoImagem = document.getElementById("campo-imagem");
        if (!container) return;

        container.querySelectorAll(".opcao-capa-admin").forEach(function (btn) {
            btn.addEventListener("click", function () {
                const capa = this.getAttribute("data-capa") || "";
                controladorEventos.atualizarSelecaoCapa(capa);
            });
        });

        if (campoImagem) {
            campoImagem.addEventListener("input", function () {
                controladorEventos.atualizarSelecaoCapa(campoImagem.value.trim());
            });
        }
    },

    validar: function (idCampo, valor, tamanhoMinimo) {
        const elementoErro = document.querySelector(`#campo-${idCampo} + .erro-campo`) ||
            document.querySelector(`#campo-${idCampo}`)?.parentElement?.querySelector(".erro-campo");
        if (!valor || valor.trim().length < tamanhoMinimo) {
            if (elementoErro) elementoErro.classList.add("visivel");
            return false;
        }
        if (elementoErro) elementoErro.classList.remove("visivel");
        return true;
    },

    validarEtapa: function (numeroEtapa) {
        if (numeroEtapa === 1) {
            const campoTitulo = document.querySelector("#campo-titulo");
            const okTitulo = controladorEventos.validar("titulo", campoTitulo ? campoTitulo.value : "", 3);
            if (!okTitulo && campoTitulo) campoTitulo.focus();
            return okTitulo;
        }

        if (numeroEtapa === 2) {
            const campoData = document.querySelector("#campo-data");
            const campoHorario = document.querySelector("#campo-horario");
            const campoLocal = document.querySelector("#campo-local");

            const okData = controladorEventos.validar("data", campoData ? campoData.value : "", 3);
            const okHorario = controladorEventos.validar("horario", campoHorario ? campoHorario.value : "", 2);
            const okLocal = controladorEventos.validar("local", campoLocal ? campoLocal.value : "", 2);

            if (!okData && campoData) campoData.focus();
            else if (!okHorario && campoHorario) campoHorario.focus();
            else if (!okLocal && campoLocal) campoLocal.focus();

            return okData && okHorario && okLocal;
        }

        return true;
    },

    irParaEtapa: function (destino, pularValidacao, focarCampo) {
        const etapaAlvo = Math.max(1, Math.min(controladorEventos.totalEtapas, Number(destino) || 1));

        if (!pularValidacao && etapaAlvo > controladorEventos.etapaAtual) {
            for (let s = controladorEventos.etapaAtual; s < etapaAlvo; s++) {
                if (!controladorEventos.validarEtapa(s)) {
                    if (controladorEventos.etapaAtual !== s) {
                        controladorEventos.irParaEtapa(s, true, false);
                    }
                    return false;
                }
            }
        }

        controladorEventos.etapaAtual = etapaAlvo;

        document.querySelectorAll("#form-cadastro-evento .etapa-formulario-admin").forEach(function (bloco) {
            const num = Number(bloco.getAttribute("data-etapa"));
            bloco.classList.toggle("ativa", num === etapaAlvo);
        });

        document.querySelectorAll("#formulario-evento .passo-wizard").forEach(function (btnPasso) {
            const num = Number(btnPasso.getAttribute("data-ir-etapa"));
            const indicador = btnPasso.querySelector(".indicador-passo-wizard");
            const concluido = num < etapaAlvo;
            const ativo = num === etapaAlvo;

            btnPasso.classList.toggle("ativo", ativo);
            btnPasso.classList.toggle("concluido", concluido);
            btnPasso.setAttribute("aria-selected", ativo ? "true" : "false");

            if (indicador) {
                indicador.textContent = concluido ? "✓" : String(num);
            }
        });

        document.querySelectorAll("#formulario-evento .trilha-passo-wizard").forEach(function (trilha, indice) {
            trilha.classList.toggle("preenchida", indice < etapaAlvo - 1);
        });

        const btnVoltar = document.getElementById("voltar-etapa-evento");
        const btnAvancar = document.getElementById("avancar-etapa-evento");
        const btnSalvar = document.getElementById("salvar-evento");
        const naUltima = etapaAlvo === controladorEventos.totalEtapas;

        if (btnVoltar) btnVoltar.hidden = etapaAlvo === 1;
        if (btnAvancar) btnAvancar.hidden = naUltima;
        if (btnSalvar) btnSalvar.hidden = !naUltima;

        const corpoModal = document.querySelector("#formulario-evento .corpo-modal-admin");
        if (corpoModal) corpoModal.scrollTop = 0;

        if (focarCampo) {
            const etapaAtivaEl = document.querySelector(`#form-cadastro-evento .etapa-formulario-admin[data-etapa="${etapaAlvo}"]`);
            if (etapaAtivaEl) {
                const primeiro = etapaAtivaEl.querySelector("input:not([type='hidden']):not([type='checkbox']), select, textarea");
                if (primeiro) setTimeout(function () { primeiro.focus(); }, 40);
            }
        }

        return true;
    },

    configurarWizard: function () {
        const modal = document.getElementById("formulario-evento");
        const formulario = document.getElementById("form-cadastro-evento");
        if (!modal || !formulario) return;

        modal.querySelectorAll(".passo-wizard[data-ir-etapa]").forEach(function (btnPasso) {
            btnPasso.addEventListener("click", function () {
                const alvo = Number(this.getAttribute("data-ir-etapa"));
                controladorEventos.irParaEtapa(alvo, false, true);
            });
        });

        const btnVoltar = document.getElementById("voltar-etapa-evento");
        if (btnVoltar) {
            btnVoltar.addEventListener("click", function () {
                controladorEventos.irParaEtapa(controladorEventos.etapaAtual - 1, true, true);
            });
        }

        const btnAvancar = document.getElementById("avancar-etapa-evento");
        if (btnAvancar) {
            btnAvancar.addEventListener("click", function () {
                controladorEventos.irParaEtapa(controladorEventos.etapaAtual + 1, false, true);
            });
        }

        [
            { id: "titulo", min: 3 },
            { id: "data", min: 3 },
            { id: "horario", min: 2 },
            { id: "local", min: 2 }
        ].forEach(function (regra) {
            const el = document.getElementById("campo-" + regra.id);
            if (el) {
                el.addEventListener("input", function () {
                    if (el.value.trim().length >= regra.min) {
                        controladorEventos.validar(regra.id, el.value, regra.min);
                    }
                });
            }
        });

        formulario.addEventListener("keydown", function (evento) {
            if (evento.key === "Enter" && evento.target && evento.target.tagName !== "TEXTAREA") {
                evento.preventDefault();
                if (controladorEventos.etapaAtual < controladorEventos.totalEtapas) {
                    controladorEventos.irParaEtapa(controladorEventos.etapaAtual + 1, false, true);
                } else {
                    const btnSalvar = document.getElementById("salvar-evento");
                    if (btnSalvar) btnSalvar.click();
                }
            }
        });
    },

    iniciarEdicao: function (item) {
        controladorEventos.idEmEdicao = item.slug || item.id;
        controladorEventos.idBancoEmEdicao = item.idBanco || (typeof item.id === "number" ? item.id : null);

        const tituloForm = document.getElementById("titulo-form-evento");
        const botaoSalvar = document.getElementById("salvar-evento");
        const formulario = document.getElementById("form-cadastro-evento");

        if (formulario) {
            formulario.querySelectorAll(".erro-campo.visivel").forEach(function (el) {
                el.classList.remove("visivel");
            });
        }

        if (tituloForm) tituloForm.textContent = "Editar Show: " + (item.nome || item.titulo);
        if (botaoSalvar) botaoSalvar.textContent = "Salvar Alterações";

        document.querySelector("#campo-titulo").value = item.nome || item.titulo || "";
        document.querySelector("#campo-banda-principal").value = item.banda_principal || item.bandaPrincipal || "";
        document.querySelector("#campo-vertente").value = item.vertente_rock || item.vertenteRock || "";
        document.querySelector("#campo-classificacao").value = item.classificacao || "16 anos";
        document.querySelector("#campo-data").value = item.data || item.dataISO || "";
        document.querySelector("#campo-horario").value = item.horario || "";
        document.querySelector("#campo-organizador").value = item.responsavel || item.organizador || "";
        document.querySelector("#campo-local").value = item.local || "";
        document.querySelector("#campo-endereco").value = item.endereco || item.enderecoCompleto || "";
        document.querySelector("#campo-vagas-totais").value = item.vagas_totais ?? item.vagasTotais ?? 200;
        document.querySelector("#campo-vagas-restantes").value = item.vagas_restantes ?? item.vagasRestantes ?? 200;
        document.querySelector("#campo-destaque").checked = Boolean(item.destaque);
        document.querySelector("#campo-descricao").value = item.descricao || item.descricaoCompleta || "";

        const seletorCat = document.querySelector("#campo-categoria");
        if (seletorCat) {
            if (item.categoria_id) {
                seletorCat.value = String(item.categoria_id);
            } else {
                const nomeCat = item.categoria && item.categoria.nome ? item.categoria.nome : (item.categoria || "");
                Array.from(seletorCat.options).forEach(function (opt) {
                    if (opt.getAttribute("data-nome") === nomeCat) {
                        seletorCat.value = opt.value;
                    }
                });
            }
        }

        controladorEventos.atualizarSelecaoCapa(item.imagem || "");
        controladorEventos.irParaEtapa(1, true, false);

        if (window.ControladorModalAdmin) {
            window.ControladorModalAdmin.abrir("formulario-evento", true);
        }
    },

    cancelarEdicao: function () {
        controladorEventos.idEmEdicao = null;
        controladorEventos.idBancoEmEdicao = null;

        const formulario = document.getElementById("form-cadastro-evento");
        if (formulario) {
            formulario.reset();
            formulario.querySelectorAll(".erro-campo.visivel").forEach(function (el) {
                el.classList.remove("visivel");
            });
        }

        const tituloForm = document.getElementById("titulo-form-evento");
        const botaoSalvar = document.getElementById("salvar-evento");

        if (tituloForm) tituloForm.textContent = "Cadastrar Novo Show / Evento";
        if (botaoSalvar) botaoSalvar.textContent = "Salvar Show na Programação";

        controladorEventos.atualizarSelecaoCapa("");
        controladorEventos.irParaEtapa(1, true, false);
    },

    obterDadosFormulario: function () {
        if (!controladorEventos.validarEtapa(1)) {
            controladorEventos.irParaEtapa(1, true, false);
            return null;
        }

        if (!controladorEventos.validarEtapa(2)) {
            controladorEventos.irParaEtapa(2, true, false);
            return null;
        }

        const nome = document.querySelector("#campo-titulo").value;
        const seletorCategoria = document.querySelector("#campo-categoria");
        const categoria_id = seletorCategoria.value;
        const opcaoSelecionada = seletorCategoria.options[seletorCategoria.selectedIndex];
        const nomeCategoria = opcaoSelecionada ? opcaoSelecionada.getAttribute("data-nome") : "Show";

        const data = document.querySelector("#campo-data").value;
        const horario = document.querySelector("#campo-horario").value;
        const local = document.querySelector("#campo-local").value;

        const endereco = document.querySelector("#campo-endereco").value || local;
        const vagas_totais = Number(document.querySelector("#campo-vagas-totais").value || 200);
        const campoRestantes = document.querySelector("#campo-vagas-restantes").value;
        const vagas_restantes = campoRestantes === "" ? vagas_totais : Number(campoRestantes);
        const destaque = document.querySelector("#campo-destaque").checked;
        const descricao = document.querySelector("#campo-descricao").value || "Show confirmado no circuito Arena Rock.";
        const responsavel = document.querySelector("#campo-organizador").value || "Produção Arena Rock";
        const banda_principal = document.querySelector("#campo-banda-principal").value || "Bandas Convidadas";
        const vertente_rock = document.querySelector("#campo-vertente").value || "Rock / Metal";
        const classificacao = document.querySelector("#campo-classificacao").value || "16 anos";
        const imagem = (document.querySelector("#campo-imagem")?.value || "").trim();
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
            imagem: imagem,
            slug: slug
        };
    },

    salvarNoSupabase: async function (payload, ehEdicao, idBanco) {
        if (!window.supabaseConfigurado || !window.supabaseClient) {
            return { ok: true, localApenas: true };
        }
        const operacao = ehEdicao
            ? window.supabaseClient.from("eventos").update(payload).eq("id", idBanco)
            : window.supabaseClient.from("eventos").insert(payload).select();

        const resposta = await operacao;
        if (!resposta.error) {
            return { ok: true };
        }

        const msgErro = String(resposta.error.message || "");
        if (msgErro.toLowerCase().includes("imagem")) {
            const payloadSemImagem = Object.assign({}, payload);
            delete payloadSemImagem.imagem;
            const respostaFallback = ehEdicao
                ? await window.supabaseClient.from("eventos").update(payloadSemImagem).eq("id", idBanco)
                : await window.supabaseClient.from("eventos").insert(payloadSemImagem).select();

            if (!respostaFallback.error) {
                return { ok: true, imagemNaoSalvaNoBanco: true };
            }
            console.error("Erro ao salvar evento no Supabase:", respostaFallback.error);
            return { ok: false, erro: respostaFallback.error.message };
        }

        console.error("Erro ao salvar evento no Supabase:", resposta.error);
        return { ok: false, erro: msgErro };
    },

    configurarBotaoSalvar: function () {
        const botaoSalvar = document.querySelector("#salvar-evento");
        if (!botaoSalvar) return;

        botaoSalvar.addEventListener("click", async function () {
            const dados = controladorEventos.obterDadosFormulario();
            if (!dados) return;

            const dadosLocais = {
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
                imagem: dados.imagem,
                descricaoCompleta: dados.descricao
            };

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
                imagem: dados.imagem || null,
                slug: controladorEventos.idEmEdicao ? controladorEventos.idEmEdicao : dados.slug
            };

            const ehEdicao = Boolean(controladorEventos.idEmEdicao);
            let resultadoBanco = { ok: true };

            if (ehEdicao) {
                if (window.EventosAPI) {
                    window.EventosAPI.atualizarEventoLocal(controladorEventos.idEmEdicao, dadosLocais);
                }
                if (controladorEventos.idBancoEmEdicao) {
                    resultadoBanco = await controladorEventos.salvarNoSupabase(payloadSupabase, true, controladorEventos.idBancoEmEdicao);
                }
            } else {
                if (window.EventosAPI) {
                    window.EventosAPI.adicionarEventoLocal(Object.assign({ id: dados.slug }, dadosLocais));
                }
                resultadoBanco = await controladorEventos.salvarNoSupabase(payloadSupabase, false, null);
            }

            if (window.ControladorModalAdmin) {
                window.ControladorModalAdmin.fechar("formulario-evento");
            } else {
                controladorEventos.cancelarEdicao();
            }
            await controladorEventos.popularTabelaEventos();

            if (resultadoBanco && resultadoBanco.imagemNaoSalvaNoBanco) {
                alert("Show salvo, mas a coluna 'imagem' ainda não existe no seu banco Supabase. Execute a migration 20261125004501_add_imagem_eventos_checkin_inscricoes.sql no SQL Editor do Supabase para salvar capas personalizadas.");
            } else if (resultadoBanco && !resultadoBanco.ok) {
                alert("Aviso: os dados foram salvos localmente, mas o Supabase retornou erro: " + resultadoBanco.erro);
            } else {
                alert(ehEdicao ? "Show atualizado com sucesso!" : "Show cadastrado com sucesso na programação!");
            }
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

        corpoTabela.querySelectorAll(".botao-editar-evento").forEach(function (botao) {
            botao.addEventListener("click", function () {
                const id = this.getAttribute("data-id");
                const encontrado = controladorEventos.eventosAtuais.find(function (ev) {
                    return String(ev.id) === String(id);
                });
                if (encontrado) {
                    controladorEventos.iniciarEdicao(encontrado);
                }
            });
        });

        corpoTabela.querySelectorAll(".botao-excluir").forEach(function (botao) {
            botao.addEventListener("click", async function () {
                const id = this.getAttribute("data-id");
                if (window.supabaseConfigurado && window.supabaseClient) {
                    await window.supabaseClient.from("eventos").delete().eq("id", id);
                }
                if (window.EventosAPI) {
                    window.EventosAPI.removerEventoLocal(id);
                }
                if (String(controladorEventos.idEmEdicao) === String(id) || String(controladorEventos.idBancoEmEdicao) === String(id)) {
                    controladorEventos.cancelarEdicao();
                }
                controladorEventos.popularTabelaEventos();
            });
        });
    },

    inicializar: async function () {
        if (window.ControladorModalAdmin) {
            window.ControladorModalAdmin.registrarReset("formulario-evento", controladorEventos.cancelarEdicao);
        }
        controladorEventos.configurarWizard();
        controladorEventos.irParaEtapa(1, true, false);
        await controladorEventos.montarCategorias();
        controladorEventos.montarSugestoes();
        controladorEventos.configurarSeletorCapas();
        controladorEventos.configurarBotaoSalvar();
        await controladorEventos.popularTabelaEventos();
    }
};

document.addEventListener("DOMContentLoaded", controladorEventos.inicializar);
