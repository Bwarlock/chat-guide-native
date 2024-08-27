import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("myDatabase.db");

export const createTable = async () => {
	db.transaction((tx) => {
		tx.executeSql(
			`CREATE TABLE IF NOT EXISTS keyValueStore (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE,
        value TEXT
      );`
		);
	});
};

export const insertOrUpdateKeyValue = (
	key,
	value,
	successCallback = () => {},
	errorCallback = (error) => {
		console.log("indis", error);
	}
) => {
	db.transaction((tx) => {
		tx.executeSql(
			`INSERT INTO keyValueStore (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value=?;`,
			[key, value, value],
			(_, result) => successCallback(result),
			(_, error) => errorCallback(error)
		);
	});
};

export const getValueByKey = (key, successCallback, errorCallback) => {
	db.transaction((tx) => {
		tx.executeSql(
			`SELECT value FROM keyValueStore WHERE key=?;`,
			[key],
			(_, { rows }) => successCallback(rows._array[0]?.value),
			(_, error) => errorCallback(error)
		);
	});
};

export const getMultipleValuesByKeys = (
	keys,
	successCallback,
	errorCallback
) => {
	const placeholders = keys.map(() => "?").join(",");
	db.transaction((tx) => {
		tx.executeSql(
			`SELECT key, value FROM keyValueStore WHERE key IN (${placeholders});`,
			keys,
			(_, { rows }) => successCallback(rows._array),
			(_, error) => errorCallback(error)
		);
	});
};
