const apiKey = "YOUR_API_KEY_HERE";

async function listModels() {
  try {
    const response = await fetch("https://api.x.ai/v1/models", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });

    console.log("Status:", response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error Data:", JSON.stringify(errorData, null, 2));
    } else {
      const data = await response.json();
      console.log("Models:", JSON.stringify(data.data.map(m => m.id), null, 2));
    }
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

listModels();
