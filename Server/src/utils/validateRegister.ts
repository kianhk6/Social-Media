import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
    if(options.username.length <= 2){
        return [{
                field: "username",
                message: "length must be greater than 2"
            }]
        ;
    }

    if(!options.email.includes('@')){
        return [{
                field: "email",
                message: "invalid email"
            }]
        ;
    }

    if(options.username.includes('@')){
        return [{
                field: "username",
                message: "includes illegal charecter '@'"
            }]
        ;
    }

    if(options.password.length <= 2){ //change this later
        return  [{
            field: "password",
            message: "password length must be bigger than 3"
        }]
        ;
        
    }
    return null; 

}