import { program } from 'commander';
import inquirer from 'inquirer';
import figlet from 'figlet';
import chalk from 'chalk';

import { getMovies } from './api/index.js';

console.log(
  chalk.yellow(figlet.textSync("MEGOMOVIES", { horizontalLayout: "full" }))
);

program.action(async () => {
  const movies = await getMovies(0);

  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "Choose an option:",
        choices: movies.map(m => m.name),
        pageSize: 10
      },
    ]).then((result) => {
      console.log(result);
    }).catch(() => {
      console.log('some error');
    });
});

program.parse(process.argv);