-- Migration: Adiciona carimbo de data/hora do check-in na tabela inscricoes
ALTER TABLE public.inscricoes ADD COLUMN IF NOT EXISTS checkin_em TIMESTAMPTZ;
