import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const baseURL =
  process.env.OPENAI_COMPAT_BASE_URL ?? 'https://api.kilo.ai/api/gateway';
const apiKey = process.env.OPENAI_COMPAT_API_KEY ?? 'anonymous';

export const provider = createOpenAICompatible({
  name: 'custom-gateway',
  baseURL,
  apiKey,
});

// Modelo padrao (agnostico: troque via env sem mudar codigo):
export const model = provider(process.env.AGENT_MODEL ?? 'kilo/auto-free');

// Lista todos os modelos do endpoint /models:
export async function listModels() {
  const res = await fetch(`${baseURL}/models`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error(`Falha ao listar modelos: ${res.status}`);
  return res.json();
}
