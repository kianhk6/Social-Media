import { User } from "../entities/User";
import { MyContext } from "src/types";
import { EntityManager } from "@mikro-orm/postgresql";
import {
    Query,
    Resolver,
    Mutation,
    InputType,
    Field,
    Arg,
    Ctx,
    ObjectType,
} from "type-graphql";
import argon2 from "argon2"; //better than bycrypt according to stackoverflow
import { COOKIE_NAME } from "../constants";
//graphQl
@InputType() //input type is for arguments
class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;
}
@ObjectType()
class FieldError {
    @Field()
    field: string; //what field is wrong

    @Field()
    message: string; // what is wrong with the field
}

@ObjectType() // object type is for returns
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]; //this will be the response if it fails

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {
    
    @Query(() => User, {nullable: true})
    async me(@Ctx() {req, em}: MyContext) { // function that checks who the user is with cookie
        if(!req.session.userId){
            return null; //you are not logged in
        }

        const user = em.findOne(User, {id: req.session.userId});
        return user;
    }

    @Mutation(() => UserResponse) //its a query that returns string
    async register(
        @Arg("options") options: UsernamePasswordInput, // didnt write the type
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        if(options.username.length <= 2){
            return{errors: [{
                    field: "username",
                    message: "length must be greater than 2"
                }]
            };
        }

        if(options.password.length <= 2){ //change this later
            return {errors: 
                [   
                    {
                        field: "password",
                        message: "length must be greater than 3",
                    },
                ]
            }
        } 
        const hashedPassword = await argon2.hash(options.password);
        // const user = em.create(User, {
        //     username: options.username,
        //     password: hashedPassword,
        // });
        let user;
        try{
            //doing it with query builder
            const result = await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert(
                {
                    username: options.username,
                    password: hashedPassword,
                    created_at: new Date(),
                    updated_at: new Date(),
                }
            ).returning("*"); //returning every field
            user = result[0]
            // await em.persistAndFlush(user); //doing it with persist and flush
        }
        catch(err){
            if(err.detail.includes("already exists")){
                return {errors: 
                    [   
                        {
                            field: "username",
                            message: "username already taken",
                        },
                    ]
                }
            } 
        }
        // loggin the user that just got created
        req.session.userId = user.id; 
        return {user};
    }

    @Mutation(() => UserResponse) //its a query that returns string
    async login(
        @Arg("options") options: UsernamePasswordInput, // didnt write the type
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { username: options.username });
        if (!user) {
            return {
                errors:
                    [
                        {
                            field: "username",
                            message: "that username doesn't exist",
                        },
                    ],
            };
        }
        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors:
                    [
                        {
                            field: "password",
                            message: "incorrect password",
                        }
                    ]
            }
        }
        req.session.userId = user.id; //setting user id when logged in

        return {
            user,
        };
    }

    @Query(() => [User]) //its a query that returns array 
    users( @Ctx() {em}: MyContext) : Promise<User []>{ //returns a promise of post
        
        return em.find(User, {}) //finds all the posts
    }

    @Mutation(() => Boolean)
    logout(@Ctx() { req, res }: MyContext) {
      return new Promise((resolve) =>
        req.session.destroy((err) => {
            res.clearCookie(COOKIE_NAME);
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
          resolve(true);
        })
      );
    }
}
