import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const HowShouldWeContactYou = () => {
  const [callerNumber, setCallerNumber] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate("/");
  const location = useLocation();
  const { state } = location || {};
  const { toast } = useToast();

  const handleInputChange = (setter) => (e) => setter(e.target.value);

  const handleMakeCall = async () => {
    // Check if all fields are filled
    if (!callerNumber || !email || !name) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before proceeding.",
        duration: 5000,
        className: "bg-white text-red font-semibold",
      });
      return;
    }

    setIsLoading(true);
    try {
      // const backendUrl = "https://c2ec-103-69-25-33.ngrok-free.app/api/initiate-call"
      const backendUrl = "https://callai-backend-243277014955.us-central1.run.app/api/initiate-call"
      const response = await axios.post(backendUrl, {
        to_number: state.phoneNumber,
        email: email,
        objective: state.objective,
        context: state.additionalInfo,
      });

      navigate("/sender/initiate-call/call-status", {
        state: { ssid: response.data.call_sid, isInitiated: true, to_number: state.phoneNumber, email: email, objective: state.objective, context:state.additionalInfo },
      });

    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to initiate the call. Please try again.",
        duration: 5000,
        className: "bg-white text-red-700 font-semibold",
      });
      console.log(
        `Failed to initiate the call. Error: ${
          error.response?.data?.detail || error.message
        }`
      );
    }
  }

  return (
    <main className="bg-black bg-opacity-90 text-gray-800 rounded-lg shadow-lg p-6 w-full max-w-xl space-y-6 transition-transform transform hover:scale-105 duration-300 ease-in-out">
      <div className="p-6 max-w-md mx-auto bg-black ring-2 rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-semibold text-white">How should we contact you?</h2>

        <div className="flex flex-col space-y-2">
          <label htmlFor="caller-number" className="text-sm font-medium text-white">
            Phone Number:
          </label>
          <input
            type="tel"
            id="caller-number"
            value={callerNumber}
            onChange={handleInputChange(setCallerNumber)}
            placeholder="+1234567890"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-white">
            Email:
          </label>
          <textarea
            id="email"
            value={email}
            onChange={handleInputChange(setEmail)}
            placeholder="Your email"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="context" className="text-sm font-medium text-white">
            Name:
          </label>
          <input
            type="text"
            id="Name"
            value={name}
            onChange={handleInputChange(setName)}
            placeholder="Your name"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>

        <Button
          onClick={handleMakeCall}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              AI is firing up. Hold steady!
            </div>
          ) : (
            "Make Call"
          )}
        </Button>
      </div>
      <Toaster />
    </main>
  );
}

export default HowShouldWeContactYou;