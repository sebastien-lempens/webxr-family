import { useRef } from "react";
import { Clone } from "@react-three/drei";
const Walls = ({ object, textureProps }) => {
  const ref = useRef();
  return <Clone ref={ref} object={object} inject={<meshStandardMaterial {...textureProps} />} />;
};
export { Walls };
