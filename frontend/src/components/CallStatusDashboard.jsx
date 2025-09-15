// import { useState, useEffect, useCallback, useMemo } from "react";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Toaster } from "@/components/ui/toaster";
// import { useToast } from "@/hooks/use-toast";
// import { Loader2 } from "lucide-react";

// // Constants - Updated to match backend structure
// const BACKEND_URLS = {
//   INITIATE_CALL: "http://localhost:8000/api/assistant-initiate-call",
//   END_CALL: "http://localhost:8000/api/end-call",
//   CALL_STATUS: "http://localhost:8000/api/call-status",
//   WEBSOCKET: "ws://localhost:8000/api/ws/live-transcript", // Fixed WebSocket URL
// };

// const ANIMATION_VARIANTS = {
//   fadeIn: { opacity: 0, y: 20 },
//   fadeInVisible: { opacity: 1, y: 0 },
//   slideInLeft: { opacity: 0, x: -50 },
//   slideInRight: { opacity: 0, x: 50 },
//   visible: { opacity: 1, x: 0 }
// };

// // Components remain the same...
// const HeaderMessage = () => (
//   <motion.div
//     className="bg-transparent mt-10 p-6 rounded-lg shadow-md border hover:shadow-md"
//     initial={ANIMATION_VARIANTS.fadeIn}
//     animate={ANIMATION_VARIANTS.fadeInVisible}
//     transition={{ delay: 0.2, duration: 0.5 }}
//   >
//     <motion.h3
//       className="mt-2 text-gray-500 text-lg"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ delay: 0.4 }}
//     >
//       <span className="font-bold text-lg">💡Note: </span>
//       Feel free to close this browser. A summary of the call will be sent to you over email.
//     </motion.h3>
//   </motion.div>
// );

// const CallStatusCard = ({ callStatus, connectionStatus }) => (
//   <motion.div
//     className="w-full lg:w-1/2 bg-black ring-1 border rounded-lg shadow-lg p-6"
//     initial={ANIMATION_VARIANTS.slideInLeft}
//     animate={ANIMATION_VARIANTS.visible}
//     transition={{ duration: 0.8 }}
//   >
//     <h2 className="text-2xl font-bold text-purple-600 mb-4">Call Status</h2>
    
//     {/* Connection Status Indicator */}
//     <div className={`mb-4 p-2 rounded-lg ${connectionStatus === 'connected' ? 'bg-green-900 text-green-200' : 
//       connectionStatus === 'connecting' ? 'bg-yellow-900 text-yellow-200' : 'bg-red-900 text-red-200'}`}>
//       <span className="text-sm">
//         WebSocket: {connectionStatus === 'connected' ? '🟢 Connected' : 
//           connectionStatus === 'connecting' ? '🟡 Connecting...' : '🔴 Disconnected'}
//       </span>
//     </div>

//     {callStatus.isInitiated ? (
//       <div className="text-lg text-green-600 font-semibold">
//         ✅ Call Initiated Successfully!
//         <div className="mt-2 space-y-1">
//           <p className="text-gray-400">
//             <strong>Call ID:</strong> {callStatus.ssid || "N/A"}
//           </p>
//           <p className="text-gray-400">
//             <strong>Phone Number:</strong> {callStatus.to_number || "N/A"}
//           </p>
//           <p className="text-gray-400">
//             <strong>Organization:</strong> {callStatus.name_of_org || "N/A"}
//           </p>
//         </div>
//       </div>
//     ) : (
//       <div className="text-lg text-red-500 font-semibold">Call not initiated or terminated.</div>
//     )}
//   </motion.div>
// );

// const TranscriptItem = ({ transcript, index }) => (
//   <motion.div
//     key={`transcript-${index}`}
//     className="p-3 mb-3 rounded-md bg-gray-800 text-slate-200 border-l-4 border-purple-500"
//     initial={ANIMATION_VARIANTS.fadeIn}
//     animate={ANIMATION_VARIANTS.fadeInVisible}
//     transition={{ duration: 0.3 }}
//   >
//     <div className="whitespace-pre-wrap">{transcript}</div>
//   </motion.div>
// );

