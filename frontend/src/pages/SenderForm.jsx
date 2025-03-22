import Navbar from "@/components/Navbar"

import Footer from "@/components/Footer"
import Header from "@/components/Header"
import WhoDoYouWantToCall from "@/components/WhoDoYouWantToCall"
import CallInitiator from "@/components/CallInitiator"

const SenderForm = ()=>{
  return <>
      <Navbar></Navbar>
      {/* <Header></Header> */}
      <CallInitiator/>
      <Footer></Footer>
  </>
}



export default SenderForm