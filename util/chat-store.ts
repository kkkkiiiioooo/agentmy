import { generateId, UIMessage } from 'ai';
import { existsSync, mkdirSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

// Interface agnostica: troque a implementacao mantendo as assinaturas.
const idRegex = /^[A-Za-z0-9_-]+$/;

function getFile(dir: string, id: string): string {
  if (!idRegex.test(id)) throw new Error('Invalid ID');
  const baseDir = path.resolve(process.cwd(), dir);
  const file = path.resolve(baseDir, `${id}.json`);
  if (!file.startsWith(`${baseDir}${path.sep}`)) throw new Error('Invalid ID');
  if (!existsSync(baseDir)) mkdirSync(baseDir, { recursive: true });
  return file;
}

export async function createChat(): Promise<string> {
  const id = generateId();
  await writeFile(getFile('.chats', id), '[]');
  return id;
}

export async function loadChat(id: string): Promise<UIMessage[]> {
  return JSON.parse(await readFile(getFile('.chats', id), 'utf8'));
}

export async function saveChat({
  chatId,
  messages,
}: {
  chatId: string;
  messages: UIMessage[];
}): Promise<void> {
  await writeFile(getFile('.chats', chatId), JSON.stringify(messages, null, 2));
}

export async function saveSkill(content: string): Promise<void> {
  await writeFile(getFile('.skills', 'default'), JSON.stringify({ content }));
}

export async function loadSkill(): Promise<string> {
  try {
    const raw = await readFile(getFile('.skills', 'default'), 'utf8');
    return JSON.parse(raw).content;
  } catch {
    return 'You are a helpful assistant.';
  }
}
