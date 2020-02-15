"use strict";

const packageJson = require(`../../../package.json`);

module.exports = {
  name: `--version`,
  run(args) {
    const version = packageJson.version;
    console.log(process.argv, args);
    console.log(version);
  }
};
