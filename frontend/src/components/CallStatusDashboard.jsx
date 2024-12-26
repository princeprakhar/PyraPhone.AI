import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

function CallStatusDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const { toast } = useToast();

  const { state } = location || {};
  const callStatus = state || {
    isInitiated: false,
    ssid: "N/A",
    to_number: "",
    email: "",
    objective: "",
  };

  const [isSatisfied, setIsSatisfied] = useState(null);
  const [objective, setObjective] = useState(callStatus.objective || "");
  const [phoneNumber] = useState(callStatus.to_number || "");
  const [email] = useState(callStatus.email || "");
  const [transcriptArray, setTranscriptArray] = useState([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);

  const handleSatisfied = () => {
    navigate("/");
  };

  const handleEndCall = async () => {
    // await axios.post(`${"backendUrl"}/end-call`, { call_sid: callStatus.ssid });
    setIsCallEnded(true);
  };

  const handleMakeCall = async () => {
    try {
      const backendUrl =
      "https://callai-backend-243277014955.us-central1.run.app/api/initiate-call";
      // const backendUrl =
      //   "https://dc6b-103-199-205-140.ngrok-free.app/api/initiate-call";
      if (!phoneNumber || !email || !objective) {
        navigate("/sender/initiate-call/");
        throw "Fill all fields";
      }

      const response = await axios.post(backendUrl, {
        to_number: phoneNumber,
        email,
        objective,
      });
      navigate("/initiate-call/call-status", {
        state: {
          ssid: response.data.call_sid,
          isInitiated: true,
          to_number: phoneNumber,
          email,
          objective,
        },
      });

    } catch (error) {
      console.error(
        "Failed to initiate the call. Error:",
        error.response?.data?.detail || error.message
      );
    }
  };

  useEffect(() => {
    let ws;

    if (callStatus.isInitiated) {
      setShowTranscript(true);
      setTranscriptArray([]);
      ws = new WebSocket(
        "wss://callai-backend-243277014955.us-central1.run.app/ws/notifications"
      );
      // ws = new WebSocket(
      //   "wss://dc6b-103-199-205-140.ngrok-free.app/ws/notifications"
      // );
      ws.onopen = () => {
        console.log("WebSocket connected.");
        ws.send(
          JSON.stringify({ event: "start", transcription_id: "YOUR_ID" })
        );
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.event === "call_ended") {
          const emailStatus = data.email_send;
          console.log(data)
          if (emailStatus){
              toast({
                title: "Call Ended",
                description: `Transcript has been sent to ${email}`,
                duration: 20000,
                className: "bg-white text-black font-semibold",
              });
          } 
          else{
            toast({
              title: "Call Ended",
              description: `Failed to Send Transcript to ${email}`,
              duration: 20000,
              className: "bg-white text-red font-semibold",
            });
          }   
          if (ws) ws.close();
        }

        if (data.event === "call_in_process") {
          const timestamp = new Date().toLocaleTimeString();
          setTranscriptArray((prev) => [
            ...prev,
            `[${timestamp}] ${data.transcription}`,
          ]);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected.");
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };
    }
  }, [callStatus.isInitiated, callStatus.ssid,callStatus.email,toast]);

  // Function to display either ongoing transcript or final transcript
  const getDisplayTranscript = () => {
    if (transcriptArray.length > 0) {
      return transcriptArray.map((transcript) => `${transcript}\n`).join("");
    }
    return "Waiting for conversation to begin...";
  };
  return (
    <motion.div
      className="container mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="flex flex-col mt-10 lg:flex-row justify-between items-start lg:space-x-8 space-y-8 lg:space-y-0">
        {/* ... Call Status Section remains the same ... */}
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
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-lg text-green-600 font-semibold"
            >
              ✅ Call Initiated Successfully!
              <p className="mt-2 text-gray-400">
                <strong>Call SSID:</strong> {callStatus.ssid || "N/A"}
              </p>
              <p className="mt-2 text-gray-400">
                <strong>Phone Number:</strong> {phoneNumber || "N/A"}
              </p>
              <p className="mt-2 text-gray-400">
                <strong>Email:</strong> {email || "N/A"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="text-lg text-red-500 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              ⏳ Call Not Initiated... Please Wait.
            </motion.div>
          )}
        </motion.div>

        {/* Updated Transcript Section */}
        <motion.div
          className="w-full lg:w-1/2 bg-black ring-1 border rounded-lg shadow-lg p-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-purple-600 mb-4">
            Live Transcript
          </h2>
          <div className="space-y-4">
            {showTranscript && (
              <motion.div
                className="p-3 rounded-md bg-gray-900 text-slate-200 ring-1 max-h-96 overflow-y-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <pre className="whitespace-pre-wrap">
                  {getDisplayTranscript()}
                </pre>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {callStatus.isInitiated && !isCallEnded && (
        <motion.div
          className="mt-8 bg-black ring-1 border rounded-lg shadow-lg p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <button
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            onClick={handleEndCall}
          >
            End Call
          </button>
        </motion.div>
      )}

      {(isCallEnded || !callStatus.isInitiated) && (
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
                Update Objective & Recall
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
