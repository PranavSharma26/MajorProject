import io
from PIL import Image
from ultralytics import YOLO
import cv2
from flask import Flask, request
import base64

app = Flask(__name__)

@app.route("/", methods=['POST'])
def runInference():
    # Load the TFLite model
    photo = request.get_json()
    image_path = "inputUserImage.jpeg"
    if photo:
        base64_imagePath = photo.get('base64Path')

    image_data = base64.b64decode(base64_imagePath)

    img = Image.open(io.BytesIO(image_data))

    img.save(image_path, 'jpeg')

    # print("Image path is:", image_path)
    model = YOLO("./assets/yolo11n_float32.tflite")  # path to your TFLite model

    # Load image
    img = cv2.imread(image_path)

    # Run inference
    results = model(image_path, imgsz=320, conf=0.4)  # imgsz same as your training, conf=confidence threshold

    detectedClasses = ""

    print("results are:", results)
    print('\n')
    print('\n')
    print('\n')
    print('\n')
    # Draw results
    for r in results:
        # r.boxes has all detected boxes
        for box in r.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            x1, y1, x2, y2 = map(int, box.xyxy[0])  # bounding box coordinates
            label = f"{model.names[cls_id]} {conf:.2f}"

            # Draw rectangle and label
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(img, label, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            print(f"Class: {model.names[cls_id]}, Confidence: {conf:.2f}, Box: {x1,y1,x2,y2}")
            detectedClasses += model.names[cls_id]
            detectedClasses += ", "

    # Show the image
    # cv2.imshow("TFLite YOLO Detection", img)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()

    return detectedClasses, 200

if __name__ == '__main__':
    app.run(debug=True)