// const LiveTranscript = ({ transcriptArray, showTranscript }) => {
//   const displayTranscript = useMemo(() => {
//     if (transcriptArray.length === 0) {
//       return (
//         <div className="text-gray-500 text-center py-8">
//           <div className="animate-pulse">Waiting for conversation to begin...</div>
//         </div>
//       );
//     }
    
//     return transcriptArray.map((transcript, index) => (
//       <TranscriptItem key={`transcript-${index}`} transcript={transcript} index={index} />
//     ));
//   }, [transcriptArray]);

//   // Auto-scroll to bottom when new transcript arrives
//   const scrollRef = useCallback(node => {
//     if (node && transcriptArray.length > 0) {
//       node.scrollTop = node.scrollHeight;
//     }
//   }, [transcriptArray.length]);

//   return (
//     <motion.div
//       className="w-full lg:w-1/2 bg-black ring-1 border rounded-lg shadow-lg p-6"
//       initial={ANIMATION_VARIANTS.slideInRight}
//       animate={ANIMATION_VARIANTS.visible}
//       transition={{ duration: 0.8 }}
//     >
//       <h2 className="text-2xl font-bold text-purple-600 mb-4">
//         Live Transcript
//         {transcriptArray.length > 0 && (
//           <span className="text-sm text-gray-400 ml-2">({transcriptArray.length} messages)</span>
//         )}
//       </h2>
//       {showTranscript && (
//         <div 
//           ref={scrollRef}
//           className="rounded-md bg-gray-900 text-slate-200 ring-1 max-h-96 overflow-y-auto p-4 space-y-2"
//         >
//           {displayTranscript}
//         </div>
//       )}
//     </motion.div>
//   );
// };

// // Updated WebSocket hook with better error handling and reconnection
// const useWebSocket = (callStatus, setTranscriptArray, setIsCallEnded, toast, setConnectionStatus) => {
//   useEffect(() => {
//     if (!callStatus.isInitiated || !callStatus.ssid) return;

//     let ws = null;
//     let reconnectAttempts = 0;
//     const maxReconnectAttempts = 5;
//     let reconnectTimer = null;

//     const connectWebSocket = () => {
//       try {
//         setConnectionStatus('connecting');
//         ws = new WebSocket(BACKEND_URLS.WEBSOCKET);
        
//         ws.onopen = () => {
//           console.log("WebSocket connected successfully");
//           setConnectionStatus('connected');
//           reconnectAttempts = 0;
          
//           // Send initial message with call_sid
//           const initMessage = {
//             event: "start",
//             call_sid: callStatus.ssid
//           };
//           ws.send(JSON.stringify(initMessage));
//         };

//         ws.onmessage = (event) => {
//           try {
//             const data = JSON.parse(event.data);
//             console.log("WebSocket message received:", data);
            
//             switch (data.event) {
//               case "connected":
//                 console.log(`Connected to monitor call: ${data.call_id}`);
//                 break;
                
//               case "ping":
//                 // Keep connection alive
//                 break;
                
//               case "call_status":
//                 console.log(`Call status: ${data.status}`);
//                 if (data.status === "completed") {
//                   setIsCallEnded(true);
//                 }
//                 break;
                
//               case "call_ended":
//                 handleCallEnded(data);
//                 break;
                
//               case "call_in_process":
//                 if (data.transcription) {
//                   handleTranscription(data.transcription);
//                 }
//                 break;
                
//               case "error":
//                 console.error("WebSocket error:", data.message);
//                 toast({
//                   title: "Connection Error",
//                   description: data.message,
//                   duration: 5000,
//                   className: "bg-white text-red-600 font-semibold",
//                 });
//                 break;
//             }
//           } catch (error) {
//             console.error("Error parsing WebSocket message:", error);
//           }
//         };

//         ws.onclose = (event) => {
//           console.log("WebSocket disconnected:", event.code, event.reason);
//           setConnectionStatus('disconnected');
          
