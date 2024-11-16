const test_setInputForCardSize = () => {
  try {
    setAndStoreCardSize('absolute', 365);
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
    setAndStoreCardSize('relative', -300);
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
    setAndStoreCardSize('relative', 100);
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
    setAndStoreGrid('absolute', 2, 4);
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
  setAndStoreGrid('absolute', 2, 4);
  try {
    setAndStoreGrid('relative', -2, -1);
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
  setAndStoreGrid('absolute', 2, 4);
  try {
    setAndStoreGrid('relative', 3, 7);
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
