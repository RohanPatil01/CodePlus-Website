import cv2
from flask import Flask, render_template, Response
from deepface import DeepFace

app = Flask(__name__)

face_classifier = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
video_capture = cv2.VideoCapture(0)

def detect_bounding_box(vid, filter_option):
    gray_image = cv2.cvtColor(vid, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray_image, 1.1, 5, minSize=(40, 40))
    
    for (x, y, w, h) in faces:
        # Apply face detection bounding box
        cv2.rectangle(vid, (x, y), (x + w, y + h), (0, 255, 0), 4)
        
        # Apply selected filter
        if filter_option == 'hat':
            # Apply hat filter (example)
            # Replace this with your filter implementation
            hat = cv2.imread('hat.png', -1)
            hat = cv2.resize(hat, (w, h))
            overlay_alpha(vid, hat, (x, y))
        elif filter_option == 'glasses':
            # Apply glasses filter (example)
            # Replace this with your filter implementation
            glasses = cv2.imread('glasses.png', -1)
            glasses = cv2.resize(glasses, (w, h))
            overlay_alpha(vid, glasses, (x, y))

        # Analyze emotion
        face_roi = gray_image[y:y+h, x:x+w]
        emotion = detect_emotion(face_roi)
        cv2.putText(vid, f"Emotion: {emotion}", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
        
    return vid

def overlay_alpha(bg_image, fg_image, position):
    """
    Overlay an image with alpha channel on top of another image.
    """
    x, y = position
    for c in range(0, 3):
        bg_image[y:y+fg_image.shape[0], x:x+fg_image.shape[1], c] = \
            fg_image[:,:,c] * (fg_image[:,:,3] / 255.0) + bg_image[y:y+fg_image.shape[0], x:x+fg_image.shape[1], c] * (1.0 - fg_image[:,:,3] / 255.0)

def detect_emotion(face):
    try:
        result = DeepFace.analyze(face, actions=['emotion'])
        emotion = result['dominant_emotion']
        return emotion
    except Exception as e:
        print("Error analyzing emotion:", str(e))
        return "Unknown"

def gen_frames(filter_option='none'):  
    while True:
        success, frame = video_capture.read()
        if not success:
            break
        else:
            frame = detect_bounding_box(frame, filter_option)  # Apply face detection and filters
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    filter_option = 'none'  # Default: no filter
    return Response(gen_frames(filter_option), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(debug=True)
