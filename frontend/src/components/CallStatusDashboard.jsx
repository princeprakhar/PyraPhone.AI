import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const HeaderMessage = () => {
  return (
    <div>
      <motion.div
        className="bg-transparent mt-10 p-6 rounded-lg shadow-md border hover:shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h3
          className="mt-2 text-gray-500 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="font-bold text-lg ">💡Note: </span>Feel free to close
          this browser. A summary of the call will be sent to you over email.
        </motion.h3>
      </motion.div>
    </div>
  );
};

function CallStatusDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { state } = location || {};
  const [callStatus, setCallStatus] = useState(state);
  const [isLoading, setIsLoading] = useState(false);

  const [isSatisfied, setIsSatisfied] = useState(null);
  const [objective, setObjective] = useState(callStatus.objective || "");
  const [transcriptArray, setTranscriptArray] = useState([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);

  const handleSatisfied = () => navigate("/");

  const handleEndCall = async () => {
    try {
      console.log("---- In the end call -----");
      console.log(callStatus.ssid);
      const backendUrl =
        // "https://bb81-103-69-25-33.ngrok-free.app/api/end-call";
      "https://callai-backend-243277014955.us-central1.run.app/api/end-call";
      const response = await axios.post(backendUrl, {
        call_sid: callStatus.ssid,
      });

      if (response.status === 200) {
        setIsCallEnded(true);
        toast({
          title: "Call Ending",
          description: "Call is being terminated...",
          duration: 5000,
          className: "bg-white text-black font-semibold",
        });
      }
    } catch (error) {
      console.error("Error ending call:", error);
      toast({
        title: "Error",
        description: "Failed to end the call. Please try again.",
        duration: 5000,
        className: "bg-white text-red-600 font-semibold",
      });
    }
  };

  const handleMakeCall = async () => {
    setIsLoading(true);
    try {
      if (
        !callStatus.to_number ||
        !callStatus.email ||
        !objective ||
        !callStatus.context
      ) {
        toast({
          title: "Error",
          description: `missing value ${callStatus.to_number} ${callStatus.email} ${objective} ${callStatus.context}`,
          duration: 5000,
          className: "bg-white text-red-500 font-semibold",
        });
        navigate("/sender/");
        return;
      }

      const response = await axios.post(
        // "https://bb81-103-69-25-33.ngrok-free.app/api/initiate-call",
        "https://callai-backend-243277014955.us-central1.run.app/api/initiate-call",
        {
          to_number: callStatus.to_number,
          email: callStatus.email,
          objective: objective,
          context: callStatus.context,
          caller_number: state.callerNumber,
          name_of_org: state.name_of_org,
        }
      );
      setCallStatus({
        ssid: response.data.call_sid,
        isInitiated: true,
        to_number: callStatus.to_number,
        email: callStatus.email,
        objective: objective,
        context: callStatus.context,
        caller_number: state.callerNumber,
        name_of_org: state.name_of_org,
      });

      setIsCallEnded(false);
      setShowTranscript(true);
      setTranscriptArray([]);
      setIsSatisfied(null);
    } catch (error) {
      console.error(
        "Failed to initiate call:",
        error.response?.data?.detail || error.message
      );
      toast({
        title: "Error",
        description: "Failed to initiate call. Please try again.",
        duration: 5000,
        className: "bg-white text-red-600 font-semibold",
      });
    }
  };
  useEffect(() => {
    let ws;
    if (callStatus.isInitiated) {
      setShowTranscript(true);
      setTranscriptArray([]);

      ws = new WebSocket(
        // "wss://bb81-103-69-25-33.ngrok-free.app/ws/notifications"
        "wss://callai-backend-243277014955.us-central1.run.app/ws/notifications"
      );
      console.log("################## Connecting WebSocket... ##########");
      console.log(ws);
      ws.onopen = () => {
        console.log("WebSocket connected.");
        ws.send(JSON.stringify({ event: "start", call_sid: callStatus.ssid }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.event === "ping") {
          console.log("websocket is alive");
        } else if (
          data.event === "call_status" &&
          data.status !== "completed"
        ) {
          console.log("Call status incomplete, closing WebSocket.");
          ws.close();
        } else if (data.event === "call_ended") {
          const emailStatus = data.email_send;
          setIsCallEnded(true);
          toast({
            title: "Call Ended",
            description: emailStatus
              ? `Call AI just helped you save ${data.call_duration} min! A copy of the transcript and audio recording has been sent to  ${callStatus.email}`
              : `Failed to send transcript to ${callStatus.email}`,
            duration: 20000,
            className: emailStatus
              ? "bg-white text-black font-semibold"
              : "bg-white text-red-500 font-semibold",
          });
          console.log("Call ended, closing WebSocket.");
          ws.close();
          callStatus.isInitiated = false; // Caution: avoid directly mutating state
        } else if (
          data.event === "call_in_process" &&
          data.transcription !== null
        ) {
          const timestamp = new Date().toLocaleTimeString();
          setTranscriptArray((prev) => [
            ...prev,
            `[${timestamp}] ${data.transcription}`,
          ]);
        }
      };

      ws.onclose = () => console.log("WebSocket disconnected.");
      ws.onerror = (error) => console.error("WebSocket Error:", error);
    }

    return () => {
      if (ws) {
        console.log("Cleaning up WebSocket connection.");
        ws.close();
      }
    };
  }, [callStatus, toast]);

  const getDisplayTranscript = () =>
    transcriptArray.length > 0
      ? transcriptArray.map((transcript, index) => (
          <motion.div
            key={index}
            className="p-3 mb-3 rounded-md bg-gray-800 text-slate-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {transcript}
          </motion.div>
        ))
      : "Waiting for conversation to begin...";

  return (
    <motion.div
      className="container mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <HeaderMessage />
      <div className="flex flex-col mt-10 lg:flex-row justify-between items-start lg:space-x-8 space-y-8 lg:space-y-0">
        <motion.div
          className="w-full lg:w-1/2 bg-black ring-1 border rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-purple-600 mb-4">
            Call Status
          </h2>
          {callStatus.isInitiated ? (
            <div className="text-lg text-green-600 font-semibold">
              ✅ Call Initiated Successfully!
              <p className="mt-2 text-gray-400">
                <strong>Call SSID:</strong> {callStatus.ssid || "N/A"}
              </p>
              <p className="mt-2 text-gray-400">
                <strong>Phone Number:</strong> {callStatus.to_number || "N/A"}
              </p>
              <p className="mt-2 text-gray-400">
                <strong>Name or Organization name:</strong>
                {callStatus.name_of_org || "N/A"}
              </p>
            </div>
          ) : (
            <div className="text-lg text-red-500 font-semibold">
              Call terminated.
            </div>
          )}
        </motion.div>

        <motion.div
          className="w-full lg:w-1/2 bg-black ring-1 border rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-purple-600 mb-4">
            Live Transcript
          </h2>
          <div className="space-y-4">
            {showTranscript && (
              <div className="rounded-md bg-gray-900 text-slate-200 ring-1 max-h-96 overflow-y-auto p-4">
                {getDisplayTranscript()}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {callStatus.isInitiated && !isCallEnded && (
        <div className="mt-8 bg-black ring-1 border rounded-lg shadow-lg p-6">
          <button
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            onClick={handleEndCall}
          >
            End Call
          </button>
        </div>
      )}
      {isCallEnded && (
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
                  className="bg-purple-600 hover:ring-1 text-white px-4 py-2 rounded-lg hover:bg-purple-900"
                  onClick={() => {
                    setIsSatisfied(true);
                    handleSatisfied();
                  }}
                >
                  Satisfied
                </button>
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-black hover:ring-2"
                  onClick={() => setIsSatisfied(false)}
                >
                  Not Satisfied
                </button>
              </div>
            </div>
          ) : !isSatisfied ? (
            <div className="mt-4">
              <p className="text-lg text-gray-400 mb-4">
                Would you like to update your objective before recalling?
              </p>
              <textarea
                className="w-full p-2 border rounded-lg mb-4 text-black"
                placeholder="Enter updated objective (optional)..."
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
              />
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 mr-4"
                onClick={handleMakeCall}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AI is firing up. Hold steady!
                  </div>
                ) : (
                  "Update Objective and Recall!"
                )}
              </button>
            </div>
          ) : null}
        </motion.div>
      )}
      <Toaster
        toastOptions={{
          className: "bg-white-800 text-black",
          duration: 5000,
        }}
      />
    </motion.div>
  );
}

export default CallStatusDashboard;
