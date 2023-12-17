import { Component, MeshComponent, Property, TextComponent } from '@wonderlandengine/api';
import { CursorTarget, HowlerAudioSource } from '@wonderlandengine/components';
import { hapticFeedback } from '../my-lib/haptic-feedback.js';

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
export class ButtonComponentActiveText extends Component {
  static TypeName = 'toggle-active-text';
  static Properties = {
    /** Object that has the button's mesh attached */
    sourceObject: Property.object(),
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
    this.mesh = this.sourceObject.getComponent(MeshComponent);
    this.defaultMaterial = this.mesh.material;
    this.sourceObject.getTranslationLocal(this.returnPos);

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

    this.targetTextComponent = this.targetObject.getComponent(TextComponent);

    this.isTargetActive = this.targetTextComponent.active;

    this.labelAttributes = {
      vytahy: 'Výtahy a klimatizace',
      komin: 'Komín',
      vez: 'Věž',
      stresni: 'Střešní nástavba',
      hlavni: 'Hlavní část objektu',
    };
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
    hapticFeedback(cursor.object, 0.5, 50);
    this.hover = true;

    this.targetTextComponent.text = this.labelAttributes[this.sourceObject.name.split('_')[0]];

    this.targetTextComponent.active = true;
    this.mesh.material = this.hoverMaterial;

    return;

    if (this.toggled) {
      this.mesh.material = this.hoveredToggleMaterial;
    } else {
      this.mesh.material = this.hoverMaterial;
    }

    if (cursor.type === 'finger-cursor') {
      this.onDown(_, cursor);
    }
  };

  /* Called by 'cursor-target' */

  onDown = (_, cursor) => {
    return;
  };

  onClick = (_, cursor) => {
    // toggles material on given target

    return;
    this.toggled = !this.toggled;

    if (this.toggled) {
      console.log('Toggle');

      //   targetObject changes
      this.targetTextComponent.active = false;

      // button object changes
      this.soundClick.play();
      this.sourceObject.translate([0.0, -0.007, 0.0]);
      hapticFeedback(cursor.object, 1.0, 20);
      this.mesh.material = this.toggleMaterial;

      if (this.hover) {
        this.mesh.material = this.hoveredToggleMaterial;
      }
    } else {
      // on up implemented here
      console.log('Untoggle');

      // targetObject changes
      this.targetTextComponent.active = true;

      // button object changes
      this.soundUnClick.play();
      this.sourceObject.setTranslationLocal(this.returnPos);
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
    hapticFeedback(cursor.object, 0.3, 50);
    this.hover = false;
    this.targetTextComponent.active = false;
    this.mesh.material = this.defaultMaterial;
    return;

    if (this.toggled) {
      this.mesh.material = this.toggleMaterial;
    } else {
      this.mesh.material = this.defaultMaterial;
    }

    if (cursor.type === 'finger-cursor') {
      this.onUp(_, cursor);
    }
  };
}
