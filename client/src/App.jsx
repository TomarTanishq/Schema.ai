import { Navbar } from "./components/Navbar/Navbar"
import './App.css'
import Hero from "./components/Hero/Hero"
import Feature from "./components/Feature/Feature"

function App() {

  return (
    <div className="min-h-screen bg-[#141724] text-white flex flex-col">
      <Navbar />
      <Hero />
      <Feature />
    </div>
  )
}

export default App
