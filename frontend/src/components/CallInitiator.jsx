import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, Globe, Phone, User, Mail, Briefcase, Target, Info, ArrowRight, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { InteractiveHoverButton } from "./magicui/interactive-hover-button";
import { cn } from "@/lib/utils";
import { BACKEND_URL } from "@/utils/constants";

const supportedLanguages = {
  auto: "Auto Detect",
  en: "English",
  "en-US": "English (US)",
  "en-GB": "English (UK)",
  "en-AU": "English (Australia)",
  "en-NZ": "English (New Zealand)",
  "en-IN": "English (India)",
  zh: "Chinese (Mandarin, Simplified)",
  "zh-CN": "Chinese (Mandarin, Simplified, China)",
  "zh-Hans": "Chinese (Mandarin, Simplified, Hans)",
  "zh-TW": "Chinese (Mandarin, Traditional)",
  "zh-Hant": "Chinese (Mandarin, Traditional, Hant)",
  es: "Spanish",
  "es-419": "Spanish (Latin America)",
  fr: "French",
  "fr-CA": "French (Canada)",
  de: "German",
  el: "Greek",
  hi: "Hindi",
  "hi-Latn": "Hindi (Latin script)",
  ja: "Japanese",
  ko: "Korean",
  "ko-KR": "Korean (Korea)",
  pt: "Portuguese",
  "pt-BR": "Portuguese (Brazil)",
  "pt-PT": "Portuguese (Portugal)",
  it: "Italian",
  nl: "Dutch",
  pl: "Polish",
  ru: "Russian",
  sv: "Swedish",
  "sv-SE": "Swedish (Sweden)",
  da: "Danish",
  "da-DK": "Danish (Denmark)",
  fi: "Finnish",
  id: "Indonesian",
  ms: "Malay",
  tr: "Turkish",
  uk: "Ukrainian",
  bg: "Bulgarian",
  cs: "Czech",
  ro: "Romanian",
  sk: "Slovak",
  hu: "Hungarian",
  no: "Norwegian",
  vi: "Vietnamese",
};

