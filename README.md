# Usage

This package encourages/supports (and enforces a bit) accessibility. It leverages the native [Constraints Validation API](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation), and very rudimentary structural styling via [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout).

State can be controlled or uncontrolled without impacting the validation this package facilitates.

## Styling configuration

General layout structure and basic validation state appearance is handled by this package. There are some css variables that are consumed if available:

css var | purpose
:--- | :---
`--colour-background` | field background colour
`--colour-danger` | borders and text colours when field has invalid input
`--colour-light` | icon-based button background colour
`--colour-medium` | default border colours,
`--colour-muted` | disabled & readonly field's label
`--colour-primary` | submit button
`--colour-success` | success button colour
`--colour-text-deemphasised` | label text and border colour of disabled fields
`--colour-warning` | background colour of a "warning" button
`--default-border-radius` | field corner rounding
`--default-boxshadow` | drop shadow on buttons and fields
`--default-padding` | innder spacing of fields and minimum inner spacing for buttons
`--default-transition` | css transitions applied to changes on buttons and fields
`--grid-gutter` | space between css grid layout cells (labels + fields, fields + fields)

Labels of fields set to required are automatically styled with an "*" in an accessibility-friendly way.

Otherwise, implementer's css modules are consumed via css modules.

## Component consumption

If a field is supplied validation props (`minLength`, `required`, etc), the Form component will automatically trigger its fields ("form controls") to self-validate and display relevant errors upon submit. Each field supports supplying custom validation messages via the Constraints Validation API—when no custom message(s) are supplied, it uses the browser's defaults. A Form submitted with invalid fields will abort the submission (the supplied `onSubmit` callback will not be called).

Any props not specific to this package are passed to the relative element.

```jsx
import Form, {
	Button,
	FileInput,
	Input,
} from 'react-html5-form';

import AddressService from '../AddressService.js';
import ClientsService from '../ClientsService.js';

import yourCustomStyles from './something.module.css';


const validateAddress = (event) => {
	const { target } = target;
	const isInvalid = AddressService.validate(target.value);
	let msg = 'Address is not recognised';

	if (isInvalid) {
		if (typeof msg === 'boolean') msg = isInvalid;

		target.setCustomValidity(msg);
		target.reportValidity(); // required because reasons
	}
};

const validateDomain = (event) => {
	const { target } = target;
	const isInvalid = ClientsService.validate(target.value);
	let msg = 'Email address is not allowed';
	
	if (isInvalid) {
		if (typeof msg === 'boolean') msg = isInvalid;

		target.setCustomValidity(msg);
		target.reportValidity(); // required because reasons
	}
};

const sendToCloud = (
	event,
	delta,
	{
		forename,
		surname,
		contactDetails: {
			email,
			tel,
		},
		newsletterOptIn,
	},
) => {
	return fetch(…);
};

const SFC = (props) => (
	<Form
		className={yourCustomStyles.SignupForm}
		name="signup"
		onSubmit={sendToCloud}
	>
		<Input
			name="forename"
			minLength={2}
			placeholder="Jane"
			required
			type="text"
		/>
		<Input
			name="surname"
			minLength={2}
			placeholder="Smith"
			required
			type="text"
		/>
		<fieldset name="contactDetails">
			<Input
				name="email"
				onBlur={validateDomain}
				placeholder="jane@example.com"
				type="email"
			/>
			<Input
				as="textarea"
				name="mailingAddress"
				onChange={validateAddress}
			/>
			<Input
				name="tel"
				placeholder="5555555555"
				type="tel"
			/>
		</fieldset>
		<Input
			name="newsletterOptIn"
			type="checkbox"
			variant={Input.VARIANTS.TOGGLE}
		/>
		<Button
			appearance={Button.APPEARANCES.BASIC}
			type="submit"
		/>
	</Form>
)
```

### Form

This component facilitates validation and provides a data model object for uncontrolled fields. Fields wrapped in a name `fieldset` result in a nested object.

It also provides a `delta` of data changes, useful for `PATCH`ing existing field(s) changed by the user: the delta object contains only properties whose values are different from their initial. Ex an existing user changes their forename: `delta = { forename: 'Jakob' }`

### Form controls

#### Button

The most important difference here is the `type` prop defaults to `button` instead of `submit` because forgetting to override "submit" has confusing, adverse behaviour.

Button supports the following configuration via props:

prop | purpose | default
:--- | :--- | :---
appearance | alter the aesthetics of the element | `primary`
fluid | whether the button should act like a liquid: fill its container | `false`
variant | the kind of appearance the button takes on (classic CTA, icon, etc) | `cta`

#### FileInput

A file picker for uploading from disk. The main difference between this component and this package's `<Input>` component is that it generates a preview for image-type files or lists filenames of selected files (when a preview cannot be generated).

#### Input

This component is a thin wrapper for native `label` and form fields (`input`, `select`, `textarea`) that helps to ensure accessibility and facilitate validation.

It also offers a small easter-egg: a toggler, which is effectively a checkbox with fancy styling.

prop | purpose | default
:--- | :--- | :---
arrangement | the fields position relative to its field | `inline`
as | the element or react component to use | `input`
variant | display a checkbox as a toggle | `null`