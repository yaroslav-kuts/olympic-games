var draw = function (data) {
  console.log(`Year\tAmount`)
  data.forEach(arr => console.log(`${arr[0]}\t${'█'.repeat(arr[1])}\n`));
}

exports.draw = draw;
