// for each test, need to add a variation of this to the beginning:
// setInputForCardSize('absolute', 80);
// setInputsForGrid('absolute', 3, 3);
// test_setup();
// data = JSON.parse(localStorage.getItem('test_data'));
// storeBinders(data)
// createTags();
// fillBinder(localStorage.getItem('bindername'));
// populateDropdown();

const test_fetchAndFillBinder = () => {
  try {
    setInputForCardSize('absolute', 80);
    setInputsForGrid('absolute', 3, 3);
    test_setup();
    data = JSON.parse(localStorage.getItem('test_data'));
    storeBinders(data);
    createTags();
    fillBinder();
  } catch (err) {
    console.log(err);
    console.log('fail');
    return;
  }
  console.log('pass');
};

const subtest_populateDropdown = () => {
  setInputForCardSize('absolute', 80);
  setInputsForGrid('absolute', 3, 3);
  test_setup();
  data = JSON.parse(localStorage.getItem('test_data'));
  storeBinders(data);
  createTags();
  fillBinder();

  try {
    populateDropdown();
  } catch (err) {
    console.log(err);
  }

  const dropdown = document.getElementById('selectBinder').innerHTML;
  if (dropdown.includes('test_binder')) {
    console.log('pass');
  } else {
    console.log('fail');
    console.log(dropdown);
  }
};

const test_applying_drowndown = () => {
  console.log('failok');
};

const test_populateDropdown = () => {
  subtest_populateDropdown();
  test_applying_drowndown();
};
