#!/usr/bin/env node
'use strict';

const { program } = require('commander');
const axios = require('axios').default;
const { DateTime } = require('luxon');
const { Parser } = require('json2csv');
const writeFile = require('fs').writeFile;
require('dotenv').config();

const ghAuth = {
  username: process.env.GH_USERNAME,
  password: process.env.GH_ACCESS_TOKEN
};

const ghCmds = {
  clones: 'https://api.github.com/repos/##owner##/##name##/traffic/clones?per=day',
  views: 'https://api.github.com/repos/##owner##/##name##/traffic/views?per=day'
};

const repos = [
  { owner: 'substrate-developer-hub', name: 'substrate-node-template' },
  { owner: 'substrate-developer-hub', name: 'substrate-front-end-template' },
  { owner: 'substrate-developer-hub', name: 'recipes' },
  { owner: 'substrate-developer-hub', name: 'substrate-parachain-template' },
  { owner: 'substrate-developer-hub', name: 'substrate-pallet-template' }
];

const fetchGHData = async () => {
  const statsData = {};

  // Getting bunch of fetching promises
  const promises = Object.entries(ghCmds).map(([cmdKey, cmdTpl]) =>
    repos.map(repo => {
      const targetUrl = cmdTpl.replace(/##owner##/, repo.owner).replace(/##name##/, repo.name);
      return axios
        .get(targetUrl, { auth: ghAuth })
        .then(res => {
          const objKey = `${repo.name}-${cmdKey}`;
          statsData[objKey] = res.data[cmdKey].map(row => ({
            date: DateTime.fromISO(row.timestamp).toISODate(),
            count: row.count
          }));
        })
        .catch(err => console.error('Fetch Error', err));
    })
  ).flat();

  await Promise.all(promises);
  return statsData;
};

const transformToCSVData = statsData => {
  let csvData = {};

  Object.entries(statsData).forEach(([key, array]) => {
    array.forEach(row => {
      csvData[row.date] = { ...csvData[row.date], [key]: row.count };
    });
  });

  // Further transform and sort the object key
  csvData = Object.entries(csvData).map(([key, obj]) => {
    const sortedKeys = Object.keys(obj).sort();
    const sortedRes = sortedKeys.reduce((acc, k) => ({ ...acc, [k]: obj[k] }), {});
    return { date: key, ...sortedRes };
  });

  return csvData;
};

const outputFileName = () => {
  const now = DateTime.local();
  const fn = `data-${now.toFormat('yyyyMMddHHmm')}.csv`;
  return fn;
};

const writeToCsv = csvData => {
  try {
    const parser = new Parser();
    const csv = parser.parse(csvData);
    writeFile(outputFileName(), csv, err => {
      if (err) { return console.error(err); }
    });
  } catch (err) {
    console.error(err);
  }
};

const run = async (_) => {
  const statsData = await fetchGHData();
  const csvData = transformToCSVData(statsData);
  writeToCsv(csvData);
};

program
  .version('1.0.0')
  .parse(process.argv);

if (!ghAuth.username || !ghAuth.password) {
  console.error('Github OAuth is not set. Please set GH_USERNAME and GH_ACCESS_TOKEN environment variables.');
  process.exit(5);
}

run(program);
