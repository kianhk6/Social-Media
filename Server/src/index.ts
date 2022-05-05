import { MikroORM } from "@mikro-orm/core";
import "reflect-metadata";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql'; //for schema field in apollo server intiation
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import * as redis from 'redis';
import connectRedis from 'connect-redis';
import session from "express-session";
import cors from 'cors';
const main = async () => {
    const orm = await MikroORM.init(microConfig);//
    await orm.getMigrator().up();

    const generator = orm.getSchemaGenerator(); //for generating the table
    await generator.updateSchema();
    
    const app = express();

    const RedisStore = connectRedis(session);//
    const redisClient = redis.createClient();
    app.use(
        cors({
            origin: 'http://localhost:3000',
            credentials: true,
        })
    )
    
    redisClient.on("error", function (err) {
        console.log("Error " + err);
    });
    //session middle ware must run before apollo 
    app.use(
        session({
            name: 'qid', //name of cookie
            store: new RedisStore({
                client: redisClient, 
                disableTouch: true,
                disableTTL: true,
            }),
            cookie:{
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
                httpOnly: true,
                sameSite: 'lax', // protecting csrf
                secure: false, //coolie only works in https
            },
            saveUninitialized: false, //create session by default even no data : false
            secret: "dsfklsjfklasjfljasfmdscsmlamc",
            resave: false,
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({//
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: ({req, res}) => ({ em: orm.em, req, res })
    })

    apolloServer.applyMiddleware({ app, cors: false}); //creates a graphQl endpoint on express 
    //(cors automatically included)

    app.listen(4000, () => {
        console.log('Listening on Localhost:4000')
    })
    console.log('------ sql 2 ------');
}
main();
console.log("hello there");///