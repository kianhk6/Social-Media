import { Query, Resolver } from "type-graphql";
//graphQl 
@Resolver()
export class HelloResolver{
    @Query(() => String) //its a query that returns string
    hello(){
        return "bye"
    }

}//