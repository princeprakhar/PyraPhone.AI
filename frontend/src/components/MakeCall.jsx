import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button"; 
import { useNavigate } from "react-router-dom";

const MakeCall = () => {
  const [phoneNumber, setPhoneNumber] = useState(""); // State for phone number input
  const [email, setEmail] = useState(""); // State for email input
  const [responseMessage, setResponseMessage] = useState(""); 
  const navigate = useNavigate("");
  const [context,setContext] = useState("");
  const [outcome,setOutcome] = useState("");

  // Handle input change
  const handleInputChange = (setter) => (e) => setter(e.target.value);

  // Function to make the call
  const handleMakeCall = async () => {
    if (!phoneNumber || !email || !context) {
      setResponseMessage("Please fill in all the fields.");
      return;
    }

    try {
      const backendUrl = "https://callai-backend-243277014955.us-central1.run.app/api/initiate-call"
      // const backendUrl = "https://353e-103-69-25-33.ngrok-free.app/api/initiate-call"
      // Send request to backend
      const response = await axios.post(backendUrl, {
        to_number: phoneNumber,
        email,
        context,
      });

      navigate("/sender/initiate-call/call-status", {
        state: { ssid: response.data.call_sid, isInitiated: true,to_number: phoneNumber, email:email, context: context},
      });
      
    } catch (error) {
      setResponseMessage(
        `Failed to initiate the call. Error: ${
          error.response?.data?.detail || error.message
        }`
      );
    }
  };

  return (
    <main className="bg-black bg-opacity-90 text-gray-800 rounded-lg shadow-lg p-6 w-full max-w-xl space-y-6 transition-transform transform hover:scale-105 duration-300 ease-in-out">
    <div className="p-6 max-w bg-black ring-2 test-white mx-auto rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-white">Who do you want to call?</h2>
      
      {/* Phone Number Input */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="phone-number" className="text-sm font-medium text-white">
          Phone Number:
        </label>
        <input
          type="tel"
          id="phone-number"
          value={phoneNumber}
          onChange={handleInputChange(setPhoneNumber)}
          placeholder="+1234567890"
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Email Input */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-white">
        Name Or Organization:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleInputChange(setEmail)}
          placeholder="xyz@example.com"
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Objective Input */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="objective" className="text-sm font-medium text-white">
        Context For the Call:
        </label>
        <textarea
          id="context"
          value={context}
          onChange={handleInputChange(setContext)}
          placeholder="State the purpose of the call"
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* context Input */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="context" className="text-sm font-medium text-white">
          Desired Outcome:
        </label>
        <input
          type="text"
          id="outcome"
          value={outcome}
          onChange={handleInputChange(setOutcome)}
          placeholder="type the outcome ..."
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Make Call Button */}
      <Button onClick={handleMakeCall} className="w-full bg-purple-500 hover:bg-purple-600 text-white">
        Make Call
      </Button>

      {/* Response Message */}
      {responseMessage && (
        <p
          className={`mt-4 text-center font-medium ${
            responseMessage.includes("Failed") ? "text-red-500" : "text-green-500"
          }`}
        >
          {responseMessage}
        </p>
      )}
    </div>
    </main>
  );
};

export default MakeCall;