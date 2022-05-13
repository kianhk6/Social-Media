import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../util/createUrqlClient";

export const ForgotPassword: React.FC<{}> = ({ }) => {
	const [complete, setComplete] = useState(false);
	const [, forgotPassword] = useForgotPasswordMutation();
	return (
		<Wrapper varient='small'>
			<Formik
				initialValues={{ email: '' }}
				onSubmit={async (values, { setErrors }) => {
					await forgotPassword(values)
					setComplete(true);
				}}
			>
				{({ isSubmitting }) => complete ? 
				<Box> if an account with that email exist we sent you an email </Box> 
				: (
					<Form>
						<InputField
							name='email'
							placeholder='email'
							label='Email'
							type="email"
						/>
						<Button
							mt={4}
							type="submit"
							colorScheme='orange'
							isLoading={isSubmitting}
						>
							Forgot Password
						</Button>

					</Form>
				)
				}
			</Formik>

		</Wrapper>);
};

export default withUrqlClient(createUrqlClient) (ForgotPassword);
