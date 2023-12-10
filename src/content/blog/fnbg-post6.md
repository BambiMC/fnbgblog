---
author: Fabian Berger
pubDatetime: 2023-12-10
title: Set minimum fan speed on AMD Radeon RX 6800 XT below VBios limit without flashing the VBIOS
postSlug: set-minimum-fan-speed-on-amd-radeon-rx-6800-xt-below-vbios-limit-without-flashing-the-vbios
featured: true
draft: false
tags:
  - AMD
  - Radeon
  - RX 6800 XT
  - Fan Speed
  - VBIOS
  - Overclocking
  - Undervolting
  - Gaming
ogImage: ""
description: Set minimum fan speed on AMD Radeon RX 6800 XT below VBios limit without flashing the VBIOS
---

### Disclaimer:

Changing any vbios settings CAN damage your card. I am not responsible for any damage to your card. Do this at your own risk.

### Why would you want to do this?

My AMD Radeon RX 6800 XT has a minimum fan speed of 25% in the VBIOS.

No software can set the fan speed below 25%.

So with 0 RPM mode enabled, the card will slowly get hotter and hotter until it reaches around 65° Celsius.
Now the wimpy fans kick in and the card will get cooler again. But then the fans will stop again and the card will get hotter again. This cycle repeats itself.

Its annoying!

But i don't want to flash the VBIOS, because i don't want to void my warranty.

So the solution is to use a tool called "MorePowerTool"! Link: https://www.igorslab.de/en/download-area-new-version-of-morepowertool-mpt-and-final-release-of-redbioseditor-rbe/

### How to use MorePowerTool:

1. Download the latest version of MorePowerTool from the link above.
2. Download the latest CPU-Z (must use techpowerup version) from here: https://www.techpowerup.com/download/techpowerup-gpu-z/
3. Dump your VBIOS with GPU-Z:

![image](/assets/blogContent/VBIOS/1.png)

4. Open the dumped VBIOS with MorePowerTool:

![image](/assets/blogContent/VBIOS/2.png)

5. Go to the "Fan" tab and set the minimum fan speed to whatever you want:

![image](/assets/blogContent/VBIOS/3.png)

6. Write the SoftPowerPlayTables to Windows Registry:

![image](/assets/blogContent/VBIOS/4.png)

7. Reboot your PC.

8. Done!

![image](/assets/blogContent/VBIOS/5.png)
