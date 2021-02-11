import _reduce from 'lodash/reduce';

import classNames from 'classnames';
import { PureComponent } from 'react';
import {
	func,
} from 'prop-types';

import deepDiff from './deepDiff';

import styles from './Form.module.css';


const fieldTags = {
	FIELDSET: 'fieldset',
	INPUT: 'input',
	SELECT: 'select',
	TEXTAREA: 'textarea',
};

export const composeData = (
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
) => {
	const tag = fieldTags[tagName];

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

export default class Form extends PureComponent {
	static fieldTags = fieldTags;

	initValues = Object.create(null);
	ref = null;

	setRef = (el) => {
		if (!el) return;

		this.ref = el;

		this.initValues = _reduce(
			[...this.ref.elements],
			composeData,
			this.initValues,
		);
	};

	handleSubmit = (event, initValues, cb) => {
		event.preventDefault();

		if (!event.target.reportValidity()) return;

		event.stopPropagation();

		const values = _reduce(
			[...event.target.elements],
			composeData,
			Object.create(null),
		);
		const delta = deepDiff(initValues, values);

		this.initValues = values; // reset starting values for potential subsequent submit

		return cb(event, delta, values);
	};

	render() {
		const {
			handleSubmit,
			initValues,
			props: {
				children,
				className,
				onSubmit,
				...props
			},
			setRef,
		} = this;

		return (
			<form
				{...props}
				className={classNames(styles.Form, className)}
				noValidate
				onSubmit={(e) => handleSubmit(e, initValues, onSubmit)}
				ref={setRef}
			>
				{children}
			</form>
		);
	}
}

Form.propTypes = {
	onSubmit: func.isRequired,
};
