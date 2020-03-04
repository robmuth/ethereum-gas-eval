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

	this.eval = (contractAddress) => {
		if(!contractAddress || !contractAddress.match(/^(0x)?[0-9A-Za-z]{40}$/))
			throw "Invalid contract address";

		if(contractAddress.startsWith("0x"))
			contract = "0x" + contractAddress;
	};

	/*
	 * Search for the block in which a given smart contract is deployed by the smart contract's address.
	 * CAUIION: it has to search back from given block number (default: latest block) and may take some time.
	 * CAUTION: does not work with contract which are deployed with the ```CREATE2``` command.`
	 *
	 * Returns ```0x... address``` (string) or ```null``` if not found in given block range
	 */
	this.getContractDeploymentBlockNum = async (contractAddress, fromBlock = 0, toBlock = "latest") => {
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

					if(receipt.contractAddress === contractAddress) {
						return blockNum;
					}
				}
			}
		}

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

		let currentBlock = (await this.web3.eth.getBlock(toBlock)).number;

		for(let blockNum = currentBlock; blockNum >= fromBlock; blockNum--) {
			let block = await this.web3.eth.getBlock(blockNum, true);

			for(let txNum = 0; txNum < block.transactions.length; txNum++) {
				let tx = block.transactions[txNum];

				if(tx.to == null) { // Smart contract creation 
					let receipt = await this.web3.eth.getTransactionReceipt(tx.hash);

					if(receipt.contractAddress === contractAddress) {
						return receipt.contractAddress;
					}
				}
			}
		}

		return null;
	};
};

module.exports = EthereumGasEval;