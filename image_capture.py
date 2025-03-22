import time
import cv2
import os

millis = lambda: int(round(time.time() * 1000))

esp32_cam_url = "http://192.168.11.185:81/stream"
dataset_path = "Dataset"

image_count = 0
max_count = 10
capturing = False  
last_capture_time = 0 
capture_interval = 2000 

if not os.path.exists(dataset_path):
    os.makedirs(dataset_path)

cap = cv2.VideoCapture(esp32_cam_url)

if not cap.isOpened():
    print("Error: Could not open video stream")
    exit()

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame")
        break

    cv2.imshow("ESP32-CAM", frame)

    key = cv2.waitKey(1) & 0xFF

    if key == ord('c') and not capturing:
        capturing = True
        captured_images = 0
        last_capture_time = millis()

    if capturing and captured_images < max_count:
        current_time = millis()
        if current_time - last_capture_time >= capture_interval:
            image_path = os.path.join(dataset_path, f"{image_count}.jpg")
            cv2.imwrite(image_path, frame)
            print(f"Image saved: {image_path}")

            image_count += 1
            captured_images += 1
            last_capture_time = current_time

        if captured_images >= max_count:
            capturing = False

    if key == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
