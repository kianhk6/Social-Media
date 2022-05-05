import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react'

//this html tag can take any props that a regular input can take
type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string; //make name required
    label: string;
};

//makes everything generic can handle anything
export const InputField: React.FC<InputFieldProps> = (
    {label, 
    size: _, 
    ...props
    }) => {

    const [field, { error }] = useField(props); //this field has all the information that we are passing
    return (
        //casting string to boolean !!
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <Input {...field} {...props}  id={field.name} />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
}
