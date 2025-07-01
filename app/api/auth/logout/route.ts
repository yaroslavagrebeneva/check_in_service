import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { getIdToken } from '@/app/utils/session-token-accessor';
import { keycloakSessionLogout } from '../../http/api';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session) {
    const idToken = await getIdToken();

    try {
      keycloakSessionLogout(idToken!);
    } catch (err) {
      console.error(err);
      return new Response(null, { status: 500 });
    }
  }

  return new Response(null, { status: 200 });
}
