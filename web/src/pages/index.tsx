import { signIn } from "next-auth/react";
import { FormEvent } from "react";

export default function Home() {
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    await signIn("credentials", {
      redirect: false,
      email: e.target[0].value,
      password: e.target[1].value,
    })
  }

  return (
    <form onSubmit={handleLogin}>
      <input placeholder="email" type="email" value="gabriel@email.com" />
      <input placeholder="password" type="password" value="123456" />
      <button type="submit">login</button>
    </form>
  )
}
