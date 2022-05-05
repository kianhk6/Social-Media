import { Post } from '../entities/Post'
import { MyContext } from "src/types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
//graphQl 
@Resolver()
export class PostResolver{
    @Query(() => [Post]) //its a query that returns array 
    posts( @Ctx() {em}: MyContext) : Promise<Post []>{ //returns a promise of post
        
        return em.find(Post, {}) //finds all the posts
    }

    @Query(() => Post, {nullable: true}) //its possible to get null
    post(@Arg('id', () => Int) id:number ,@Ctx() {em}: MyContext) : Promise<Post | null>{ 
        //returns a promise of post
        return em.findOne(Post, {id}) //finds all the posts
    }

    @Mutation(() => Post)
    async createPost(
        @Arg("title") title: string,
        @Ctx() {em} : MyContext
    ): Promise<Post> {
        const post = em.create(Post, {title})
        await em.persistAndFlush(post)
        return post;
    }


    @Mutation(() => Post, {nullable: true})
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg("title", () => String, {nullable:true}) title: string,
        @Ctx() {em} : MyContext
    ): Promise<Post> {
        const post = await em.findOne(Post, id)
        if(!post){
            return null;
        }
        if(typeof title !== 'undefined'){
            post.title = title;
            await em.persistAndFlush(post)
        }
        return post;
    }



    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id', () => Int) id: number,
        @Ctx() {em} : MyContext
    ): Promise<Boolean> {
        await em.nativeDelete(Post, {id})
        return true;
    }




}