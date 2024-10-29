// createTags

const subtest_create_tags_writes_to_storage = () => {
  createTags();
  tags = localStorage.getItem('tags');
  if (tags.includes('basic_g_energy')) {
    console.log('pass');
  } else {
    console.log('tags written: fail');
    console.log(`tags:\n${tags}`);
  }
};

const subtest_tags_width_matches_input = () => {
  tags = localStorage.getItem('tags');

  width = document.getElementById('inputCardSize').value;
  if (tags.includes(`${width}px`)) {
    console.log('pass');
  } else {
    console.log(`correct width: fail\n${width}px`);
  }
};

const test_create_tags = () => {
  setInputForCardSize('absolute', 250);
  setInputsForGrid('absolute', 3, 3);
  test_setup();
  data = JSON.parse(localStorage.getItem('test_data'));
  storeBinders(data);

  // dupe from function to help debug
  binderName = localStorage.getItem('bindername');
  binderData = JSON.parse(localStorage.getItem(binderName));
  header = JSON.parse(localStorage.getItem('binder'))[0];

  // test functionality
  try {
    subtest_create_tags_writes_to_storage();
  } catch (err) {
    console.log(err);
    console.log(`binderName: ${binderName}`);
    console.log(`binderData: ${binderData}`);
    console.log(`header: ${header}`);
  }
  subtest_tags_width_matches_input();
};

// storeBinders

const test_storebinders = () => {
  setInputForCardSize('absolute', 250);
  setInputsForGrid('absolute', 3, 3);
  test_setup();
  data = JSON.parse(localStorage.getItem('test_data'));

  // dupe from function to help debug
  const header = data[0];
  localStorage.setItem('bindername', header[0]);
  const binderIndex = header.indexOf('binder');

  try {
    storeBinders(data);
  } catch (err) {
    console.log(err);
    console.log(
      `header: ${header}\n\nbinderNames: ${[
        localStorage.getItem('bindernames'),
      ]}\n\nbinderIndex: ${binderIndex}`
    );
  }

  const stored_binder = localStorage.getItem('test_binder');
  if (stored_binder) {
    console.log('pass');
  } else {
    console.log('fail: binder not stored');
  }
  if (stored_binder.includes('arcanine')) {
    console.log('pass');
  } else {
    console.log('fail: binder data not stored');
  }
};

// fillBinder

const test_fillbinder = () => {
  setInputForCardSize('absolute', 250);
  setInputsForGrid('absolute', 3, 3);
  test_setup();
  data = JSON.parse(localStorage.getItem('test_data'));
  storeBinders(data);
  createTags();

  const rows = parseInt(document.getElementById('inputRow').value);
  const cols = parseInt(document.getElementById('inputCol').value);

  try {
    fillBinder();
  } catch (err) {
    console.log(err);
  }
  content = document.getElementById('content').innerHTML;
  if (content.startsWith('<table') && content.endsWith('</table>')) {
    console.log('pass');
  } else {
    console.log(`incorrect table format: ${content}`);
  }
  if (
    content.includes('hisuian_arcanine') &&
    content.includes('basic_g_energy')
  ) {
    console.log('pass');
  } else {
    console.log(`incorrect contents: ${content}`);
  }
  if (
    content.includes(
      '<tr><td><img src="img/sword_shield_promos/sword_shield_promos.SWSH146.poke_ball.png" title="sw.022.arcanine.jpg : fire : basic" style="width:250px;"></td><td><img src="img/brs/brs.TG01.flareon.png" title="brs.TG01.flareon.png : fire : basic" style="width:250px;"></td><td><img src="img/brs/brs.TG02.vaporeon.png" title="brs.TG02.vaporeon.png : water : basic" style="width:250px;"></td></tr>'
    )
  ) {
    console.log('pass');
  } else {
    console.log(`incorrect cols. input cols: ${cols}`);
    console.log(content);
  }

  if (content.match(new RegExp('<tr>', 'g')).length == 4) {
    console.log('pass');
  } else {
    console.log(
      `incorrect rows. input rows: ${rows}\ntr count: ${
        content.match(new RegExp('<tr>', 'g')).length
      }`
    );
  }
};