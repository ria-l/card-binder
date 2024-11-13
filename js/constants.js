const appscript_url =
  'https://script.google.com/macros/s/AKfycbyaRyXFFKd-89QvMiyEg0TSxkuwZJ8Xt90lCFYqYszjTiGvYDn5OgFUBt31ALRsAYzykQ/exec';

let jcaught, jfilename, jset, jcardtype, jpkmntype, jcardsubtype;

const getConstantsFromStorage = () => {
  const header = localStorage.getItem('header').split(',');

  jcaught = header.indexOf('caught');
  jfilename = header.indexOf('file name');
  jset = header.indexOf('set');
  jcardtype = header.indexOf('card type');
  jpkmntype = header.indexOf('pkmn type');
  jcardsubtype = header.indexOf('card subtype');
};
