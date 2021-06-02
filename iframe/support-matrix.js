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
  for (const requirement of keysRequirementDict) {
    const cell = document.createElement('td');
    cell.className = requirement;
    tr.appendChild(cell);
  }
  return tr;
}

for (const level of robustnessLevels) {
  const row = generateRow(level);
  matrixBody.appendChild(row);
  for (const requirement of keysRequirementDict) {
    navigator.requestMediaKeySystemAccess('com.widevine.alpha', [{
      initDataTypes: ['cenc'],
      distinctiveIdentifier: requirement,
      videoCapabilities: [{
        contentType: 'video/mp4;codecs="avc1.42E01E"',
        robustness: level,
      }]
    }]).then(() => {
      console.log('Success for ', {level, requirement});
      row.getElementsByClassName(requirement)[0].innerText = 'success';
    }).catch((e) => {
      console.log('Failure for ', {level, requirement});
      const cell = row.getElementsByClassName(requirement)[0];
      cell.innerText = 'failure';
      cell.setAttribute('title', e.message)
    });
  }
}
