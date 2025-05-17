import sqlite3 from "sqlite3";

export const close = (db: sqlite3.Database) => db.close();

export const exec = async (db: sqlite3.Database, sql: string) => {
  return new Promise<void>((res, rej) => {
    db.exec(sql, (err) => {
      if (err) rej(err);
      res();
    });
  });
};

export const run = async (
  db: sqlite3.Database,
  sql: string,
  params: any[] = [],
) => {
  if (params && params.length > 0) {
    return new Promise<void>((res, rej) => {
      db.run(sql, params, (err) => {
        if (err) rej(err);
        res();
      });
    });
  }
};

export const fetch = async <T>(
  db: sqlite3.Database,
  sql: string,
  params: any[] = [],
) => {
  return new Promise<T[]>((res, rej) => {
    db.all(sql, params, (err, rows) => {
      if (err) rej(err);
      res(rows as T[]);
    });
  });
};
