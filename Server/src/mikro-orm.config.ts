import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from 'path';
import { User } from "./entities/User";
export default{ // adding a seprate config file to access this info from CLI
    migrations: {
        path: path.join(__dirname,'./migrations'), // path to the folder with migrations(dirname is the absolute path to the file)
        pattern: /^[\w-] + \d + \.[tj] s $/, // how to match migration files (all .js and .ts files, but not .d.ts)
    },
    entities: [Post, User], //corsponds to tables
    dbName: 'reddit',
    user: 'postgres',
    password:'2254',
    type: 'postgresql',
    debug: !__prod__ //when not in production turn this on

} as Parameters<typeof MikroORM.init>[0]; //now the types get more specific for each property
//returns an array for parameters we get the first index