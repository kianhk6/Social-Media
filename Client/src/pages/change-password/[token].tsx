import { Box, Button, Flex, Link } from '@chakra-ui/react';
import e from 'cors';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import router, { useRouter } from 'next/router';
import { useState } from 'react';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../util/createUrqlClient';
import { toErrorMap } from '../../util/toErrorMap';
import NextLink from "next/link"

// token is send from the url and in the url it comes from the generated uuid in the change password function
// in the user resolver
const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
    const router = useRouter();
    const [, changePassword] = useChangePasswordMutation()
    const [tokenError, setTokenError] = useState('');
    return (
        <Wrapper varient='small'>
            <Formik
                initialValues={{ password: '' }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await changePassword({
                        password: values.password,
                        token

                    });
                    console.log(response.data)
                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(response.data?.changePassword.errors);
                        if ('token' in errorMap) {
                            setTokenError(errorMap.token);
                        }
                        console.log(errorMap)
                        setErrors(errorMap)
                    }
                    else if (response.data?.changePassword.user) {
                        router.push('/');
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name='password'
                            placeholder='new password'
                            label='New Password'
                            type="password"
                        />
                        {tokenError ? (

                            <Flex>
                                <Box mr={8} color="red">{tokenError}</Box>
                                <NextLink href={"/forgot-password"}>
                                    <Link> get new link </Link>
                                </NextLink>

                            </Flex>


                        )
                            : null}
                        <Button
                            mt={4}
                            type="submit"
                            colorScheme='orange'
                            isLoading={isSubmitting}
                        >
                            Change Password
                        </Button>

                    </Form>
                )
                }
            </Formik>

        </Wrapper>);
}


ChangePassword.getInitialProps = ({ query }) => {
    return {
        token: query.token as string
    }
}
export default withUrqlClient(createUrqlClient)(ChangePassword);

