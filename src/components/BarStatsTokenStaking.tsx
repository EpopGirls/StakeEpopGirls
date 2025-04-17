import React, { useEffect, useState } from "react";
import {
    ConnectWallet,
    ThirdwebNftMedia,
    useAddress,
    useContract,
    useContractRead,
    useOwnedNFTs,
    useTokenBalance,
    Web3Button,
    lightTheme,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";
import {
    nftDropContractAddress,
    stakingContractAddress,
    tokenContractAddress,
} from "../../consts/contractAddresses";
import TokenRewards from "./TokenRewards";

const Stats2: NextPage = () => {
    const address = useAddress();

    const { contract: nftDropContract } = useContract(nftDropContractAddress, "nft-drop");
    const { contract: tokenContract } = useContract(tokenContractAddress, "token");
    const { contract, isLoading } = useContract(stakingContractAddress);
    const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
    const { data: tokenBalance, isLoading: isLoadingTokenBalance } = useTokenBalance(tokenContract, address);
    const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
    const { data: stakedTokens } = useContractRead(contract, "getStakeInfo", [address]);

    useEffect(() => {
        if (!contract || !address) return;

        async function loadClaimableRewards() {
            const stakeInfo = await contract?.call("getStakeInfo", [address]);
            setClaimableRewards(stakeInfo[1]);
        }

        loadClaimableRewards();

        const intervalId = setInterval(loadClaimableRewards, 1000);
        return () => clearInterval(intervalId);
    }, [address, contract]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "100px",
            }}
        >
            <div>
                <p style={{ fontSize: "20px", marginBottom: "10px", textAlign: "center" }}>Balance</p>
                <p style={{ textAlign: "center" }}>
                    <b>
                        {isLoadingTokenBalance
                            ? "Loading..."
                            : tokenBalance?.displayValue && parseFloat(tokenBalance?.displayValue).toFixed(2)}
                    </b>
                </p>
            </div>
            <div>
                <p style={{ fontSize: "20px", marginBottom: "10px", textAlign: "center" }}>Rewards</p>
                <p style={{ textAlign: "center" }}>
                    <TokenRewards />
                </p>
            </div>
        </div>
    );
};

export default Stats2;
