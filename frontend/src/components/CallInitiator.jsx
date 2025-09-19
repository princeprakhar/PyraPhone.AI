import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, Globe, Phone, User, Mail, Briefcase, Target, Info, ArrowRight, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { InteractiveHoverButton } from "./magicui/interactive-hover-button";

// Common country codes for better UX
const countryCodes = [
  { code: "+1", country: "US/Canada", flag: "🇺🇸" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
];

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

// Phone number validation utility
const validatePhoneNumber = (countryCode, phoneNumber) => {
  if (!phoneNumber || phoneNumber.length < 7) {
    return { isValid: false, message: "Phone number must be at least 7 digits" };
  }
  
  // Remove any non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Basic length validation based on country code
  const minLength = countryCode === "+1" ? 10 : 7;
  const maxLength = countryCode === "+1" ? 10 : 15;
  
  if (cleanNumber.length < minLength || cleanNumber.length > maxLength) {
    return { 
      isValid: false, 
      message: `Phone number should be ${minLength}-${maxLength} digits for ${countryCode}` 
    };
  }
  
  return { isValid: true, message: "" };
};

// Phone input component
const PhoneInput = ({ 
  countryCode, 
  setCountryCode, 
  phoneNumber, 
  setPhoneNumber, 
  label, 
  placeholder = "1234567890",
  required = false,
  disabled = false 
}) => {
  const [error, setError] = useState("");

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    setPhoneNumber(value);
    
    if (value) {
      const validation = validatePhoneNumber(countryCode, value);
      setError(validation.isValid ? "" : validation.message);
    } else {
      setError("");
    }
  };

  return (
    <div className="flex flex-col space-y-1 sm:space-y-2">
      <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center">
        <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-400" />
        {label} {required && <span className="text-purple-400 ml-1">*</span>}
      </label>
      <div className="flex space-x-2">
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="p-2 sm:p-3 md:p-4 bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all text-sm sm:text-base w-32 sm:w-36"
          disabled={disabled}
        >
          {countryCodes.map(({ code, country, flag }) => (
            <option key={code} value={code} className="bg-gray-800">
              {flag} {code} {country}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder={placeholder}
          className={`flex-1 p-2 sm:p-3 md:p-4 bg-gray-900/70 backdrop-blur-sm border ${
            error ? 'border-red-500' : 'border-gray-700'
          } rounded-lg shadow-inner focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all text-sm sm:text-base`}
          disabled={disabled}
          maxLength={15}
        />
      </div>
      {error && (
        <p className="text-red-400 text-xs sm:text-sm mt-1">{error}</p>
      )}
      <p className="text-gray-500 text-xs">
        Full number: {countryCode}{phoneNumber ? phoneNumber : placeholder}
      </p>
    </div>
  );
};

const CallInitiator = () => {
  // Recipient phone number state
  const [recipientCountryCode, setRecipientCountryCode] = useState("+1");
  const [recipientPhoneNumber, setRecipientPhoneNumber] = useState("");
  
  // Other recipient details
  const [nameOrOrganization, setNameOfOrganization] = useState("");
  const [objective, setObjective] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [language, setLanguage] = useState("auto");
  
  // Caller details state
  const [callerCountryCode, setCallerCountryCode] = useState("+1");
  const [callerPhoneNumber, setCallerPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Current tab state
  const [activeTab, setActiveTab] = useState("who");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (setter) => (e) => setter(e.target.value);

  // Validation for first tab
  const validateFirstTab = () => {
    if (!recipientPhoneNumber || !objective) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in phone number and objective before proceeding.",
        duration: 5000,
        className: "bg-white text-red-700 font-semibold",
      });
      return false;
    }

    const phoneValidation = validatePhoneNumber(recipientCountryCode, recipientPhoneNumber);
    if (!phoneValidation.isValid) {
      toast({
        title: "Invalid Phone Number",
        description: phoneValidation.message,
        duration: 5000,
        className: "bg-white text-red-700 font-semibold",
      });
      return false;
    }

    return true;
  };

  // Validation for second tab
  const validateSecondTab = () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please provide your email address.",
        duration: 5000,
        className: "bg-white text-red-700 font-semibold",
      });
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please provide a valid email address.",
        duration: 5000,
        className: "bg-white text-red-700 font-semibold",
      });
      return false;
    }

    // Validate caller phone number if provided
    if (callerPhoneNumber) {
      const phoneValidation = validatePhoneNumber(callerCountryCode, callerPhoneNumber);
      if (!phoneValidation.isValid) {
        toast({
          title: "Invalid Caller Phone Number",
          description: phoneValidation.message,
          duration: 5000,
          className: "bg-white text-red-700 font-semibold",
        });
        return false;
      }
    }

    return true;
  };

  const handleNextTab = () => {
    if (validateFirstTab()) {
      setActiveTab("contact");
    }
  };

  const handleMakeCall = async () => {
    if (!validateSecondTab()) return;

    setIsLoading(true);
    try {
      // Concatenate country code and phone numbers
      const fullRecipientPhone = `${recipientCountryCode}${recipientPhoneNumber}`;
      const fullCallerPhone = callerPhoneNumber ? `${callerCountryCode}${callerPhoneNumber}` : "";

      const backendUrl = "http://localhost:8000/api/assistant-initiate-call";
      
      const requestData = {
        objective: objective.trim(),
        context: additionalInfo.trim(),
        caller_number: fullCallerPhone,
        caller_name: name.trim() || "AI Assistant User",
        caller_email: email.trim(),
        language_code: language,
        phone_number: fullRecipientPhone,
        name_of_org: nameOrOrganization.trim() || "AI Call Service",
      };

      console.log("Making call with payload:", requestData);
      
      const response = await axios.post(backendUrl, requestData);
      console.log("API Response:", response.data);

      if (response.data.call_sid) {
        navigate("/sender/initiate-call/call-status", {
          state: {
            ssid: response.data.call_sid,
            isInitiated: true,
            to_number: fullRecipientPhone,
            email: email.trim(),
            objective: objective.trim(),
            context: additionalInfo.trim(),
            caller_number: fullCallerPhone,
            name_of_org: nameOrOrganization.trim() || "AI Call Service",
          },
        });

        toast({
          title: "Call Initiated Successfully!",
          description: `Calling ${fullRecipientPhone}. You'll receive updates at ${email}`,
          duration: 5000,
          className: "bg-white text-green-600 font-semibold",
        });
      } else {
        throw new Error("No call_sid received from server");
      }
    } catch (error) {
      console.error("Failed to initiate call:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Unknown error occurred";
      toast({
        title: "Call Failed",
        description: `Failed to initiate the call: ${errorMessage}`,
        duration: 8000,
        className: "bg-white text-red-700 font-semibold",
      });
    } finally {
      setIsLoading(false);
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
                  disabled={!recipientPhoneNumber || !objective}
                >
                  <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Your Details
                </TabsTrigger>
              </TabsList>

              {/* First tab content - Recipient Details */}
              <TabsContent value="who" className="space-y-4 sm:space-y-6 px-1 sm:px-2">
                <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 bg-black/90">
                  
                  {/* Recipient Phone Number */}
                  <PhoneInput
                    countryCode={recipientCountryCode}
                    setCountryCode={setRecipientCountryCode}
                    phoneNumber={recipientPhoneNumber}
                    setPhoneNumber={setRecipientPhoneNumber}
                    label="Recipient Phone Number"
                    placeholder="1234567890"
                    required={true}
                  />

                  {/* Organization Name */}
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

                  {/* Objective */}
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

                  {/* Additional Information */}
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
                      className="p-2 sm:p-3 md:p-4 bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white min-h-[80px] sm:min-h-[100px] md:min-h-[120px] transition-all text-sm sm:text-base resize-none"
                    />
                  </div>

                  <div className="flex justify-center mt-4 sm:mt-6">
                    <InteractiveHoverButton 
                      onClick={handleNextTab}
                      className="border-purple-500/50 bg-black/40 text-white py-2 sm:py-3 px-6 sm:px-8 text-sm sm:text-base md:text-lg tracking-wide shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-500"
                      disabled={!recipientPhoneNumber || !objective}
                    >
                      Continue 
                    </InteractiveHoverButton>
                  </div>
                </div>
              </TabsContent>

          {/* Second   tab content - Your Details */}
              <TabsContent value="contact" className="space-y-4 sm:space-y-6 px-1 sm:px-2">
                <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
                  
                  {/* Email */}
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

                  {/* Your Name */}
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

                  {/* Your Phone Number */}
                  <PhoneInput
                    countryCode={callerCountryCode}
                    setCountryCode={setCallerCountryCode}
                    phoneNumber={callerPhoneNumber}
                    setPhoneNumber={setCallerPhoneNumber}
                    label="Your Phone Number (Optional)"
                    placeholder="1234567890"
                    disabled={isLoading}
                  />

                  {/* Language Selection */}
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

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6">
                    <Button
                      onClick={() => setActiveTab("who")}
                      className="flex-1 py-2 sm:py-4 md:py-6 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center gap-2 transition-all text-sm sm:text-base font-medium"
                      disabled={isLoading}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </Button>
                    
                    <Button
                      onClick={handleMakeCall}
                      className="flex-1 py-2 sm:py-4 md:py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-purple-500/20 text-sm sm:text-base font-medium"
                      disabled={isLoading || !email}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Make Call
                          <Phone className="w-4 h-4" />
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
      
      {/* Styles */}
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
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(1deg); }
          75% { transform: rotate(-1deg); }
        }
      `}</style>
      
      <Toaster />
    </div>
  );
};

export default CallInitiator;