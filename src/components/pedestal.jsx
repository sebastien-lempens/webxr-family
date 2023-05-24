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
      <CubeCamera frames={1} position={[0, 0, 0]}>
        {texture => <Clone ref={ref} name='table' object={object} inject={<meshStandardMaterial roughness={0.5} envMapIntensity={5} envMap={texture} {...textureProps} />} />}
      </CubeCamera>
    </RigidBody>
  );
};
export { Pedestal };