//           // Attempt to reconnect if call is still active
//           if (callStatus.isInitiated && reconnectAttempts < maxReconnectAttempts) {
//             const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000); // Exponential backoff
//             reconnectTimer = setTimeout(() => {
//               reconnectAttempts++;
//               console.log(`Reconnection attempt ${reconnectAttempts}/${maxReconnectAttempts}`);
//               connectWebSocket();
//             }, delay);
//           } else if (reconnectAttempts >= maxReconnectAttempts) {
//             toast({
//               title: "Connection Lost",
//               description: "Unable to maintain connection to live transcript. Please refresh the page.",
//               duration: 10000,
//               className: "bg-white text-red-600 font-semibold",
//             });
//           }
//         };

//         ws.onerror = (error) => {
//           console.error("WebSocket error:", error);
//           setConnectionStatus('error');
//         };

//       } catch (error) {
//         console.error("Failed to create WebSocket connection:", error);
//         setConnectionStatus('error');
//       }
//     };

//     const handleCallEnded = (data) => {
//       console.log("Call ended:", data);
//       setIsCallEnded(true);
      
//       const emailStatus = data.email_send;
//       toast({
//         title: "Call Ended",
//         description: emailStatus
//           ? `Call completed! Duration: ${data.call_duration} minutes. Transcript sent to ${callStatus.email}`
//           : `Call ended but failed to send transcript to ${callStatus.email}`,
//         duration: 20000,
//         className: emailStatus
//           ? "bg-white text-green-600 font-semibold"
//           : "bg-white text-red-500 font-semibold",
//       });
      
//       // Close WebSocket
//       if (ws) {
//         ws.close();
//       }
//     };

//     const handleTranscription = (transcription) => {
//       const timestamp = new Date().toLocaleTimeString();
//       const formattedTranscript = `[${timestamp}] ${transcription}`;
      
//       setTranscriptArray(prev => {
//         // Avoid duplicates
//         if (prev[prev.length - 1] !== formattedTranscript) {
//           return [...prev, formattedTranscript];
//         }
//         return prev;
//       });
//     };

//     connectWebSocket();

//     return () => {
//       console.log("Cleaning up WebSocket connection");
//       if (reconnectTimer) {
//         clearTimeout(reconnectTimer);
//       }
//       if (ws) {
//         ws.close();
//       }
//       setConnectionStatus('disconnected');
//     };
//   }, [callStatus.isInitiated, callStatus.ssid, callStatus.email, setTranscriptArray, setIsCallEnded, toast, setConnectionStatus]);
// };

// // Main component with additional state for connection status
// function CallStatusDashboard() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   // State management
//   const [callStatus, setCallStatus] = useState(location?.state || {});
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSatisfied, setIsSatisfied] = useState(null);
//   const [objective, setObjective] = useState(callStatus.objective || "");
//   const [transcriptArray, setTranscriptArray] = useState([]);
//   const [showTranscript, setShowTranscript] = useState(false);
//   const [isCallEnded, setIsCallEnded] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState('disconnected');

//   console.log("Call Status at dashboard page:", callStatus);

//   // Custom hook for WebSocket
//   useWebSocket(callStatus, setTranscriptArray, setIsCallEnded, toast, setConnectionStatus);

//   // Rest of the handlers remain similar but with improved error handling...
  
//   const handleMakeCall = useCallback(async () => {
//     // Validation logic remains the same...
    
//     setIsLoading(true);
//     try {
//       const requestData = {
//         objective: objective.trim(),
//         context: callStatus.context,
//         caller_number: callStatus.caller_number,
//         caller_name: callStatus.caller_name || "Assistant",
//         caller_email: callStatus.email,
//         phone_number: callStatus.to_number,
//         language_code: callStatus.language_code || "en",
//         name_of_org: callStatus.name_of_org,
//       };

//       console.log("Making call with data:", requestData);
//       const response = await axios.post(BACKEND_URLS.INITIATE_CALL, requestData);

//       if (response.data.call_sid) {
//         const newCallStatus = {
//           ssid: response.data.call_sid,
//           isInitiated: true,
//           ...callStatus,
//           objective: objective.trim(),
//         };

//         setCallStatus(newCallStatus);
//         setIsCallEnded(false);
//         setShowTranscript(true);
//         setTranscriptArray([]);
//         setIsSatisfied(null);
        
