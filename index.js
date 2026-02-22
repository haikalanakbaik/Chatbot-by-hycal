import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import multer from "multer";
import  express from "express";

const upload = multer();
const app = express();
const ai = new GoogleGenAI({});


app.use(express.json());

app.get("/halo", (req, res) => {
  res.send("Hello!");
});

app.post("/generate", async (req, res) => {
    const payload = req.body;

    const aiResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: payload.message,
        config : {
            systemInstruction: "Tolong jawab singkat minimal 10 kata"
        }
    });


    res.json(aiResponse.text);
});

app.post("/generate-image", upload.single("image"), async (req, res) => {
    const message = req.body.message;
    const file = req.file;

    const base64File = file.buffer.toString("base64");

    const aiResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            { text: message, type: "text" },
            { inlineData: { data: base64File, mimeType: file.mimetype } }
        ],
        // config : {
        //     systemInstruction: ""
        // }
    });


    res.json(aiResponse.text);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: "hallo kawan",
//   });
//   console.log(response.text);
// }

// await main();