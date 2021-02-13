import _keys from 'lodash/keys.js';
import _isEmpty from 'lodash/isEmpty.js';
import _isObject from 'lodash/isObject.js';


export default function deepDiff(oldVals, newVals, delta = Object.create(null)) {
  if (
    !_isObject(newVals)
    || Array.isArray(newVals)
    || newVals instanceof FileList
  ) { // don't iterate values (just accept new)
    if (newVals !== oldVals) {
      return typeof newVals !== 'undefined'
        ? newVals
        : null;
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
      if (!_isEmpty(val)) delta[newKey] = val;
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