//         toast({
//           title: "Call Initiated",
//           description: "Call has been started successfully!",
//           duration: 5000,
//           className: "bg-white text-green-600 font-semibold",
//         });
//       }
//     } catch (error) {
//       console.error("Failed to initiate call:", error);
//       const errorMessage = error.response?.data?.detail || error.message || "Unknown error occurred";
//       toast({
//         title: "Error",
//         description: `Failed to initiate call: ${errorMessage}`,
//         duration: 5000,
//         className: "bg-white text-red-600 font-semibold",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [callStatus, objective, toast]);

//   // Rest of the component remains similar...
  
//   return (
//     <motion.div
//       className="container mx-auto p-6"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 1 }}
//     >
//       <HeaderMessage />
      
//       <div className="flex flex-col mt-10 lg:flex-row justify-between items-start lg:space-x-8 space-y-8 lg:space-y-0">
//         <CallStatusCard callStatus={callStatus} connectionStatus={connectionStatus} />
//         <LiveTranscript transcriptArray={transcriptArray} showTranscript={showTranscript} />
//       </div>

//      {callStatus.isInitiated && !isCallEnded && (
//         <div className="mt-8 bg-black ring-1 border rounded-lg shadow-lg p-6">
//           <button
//             className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
//             onClick={handleEndCall}
//           >
//             End Call
//           </button>
//         </div>
//       )}

//       {isCallEnded && (
//         <FeedbackSection
//           isSatisfied={isSatisfied}
//           setIsSatisfied={setIsSatisfied}
//           handleSatisfied={handleSatisfied}
//           objective={objective}
//           setObjective={setObjective}
//           handleMakeCall={handleMakeCall}
//           isLoading={isLoading}
//         />
//       )}

//       <Toaster
//         toastOptions={{
//           className: "bg-white-800 text-black",
//           duration: 5000,
//         }}
//       />
//     </motion.div>
//   );
// }

// export default CallStatusDashboard;











import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Constants - Updated to match backend structure
const BACKEND_URLS = {
  INITIATE_CALL: "http://localhost:8000/api/assistant-initiate-call",
  END_CALL: "http://localhost:8000/api/end-call",
  CALL_STATUS: "http://localhost:8000/api/call-status",
  WEBSOCKET: "ws://localhost:8000/api/ws/live-transcript",
};

const ANIMATION_VARIANTS = {
  fadeIn: { opacity: 0, y: 20 },
  fadeInVisible: { opacity: 1, y: 0 },
  slideInLeft: { opacity: 0, x: -50 },
  slideInRight: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 }
};

// Connection status types
const CONNECTION_STATUS = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error'
};

// Header Message Component
const HeaderMessage = () => (
  <motion.div
    className="bg-transparent mt-10 p-6 rounded-lg shadow-md border hover:shadow-md"
    initial={ANIMATION_VARIANTS.fadeIn}
    animate={ANIMATION_VARIANTS.fadeInVisible}
    transition={{ delay: 0.2, duration: 0.5 }}
  >
    <motion.h3
      className="mt-2 text-gray-500 text-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <span className="font-bold text-lg">💡Note: </span>
      Feel free to close this browser. A summary of the call will be sent to you over email.
    </motion.h3>
  </motion.div>
);

// Call Status Card Component
const CallStatusCard = ({ callStatus, connectionStatus }) => {
  const getConnectionStatusDisplay = () => {
    switch (connectionStatus) {
      case CONNECTION_STATUS.CONNECTED:
        return { icon: '🟢', text: 'Connected', bgColor: 'bg-green-900 text-green-200' };
      case CONNECTION_STATUS.CONNECTING:
        return { icon: '🟡', text: 'Connecting...', bgColor: 'bg-yellow-900 text-yellow-200' };
      case CONNECTION_STATUS.ERROR:
        return { icon: '🔴', text: 'Connection Error', bgColor: 'bg-red-900 text-red-200' };
      default:
        return { icon: '⚫', text: 'Disconnected', bgColor: 'bg-gray-900 text-gray-200' };
    }
  };

  const statusDisplay = getConnectionStatusDisplay();

  return (
    <motion.div
      className="w-full lg:w-1/2 bg-black ring-1 border rounded-lg shadow-lg p-6"
      initial={ANIMATION_VARIANTS.slideInLeft}
      animate={ANIMATION_VARIANTS.visible}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-bold text-purple-600 mb-4">Call Status</h2>
      
      {/* Connection Status Indicator */}
      <div className={`mb-4 p-2 rounded-lg ${statusDisplay.bgColor}`}>
        <span className="text-sm font-medium">
          {statusDisplay.icon} WebSocket: {statusDisplay.text}
        </span>
      </div>

      {callStatus.isInitiated ? (
        <div className="text-lg text-green-600 font-semibold">
          ✅ Call Initiated Successfully!
          <div className="mt-3 space-y-2">
            <p className="text-gray-400">
              <strong>Call ID:</strong> {callStatus.ssid || "N/A"}
            </p>
            <p className="text-gray-400">
              <strong>Phone Number:</strong> {callStatus.to_number || "N/A"}
            </p>
            <p className="text-gray-400">
              <strong>Organization:</strong> {callStatus.name_of_org || "N/A"}
            </p>
            <p className="text-gray-400">
              <strong>Email:</strong> {callStatus.email || "N/A"}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-lg text-red-500 font-semibold">
          Call not initiated or terminated.
        </div>
      )}
    </motion.div>
  );
};

