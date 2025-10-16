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
    
    Security Feature: Relay is LOCKED (LOW) by default and only opens during successful attendance.
    """
    def __init__(self, relay_pin=18, led_pin=24, buzzer_pin=23):
        """Initialize controller.
        Defaults previously used relay_pin=18. Fingerprint reference (relay.txt) uses pin 17 and 5s unlock.
        Allow overriding via environment variables RELAY_PIN / RELAY_DEFAULT_DURATION.
        
        IMPORTANT: Relay starts in LOCKED state (GPIO.LOW) for security.
        """
        import os
        # Prefer environment variable if provided, else keep backward compatible default argument.
        env_relay_pin = os.getenv("RELAY_PIN")
        if env_relay_pin is not None:
            try:
                relay_pin = int(env_relay_pin)
            except ValueError:
                print(f"[RELAY] Invalid RELAY_PIN env value '{env_relay_pin}', falling back to {relay_pin}")

        # Align with relay.txt reference (pin 17). If user did not explicitly override (still default 18) choose 17.
        if relay_pin == 18 and os.getenv("RELAY_PIN") is None:
            # Switch to 17 for consistency with fingerprint implementation
            relay_pin = 17

        self.relay_pin = relay_pin
        self.led_pin = led_pin
        self.buzzer_pin = buzzer_pin
        self.gpio_initialized = False
        self.door_locked = True  # Track door lock state for security
        
        # Initialize GPIO if available
        if GPIO_AVAILABLE:
            self.init_gpio()
        else:
            # Even in simulation mode, ensure door starts locked
            print("[RELAY] SIMULATION MODE: Door initialized in LOCKED state")
        
    def init_gpio(self):
        """Initialize GPIO pins - Relay starts LOCKED for security"""
        try:
            GPIO.setmode(GPIO.BCM)
            GPIO.setwarnings(False)
            
            # Setup relay pin - START IN LOCKED STATE (LOW)
            GPIO.setup(self.relay_pin, GPIO.OUT)
            GPIO.output(self.relay_pin, GPIO.LOW)  # LOCKED by default - SECURITY FEATURE
            self.door_locked = True
            
            # Setup LED indicator (optional)
            GPIO.setup(self.led_pin, GPIO.OUT)
            GPIO.output(self.led_pin, GPIO.LOW)
            
            # Setup buzzer (optional)
            GPIO.setup(self.buzzer_pin, GPIO.OUT)
            GPIO.output(self.buzzer_pin, GPIO.LOW)
            
            self.gpio_initialized = True
            print(f"[RELAY] GPIO initialized successfully on pin {self.relay_pin}")
            print(f"[RELAY] 🔒 Door LOCKED (Security feature: door locked by default)")
            
        except Exception as e:
            print(f"[RELAY] GPIO initialization failed: {e}")
            self.gpio_initialized = False
    
    def activate_door_relay(self, duration=3, callback=None):
        """
        Activate door relay for specified duration
        This is the ONLY function that unlocks the door - called during successful attendance
        
        Args:
            duration: seconds to keep door open (default 5 seconds for consistency with fingerprint system)
            callback: function to call when door closes
        
        Security: Door automatically locks after duration expires
        """
        # If user wants default from fingerprint script (5 seconds), allow env override
        import os
        default_duration = os.getenv("RELAY_DEFAULT_DURATION")
        if default_duration is not None:
            try:
                env_dur = float(default_duration)
                if duration == 3:  # only replace if caller used default
                    duration = env_dur
            except ValueError:
                print(f"[RELAY] Invalid RELAY_DEFAULT_DURATION '{default_duration}', using {duration}s")

        # If duration still 3 (legacy default) switch to 5 to mirror relay.txt reference
        if duration == 3 and default_duration is None:
            duration = 5
        if self.gpio_initialized:
            # Real GPIO control
            try:
                print(f"[RELAY] 🔓 UNLOCKING door relay for {duration} seconds (successful attendance)")
                
                # Turn on relay and LED - UNLOCK DOOR
                GPIO.output(self.relay_pin, GPIO.HIGH)
                GPIO.output(self.led_pin, GPIO.HIGH)
                self.door_locked = False
                
                # Success beep
                self.beep_success()
                
                # Schedule relay deactivation - AUTO LOCK after duration
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
                # Ensure door stays locked on error
                self._ensure_locked()
                return False
        else:
            # Simulation mode
            print(f"[RELAY] SIMULATION: 🔓 Door relay UNLOCKED for {duration} seconds (successful attendance)")
            self.door_locked = False
            
            # Auto-lock simulation
            def sim_lock():
                self.door_locked = True
                print("[RELAY] SIMULATION: 🔒 Door relay auto-LOCKED")
                if callback:
                    callback()
                    
            timer = threading.Timer(duration, sim_lock)
            timer.daemon = True
            timer.start()
            return True
    
    def _deactivate_relay(self):
        """Internal method to deactivate relay - AUTO LOCK for security"""
        if self.gpio_initialized:
            try:
                GPIO.output(self.relay_pin, GPIO.LOW)
                GPIO.output(self.led_pin, GPIO.LOW)
                self.door_locked = True
                print("[RELAY] 🔒 Door relay LOCKED (auto-lock after timeout)")
            except Exception as e:
                print(f"[RELAY] Error deactivating relay: {e}")
                # Force lock state even if GPIO fails
                self._ensure_locked()
        else:
            self.door_locked = True
            print("[RELAY] SIMULATION: 🔒 Door relay LOCKED (auto-lock)")
    
    def _ensure_locked(self):
        """Emergency function to ensure door is locked"""
        if self.gpio_initialized:
            try:
                GPIO.output(self.relay_pin, GPIO.LOW)
                GPIO.output(self.led_pin, GPIO.LOW)
                self.door_locked = True
                print("[RELAY] 🔒 Emergency LOCK activated")
            except:
                pass
    
    def get_door_status(self):
        """Get current door lock status"""
        return "LOCKED" if self.door_locked else "UNLOCKED"
    
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
        """Cleanup GPIO resources - ENSURE DOOR IS LOCKED"""
        if self.gpio_initialized:
            try:
                # IMPORTANT: Lock door before cleanup for security
                GPIO.output(self.relay_pin, GPIO.LOW)
                GPIO.output(self.led_pin, GPIO.LOW)
                GPIO.output(self.buzzer_pin, GPIO.LOW)
                self.door_locked = True
                print("[RELAY] 🔒 Door LOCKED before GPIO cleanup (security)")
                GPIO.cleanup()
                print("[RELAY] GPIO cleanup completed")
            except Exception as e:
                print(f"[RELAY] Cleanup error: {e}")
        else:
            print("[RELAY] SIMULATION: Cleanup - door LOCKED")

# Global relay controller instance
relay_controller = RelayController()

# Convenience functions
def activate_door(duration=3, callback=None):
    """Activate door relay - ONLY called during successful attendance"""
    return relay_controller.activate_door_relay(duration, callback)

def success_beep():
    """Play success beep"""
    relay_controller.beep_success()

def denied_beep():
    """Play denied beep pattern"""
    relay_controller.beep_denied()

def cleanup_gpio():
    """Cleanup GPIO on exit - ENSURES DOOR IS LOCKED"""
    relay_controller.cleanup()

def get_door_status():
    """Get current door status"""
    return relay_controller.get_door_status()

def ensure_door_locked():
    """Force door to locked state - emergency function"""
    relay_controller._ensure_locked()