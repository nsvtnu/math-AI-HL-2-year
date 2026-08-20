// ============================================================
// Mathkitty pixel mascot — drawn from a character map, no images.
// K outline · G grey coat · D dark stripe · W white · P pink ear
// E eye · N nose · . transparent
// ============================================================
(function () {
'use strict';

const MAP = [
  '..KK.......KK...',
  '.KPPK.....KGGK..',
  '.KPPGKKKKKGGGK..',
  '.KGGGGGGGGGGGK..',
  '.KGDGGGGGGGDGK..',
  '.KGGGGGGGGGGGK.K',
  '.KGEEGGGGEEGGKKD',
  '.KGEEGWWGEEGGKKD',
  '.KGGGWNNWGGGGKKD',
  '.KGGWWWWWWGGGKKK',
  '..KGWWWWWWGGKK..',
  '..KKWWKKWWKKK...',
  '...KKKK.KKK.....',
];

const INK = {
  K: '#3F3B39', G: '#ABA8A6', D: '#7A7674', W: '#FDFDFD',
  P: '#EFBFC2', E: '#383132', N: '#A7626B',
};

function rects() {
  let out = '';
  MAP.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const c = INK[row[x]];
      if (c) out += '<rect x="' + x + '" y="' + y + '" width="1.03" height="1.03" fill="' + c + '"/>';
    }
  });
  return out;
}

function svg(size) {
  const h = Math.round(size * MAP.length / 16);
  return '<svg viewBox="0 0 16 ' + MAP.length + '" width="' + size + '" height="' + h +
    '" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    rects() + '</svg>';
}

window.KITTY = { svg, rects, rows: MAP.length };
})();
