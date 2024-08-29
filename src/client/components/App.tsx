import { AppShell, Center, Title } from "@mantine/core";
import WishList from "./WishList";

export default function App() {
	return (
		<AppShell padding="md" header={{ height: 40 }}>
			<AppShell.Header>
				<Center>
					<Title size="h2">A letter to Santa 🎅</Title>
				</Center>
			</AppShell.Header>
			<AppShell.Main>
				<WishList />
			</AppShell.Main>
		</AppShell>
	);
}
