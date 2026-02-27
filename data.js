// import { Innertube } from 'youtubei.js';
// import dotenv from "dotenv";
// dotenv.config();

// function extractVideoId(input) {
//   if (/^[0-9A-Za-z_-]{11}$/.test(input)) return input;
//   try {
//     const url = new URL(input);
//     const idFromQuery = url.searchParams.get("v");
//     if (idFromQuery) return idFromQuery;
//     if (url.hostname.includes("youtu.be")) return url.pathname.slice(1);
//     const parts = url.pathname.split("/").filter(Boolean);
//     return parts.pop();
//   } catch {
//     return null;
//   }
// }

// export const getTranscript = async (videoURL) => {
//   try {
//     const videoId = extractVideoId(videoURL);
//     if (!videoId) throw new Error("Invalid YouTube URL");

//     console.log("Video ID:", videoId);

//     const youtube = await Innertube.create({
//       lang: 'en',
//       location: 'US',
//       retrieve_player: false,
//     });

//     const info = await youtube.getInfo(videoId);
//     const transcriptData = await info.getTranscript();

//     const fullText = transcriptData.transcript.content.body.initial_segments
//       .map(segment => segment.snippet.text)
//       .join(' ');

//     console.log("Transcript length:", fullText.length);
//     return fullText;

//   } catch (error) {
//     console.error("Message:", error.message);
//     return null;
//   }
// };


import dotenv from "dotenv";
dotenv.config();

function extractVideoId(input) {
  if (/^[0-9A-Za-z_-]{11}$/.test(input)) return input;
  try {
    const url = new URL(input);
    const idFromQuery = url.searchParams.get("v");
    if (idFromQuery) return idFromQuery;
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts.pop();
  } catch {
    return null;
  }
}

export const getTranscript = async (videoURL) => {
  try {
    const videoId = extractVideoId(videoURL);
    if (!videoId) throw new Error("Invalid YouTube URL");

    console.log("Video ID:", videoId);

    const response = await fetch(
      `https://api.supadata.ai/v1/youtube/transcript?videoId=${videoId}&text=true`,
      {
        headers: {
          "x-api-key": process.env.SUPADATA_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Supadata API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data?.content) {
      throw new Error("No transcript content returned");
    }

    console.log("Transcript length:", data.content.length);
    return data.content;

  } catch (error) {
    console.error("Message:", error.message);
    return null;
  }
};