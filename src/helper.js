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

const CONTRACT_ADDRESS_REGEX = new RegExp(/^[\s]*(0[xX])?([0-9A-Za-z]{40})[\s]*$/); // Do not change groups order w/o adjusting ```trimContractAddress````

const EthereumGasEvalHelper = function EthereumGasEvalHelper() {
	this.checkContractAddressFormat = (contractAddress) => {
		return contractAddress && contractAddress.match(CONTRACT_ADDRESS_REGEX);
	};

	this.trimContractAddress = (contractAddress) => {
		if(this.checkContractAddressFormat(contractAddress)) {
			let addressRegexGroup = contractAddress.match(CONTRACT_ADDRESS_REGEX);
			return "0x" + addressRegexGroup[2];
		} else {
			throw "Invalid contract address format";
		}
	};

	this.checkBlockNumbers = (fromBlock, toBlock) => {
		if(!Number.isInteger(fromBlock) || fromBlock < 0)
			throw "```fromBlock``` must be a number >= 0";

		if((!Number.isInteger(toBlock) && toBlock !== "latest") || toBlock < fromBlock)
			throw "```toBlock``` must be a number >= ```fromBlock``` or 'latest'";
	};
};

module.exports = EthereumGasEvalHelper;