import { Component, InputComponent, MeshComponent, Property, Material } from '@wonderlandengine/api';
import { CursorTarget, HowlerAudioSource } from '@wonderlandengine/components';

export function hapticFeedback(object, strength, duration) {
  const input = object.getComponent(InputComponent);
  if (input && input.xrInputSource) {
    const gamepad = input.xrInputSource.gamepad;
    if (gamepad && gamepad.hapticActuators) gamepad.hapticActuators[0].pulse(strength, duration);
  }
}

export class ButtonComponentActive extends Component {
  static TypeName = 'toggle-active';
  static Properties = {
    buttonMeshObject: Property.object(),
    hoverMaterial: Property.material(),
    targetObject: Property.object(),
    toggleMaterial: Property.material(),
  };

  static onRegister(engine) {
    engine.registerComponent(HowlerAudioSource);
    engine.registerComponent(CursorTarget);
  }

  returnPos = new Float32Array(3);

  start() {
    this.initializeMesh();
    this.initializeTarget();
    this.initializeSounds();
    this.initializeState();
  }

  initializeMesh() {
    this.mesh = this.buttonMeshObject.getComponent(MeshComponent);
    this.defaultMaterial = this.mesh.material;
    this.buttonMeshObject.getTranslationLocal(this.returnPos);
  }

  initializeTarget() {
    this.target = this.object.getComponent(CursorTarget) || this.object.addComponent(CursorTarget);
    this.targetMesh = this.targetObject.getComponent(MeshComponent);
    this.isTargetActive = this.targetMesh.active;
  }

  initializeSounds() {
    this.soundClick = this.object.addComponent(HowlerAudioSource, {
      src: 'sfx/click.wav',
      spatial: true,
    });
    this.soundUnClick = this.object.addComponent(HowlerAudioSource, {
      src: 'sfx/unclick.wav',
      spatial: true,
    });
  }

  initializeState() {
    this.toggled = false;
    this.hover = false;
    this.hoveredToggleMaterial = this.toggleMaterial.clone();
    const c = this.hoveredToggleMaterial.diffuseColor;
    this.hoveredToggleMaterial.diffuseColor = [c[0] * 1.2, c[1] * 1.2, c[2] * 1.2, c[3]];
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

  onHover = (_, cursor) => {
    this.hover = true;
    this.mesh.material = this.toggled ? this.hoveredToggleMaterial : this.hoverMaterial;
    if (cursor.type === 'finger-cursor') this.onDown(_, cursor);
    hapticFeedback(cursor.object, 0.5, 50);
  };

  onDown = (_, cursor) => {
    return;
  };

  onClick = (_, cursor) => {
    this.toggled = !this.toggled;
    this.targetMesh.active = !this.toggled;
    this.mesh.material = this.toggled ? this.toggleMaterial : this.hoverMaterial;
    this.playSoundAndMoveButton(cursor);
  };

  playSoundAndMoveButton(cursor) {
    if (this.toggled) {
      this.soundClick.play();
      this.buttonMeshObject.translate([0.0, -0.01, 0.0]);
      hapticFeedback(cursor.object, 1.0, 20);
    } else {
      this.soundUnClick.play();
      this.buttonMeshObject.setTranslationLocal(this.returnPos);
      hapticFeedback(cursor.object, 0.7, 20);
    }
  }

  onUp = (_, cursor) => {
    return;
  };

  onUnhover = (_, cursor) => {
    this.hover = false;
    this.mesh.material = this.toggled ? this.toggleMaterial : this.defaultMaterial;
    if (cursor.type === 'finger-cursor') this.onUp(_, cursor);
    hapticFeedback(cursor.object, 0.3, 50);
  };
}
