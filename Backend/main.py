from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
import numpy as np
import base64
import cv2
from numpy.linalg import norm
from fastapi.concurrency import run_in_threadpool

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model("emotion_model.h5")
EMOTIONS = ['Angry', 'Disgusted', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprised']

# Preload Haar cascade
_FACE_CASCADE = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

# Predefine expected distributions
_EXPECTED_DISTS = {
    "Neutral": {"Neutral": 1.0, "Sad": 0.3, "Happy": 0.3},
    "Happy": {"Happy": 1.0, "Neutral": 0.3, "Surprised": 0.2},
    "Sad": {"Sad": 1.0, "Neutral": 0.5, "Fear": 0.2},
    "Angry": {"Angry": 1.0, "Disgusted": 0.6, "Sad": 0.3},
    "Surprised": {"Surprised": 1.0, "Fear": 0.5, "Happy": 0.3},
    "Disgusted": {"Disgusted": 1.0, "Angry": 0.7, "Sad": 0.2}
}

def cosine_similarity(vec1, vec2):
    return np.dot(vec1, vec2) / (norm(vec1) * norm(vec2))

def get_expected_distribution(expected_emotion):
    """
    Defines a soft label distribution for expected emotions.
    This allows flexibility instead of strict one-hot matching.
    """
    return _EXPECTED_DISTS.get(expected_emotion, {})

def hybrid_empathy_check(expected_emotion, predictions):
    sorted_preds = sorted(predictions.items(), key=lambda x: x[1], reverse=True)
    top_emotion, top_conf = sorted_preds[0]
    second_emotion, second_conf = sorted_preds[1]

    if expected_emotion == top_emotion and top_conf >= 0.95:
        confidence_score = top_conf
    elif expected_emotion == second_emotion and (top_conf - second_conf) < 0.15:
        confidence_score = second_conf * 0.9
    else:
        confidence_score = 0

    expected_dist = get_expected_distribution(expected_emotion)
    detected_vec = np.array([predictions.get(em, 0) for em in EMOTIONS])
    expected_vec = np.array([expected_dist.get(em, 0) for em in EMOTIONS])
    similarity_score = cosine_similarity(expected_vec, detected_vec)

    final_score = (0.5 * confidence_score) + (0.5 * similarity_score)
    return final_score

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Not valid image
    if image is None:
        raise HTTPException(status_code=400, detail="Invalid image file")
    
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = _FACE_CASCADE.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3, minSize=(30, 30))
    
    # If no faces are detected
    if len(faces) == 0:
        return {"emotion": "No face detected", "confidence": "N/A", "image": None}
    
    # Process the first face detected
    (x, y, w, h) = faces[0]
    roi_gray = gray[y:y+h, x:x+w]
    roi_gray = cv2.resize(roi_gray, (48, 48))
    roi_rgb = cv2.cvtColor(roi_gray, cv2.COLOR_GRAY2BGR)
    roi = roi_rgb.astype("float") / 255.0
    roi = np.expand_dims(roi, axis=0)
    
    preds = (await run_in_threadpool(model.predict, roi))[0]
    confidence = str(100 * float(np.max(preds))) + "%"
    emotion = EMOTIONS[np.argmax(preds)]
    cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

    # Encode the image as JPEG and then convert it to base64
    retval, buffer = cv2.imencode('.jpeg', image)
    encoded_image = base64.b64encode(buffer).decode('utf-8')
    
    return {"emotion": emotion, "confidence": confidence, "image": encoded_image}

@app.post("/live.predict")
async def live_predict(
    file: UploadFile = File(...),
    expected_emotion: str = "Neutral"
):
    # Read the uploaded file
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image is None:
        raise HTTPException(status_code=400, detail="Invalid image file")

    # Convert to grayscale for face detection
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = _FACE_CASCADE.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3, minSize=(30, 30))

    if len(faces) == 0:
        return {
            "emotion": "No face detected",
            "confidence": 0.0,
            "empathy_score": 0.0,
            "empathy_detected": False
        }

    # Process the first face
    (x, y, w, h) = faces[0]
    roi_gray = gray[y:y+h, x:x+w]
    roi_gray = cv2.resize(roi_gray, (48, 48))
    roi_rgb = cv2.cvtColor(roi_gray, cv2.COLOR_GRAY2BGR)
    roi = roi_rgb.astype("float") / 255.0
    roi = np.expand_dims(roi, axis=0)

    preds_array = (await run_in_threadpool(model.predict, roi))[0]
    confidence = float(np.max(preds_array))
    detected_emotion = EMOTIONS[np.argmax(preds_array)]
    
    # Convert the array to a dictionary for the empathy check
    preds_dict = {EMOTIONS[i]: float(preds_array[i]) for i in range(len(EMOTIONS))}

    # Run empathy check
    empathy_score = hybrid_empathy_check(expected_emotion, preds_dict)
    empathy_detected = bool(empathy_score >= 0.35)
    cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

    # Encode the image as JPEG and then convert it to base64
    retval, buffer = cv2.imencode('.jpeg', image)
    encoded_image = base64.b64encode(buffer).decode('utf-8')

    return {
        "emotion": detected_emotion,
        "confidence": confidence,
        "empathy_score": empathy_score,
        "empathy_detected": empathy_detected,
        "image": encoded_image
    }