// Individual Transcript Item Component
const TranscriptItem = ({ transcript, index }) => (
  <motion.div
    key={`transcript-${index}`}
    className="p-3 mb-3 rounded-md bg-gray-800 text-slate-200 border-l-4 border-purple-500"
    initial={ANIMATION_VARIANTS.fadeIn}
    animate={ANIMATION_VARIANTS.fadeInVisible}
    transition={{ duration: 0.3 }}
  >
    <div className="whitespace-pre-wrap break-words">{transcript}</div>
  </motion.div>
);

// Live Transcript Component
const LiveTranscript = ({ transcriptArray, showTranscript, isCallEnded }) => {
  const displayTranscript = useMemo(() => {
    if (transcriptArray.length === 0) {
      return (
        <div className="text-gray-500 text-center py-8">
          <div className="animate-pulse">
            {isCallEnded ? "No transcript available" : "Waiting for conversation to begin..."}
          </div>
        </div>
      );
    }
    
    return transcriptArray.map((transcript, index) => (
      <TranscriptItem key={`transcript-${index}`} transcript={transcript} index={index} />
    ));
  }, [transcriptArray, isCallEnded]);

  // Auto-scroll to bottom when new transcript arrives
  const scrollRef = useCallback(node => {
    if (node && transcriptArray.length > 0) {
      setTimeout(() => {
        node.scrollTop = node.scrollHeight;
      }, 100);
    }
  }, [transcriptArray.length]);

  return (
    <motion.div
      className="w-full lg:w-1/2 bg-black ring-1 border rounded-lg shadow-lg p-6"
      initial={ANIMATION_VARIANTS.slideInRight}
      animate={ANIMATION_VARIANTS.visible}
      transition={{ duration: 0.8 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-purple-600">
          Live Transcript
        </h2>
        {transcriptArray.length > 0 && (
          <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded">
            {transcriptArray.length} messages
          </span>
        )}
      </div>
      
      {showTranscript && (
        <div 
          ref={scrollRef}
          className="rounded-md bg-gray-900 text-slate-200 ring-1 max-h-96 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800"
        >
          {displayTranscript}
        </div>
      )}
    </motion.div>
  );
};

// Feedback Section Component
const FeedbackSection = ({ 
  isSatisfied, 
  setIsSatisfied, 
  handleSatisfied, 
  objective, 
  setObjective, 
  handleMakeCall, 
  isLoading 
}) => (
  <motion.div
    className="mt-8 bg-black ring-1 border rounded-lg shadow-lg p-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    <h2 className="text-2xl font-bold text-purple-600 mb-4">Feedback</h2>
    
    {isSatisfied === null ? (
      <div>
        <p className="text-lg text-gray-400 mb-4">
          Are you satisfied with the call experience?
        </p>
        <div className="flex space-x-4">
          <button
            className="bg-purple-600 hover:ring-1 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            onClick={() => {
              setIsSatisfied(true);
              handleSatisfied();
            }}
          >
            ✅ Satisfied
          </button>
          <button
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 hover:ring-1 transition-colors font-semibold"
            onClick={() => setIsSatisfied(false)}
          >
            ❌ Not Satisfied
          </button>
        </div>
      </div>
    ) : !isSatisfied ? (
      <div className="space-y-4">
        <p className="text-lg text-gray-400">
          Would you like to update your objective before making another call?
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Updated Objective:
          </label>
          <textarea
            className="w-full p-3 border border-gray-600 rounded-lg text-black resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter updated objective (optional)..."
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            rows={4}
          />
        </div>
        <button
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          onClick={handleMakeCall}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              AI is firing up. Hold steady!
            </div>
          ) : (
            "🔄 Update Objective and Recall!"
          )}
        </button>
      </div>
    ) : null}
  </motion.div>
);

