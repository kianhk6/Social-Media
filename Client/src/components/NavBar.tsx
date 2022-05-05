import { Box, Flex, Link } from '@chakra-ui/react';
import React from 'react'
import NextLink from 'next/link'; //for linking to pages navigation
interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
    return (
        <Flex bg="gray.700" p={4}>
            <Box ml={"auto"}>
                <NextLink href="/login">
                    <Link color="whiteAlpha.900" mr={2}>Login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link color="whiteAlpha.900">Register</Link>
                </NextLink>
            </Box>
        </Flex>
    );

}