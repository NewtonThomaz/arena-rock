-- Migration: Simulação de compras de ingressos - Lote 1 (Festival Trovão, Noite Grunge e Fúria Subterrânea)

ALTER TABLE public.eventos ADD COLUMN IF NOT EXISTS imagem TEXT;
ALTER TABLE public.inscricoes ADD COLUMN IF NOT EXISTS checkin BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.inscricoes ADD COLUMN IF NOT EXISTS checkin_em TIMESTAMPTZ;

INSERT INTO public.inscricoes (
    evento_id,
    nome,
    email,
    setor_ingresso,
    codigo_confirmacao,
    checkin,
    checkin_em,
    criado_em
)
SELECT
    e.id,
    v.nome,
    v.email,
    v.setor_ingresso,
    v.codigo_confirmacao,
    v.checkin,
    v.checkin_em::TIMESTAMPTZ,
    v.criado_em::TIMESTAMPTZ
FROM (
    VALUES
        -- Festival Trovão de Aço 2026 (18 compradores)
        ('festival-trovao-de-aco-2026', 'Rafael Mendes', 'rafael.mendes@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-FT01A9', true, '2026-11-14T16:12:00-03:00', '2026-10-18T11:20:00-03:00'),
        ('festival-trovao-de-aco-2026', 'Camila Nogueira', 'camila.nogueira@arenarock.com', 'Mezanino / Camarote Backstage', 'ROCK-FT02B4', true, '2026-11-14T16:28:00-03:00', '2026-10-19T14:05:00-03:00'),
        ('festival-trovao-de-aco-2026', 'Bruno Vasconcelos', 'bruno.vasconcelos@arenarock.com', 'Pista Rock', 'ROCK-FT03C7', true, '2026-11-14T16:45:00-03:00', '2026-10-20T09:30:00-03:00'),
        ('festival-trovao-de-aco-2026', 'Larissa Duarte', 'larissa.duarte@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-FT04D2', false, NULL, '2026-10-21T19:40:00-03:00'),
        ('festival-trovao-de-aco-2026', 'Thiago Alencar', 'thiago.alencar@arenarock.com', 'Pista Rock', 'ROCK-FT05E8', true, '2026-11-14T17:10:00-03:00', '2026-10-22T15:12:00-03:00'),
        ('festival-trovao-de-aco-2026', 'Juliana Barbosa', 'juliana.barbosa@arenarock.com', 'Mezanino / Camarote Backstage', 'ROCK-FT06F1', false, NULL, '2026-10-23T21:05:00-03:00'),
        ('festival-trovao-de-aco-2026', 'Gabriel Peixoto', 'gabriel.peixoto@arenarock.com', 'Pista Rock', 'ROCK-FT07G6', true, '2026-11-14T17:34:00-03:00', '2026-10-25T10:18:00-03:00'),
        ('festival-trovao-de-aco-2026', 'Mariana Silveira', 'mariana.silveira@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-FT08H3', false, NULL, '2026-10-26T16:48:00-03:00'),
        ('festival-trovao-de-aco-2026', 'Rodrigo Tavares', 'rodrigo.tavares@arenarock.com', 'Pista Rock', 'ROCK-FT09J5', true, '2026-11-14T18:02:00-03:00', '2026-10-28T13:22:00-03:00'),
        ('festival-trovao-de-aco-2026', 'Fernanda Rezende', 'fernanda.rezende@arenarock.com', 'Pista Rock', 'ROCK-FT10K4', false, NULL, '2026-10-29T20:15:00-03:00'),
        ('festival-trovao-de-aco-2026', 'Henrique Campos', 'henrique.campos@arenarock.com', 'Mezanino / Camarote Backstage', 'ROCK-FT11L8', true, '2026-11-14T18:25:00-03:00', '2026-10-30T12:00:00-03:00'),
        ('festival-trovao-de-aco-2026', 'Vanessa Moraes', 'vanessa.moraes@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-FT12M2', false, NULL, '2026-11-01T18:45:00-03:00'),
        ('festival-trovao-de-aco-2026', 'Daniel Pacheco', 'daniel.pacheco@arenarock.com', 'Pista Rock', 'ROCK-FT13N9', false, NULL, '2026-11-02T11:10:00-03:00'),
        ('festival-trovao-de-aco-2026', 'Patricia Lopes', 'patricia.lopes@arenarock.com', 'Pista Rock', 'ROCK-FT14P5', true, '2026-11-14T18:52:00-03:00', '2026-11-04T15:30:00-03:00'),
        ('festival-trovao-de-aco-2026', 'Eduardo Ferreira', 'eduardo.ferreira@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-FT15Q1', false, NULL, '2026-11-06T22:08:00-03:00'),
        ('festival-trovao-de-aco-2026', 'Renata Cardoso', 'renata.cardoso@arenarock.com', 'Mezanino / Camarote Backstage', 'ROCK-FT16R7', false, NULL, '2026-11-08T17:40:00-03:00'),
        ('festival-trovao-de-aco-2026', 'Felipe Azevedo', 'felipe.azevedo@arenarock.com', 'Pista Rock', 'ROCK-FT17S3', false, NULL, '2026-11-10T10:55:00-03:00'),
        ('festival-trovao-de-aco-2026', 'Aline Borges', 'aline.borges@arenarock.com', 'Pista Rock', 'ROCK-FT18T6', false, NULL, '2026-11-12T19:14:00-03:00'),

        -- Noite Grunge: Tributo Anos 90 (15 compradores)
        ('noite-grunge-tributo-anos-90', 'Gustavo Queiroz', 'gustavo.queiroz@arenarock.com', 'Pista Rock', 'ROCK-NG01B2', true, '2026-11-21T21:08:00-03:00', '2026-10-25T14:20:00-03:00'),
        ('noite-grunge-tributo-anos-90', 'Amanda Siqueira', 'amanda.siqueira@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-NG02C5', true, '2026-11-21T21:19:00-03:00', '2026-10-26T18:30:00-03:00'),
        ('noite-grunge-tributo-anos-90', 'Diego Monteiro', 'diego.monteiro@arenarock.com', 'Pista Rock', 'ROCK-NG03D9', false, NULL, '2026-10-27T11:45:00-03:00'),
        ('noite-grunge-tributo-anos-90', 'Beatriz Farias', 'beatriz.farias@arenarock.com', 'Mezanino / Camarote Backstage', 'ROCK-NG04E4', true, '2026-11-21T21:35:00-03:00', '2026-10-29T20:10:00-03:00'),
        ('noite-grunge-tributo-anos-90', 'Leonardo Braga', 'leonardo.braga@arenarock.com', 'Pista Rock', 'ROCK-NG05F8', false, NULL, '2026-10-31T15:02:00-03:00'),
        ('noite-grunge-tributo-anos-90', 'Tatiana Prado', 'tatiana.prado@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-NG06G1', true, '2026-11-21T21:48:00-03:00', '2026-11-02T13:50:00-03:00'),
        ('noite-grunge-tributo-anos-90', 'Marcelo Guedes', 'marcelo.guedes@arenarock.com', 'Pista Rock', 'ROCK-NG07H7', false, NULL, '2026-11-03T19:22:00-03:00'),
        ('noite-grunge-tributo-anos-90', 'Carolina Ramos', 'carolina.ramos@arenarock.com', 'Pista Rock', 'ROCK-NG08J3', true, '2026-11-21T22:05:00-03:00', '2026-11-05T10:15:00-03:00'),
        ('noite-grunge-tributo-anos-90', 'Andre Luiz Costa', 'andre.costa@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-NG09K6', false, NULL, '2026-11-07T21:40:00-03:00'),
        ('noite-grunge-tributo-anos-90', 'Sabrina Teixeira', 'sabrina.teixeira@arenarock.com', 'Mezanino / Camarote Backstage', 'ROCK-NG10L2', true, '2026-11-21T22:18:00-03:00', '2026-11-09T16:05:00-03:00'),
        ('noite-grunge-tributo-anos-90', 'Vinicius Rocha', 'vinicius.rocha@arenarock.com', 'Pista Rock', 'ROCK-NG11M9', false, NULL, '2026-11-11T12:30:00-03:00'),
        ('noite-grunge-tributo-anos-90', 'Bianca Andrade', 'bianca.andrade@arenarock.com', 'Pista Rock', 'ROCK-NG12N4', false, NULL, '2026-11-13T17:55:00-03:00'),
        ('noite-grunge-tributo-anos-90', 'Caio Henrique', 'caio.henrique@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-NG13P1', false, NULL, '2026-11-15T20:18:00-03:00'),
        ('noite-grunge-tributo-anos-90', 'Leticia Gomes', 'leticia.gomes@arenarock.com', 'Pista Rock', 'ROCK-NG14Q8', false, NULL, '2026-11-17T14:42:00-03:00'),
        ('noite-grunge-tributo-anos-90', 'Mateus Carvalho', 'mateus.carvalho@arenarock.com', 'Mezanino / Camarote Backstage', 'ROCK-NG15R5', false, NULL, '2026-11-19T18:27:00-03:00'),

        -- Show Aniversário 10 Anos: Fúria Subterrânea (14 compradores)
        ('show-aniversario-furia-subterranea', 'Igor Cavalcanti', 'igor.cavalcanti@arenarock.com', 'Pista Rock', 'ROCK-FS01C4', true, '2026-12-04T20:06:00-03:00', '2026-11-01T10:12:00-03:00'),
        ('show-aniversario-furia-subterranea', 'Priscila Martins', 'priscila.martins@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-FS02D8', true, '2026-12-04T20:18:00-03:00', '2026-11-02T15:40:00-03:00'),
        ('show-aniversario-furia-subterranea', 'Leandro Batista', 'leandro.batista@arenarock.com', 'Pista Rock', 'ROCK-FS03E2', false, NULL, '2026-11-04T19:05:00-03:00'),
        ('show-aniversario-furia-subterranea', 'Natasha Oliveira', 'natasha.oliveira@arenarock.com', 'Pista Rock', 'ROCK-FS04F6', true, '2026-12-04T20:33:00-03:00', '2026-11-06T12:25:00-03:00'),
        ('show-aniversario-furia-subterranea', 'Vitor Hugo Lima', 'vitor.lima@arenarock.com', 'Mezanino / Camarote Backstage', 'ROCK-FS05G9', false, NULL, '2026-11-08T21:14:00-03:00'),
        ('show-aniversario-furia-subterranea', 'Raquel Correia', 'raquel.correia@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-FS06H3', true, '2026-12-04T20:47:00-03:00', '2026-11-10T17:30:00-03:00'),
        ('show-aniversario-furia-subterranea', 'Samuel Pinheiro', 'samuel.pinheiro@arenarock.com', 'Pista Rock', 'ROCK-FS07J7', false, NULL, '2026-11-12T11:48:00-03:00'),
        ('show-aniversario-furia-subterranea', 'Debora Vieira', 'debora.vieira@arenarock.com', 'Pista Rock', 'ROCK-FS08K1', true, '2026-12-04T21:02:00-03:00', '2026-11-14T16:19:00-03:00'),
        ('show-aniversario-furia-subterranea', 'Murilo Fonseca', 'murilo.fonseca@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-FS09L5', false, NULL, '2026-11-16T20:44:00-03:00'),
        ('show-aniversario-furia-subterranea', 'Isabela Castro', 'isabela.castro@arenarock.com', 'Pista Rock', 'ROCK-FS10M8', false, NULL, '2026-11-18T14:03:00-03:00'),
        ('show-aniversario-furia-subterranea', 'Fernando Barros', 'fernando.barros@arenarock.com', 'Mezanino / Camarote Backstage', 'ROCK-FS11N2', true, '2026-12-04T21:20:00-03:00', '2026-11-20T09:50:00-03:00'),
        ('show-aniversario-furia-subterranea', 'Carla Mendonca', 'carla.mendonca@arenarock.com', 'Pista Rock', 'ROCK-FS12P7', false, NULL, '2026-11-22T18:36:00-03:00'),
        ('show-aniversario-furia-subterranea', 'Alexandre Pires', 'alexandre.pires@arenarock.com', 'Pista Rock', 'ROCK-FS13Q4', false, NULL, '2026-11-23T13:11:00-03:00'),
        ('show-aniversario-furia-subterranea', 'Juliana Cunha', 'juliana.cunha@arenarock.com', 'Pista Premium (Frontstage)', 'ROCK-FS14R9', false, NULL, '2026-11-24T22:15:00-03:00')
) AS v(slug_evento, nome, email, setor_ingresso, codigo_confirmacao, checkin, checkin_em, criado_em)
JOIN public.eventos e ON e.slug = v.slug_evento
ON CONFLICT (codigo_confirmacao) DO NOTHING;
