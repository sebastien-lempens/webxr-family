import { useRef } from "react";
import { Clone } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
const Walls = ({ object, textureProps }) => {
  const ref = useRef();
  useFrame(() => {
    ref.current.rotation.y += 0.001;
  });
  return <Clone ref={ref} visible={true} object={object} inject={<meshStandardMaterial {...textureProps} />} />;
};
export { Walls };
