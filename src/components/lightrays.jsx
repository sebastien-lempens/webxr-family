import React from "react";
import { SpotLight } from "@react-three/drei";

function Lightrays() {
  return (
    <>
      <SpotLight
        visible={true}
        color={"#fff"}
        castShadow
        position={[-11, 40, -5]}
        distance={50}
        angle={0.05} 
        anglePower={5}
        radiusTop={0}
        radiusBottom={7}
        attenuation={44}
      />
      <SpotLight
        visible={true}
        color={"#fff"}
        castShadow
        position={[-11, 40, -5]}
        distance={50}
        angle={0.05}
        anglePower={4}
        radiusTop={0}
        radiusBottom={5}
        attenuation={40}
      />
      <SpotLight
        visible={true}
        color={"#fff"}
        castShadow
        position={[-11, 40, -5]}
        distance={50}
        angle={0.05}
        anglePower={3}
        radiusTop={0}
        radiusBottom={3}
        attenuation={41}
      />
    </>
  );
}

export { Lightrays };
