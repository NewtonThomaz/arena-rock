-- Migration: Adiciona coluna de capa personalizada na tabela eventos
ALTER TABLE public.eventos ADD COLUMN IF NOT EXISTS imagem TEXT;
