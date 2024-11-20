import React, { useEffect, useState } from "react";
import { lightTheme, ThirdwebNftMedia, useAddress, useContract, useContractRead, useOwnedNFTs, useTokenBalance, Web3Button } from "@thirdweb-dev/react";
import { nftDropContractAddress, stakingContractAddress, tokenContractAddress } from "../../consts/contractAddresses";
import NFTCard from "./NFTCard";
import { BigNumber, ethers } from "ethers";
import styles from "../styles/Home.module.css";

const ServicesComponent: React.FC = () => {

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const address = useAddress();

  const { contract: nftDropContract } = useContract(nftDropContractAddress, "nft-drop");
  const { contract: tokenContract } = useContract(tokenContractAddress, "token");
  const { contract, isLoading } = useContract(stakingContractAddress);
  const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
  const { data: stakedTokens } = useContractRead(contract, "getStakeInfo", [address]);
  const [numNFTsToWithdraw, setNumNFTsToWithdraw] = useState<number>(0);
  const [numNFTsToStake, setNumNFTsToStake] = useState<number>(0);

  useEffect(() => {
    if (!contract || !address) return;

    async function loadClaimableRewards() {
      const stakeInfo = await contract?.call("getStakeInfo", [address]);
      setClaimableRewards(stakeInfo[1]);
    }

    loadClaimableRewards();
  }, [address, contract]);

  async function stakeNft(id: string) {
    if (!address) return;

    const isApproved = await nftDropContract?.isApproved(address, stakingContractAddress);
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
    }
    await contract?.call("stake", [[id]]);
  }

  async function stakeAllNfts() {
    if (!address || !ownedNfts) return;

    const unstackedNfts = ownedNfts.filter((nft) => !isNftStaked(nft.metadata.id));

    if (unstackedNfts.length === 0) {
      console.log("No NFTs to stake.");
      return;
    }

    const nftIds = unstackedNfts.map((nft) => nft.metadata.id);

    const isApproved = await nftDropContract?.isApproved(address, stakingContractAddress);
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
    }

    await contract?.call("stake", [nftIds]);
  }

  async function withdrawAllNfts() {
    if (!address || !stakedTokens) return;

    if (stakedTokens[0]?.length === 0) {
      console.log("No NFTs to unstake.");
      return;
    }

    const nftIds = stakedTokens[0].map((stakedToken: BigNumber) => stakedToken.toString());

    // Asegúrate de que "unstake" es el nombre correcto de la función en tu contrato
    await contract?.call("withdraw", [nftIds]);
  }

  async function withdrawNFTs(numNFTs: number) {
    if (!address || !stakedTokens || stakedTokens[0]?.length === 0) {
      console.log("No NFTs to withdraw.");
      return;
    }

    const nftIds = stakedTokens[0].slice(0, numNFTs).map((stakedToken: BigNumber) => stakedToken.toString());

    // Asegúrate de que "withdraw" es el nombre correcto de la función en tu contrato
    await contract?.call("withdraw", [nftIds]);
  }

  async function stakeNFTs(numNFTs: number) {
    if (!address || !ownedNfts) return;

    const unstackedNfts = ownedNfts.filter((nft) => !isNftStaked(nft.metadata.id));

    if (unstackedNfts.length === 0) {
      console.log("No NFTs to stake.");
      return;
    }

    const nftIds = unstackedNfts.slice(0, numNFTs).map((nft) => nft.metadata.id);

    const isApproved = await nftDropContract?.isApproved(address, stakingContractAddress);
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
    }

    await contract?.call("stake", [nftIds]);
  }

  function isNftStaked(nftId: string) {
    return stakedTokens && stakedTokens[0]?.includes(BigNumber.from(nftId));
  }

  if (isLoading) {
    return <div>Loading</div>;
  }


  return (
    <section id="services">
      {/* Dividers */}
      <img
        src="svg/divider.svg"
        alt=""
        className="fn__svg fn__divider top_divider"
      />
      <img
        src="svg/divider.svg"
        alt=""
        className="fn__svg fn__divider bottom_divider"
      />
      {/* !Dividers */}
      <div className="container">
        {/* Main Title */}
        <div className="neoh_fn_title">
          <h3 className="fn_title">Girls Staked</h3>
          <div className="line">
            <span />
          </div>
        </div>
        {/* !Main Title */}
        {/* Services */}
        <div className="neoh_fn_services">
          <div>
          <div className={styles.grid}>
                {stakedTokens &&
                  stakedTokens[0]?.map((stakedToken: BigNumber) => (
                    <NFTCard
                      tokenId={stakedToken.toNumber()}
                      key={stakedToken.toString()}
                    />
                  ))}
              </div>
          </div>

          <div style={{ paddingTop: "5rem" }} className="neoh_fn_title">
            <h3 className="fn_title">Girls Unstaked</h3>
            <div className="line">
              <span />
            </div>
          </div>
          <div className={styles.grid}>
            <div>
              {ownedNfts?.map((nft) => (
                <div key={nft.metadata.id.toString()}>
                  <ThirdwebNftMedia
                    metadata={nft.metadata}
                    className={styles.nftMedia}
                  />
                  <p style={{ textAlign: "center" }}>{nft.metadata.name}</p>
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
                    contractAddress={stakingContractAddress}
                    action={() => stakeNft(nft.metadata.id)}
                    onSuccess={() => {
                      setSuccessMessage('Girl Working');
                    }}
                    onError={() => {
                      setErrorMessage('Error: Transaction rejected or insufficient funds.');
                    }}
                    style={{ border: "2px solid #f70195", height: "50px", width: "100%" }}
                  >
                    Stake
                  </Web3Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* !Services */}
      </div>
    </section>
  );
};
export default ServicesComponent;
