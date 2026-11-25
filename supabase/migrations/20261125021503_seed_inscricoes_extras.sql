-- Migration: Simulação de ingressos para shows extras sem inscritos e sincronização de vagas_restantes

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
    f.nome,
    f.email_prefixo || '.' || e.id::TEXT || '@arenarock.com',
    f.setor_ingresso,
    'ROCK-X' || LPAD(e.id::TEXT, 3, '0') || LPAD(f.idx::TEXT, 2, '0'),
    f.checkin,
    CASE WHEN f.checkin THEN NOW() - INTERVAL '2 hours' ELSE NULL::TIMESTAMPTZ END,
    NOW() - ((9 - f.idx) * INTERVAL '1 day')
FROM public.eventos e
CROSS JOIN (
    VALUES
        (1, 'Lucas Viana', 'lucas.viana', 'Pista Rock', true),
        (2, 'Mariana Teles', 'mariana.teles', 'Pista Premium (Frontstage)', true),
        (3, 'Roberto Sales', 'roberto.sales', 'Mezanino / Camarote Backstage', false),
        (4, 'Helena Braga', 'helena.braga', 'Pista Rock', true),
        (5, 'Thiago Moraes', 'thiago.moraes', 'Pista Premium (Frontstage)', false),
        (6, 'Camila Duarte', 'camila.duarte', 'Pista Rock', false),
        (7, 'Bruno Queiroz', 'bruno.queiroz', 'Mezanino / Camarote Backstage', false),
        (8, 'Fernanda Lopes', 'fernanda.lopes', 'Pista Rock', false)
) AS f(idx, nome, email_prefixo, setor_ingresso, checkin)
WHERE NOT EXISTS (
    SELECT 1
    FROM public.inscricoes i
    WHERE i.evento_id = e.id
)
ON CONFLICT (codigo_confirmacao) DO NOTHING;

UPDATE public.eventos e
SET vagas_restantes = GREATEST(0, e.vagas_totais - COALESCE(contagem.total_inscritos, 0))
FROM (
    SELECT evento_id, COUNT(*)::INTEGER AS total_inscritos
    FROM public.inscricoes
    GROUP BY evento_id
) AS contagem
WHERE e.id = contagem.evento_id;
