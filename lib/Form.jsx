import _reduce from 'lodash/reduce';

import classNames from 'classnames';
import { PureComponent } from 'react';
import {
	func,
} from 'prop-types';

import composeData, {
	FIELD_TAGS,
} from './composeData';
import deepDiff from './deepDiff';

import styles from './Form.module.css';


export default class Form extends PureComponent {
	static FIELD_TAGS = FIELD_TAGS;

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
