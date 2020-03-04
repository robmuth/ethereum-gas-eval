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

describe("init", () => {
	events.EventEmitter.defaultMaxListeners = 15; // Web3 sometimes adds a lot of listeners, e.g., while sending a TX

	it("should make ethereum-gas-eval instance w/o provider", () => {
		try {
			const instance = new EthereumGasEval();

			assert.ok(instance);
		} catch (e) {
			assert.fail(e);
		}
	});

	it("should connect via Web3 to Ganache", async () => {
		const instance = new EthereumGasEval();

		let provider;
		try {
			 provider = ganache.provider();
		} catch(e) {
			assert.fail("Could not init Ganache provider");
			console.error(e);
		}

		let web3Ganache;
		try {
			web3Ganache = new Web3(provider);
		} catch(e) {
			assert.fail("Could not init Web3");
			console.error(e);
		}

		instance.setWeb3(web3Ganache);

		assert.ok(await web3Ganache.eth.net.isListening(), "Web3 is not connected to Ganache");

		const ganacheAccounts = await web3Ganache.eth.getAccounts();
		assert(ganacheAccounts.length > 0, "No Ganache accounts available via Web3");
	});

	let web3;
	let votingContractAddress = null;

	it("should deploy example voting contract", async () => {
		web3 = new Web3(ganache.provider());
		const votingContract = new web3.eth.Contract(VotingContract.json);

		const ganacheAccounts = await web3.eth.getAccounts();

		let deployableContract = await votingContract.deploy({
			data: VotingContract.data
		});
		
		let deployedContract = await deployableContract.send({
			from: ganacheAccounts[0],
			gas: 1500000,
		})

		votingContractAddress = deployedContract.options.address;
	});

	it("should make another account eligible to vote", async () => {
		const votingContract = new web3.eth.Contract(VotingContract.json, votingContractAddress);

		const ganacheAccounts = await web3.eth.getAccounts();

		await votingContract.methods.assignVoting(ganacheAccounts[1]).send({ 
			from: ganacheAccounts[0],
			gas: 1500000,
		});

		let canVote = await votingContract.methods.eligible(ganacheAccounts[1]).call();
		assert(canVote, "Voter should be eligible to vote");

		let cantVote = await votingContract.methods.eligible(ganacheAccounts[2]).call();
		assert(cantVote === false, "Voter should not be eligible to vote");
	});

	it("should vote", async () => {
		const votingContract = new web3.eth.Contract(VotingContract.json, votingContractAddress);

		const ganacheAccounts = await web3.eth.getAccounts();

		assert(await votingContract.methods.votings(1).call() == 0, "Votes for option 1 should be 0 at the beginning");

		await votingContract.methods.vote(1).send({ 
			from: ganacheAccounts[1],
			gas: 1500000,
		});

		assert(await votingContract.methods.votings(1).call() == 1, "Votes for option 1 should be 1 after voting");

		let asyncException = true;
		try {
			await votingContract.methods.vote(1).send({ 
				from: ganacheAccounts[1],
				gas: 1500000,
			});

			asyncException = false;
		} catch(e) {
			// NOP (revert expected, it's just fine)
		}

		assert(asyncException, "send should have thrown an exception.");

		assert(await votingContract.methods.votings(1).call() == 1, "Votes for option 1 should remain 1 after voting again");
	});
});
