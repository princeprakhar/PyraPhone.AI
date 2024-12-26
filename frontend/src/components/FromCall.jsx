import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {Button} from "@/components/ui/button"

const FromCall = () =>{

  const [callerNumber, setCallerNumber] = useState(""); // State for phone number input
  const [context, setContext] = useState("");
  const [name, setName] = useState(""); // State for call name
  const navigate = useNavigate("/");

  // Handle input change
  const handleInputChange = (setter) => (e) => setter(e.target.value);


  // Function to make the call
  const handleMakeCall = async () => {
    setCallerNumber("");
    setContext("");
    setName("");
    navigate("/sender/initiate-call");
  }

  return <>
    <main className="bg-black bg-opacity-90 text-gray-800 rounded-lg shadow-lg p-6 w-full max-w-xl space-y-6 transition-transform transform hover:scale-105 duration-300 ease-in-out">
    <div className="p-6 max-w-md mx-auto bg-black ring-2 rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-white">To Make a Call Enter the Sender details</h2>
      
      {/* Phone Number Input */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="caller-number" className="text-sm font-medium text-white">
          Enter Phone Number For Caller:
        </label>
        <input
          type="tel"
          id="caller-number"
          value={callerNumber}
          onChange={handleInputChange(setCallerNumber)}
          placeholder="+1234567890"
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* context Input */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="context" className="text-sm font-medium text-white">
          Enter Context:
        </label>
        <input
          type="text"
          id="context"
          value={context}
          onChange={handleInputChange(setContext)}
          placeholder="type the context ..."
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* name Input */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-white">
          Callee Name Or Organization:
        </label>
        <textarea
          id="name"
          value={name}
          onChange={handleInputChange(setName)}
          placeholder="State the purpose of the call"
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Make Call Button */}
      <Button onClick={handleMakeCall} className="w-full bg-purple-500 hover:bg-purple-600 text-white">
        Next...
      </Button>

      {/* Response Message */}
      {/* {responseMessage && (
        <p
          className={`mt-4 text-center font-medium ${
            responseMessage.includes("Failed") ? "text-red-500" : "text-green-500"
          }`}
        >
          {responseMessage}
        </p> */}
      {/* )} */}
    </div>
    </main>



  </>

  

}


export default FromCall;