import React, { useState, useEffect } from 'react';
import { ConnectWallet, lightTheme, useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import ErrorMessagePopup from "./popups/ErrorMessagePopup";
import SuccessMessagePopup from './popups/SuccessMessagePopup';
import EpopStakingBalance from './BalanceToClaim';
import Stats2 from './BarStatsTokenStaking';

// ABI del contrato
const stakingContractABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "_rewardToken", "type": "address" }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "ADMIN_ROLE",
        "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "EPOP_PER_MATIC",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "TIME_UNIT",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "claimRewards",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }],
        "name": "depositRewardTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getRewardTokenBalance",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
        "name": "getStakeInfo",
        "outputs": [
            { "internalType": "uint256", "name": "amountStaked", "type": "uint256" },
            { "internalType": "uint256", "name": "amountLocked", "type": "uint256" },
            { "internalType": "uint256", "name": "lastClaimTime", "type": "uint256" },
            { "internalType": "uint256", "name": "epopRewards", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "rewardToken",
        "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "rewardTokenDecimals",
        "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "sendToPool",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "stake",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "stakingTokenBalance",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }],
        "name": "withdrawRewardTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    }
];

const contractAddress = "0x9e0bd9a2a990df70e3d91cd3cb081247600723e4";

const TokenDashboard = () => {
    const address = useAddress();
    const [amountToStake, setAmountToStake] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isVerified, setIsVerified] = useState<boolean | null>(null);
    const [stakingLoading, setStakingLoading] = useState(false);
    const [unstakingLoading, setUnstakingLoading] = useState(false);
    const [claimingLoading, setClaimingLoading] = useState(false);
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [userStakeInfo, setUserStakeInfo] = useState<any>(null);
    const [totalAccruedRewards, setTotalAccruedRewards] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [walletBalance, setWalletBalance] = useState<string | null>(null);
    const [epopPerMatic, setEpopPerMatic] = useState<number>(0);
    const [timeUnit, setTimeUnit] = useState<number>(0);

    const handleVerificationStatus = (isVerified: boolean, loading: boolean) => {
        setIsVerified(isVerified);
        setLoading(loading);
    };

    useEffect(() => {
        if (window.ethereum) {
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(web3Provider);

            const stakingContract = new ethers.Contract(contractAddress, stakingContractABI, web3Provider.getSigner());
            setContract(stakingContract);
        }
    }, []);

    useEffect(() => {
        if (provider && address) {
            fetchWalletBalance();
        }
    }, [provider, address]);

    useEffect(() => {
        if (contract) {
            fetchContractConstants();
        }
    }, [contract]);

    useEffect(() => {
        if (contract && address) {
            fetchStakeInfo();
            fetchRewards();

            const interval = setInterval(() => {
                fetchStakeInfo();
                fetchRewards();
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [contract, address]);

    const fetchContractConstants = async () => {
        try {
            const epopPerMaticValue = await contract?.EPOP_PER_MATIC();
            const timeUnitValue = await contract?.TIME_UNIT();
            setEpopPerMatic(epopPerMaticValue.toNumber());
            setTimeUnit(timeUnitValue.toNumber());
        } catch (error) {
            console.error("Error fetching contract constants:", error);
        }
    };

    const fetchWalletBalance = async () => {
        try {
            const balance = await provider?.getBalance(address);
            if (balance) {
                const formattedBalance = ethers.utils.formatEther(balance);
                setWalletBalance(formattedBalance);
            }
        } catch (error) {
            console.error("Error fetching wallet balance:", error);
        }
    };

    const fetchStakeInfo = async () => {
        try {
            const stakeInfo = await contract?.getStakeInfo(address);
            if (stakeInfo) {
                const formattedStakeInfo = {
                    amountStaked: ethers.utils.formatEther(stakeInfo.amountStaked),
                    amountLocked: ethers.utils.formatEther(stakeInfo.amountLocked),
                    lastClaimTime: new Date(stakeInfo.lastClaimTime * 1000).toLocaleString(),
                    epopRewards: ethers.utils.formatUnits(stakeInfo.epopRewards, 18),
                };
                setUserStakeInfo(formattedStakeInfo);
            }
        } catch (error) {
            console.error("Error fetching stake info:", error);
        }
    };

    const fetchRewards = async () => {
        try {
            const rewards = await contract?.getStakeInfo(address);
            const formattedRewards = ethers.utils.formatUnits(rewards.epopRewards, 18);
            setTotalAccruedRewards(parseFloat(formattedRewards).toFixed(2));
        } catch (error) {
            console.error("Error fetching rewards:", error);
        }
    };

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const updateQuantity = (operation: string) => {
        if (operation === "+" && amountToStake < 500) {
            setAmountToStake(amountToStake + 1);
        } else if (operation === "-" && amountToStake > 1) {
            setAmountToStake(amountToStake - 1);
        }
    };

    const handleSetMax = () => {
        if (walletBalance) {
            const maxBalance = Math.trunc(parseFloat(walletBalance)); // Descartar decimales
            setAmountToStake(maxBalance);
        }
    };

    const handleStake = async () => {
        if (!contract || !address) return;

        try {
            setStakingLoading(true);
            const stakeTx = await contract?.stake({
                value: ethers.utils.parseEther(amountToStake.toString()),
            });
            await stakeTx.wait();
            fetchStakeInfo();
            fetchRewards();
            fetchWalletBalance();
            setSuccessMessage("Staking successful!");
        } catch (error) {
            console.error("Error staking MATIC:", error);
            setErrorMessage("Error staking MATIC. Try Again.");
        } finally {
            setStakingLoading(false);
        }
    };

    const handleWithdraw = async (amount: string) => {
        if (!contract || !address) return;

        try {
            setUnstakingLoading(true);
            const withdrawTx = await contract?.withdraw(ethers.utils.parseEther(amount));
            await withdrawTx.wait();
            fetchStakeInfo();
            fetchRewards();
            fetchWalletBalance();
            setSuccessMessage("Withdrawal successful!");
        } catch (error) {
            console.error("Error withdrawing MATIC:", error);
            setErrorMessage("Error withdrawing MATIC. Try Again.");
        } finally {
            setUnstakingLoading(false);
        }
    };

    const handleClaimRewards = async () => {
        if (!contract || !address) return;

        try {
            setClaimingLoading(true);
            const claimTx = await contract?.claimRewards();
            await claimTx.wait();
            fetchStakeInfo();
            fetchRewards();
            setSuccessMessage("Rewards claimed successfully!");
        } catch (error) {
            console.error("Error claiming rewards:", error);
            setErrorMessage("Error claiming rewards. Try Again.");
        } finally {
            setClaimingLoading(false);
        }
    };

    const calculateAPR = () => {
        if (!epopPerMatic || !timeUnit) return 0;
        // Assuming 1 MATIC = 1 USD for APR calculation
        // EPOP_PER_MATIC is for TIME_UNIT (48 hours)
        // APR = (Reward per TIME_UNIT * (365 days / TIME_UNIT in days)) * 100
        const rewardsPerYear = (epopPerMatic * (365 / (timeUnit / (24 * 60 * 60))));
        return (rewardsPerYear * 100).toFixed(2); // Convert to percentage
    };

    return (
        <section id="about">
            <div id='token-stake' className="container">
                {/* About Item #1 */}
                <div className="neoh_fn_about_item">
                    <div className="img_item">
                        <img src="img/about/POL-EPOP.png" alt="Token Staking" />
                    </div>
                    <div className="content_item">
                        <div className="neoh_fn_title" data-align="left">
                            <h3 className="fn_title">Token Staking Dashboard</h3>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center", // Opcional, por si el contenido no tiene la misma altura
                                    gap: "5px", // Espacio entre el texto y el componente si lo necesitas
                                }}
                            >
                                <p>Supply to claim:</p>
                                <EpopStakingBalance />
                            </div>

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
                                    <Stats2 />
                                </div>

                                <div className="neoh_fn_title">
                                    <div className="line">
                                        <span />
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: "50px",
                                            marginTop: "20px",
                                        }}
                                    >
                                        <div>
                                            <p style={{ fontSize: "20px", marginBottom: "10px", textAlign: "center" }}>$POL Staked</p>
                                            <p style={{ textAlign: "center" }}>
                                                <b>{userStakeInfo ? userStakeInfo.amountStaked : "Loading..."}</b>
                                            </p>
                                        </div>

                                        <div>
                                            <p style={{ fontSize: "20px", marginBottom: "10px", textAlign: "center" }}>$POL Blocked</p>
                                            <p style={{ textAlign: "center" }}>
                                                <b>{userStakeInfo ? userStakeInfo.amountLocked : "Loading..."}</b>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="line">
                                        <span />
                                    </div>

                                    <div className="qnt" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
                                        <span className="decrease" onClick={() => updateQuantity("-")} style={{ cursor: "pointer", margin: "0 10px" }}>-</span>
                                        <span className="summ">{amountToStake}</span>
                                        <span className="increase" onClick={() => updateQuantity("+")} style={{ cursor: "pointer", margin: "0 10px" }}>+</span>
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <span className="setMax" onClick={handleSetMax} style={{ cursor: "pointer", margin: "0 10px" }}>Set Max.</span>
                                    </div>

                                    <div>
                                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
                                            {errorMessage && (
                                                <ErrorMessagePopup
                                                    message={errorMessage}
                                                    onClose={() => setErrorMessage("")}
                                                />
                                            )}
                                            {successMessage && (
                                                <SuccessMessagePopup
                                                    message={successMessage}
                                                    onClose={() => setSuccessMessage("")}
                                                />
                                            )}
                                            <button
                                                style={{ border: "2px solid #f70195", height: "50px", width: "150px", borderRadius: "10px", backgroundColor: "transparent", color: "white", fontSize: "16px" }}
                                                onClick={handleStake}
                                                disabled={stakingLoading}
                                            >
                                                {stakingLoading ? "Staking..." : "Stake POL"}
                                            </button>

                                            <button
                                                style={{ border: "2px solid #f70195", height: "50px", width: "150px", borderRadius: "10px", backgroundColor: "transparent", color: "white", fontSize: "16px" }}
                                                onClick={() => handleWithdraw(amountToStake.toString())}
                                                disabled={unstakingLoading}
                                            >
                                                {unstakingLoading ? "Unstaking..." : "Unstake POL"}
                                            </button>

                                            <button
                                                style={{ border: "2px solid #f70195", height: "50px", width: "150px", borderRadius: "10px", backgroundColor: "transparent", color: "white", fontSize: "16px" }}
                                                onClick={handleClaimRewards}
                                                disabled={claimingLoading || totalAccruedRewards === "0"}
                                            >
                                                {claimingLoading ? "Claiming..." : "Claim Rewards"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div
                            style={{
                                marginTop: "50px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <p>Developed by</p>
                            <a href="https://goblinsaga.xyz" target="_blank" rel="noopener noreferrer">
                                <img
                                    src="/img/about/GoblinSaga.png"
                                    alt="Logo"
                                    style={{ height: "50px", marginTop: "-20px", cursor: "pointer" }}
                                />
                            </a>
                        </div>
                    </div>
                </div>
                {/* !About Item #1 */}
            </div>
        </section>
    );
};

export default TokenDashboard;
