export const validatePassword = (password: string) => {

    if(password.length <= 2){ //change this later
        return  [{
            field: "password",
            message: "password length must be bigger than 3"
        }]
        ;
        
    }
    return null; 

}