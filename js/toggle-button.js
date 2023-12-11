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
export class ButtonComponent extends Component {
  static TypeName = 'toggle-button';
  static Properties = {
    /** Object that has the button's mesh attached */
    buttonMeshObject: Property.object(),
    /** Material to apply when the user hovers the button */
    hoverMaterial: Property.material(),

    buttonTargetObejct: Property.object(),

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

    // My changes - 10.12
    this.targetMesh = this.buttonTargetObejct.getComponent(MeshComponent);
    this.defaultTargetMaterial = this.targetMesh.material;
    console.log('This is target object mesh component: ', this.targetMesh);
    console.log('This is material of button: ', this.defaultMaterial);
    console.log('This is curr material of target: ', this.targetMesh.material);
    console.log('This is initial target material: ', this.defaultTargetMaterial);

    // toggled state
    this.toggled = false;
  }

  onActivate() {
    this.target.onHover.add(this.onHover);
    this.target.onUnhover.add(this.onUnhover);
    this.target.onDown.add(this.onDown);
    this.target.onClick.add(this.onClick);
    // this.target.onUp.add(this.onUp);
  }

  onDeactivate() {
    this.target.onHover.remove(this.onHover);
    this.target.onUnhover.remove(this.onUnhover);
    this.target.onDown.remove(this.onDown);
    // this.target.onUp.remove(this.onUp);
  }

  /* Called by 'cursor-target' */
  onHover = (_, cursor) => {
    this.mesh.material = this.hoverMaterial;

    if (cursor.type === 'finger-cursor') {
      this.onDown(_, cursor);
    }

    hapticFeedback(cursor.object, 0.5, 50);
  };

  /* Called by 'cursor-target' */

  // onDown = (_, cursor) => {
  //   // toggles material on given target

  //   this.toggled = !this.toggled;

  //   if (this.toggled) {
  //     console.log('Toggle');

  //     this.targetMesh.material = this.hoverMaterial;

  //     this.soundClick.play();
  //     this.buttonMeshObject.translate([0.0, -0.01, 0.0]);
  //     hapticFeedback(cursor.object, 1.0, 20);

  //     this.mesh.material = this.toggleMaterial;
  //   } else {
  //     // on up implemented here
  //     console.log('Untoggle');

  //     this.targetMesh.material = this.defaultTargetMaterial;
  //     this.soundUnClick.play();
  //     this.buttonMeshObject.setTranslationLocal(this.returnPos);
  //     hapticFeedback(cursor.object, 0.7, 20);
  //   }
  // };

  onClick = (_, cursor) => {
    // toggles material on given target

    this.toggled = !this.toggled;

    if (this.toggled) {
      console.log('Toggle');

      this.targetMesh.material = this.hoverMaterial;

      this.soundClick.play();
      this.buttonMeshObject.translate([0.0, -0.01, 0.0]);
      hapticFeedback(cursor.object, 1.0, 20);

      this.mesh.material = this.toggleMaterial;
    } else {
      // on up implemented here
      console.log('Untoggle');

      this.targetMesh.material = this.defaultTargetMaterial;
      this.soundUnClick.play();
      this.buttonMeshObject.setTranslationLocal(this.returnPos);
      hapticFeedback(cursor.object, 0.7, 20);
    }
  };

  //   /* Called by 'cursor-target' */
  //   onUp = (_, cursor) => {
  //     console.log('onUp called');
  //     this.soundUnClick.play();
  //     this.buttonMeshObject.setTranslationLocal(this.returnPos);
  //     hapticFeedback(cursor.object, 0.7, 20);
  //   };

  /* Called by 'cursor-target' */
  onUnhover = (_, cursor) => {
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
