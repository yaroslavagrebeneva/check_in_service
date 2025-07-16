import KeycloakProvider from 'next-auth/providers/keycloak';
import { encrypt } from '@/app/utils/encryption';
import { refreshAccessToken } from '@/app/api/http/api';
import { jwtDecode } from 'jwt-decode';

const keycloakProviderOptions = {
  clientId: process.env.KEYCLOAK_CLIENT_ID!,
  clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
  issuer: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`,
};

export const authOptions = {
  providers: [KeycloakProvider(keycloakProviderOptions)],

  pages: {
    signIn: '/login',
  },

  callbacks: {
    async jwt({ token, account }: { token: any; account: any }) {
      const current_timestamp = Math.floor(Date.now() / 1000);

      if (account) {
        token.decoded = jwtDecode(account.access_token);
        token.access_token = account.access_token;
        token.id_token = account.id_token;
        token.expires_at = account.expires_at;
        token.refresh_token = account.refresh_token;
        return token;
      }

      if (current_timestamp < token.expires_at) {
        return token;
      }

      try {
        const refreshedToken = await refreshAccessToken(token.refresh_token);

        token.access_token = refreshedToken.access_token;
        token.id_token = refreshedToken.id_token;
        token.refresh_token = refreshedToken.refresh_token;
        token.expires_at = current_timestamp + refreshedToken.expires_in;
        token.decoded = jwtDecode(refreshedToken.access_token);

        return token;
      } catch (error) {
        console.error('Error refreshing access token', error);
        return { ...token, error: 'RefreshAccessTokenError' };
      }
    },
    async session({ session, token }: { session: any; token: any }) {
      session.access_token = encrypt(token.access_token);
      session.id_token = encrypt(token.id_token);
      session.roles = token.decoded.realm_access.roles;
      session.error = token.error;
      session.user_id = token.decoded.sub;

      return session;
    },
  },
};
