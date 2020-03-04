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

const Web3 = require("web3");
const ganache = require("ganache-cli");
const assert = require("assert");
const events = require("events");

const EthereumGasEval = require("../src");
const VotingContract = require("./contracts/voting.js");

describe("eval", () => {
	events.EventEmitter.defaultMaxListeners = 15; // Web3 sometimes adds a lot of listeners, e.g., while sending a TX

	it("should find the block number to a given smart contract address", async () => {
		const web3Local = new Web3(ganache.provider());
		const gasEval = new EthereumGasEval(web3Local);
		
		const votingContract = new web3Local.eth.Contract(VotingContract.json);

		const ganacheAccounts = await web3Local.eth.getAccounts();

		let deployableContract = await votingContract.deploy({
			data: VotingContract.data
		});
		
		let deployedContract = await deployableContract.send({
			from: ganacheAccounts[0],
			gas: 1500000,
		});

		let votingContractAddress = deployedContract.options.address;

		deployedContract = new web3Local.eth.Contract(VotingContract.json, votingContractAddress);
		
		let foundBlockNum = await gasEval.getContractDeploymentBlockNum(votingContractAddress);
		assert.equal(foundBlockNum, 1, "Did not find correct block to contract address");

		// Execute some more transactions 
		for(let i = 0; i < 5; i++) {
			await deployedContract.methods.assignVoting(ganacheAccounts[i + 1]).send({
				from: ganacheAccounts[0],
				gas: 1500000,
			});
		}

		assert((await web3Local.eth.getBlock("latest")).number > 5, "Did not submit extra transactions");

		foundBlockNum = await gasEval.getContractDeploymentBlockNum(votingContractAddress);
		assert.equal(foundBlockNum, 1, "Did not find correct block to contract address after additional transactions");

		// Search again
		foundBlockNum = await gasEval.getContractDeploymentBlockNum(votingContractAddress);
		assert.equal(foundBlockNum, 1, "Did not find correct block to contract address");

		// Fails because of wrong block range
		assert.equal(await gasEval.getContractDeploymentBlockNum(votingContractAddress, 3), null, "Should fail because of wrong block range");
	});

	it("should find the transaction address of the deployment for a given smart contract address", async () => {
		const web3Local = new Web3(ganache.provider());
		const gasEval = new EthereumGasEval(web3Local);
		
		const votingContract = new web3Local.eth.Contract(VotingContract.json);

		const ganacheAccounts = await web3Local.eth.getAccounts();

		let deployableContract = await votingContract.deploy({
			data: VotingContract.data
		});
		
		let deployedContract = await deployableContract.send({
			from: ganacheAccounts[0],
			gas: 1500000,
		});

		let votingContractAddress = deployedContract.options.address;

		deployedContract = new web3Local.eth.Contract(VotingContract.json, votingContractAddress);
		
		let foundTransactionAddress = await gasEval.getContractDeploymentTransactionAddr(votingContractAddress);
		assert(foundTransactionAddress.match(/^0x[A-Za-z0-9]{40}$/), "Did not find correct transaction to contract address");

		// Execute some more transactions 
		for(let i = 0; i < 5; i++) {
			await deployedContract.methods.assignVoting(ganacheAccounts[i + 1]).send({
				from: ganacheAccounts[0],
				gas: 1500000,
			});
		}

		assert((await web3Local.eth.getBlock("latest")).number > 5, "Did not submit extra transactions");

		foundTransactionAddress = await gasEval.getContractDeploymentTransactionAddr(votingContractAddress);
		assert(foundTransactionAddress.match(/^0x[A-Za-z0-9]{40}$/), "Did not find correct transaction to contract address after additional transactions");

		// Search again
		foundTransactionAddress = await gasEval.getContractDeploymentTransactionAddr(votingContractAddress);
		assert(foundTransactionAddress.match(/^0x[A-Za-z0-9]{40}$/), "Did not find correct transaction to contract address");

		// Fails because of wrong block range
		assert.equal(await gasEval.getContractDeploymentTransactionAddr(votingContractAddress, 3), null, "Should fail because of wrong block range");
	});
});
