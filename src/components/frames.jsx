import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mask, useMask, useGLTF } from "@react-three/drei";
import { DoubleSide, MathUtils } from "three";
import { useStore } from "../utils/store";

const FramesGroup = ({ frames, textureProps }) => {
  return (
    <group
      name='frameGroup'
      position={[frames.position.x, frames.position.y, frames.position.z]}
      rotation={[frames.rotation.x, frames.rotation.y - 0.9, frames.rotation.z]}
    >
      {frames.children.map((frame, key) => (
        <mesh
          key={`frame-${key}`}
          geometry={frame.geometry}
          position={[...Object.values(frame.position)]}
          rotation={[frame.rotation.x, frame.rotation.y, frame.rotation.z]}
        >
          <meshStandardMaterial {...textureProps} />
        </mesh>
      ))}
    </group>
  );
};
const FramesMaskGroup = ({ frames }) => {
  const MASK_POSY_MAX = 7;
  const MASK_POSY_MIN = -0.005;
  const maskGroup = useRef();
  const { nodes } = useGLTF("masktube.glb");
  const { Tube: MaskTube } = nodes;
  MaskTube.name = "MaskTube";
  const getFrame = useStore(state => state.getFrame);
  const getFrameByNumber = number => {
    return maskGroup.current.children.filter(frame => {
      const { frameIndex } = frame.userData;
      return frameIndex === number;
    });
  };
  const stencil = useMask(1, true);
  useFrame((state, delta) => {
    const { number = null, active } = getFrame();
    if (number === null) return;
    const [mesh] = getFrameByNumber(number);
    mesh.userData.frameActive = active;
    if (mesh.userData.frameActive) {
      mesh.userData.frameStatus = "UP";
    }
    if (!mesh.userData.frameActive) {
      mesh.userData.frameStatus = "DOWN";
    }
    if (mesh.userData.frameStatus === "UP") {
      mesh.userData.framePosition = MathUtils.lerp(mesh.userData.framePosition, MASK_POSY_MAX, delta);
    }
    if (mesh.userData.frameStatus === "DOWN") {
      mesh.userData.framePosition = MathUtils.lerp(mesh.userData.framePosition, MASK_POSY_MIN, delta);
    }
    mesh.position.y = mesh.userData.framePosition;
  });

  return (
    <>
      <group
        ref={maskGroup}
        position={[frames.position.x, frames.position.y, frames.position.z]}
        rotation={[frames.rotation.x, frames.rotation.y - 0.9, frames.rotation.z]}
      >
        {frames.children.map((frame, key) => (
          <mesh
            key={`frame-${key}`}
            name={`frame-${key}`}
            geometry={frame.geometry}
            position={[frame.position.x, frame.position.y, frame.position.z]}
            rotation={[frame.rotation.x, frame.rotation.y, frame.rotation.z]}
            userData={{ frameIndex: key, framePosition: 0, frameStatus: null, frameActive: false }}
          >
            <meshBasicMaterial color={"yellow"} side={DoubleSide} {...stencil} />
          </mesh>
        ))}
      </group>
      <Mask id={1} geometry={MaskTube.geometry} position-y={11.6} />
    </>
  );
};
const FramesPaintGroup = ({ frames }) => {
  return (
    <group
      position={[frames.position.x, frames.position.y, frames.position.z]}
      rotation={[frames.rotation.x, frames.rotation.y - 0.9, frames.rotation.z]}
    >
      {frames.children.map((frame, key) => (
        <mesh
          key={`frame-${key}`}
          geometry={frame.geometry}
          position={[...Object.values(frame.position)]}
          rotation={[frame.rotation.x, frame.rotation.y, frame.rotation.z]}
        >
          <meshBasicMaterial color={"purple"} side={DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};
const Frames = ({ frames: frameNodes, textureProps }) => {
  const [frames, framesMask, framesPaint] = frameNodes;

  return (
    <>
      <FramesGroup frames={frames} textureProps={textureProps} />
      <FramesMaskGroup frames={framesMask} />
      <FramesPaintGroup frames={framesPaint} />
    </>
  );
};

export { Frames };
