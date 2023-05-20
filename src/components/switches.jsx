import { useEffect, useRef, useState } from "react";
import { Clone } from "@react-three/drei";
import { Interactive } from "@react-three/xr";
import { useStore } from "../utils/store";

const Button = ({ node }) => {
  const button = useRef();
  const [pushed, setPushed] = useState(false);
  const setFrame = useStore(state => state.setFrame);
  const getFrame = useStore(state => state.getFrame);
  const handleClick = mesh => {
    const { name } = mesh;
    const [number = 0] = /\d+/.exec(name) ?? [];
    const { number: storedNumber, active } = getFrame();
    const isSameNumber = storedNumber === +number;
    setFrame(+number, isSameNumber ? !active : true);
    //e.stopPropagation();
  };
  useEffect(() => {
    const { 1: child } = button.current.children;
    if (pushed) {
      child.position.y -= 0.02;
    } else {
      child.position.y = 0;
    }
  }, [pushed]);

  return (
    <Interactive
    onHover={event => {
        if (event.intersection.distance < 1.5) {
          setPushed(!pushed);
          handleClick(event.intersection.object);
        }
      }}
    >
      <Clone
        onPointerDown={e => {
          setPushed(!pushed);
          handleClick(e.object);
          e.stopPropagation();
        }}
        ref={button}
        object={node}
        position-y={2.46}
        inject={<meshStandardMaterial   roughness={0.1} metalness={0.5} />}
      />
    </Interactive>
  );
};
const Switches = ({ object }) => {
  console.log("%c SWITCHES RENDERED", "color:green;font-weight:bold");
  return (
    <group rotation-y={0.8} position-y={0.84}>
      {object.children.map(button => (
        <Button key={button.uuid} node={button} />
      ))}
    </group>
  );
};
export { Switches };
