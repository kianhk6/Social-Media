import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType() //this class is object type and entity
@Entity()
export class User {

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
  @Property({type: "text", unique: true}) //specifically choosing type
  username!: string; //username! means it can't be null


  @Field() 
  @Property({type: "text", unique: true}) //--> set nullable to true if u are adding field durin production
  email!: string; 


  //not allowing to select password in graphQL and its hash password anyways
  @Property({type:"text"})
  password!: string;
}///////