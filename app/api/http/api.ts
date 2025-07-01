import axios from 'axios';
import { KEYCLOAK_BASE_CLIENT_URL } from '@/app/contants';

const nextAxios = axios.create({
  baseURL: process.env.NEXTAUTH_URL,
});

const keycloakAxios = axios.create({
  baseURL: KEYCLOAK_BASE_CLIENT_URL,
});

export async function refreshAccessToken(refreshToken: string) {
  try {
    const { data } = await keycloakAxios.post(
      process.env.REFRESH_TOKEN_URL!,
      new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function keycloakSessionLogout(idToken: string) {
  try {
    const url = process.env.END_SESSION_URL!;

    const body = new URLSearchParams({
      id_token_hint: idToken,
    });

    await keycloakAxios.get(url, { params: body });
  } catch (error) {
    console.log(error);
  }
}

export async function apiLogout() {
  return nextAxios.get(`/api/auth/logout`);
}
