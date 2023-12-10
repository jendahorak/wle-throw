/**
 * /!\ This file is auto-generated.
 *
 * This is the entry point of your standalone application.
 *
 * There are multiple tags used by the editor to inject code automatically:
 *     - `wle:auto-imports:start` and `wle:auto-imports:end`: The list of import statements
 *     - `wle:auto-register:start` and `wle:auto-register:end`: The list of component to register
 *     - `wle:auto-constants:start` and `wle:auto-constants:end`: The project's constants,
 *        such as the project's name, whether it should use the physx runtime, etc...
 *     - `wle:auto-benchmark:start` and `wle:auto-benchmark:end`: Append the benchmarking code
 */

/* wle:auto-imports:start */
import {Cursor} from '@wonderlandengine/components';
import {CursorTarget} from '@wonderlandengine/components';
import {FixedFoveation} from '@wonderlandengine/components';
import {MouseLookComponent} from '@wonderlandengine/components';
import {TargetFramerate} from '@wonderlandengine/components';
import {ConsoleVRToolComponent} from 'wle-pp';
import {EasyScaleComponent} from 'wle-pp';
import {EasyTuneToolComponent} from 'wle-pp';
import {GamepadMeshAnimatorComponent} from 'wle-pp';
import {GrabbableComponent} from 'wle-pp';
import {GrabberHandComponent} from 'wle-pp';
import {InputManagerComponent} from 'wle-pp';
import {PPGatewayComponent} from 'wle-pp';
import {PlayerLocomotionComponent} from 'wle-pp';
import {SetHandLocalTransformComponent} from 'wle-pp';
import {SetHeadLocalTransformComponent} from 'wle-pp';
import {ShowFPSComponent} from 'wle-pp';
import {SpatialAudioListenerComponent} from 'wle-pp';
import {SwitchHandObjectComponent} from 'wle-pp';
import {ToolCursorComponent} from 'wle-pp';
import {TrackedHandDrawAllJointsComponent} from 'wle-pp';
import {ButtonComponent} from './button.js';
import {ButtonComponent as ButtonComponent1} from './toggle-button.js';
/* wle:auto-imports:end */

import { loadRuntime } from '@wonderlandengine/api';

/* wle:auto-constants:start */
const RuntimeOptions = {
    physx: true,
    loader: false,
    xrFramebufferScaleFactor: 1,
    canvas: 'canvas',
};
const Constants = {
    ProjectName: '006_physics',
    RuntimeBaseName: 'WonderlandRuntime',
    WebXRRequiredFeatures: ['local',],
    WebXROptionalFeatures: ['local','hand-tracking','hit-test',],
};
/* wle:auto-constants:end */

const engine = await loadRuntime(Constants.RuntimeBaseName, RuntimeOptions);

engine.onSceneLoaded.once(() => {
    const el = document.getElementById('version');
    if (el) setTimeout(() => el.remove(), 2000);
});

/* WebXR setup. */

function requestSession(mode) {
    engine
        .requestXRSession(mode, Constants.WebXRRequiredFeatures, Constants.WebXROptionalFeatures)
        .catch((e) => console.error(e));
}

function setupButtonsXR() {
    /* Setup AR / VR buttons */
    const arButton = document.getElementById('ar-button');
    if (arButton) {
        arButton.dataset.supported = engine.arSupported;
        arButton.addEventListener('click', () => requestSession('immersive-ar'));
    }
    const vrButton = document.getElementById('vr-button');
    if (vrButton) {
        vrButton.dataset.supported = engine.vrSupported;
        vrButton.addEventListener('click', () => requestSession('immersive-vr'));
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('load', setupButtonsXR);
} else {
    setupButtonsXR();
}

/* wle:auto-register:start */
engine.registerComponent(Cursor);
engine.registerComponent(CursorTarget);
engine.registerComponent(FixedFoveation);
engine.registerComponent(MouseLookComponent);
engine.registerComponent(TargetFramerate);
engine.registerComponent(ConsoleVRToolComponent);
engine.registerComponent(EasyScaleComponent);
engine.registerComponent(EasyTuneToolComponent);
engine.registerComponent(GamepadMeshAnimatorComponent);
engine.registerComponent(GrabbableComponent);
engine.registerComponent(GrabberHandComponent);
engine.registerComponent(InputManagerComponent);
engine.registerComponent(PPGatewayComponent);
engine.registerComponent(PlayerLocomotionComponent);
engine.registerComponent(SetHandLocalTransformComponent);
engine.registerComponent(SetHeadLocalTransformComponent);
engine.registerComponent(ShowFPSComponent);
engine.registerComponent(SpatialAudioListenerComponent);
engine.registerComponent(SwitchHandObjectComponent);
engine.registerComponent(ToolCursorComponent);
engine.registerComponent(TrackedHandDrawAllJointsComponent);
engine.registerComponent(ButtonComponent);
engine.registerComponent(ButtonComponent1);
/* wle:auto-register:end */

let loadDelaySeconds = 0;
if (loadDelaySeconds > 0) {
    setTimeout(() => engine.scene.load(`${Constants.ProjectName}.bin`), loadDelaySeconds * 1000);
} else {
    engine.scene.load(`${Constants.ProjectName}.bin`);
}

/* wle:auto-benchmark:start */
/* wle:auto-benchmark:end */
