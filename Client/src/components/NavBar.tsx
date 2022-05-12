import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react'
import NextLink from 'next/link'; //for linking to pages navigation
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../util/isSever';
interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
    const [{fetching: logoutFetching} ,logout] = useLogoutMutation();
    // for getting users we use this hook and in app.tsx
    const [{ data, fetching }] = useMeQuery({
        pause: isServer(),  // doesnt run the request if we are already on the server 
    });  // if user is logged out in the middleware its set to null
    let body = null;
    //data is loading
    if (fetching) {
        body = null;
    }
    //user not logged in
    else if (!data?.me) {
        body = ( //what will be displayed
            <>
                <NextLink href="/login">
                    <Link color="whiteAlpha.900" mr={2}>Login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link color="whiteAlpha.900">Register</Link>
                </NextLink>
            </>
        )
    }
    //user logged in
    else {
        body = (
            <Flex>
                <Box mr={2} color="whiteAlpha.900">{data.me.username}</Box>
                <Box>
                <Button 
                    onClick={()=>{logout();}} 
                    color="whiteAlpha.900" 
                    variant="link"
                    isLoading={logoutFetching}
                >
                Logout
                </Button>
                </Box>
            </Flex>

        )
    }
    return (
        <Flex bg="gray.700" p={4}>
            <Box ml={"auto"}>
                {body}
            </Box>
        </Flex>
    );

}