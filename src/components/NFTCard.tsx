import React, { useEffect, useState } from "react";
import {
  ThirdwebNftMedia,
  useContract,
  useNFT,
  Web3Button,
  lightTheme,
  useAddress,
  toEther,
  useTokenBalance,
} from "@thirdweb-dev/react";
import {
  nftDropContractAddress,
  stakingContractAddress,
  tokenContractAddress,
} from "../../consts/contractAddresses";
import { BigNumber } from "ethers";
import ErrorMessagePopup from '../components/popups/ErrorMessagePopup';
import SuccessMessagePopup from '../components/popups/SuccessMessagePopup';
import styles from "../styles/Home.module.css";

interface NFTCardProps {
  tokenId: number;
}

const NFTCard: React.FC<NFTCardProps> = ({ tokenId }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
  const [isMetadataLoading, setIsMetadataLoading] = useState(true);  // Para mostrar "Loading metadata..."
  const [loadedNfts, setLoadedNfts] = useState(0);  // Contador para saber cuántos NFTs han sido cargados
  const totalNFTs = 10;  // Número total de NFTs que estás cargando

  const address = useAddress();

  const { contract } = useContract(nftDropContractAddress, "nft-drop");
  const { data: nft, isLoading: isNFTLoading } = useNFT(contract, tokenId);

  const { contract: stakingContract } = useContract(stakingContractAddress);
  const { contract: tokenContract } = useContract(tokenContractAddress, "token");
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);

  useEffect(() => {
    if (!stakingContract || !address) return;

    const loadClaimableRewards = async () => {
      try {
        const stakeInfo = await stakingContract.call("getRewardsPerUnitTime");
        setClaimableRewards(stakeInfo);
      } catch (err) {
        console.error("Error al cargar recompensas:", err);
      }
    };

    loadClaimableRewards();
    const intervalId = setInterval(loadClaimableRewards, 1000);
    return () => clearInterval(intervalId);
  }, [stakingContract, address]);

  const truncateRevenue = (revenue: BigNumber) => {
    const convertToEther = toEther(revenue);
    return convertToEther.toString().slice(0, 6);
  };

  // Verificación de metadata para todos los NFTs
  useEffect(() => {
    if (!nft || !nft.metadata || !nft.metadata.image) return;

    setLoadedNfts((prev) => prev + 1); // Incrementamos el contador por cada NFT cargado

    // Si hemos cargado todos los NFTs, ocultamos el loading
    if (loadedNfts + 1 === totalNFTs) {
      setIsMetadataLoading(false);  // Cambiamos el estado a false cuando todos los NFTs han cargado
    }
  }, [nft, loadedNfts]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Solo mostramos un mensaje único de "Loading metadata..."
  if (isNFTLoading || isMetadataLoading) {
    return <p style={{ textAlign: "center" }}>Loading metadata...</p>;
  }

  return (
    <>
      <div className={styles.nftBox}>
        <ThirdwebNftMedia
          metadata={nft.metadata}
          className={styles.nftMedia}
        />
        <p style={{ textAlign: "center" }}>{nft.metadata.name}</p>

        {claimableRewards && (
          <p style={{ textAlign: "center" }}>
            <b>{truncateRevenue(claimableRewards)}</b>
            <img
              src="/favicon.ico"
              alt="$EPOP"
              style={{ width: "20px", height: "20px", margin: "-4px 5px" }}
            />
            <b style={{ fontSize: "12px" }}>24h</b>
          </p>
        )}

        {successMessage && (
          <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage('')} />
        )}
        {errorMessage && (
          <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage('')} />
        )}

        <Web3Button
          connectWallet={{
            btnTitle: "Connect Wallet",
            modalTitle: "Epop Girls",
            modalSize: "compact",
            modalTitleIconUrl: "/favicon.ico",
            showThirdwebBranding: false,
          }}
          theme={lightTheme({
            colors: {
              modalBg: "#26001c",
              borderColor: "transparent",
              separatorLine: "#3d002a",
              secondaryText: "#c4c4c4",
              primaryText: "#ffffff",
              connectedButtonBg: "transparent",
              primaryButtonBg: "transparent",
              primaryButtonText: "#ffffff",
              secondaryButtonHoverBg: "#3d002a",
              connectedButtonBgHover: "transparent",
              walletSelectorButtonHoverBg: "#3d002a",
              secondaryButtonText: "#ffffff",
              secondaryButtonBg: "#3d002a",
            },
          })}
          className={styles.connectWallet}
          style={{ border: "2px solid #f70195", height: "50px", width: "100%" }}
          action={(contract) => contract?.call("withdraw", [[nft.metadata.id]])}
          contractAddress={stakingContractAddress}
          onSuccess={() => {
            setSuccessMessage('Withdraw Successful');
          }}
          onError={() => {
            setErrorMessage('Error: Transaction rejected or insufficient funds.');
          }}
        >
          Withdraw
        </Web3Button>
      </div>
    </>
  );
};

export default NFTCard;
