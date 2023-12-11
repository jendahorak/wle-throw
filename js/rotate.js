import { Component, Property } from '@wonderlandengine/api';

/**
 * documentation
 */
export class Documentation extends Component {
  static TypeName = 'rotate';
  /* Properties that are configurable in the editor */
  static Properties = {
    param: Property.float(1.0),
  };

  static onRegister(engine) {
    /* Triggered when this component class is registered.
     * You can for instance register extra component types here
     * that your component may create. */
  }

  init() {
    console.log('init() with param', this.param);
  }

  start() {
    console.log('start() with param', this.param);
  }

  update(dt) {
    this.object.rotateAxisAngleDegObject([0, 1, 0], dt * this.param);
    /* Called every frame. */
  }
}
