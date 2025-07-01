import Link from 'next/link';

export default async function Home() {
  return (
    <div className="p-3">
      <Link href={'/login'}>Keycloak</Link>
    </div>
  );
}
