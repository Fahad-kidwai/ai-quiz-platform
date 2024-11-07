async function makeRequest(prompt, requestType) {
  const geminiAPIBaseUrl = "https://generativelanguage.googleapis.com/v1beta";
  const model = "gemini-pro";
  const apiKey = "AIzaSyAFf8sNGC-0vhO7EjMt3zY67Yd4ENgh5z4";
  const url = `${geminiAPIBaseUrl}/models/${model}:generateContent?key=${apiKey}`;

  let payload = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 2048,
      topP: 1,
      topK: 1,
    },
  };

  var options = {
    muteHttpExceptions: true,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    payload: JSON.stringify(payload),
  };
  let responseStr;
  // console.log('Request', JSON.stringify(UrlFetchApp.getRequest(url, options)));
  responseStr = UrlFetchApp.fetch(url, options).getContentText();
  console.log(responseStr);

  const resultObj = JSON.parse(responseStr);
  return resultObj;
}