// Enhanced WebSocket hook with better error handling and reconnection
const useWebSocket = (callStatus, setTranscriptArray, setIsCallEnded, toast, setConnectionStatus) => {
  useEffect(() => {
    if (!callStatus.isInitiated || !callStatus.ssid) {
      setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
      return;
    }

    let ws = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    let reconnectTimer = null;
    let pingTimer = null;

    const connectWebSocket = () => {
      try {
        setConnectionStatus(CONNECTION_STATUS.CONNECTING);
        ws = new WebSocket(BACKEND_URLS.WEBSOCKET);
        
        ws.onopen = () => {
          console.log("WebSocket connected successfully");
          setConnectionStatus(CONNECTION_STATUS.CONNECTED);
          reconnectAttempts = 0;
          
          // Send initial message with call_sid
          const initMessage = {
            event: "start",
            call_sid: callStatus.ssid
          };
          ws.send(JSON.stringify(initMessage));

          // Start ping timer to keep connection alive
          pingTimer = setInterval(() => {
            if (ws && ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ event: "ping" }));
            }
          }, 30000); // Ping every 30 seconds
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("WebSocket message received:", data);
            
            switch (data.event) {
              case "connected":
                console.log(`Connected to monitor call: ${data.call_id}`);
                toast({
                  title: "Connected",
                  description: "Live transcript connection established",
                  duration: 3000,
                  className: "bg-white text-green-600 font-semibold",
                });
                break;
                
              case "ping":
                // Keep connection alive - no action needed
                break;
                
              case "call_status":
                console.log(`Call status: ${data.status}`);
                if (data.status === "completed" || data.status === "ended") {
                  setIsCallEnded(true);
                }
                break;
                
              case "call_ended":
                handleCallEnded(data);
                break;
                
              case "call_in_process":
                if (data.transcription && data.transcription.trim()) {
                  handleTranscription(data.transcription);
                }
                break;
                
              case "error":
                console.error("WebSocket error:", data.message);
                setConnectionStatus(CONNECTION_STATUS.ERROR);
                toast({
                  title: "Connection Error",
                  description: data.message,
                  duration: 5000,
                  className: "bg-white text-red-600 font-semibold",
                });
                break;

              default:
                console.log("Unknown WebSocket event:", data.event);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        ws.onclose = (event) => {
          console.log("WebSocket disconnected:", event.code, event.reason);
          setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
          
          // Clear ping timer
          if (pingTimer) {
            clearInterval(pingTimer);
            pingTimer = null;
          }
          
          // Attempt to reconnect if call is still active
          if (callStatus.isInitiated && !event.wasClean && reconnectAttempts < maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000); // Exponential backoff
            reconnectTimer = setTimeout(() => {
              reconnectAttempts++;
              console.log(`Reconnection attempt ${reconnectAttempts}/${maxReconnectAttempts}`);
              toast({
                title: "Reconnecting...",
                description: `Attempt ${reconnectAttempts}/${maxReconnectAttempts}`,
                duration: 3000,
                className: "bg-white text-yellow-600 font-semibold",
              });
              connectWebSocket();
            }, delay);
          } else if (reconnectAttempts >= maxReconnectAttempts) {
            setConnectionStatus(CONNECTION_STATUS.ERROR);
            toast({
              title: "Connection Lost",
              description: "Unable to maintain connection to live transcript. Please refresh the page.",
              duration: 10000,
              className: "bg-white text-red-600 font-semibold",
            });
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setConnectionStatus(CONNECTION_STATUS.ERROR);
        };

      } catch (error) {
        console.error("Failed to create WebSocket connection:", error);
        setConnectionStatus(CONNECTION_STATUS.ERROR);
        toast({
          title: "Connection Failed",
          description: "Unable to establish WebSocket connection",
          duration: 5000,
          className: "bg-white text-red-600 font-semibold",
        });
      }
    };

    const handleCallEnded = (data) => {
      console.log("Call ended:", data);
      setIsCallEnded(true);
      
      const emailStatus = data.email_send !== false; // Default to true if not specified
      const duration = data.call_duration || "Unknown";
      
      toast({
        title: "Call Ended",
        description: emailStatus
          ? `Call completed! Duration: ${duration} minutes. Transcript sent to ${callStatus.email}`
          : `Call ended but failed to send transcript to ${callStatus.email}`,
        duration: 20000,
        className: emailStatus
          ? "bg-white text-green-600 font-semibold"
          : "bg-white text-red-500 font-semibold",
      });
      
      // Close WebSocket gracefully
      if (ws) {
        ws.close(1000, "Call ended");
      }
    };

    const handleTranscription = (transcription) => {
      const timestamp = new Date().toLocaleTimeString();
      const formattedTranscript = `[${timestamp}] ${transcription}`;
      
      setTranscriptArray(prev => {
        // Avoid duplicates by checking if the last transcript is the same
        const lastTranscript = prev[prev.length - 1];
        if (lastTranscript !== formattedTranscript) {
          return [...prev, formattedTranscript];
        }
        return prev;
      });
    };

    connectWebSocket();

    return () => {
      console.log("Cleaning up WebSocket connection");
      
      // Clear timers
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (pingTimer) {
        clearInterval(pingTimer);
      }
      
      // Close WebSocket
      if (ws) {
        ws.close(1000, "Component unmounting");
      }
      
      setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
    };
  }, [callStatus.isInitiated, callStatus.ssid, callStatus.email, setTranscriptArray, setIsCallEnded, toast, setConnectionStatus]);
};

