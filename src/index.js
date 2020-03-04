/*
 * The MIT License (MIT)
 * 
 * Copyright © 2020 muth@tu-berlin.de
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

let Web3 = require("web3");

let Helper = require("./helper.js");

const EthereumGasEval = function EthereumGasEval(web3 = null) {
	this.web3 = web3 || new Web3();

	this.helper = new Helper();

	this.setWeb3 = (web3 = null) => {
		this.web3 = web3 || new Web3();
	};

	/*
	 * Sums up all transactions/deployment costs of a given smart contract.
	 * CAUIION: it has to search back from given block number (default: latest block) and may take some time.
	 * CAUTION: does not work with contract which are deployed with the ```CREATE2``` command.`
	 *
	 * Returns Integer or ```null``` if smart contract was not found in given block range
	 */
	this.getContractGasCosts = async (contractAddress, fromBlock = 0, toBlock = "latest") => {
		try { // the helper functions throw an exception when inputs are invalid
			contractAddress = this.helper.trimContractAddress(contractAddress);

			this.helper.checkBlockNumbers(fromBlock, toBlock);
		} catch(e) {
			throw "Invalid arguments: " + e;
		}

		const toBlockNum = Number.isInteger(toBlock) ? toBlock : (await this.web3.eth.getBlock(toBlock)).number; // replace 'latest' trough block number

		try {
			// 1. Deployment gas
			const deploymentBlock = await this.getContractDeploymentBlockNum(contractAddress, fromBlock, toBlock);
			const deploymentGas = await this.getContractDeploymentGasCosts(contractAddress, deploymentBlock, deploymentBlock); // Note that deploymentBlock was reused => faster

			if(toBlockNum < deploymentBlock)
				throw "toBlockNum is less than the smart contract's deployment block";

			// 2. Transactions (to the smart contract) gas
			let txsGas = 0;

			for(let blockNum = deploymentBlock; blockNum <= toBlockNum; blockNum++) { // starts looking for TXs from the block in which the smart contract was deployed
				const block = await this.web3.eth.getBlock(blockNum, true); // 2nd arg ```true``` => query all TXs
				const txs = block.transactions;

				for(let txNum = 0; txNum < txs.length; txNum++) {
					const tx = txs[txNum];

					if(tx.to && tx.to.toLowerCase() === contractAddress.toLowerCase()) {
						// At this point we only see the TX, like it was sent, but we don't know how much gas was used, so we need the TX receipt
						const txReceipt = await this.web3.eth.getTransactionReceipt(tx.hash);

						txsGas += txReceipt.gasUsed;
					}
				}
			}

			// 3. Sum deployment + TXs gas
			return deploymentGas + txsGas;
		} catch(e) {
			throw e; // Propagate exception up
		}
	};

	/*
	 * Search for the transaction receipt in which a given smart contract is deployed by the smart contract's address.
	 * CAUIION: it has to search back from given block number (default: latest block) and may take some time.
	 * CAUTION: does not work with contract which are deployed with the ```CREATE2``` command.`
	 *
	 * Returns ```0x... address``` (string) or ```null``` if not found in given block range
	 */
	this.getContractDeploymentTransactionReceipt = async (contractAddress, fromBlock = 0, toBlock = "latest") => {
		try { // the helper functions throw an exception when inputs are invalid
			contractAddress = this.helper.trimContractAddress(contractAddress);

			this.helper.checkBlockNumbers(fromBlock, toBlock);
		} catch(e) {
			throw "Invalid arguments: " + e;
		}

		let currentBlock = (await this.web3.eth.getBlock(toBlock)).number;

		for(let blockNum = currentBlock; blockNum >= fromBlock; blockNum--) {
			let block = await this.web3.eth.getBlock(blockNum, true);

			for(let txNum = 0; txNum < block.transactions.length; txNum++) {
				let tx = block.transactions[txNum];

				if(tx.to == null) { // Smart contract creation 
					let receipt = await this.web3.eth.getTransactionReceipt(tx.hash);

					if(receipt.contractAddress.toLowerCase() === contractAddress.toLowerCase()) {
						return receipt;
					}
				}
			}
		}

		return null;
	};

	/*
	 * Search for the block in which a given smart contract is deployed by the smart contract's address.
	 * CAUIION: it has to search back from given block number (default: latest block) and may take some time.
	 * CAUTION: does not work with contract which are deployed with the ```CREATE2``` command.`
	 *
	 * Returns Integer or ```null``` if not found in given block range
	 */
	this.getContractDeploymentBlockNum = async (contractAddress, fromBlock = 0, toBlock = "latest") => {
		try { // the helper functions throw an exception when inputs are invalid
			contractAddress = this.helper.trimContractAddress(contractAddress);

			this.helper.checkBlockNumbers(fromBlock, toBlock);
		} catch(e) {
			throw "Invalid arguments: " + e;
		}

		let deploymentTransactionReceipt = await this.getContractDeploymentTransactionReceipt(contractAddress, fromBlock, toBlock);

		if(deploymentTransactionReceipt && deploymentTransactionReceipt.blockNumber)
			return deploymentTransactionReceipt.blockNumber;
		else
			return null;
	};

	/*
	 * Search for transaction address of a deployed smart contract by its address.
	 * CAUIION: it has to search back from given block number (default: latest block) and may take some time.
	 * CAUTION: does not work with contract which are deployed with the ```CREATE2``` command.`
	 *
	 * Returns ```0x... address``` (string) or ```null``` if not found in given block range
	 */
	this.getContractDeploymentTransactionAddr = async (contractAddress, fromBlock = 0, toBlock = "latest") => {
		try { // the helper functions throw an exception when inputs are invalid
			contractAddress = this.helper.trimContractAddress(contractAddress);

			this.helper.checkBlockNumbers(fromBlock, toBlock);
		} catch(e) {
			throw "Invalid arguments: " + e;
		}

		let deploymentTransactionReceipt = await this.getContractDeploymentTransactionReceipt(contractAddress, fromBlock, toBlock);

		if(deploymentTransactionReceipt && deploymentTransactionReceipt.contractAddress)
			return deploymentTransactionReceipt.contractAddress;
		else
			return null;
	};

	/*
	 * Search for transaction address of a deployed smart contract by its address, and returns the transaction costs (by Gas).
	 * CAUIION: it has to search back from given block number (default: latest block) and may take some time.
	 * CAUTION: does not work with contract which are deployed with the ```CREATE2``` command.`
	 *
	 * Returns Integer or ```null``` if not found in given block range
	 */
	this.getContractDeploymentGasCosts = async (contractAddress, fromBlock = 0, toBlock = "latest") => {
		try { // the helper functions throw an exception when inputs are invalid
			contractAddress = this.helper.trimContractAddress(contractAddress);

			this.helper.checkBlockNumbers(fromBlock, toBlock);
		} catch(e) {
			throw "Invalid arguments: " + e;
		}

		let deploymentTransactionReceipt = await this.getContractDeploymentTransactionReceipt(contractAddress, fromBlock, toBlock);

		if(deploymentTransactionReceipt && deploymentTransactionReceipt.gasUsed)
			return deploymentTransactionReceipt.gasUsed;
		else
			return null;
	};	
};

module.exports = EthereumGasEval;