const test_setup = () => {
  localStorage.setItem('bindername', 'test');

  localStorage.setItem(
    'test_data',
    `[["ticktick","file name","binder","name","caught","caught date","set","card type","pkmn type","card #","release date","dex #","pkmn type #","card type #"],["","sve.001.basic_g_energy.png","test_binder","basic_g_energy","x","2024-10-27T04:00:00.000Z","SVE","energy","grass",1,"2023-03-31T04:00:00.000Z","",1,21],["","sve.002.basic_r_energy.png","test_binder","basic_r_energy","","2024-10-27T04:00:00.000Z","SVE","energy","fire",2,"2023-03-31T04:00:00.000Z","",2,21],["","sw.022.arcanine.jpg","test_binder","arcanine","x","2024-10-27T04:00:00.000Z","SW","energy","fire",22,"",59,2,21],["","lor.TG08.hisuian_arcanine.png","test_binder","arcanine","","2024-10-27T04:00:00.000Z","LOR","energy","fire",8,"2022-09-09T04:00:00.000Z",59,2,21],["","brs.TG01.flareon.png","test_binder","flareon","","2024-10-27T04:00:00.000Z","BRS","energy","fire",1,"2022-02-25T05:00:00.000Z",136,2,21],["","sve.003.basic_w_energy.png","test_binder","basic_w_energy","x","2024-10-27T04:00:00.000Z","SVE","energy","water",3,"2023-03-31T04:00:00.000Z","",3,21],["","brs.TG02.vaporeon.png","test_binder","vaporeon","x","2024-10-27T04:00:00.000Z","BRS","energy","water",2,"2022-02-25T05:00:00.000Z",134,3,21],["","sve.004.basic_l_energy.png","test_binder","basic_l_energy","","2024-10-27T04:00:00.000Z","SVE","energy","lightning",4,"2023-03-31T04:00:00.000Z","",4,21],["","brs.TG04.jolteon.png","test_binder","jolteon","x","2024-10-27T04:00:00.000Z","BRS","energy","lightning",4,"2022-02-25T05:00:00.000Z",135,4,21],["","sve.005.basic_p_energy.png","test_binder","basic_p_energy","x","2024-10-27T04:00:00.000Z","SVE","energy","psychic",5,"2023-03-31T04:00:00.000Z","",5,21],["","sve.006.basic_f_energy.png","test_binder","basic_f_energy","","2024-10-27T04:00:00.000Z","SVE","energy","fighting",6,"2023-03-31T04:00:00.000Z","",6,21],["","sve.007.basic_d_energy.png","test_binder","basic_d_energy","x","2024-10-27T04:00:00.000Z","SVE","energy","dark",7,"2023-03-31T04:00:00.000Z","",7,21],["","sve.008.basic_m_energy.png","test_binder","basic_m_energy","","2024-10-27T04:00:00.000Z","SVE","energy","metal",8,"2023-03-31T04:00:00.000Z","",8,21]]`
  );
};

// createTags

const test_create_tags_writes_to_storage = () => {
  createTags();
  tags = localStorage.getItem('tags');
  console.log(`tags:\n${tags}`);
  if (tags.includes('basic_g_energy')) {
    console.log('tags written: pass');
  } else {
    console.log('tags written: fail');
  }
};

const test_tags_width_matches_input = () => {
  tags = localStorage.getItem('tags');

  width = document.getElementById('inputCardSize').value;
  if (tags.includes(`${width}px`)) {
    console.log('correct width: pass');
  } else {
    console.log(`correct width: fail\n${width}px`);
  }
};

const test_create_tags = () => {
  test_setup();

  // dupe from function to help debug
  binderName = localStorage.getItem('bindername');
  binderData = JSON.parse(localStorage.getItem(binderName));
  header = JSON.parse(localStorage.getItem('binder'))[0];
  console.log(
    `binderName: ${binderName}\n\nbinderData: ${binderData}\n\nheader: ${header}`
  );

  // test functionality
  test_create_tags_writes_to_storage();
  test_tags_width_matches_input();
};

// storeBinders

const test_storebinders = () => {
  test_setup();
  data = JSON.parse(localStorage.getItem('test_binder'));

  // dupe from function to help debug
  const header = data[0];
  localStorage.setItem('bindername', header[0]);
  const binderIndex = header.indexOf('binder');

  storeBinders(data);
  console.log(
    `header: ${header}\n\nbinderNames: ${[
      localStorage.getItem('bindernames'),
    ]}\n\nbinderIndex: ${binderIndex}`
  );

  const stored_binder = localStorage.getItem('test_binder');
  if (stored_binder) {
    console.log('binder stored');
  } else {
    console.log('binder not stored');
  }
  if (stored_binder.includes('arcanine')) {
    console.log('binder data stored');
  } else {
    console.log('binder data not stored');
  }
};

// fillBinder

const test_fillbinder = () => {
  test_setup();
  setInputsForGrid('absolute', 3, 3);
  setInputForCardSize('absolute', 40);

  const cardTags = localStorage.getItem('tags').split(',');
  const rows = parseInt(document.getElementById('inputRow').value);
  const cols = parseInt(document.getElementById('inputCol').value);
  console.log(`cardTags:`);
  console.log(cardTags);

  fillBinder('test');

  content = document.getElementById('content').innerHTML;
  if (content.startsWith('<table') && content.endsWith('</table>')) {
    console.log('correct table format');
  } else {
    console.log(`incorrect table format: ${content}`);
  }
  if (
    content.includes('hisuian_arcanine') &&
    content.includes('basic_g_energy')
  ) {
    console.log('correct contents');
  } else {
    console.log(`incorrect contents: ${content}`);
  }
  if (
    content.includes(
      '<tr><td><img src="img/sve/sve.001.basic_g_energy.png" title="sve.001.basic_g_energy.png : grass : energy" style="width:40px;"></td><td><img src="img/sword_shield_promos/sword_shield_promos.SWSH146.poke_ball.png" title="sve.002.basic_r_energy.png : fire : energy" style="width:40px;"></td><td><img src="img/sw/sw.022.arcanine.jpg" title="sw.022.arcanine.jpg : fire : energy" style="width:40px;"></td></tr>'
    ) &&
    content.match(new RegExp('<tr>', 'g')).length == 5
  ) {
    console.log('correct rows/cols');
  } else {
    console.log(
      `incorrect rows/cols: input rows: ${rows}\ninput cols: ${cols}\ntr count: ${
        content.match(new RegExp('<tr>', 'g')).length
      }`
    );
  }
};
