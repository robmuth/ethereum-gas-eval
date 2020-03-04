Ethereum Gas Eval
===================

This package takes an address of a deployed smart contract, queries all transactions since its deployment, and sums up all gas costs.
It uses [web3.js](https://github.com/ethereum/web3.js) for accessing the blockchain which leads to some performance issues. 
Unfortunately, it's not possible to just get the transaction which deployed the contract by a standard command, so Web3 has to check all blocks for the deployment.
The same problem with finding transactions to the smart contract.

## Functions
- ```getContractGasCosts = async (contractAddress, fromBlock = 0, toBlock = "latest")```

  Queries the smart contracts deployment transaction and all transactions which call the smart contract.
  All (used) gas costs of these transaction will be summed up.
  It returns ```null``` if the smart contract could not be found or throws an exception.

- ```EthereumGasEval.getContractDeploymentBlockNum = async (contractAddress, fromBlock = 0, toBlock = "latest")```
  
  Queries the block number in which a smart contract was deployed by the contracts address.
  It returns ```null``` if the corresponding block could not be found or throws an exception.

- ```EthereumGasEval.getContractDeploymentTransactionAddr = async (contractAddress, fromBlock = 0, toBlock = "latest")```
  
  Queries the transaction address in which a smart contract was deployed by the contracts address.
  It returns ```null``` if the corresponding transaction could not be found or throws an exception.

## Example: Query the gas costs of the deployment of a smart contract and alls transactions to it by the smart contracts address 

```
const Web3 = require("web3);
const EthereumGasEval = require("ethereum-gas-eval");


const ethereumGasEval = new EthereumGasEval(new Web3("ws://127.0.0.1:8545"));
let deploymentAndTXsGas = ethereumGasEval.getContractGasCosts("0x012345679012345679012345679012345679");

console.log(deploymentAndTXsGas + " wei");
```

## Example: Query the gas costs of the deployment of a smart contract by the smart contracts address 

```
const Web3 = require("web3);
const EthereumGasEval = require("ethereum-gas-eval");


const ethereumGasEval = new EthereumGasEval(new Web3("ws://127.0.0.1:8545"));
let deploymentGas = ethereumGasEval.getContractDeploymentGasCosts("0x012345679012345679012345679012345679");

console.log(deploymentGas + " wei");
```

## Example: Query the transaction address of the deployment of a given smart contract by the smart contracts address

```
const Web3 = require("web3);
const EthereumGasEval = require("ethereum-gas-eval");


const ethereumGasEval = new EthereumGasEval(new Web3("ws://127.0.0.1:8545"));
let txAddr = ethereumGasEval.getContractDeploymentTransactionAddr("0x012345679012345679012345679012345679");

console.log(txAddr);
```


## License
[The MIT License (MIT)](./LICENSE)