
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Updated backend URLs to match your new endpoints
const BACKEND_URLS = {
  INITIATE_CALL: "https://prakhar-ai-pdf.onrender.com/api/assistant-initiate-call",
  END_CALL: "https://prakhar-ai-pdf.onrender.com/api/end-call",
  CALL_STATUS: "https://prakhar-ai-pdf.onrender.com/api/call-status",
  WEBSOCKET: "wss://prakhar-ai-pdf.onrender.com/api/ws/live-transcript",
};

const ANIMATION_VARIANTS = {
  fadeIn: { opacity: 0, y: 20 },
  fadeInVisible: { opacity: 1, y: 0 },
  slideInLeft: { opacity: 0, x: -50 },
  slideInRight: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 }
};

// Updated connection status to match backend events
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
      <span className="font-bold text-lg">Note: </span>
      Feel free to close this browser. A summary of the call will be sent to you over email.
    </motion.h3>
  </motion.div>
);

// Enhanced Call Status Card with webhook status
const CallStatusCard = ({ callStatus, connectionStatus, callPhase }) => {
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

  const getCallPhaseDisplay = () => {
    switch (callPhase) {
      case 'initiated':
        return { icon: '📞', text: 'Call Initiated', color: 'text-blue-400' };
      case 'in_progress':
        return { icon: '🗣️', text: 'Call In Progress', color: 'text-green-400' };
      case 'completed':
        return { icon: '✅', text: 'Call Completed', color: 'text-green-600' };
      case 'failed':
        return { icon: '❌', text: 'Call Failed', color: 'text-red-500' };
      default:
        return { icon: '⏳', text: 'Waiting...', color: 'text-gray-400' };
    }
  };

  const statusDisplay = getConnectionStatusDisplay();
  const phaseDisplay = getCallPhaseDisplay();

  return (
    <motion.div
      className="w-full lg:w-1/2 bg-black ring-1 border rounded-lg shadow-lg p-6"
      initial={ANIMATION_VARIANTS.slideInLeft}
      animate={ANIMATION_VARIANTS.visible}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-bold text-purple-600 mb-4">Call Status</h2>
      
      {/* WebSocket Connection Status */}
      <div className={`mb-3 p-2 rounded-lg ${statusDisplay.bgColor}`}>
        <span className="text-sm font-medium">
          {statusDisplay.icon} WebSocket: {statusDisplay.text}
        </span>
      </div>

      {/* Call Phase Status */}
      <div className={`mb-4 p-2 rounded-lg bg-gray-800 ${phaseDisplay.color}`}>
        <span className="text-sm font-medium">
          {phaseDisplay.icon} Status: {phaseDisplay.text}
        </span>
      </div>

      {callStatus.isInitiated ? (
        <div className="text-lg text-green-600 font-semibold">
          Call Active
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
            {callStatus.webhook_configured && (
              <p className="text-green-400">
                <strong>Real-time Updates:</strong> Enabled
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-lg text-red-500 font-semibold">
          No active call
        </div>
      )}
    </motion.div>
  );
};

// Enhanced Transcript Item with speaker identification
const TranscriptItem = ({ transcript, index, speaker, timestamp, isPartial }) => (
  <motion.div
    key={`transcript-${index}`}
    className={`p-3 mb-3 rounded-md border-l-4 ${
      speaker === 'assistant' 
        ? 'bg-purple-900/30 border-purple-500 text-purple-100' 
        : 'bg-blue-900/30 border-blue-500 text-blue-100'
    } ${isPartial ? 'opacity-75 border-dashed' : ''}`}
    initial={ANIMATION_VARIANTS.fadeIn}
    animate={ANIMATION_VARIANTS.fadeInVisible}
    transition={{ duration: 0.3 }}
  >
    <div className="flex justify-between items-start mb-1">
      <span className="text-xs font-semibold uppercase tracking-wider">
        {speaker === 'assistant' ? '🤖 AI Assistant' : '👤 Human'}
      </span>
      {timestamp && (
        <span className="text-xs text-gray-400">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      )}
    </div>
    <div className="whitespace-pre-wrap break-words">
      {transcript}
      {isPartial && <span className="animate-pulse">...</span>}
    </div>
  </motion.div>
);

// Enhanced Live Transcript Component
const LiveTranscript = ({ transcriptArray, showTranscript, isCallEnded, callPhase }) => {
  const displayTranscript = useMemo(() => {
    if (transcriptArray.length === 0) {
      let message = "Waiting for conversation to begin...";
      
      if (callPhase === 'initiated') {
        message = "Call initiated. Waiting for answer...";
      } else if (callPhase === 'in_progress') {
        message = "Call in progress. Transcript will appear here...";
      } else if (isCallEnded) {
        message = "Call ended. No transcript available.";
      }
      
      return (
        <div className="text-gray-500 text-center py-8">
          <div className="animate-pulse">{message}</div>
        </div>
      );
    }
    
    return transcriptArray.map((item, index) => (
      <TranscriptItem 
        key={`transcript-${index}`} 
        transcript={item.text}
        speaker={item.speaker}
        timestamp={item.timestamp}
        isPartial={item.isPartial}
        index={index} 
      />
    ));
  }, [transcriptArray, isCallEnded, callPhase]);

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
        <div className="flex items-center space-x-2">
          {transcriptArray.length > 0 && (
            <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded">
              {transcriptArray.length} messages
            </span>
          )}
          {callPhase === 'in_progress' && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-red-500">LIVE</span>
            </div>
          )}
        </div>
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

// Enhanced WebSocket hook for webhook-driven updates
const useWebSocket = (callStatus, setTranscriptArray, setIsCallEnded, setCallPhase, toast, setConnectionStatus) => {
  useEffect(() => {
    if (!callStatus.isInitiated || !callStatus.ssid) {
      setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
      return;
    }

    let ws = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3;
    let reconnectTimer = null;
    let isConnected = false;

    const connectWebSocket = () => {
      // Prevent multiple connections
      if (ws && ws.readyState === WebSocket.OPEN) {
        console.log("WebSocket already connected, skipping...");
        return;
      }

      try {
        setConnectionStatus(CONNECTION_STATUS.CONNECTING);
        ws = new WebSocket(BACKEND_URLS.WEBSOCKET);
        
        ws.onopen = () => {
          console.log("WebSocket connected for webhook updates");
          setConnectionStatus(CONNECTION_STATUS.CONNECTED);
          reconnectAttempts = 0;
          isConnected = true;
          
          // Send initial connection message
          const initMessage = {
            event: "start",
            call_sid: callStatus.ssid
          };
          ws.send(JSON.stringify(initMessage));
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("Webhook WebSocket message:", data);
            
            // Handle all the webhook events as before...
            handleWebSocketMessage(data);
            
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        ws.onclose = (event) => {
          console.log("WebSocket closed:", event.code, event.reason);
          isConnected = false;
          setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
          
          // Only reconnect if it wasn't a clean close and call is still active
          if (!event.wasClean && callStatus.isInitiated && reconnectAttempts < maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 5000);
            reconnectTimer = setTimeout(() => {
              reconnectAttempts++;
              console.log(`Reconnection attempt ${reconnectAttempts}/${maxReconnectAttempts}`);
              connectWebSocket();
            }, delay);
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setConnectionStatus(CONNECTION_STATUS.ERROR);
        };

      } catch (error) {
        console.error("Failed to create WebSocket connection:", error);
        setConnectionStatus(CONNECTION_STATUS.ERROR);
      }
    };

    const handleWebSocketMessage = (data) => {
      switch (data.event) {
        case "connected":
          toast({
            title: "Connected",
            description: "Webhook updates active",
            duration: 3000,
            className: "bg-white text-green-600 font-semibold",
          });
          break;
        case "call_started":
          setCallPhase('in_progress');
          toast({
            title: "Call Started",
            description: "The call has been answered.",
            duration: 5000,
            className: "bg-white text-blue-600 font-semibold",
          });
          break;
        case "call_ended":
          setIsCallEnded(true);
          setCallPhase('completed');
          toast({
            title: "Call Ended",
            description: "The call has ended.",
            duration: 5000,
            className: "bg-white text-blue-600 font-semibold",
          });
          // Handle post-call transcript if present
          if (Array.isArray(data.final_transcript)) {
            setTranscriptArray(
              data.final_transcript.map((item) => ({
                text: item.text,
                speaker: item.user === "assistant" ? "assistant" : "human",
                timestamp: item.created_at,
                isPartial: false,
              }))
            );
          }
          break;
        case "live_transcript":
          setTranscriptArray(prev => [
            ...prev,
            {
              text: data.text,
              speaker: data.speaker,
              timestamp: data.timestamp,
              isPartial: data.isPartial || false,
            }
          ]);
          if (data.speaker === 'human' && data.isFinal) {
            setCallPhase('in_progress');
          } else if (data.speaker === 'assistant' && data.isFinal) {
            setCallPhase('in_progress');
          }
          break;
        case "error":
          toast({
            title: "Error",
            description: data.message || "An error occurred during the call.",
            duration: 8000,
            className: "bg-white text-red-600 font-semibold",
          });
          console.error("Webhook error event:", data);
          setCallPhase('failed');
          break;
        // ... rest of your cases
      }
    };

    // Initial connection
    connectWebSocket();

    return () => {
      console.log("Cleaning up WebSocket connection");
      isConnected = false;
      
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      
      if (ws) {
        ws.close(1000, "Component unmounting");
      }
      
      setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
    };
  }, [callStatus.isInitiated, callStatus.ssid]); // Remove other dependencies to prevent reconnections
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
  const [callPhase, setCallPhase] = useState('waiting'); // waiting, initiated, in_progress, completed, failed
  const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATUS.DISCONNECTED);

  // console.log("Call Status at dashboard:", callStatus);

  // Enhanced WebSocket hook for webhook-driven updates
  useWebSocket(callStatus, setTranscriptArray, setIsCallEnded, setCallPhase, toast, setConnectionStatus);

  // Rest of your existing functions remain the same, but update handleMakeCall for new response structure
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

      console.log("Making call with webhook support:", requestData);
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
          webhook_configured: response.data.webhook_configured || false,
        };

        setCallStatus(newCallStatus);
        setCallPhase('initiated');
        setIsCallEnded(false);
        setShowTranscript(true);
        setTranscriptArray([]);
        setIsSatisfied(null);
        
        toast({
          title: "Call Initiated",
          description: "Call started with webhook support. Connecting to live updates...",
          duration: 5000,
          className: "bg-white text-green-600 font-semibold",
        });
      } else {
        throw new Error("No call_sid received from server");
      }
    } catch (error) {
      console.error("Failed to initiate call:", error);
      const errorMessage = error.response?.data?.detail || error.message || "Unknown error occurred";
      setCallPhase('failed');
      toast({
        title: "Call Failed",
        description: `Failed to initiate call: ${errorMessage}`,
        duration: 8000,
        className: "bg-white text-red-600 font-semibold",
      });
    } finally {
      setIsLoading(false);
    }
  }, [callStatus, objective, navigate, toast]);

  // Keep all your existing functions (validateCallData, handleSatisfied, handleEndCall, etc.)
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
        setCallPhase('completed');
        toast({
          title: "Ending Call",
          description: "Call termination requested...",
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
          callPhase={callPhase}
        />
        <LiveTranscript 
          transcriptArray={transcriptArray} 
          showTranscript={showTranscript}
          isCallEnded={isCallEnded}
          callPhase={callPhase}
        />
      </div>

      {/* End Call Button - Updated condition */}
      {callStatus.isInitiated && !isCallEnded && callPhase !== 'completed' && (
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
                Call is {callPhase === 'initiated' ? 'connecting' : 'in progress'}. You can end it manually if needed.
              </p>
            </div>
            <button
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center space-x-2"
              onClick={handleEndCall}
            >
              <span>End Call</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Feedback Section - Keep your existing FeedbackSection component */}
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

      {/* Enhanced Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div
          className="mt-8 bg-gray-900 ring-1 border rounded-lg shadow-lg p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <h3 className="text-sm font-bold text-gray-400 mb-2">Debug Info (Webhook-Driven)</h3>
          <pre className="text-xs text-gray-500 overflow-x-auto">
            {JSON.stringify({
              isInitiated: callStatus.isInitiated,
              ssid: callStatus.ssid,
              callPhase,
              connectionStatus,
              transcriptCount: transcriptArray.length,
              isCallEnded,
              webhookConfigured: callStatus.webhook_configured
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

// Keep your existing FeedbackSection component
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
            Satisfied
          </button>
          <button
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 hover:ring-1 transition-colors font-semibold"
            onClick={() => setIsSatisfied(false)}
          >
            Not Satisfied
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
              Initiating New Call...
            </div>
          ) : (
            "Update Objective and Recall"
          )}
        </button>
      </div>
    ) : null}
  </motion.div>
);

export default CallStatusDashboard;