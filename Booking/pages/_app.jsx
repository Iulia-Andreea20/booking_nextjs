import Layout from '../app/components/Layout';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../app/components/Navbar';
import Footer from '../app/components/Footer';
import '../styles/globals.css';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const isRoot = router.pathname === '/';
    return (
        <AuthProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </AuthProvider>

    );
}

export default MyApp;

