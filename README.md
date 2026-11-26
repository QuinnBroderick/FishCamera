# Fish Cam

[View the Fish Cam](https://fishcam.quinnsfishcam.com)

I built this project so I could check on my fish tank when I'm away from home. It uses an ESP32-CAM mounted inside a modified GoPro case to help keep water away from the electronics. The camera connects to Wi-Fi and streams video to a website I host on an old HP Z600 running Xubuntu.

What started as a simple camera project turned into a way to learn more about embedded systems, web development, Linux, and networking.

## Hardware

- **ESP32-CAM (AI-Thinker)** with an OV2640 camera sensor
- **Modified GoPro case** used as a protective enclosure near the aquarium
- **HP Z600 workstation** running Xubuntu as the web server

The GoPro case was modified to fit the camera. It's there to protect the electronics from splashes and moisture, not as a tested waterproof enclosure.

## How it works

The ESP32-CAM runs firmware based on Espressif's Arduino `CameraWebServer` example. It connects to my local Wi-Fi network and provides a video stream along with endpoints for camera settings and status.

I made a separate website in HTML, CSS, and JavaScript instead of using the ESP32's default web interface. The site can:

- Start and stop the live MJPEG stream
- Change resolution between QVGA, VGA, SVGA, and XGA
- Adjust JPEG quality
- Adjust the onboard flash LED brightness (when supported by the firmware)
- Check whether the camera is online and display request timing

The site is hosted on the HP Z600 using **NGINX**. NGINX serves the website and forwards `/stream`, `/status`, `/capture`, and `/control` requests to the ESP32-CAM on the local network. For the live stream, I disabled proxy buffering and increased the timeouts so the connection can stay open.

To access the camera away from home, I configured port forwarding on my router, DNS through Cloudflare, and HTTPS certificates using Let's Encrypt and Certbot. The ESP32's own ports aren't forwarded directly to the internet.

## Code

- `FishCamera/FishCam/` — ESP32-CAM firmware and camera setup
- `site/` — HTML, CSS, and JavaScript for the viewer and login page
- `nginx/` — NGINX configuration used to host the site and forward camera requests

Only the website files are copied into NGINX's public web directory. The rest of the project stays in the development folder.

Only the website files are copied into NGINX's public web directory. The rest of the project stays in the development folder.

## Current status

The camera stream and controls work through the website, including when accessed outside my home network. The site is served over HTTPS, and the Xubuntu server uses UFW to limit incoming traffic.

The login page currently checks credentials in JavaScript, **not on the server**, so it should not be considered secure authentication. I started looking into a Flask-based login system but haven't finished it. For now, the stream should be treated as public.

## Things I'd like to improve

- Replace the JavaScript login with server-side authentication
- Make network settings and deployment easier to update when the camera or server changes networks
- Improve the camera enclosure and mounting setup

---

*The ESP32 camera firmware is based on Espressif's Arduino CameraWebServer example. The website and NGINX setup are separate parts of this project.*
