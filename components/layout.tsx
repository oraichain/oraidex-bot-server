import type { ReactNode } from 'react';
import Header from './header';
import Footer from './footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';

export default function Layout({ children, title }: { children: ReactNode; title: string }) {
  return (
    <main className="container">
      <Head>
        <title>{title}</title>
      </Head>
      <Header />
      <div className="p-4">
        <h2>{title}</h2>
        {children}
      </div>
      <Footer />
    </main>
  );
}
