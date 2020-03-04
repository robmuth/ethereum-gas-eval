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
const assert = require("assert");

const Helper = require("../src/helper.js")

describe("helper", () => {
	const helper = new Helper();

	it("should accept valid contract addresses", () => {
		assert(helper.checkContractAddressFormat("0x0123456789ABCDEF0000abcdef00000000000000"));
		assert(helper.checkContractAddressFormat("0123456789ABCDEF0000abcdef00000000000000"));

		assert(helper.checkContractAddressFormat("    0x0123456789ABCDEF0000abcdef00000000000000"), "Spaces at the beginning should be ok");
		assert(helper.checkContractAddressFormat("    0123456789ABCDEF0000abcdef00000000000000"), "Spaces at the beginning should be ok");

		assert(helper.checkContractAddressFormat("    0x0123456789ABCDEF0000abcdef00000000000000   "), "Spaces at the beginning and ending should be ok");
		assert(helper.checkContractAddressFormat("    0123456789ABCDEF0000abcdef00000000000000   "), "Spaces at the beginning and ending should be ok");

		assert(helper.checkContractAddressFormat(" 	  0x0123456789ABCDEF0000abcdef00000000000000	    "), "Tabs and spaces at the beginning and ending should be ok");
		assert(helper.checkContractAddressFormat("	0123456789ABCDEF0000abcdef00000000000000	    "), "Tabs and spaces at the beginning and ending should be ok");

		assert(helper.checkContractAddressFormat(" 	  0X0123456789ABCDEF0000abcdef00000000000000	    "), "Uppercase X should be ok");
	});

	it("should trim contract address w/ 0x prefix", () => {
		assert.equal(helper.trimContractAddress(" 	  0123456789ABCDEF0000abcdef00000000000000	    "), "0x0123456789ABCDEF0000abcdef00000000000000", "Did not remove trailing white spaces or did not add 0x prefix");
		assert.equal(helper.trimContractAddress(" 	  0x0123456789ABCDEF0000abcdef00000000000000	    "), "0x0123456789ABCDEF0000abcdef00000000000000", "Pre 0x shoudl be ok");
		assert.equal(helper.trimContractAddress(" 	  0X0123456789ABCDEF0000abcdef00000000000000	    "), "0x0123456789ABCDEF0000abcdef00000000000000", "Uppercase X should be replaced to lowercase 0x");
	});

	it("should accept valid block numbers", () => {
		try {
			helper.checkBlockNumbers(0, 123);
		} catch(e) {
			assert(false, "fromBlock = 0, toBlock = 123 should be ok, but: " + e);
		}
	});

	it("should reject invalid block numbers (by format)", () => {
		assert.throws(() => helper.checkBlockNumbers(0, "test"), "fromBlock = 0, toBlock = 'test' should be rejected");
		assert.throws(() => helper.checkBlockNumbers("test", 123), "fromBlock = 'test, toBlock = 123 should be rejected");
		assert.throws(() => helper.checkBlockNumbers("test", "test"), "fromBlock = 'test, toBlock = 'test' should be rejected");
		assert.throws(() => helper.checkBlockNumbers(0), "fromBlock = 0, toBlock = undefined should be rejected");	
	});

	it("should reject invalid block numbers when toBlock < fromBlock", () => {
		try {
			helper.checkBlockNumbers(0, 123);
		} catch(e) {
			assert(false, "fromBlock = 0, toBlock = 123 should be ok, but: " + e);
		}

		assert.throws(() => helper.checkBlockNumbers(1000, 123), "fromBlock = 1000 toBlock = 123 should be rejected");

		try {
			helper.checkBlockNumbers(123, 123);
		} catch(e) {
			assert(false, "fromBlock = 123 toBlock = 123 should be ok, but: " + e);
		}

		try {
			helper.checkBlockNumbers(0, 0);
		} catch(e) {
			assert(false, "fromBlock = 0 toBlock = 0 should be ok, but: " + e);
		}
	});
})