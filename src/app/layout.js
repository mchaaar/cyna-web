import { AuthProvider } from '../contexts/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Cyna - Cybersecurity Platform',
  description: 'Your trusted cybersecurity e-commerce platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