// Main CallStatusDashboard Component
function CallStatusDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State management
  const [callStatus, setCallStatus] = useState(location?.state || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isSatisfied, setIsSatisfied] = useState(null);
  const [objective, setObjective] = useState(callStatus.objective || "");
  const [transcriptArray, setTranscriptArray] = useState([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATUS.DISCONNECTED);

  console.log("Call Status at dashboard page:", callStatus);

  // Custom hook for WebSocket management
  useWebSocket(callStatus, setTranscriptArray, setIsCallEnded, toast, setConnectionStatus);

  // Validation function
  const validateCallData = useCallback(() => {
    const requiredFields = {
      to_number: callStatus.to_number || callStatus.phone_number,
      email: callStatus.email || callStatus.caller_email,
      context: callStatus.context,
    };
    
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || value.trim() === '')
      .map(([key]) => key);
    
    if (missingFields.length > 0 || !objective.trim()) {
      const missingFieldsText = missingFields.join(', ');
      const objectiveMissing = !objective.trim() ? 'objective' : '';
      const allMissing = [missingFieldsText, objectiveMissing].filter(Boolean).join(', ');
      
      toast({
        title: "Validation Error",
        description: `Missing required fields: ${allMissing}`,
        duration: 5000,
        className: "bg-white text-red-500 font-semibold",
      });
      return false;
    }
    return true;
  }, [callStatus, objective, toast]);

  // Event handlers
  const handleSatisfied = useCallback(() => {
    toast({
      title: "Thank You!",
      description: "Your feedback has been recorded. Returning to home.",
      duration: 3000,
      className: "bg-white text-green-600 font-semibold",
    });
    setTimeout(() => navigate("/"), 1000);
  }, [navigate, toast]);

  const handleEndCall = useCallback(async () => {
    if (!callStatus.ssid) {
      toast({
        title: "Error",
        description: "No active call to end",
        duration: 5000,
        className: "bg-white text-red-600 font-semibold",
      });
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URLS.END_CALL}/${callStatus.ssid}`);

      if (response.status === 200) {
        setIsCallEnded(true);
        toast({
          title: "Call Ending",
          description: "Call is being terminated...",
          duration: 5000,
          className: "bg-white text-orange-600 font-semibold",
        });
      }
    } catch (error) {
      console.error("Error ending call:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Unknown error";
      toast({
        title: "Error",
        description: `Failed to end the call: ${errorMessage}`,
        duration: 5000,
        className: "bg-white text-red-600 font-semibold",
      });
    }
  }, [callStatus.ssid, toast]);

  const handleMakeCall = useCallback(async () => {
    if (!validateCallData()) {
      navigate("/sender/");
      return;
    }

    setIsLoading(true);
    try {
      const requestData = {
        objective: objective.trim(),
        context: callStatus.context,
        caller_number: callStatus.caller_number,
        caller_name: callStatus.caller_name || callStatus.name_of_org || "AI Assistant",
        caller_email: callStatus.email || callStatus.caller_email,
        phone_number: callStatus.to_number || callStatus.phone_number,
        language_code: callStatus.language_code || "en",
        name_of_org: callStatus.name_of_org || "AI Call Service",
      };

      console.log("Making call with data:", requestData);
      const response = await axios.post(BACKEND_URLS.INITIATE_CALL, requestData);

      if (response.data.call_sid) {
        const newCallStatus = {
          ssid: response.data.call_sid,
          isInitiated: true,
          to_number: requestData.phone_number,
          email: requestData.caller_email,
          objective: objective.trim(),
          context: callStatus.context,
          caller_number: requestData.caller_number,
          name_of_org: requestData.name_of_org,
        };

        setCallStatus(newCallStatus);
        setIsCallEnded(false);
        setShowTranscript(true);
        setTranscriptArray([]);
        setIsSatisfied(null);
        
        toast({
          title: "Call Initiated",
          description: "Call has been started successfully! Connecting to live transcript...",
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
        description: `Failed to initiate call: ${errorMessage}`,
        duration: 8000,
        className: "bg-white text-red-600 font-semibold",
      });
    } finally {
      setIsLoading(false);
    }
  }, [callStatus, objective, validateCallData, navigate, toast]);

  // Effect to show transcript when call is initiated
  useEffect(() => {
    if (callStatus.isInitiated && !showTranscript) {
      setShowTranscript(true);
    }
  }, [callStatus.isInitiated, showTranscript]);

  return (
    <motion.div
      className="container mx-auto p-6 min-h-screen bg-gray-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <HeaderMessage />
      
      <div className="flex flex-col mt-10 lg:flex-row justify-between items-start lg:space-x-8 space-y-8 lg:space-y-0">
        <CallStatusCard 
          callStatus={callStatus} 
          connectionStatus={connectionStatus} 
        />
        <LiveTranscript 
          transcriptArray={transcriptArray} 
          showTranscript={showTranscript}
          isCallEnded={isCallEnded}
        />
      </div>

      {/* End Call Button */}
      {callStatus.isInitiated && !isCallEnded && (
        <motion.div
          className="mt-8 bg-black ring-1 border rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Call Controls</h3>
              <p className="text-gray-400 text-sm">
                The call is currently in progress. You can end it manually if needed.
              </p>
            </div>
            <button
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center space-x-2"
              onClick={handleEndCall}
            >
              <span>🔚</span>
              <span>End Call</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Feedback Section */}
      {isCallEnded && (
        <FeedbackSection
          isSatisfied={isSatisfied}
          setIsSatisfied={setIsSatisfied}
          handleSatisfied={handleSatisfied}
          objective={objective}
          setObjective={setObjective}
          handleMakeCall={handleMakeCall}
          isLoading={isLoading}
        />
      )}

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div
          className="mt-8 bg-gray-900 ring-1 border rounded-lg shadow-lg p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <h3 className="text-sm font-bold text-gray-400 mb-2">Debug Info</h3>
          <pre className="text-xs text-gray-500 overflow-x-auto">
            {JSON.stringify({
              isInitiated: callStatus.isInitiated,
              ssid: callStatus.ssid,
              connectionStatus,
              transcriptCount: transcriptArray.length,
              isCallEnded
            }, null, 2)}
          </pre>
        </motion.div>
      )}

      <Toaster
        toastOptions={{
          className: "bg-white text-black",
          duration: 5000,
        }}
      />
    </motion.div>
  );
}

export default CallStatusDashboard;