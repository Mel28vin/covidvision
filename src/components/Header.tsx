import Link from "next/link"
import { IoLogoGithub } from "react-icons/io5"

const Header = () => {
  return (
    <header className="fixed z-20 w-full p-2">
      <div className="mx-auto max-w-5xl">
        <nav className="flex items-center justify-between gap-3 text-base">
          <Link href="/" className="group">
            <h2 className="p-2 text-lg font-semibold tracking-tighter">
              CovidVision
            </h2>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="https://github.com/Mel28vin/my-blog"
              target="_blank"
              className="inline-flex items-center gap-1"
            >
              <IoLogoGithub /> Source
            </Link>
            <Link href="/about">About Me</Link>
            <Link href="/precautions">Precautions</Link>
            <Link href="/vaccinations">Vaccinations</Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
