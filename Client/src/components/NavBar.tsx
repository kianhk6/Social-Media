import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react'
import NextLink from 'next/link'; //for linking to pages navigation
import { useMeQuery } from '../generated/graphql';
interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
    const [{ data, fetching }] = useMeQuery();
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
                <Box><Button color="whiteAlpha.900" variant="link">Logout</Button></Box>
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