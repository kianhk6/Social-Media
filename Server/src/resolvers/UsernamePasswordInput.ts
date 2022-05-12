import {
    InputType,
    Field
} from "type-graphql";

//graphQl
@InputType() //input type is for arguments
export class UsernamePasswordInput {
    @Field()
    email: string;
    @Field()
    username: string;
    @Field()
    password: string;
}
