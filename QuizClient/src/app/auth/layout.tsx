export default function layout({ children }: { children: React.ReactNode }) {
	return (
		<main className="flex items-center min-h-screen bg-background">
			{children}
		</main>
	);
}
