import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  createIdGenerator,
  isStepCount,
  streamText,
  toUIMessageStream,
} from 'ai';
import { loadChat, saveChat } from '@/util/chat-store';
import { connectMCP } from '@/lib/mcp';
import { model } from '@/lib/model';

export const maxDuration = 30;

// System prompt (troque via env sem mudar codigo):
const SYSTEM_PROMPT =
  process.env.SYSTEM_PROMPT ?? 'You are a helpful assistant.';

export async function POST(req: Request) {
  const { message, id } = await req.json();

  const previousMessages = await loadChat(id);
  const messages = [...previousMessages, message];

  const mcp = await connectMCP();

  const result = streamText({
    model,
    instructions: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: mcp.tools,
    stopWhen: isStepCount(5),
    onEnd: async () => {
      await mcp.close();
    },
  });

  result.consumeStream();

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      originalMessages: messages,
      generateMessageId: createIdGenerator({ prefix: 'msg', size: 16 }),
      onEnd: ({ messages }) => {
        saveChat({ chatId: id, messages });
      },
    }),
  });
}
