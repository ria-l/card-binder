const test_fetchAndFillBinder = () => {
  try {
    setInputForCardSize('absolute', 250);
    setInputsForGrid('absolute', 3, 3);
    test_setup();
    data = JSON.parse(localStorage.getItem('test_data'));
    storeBinders(data);
    fillBinder();
  } catch (err) {
    console.log(err);
    console.log('❌ fail');
    return;
  }
  console.log('✅ pass');
};

const subtest_populateDropdown = () => {
  setInputForCardSize('absolute', 250);
  setInputsForGrid('absolute', 3, 3);
  test_setup();
  data = JSON.parse(localStorage.getItem('test_data'));
  storeBinders(data);
  fillBinder();

  try {
    populateDropdown();
  } catch (err) {
    console.log('❌ fail');
    console.log(err);
  }

  const dropdown = document.getElementById('selectBinder').innerHTML;
  if (dropdown.includes('test_binder')) {
    console.log('✅ pass');
  } else {
    console.log('❌ fail');
    console.log(`dropdown: ${dropdown}`);
  }
};

const test_applying_drowndown = () => {
  console.log('❌ failpass');
};

const test_populateDropdown = () => {
  subtest_populateDropdown();
  test_applying_drowndown();
};
