import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import axios from "axios";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isLoading,setIsLoading] = useState(false);

  // Handle input change
  const handleInputChange = (setter) => (e) => setter(e.target.value);

  // Function to make the call
  const handleMakeCall = async () => {
    if (!email || !name || !message) {
      toast({
        title: "Fill all the Field",
        description: `Filling Required field are compulsory to continue. `,
        duration: 5000,
        className: "bg-white text-red-700 font-semibold",
      });
      return;
    }
    setIsLoading(true);
    try {
      const backEndUrl = "https://callai-backend-243277014955.us-central1.run.app/api/contact-us"
      const response = await axios.post(backEndUrl, {
        name: name,
        email: email,
        message: message,
      });
      if (response.status == 200) {
        toast({
          title: "Message sent SuccessFully!",
          description: "Your message has been sent. We will get back to you in 24 hours.",
          duration: 5000,
          className: "bg-white text-black font-semibold",
        });
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Failed to message",
        description: "Something thing unexpected happens",
        duration: 5000,
        className: "bg-white text-red-400 font-semibold",
      });
      console.log(
        `Failed to initiate the call. Error: ${
          error.response?.data?.detail || error.message
        }`
      );
    }
  };

  return (
    <main className="bg-black bg-opacity-90 text-gray-800 rounded-lg shadow-lg p-6 w-full max-w-xl space-y-6 transition-transform transform hover:scale-105 duration-300 ease-in-out">
      <div className="p-6 max-w bg-black ring-2 test-white mx-auto rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-semibold text-white text-center">
          Contact Us
        </h2>
        {/* name Input */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-white">
            Name: <span className="text-gray-400">*</span>
          </label>
          <input
            type="name"
            id="name"
            value={name}
            onChange={handleInputChange(setName)}
            placeholder="your name"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Phone Number Input */}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-white"
          >
            Email: <span className="text-gray-400">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleInputChange(setEmail)}
            placeholder="your email"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-white">
            Message: <span className="text-gray-400">*</span>
          </label>
          <input
            type="text"
            id="message"
            value={message}
            onChange={handleInputChange(setMessage)}
            placeholder="your message"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
              Firing Up!
            </div>
          ) : (
            "Send Message"
          )}
        </Button>
      </div>
      <Toaster />
    </main>
  );
};

export default Contact;
