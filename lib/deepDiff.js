import _keys from "lodash/keys";
import _isObject from "lodash/isObject";


export default function deepDiff(oldVals, newVals, delta = Object.create(null)) {
  if (
    !_isObject(newVals)
    || newVals instanceof FileList
    || newVals instanceof File
  ) { // is non-iterable
    if (newVals !== oldVals) {
      if (typeof newVals !== 'undefined') return newVals;
      return '';
    }
    return;
  }

  const oldKeys = _keys(oldVals).sort();
  const newKeys = _keys(newVals).sort();

  for (let n = newKeys.length - 1; n > -1; n--) {
    const newKey = newKeys[n];
    const newVal = newVals[newKey];
    const o = oldKeys.indexOf(newKey);
    const oldVal = oldVals[newKey];

    if (typeof oldVal === 'undefined') {
      delta[newKey] = newVal;
    } else {
      const val = deepDiff(oldVal, newVal, delta[newKey]);
      if (typeof val !== 'undefined') delta[newKey] = val;
    }

    oldKeys.splice(o, 1); // remove from list to know below whether to set empty vals
  }

  // if any old keys are left, set them to empty values
  for (let o = oldKeys.length - 1; o > -1; o--) {
    const oldKey = oldKeys[o];
    const oldVal = oldVals[oldKey];

    delta[oldKey] = deepDiff(oldVal);
  }

  return delta;
}
