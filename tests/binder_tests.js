// _createImgs

const subtest_create_tags_writes_to_storage = () => {
  _createCardTags();
  tags = localStorage.getItem('tags');
  if (tags.includes('basic_g_energy')) {
    console.log('✅ pass');
  } else {
    console.log('❌ fail');
    console.log(`tags:\n${tags}`);
  }
};

const subtest_tags_width_matches_input = () => {
  tags = localStorage.getItem('tags');

  width = document.getElementById('size-dropdown').value;
  if (tags.includes(`${width}px`)) {
    console.log('✅ pass');
  } else {
    console.log(`❌ fail`);
    console.log(`width: fail\n${width}px`);
  }
};

const test_create_tags = () => {
  setAndStoreCardSize('absolute', 250);
  setAndStoreGrid('absolute', 3, 3);
  test_setup();
  data = JSON.parse(localStorage.getItem('test_data'));
  storeBinders(data);

  // dupe from function to help debug
  BINDER_NAME = localStorage.getItem('bindername');
  BINDER_DATA = JSON.parse(localStorage.getItem(BINDER_NAME));
  header = JSON.parse(localStorage.getItem('binder'))[0];

  // test functionality
  try {
    subtest_create_tags_writes_to_storage();
  } catch (err) {
    console.log('❌ fail');
    console.log(err);
    console.log(`BINDER_NAME: ${BINDER_NAME}`);
    console.log(`BINDER_DATA: ${BINDER_DATA}`);
    console.log(`header: ${header}`);
  }
  subtest_tags_width_matches_input();
};

// storeBinders

const test_storebinders = () => {
  setAndStoreCardSize('absolute', 250);
  setAndStoreGrid('absolute', 3, 3);
  test_setup();
  data = JSON.parse(localStorage.getItem('test_data'));

  // dupe from function to help debug
  const header = data[0];
  localStorage.setItem('bindername', header[0]);
  const binderIndex = header.indexOf('binder');

  try {
    storeBinders(data);
  } catch (err) {
    console.log('❌ fail');
    console.log(err);
    console.log(`header: ${header}`);
    console.log(`binderNames: ${[localStorage.getItem('bindernames')]}`);

    console.log(`binderIndex: ${binderIndex}`);
  }

  const stored_binder = localStorage.getItem('test_binder');
  if (stored_binder) {
    console.log('✅ pass');
  } else {
    console.log('❌ fail');
    console.log(`stored_binder: ${stored_binder}`);
  }
  if (stored_binder.includes('arcanine')) {
    console.log('✅ pass');
  } else {
    console.log('❌ fail');
    console.log(
      `stored_binder.includes('arcanine'): ${stored_binder.includes(
        'arcanine'
      )}`
    );
  }
};

// fillBinder

const test_fillbinder = () => {
  setAndStoreCardSize('absolute', 250);
  setAndStoreGrid('absolute', 4, 4);
  test_setup();
  data = JSON.parse(localStorage.getItem('test_data'));
  storeBinders(data);
  _createCardTags();

  const rows = parseInt(document.getElementById('row-dropdown').selectedIndex);
  const cols = parseInt(document.getElementById('col-dropdown').selectedIndex);

  try {
    fillBinder();
  } catch (err) {
    console.log('❌ fail');
    console.log(err);
  }
  content = document.getElementById('content').innerHTML;
  if (content.startsWith('<table') && content.endsWith('</table>')) {
    console.log('✅ pass');
  } else {
    console.log('❌ fail');
    console.log(`incorrect table format: ${content}`);
  }
  if (
    content.includes('hisuian_arcanine') &&
    content.includes('basic_g_energy')
  ) {
    console.log('✅ pass');
  } else {
    console.log('❌ fail');
    console.log(`incorrect contents: ${content}`);
  }
  if (
    content.includes(
      '<tr><td><img src="img/sw/sw.022.arcanine.jpg" title="sw.022.arcanine.jpg : fire : basic" style="width:250px;"></td><td><img src="img/brs/brs.TG01.flareon.png" title="brs.TG01.flareon.png : fire : basic" style="width:250px;"></td><td><img src="img/brs/brs.TG02.vaporeon.png" title="brs.TG02.vaporeon.png : water : basic" style="width:250px;"></td><td><img src="img/brs/brs.TG04.jolteon.png" title="brs.TG04.jolteon.png : lightning : basic" style="width:250px;"></td></tr>'
    )
  ) {
    console.log('✅ pass');
  } else {
    console.log('❌ fail');
    console.log(`incorrect cols.\ninput cols: ${cols}\n`);
    console.log(content);
  }

  if (content.match(new RegExp('<tr>', 'g')).length == 4) {
    console.log('✅ pass');
  } else {
    console.log('❌ fail');
    console.log(
      `incorrect rows.\ninput rows: ${rows}\ntr count: ${
        content.match(new RegExp('<tr>', 'g')).length
      }`
    );
    console.log(content);
  }
};
