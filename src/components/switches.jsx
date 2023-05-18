import { useEffect, useRef, useState } from "react";
import { Clone, useGLTF } from "@react-three/drei";
import { Interactive } from "@react-three/xr";
import { Color } from "three";
const Button = ({ node }) => {
  const button = useRef();
  const [pushed, setPushed] = useState(false);
  useEffect(() => {
    const [child] = button.current.children;
    child.material.color = new Color("black");
    child.position.x = 0.1;
    if (pushed) {
      child.material.color = new Color("green");
      child.position.x = 0.0;
    } else {
      child.material.color = new Color("black");
      child.position.x = 0.1;
    }
  }, [pushed]);

  return (
    <Interactive
      onSelect={({ intersection }) => {
        if (intersection.distance < 1.5) {
          setPushed(!pushed);
        }
      }}
    >
      <Clone
        ref={button}
        object={node}
        position-y={3.5}
        inject={<meshStandardMaterial color={"white"} roughness={0.1} metalness={0.5} />}
      ></Clone>
    </Interactive>
  );
};
const Switches = () => {
  const { nodes } = useGLTF("scene.gltf");
  const { buttons } = nodes;
  return buttons.children.map(button => <Button key={button.uuid} node={button} />);
};
export { Switches };
