const test_setInputForCardSize = () => {
  try {
    setInputForCardSize('absolute', 365);
  } catch (err) {
    console.log('❌ fail');
    console.log(err);
  }
  let w = document.getElementById('inputCardSize').value;
  if (w == '365') {
    console.log('✅ pass');
  } else {
    console.log('❌ fail');
    console.log(`size should be 365: ${w}`);
  }

  try {
    setInputForCardSize('relative', -300);
  } catch (err) {
    console.log('❌ fail');
    console.log(err);
  }
  w = document.getElementById('inputCardSize').value;
  if (w == '65') {
    console.log('✅ pass');
  } else {
    console.log('❌ fail');
    console.log(`size should be 65: ${w}`);
  }

  try {
    setInputForCardSize('relative', 100);
  } catch (err) {
    console.log('❌ fail');
    console.log(err);
  }
  w = document.getElementById('inputCardSize').value;
  if (w == '165') {
    console.log('✅ pass');
  } else {
    console.log('❌ fail');
    console.log(`size should be 165: ${w}`);
  }
};

const subtest_grid_abs = () => {
  try {
    setInputsForGrid('absolute', 2, 4);
  } catch (err) {
    console.log(err);
  }
  let r = document.getElementById('inputRow').value;
  let c = document.getElementById('inputCol').value;

  if (r == '4') {
    console.log('✅ pass');
  } else {
    console.log('❌ fail');
    console.log(`rows should be 4: ${r}`);
  }
  if (c == '2') {
    console.log('✅ pass');
  } else {
    console.log('❌ fail');
    console.log(`cols should be 2: ${c}`);
  }
};

const subtest_grid_minus = () => {
  setInputsForGrid('absolute', 2, 4);
  try {
    setInputsForGrid('relative', -2, -1);
  } catch (err) {
    console.log(err);
  }
  c = document.getElementById('inputCol').value;
  r = document.getElementById('inputRow').value;
  if (c == '0') {
    console.log('✅ pass');
  } else {
    console.log('❌ fail');
    console.log(`cols should be 0: ${c}`);
  }
  if (r == '3') {
    console.log('✅ pass');
  } else {
    console.log('❌ fail');
    console.log(`rows should be 3: ${r}`);
  }
};

const subtest_grid_plus = () => {
  setInputsForGrid('absolute', 2, 4);
  try {
    setInputsForGrid('relative', 3, 7);
  } catch (err) {
    console.log('❌ fail');
    console.log(err);
  }
  c = document.getElementById('inputCol').value;
  r = document.getElementById('inputRow').value;
  if (c == '5') {
    console.log('✅ pass');
  } else {
    console.log('❌ fail');
    console.log(`cols should be 5: ${c}`);
  }
  if (r == '11') {
    console.log('✅ pass');
  } else {
    console.log('❌ fail');
    console.log(`rows should be 11: ${r}`);
  }
};

const test_setInputsForGrid = () => {
  subtest_grid_abs();
  subtest_grid_minus();
  subtest_grid_plus();
};
