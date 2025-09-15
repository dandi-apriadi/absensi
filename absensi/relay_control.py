"""
Raspberry Pi Relay Control Module
Handles GPIO operations for door access control
"""
import time
import threading
from typing import Optional, Any

# GPIO module imports with proper type hints for development
GPIO: Optional[Any] = None
LED: Optional[Any] = None
Button: Optional[Any] = None
Buzzer: Optional[Any] = None

# Try to import GPIO libraries
try:
    import RPi.GPIO as GPIO  # type: ignore
    GPIO_AVAILABLE = True
except ImportError:
    GPIO_AVAILABLE = False
    print("[RELAY] RPi.GPIO not available - using simulation mode")

try:
    from gpiozero import LED, Button, Buzzer  # type: ignore
    GPIOZERO_AVAILABLE = True
except ImportError:
    GPIOZERO_AVAILABLE = False

class RelayController:
    """
    Raspberry Pi GPIO Relay Controller
    
    Note: RPi.GPIO and gpiozero modules are only available on Raspberry Pi.
    This class automatically falls back to simulation mode on other platforms.
    Pylance warnings for missing modules are expected during development.
    """
    def __init__(self, relay_pin=18, led_pin=24, buzzer_pin=23):
        self.relay_pin = relay_pin
        self.led_pin = led_pin
        self.buzzer_pin = buzzer_pin
        self.gpio_initialized = False
        
        # Initialize GPIO if available
        if GPIO_AVAILABLE:
            self.init_gpio()
        
    def init_gpio(self):
        """Initialize GPIO pins"""
        try:
            GPIO.setmode(GPIO.BCM)
            GPIO.setwarnings(False)
            
            # Setup relay pin
            GPIO.setup(self.relay_pin, GPIO.OUT)
            GPIO.output(self.relay_pin, GPIO.LOW)  # Default OFF
            
            # Setup LED indicator (optional)
            GPIO.setup(self.led_pin, GPIO.OUT)
            GPIO.output(self.led_pin, GPIO.LOW)
            
            # Setup buzzer (optional)
            GPIO.setup(self.buzzer_pin, GPIO.OUT)
            GPIO.output(self.buzzer_pin, GPIO.LOW)
            
            self.gpio_initialized = True
            print("[RELAY] GPIO initialized successfully")
            
        except Exception as e:
            print(f"[RELAY] GPIO initialization failed: {e}")
            self.gpio_initialized = False
    
    def activate_door_relay(self, duration=3, callback=None):
        """
        Activate door relay for specified duration
        Args:
            duration: seconds to keep door open
            callback: function to call when door closes
        """
        if self.gpio_initialized:
            # Real GPIO control
            try:
                print(f"[RELAY] Activating door relay for {duration} seconds")
                
                # Turn on relay and LED
                GPIO.output(self.relay_pin, GPIO.HIGH)
                GPIO.output(self.led_pin, GPIO.HIGH)
                
                # Success beep
                self.beep_success()
                
                # Schedule relay deactivation
                timer = threading.Timer(duration, self._deactivate_relay)
                timer.daemon = True
                timer.start()
                
                if callback:
                    close_timer = threading.Timer(duration + 0.1, callback)
                    close_timer.daemon = True
                    close_timer.start()
                
                return True
                
            except Exception as e:
                print(f"[RELAY] Error activating relay: {e}")
                return False
        else:
            # Simulation mode
            print(f"[RELAY] SIMULATION: Door relay activated for {duration} seconds")
            if callback:
                timer = threading.Timer(duration, callback)
                timer.daemon = True
                timer.start()
            return True
    
    def _deactivate_relay(self):
        """Internal method to deactivate relay"""
        if self.gpio_initialized:
            try:
                GPIO.output(self.relay_pin, GPIO.LOW)
                GPIO.output(self.led_pin, GPIO.LOW)
                print("[RELAY] Door relay deactivated")
            except Exception as e:
                print(f"[RELAY] Error deactivating relay: {e}")
        else:
            print("[RELAY] SIMULATION: Door relay deactivated")
    
    def beep_success(self, duration=0.2):
        """Beep to indicate successful access"""
        if self.gpio_initialized:
            try:
                GPIO.output(self.buzzer_pin, GPIO.HIGH)
                time.sleep(duration)
                GPIO.output(self.buzzer_pin, GPIO.LOW)
            except:
                pass
    
    def beep_denied(self, count=3, duration=0.1):
        """Beep pattern for denied access"""
        if self.gpio_initialized:
            try:
                for _ in range(count):
                    GPIO.output(self.buzzer_pin, GPIO.HIGH)
                    time.sleep(duration)
                    GPIO.output(self.buzzer_pin, GPIO.LOW)
                    time.sleep(duration)
            except:
                pass
    
    def cleanup(self):
        """Cleanup GPIO resources"""
        if self.gpio_initialized:
            try:
                GPIO.cleanup()
                print("[RELAY] GPIO cleanup completed")
            except:
                pass

# Global relay controller instance
relay_controller = RelayController()

# Convenience functions
def activate_door(duration=3, callback=None):
    """Activate door relay"""
    return relay_controller.activate_door_relay(duration, callback)

def success_beep():
    """Play success beep"""
    relay_controller.beep_success()

def denied_beep():
    """Play denied beep pattern"""
    relay_controller.beep_denied()

def cleanup_gpio():
    """Cleanup GPIO on exit"""
    relay_controller.cleanup()