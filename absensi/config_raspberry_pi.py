# Configuration for Raspberry Pi GPIO Relay Control
# Copy this to config.py and modify as needed

# Door Relay Configuration
DOOR_RELAY_ENABLED = False  # Set to True when deploying to Raspberry Pi
DOOR_RELAY_PIN = 18         # GPIO pin connected to door relay
DOOR_OPEN_DURATION = 3      # Seconds to keep door open

# Additional GPIO Configurations
LED_INDICATOR_PIN = 24      # Optional LED indicator
BUZZER_PIN = 23             # Optional buzzer for access granted/denied

# System Settings
CONFIDENCE_THRESHOLD = 0.6  # Minimum confidence for face recognition
COOLDOWN_PERIOD = 2         # Seconds between recognitions for same person

# Access Control Settings
ALLOW_MULTIPLE_DOOR_ACCESS = True  # Allow door access even after attendance marked
LOG_ALL_ACCESS_ATTEMPTS = True     # Log all attempts to database

# Raspberry Pi Dependencies Installation:
# sudo apt-get update
# sudo apt-get install python3-pip
# pip3 install RPi.GPIO
# pip3 install gpiozero  # Alternative GPIO library

# Example GPIO Wiring:
# Door Relay: GPIO 18 -> Relay IN, VCC -> 5V, GND -> GND
# LED Indicator: GPIO 24 -> LED+, GND -> LED-
# Buzzer: GPIO 23 -> Buzzer+, GND -> Buzzer-