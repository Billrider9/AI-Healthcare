"use client";

import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import ClientAuthProvider from './ClientAuthProvider';
import Header from './Header';
import Footer from './Footer';

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const isDashboardRoute = pathname?.startsWith("/dashboard");

  return (
    <ClientAuthProvider>
      {/* Dashboard uses its own sidebar + top bar — hide marketing header to avoid duplicate nav */}
      {!isDashboardRoute && <Header />}
      <main
        className={
          isDashboardRoute
            ? "min-h-screen"
            : "min-h-screen bg-gray-50 dark:bg-gray-900"
        }
      >
        {children}
      </main>
      {!isDashboardRoute && <Footer isDashboardRoute={false} />}
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 5000,
          style: {
            background: '#fff',
            color: '#333',
          },
        }}
      />
    </ClientAuthProvider>
  );
} 