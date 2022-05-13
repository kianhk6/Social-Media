import { Link, Box, Button, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useLoginMutation } from '../generated/graphql';
import { createUrqlClient } from "../util/createUrqlClient";
import { toErrorMap } from '../util/toErrorMap';
import NextLink from "next/link"



export const Login: React.FC<{}> = ({ }) => {
    const router = useRouter();
    const [, login] = useLoginMutation() //how we send information to back end
    return (
        <Wrapper varient='small'>
            <Formik //since the keys "username and password" exactly line up with the mutation name 
                //passing just the values will work
                initialValues={{ usernameOrEmail: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login(values); //using the register with 
                    //useRegisterMutation we send the values to back
                    if (response.data?.login.errors) {
                        setErrors( //for formik error functionality pop up
                            //this is a function written in util
                            //transfers the graphQL format to Formik --> username: "hammod"
                            toErrorMap(response.data.login.errors)
                        )
                    }
                    else if (response.data?.login.user) { //response returns user if works
                        router.push('/'); //router goes back to home page
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name='usernameOrEmail'
                            placeholder='username or email'
                            label='Username or Email'
                        />
                        <Box mt={4}>
                            <InputField
                                name='password'
                                placeholder='password'
                                label='Password'
                                type='password'
                            />

                        </Box>

                        <Flex mt={4}>
                            <NextLink href="/forgot-password">
                                <Link ml="auto">forgot password?</Link>
                            </NextLink>
                        </Flex>

                        <Button
                            mt={2}
                            type="submit"
                            colorScheme='orange'
                            isLoading={isSubmitting}
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

export default withUrqlClient(createUrqlClient)(Login); //no ssr since static