---
layout: single
title: "Getting Started"
permalink: /getting-started/
toc: true
toc_sticky: true
---

This guide will walk you through the essential steps to build and program your first Spoke robot.

## 1. Hardware Assembly

Before you can do anything else, you need to assemble the physical robot. Follow our detailed guides for each component.

### Required Tools
- Screwdriver set
- Allen keys
- Soldering iron (optional, for custom electronics)

### Assembly Steps
1.  **Frame**: Start by assembling the main chassis. [Link to Frame Assembly Guide]()
2.  **Electronics**: Mount the main controller board and connect the power systems. [Link to Electronics Setup]()
3.  **Mechanisms**: Attach the motors, joints, and any other actuators. [Link to Mechanism Guide]()

## 2. Software Setup

With the hardware assembled, it's time to get the software running.

### Installing the Toolchain
You'll need to install the development toolchain to program the robot's FPGA.

```bash
# Example installation command
pip install spokerobotics-tools
```

### Flashing the Firmware
Once the toolchain is installed, you can flash the base firmware to the controller.

1.  Connect the robot to your computer via USB.
2.  Run the flashing utility: `spoke-flash --firmware latest`

## 3. Your First Program

Let's write a simple program to make the robot move.

```python
from spoke import Robot

# Connect to the robot
robot = Robot()

# Move forward for 1 second
robot.drive_forward(duration=1)

print("Moved forward!")
```

Save this code as `hello_robot.py` and run it from your terminal:

```bash
python hello_robot.py
```

Congratulations! You've just run your first program on your Spoke robot.
