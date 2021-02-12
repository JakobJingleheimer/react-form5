import composeData from './composeData.js';


const imgFile1 = new File(
	[''],
	'me.jpg',
	{ type: 'image/jpeg' },
);
const imgFile2 = new File(
	[''],
	'me2.jpg',
	{ type: 'image/jpeg' },
);
let fieldForename;
let fieldSurname;
let fieldEmail;
let fieldTel;
let fieldNewsletterOptin;
let fieldsetContact;
let fieldsetNames;
let buttonSubmit;
let mockFormElms1;

describe('composeData()', () => {
	beforeEach(() => {
		fieldForename = {
			name: 'forename',
			placeholder: 'Jane',
			tagName: 'INPUT',
			type: 'text',
			value: 'Jakob',
		};
		fieldSurname = {
			name: 'surname',
			placeholder: 'Smith',
			tagName: 'INPUT',
			type: 'text',
			value: 'jingleheimer',
		};
		fieldEmail = {
			name: 'email',
			placeholder: 'hello@example.com',
			tagName: 'INPUT',
			type: 'email',
			value: 'jakob.jingleheimer@test.dev',
		};
		fieldTel = {
			name: 'tel',
			placeholder: '5555555555',
			tagName: 'INPUT',
			type: 'tel',
			value: '4165555555',
		};
		fieldNewsletterOptin = {
			checked: true,
			name: 'newsletterOptin',
			tagName: 'INPUT',
			type: 'checkbox',
			value: true,
		};
		fieldsetContact = {
			elements: [
				fieldEmail,
				fieldTel,
			],
			name: 'contactDetails',
			tagName: 'FIELDSET',
		};
		fieldsetNames = {
			elements: [
				fieldForename,
				fieldSurname,
			],
			name: 'names',
			tagName: 'FIELDSET',
		};
		buttonSubmit = {
			tagName: 'BUTTON',
			type: 'submit',
		};
	});

	describe('fieldset', () => {
		beforeEach(() => {
			mockFormElms1 = [
				fieldsetNames,
				fieldForename,
				fieldSurname,
				fieldsetContact,
				fieldEmail,
				fieldTel,
				fieldNewsletterOptin,
				buttonSubmit,
			];
		});

		describe('when named', () => {
			it('should return a nested data object of name-value pairs', () => {
				const vals = mockFormElms1.reduce(composeData, {});

				expect(vals).to.eql({
					names: {
						forename: 'Jakob',
						surname: 'jingleheimer',
					},
					contactDetails: {
						email: 'jakob.jingleheimer@test.dev',
						tel: '4165555555',
					},
					newsletterOptin: true,
				});
			});
		});
		describe('when unnamed', () => {
			it('should ignore the anonymous wrapper', () => {
				delete fieldsetContact.name;
				delete fieldsetNames.name;

				const vals = mockFormElms1.reduce(composeData, {});

				expect(vals).to.eql({
					forename: 'Jakob',
					surname: 'jingleheimer',
					email: 'jakob.jingleheimer@test.dev',
					tel: '4165555555',
					newsletterOptin: true,
				});
			});
		});
	});

	describe('input: checkbox', () => {
		it('should set `true` when checked', () => {
			fieldNewsletterOptin.checked = true;

			const vals = [
				fieldNewsletterOptin,
			].reduce(composeData, {});

			expect(vals).to.eql({
				[fieldNewsletterOptin.name]: fieldNewsletterOptin.checked,
			});
		});

		it('should set `false` when not checked', () => {
			fieldNewsletterOptin.checked = false;

			const vals = [
				fieldNewsletterOptin,
			].reduce(composeData, {});

			expect(vals).to.eql({
				[fieldNewsletterOptin.name]: fieldNewsletterOptin.checked,
			});
		});
	});

	describe('input: file', () => {
		let fieldUpload;

		beforeEach(() => {
			fieldUpload = {
				multiple: false,
				name: 'upload',
				tagName: 'INPUT',
				type: 'file',
			};
		});

		describe('dragged', () => {
			it('should include a list of 1 when not multiple', () => {
				fieldUpload.dataTransfer = [
					imgFile1,
				];

				const vals = [
					fieldUpload,
				].reduce(composeData, {});

				expect(vals).to.eql({
					[fieldUpload.name]: fieldUpload.dataTransfer,
				});
			});

			it('should include a list of all when multiple', () => {
				fieldUpload.dataTransfer = [
					imgFile1,
					imgFile2,
				];

				const vals = [
					fieldUpload,
				].reduce(composeData, {});

				expect(vals).to.eql({
					upload: fieldUpload.dataTransfer,
				});
			});
		});

		describe('selected', () => {
			it('should include a list of 1 when not multiple', () => {
				fieldUpload.files = [
					imgFile1,
				];

				const vals = [
					fieldUpload,
				].reduce(composeData, {});

				expect(vals).to.eql({
					[fieldUpload.name]: fieldUpload.files,
				});
			});

			it('should include a list of all when multiple', () => {
				fieldUpload.files = [
					imgFile1,
					imgFile2,
				];

				const vals = [
					fieldUpload,
				].reduce(composeData, {});

				expect(vals).to.eql({
					[fieldUpload.name]: fieldUpload.files,
				});
			});
		});
	});

	describe('input: radio', () => {
		const name = 'gender';
		let fieldGenderM;
		let fieldGenderF;
		let fieldGenderN;

		beforeEach(() => {
			fieldGenderM = {
				name,
				tagName: 'INPUT',
				type: 'radio',
				value: 'M',
			};
			fieldGenderF = {
				name,
				tagName: 'INPUT',
				type: 'radio',
				value: 'F',
			};
			fieldGenderN = {
				name,
				tagName: 'INPUT',
				type: 'radio',
				value: 'N',
			};
		});

		it('should set `null` when no option is selected', () => {
			const vals = [
				fieldGenderF,
				fieldGenderM,
				fieldGenderN,
			].reduce(composeData, {});

			expect(vals).to.eql({
				[name]: null,
			});
		});

		it('should set the value of the selected option', () => {
			fieldGenderM.checked = true;

			const vals = [
				fieldGenderF,
				fieldGenderM,
				fieldGenderN,
			].reduce(composeData, {});

			expect(vals).to.eql({
				gender: fieldGenderM.value,
			});
		});
	});

	describe('select', () => {
		let optContactMethodEm;
		let optContactMethodPh;
		let optContactMethodTx;

		beforeEach(() => {
			optContactMethodEm = {
				tagName: 'OPTION',
				value: 'email',
			};
			optContactMethodTx = {
				tagName: 'OPTION',
				value: 'sms',
			};
			optContactMethodPh = {
				tagName: 'OPTION',
				value: 'phone',
			};
		});

		it('should set `null` when no option is selected', () => {
			const fieldContactMethod = {
				multiple: false,
				name: 'contactMethod',
				options: [
					optContactMethodEm,
					optContactMethodPh,
					optContactMethodTx,
				],
				tagName: 'SELECT',
			};

			const vals = [
				fieldContactMethod,
			].reduce(composeData, {});

			expect(vals).to.eql({
				[fieldContactMethod.name]: null,
			});
		});

		it('should set the value of the selected option when not multiple', () => {
			const fieldContactMethod = {
				multiple: false,
				name: 'contactMethod',
				options: [
					optContactMethodEm,
					optContactMethodPh,
					optContactMethodTx,
				],
				tagName: 'SELECT',
				value: optContactMethodEm.value,
			};

			const vals = [
				fieldContactMethod,
			].reduce(composeData, {});

			expect(vals).to.eql({
				[fieldContactMethod.name]: fieldContactMethod.value,
			});
		});

		it('should set the value of the selected option when not multiple', () => {
			const fieldContactMethod = {
				multiple: true,
				name: 'contactMethod',
				options: [
					optContactMethodEm,
					optContactMethodPh,
					optContactMethodTx,
				],
				selectedOptions: [
					optContactMethodTx,
					optContactMethodEm,
				],
				tagName: 'SELECT',
				value: optContactMethodEm.value,
			};

			const vals = [
				fieldContactMethod,
			].reduce(composeData, {});

			expect(vals).to.eql({
				[fieldContactMethod.name]: [
					optContactMethodTx.value,
					optContactMethodEm.value,
				],
			});
		});
	});

	describe('textarea', () => {
		let fieldFreeRsp;

		beforeEach(() => {
			fieldFreeRsp = {
				name: 'freeResponse',
				tagName: 'TEXTAREA',
				value: '',
			};
		});

		it('should set `null` when no content has been entered', () => {
			const vals = [
				fieldFreeRsp,
			].reduce(composeData, {});

			expect(vals).to.eql({
				[fieldFreeRsp.name]: null,
			})
		});

		it('should set to text entered', () => {
			fieldFreeRsp.value = 'hello world';

			const vals = [
				fieldFreeRsp,
			].reduce(composeData, {});

			expect(vals).to.eql({
				[fieldFreeRsp.name]: fieldFreeRsp.value,
			})
		});
	});
});
