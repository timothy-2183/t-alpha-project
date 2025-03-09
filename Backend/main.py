from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
import numpy as np
import base64
import cv2

app = FastAPI()

# Enable CORS to allow communication with frontend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production use!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load emotion detection model
model = load_model("emotion_model.h5")
EMOTIONS = ['Angry', 'Disgusted', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprised']

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image is None:
        raise HTTPException(status_code=400, detail="Invalid image file")
    
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3, minSize=(30, 30))
    
    if len(faces) == 0:
        return {"error": "No face detected"}
    
    # Process the first face detected
    (x, y, w, h) = faces[0]
    roi_gray = gray[y:y+h, x:x+w]
    roi_gray = cv2.resize(roi_gray, (48, 48))
    roi_rgb = np.stack((roi_gray,) * 3, axis=-1)
    roi = roi_rgb.astype("float") / 255.0
    roi = np.expand_dims(roi, axis=0)
    
    preds = model.predict(roi)[0]
    confidence = float(np.max(preds))
    emotion = EMOTIONS[np.argmax(preds)]
    cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

    # Encode the image as JPEG and then convert it to base64
    retval, buffer = cv2.imencode('.jpeg', image)
    encoded_image = base64.b64encode(buffer).decode('utf-8')

    return {"emotion": emotion, "confidence": confidence, "image": encoded_image}

# Other endpoints or configurations can be added here.
