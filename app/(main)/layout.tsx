import {Header} from "@/components/shared/header"
import {Footer} from "@/components/shared/footer"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}
