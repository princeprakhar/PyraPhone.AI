import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

const WhoDoYouWantToCall = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nameOrOrganization, setNameOfOrganization] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [objective, setObjective] = useState("");

  // Handle input change
  const handleInputChange = (setter) => (e) => setter(e.target.value);

  // Function to make the call
  const handleMakeCall = async () => {
    if (!phoneNumber || !nameOrOrganization || !objective || !additionalInfo ) {
      toast({
        title: "Fill all the Field",
        description: `Filling Required field are compulsory to continue. `,
        duration: 5000,
        className: "bg-white text-red-700 font-semibold",
      });
      return;
    }

    try {
      navigate("/sender/initiate-call", {
        state: {
          phoneNumber: phoneNumber,
          nameOrOrganization: nameOrOrganization,
          objective: objective,
          additionalInfo: additionalInfo,
        },
      });
    } catch (error) {
      toast({
        title: "Failed to connect",
        description: "Something thing unexpected happens",
        duration: 5000,
        className: "bg-white text-red font-semibold",
      });
      console.log(`Failed to initiate the call. Error: ${
          error.response?.data?.detail || error.message
        }`);
      
    }
  };

  return (
    <main className="bg-black bg-opacity-90 text-gray-800 rounded-lg shadow-lg p-6 w-full max-w-xl space-y-6 transition-transform transform hover:scale-105 duration-300 ease-in-out">
      <div className="p-6 max-w bg-black ring-2 test-white mx-auto rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          Who do you want to call?
        </h2>

        {/* Phone Number Input */}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="phone-number"
            className="text-sm font-medium text-white"
          >
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

        {/* nameOrOrganisation Input */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="nameOrOrganization" className="text-sm font-medium text-white">
            Name Or Organization:
          </label>
          <input
            type="nameOrOrganization"
            id="nameOrOrganization"
            value={nameOrOrganization}
            onChange={handleInputChange(setNameOfOrganization)}
            placeholder="xFinity or Happy Teeth Dental Clinic"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="objective" className="text-sm font-medium text-white">
            Objective:
          </label>
          <input
            type="text"
            id="objective"
            value={objective}
            onChange={handleInputChange(setObjective)}
            placeholder="Get me an appointment as soon as possible OR Ask for a refund"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Objective Input */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="additionalInfo" className="text-sm font-medium text-white">
            Additional details:
          </label>
          <textarea
            id="additionalInfo"
            value={additionalInfo}
            onChange={handleInputChange(setAdditionalInfo)}
            placeholder="Please provide all necessary information to facilitate the call. This could include you account ID, insurance details."
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Make Call Button */}
        <Button
          onClick={handleMakeCall}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white"
        >
          Next
        </Button>

      </div>
      <Toaster/>
    </main>
  );
};

export default WhoDoYouWantToCall;
