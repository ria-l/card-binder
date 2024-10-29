// for each test, need to add a variation of this to the beginning:
// setInputForCardSize('absolute', 250);
// setInputsForGrid('absolute', 3, 3);
// test_setup();
// data = JSON.parse(localStorage.getItem('test_data'));
// storeBinders(data)
// createTags();
// fillBinder(localStorage.getItem('bindername'));
// populateDropdown();

const test_setup = () => {
  // dupe onLoad actions
  localStorage.clear();
  document.getElementById('status').innerHTML = '(test) loading...';

  localStorage.setItem('bindername', 'test');
  localStorage.setItem(
    'test_data',
    `[["test_binder","file name","binder","name","caught","caught date","set","card type","pkmn type","card #","release date","dex #","pkmn type #","card type #"],
    ["","sve.001.basic_g_energy.png","test_binder","basic_g_energy","x","2024-10-27T04:00:00.000Z","SVE","energy","grass",1,"2023-03-31T04:00:00.000Z","",1,21],
    ["","sve.002.basic_r_energy.png","test_binder","basic_r_energy","","2024-10-27T04:00:00.000Z","SVE","energy","fire",2,"2023-03-31T04:00:00.000Z","",2,21],
    ["","sw.022.arcanine.jpg","test_binder","arcanine","x","2024-10-27T04:00:00.000Z","SW","energy","fire",22,"",59,2,0],
    ["","lor.TG08.hisuian_arcanine.png","test_binder","arcanine","x","2024-10-27T04:00:00.000Z","LOR","energy","fighting",8,"2022-09-09T04:00:00.000Z",59,6,0],
    ["","brs.TG01.flareon.png","test_binder","flareon","x","2024-10-27T04:00:00.000Z","BRS","energy","fire",1,"2022-02-25T05:00:00.000Z",136,2,0],
    ["","sve.003.basic_w_energy.png","test_binder","basic_w_energy","x","2024-10-27T04:00:00.000Z","SVE","energy","water",3,"2023-03-31T04:00:00.000Z","",3,21],
    ["","brs.TG02.vaporeon.png","test_binder","vaporeon","x","2024-10-27T04:00:00.000Z","BRS","energy","water",2,"2022-02-25T05:00:00.000Z",134,3,0],
    ["","sve.004.basic_l_energy.png","test_binder","basic_l_energy","","2024-10-27T04:00:00.000Z","SVE","energy","lightning",4,"2023-03-31T04:00:00.000Z","",4,21],
    ["","brs.TG04.jolteon.png","test_binder","jolteon","x","2024-10-27T04:00:00.000Z","BRS","energy","lightning",4,"2022-02-25T05:00:00.000Z",135,4,0],
    ["","sve.005.basic_p_energy.png","test_binder","basic_p_energy","x","2024-10-27T04:00:00.000Z","SVE","energy","psychic",5,"2023-03-31T04:00:00.000Z","",5,21],
    ["","sve.006.basic_f_energy.png","test_binder","basic_f_energy","","2024-10-27T04:00:00.000Z","SVE","energy","fighting",6,"2023-03-31T04:00:00.000Z","",6,21],
    ["","sve.007.basic_d_energy.png","test_binder","basic_d_energy","x","2024-10-27T04:00:00.000Z","SVE","energy","dark",7,"2023-03-31T04:00:00.000Z","",7,21],
    ["","sve.008.basic_m_energy.png","test_binder","basic_m_energy","","2024-10-27T04:00:00.000Z","SVE","energy","metal",8,"2023-03-31T04:00:00.000Z","",8,21],
    ["","xyp.XY177.karen_.jpg","test_binder","karen_","x","2024-10-27T04:00:00.000Z","XYP","support","n/a",177,"2023-03-31T04:00:00.000Z","",19,20]]`
  );
};

const test_all = () => {
  console.log('** test_create_tags');
  test_create_tags();
  console.log('** test_storebinders');
  test_storebinders();
  console.log('** test_fillbinder');
  test_fillbinder();
  console.log('** test_setInputForCardSize');
  test_setInputForCardSize();
  console.log('** test_setInputsForGrid');
  test_setInputsForGrid();
  console.log('** test_fetchAndFillBinder');
  test_fetchAndFillBinder();
  console.log('** test_populateDropdown');
  test_populateDropdown();
};
