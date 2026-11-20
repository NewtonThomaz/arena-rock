-- Migration: Dados iniciais de categorias
INSERT INTO public.categorias (nome, slug, cor) VALUES
    ('Show', 'show', '#e11d48'),
    ('Festival', 'festival', '#f97316'),
    ('Tributo', 'tributo', '#eab308'),
    ('Batalha de Bandas', 'batalha-de-bandas', '#ef4444'),
    ('Workshop', 'workshop', '#8b5cf6'),
    ('Encontro Rock', 'encontro-rock', '#10b981')
ON CONFLICT (slug) DO NOTHING;
