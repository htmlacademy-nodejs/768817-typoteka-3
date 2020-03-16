'use strict';

const {Cli} = require(`./cli`);
const DEFAULT_COMMAND = `--help`;

const USER_ARGV_INDEX = 2;
const USER_ARGS_CUT_INDEX = 1;

const ExitCode = {
  error: 1,
  success: 0,
};

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

if (userArguments.length === 0 || !Cli[userCommand]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(ExitCode.success);
}

Cli[userCommand].run(userArguments.slice(USER_ARGS_CUT_INDEX));
