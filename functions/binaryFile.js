function binaryFile(req, res, next){
  var data = Buffer.from('');
  req.on('data', function(chunk) {
      data = Buffer.concat([data, chunk]);
  });
  req.on('end', function() {
    req.rawBody = data;
    next();
  });
}

module.exports = binaryFile;

// fs.open(url, 'w', function(err, fd) {
//   if (err) {
//       throw 'error opening file: ' + err;
//   }
//   fs.write(fd, req.rawBody, 0, leng, null, function(err) {
//       if (err){
//         res.status(400).json({
//           ok: false,
//           error
//         })
//       }
//       fs.close(fd, async function() {
        
//       })
//   });
// });