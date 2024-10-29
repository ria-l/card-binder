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
      ["","sve.001.basic_g_energy.png","test_binder","basic_g_energy","x","2023-3-31T04:00:00.000Z","SVE","energy","grass",1,"2023-3-31T04:00:00.000Z","basic_g_energy",1,21],
      ["","sve.002.basic_r_energy.png","test_binder","basic_r_energy","x","2023-3-31T04:00:00.000Z","SVE","energy","fire",2,"2023-3-31T04:00:00.000Z","basic_r_energy",2,21],
      ["","sw.022.arcanine.jpg","test_binder","arcanine","","","SW","basic","fire",22,"2007-11-7T04:00:00.000Z",59,2,0],
      ["","brs.TG01.flareon.png","test_binder","flareon","x","2022-2-25T04:00:00.000Z","BRS","basic","fire",1,"2022-2-25T04:00:00.000Z",136,2,0],
      ["","sve.003.basic_w_energy.png","test_binder","basic_w_energy","","","SVE","energy","water",3,"2023-3-31T04:00:00.000Z","basic_w_energy",3,21],
      ["","brs.TG02.vaporeon.png","test_binder","vaporeon","x","2022-2-25T04:00:00.000Z","BRS","basic","water",2,"2022-2-25T04:00:00.000Z",134,3,0],
      ["","brs.TG04.jolteon.png","test_binder","jolteon","x","2022-2-25T04:00:00.000Z","BRS","basic","lightning",4,"2022-2-25T04:00:00.000Z",135,4,0],
      ["","xyp.XY177.karen_.jpg","test_binder","karen_","x","2016-9-23T04:00:00.000Z","XYP","support","n/a",177,"2016-9-23T04:00:00.000Z","karen_",19,20],
      ["","brs.TG22.umbreon_v.png","test_binder","umbreon","x","2022-2-25T04:00:00.000Z","BRS","v","dark",22,"2022-2-25T04:00:00.000Z",136.2,7,14],
      ["","lor.TG17.pikachu_vmax.png","test_binder","pikachu","x","2022-9-9T04:00:00.000Z","LOR","vmax","lightning",17,"2022-9-9T04:00:00.000Z",25,4,15],
      ["","crz.GG56.hisuian_zoroark_vstar.png","test_binder","zoroark","x","2023-1-20T04:00:00.000Z","CRZ","vstar","dark",56,"2023-1-20T04:00:00.000Z",571,7,16],
      ["","lor.TG08.hisuian_arcanine.png","test_binder","arcanine","x","2022-9-9T04:00:00.000Z","LOR","basic","fighting",8,"2022-9-9T04:00:00.000Z",59,6,0]]`
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
