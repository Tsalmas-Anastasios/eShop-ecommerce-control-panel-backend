
import { dbConfig } from '../../config';
import * as mysql_ from 'mysql';


export interface QueryResult {
    rows: any;
    rowsCount: number;
    fields: any;
}

export class MySQLPool {
    public _mysql = mysql_;
    public pool: mysql_.Pool;

    public poolConfig: mysql_.PoolConfig;

    constructor() {
        this.poolConfig = {
            connectionLimit: dbConfig.mysql.connection_limit,
            host: dbConfig.mysql.host,
            user: dbConfig.mysql.user,
            password: dbConfig.mysql.password,
            database: dbConfig.mysql.database,
            multipleStatements: dbConfig.mysql.multipleStatements,
            charset: dbConfig.mysql.charset,
            supportBigNumbers: true,
            ssl: dbConfig.mysql.ssl,
            timezone: dbConfig.mysql.timezone || 'UTC',
        };

        this.pool = mysql_.createPool(this.poolConfig);
    }



    query(sql: string, args?: object | any[]): Promise<QueryResult> {
        return new Promise((resolve, reject) => {

            this.pool.getConnection((err, connection) => {

                if (err)
                    return reject(err);

                connection.config.queryFormat = (sqlQuery, values) => {
                    if (!values) return sqlQuery;
                    return sqlQuery.replace(/\:(\w+)/g, (txt, key) => {
                        if (values.hasOwnProperty(key))
                            return connection.escape(values[key]);

                        return txt;

                    });
                };



                // const query =
                connection.query(sql, args, (error, rows, fields) => {

                    connection.release();

                    if (error)
                        return reject(error);

                    return resolve({ rows: rows, rowsCount: rows?.length || 0, fields: fields });
                });

                // console.log(query.sql);

            });

        });

    }


}


const mysql = new MySQLPool();
export { mysql };
