import time
import cv2
import os

esp32_cam_url = "http://192.168.11.185:81/stream"
dataset_path = "Dataset"

image_count = 0
max_count = 10
capturing = False 

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

    if capturing and captured_images < max_count:
        ret, frame = cap.read()  
        if not ret:
            print("Failed to grab frame")
            break
        cv2.imshow("ESP32-CAM", frame)
        image_path = os.path.join(dataset_path, f"{image_count}.jpg")
        cv2.imwrite(image_path, frame)
        print(f"Image saved: {image_path}")

        image_count += 1
        captured_images += 1

        time.sleep(2)  

        if captured_images >= max_count:
            capturing = False

    if key == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
