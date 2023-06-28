import { useRef, useState } from "react";
import { useXR } from "@react-three/xr";
import { Hands } from "./hands";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { useGamepad } from "../../hooks/useGamepad";

function Player() {
  const { gl } = useThree();
  const { player } = useXR();
  const rigidBodyApi = useRef(null);
  const { gamepadStickPosition, gamepadStickRotation } = useGamepad();
  const [onLoadControllers, setOnLoadControllers] = useState(false);
  const controllerLeft = gl.xr.getController(0);
  const controllerRight = gl.xr.getController(1);
  player.position.y = 5;

  controllerLeft.addEventListener("connected", () => {
    controllerRight.addEventListener("connected", () => {
      setOnLoadControllers(true);
    });
  });
  useFrame(() => {
    player.rotation.copy(gamepadStickRotation); // 1. Tie stick rotation to the Player Object3D
    player.position.copy(gamepadStickPosition.applyEuler(player.rotation)); // 2. Tie stick position + compute the rotation
    rigidBodyApi.current.setLinvel(player.position); // 3. Copy player position to the RigidBody's Linear Velocity
     player.position.copy(rigidBodyApi.current.translation()); //4 Tie again RigidBody's Linear Velocity to the Player Object3D
    player.translateX(0.3); //5 Fix Center Player / Rigidbody position
    player.translateZ(0); //5 Fix Center Player / Rigidbody position
  });

  return (
    <>
      <RigidBody
        gravityScale={8.6}
        colliders={false}
        position-z={5}
        position-y={2}
        ref={rigidBodyApi}
        canSleep={false}
        enabledRotations={[false, false, false]}
        type='kinematicVelocityBased'
      >
        <CapsuleCollider args={[0.8, 0.8]} />
      </RigidBody>
      {onLoadControllers && <Hands />}
    </>
  );
}
export { Player };
