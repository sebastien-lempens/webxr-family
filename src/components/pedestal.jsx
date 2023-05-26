import { useRef } from "react";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { Clone, CubeCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
const Pedestal = ({ object, textureProps }) => {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      const scult = ref.current.getObjectByName("@");
      scult.rotation.y += 0.0035;
    }
  });
  return (
    <RigidBody type='fixed' colliders={false}>
      <CapsuleCollider args={[1.5, 1.5]} position={[0, 2, 0]} />
      <CubeCamera frames={1} position={[0, 5, 0]}>
        {texture => {
          return (
            <Clone
              ref={ref}
              name='table'
              object={object}
              position-y={-1.9}
              inject={<meshStandardMaterial roughness={0.3} metalness={0.8} envMapIntensity={0.2} envMap={texture} {...textureProps} />}
            />
          );
        }}
      </CubeCamera>
      <spotLight position={[0, 8, 0]} />
    </RigidBody>
  );
};
export { Pedestal };
