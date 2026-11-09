// ATENCAO: esqueleto. Complete com armazenamento de tokens
// (use o mesmo store agnostico) e a rota de callback.
export const composioOAuthProvider: any = {
  // Com DCR, NAO forneca clientInformation pre-registrado:
  // o SDK registra o cliente dinamicamente.

  validateAuthorizationServerURL(serverUrl: string, authServerUrl: string) {
    const origin = new URL(authServerUrl).origin;
    console.log(`Autorizacao solicitada por: ${origin} (${serverUrl})`);
  },

  async isClientInformationDynamicallyRegistered() {
    return true;
  },

  // TODO (ver referencia do createMCPClient):
  // saveClientInformation, clientInformation, tokens, saveTokens,
  // redirectToAuthorization, state/verifier, invalidateCredentials...
};
