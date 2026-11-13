import * as migration_20261113_173755_initial from './20261113_173755_initial';

export const migrations = [
  {
    up: migration_20261113_173755_initial.up,
    down: migration_20261113_173755_initial.down,
    name: '20261113_173755_initial'
  },
];
