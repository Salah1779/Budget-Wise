from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import pandas as pd
import json
from typing import List

app = FastAPI()

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Lire le fichier en tant que DataFrame
        if file.filename.endswith('.xlsx'):
            df = pd.read_excel(file.file)
        else:
            df = pd.read_csv(file.file)

        # Traitement des données
        # Exemple simplifié : Supposons que 'description' et 'amount' soient déjà en anglais
        filtered_df = df[['description', 'amount']].dropna()

        # Préparer le résultat
        result = []
        for _, row in filtered_df.iterrows():
            result.append({
                'article': row['description'],
                'amount': row['amount'],
                'category': 'example_category'  # Remplace par la logique de classification
            })

        return JSONResponse(content=result)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
