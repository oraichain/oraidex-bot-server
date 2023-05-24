import type { ReactNode } from 'react';
import Header from './header';
import Footer from './footer';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="container">
      <Header />
      {children}
      <Footer />
    </main>
  );
}
