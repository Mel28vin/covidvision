import type { PropsWithChildren } from "react"
import Header from "./Header"

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

export default Layout
