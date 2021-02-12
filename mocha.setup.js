import chai from 'chai';

class File {
	#bits;
	#lastModified = Date.now();
	#name = '';
	#type = '';

	constructor(bits, name, { lastModified, type } = {}) {
		this.#bits = bits;
		this.#name = name;

		if (lastModified) this.#lastModified = lastModified;
		if (type) this.#type = type;
	}

	get lastModified() { return this.#lastModified }
	get name() { return this.#name }
	get size() { return 1 }
	get type() { return this.#type }
}

class FileList extends Array {
	item(idx) { return this[idx] }
}

global.expect = chai.expect;
global.File = File;
global.FileList = FileList;
