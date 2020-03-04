Ethereum Gas Eval
===================

This package takes an address of a deployed smart contract, queries all transactions since its deployment, and sums up all gas costs.
It uses [web3.js](https://github.com/ethereum/web3.js) for accessing the blockchain which leads to some performance issues. 
Unfortunately, it's not possible to just get the transaction which deployed the contract by a standard command, so Web3 has to check all blocks for the deployment.
The same problem with finding transactions to the smart contract.

## Functions
- ```EthereumGasEval.getContractDeploymentBlockNum = async (contractAddress, fromBlock = 0, toBlock = "latest")```
  Queries the block number in which a smart contract was deployed by the contracts address.
  It returns ```null``` if the corresponding block could not be found.

- ```EthereumGasEval.getContractDeploymentTransactionAddr = async (contractAddress, fromBlock = 0, toBlock = "latest")```
  Queries the transaction address in which a smart contract was deployed by the contracts address.
  It returns ```null``` if the corresponding transaction could not be found.


## License
[The MIT License (MIT)](./LICENSE)