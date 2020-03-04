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
 
const voting = {
	json: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"voter","type":"address"}],"name":"assignVoting","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"eligible","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"stop","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"option","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"voted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"votings","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
	data: '0x608060405234801561001057600080fd5b5033600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061059d806100616000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c80630121b93f146100675780630713b1391461009557806307da68f5146100f1578063a598d03c146100fb578063aec2ccae1461013d578063f030178914610199575b600080fd5b6100936004803603602081101561007d57600080fd5b81019080803590602001909291905050506101dd565b005b6100d7600480360360208110156100ab57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061030d565b604051808215151515815260200191505060405180910390f35b6100f961032d565b005b6101276004803603602081101561011157600080fd5b81019080803590602001909291905050506103c2565b6040518082815260200191505060405180910390f35b61017f6004803603602081101561015357600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506103da565b604051808215151515815260200191505060405180910390f35b6101db600480360360208110156101af57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506103fa565b005b600115156000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151461023957600080fd5b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555060018060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600260008281526020019081526020016000206000815480929190600101919050555050565b60006020528060005260406000206000915054906101000a900460ff1681565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461038757600080fd5b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b60026020528060005260406000206000915090505481565b60016020528060005260406000206000915054906101000a900460ff1681565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461045457600080fd5b600015156000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515146104b057600080fd5b60001515600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151461050d57600080fd5b60016000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055505056fea26469706673582212202edc7aeaddf297205082247e4d90bbb97bc673f1339d4fab8ae82ac94776bd9e64736f6c63430006010033', 
};

module.exports = voting;

/*

pragma solidity >=0.6.0 <0.7.0;

contract Voting {
    mapping(address => bool) public eligible; 
    mapping(address => bool) public voted; 
    
    mapping(uint256 => uint256) public votings;
    
    address payable owner;
    
    constructor() public {
        owner = msg.sender;
    }
    
    function assignVoting(address voter) public {
        require(msg.sender == owner);
        require(eligible[voter] == false);
        require(voted[voter] == false);
        
        eligible[voter] = true;
    }
    
    function vote(uint256 option) public {
        require(eligible[msg.sender] == true);
        
        eligible[msg.sender] = false;
        voted[msg.sender] = true;
        
        votings[option]++;
    }
    
    function stop() public {
        require(msg.sender == owner);
        
        selfdestruct(owner);
    }
}

*/