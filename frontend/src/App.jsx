import Home from "@/pages/Home"
import { Routes, Route,BrowserRouter } from "react-router-dom";
import ReceiverForm from "./pages/ReceiverForm";
import SenderForm from "./pages/SenderForm";
import FAQ from "@/pages/FAQ"
import CallStatus from "./pages/CallStatus";
function App() {
  return (
    <div
      className="min-h-screen flex flex-col items-center  justify-center bg-cover bg-center p-6 
                  bg-black"
    >
      

      {/* Routes */}
      <BrowserRouter>
      <Routes>
        {/* Define route for initiating a call */}
        <Route path="/sender/initiate-call" element={<ReceiverForm/>} />
        <Route path="/sender/" element={<SenderForm/>}/>
        <Route path="/faq" element={<FAQ/>}/>
        <Route path= "/sender/initiate-call/call-status" element={<CallStatus/>}/>
        {/* Define route for both "/" and "/home" */}
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>

      
      
    </div>
  );
}

export default App;
