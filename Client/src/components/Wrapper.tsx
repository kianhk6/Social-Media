import { Box } from '@chakra-ui/react';
import React from 'react'

interface WrapperProps {
    varient?: 'small' | 'regular' //react props is only one

}

export const Wrapper: React.FC<WrapperProps> = ({children, 
    varient='regular', //default is regular
}) => {
        return (
            <Box 
                mt={8} mx="auto" 
                maxW={varient === 'regular' ? "800px" : "400px"} 
                w="100%"
                
            >
                {children}
            </Box>
        );
}