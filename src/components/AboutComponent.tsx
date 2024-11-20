import Link from "next/link";
import { ConnectWallet, useAddress, useContract, Web3Button, lightTheme, useOwnedNFTs, useTokenBalance, useContractRead } from "@thirdweb-dev/react";
import { nftDropContractAddress, stakingContractAddress, tokenContractAddress } from "../../consts/contractAddresses";
import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Stats from "./BarStats"
import ErrorMessagePopup from "./popups/ErrorMessagePopup";
import SuccessMessagePopup from "./popups/SuccessMessagePopup";


const AboutComponent = () => {
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


  return (
    <section id="about">
      <div className="container">
        {/* About Item #1 */}
        <div className="neoh_fn_about_item">
          <div className="img_item">
            <img src="img/about/2.png" alt="" />
          </div>
          <div className="content_item">
            <div className="neoh_fn_title" data-align="left">
              <h3 className="fn_title">Staking Tools</h3>
              <div className="line">
                <span />
              </div>
            </div>

            {!address && (
              <>
                <p style={{ color: "#f70195", textAlign: "center" }}>
                  Connect your wallet to access this section.
                </p>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                  <ConnectWallet
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
                    modalTitle={"Epop Girls"}
                    switchToActiveChain={true}
                    modalSize={"compact"}
                    showThirdwebBranding={false}
                    modalTitleIconUrl={"/favicon.ico"}
                    style={{ border: "2px solid #f70195", height: "50px" }}
                  />
                </div>
              </>
            )}


            {address && (
              <>
                <div className="desc">
                  <Stats />
                </div>
                <div>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "50px", marginTop: "50px" }}>
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
                      action={(contract) => contract.call("claimRewards")}
                      contractAddress={stakingContractAddress}
                      onSuccess={() => {
                        setSuccessMessage('Rewards Claimed');
                      }}
                      onError={() => {
                        setErrorMessage('Error: Transaction rejected or insufficient funds.');
                      }}
                      style={{ border: "2px solid #f70195", height: "50px" }}
                    >
                      Claim Rewards
                    </Web3Button>

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
                      action={() => stakeAllNfts()}
                      contractAddress={stakingContractAddress}
                      onSuccess={() => {
                        setSuccessMessage('NFTs Staked');
                      }}
                      onError={() => {
                        setErrorMessage('Error: Transaction rejected or insufficient funds.');
                      }}
                      style={{ border: "2px solid #f70195", height: "50px" }}
                    >
                      Stake NFTs
                    </Web3Button>

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
                      action={() => withdrawAllNfts()} // Llamamos a la función de unstakeAllNfts en el action
                      contractAddress={stakingContractAddress}
                      onSuccess={() => setSuccessMessage('All Goblins are taking a break')}
                      onError={() => {
                        setErrorMessage('Error: Transaction rejected or insufficient funds.');
                      }}

                      style={{ border: "2px solid #f70195", height: "50px" }}
                    >
                      Unstake NFTs
                    </Web3Button>

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
                      action={(contract) => contract.erc721.claim(1)}
                      contractAddress="0x6a91E0E4a6236008B778Ced5C9356C05f6c61e3c"
                      onSuccess={() => {
                        setSuccessMessage('Epop Minted');
                      }}
                      onError={() => {
                        setErrorMessage('Error: Transaction rejected or insufficient funds.');
                      }}

                      style={{ border: "2px solid #f70195", height: "50px" }}
                    >
                      Mint NFT
                    </Web3Button>
                  </div>

                  {successMessage && <p style={{ color: "green", marginTop: "20px" }}>{successMessage}</p>}
                  {errorMessage && <p style={{ color: "red", marginTop: "20px" }}>{errorMessage}</p>}
                </div>
              </>
            )}
          </div>
        </div>
        {/* !About Item #1 */}
      </div>
    </section>
  );
};
export default AboutComponent;
