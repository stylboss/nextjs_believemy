import '@/styles/default.css';
import Layout from '@/component/ui/Layout/Layout';
import { Provider } from 'next-auth/client';

export default function App({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}