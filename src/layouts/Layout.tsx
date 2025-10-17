import Container from "@/components/Container"
import Header from "@/components/Header"

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <Container>{children}</Container>
    </div>
  )
}

export default Layout
