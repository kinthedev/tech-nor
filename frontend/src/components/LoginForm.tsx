import { cn } from "cn"
import { useState } from "react"
import { type LoginDTO } from "@/types/auth.type"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface LoginFormProps extends Omit<React.ComponentProps<"div">, "onSubmit"> {
	onLoginSubmit: (data: LoginDTO) => void
	isLoading: boolean
	errorMessage: string | null
}

export function LoginForm({
	className,
	onLoginSubmit,
	isLoading,
	errorMessage,
	...props
}: LoginFormProps) {
	const [email, setEmail] = useState<string>("")
	const [password, setPassword] = useState<string>("")
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onLoginSubmit({ email, password })
	}
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</Field>
							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<a
										href="#"
										className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
										Forgot your password?
									</a>
								</div>
								<Input
									id="password"
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</Field>
							<Field>
								<Button type="submit">Login</Button>
								<Button variant="outline" type="button">
									Login with Google
								</Button>
								<FieldDescription className="text-center">
									Don&apos;t have an account? <a href="#">Sign up</a>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
