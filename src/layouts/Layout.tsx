import Container from "@/components/Container"
import Header from "@/components/Header"
import UserInput from "@/components/UserInput"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <Container>{children}</Container>
      <UserInput />
    </div>
  )
}

export default Layout
