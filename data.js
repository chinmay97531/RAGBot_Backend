import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const getTranscript = async(videoURL) => {
    try{
        const res = await axios.get('https://app.scrapingbee.com/api/v1/youtube/transcript', {
            params: {
                "api_key": process.env.SCRAPINGBEE_API_KEY,
                "video_id": videoURL,
                "language": "en",
                "transcript_origin": "auto_generated"
            }
        });
        // console.log('Transcript data:', res.data.text);
        return res.data.text;
    }
    catch (error) {
        console.error('Error fetching transcript:', error);
        return null;
    }
};