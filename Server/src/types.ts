import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core"
import {Request, Response} from "express";
import {Redis} from "ioredis";
export type MyContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
    req: Request & {session: Express.Session}; //it deals with saying session can not be null (default was saying session:?)
    //overwritten the default type
    res: Response;
    redis: Redis;
}