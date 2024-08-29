import { Alert, Button, Container, Group, Paper, Textarea, TextInput, Title } from "@mantine/core";
import { FormErrors, isNotEmpty, useForm } from "@mantine/form";
import { FieldValidationError } from "express-validator";
import useFetch from "../hooks/useFetch";

export default function WishList() {
	const form = useForm<wishListForm>({
		mode: "uncontrolled",
		initialValues: {
			username: "",
			wishlist: "",
		},
		validate: {
			// RegExp to ensure valid 'text.text' format.
			username: value => (/^\w+\.\w+$/.test(value) ? null : "That does not look like a valid username!"),
			wishlist: isNotEmpty("Santa needs to know what you want!"),
		},
	});

	const expressToMantineValidation = (errors?: FieldValidationError[]) => {
		if (!errors || !Array.isArray(errors)) return;
		const mantineErrors: FormErrors = errors
			.filter(e => e.path && e.msg)
			.reduce((a, e) => {
				a[e.path] = e.msg;
				return a;
			}, {} as FormErrors);
		form.setErrors(mantineErrors);
	};

	const {
		data: username,
		error,
		errors,
		loading,
		post,
	} = useFetch<string | undefined, wishListForm>({
		url: "/api/wish",
		sendData: () => form.getValues(),
		catch: (_e, e2: FieldValidationError[]) => expressToMantineValidation(e2),
	});

	return (
		<Container>
			<Paper withBorder p="md">
				<Title size="h4">Ho ho ho, what would you like for Christmas? 🎁</Title>
				{username && (
					<Alert variant="outline" color="lime" title="Request Received 🎄" mt="xs">
						Thanks <b>{username}</b>, Santa got your wish list!
					</Alert>
				)}
				{error && !errors && (
					<Alert variant="outline" color="red" title="Error" mt="xs" p={5}>
						{error}
					</Alert>
				)}
				<form onSubmit={form.onSubmit(() => post())}>
					<TextInput
						mt="xs"
						withAsterisk
						label="Username"
						description="Who are you?"
						placeholder="charlie.brown"
						key={form.key("username")}
						{...form.getInputProps("username")}
					/>
					<Textarea
						mt="xs"
						withAsterisk
						autosize
						minRows={5}
						label="Wish List"
						description="What do you want for christmas?"
						placeholder="Write your gift wish list here."
						key={form.key("wishlist")}
						{...form.getInputProps("wishlist")}
					/>
					<Group justify="flex-end" mt="md">
						<Button leftSection="✉️" loading={loading} type="submit">
							Send Letter
						</Button>
					</Group>
				</form>
			</Paper>
		</Container>
	);
}
