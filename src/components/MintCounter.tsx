import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface MintCounterProps {
  contractAddress: string;
}

const MintCounter: React.FC<MintCounterProps> = ({ contractAddress }) => {
  const [mintCount, setMintCount] = useState<number | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchMintCount = async () => {
      try {
        // Conectar a la red Polygon (Matic)
        const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com');

        // ABI del contrato inteligente
        const abi = [
          {
            "inputs": [],
            "name": "totalMinted",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ];

        // Crea una instancia del contrato inteligente
        const contract = new ethers.Contract(contractAddress, abi, provider);

        // Obtiene el total de mintings del contrato inteligente
        const count = await fetchMintCountFromContract(contract);
        setMintCount(count);
      } catch (error) {
        console.error('Error fetching mint count:', error);
      }
    };

    // Inicia la primera llamada de inmediato
    fetchMintCount();

    // Configura el intervalo para actualizar cada 5 segundos
    intervalId = setInterval(fetchMintCount, 5000);

    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, [contractAddress]);

  // Función para obtener el total de mintings del contrato inteligente
  const fetchMintCountFromContract = async (contract: ethers.Contract): Promise<number> => {
    try {
      // Llama a la función totalMinted del contrato
      const count = await contract.totalMinted();
      return count.toNumber();
    } catch (error) {
      console.error('Error fetching mint count from contract:', error);
      return 0;
    }
  };

  return (
    <div>
      <p>{mintCount !== null ? mintCount.toString() : 'Loading...'}/5000</p>
    </div>
  );
};

export default MintCounter;