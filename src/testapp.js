"use strict";

const fs = require(`fs`);

// const printDir = (path) => {
//   fs.readdir(path, (err, files) => {
//     if (err) {
//       throw err;
//     }

//     files.forEach((file) => console.log(file));
//   });
// };

// printDir(__dirname);

const path = __dirname;

const printDirPromise = new Promise((resolve, reject) => {
  fs.readdir(path, (err, files) => {
    if (err) {
      reject(err);
    }

    resolve(files);
  })
})

printDirPromise
.then((files) => files.forEach((file) => console.log(file)))
.catch((err) => console.log(err));