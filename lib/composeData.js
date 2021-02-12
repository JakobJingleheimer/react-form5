import _reduce from 'lodash/reduce.js';


export const FIELD_TAGS = {
	FIELDSET: 'fieldset',
	INPUT: 'input',
	SELECT: 'select',
	TEXTAREA: 'textarea',
};

export default function composeData(
	values,
	{
		checked,
		dataTransfer,
		elements,
		files,
		name,
		tagName,
		type,
		value,
		...attrs
	},
	i,
	form,
) {
	const tag = FIELD_TAGS[tagName];

	if (tag && name) { // ignore anon fieldset
		if (tag === 'fieldset') {
			const nestedFieldCount = elements.length;
			const nestedFields = form.splice( // move from master list (avoid double-counting)
				i + 1,
				nestedFieldCount,
				...Array(nestedFieldCount).fill({ tagName: 'NESTED_FIELD' })
			);
			values[name] = _reduce(
				nestedFields,
				composeData,
				Object.create(null),
			);
		} else if (tag === 'select' && attrs.multiple) {
			values[name] = attrs.selectedOptions.map(({ value }) => value);
		} else if (type === 'file') {
			values[name] = files || dataTransfer;
		} else if (type === 'checkbox') {
			values[name] = checked;
		} else if (type === 'number') {
			///
		} else if (type === 'radio') {
			if (checked) values[name] = value;
			else values[name] ??= null;
		}
		else values[name] ??= value || null;
	}

	return values;
};
