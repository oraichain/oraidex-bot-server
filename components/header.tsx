import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from './header.module.css';

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const router = useRouter();

  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>

      <div className={styles.signedInStatus}>
        <p className={`nojs-show d-flex flex-row justify-content-between ${!session && loading ? styles.loading : styles.loaded}`}>
          <img src="/static/images/oraichain.svg" />
          {router.pathname !== '/signin' ? (
            session?.user ? (
              <a
                href={`/api/auth/signout`}
                className="btn btn-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                Sign out
              </a>
            ) : (
              <a
                href={`/api/auth/signin`}
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  signIn();
                }}
              >
                Sign in
              </a>
            )
          ) : null}
        </p>
      </div>

      <nav className="navbar navbar-expand-sm bg-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className={`${router.pathname === '/' ? 'nav-link active' : 'nav-link'}`} href="/">
              Home
            </Link>
          </li>
          {session && (
            <>
              <li className="nav-item">
                <Link className={`${router.pathname === '/admin' ? 'nav-link active' : 'nav-link'}`} href="/admin">
                  Admin
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`${router.pathname === '/me' ? 'nav-link active' : 'nav-link'}`} href="/me">
                  Me
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
