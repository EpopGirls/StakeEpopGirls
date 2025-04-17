import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import React from 'react';

const EpopStakingBalance = () => {
    const [balance, setBalance] = useState(null);
    const [provider, setProvider] = useState(null);
    const tokenAddress = '0x25F47118e9cae9fAe6Bf90FF31EB5B4521219ae3';
    const contractAddress = '0x9e0bd9a2a990df70e3d91cd3cb081247600723e4';

    const tokenABI = [
        "function balanceOf(address owner) view returns (uint256)"
    ];

    useEffect(() => {
        if (typeof window !== "undefined" && window.ethereum) {
            setProvider(new ethers.providers.Web3Provider(window.ethereum));
        }
    }, []);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                if (!provider) return;
                const signer = provider.getSigner();
                const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
                const balance = await tokenContract.balanceOf(contractAddress);
                const formattedBalance = ethers.utils.formatUnits(balance, 18);

                // Convertir a número entero y formatear con comas
                const integerBalance = Math.floor(parseFloat(formattedBalance));
                setBalance(integerBalance.toLocaleString());
            } catch (error) {
                console.error("Error on loading:", error);
            }
        };

        fetchBalance();
    }, [provider]);

    return (
        <div>
            {balance !== null ? <p>{balance} $EPOP</p> : <p>Loading...</p>}
        </div>
    );
};

export default EpopStakingBalance;
