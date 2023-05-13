import { type NextPage } from "next"
import Head from "next/head"
import Header from "../components/Header"

import { api } from "~/utils/api"

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" })

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center ">
        <p className="text-2xl text-red-700">
          {hello.data ? hello.data.greeting : "Loading tRPC query..."}
        </p>
      </main>
    </>
  )
}

export default Home
