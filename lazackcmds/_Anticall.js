conn.ev.on("call", async callEvents => {
  // Check if anti-call feature is enabled
  const isAntiCallEnabled = process.env.ANTI_CALL === "true";

  if (isAntiCallEnabled) {
    for (let callEvent of callEvents) {
      if (callEvent.status === "offer") { 
        try {
          // Get the caller's number
          const callerNumber = callEvent.from;

          // Check if the caller is in the allowed list (whitelist)
          const allowedNumbers = [global.owner, "+1234567890"]; // Add allowed numbers here
          const isAllowed = allowedNumbers.some(number => callerNumber.includes(number));

          if (isAllowed) {
            console.log("Call allowed from:", callerNumber);
            continue; // Skip to the next call event
          }

          // Message to be sent to the caller
          const warningMessage = {
            text: `*ANTICALL IS ACTIVATED*\n*Please do not disturb by calling.*\n*Urgent matters? Contact the owner:*\n\🗽 CULT MD` 
          };

          // Send the warning message to the caller
          let sentMsg = await conn.sendMessage(callerNumber, warningMessage);
          console.log("Warning message sent:", sentMsg);

          // Send the bot owner's contact to the caller
          await conn.sendContact(callerNumber, global.owner, sentMsg);
          console.log("Owner's contact sent to:", callerNumber);

          // Reject the incoming call
          await conn.rejectCall(callEvent.id, callerNumber); 
          console.log("Call rejected from:", callerNumber);

        } catch (error) {
          console.error("Error handling call event:", error);
          // Add more specific error handling if needed
        }
      }
    }
  } else {
    console.log("Anti-call feature is disabled.");
  }
});
