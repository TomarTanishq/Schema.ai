import { useState } from "react";

const Feature = () => {
    const [schema, setSchema] = useState("");
    const [generatedData, setGeneratedData] = useState("");
    const [loading, setLoading] = useState(false);
    const [copiedText, setCopiedText] = useState(false)
    const [consistentData, setConsistentData] = useState("")

    const handleGenerate = async () => {
        setGeneratedData("");
        setLoading(true);

        try {
            let consistentDataArray = []
            if (consistentData && consistentData.length > 0) {
                consistentDataArray = consistentData.split(/[,]+/).map(f => f.trim()).filter(Boolean)
            }
            const response = await fetch("http://localhost:3000/fillSchema", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    schema,
                    consistentData: consistentDataArray
                })
            });

            if (!response.body) throw new Error("ReadableStream not supported");

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                setGeneratedData((prev) => prev + chunk);
            }
        } catch (err) {
            console.error("Streaming error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!generatedData) return
        try {
            await navigator.clipboard.writeText(generatedData)
            setCopiedText(true)
            setTimeout(() => setCopiedText(false), 2000)
        } catch (err) {
            console.error("Failed to copy generatedData")
        }
    }

    return (
        <div className="mt-10 min-h-fit pb-5 px-5 md:px-0">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Input */}
                <div className="flex flex-col">
                    {/* Title */}
                    <div className="bg-[#1b1e2b]">
                        <h2 className="font-poppins p-2 text-gray-200 tracking-wider">
                            MongoDB Schema
                        </h2>
                    </div>
                    {/* TextArea */}
                    <div className="border-5 border-[#1b1e2b] min-h-130">
                        <textarea
                            className="resize-none min-h-full w-full outline-0 p-5 font-poppins text-gray-300 text-sm tracking-widest"
                            placeholder={`Paste Your Schema here \n\nexample:\n{\n\t doctor:{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },\n\t doctorName:{ type: String }, \n\t name: { type: String, required: true }, \n\t age: Number, \n\t address: String, \n\t gender:String \n}`}
                            value={schema}
                            onChange={(e) => setSchema(e.target.value || "")}
                        ></textarea>
                    </div>
                    {/* Consistent Data */}
                    <div className="mt-2">
                        <textarea
                            className="w-full resize-none outline-0 text-xs border-3 border-[#1b1e2b] px-5 pt-2 font-poppins tracking-widest min-h-25"
                            placeholder={`Provide Consistent Data(Optional) \n\nexample: \ndoctor, doctorName, createdAt`}
                            value={consistentData}
                            onChange={(e) => setConsistentData(e.target.value)}></textarea>
                    </div>
                    <button
                        onClick={handleGenerate}
                        className="border border-gray-800 text-white p-2 mt-2 rounded-sm cursor-pointer active:bg-[#1b1e2b]"
                        disabled={!schema || loading}
                    >
                        {loading ? "Generating..." : "Generate"}
                    </button>
                </div>

                {/* Result */}
                <div className="flex flex-col">
                    {/* Title */}
                    <div className="bg-[#1b1e2b] flex justify-between items-center">
                        <h2 className="font-poppins p-2 text-gray-200 tracking-wider">
                            JSON
                        </h2>
                        <button onClick={handleCopy} className="font-poppins p-2 text-gray-200 cursor-pointer active:text-gray-500 transition-all">
                            {copiedText ? "Copied" : "Copy"}
                        </button>
                    </div>
                    {/* TextArea */}
                    <div className="border-5 border-[#1b1e2b] min-h-169.5">
                        <textarea
                            className="resize-none min-h-full w-full outline-0 p-5 font-mono text-green-200 text-sm tracking-widest caret-transparent"
                            placeholder="Results will be displayed here"
                            readOnly
                            value={generatedData}
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feature;
