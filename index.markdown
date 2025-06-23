---
layout: single
header:
  overlay_image: /assets/images/spoke_banner_dim.png
  overlay_filter: 0.5
  caption: "Welcome to Spoke Robotics"
  actions:
    - label: "Get Started"
      url: "/getting-started/"

excerpt: >
  Spoke Robotics is an open-source robotics platform for education and research. 
  Explore our documentation to learn about building and customizing your own Spoke robot.

toc: true
toc_sticky: true
---

{% include feature_row id="intro" %}

## Latest Posts

<div class="grid__wrapper">
  {% for post in site.posts %}
    {% include archive-single.html type="grid" %}
  {% endfor %}
</div>
<div style="clear: both;"></div>

## Getting Started

Welcome to the Spoke Robotics documentation! Here you'll find everything you need to know about building and customizing your Spoke robot. Let's get started with the basics:

{% include feature_row id="getting-started" %}

## Core Components

### Frame
The Spoke robot frame is designed for modularity and ease of assembly. Key features:

- Lightweight aluminum construction
- Interchangeable modules
- Customizable mounting points

<div class="grid__wrapper">
  <div class="grid__item">
    <img src="{{ '/assets/images/frame-assembly.jpg' | relative_url }}" alt="A modular robot frame" style="width:100%; max-width: 200px; display: block; margin-left: auto; margin-right: auto; margin-bottom: 1em;">
    <h3>Frame Assembly</h3>
    <p>Step-by-step guide to building the robot frame.</p>
    <a href="#" class="btn">Assembly Guide</a>
  </div>
  <div class="grid__item">
    <img src="{{ '/assets/images/frame-custom.jpg' | relative_url }}" alt="Customized robot frame" style="width:100%; max-width: 200px; display: block; margin-left: auto; margin-right: auto; margin-bottom: 1em;">
    <h3>Customization</h3>
    <p>Learn how to modify the frame design.</p>
    <a href="#" class="btn">Customization Options</a>
  </div>
</div>
<div style="clear: both;"></div>

### Electronics
The electronics system powers your Spoke robot with:

- FPGA-based control system
- Modular sensor interfaces
- Power distribution
- Communication protocols

<div class="grid__wrapper">
  <div class="grid__item">
    <img src="{{ '/assets/images/electronics-control.jpg' | relative_url }}" alt="The electronic components of a robot" style="width:100%; max-width: 200px; display: block; margin-left: auto; margin-right: auto; margin-bottom: 1em;">
    <h3>Control System</h3>
    <p>Set up the FPGA control system.</p>
    <a href="#" class="btn">Control System</a>
  </div>
  <div class="grid__item">
    <img src="{{ '/assets/images/electronics-sensors.jpg' | relative_url }}" alt="Robot sensors" style="width:100%; max-width: 200px; display: block; margin-left: auto; margin-right: auto; margin-bottom: 1em;">
    <h3>Sensor Integration</h3>
    <p>Connect and configure sensors.</p>
    <a href="#" class="btn">Sensor Guide</a>
  </div>
</div>
<div style="clear: both;"></div>

### Mechanism
The mechanical systems bring your Spoke robot to life:

- Custom-designed actuators
- Precision motion control
- Modular joint systems
- Payload integration

<div class="grid__wrapper">
  <div class="grid__item">
    <img src="{{ '/assets/images/mechanism-motion.jpg' | relative_url }}" alt="The internal mechanism of a robotic joint" style="width:100%; max-width: 200px; display: block; margin-left: auto; margin-right: auto; margin-bottom: 1em;">
    <h3>Motion Control</h3>
    <p>Configure the actuator systems.</p>
    <a href="#" class="btn">Motion Control</a>
  </div>
  <div class="grid__item">
    <img src="{{ '/assets/images/mechanism-joints.jpg' | relative_url }}" alt="Robotic joint system" style="width:100%; max-width: 200px; display: block; margin-left: auto; margin-right: auto; margin-bottom: 1em;">
    <h3>Joint Systems</h3>
    <p>Set up and calibrate joints.</p>
    <a href="#" class="btn">Joint Systems</a>
  </div>
</div>
<div style="clear: both;"></div>

### Device Network
The device network handles communication and event messaging:

- Real-time event-based messaging
- Scalable device-to-device communication
- Low-latency data transfer

<div class="grid__wrapper">
  <div class="grid__item">
    <img src="{{ '/assets/images/network-events.jpg' | relative_url }}" alt="Event messaging diagram" style="width:100%; max-width: 200px; display: block; margin-left: auto; margin-right: auto; margin-bottom: 1em;">
    <h3>Event Messaging</h3>
    <p>Learn about the event-based messaging system.</p>
    <a href="#" class="btn">Event System</a>
  </div>
  <div class="grid__item">
    <img src="{{ '/assets/images/network-protocol.jpg' | relative_url }}" alt="Network protocol diagram" style="width:100%; max-width: 200px; display: block; margin-left: auto; margin-right: auto; margin-bottom: 1em;">
    <h3>Network Protocol</h3>
    <p>Understand the device-to-device communication.</p>
    <a href="#" class="btn">Network Protocol</a>
  </div>
</div>
<div style="clear: both;"></div>

## Documentation

Explore our detailed documentation for each component:

- [Frame Assembly Guide](#)
- [Electronics Setup](#)
- [Mechanical Systems](#)
- [Customization Options](#)

{% include feature_row id="documentation" %}

## Community

Join our community to:

- Share your projects
- Get help from other builders
- Contribute to the platform
- Access support resources

{% include feature_row id="community" %}

## Get Involved

Ready to start building your Spoke robot? Check out our getting started guides and join our community to share your progress.

{% include feature_row id="get-involved" %}
