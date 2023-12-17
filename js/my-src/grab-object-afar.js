import { Component, Property } from '@wonderlandengine/api';
import { CursorTarget } from '@wonderlandengine/components';
import { vec3 } from 'gl-matrix';

/**
 * grab-object-afar
 */
export class GrabObjectAfar extends Component {
  static TypeName = 'grab-object-afar';
  /* Properties that are configurable in the editor */
  static Properties = {};

  static onRegister(engine) {
    engine.registerComponent(CursorTarget);
    /* Triggered when this component class is registered.
     * You can for instance register extra component types here
     * that your component may create. */
  }

  init() {
    this._originalLocalPosition = vec3.create();
    this._isGrabbed = false;
  }

  start() {
    // Button Setup
    this.target = this.object.getComponent(CursorTarget) || this.object.addComponent(CursorTarget);

    // getting the local position
    this.object.getPositionLocal(this._originalLocalPosition);
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

  onDown = (_, cursor) => {
    console.log('Clicked');
    if (this._isGrabbed) {
      return;
    }
    this._isGrabbed = true;
    const tempVec = vec3.create();
    cursor.object.getPositionWorld(tempVec);
    this.object.setPositionWorld(tempVec);
  };

  onUp = (_, cursor) => {
    console.log('On Up');
    if (!this._isGrabbed) {
      return;
    }
    this._isGrabbed = false;
    this.object.setPositionLocal(this._originalLocalPosition);
  };

  update(dt) {
    /* Called every frame. */
  }

  onHover = (_, cursor) => {
    return;
  };
  onUnhover = (_, cursor) => {
    return;
  };

  onClick = (_, cursor) => {
    return;
  };
}