const CallInitiator = () => {
  // Page 1 state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nameOrOrganization, setNameOfOrganization] = useState("");
  const [objective, setObjective] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [language, setLanguage] = useState("auto"); // Default to auto-detect language
  
  // Page 2 state
  const [callerNumber, setCallerNumber] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Current tab state
  const [activeTab, setActiveTab] = useState("who");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (setter) => (e) => setter(e.target.value);

  const handleNextTab = () => {
    if (!phoneNumber || !objective) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields before proceeding.",
        duration: 5000,
        className: "bg-white text-red-700 font-semibold",
      });
      return;
    }
    setActiveTab("contact");
  };

  const handleMakeCall = async () => {
    if (!email) {
      toast({
        title: "Required Fields Missing",
        description: "Please provide your email address.",
        duration: 5000,
        className: "bg-white text-red-400 font-semibold",
      });
      return;
    }

    setIsLoading(true);
    try {
      const backendUrl = BACKEND_URL + "/bland-ai/assistant-initiate-call";
      console.log(`Language Code: ${language}`);
      const response = await axios.post(backendUrl, {
        objective: String(objective),
        context: String(additionalInfo),
        caller_number: String(callerNumber), // Ensure it's a string
        caller_name: String(name),
        caller_email: String(email),
        language_code: language,
        phone_number: String(phoneNumber), // Ensure it's a string
        name_of_org: String(nameOrOrganization),
      });
      navigate("/sender/initiate-call/call-status", {
        state: {
          ssid: response.data.call_sid,
          isInitiated: true,
          to_number: phoneNumber,
          email: email,
          objective: objective,
          context: additionalInfo,
          caller_number: callerNumber,
          name_of_org: nameOrOrganization,
        },
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to initiate the call. Please try again.",
        duration: 5000,
        className: "bg-white text-red-700 font-semibold",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-black bg-gradient-to-br p-4 sm:p-6 md:p-10 m-16">
      <div className="w-full max-w-4xl relative">
        {/* Animated background */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        
        {/* Main card container */}
        <div className="relative backdrop-blur-md bg-black/80 rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
          {/* Shimmer effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="shimmer-line"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-4 sm:mb-6 tracking-tight">
              Pyra<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Phone.AI</span>
            </h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 h-12 sm:h-14 text-white mb-6 sm:mb-8 bg-gray-900/50 backdrop-blur-sm rounded-lg p-1">
                <TabsTrigger 
                  value="who" 
                  className="rounded-md py-1 sm:py-3 text-xs sm:text-sm md:text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/90 data-[state=active]:to-indigo-600/90 data-[state=active]:text-white transition-all"
                >
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Call</span> Recipient
                </TabsTrigger>
                <TabsTrigger 
                  value="contact" 
                  className="rounded-md py-1 sm:py-3 text-xs sm:text-sm md:text-base data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/90 data-[state=active]:to-indigo-600/90 data-[state=active]:text-white transition-all"
                  disabled={!phoneNumber || !objective}
                >
                  <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Your Details
                </TabsTrigger>
              </TabsList>

              {/* First tab content */}
              <TabsContent value="who" className="space-y-4 sm:space-y-6 px-1 sm:px-2">
                <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-5 bg-black/90">
                  <div className="flex flex-col space-y-1 sm:space-y-2">
                    <label htmlFor="phone-number" className="text-xs sm:text-sm font-medium text-gray-300 flex items-center">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-400" />
                      Phone Number <span className="text-purple-400 ml-1">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone-number"
                      value={phoneNumber}
                      onChange={handleInputChange(setPhoneNumber)}
                      placeholder="+1234567890"
                      className="p-2 sm:p-3 md:p-4 bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all text-sm sm:text-base"
                    />
                  </div>

                  <div className="flex flex-col space-y-1 sm:space-y-2">
                    <label htmlFor="nameOrOrganization" className="text-xs sm:text-sm font-medium text-gray-300 flex items-center">
                      <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-400" />
                      Name or Organization
                    </label>
                    <input
                      type="text"
                      id="nameOrOrganization"
                      value={nameOrOrganization}
                      onChange={handleInputChange(setNameOfOrganization)}
                      placeholder="xFinity or Happy Teeth Dental Clinic"
                      className="p-2 sm:p-3 md:p-4 bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all text-sm sm:text-base"
                    />
                  </div>

                  <div className="flex flex-col space-y-1 sm:space-y-2">
                    <label htmlFor="objective" className="text-xs sm:text-sm font-medium text-gray-300 flex items-center">
                      <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-400" />
                      Objective <span className="text-purple-400 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      id="objective"
                      value={objective}
                      onChange={handleInputChange(setObjective)}
                      placeholder="Get me an appointment as soon as possible"
                      className="p-2 sm:p-3 md:p-4 bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all text-sm sm:text-base"
                    />
                  </div>

                  <div className="flex flex-col space-y-1 sm:space-y-2">
                    <label htmlFor="additionalInfo" className="text-xs sm:text-sm font-medium text-gray-300 flex items-center">
                      <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-400" />
                      Additional details
                    </label>
                    <textarea
                      id="additionalInfo"
                      value={additionalInfo}
                      onChange={handleInputChange(setAdditionalInfo)}
                      placeholder="Please provide all necessary information..."
                      className="p-2 sm:p-3 md:p-4 bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white min-h-[80px] sm:min-h-[100px] md:min-h-[120px] transition-all text-sm sm:text-base"
                    />
                  </div>

                  <div className="flex justify-center mt-4 sm:mt-6">
                    <InteractiveHoverButton 
                      onClick={handleNextTab}
                      className="border-purple-500/50 bg-black/40 text-white py-2 sm:py-3 px-6 sm:px-8 text-sm sm:text-base md:text-lg tracking-wide shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-500"
                    >
                      Continue
                    </InteractiveHoverButton>
                  </div>
                </div>
              </TabsContent>

              {/* Second tab content */}
              <TabsContent value="contact" className="space-y-4 sm:space-y-6 px-1 sm:px-2">
                <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-5">
                  <div className="flex flex-col space-y-1 sm:space-y-2">
                    <label htmlFor="email" className="text-xs sm:text-sm font-medium text-gray-300 flex items-center">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-400" />
                      Email <span className="text-purple-400 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={handleInputChange(setEmail)}
                      placeholder="your.email@example.com"
                      className="p-2 sm:p-3 md:p-4 bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all text-sm sm:text-base"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex flex-col space-y-1 sm:space-y-2">
                    <label htmlFor="name" className="text-xs sm:text-sm font-medium text-gray-300 flex items-center">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-400" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={handleInputChange(setName)}
                      placeholder="John Doe"
                      className="p-2 sm:p-3 md:p-4 bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all text-sm sm:text-base"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex flex-col space-y-1 sm:space-y-2">
                    <label htmlFor="caller-number" className="text-xs sm:text-sm font-medium text-gray-300 flex items-center">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-400" />
                      Your Phone Number
                    </label>
                    <input
                      type="tel"
                      id="caller-number"
                      value={callerNumber}
                      onChange={handleInputChange(setCallerNumber)}
                      placeholder="+1234567890"
                      className="p-2 sm:p-3 md:p-4 bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all text-sm sm:text-base"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex flex-col space-y-1 sm:space-y-2">
                    <label htmlFor="language" className="text-xs sm:text-sm font-medium text-gray-300 flex items-center">
                      <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-400" />
                      Language
                    </label>
                    <select
                      id="language"
                      value={language}
                      onChange={handleInputChange(setLanguage)}
                      className="p-2 sm:p-3 md:p-4 bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all text-sm sm:text-base"
                      disabled={isLoading}
                    >
                      {Object.entries(supportedLanguages).map(([code, label]) => (
                        <option key={code} value={code} className="bg-gray-800">
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
                    <Button
                      onClick={() => setActiveTab("who")}
                      className="flex-1 py-2 sm:py-4 md:py-6 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center gap-1 sm:gap-2 transition-all text-sm sm:text-base"
                      disabled={isLoading}
                    >
                      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base font-medium">Back</span>
                    </Button>
                    
                    <Button
                      onClick={handleMakeCall}
                      className="flex-1 py-2 sm:py-4 md:py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg flex items-center justify-center gap-1 sm:gap-2 transition-all shadow-lg hover:shadow-purple-500/20 text-sm sm:text-base"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                          <span className="text-sm sm:text-base font-medium">Processing...</span>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm sm:text-base font-medium">Make Call</span>
                          <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Add shimmer effect and responsive styles */}
      <style jsx>{`
        @media screen and (min-width: 400px) {
          .xs\\:inline {
            display: inline;
          }
        }

        .shimmer-line {
          position: absolute;
          width: 50%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          top: 0;
          left: -50%;
          animation: shimmer-line 3s infinite;
        }
        
        @keyframes shimmer-line {
          0% { left: -50%; }
          100% { left: 100%; }
        }
        
        .animate-tilt {
          animation: tilt 10s infinite linear;
        }
        
        @keyframes tilt {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(1deg);
          }
          75% {
            transform: rotate(-1deg);
          }
        }
      `}</style>
      
      <Toaster />
    </div>
  );
};

export default CallInitiator;