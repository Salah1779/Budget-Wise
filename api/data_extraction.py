from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, adjust as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_file(file: UploadFile):
    try:
        # Read the uploaded file as a DataFrame
        if file.filename.endswith('.xlsx'):
            df = pd.read_excel(file.file)

        elif file.filename.endswith('.csv'):
            df = pd.read_csv(file.file)
        else:
            return JSONResponse(content={"error": "Unsupported file type"}, status_code=400)

        # Process the data
        filtered_df = df[['Description', 'Amount']].dropna()

        # Prepare the response data
        result = [{"article": row['Description'], "amount": row['Amount']} for _, row in filtered_df.iterrows()]

        return JSONResponse(content=result)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)  # Run on port 8000
