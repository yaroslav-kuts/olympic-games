var draw = function (data, title, columns) {

  var max = Math.max(...data.map(arr => arr[1]));

  console.log('\n' + title.toUpperCase() + '\n');
  console.log(columns.join('\t'));

  data.forEach(arr => {
    var num = Math.round(arr[1] / max * 200);
    console.log(`${arr[0]}\t${'█'.repeat(num)}`);
  });
};

exports.draw = draw;
