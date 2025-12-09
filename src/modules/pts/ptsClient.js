// src/modules/pts/ptsClient.js

const PTS_URL = "https://192.168.1.117/jsonPTS";
const USERNAME = "admin";
const PASSWORD = "admin";

function buildRequest(commands) {
  return {
    Protocol: "jsonPTS",
    Packets: commands.map((cmd, index) => ({
      Id: index + 1,
      Type: cmd.fn,
      Data: cmd.fnRef(...cmd.args)
    }))
  };
}

async function send(request) {
  const response = await fetch(PTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa(`${USERNAME}:${PASSWORD}`)
    },
    body: JSON.stringify(request)
  });

  return await response.json();
}

export default { buildRequest, send };
