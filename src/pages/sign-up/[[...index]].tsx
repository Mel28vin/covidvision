import { SignUp } from "@clerk/nextjs"

const SignUpPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <SignUp />
    </main>
  )
}

export default SignUpPage
