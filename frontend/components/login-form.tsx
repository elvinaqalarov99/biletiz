"use client";

import React, {FormEvent, useState} from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import {apiService} from "@/utils/apiService";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await apiService.getAxiosInstance().post('/auth/login', { email, password });

            setError(''); // Reset error if login is successful

            // Redirect user or update UI
            router.push('/dashboard')
        } catch (error: unknown) {
            setError('Invalid credentials');
            if (error instanceof Error) {
                // Now TypeScript knows that 'error' is an instance of 'Error'
                setError(error.message)
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await handleLogin();
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {/*<a*/}
                                    {/*    href="#"*/}
                                    {/*    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"*/}
                                    {/*>*/}
                                    {/*    Forgot your password?*/}
                                    {/*</a>*/}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    autoComplete="current-password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                            {/*<Button variant="outline" className="w-full">*/}
                            {/*    Login with Google*/}
                            {/*</Button>*/}
                        </div>
                        {/*<div className="mt-4 text-center text-sm">*/}
                        {/*    Don&apos;t have an account?{" "}*/}
                        {/*    <a href="#" className="underline underline-offset-4">*/}
                        {/*        Sign up*/}
                        {/*    </a>*/}
                        {/*</div>*/}
                    </form>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </CardContent>
            </Card>
        </div>
    )
}
