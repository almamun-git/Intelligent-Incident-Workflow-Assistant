import React from 'react';

const Layout: React.FC = ({ children }) => {
    return (
        <div>
            <header>
                <h1>Ops-Assist AI</h1>
                <nav>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/incidents">Incidents</a></li>
                        <li><a href="/analytics">Analytics</a></li>
                    </ul>
                </nav>
            </header>
            <main>{children}</main>
            <footer>
                <p>&copy; {new Date().getFullYear()} Ops-Assist AI. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;