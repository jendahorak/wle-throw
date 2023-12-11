import { Component, InputComponent, MeshComponent, Property } from '@wonderlandengine/api';
import { CursorTarget, HowlerAudioSource } from '@wonderlandengine/components';

/**
 * Helper function to trigger haptic feedback pulse.
 *
 * @param {Object} object An object with 'input' component attached
 * @param {number} strength Strength from 0.0 - 1.0
 * @param {number} duration Duration in milliseconds
 */
export function hapticFeedback(object, strength, duration) {
  const input = object.getComponent(InputComponent);
  if (input && input.xrInputSource) {
    const gamepad = input.xrInputSource.gamepad;
    if (gamepad && gamepad.hapticActuators) gamepad.hapticActuators[0].pulse(strength, duration);
  }
}

/**
 * Button component.
 *
 * Shows a 'hoverMaterial' on cursor hover, moves backward on cursor down,
 * returns to its position on cursor up, plays click/unclick sounds and haptic
 * feedback on hover.
 *
 * Use `target.onClick.add(() => {})` on the `cursor-target` component used
 * with the button to define the button's action.
 *
 * Supports interaction with `finger-cursor` component for hand tracking.
 */
export class ButtonComponentActive extends Component {
  static TypeName = 'toggle-active';
  static Properties = {
    /** Object that has the button's mesh attached */
    buttonMeshObject: Property.object(),
    /** Material to apply when the user hovers the button */
    hoverMaterial: Property.material(),

    targetObject: Property.object(),

    toggleMaterial: Property.material(),
  };

  static onRegister(engine) {
    engine.registerComponent(HowlerAudioSource);
    engine.registerComponent(CursorTarget);
  }

  /* Position to return to when "unpressing" the button */
  returnPos = new Float32Array(3);

  start() {
    this.mesh = this.buttonMeshObject.getComponent(MeshComponent);
    this.defaultMaterial = this.mesh.material;
    this.buttonMeshObject.getTranslationLocal(this.returnPos);

    this.target = this.object.getComponent(CursorTarget) || this.object.addComponent(CursorTarget);

    this.soundClick = this.object.addComponent(HowlerAudioSource, {
      src: 'sfx/click.wav',
      spatial: true,
    });
    this.soundUnClick = this.object.addComponent(HowlerAudioSource, {
      src: 'sfx/unclick.wav',
      spatial: true,
    });

    // toggled state
    this.toggled = false;
    this.hover = false;

    // toggle-hover material
    this.hoveredToggleMaterial = this.toggleMaterial.clone();
    const c = this.hoveredToggleMaterial.diffuseColor;

    this.hoveredToggleMaterial.diffuseColor = [c[0] * 1.2, c[1] * 1.2, c[2] * 1.2, c[3]];

    // Get target object property
    this.targetMesh = this.targetObject.getComponent(MeshComponent);
    this.isTargetActive = this.targetMesh.active;
  }

  onActivate() {
    this.target.onHover.add(this.onHover);
    this.target.onUnhover.add(this.onUnhover);
    this.target.onDown.add(this.onDown);
    this.target.onClick.add(this.onClick);
    this.target.onUp.add(this.onUp);
  }

  onDeactivate() {
    this.target.onHover.remove(this.onHover);
    this.target.onUnhover.remove(this.onUnhover);
    this.target.onDown.remove(this.onDown);
    this.target.onClick.remove(this.onClick);
    this.target.onUp.remove(this.onUp);
  }

  /* Called by 'cursor-target' */
  onHover = (_, cursor) => {
    this.hover = true;

    if (this.toggled) {
      this.mesh.material = this.hoveredToggleMaterial;
    } else {
      this.mesh.material = this.hoverMaterial;
    }

    if (cursor.type === 'finger-cursor') {
      this.onDown(_, cursor);
    }

    hapticFeedback(cursor.object, 0.5, 50);
  };

  /* Called by 'cursor-target' */

  onDown = (_, cursor) => {
    return;
  };

  onClick = (_, cursor) => {
    // toggles material on given target

    this.toggled = !this.toggled;

    if (this.toggled) {
      console.log('Toggle');

      //   targetObject changes
      this.targetMesh.active = false;

      // button object changes
      this.soundClick.play();
      this.buttonMeshObject.translate([0.0, -0.01, 0.0]);
      hapticFeedback(cursor.object, 1.0, 20);
      this.mesh.material = this.toggleMaterial;

      if (this.hover) {
        this.mesh.material = this.hoveredToggleMaterial;
      }
    } else {
      // on up implemented here
      console.log('Untoggle');

      // targetObject changes
      this.targetMesh.active = true;

      // button object changes
      this.soundUnClick.play();
      this.buttonMeshObject.setTranslationLocal(this.returnPos);
      hapticFeedback(cursor.object, 0.7, 20);

      if (this.hover) {
        this.mesh.material = this.hoverMaterial;
      }
    }
  };

  /* Called by 'cursor-target' */
  onUp = (_, cursor) => {
    return;
  };

  /* Called by 'cursor-target' */
  onUnhover = (_, cursor) => {
    this.hover = false;

    if (this.toggled) {
      this.mesh.material = this.toggleMaterial;
    } else {
      this.mesh.material = this.defaultMaterial;
    }

    if (cursor.type === 'finger-cursor') {
      this.onUp(_, cursor);
    }

    hapticFeedback(cursor.object, 0.3, 50);
  };
}
