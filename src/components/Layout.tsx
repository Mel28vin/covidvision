import type { PropsWithChildren } from "react"
import Header from "./Header"
import Footer from "./Footer"

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default Layout
