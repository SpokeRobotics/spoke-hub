---
layout: single
title:  "Second Fake Post: A Guide to Building Your Own Robot"
date:   2025-06-23 07:04:00 -0700
categories: diy hardware
header:
  teaser: /assets/images/robotics2.jpg
---

Welcome to our second demonstration post! Building your own robot can be a rewarding experience.

![A person assembling a small robot](/assets/images/robotics2.jpg)

## Getting Started

Here are the basic components you'll need:

1.  **A Frame:** The chassis that holds everything together.
2.  **Actuators:** Motors to make your robot move.
3.  **Sensors:** To gather information about the environment.
4.  **A Controller:** The "brain" of your robot, like a Raspberry Pi or Arduino.

### Code Snippet Example

Here's a simple example of how you might control a motor using Python:

```python
import time
import RPi.GPIO as GPIO

# Set up GPIO pins
GPIO.setmode(GPIO.BCM)
MOTOR_PIN = 18
GPIO.setup(MOTOR_PIN, GPIO.OUT)

def run_motor():
    print("Motor running...")
    GPIO.output(MOTOR_PIN, GPIO.HIGH)
    time.sleep(5)
    GPIO.output(MOTOR_PIN, GPIO.LOW)
    print("Motor stopped.")
    GPIO.cleanup()

if __name__ == '__main__':
    run_motor()
```

Happy building!
