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

  const address = useAddress();
  const { contract } = useContract(nftDropContractAddress, "nft-drop");
  const { data: nft } = useNFT(contract, tokenId);
  const { contract: stakingContact } = useContract(stakingContractAddress);

  const { contract: tokenContract } = useContract(tokenContractAddress, "token");
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  
  useEffect(() => {
    if (!stakingContact || !address) return;

    async function loadClaimableRewards() {
      const stakeInfo = await stakingContact?.call("getRewardsPerUnitTime");
      setClaimableRewards(stakeInfo);
    }    

    loadClaimableRewards();

    const intervalId = setInterval(loadClaimableRewards, 1000);

    return () => clearInterval(intervalId);
  }, [stakingContact, address]);

  const truncateRevenue = (revenue: BigNumber) => {
    const convertToEther = toEther(revenue);
    const truncateValue = convertToEther.toString().slice(0, 6);
    return truncateValue;
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 4000); // Cierra el mensaje de error después de 4 segundos
    
      return () => clearTimeout(timer); // Limpia el temporizador cuando el componente se desmonta o cuando el mensaje de error cambia
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 4000); // Cierra el mensaje de éxito después de 4 segundos
    
      return () => clearTimeout(timer); // Limpia el temporizador cuando el componente se desmonta o cuando el mensaje de éxito cambia
    }
  }, [successMessage]);


  const handleConnectWallet = async () => {
    try {
      // Tu lógica para conectar la billetera
      // Supongamos que aquí tienes una operación exitosa
      setSuccessMessage('Goblin Minted');
    } catch (error) {
      // Si ocurre un error
      setErrorMessage('Error: Transaction rejected or insufficient funds.');
      setSuccessMessage(''); // Asegúrate de borrar cualquier mensaje de éxito anterior
    }
  };

  return (
    <>
      {nft && (
        <div className={styles.nftBox}>
          {nft.metadata && (
            <ThirdwebNftMedia
              metadata={nft.metadata}
              className={styles.nftMedia}
            />
          )}
          <p style={{ textAlign: "center" }}>{nft.metadata.name}</p>
          {claimableRewards && (
            <p style={{ textAlign: "center" }}> <b>{truncateRevenue(claimableRewards)}</b><img src="/favicon.ico" alt="$EPOP" style={{ width: "20px", height: "20px", margin: "-4px 5px" }} /><b style={{ fontSize: "12px" }}>24h</b></p>
          )}
          {successMessage && <SuccessMessagePopup message={successMessage} onClose={() => setSuccessMessage('')} />}
          {errorMessage && <ErrorMessagePopup message={errorMessage} onClose={() => setErrorMessage('')} />} 
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
      )}
    </>
  );
};

export default NFTCard;