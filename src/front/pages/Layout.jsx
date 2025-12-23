import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    return (
        <ScrollToTop>
            <Navbar />
            <Outlet />
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-96 right-0 w-2xl h-96 bg-green-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-96 left-0 w-2xl h-96 bg-green-500/10 rounded-full blur-[120px]" />
            </div>
            <Footer />
        </ScrollToTop>
    )
}