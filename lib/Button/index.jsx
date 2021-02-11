import classnames from 'classnames';
import {
	bool,
	oneOf,
} from 'prop-types';

import styles from './Button.module.css';


const Button = ({
	children: label,
	className,
	fluid,
	icon: Icon,
	...others
}) => (
	<button
		{...others}
		className={classnames(
			styles.Button,
			className,
			{
				[styles.fluid]: fluid,
			},
		)}
	>
		{!!icon
			? (<Icon />)
			: label
		}
	</button>
);
Button.APPEARANCES = {
	AFFIRMING: 'affirming',
	BASIC: 'basic',
	DANGER: 'danger',
	PRIMARY: 'primary',
	WARNING: 'warning',
};
Button.ICONS = Icon.ICONS;
Button.TYPES = {
	BUTTON: 'button',
	SUBMIT: 'submit',
};
Button.VARIANTS = {
	CTA: 'cta',
	GLYPH: 'glyph',
};
Button.defaultProps = {
	appearance: Button.APPEARANCES.PRIMARY,
	fluid: false,
	type: Button.TYPES.BUTTON,
	variant: Button.VARIANTS.CTA,
};
Button.propTypes = {
	appearance: oneOf(Object.values(Button.APPEARANCES)),
	fluid: bool,
	type: oneOf(Object.values(Button.TYPES)),
	variant: oneOf(Object.values(Button.VARIANTS)),
};

Button.Group = ({ className, ...props }) => (
	<Group className={classnames(className, styles.ButtonGroup)} {...props} />
);

export default Button;
