function encodeQuery(url, data = {}) {
  if (!data || !Object.keys(data).length) {
    return url
  }

  url = url.indexOf('?') === -1 ? `${url}?` : `${url}&`

  let query = Object.keys(data).map(key => `${key}=${data[key]}`).join('&')

  return `${url}${query}`
}

function pySegSort(arr, key) {
  if (!String.prototype.localeCompare) return null;

  var letters = "*abcdefghjklmnopqrstwxyz".split('');
  var zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split('');

  var segs = [];
  var curr;
  letters.forEach(function(item, i) {
    curr = { letter: item.toUpperCase(), data: [] };
    arr.forEach(function(item2) {
      var letter = item2[key]
      if ((!zh[ i - 1 ] || zh[ i - 1 ].localeCompare(letter) <= 0) && letter.localeCompare(zh[i]) === -1) {
        curr.data.push(item2);
      }
    });
    if (curr.data.length) {
      segs.push(curr);
      curr.data.sort(function(a, b) {
        return a[key].localeCompare(b[key]);
      });
    }
  });
  return segs;
}


module.exports = {
  encodeQuery,
  pySegSort,
}
