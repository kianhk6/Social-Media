import React from 'react'
import { Formik, Form } from "formik";
import { FormControl, FormLabel, Input, FormErrorMessage, Box, Button } from "@chakra-ui/react"
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useMutation } from 'urql';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../util/toErrorMap';
import Router, {useRouter} from "next/router"


export const Login: React.FC<{}> = ({ }) => {
    const router = useRouter();
    const [,login] = useLoginMutation() //how we send information to back end
    return (
        <Wrapper varient='small'>
            <Formik //since the keys "username and password" exactly line up with the mutation name 
            //passing just the values will work
                initialValues={{ username: "", password: "" }}
                onSubmit={async (values, {setErrors}) => {
                    const response = await login(values); //using the register with 
                    //useRegisterMutation we send the values to back
                    if(response.data?.login.errors){
                        setErrors( //for formik error functionality pop up
                            //this is a function written in util
                            //transfers the graphQL format to Formik --> username: "hammod"
                            toErrorMap(response.data.login.errors) 
                        )
                    }
                    else if(response.data?.login.user){ //response returns user if works
                        router.push('/'); //router goes back to home page
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name='username'
                            placeholder='username'
                            label='Username' 
                        />
                        <Box mt={4}>
                            <InputField
                                name='password'
                                placeholder='password'
                                label='Password'
                                type='password'
                            />

                        </Box>
                        <Button 
                            mt={4} 
                            type="submit" 
                            colorScheme='orange'
                            isLoading= {isSubmitting}
                        > 
                        Login 
                        </Button>

                    </Form>
                )
                }
            </Formik>

        </Wrapper>


    );
} //

export default Login;