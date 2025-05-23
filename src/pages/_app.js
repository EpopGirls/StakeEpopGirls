import Head from "next/head";
import { Fragment } from "react";
import "../styles/globals.css";
import { ThirdwebProvider, metamaskWallet, trustWallet, walletConnect, okxWallet, ChainId, coinbaseWallet } from "@thirdweb-dev/react";
import { Polygon } from "@thirdweb-dev/chains";

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider
      autoConnect={true}
      activeChain={{
        ...Polygon,
        rpc: [process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL],
      }}  
      supportedChains={[Polygon]}
      supportedWallets={[
        metamaskWallet(),
        trustWallet(),
        okxWallet(),
        coinbaseWallet(),
        walletConnect(),
      ]}
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
    >
    <Fragment>
      <Head>
        {/* <!-- Google Fonts --> */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        {/* <!-- !Google Fonts --> */}

        {/* <!-- Styles --> */}
        <link type="text/css" rel="stylesheet" href="css/plugins.css" />
        <link type="text/css" rel="stylesheet" href="css/style.css?ver=1.1" />
      </Head>
      <Component {...pageProps} />
    </Fragment>
    </ThirdwebProvider>
  );
}

export default MyApp;
