const robustnessLevels = [
  '',
  'SW_SECURE_CRYPTO',
  'SW_SECURE_DECODE',
  'HW_SECURE_CRYPTO',
  'HW_SECURE_DECODE',
  'HW_SECURE_ALL'
];
const keysRequirementDict = ['required', 'optional', 'not-allowed'];
const matrixBody = document.querySelector('#matrixBody');

function generateRow(label) {
  const tr = document.createElement('tr');
  const headCell = document.createElement('td');
  headCell.innerText = label;
  tr.appendChild(headCell);
  for (const distinctiveIdentifier of keysRequirementDict) {
    for (const persistentState of keysRequirementDict) {
      const cell = document.createElement('td');
      cell.className = distinctiveIdentifier+persistentState;
      tr.appendChild(cell);
    }
  }
  return tr;
}

for (const level of robustnessLevels) {
  const row = generateRow(level);
  matrixBody.appendChild(row);
  for (const distinctiveIdentifier of keysRequirementDict) {
    for (const persistentState of keysRequirementDict) {
      const cellClass = distinctiveIdentifier + persistentState;
      const cell = row.getElementsByClassName(cellClass)[0];
      cell.setAttribute('title', JSON.stringify({distinctiveIdentifier, persistentState}));
      navigator.requestMediaKeySystemAccess('com.widevine.alpha', [{
        initDataTypes: ['cenc'],
        distinctiveIdentifier,
        persistentState,
        videoCapabilities: [{
          contentType: 'video/mp4;codecs="avc1.42E01E"',
          robustness: level,
        }]
      }]).then(() => {
        console.log('Success for ', {level, distinctiveIdentifier, persistentState});
        cell.innerText = 'success';
      }).catch((e) => {
        console.log('Failure for ', {level, distinctiveIdentifier, persistentState}, e.message);
        cell.innerText = 'failure';
      });
    }
  }
}
