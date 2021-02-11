import classnames from 'classnames';
import _map from 'lodash/map.js';
import {
	elementType,
	oneOf,
	string,
} from 'prop-types';
import { useState } from 'react';

import styles from './Input.module.css';


const Input = ({
	arrangement,
	as: Field,
	className,
	fluid,
	id,
	inline,
	label,
	name,
	onBlur,
	onChange,
	options,
	type,
	value,
	...others
}) => {
	const [error, setError] = useState('');
	const [pristine, setPristine] = useState(true);
	const [touched, setTouched] = useState(false);

	if (options) others.list = `${name}_options`;

	others.onBlur = (e) => {
		setTouched(true);
		if (e.target.checkValidity()) setError('');
		onBlur(e);
	};

	others.onChange = (e) => {
		setPristine(false);
		setTouched(true);

		if (e.target.checkValidity()) setError('');

		onChange(e);
	}

	return (
		<div
			arrangement={arrangement}
			className={classnames(
				styles.InputField,
				{
					[styles.inline]: inline,
					[styles.fluid]: fluid,
				}
			)}
		>
			<Field
				className={classnames(styles.Input, {
					[styles.fluid]: fluid,
				})}
				name={name}
				id={id || name}
				onInvalid={(e) => {
					// e.preventDefault();
					e.nativeEvent.stopImmediatePropagation();
					setError(e.target.validationMessage);
					setTouched(true);
				}}
				pristine={pristine ? 'true' : null}
				touched={touched ? 'true' : null}
				type={type}
				value={value}
				{...others}
			/>
			{!!label && (<label
				className={styles.Label}
				htmlFor={name}
			>{label}</label>)}
			{!!error && (
				<p className={styles.Error}>{error}</p>
			)}
			{!!options?.size && (
				<datalist id={others.list}>{_map(options, ({ name }, key) => (
					<option key={key} value={key}>{name}</option>
				))}</datalist>
			)}
		</div>
	);
};
Input.ARRANGEMENTS = {
	INLINE: 'inline',
	STACKED: 'stacked',
	STAND_ALONE: 'stand-alone',
};
Input.VARIANTS = {
	TOGGLE: 'toggle',
};
Input.defaultProps = {
	arrangement: Input.ARRANGEMENTS.INLINE,
	as: 'input',
	onBlur() {},
	onChange() {},
	type: 'text',
};
Input.propTypes = {
	arrangement: oneOf(Object.values(Input.ARRANGEMENTS)),
	as: elementType,
	label: string,
	name: string.isRequired,
	variant: oneOf(Object.values(Input.VARIANTS)),
};

export default Input;
