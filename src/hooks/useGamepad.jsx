import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useController } from "@react-three/xr";
import { Euler, MathUtils, Vector3 } from "three";

const CONTROLLER_X_SENSITIVITY = 0.1;

function useGamepad() {
  const [update, setUpdate] = useState(false);
  const headsetData = {
    activeAngle: true,
    leftController: useController("left"),
    rightController: useController("right"),
  };
  const userData = {
    position: new Vector3(),
    rotation: new Euler(),
    walkSpeed: 6,
    rotationAngle: MathUtils.degToRad(25),
  };

  const gamePadPositionRef = useRef(userData.position);
  const gamePadRotationRef = useRef(userData.rotation);
  const gamePadGripLeftRef = useRef(null);
  const gamePadTriggerLeftRef = useRef(null);
  const gamePadTriggerRightRef = useRef(null);

  const posX = new Vector3();
  const posZ = new Vector3();

  useFrame(() => {
    if (headsetData.leftController && headsetData.rightController) {
      /*-----------------
      * Handle sticks 
      -----------------*/
      const { 2: lx, 3: ly } = headsetData.leftController.inputSource.gamepad.axes;
      const { 2: rx } = headsetData.rightController.inputSource.gamepad.axes;
      const stickXdirection = Math.sign(rx);
      if (stickXdirection === 0) {
        headsetData.activeAngle = true;
      }

      if (rx < -CONTROLLER_X_SENSITIVITY || rx > CONTROLLER_X_SENSITIVITY) {
        if (headsetData.activeAngle) {
          gamePadRotationRef.current.y -= Math.sign(rx) * userData.rotationAngle;
          headsetData.activeAngle = false;
        }
      }

      posX.set(lx, 0, 0);
      posZ.set(0, 0, ly);
      const acc = MathUtils.clamp(Math.abs(lx) + Math.abs(ly), 0, 1); // Compute stick position lx + ly
      gamePadPositionRef.current
        .subVectors(posZ, posX.negate())
        .normalize()
        .multiplyScalar(acc * userData.walkSpeed);

      /*-----------------
         * Handle Buttons 
        -----------------*/
      const { 0: triggerButtonLeft } = headsetData.leftController.inputSource.gamepad.buttons;
      const { 0: triggerButtonRight } = headsetData.rightController.inputSource.gamepad.buttons;
      const { 1: gripButtonLeft } = headsetData.leftController.inputSource.gamepad.buttons;
      const { 1: gripButtonRight } = headsetData.rightController.inputSource.gamepad.buttons;
      gamePadGripLeftRef.current = gripButtonLeft;
      gamePadTriggerLeftRef.current = triggerButtonLeft;
      gamePadTriggerRightRef.current = triggerButtonRight;
    }
  });

  return {
    gamepadStickPosition: gamePadPositionRef.current,
    gamepadStickRotation: gamePadRotationRef.current,
    gamepadGripLeft: gamePadGripLeftRef.current,
    gamepadTriggerLeft: gamePadTriggerLeftRef.current,
    gamepadTriggerRight: gamePadTriggerRightRef.current,
    gamepadUpdate: () => setTimeout(() => setUpdate(!update), 150),
  };
}

export { useGamepad };
