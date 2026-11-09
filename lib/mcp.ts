import { createMCPClient, type MCPClient } from '@ai-sdk/mcp';
import type { ToolSet } from 'ai';
import { composioOAuthProvider } from '@/lib/oauth-provider';

type MCPServerConfig = {
  url: string;
  auth: 'none' | 'bearer' | 'oauth';
  token?: string;
};

export async function connectMCP(): Promise<{
  tools: ToolSet;
  close: () => Promise<void>;
}> {
  const servers: MCPServerConfig[] = JSON.parse(
    process.env.MCP_SERVERS ?? '[]',
  );

  const clients: MCPClient[] = [];
  let tools: ToolSet = {};

  for (const server of servers) {
    try {
      const client = await createMCPClient({
        transport: {
          type: 'http',
          url: server.url,
          ...(server.auth === 'bearer' && server.token
            ? { headers: { Authorization: `Bearer ${server.token}` } }
            : {}),
          ...(server.auth === 'oauth'
            ? { authProvider: composioOAuthProvider }
            : {}),
        },
      });
      clients.push(client);
      tools = { ...tools, ...(await client.tools()) };
    } catch (error) {
      console.error(`MCP falhou (${server.url}):`, error);
    }
  }

  return {
    tools,
    close: async () => {
      await Promise.all(clients.map(c => c.close()));
    },
  };
}
