// import KeycloakProvider from 'next-auth/providers/keycloak';
// import { encrypt } from '@/app/utils/encryption';
// import { refreshAccessToken } from '@/app/api/http/api';
// import { jwtDecode } from 'jwt-decode';

// const keycloakProviderOptions = {
//   clientId: process.env.KEYCLOAK_CLIENT_ID!,
//   clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
//   issuer: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`,
// };

export const authOptions = {
  providers: [],
  // pages: {
  //   signIn: '/login',
  // },
  // callbacks: {}
};
