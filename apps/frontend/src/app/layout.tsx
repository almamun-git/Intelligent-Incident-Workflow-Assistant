import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ops-Assist AI - Intelligent Incident Management',
  description: 'AI-powered incident detection and management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">OA</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">Ops-Assist AI</h1>
                </div>
                <nav>
                  <ul className="flex space-x-6">
                    <li>
                      <a href="/" className="text-gray-600 hover:text-gray-900 font-medium">
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a href="/incidents" className="text-gray-600 hover:text-gray-900 font-medium">
                        Incidents
                      </a>
                    </li>
                    <li>
                      <a href="/analytics" className="text-gray-600 hover:text-gray-900 font-medium">
                        Analytics
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="bg-white border-t mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <p className="text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} Ops-Assist AI. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}