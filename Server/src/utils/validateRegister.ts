import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput";
import { validatePassword } from "./validatePassword";

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

    return validatePassword(options.password);
}