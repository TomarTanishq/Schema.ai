import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import populateSchema from "./populateSchema.js"

// Initialisation
const app = express()

// Load env variable
dotenv.config()
const PORT = process.env.PORT

// Middleware
app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true
}))

// AI Route
app.post('/fillSchema', async (req, res) => {
    try {
        const { schema, consistentData } = req.body;
        const prompt = `
 Generate exactly 20 datasets as a JSON array of objects.
  
  STRICT REQUIREMENTS:
  1. Schema Adherence: Follow ONLY this exact schema structure - do not add any additional fields:
  ${schema}
  
  2. Data Consistency:
     a. **Consistent Fields:** The following fields MUST have identical values across ALL 20 datasets:
        ${consistentData && consistentData.length > 0 ? consistentData.map(field => `- "${field}"`).join('\n') : "No consistent fields specified."}
     b. **Variable Fields:** For all fields NOT listed above as consistent, generate unique and realistic values for each of the 20 datasets. Ensure variety and appropriateness to the field names.
  
  3. Array Field Generation: For any array fields within the schema, generate exactly 20 entries within each array.
  
  4. Data Formatting:
     - For date/time fields: 
       • Always use ISO format (YYYY-MM-DD) or ISO datetime format (YYYY-MM-DDTHH:mm:ssZ).
       • Dates MUST vary across all datasets (unless the field is consistent).
     - For ID/reference fields: generate appropriate format based on context (numeric IDs, UUIDs, or alphanumeric strings).
     - For email fields: use valid email format (user@domain.com).
     - For phone fields: use valid phone number formats.
     - For boolean fields: use true/false values.
     - For numeric fields: use appropriate number ranges based on field name context.
     - For string fields: use realistic text that matches the field name purpose.
  
  5. Output Format: Your response must be ONLY a valid JSON array with no additional text, explanations, or markdown formatting.
`;

        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Transfer-Encoding", "chunked");

        await populateSchema(prompt, (chunk) => {
            res.write(chunk); // send each chunk immediately
        });

        res.end(); // end the stream
    } catch (error) {
        console.error("Error in /fillSchema route:", error);
        res.status(500).json({
            message: "An error occurred while generating data.",
            error: error.message
        });
    }
});



// PORT listening
app.listen(PORT, () => {
    console.log('Server is running');

})