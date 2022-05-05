import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType() //this class is object type and entity
@Entity()
export class Post {

  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({type:"date"}) //regular database column
  createdAt: Date = new Date(); //when object/row is inserted

  @Field(() => String)
  @Property({ type:"date", onUpdate: () => new Date() }) //create a data everytime we update
  updatedAt: Date = new Date();

  @Field() //if you comment this out you can not expose it to graphql
  @Property({type: "text"}) //specifically choosing type
  title!: string;
}