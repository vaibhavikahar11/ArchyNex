import "../styles/globals.css";
import { Inter } from "@next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/logo.png"  />
      </Head>
      <div className={inter.className}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
