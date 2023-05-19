import { useEffect, useRef, useState } from "react";
import { Clone, useGLTF } from "@react-three/drei";
import { Interactive } from "@react-three/xr";
import { Color } from "three";
import { useStore } from "../utils/store";

const Button = ({ node }) => {
  const button = useRef();
  const [pushed, setPushed] = useState(false);
  const setFrame = useStore(state => state.setFrame);
  const getFrame = useStore(state => state.getFrame);
  const handleClick = mesh => {
    const { name } = mesh;
    const [number] = /\d+/.exec(name);
    const { number: storedNumber, active } = getFrame();
    const isSameNumber = storedNumber === +number;
    setFrame(+number, isSameNumber ? !active : true);
    //e.stopPropagation();
  };
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
      onSelect={event => {
        if (event.intersection.distance < 1.5) {
          setPushed(!pushed);
          handleClick(event.intersection.object)
        }
      }}
    >
      <Clone
      //  onPointerDown={handleClick}
        ref={button}
        object={node}
        position-y={3.5}
        inject={<meshStandardMaterial color={"white"} roughness={0.1} metalness={0.5} />}
      />
    </Interactive>
  );
};
const Switches = () => {
  console.log("%c SWITCHES RENDERED", "color:green;font-weight:bold");
  const { nodes } = useGLTF("scene.gltf");
  const { buttons } = nodes;
  return buttons.children.map(button => <Button key={button.uuid} node={button} />);
};
export { Switches };
