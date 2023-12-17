import { InputComponent } from '@wonderlandengine/api';

/**
 * Helper function to trigger haptic feedback pulse.

 * @param {Object} object An object with 'input' component attached
 * @param {number} strength Strength from 0.0 - 1.0
 * @param {number} duration Duration in milliseconds
 */
export function hapticFeedback(object, strength, duration) {
  if (object.name === 'Camera Non XR') {
    return;
  }

  console.log(object.name);

  let input = object.getComponent(InputComponent);

  // Workaround for Adjusted cursor angle - done by making cursor a child of gamepad and then input child of the curosorparent
  if (input == null) {
    // console.log('Input not on same object as cursor.');
    input = object.findByName('InputAdjusted', true)[0].getComponent(InputComponent);

    console.log(input.xrInputSource);
  }
  if (input && input.xrInputSource) {
    // console.log('found gamepad');
    const gamepad = input.xrInputSource.gamepad;
    if (gamepad && gamepad.hapticActuators) gamepad.hapticActuators[0].pulse(strength, duration);
  }
}
