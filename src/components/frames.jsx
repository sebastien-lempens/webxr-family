import { useRef } from "react";
import { applyProps, useFrame } from "@react-three/fiber";
import { MeshPortalMaterial, Plane, useTexture, useAspect } from "@react-three/drei";
import { DoubleSide, MathUtils } from "three";
import { Interactive } from "@react-three/xr";

const FramesGroup = ({ frames, textureProps }) => {
  return (
    <group
      name='frameGroup'
      position={[frames.position.x, frames.position.y, frames.position.z]}
      rotation={[frames.rotation.x, frames.rotation.y, frames.rotation.z]}
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

const Frame = ({ frame }) => {
  const MAXPOS = 7;
  const MINPOS = 0.01;
  const sliderRef = useRef(null);
  //const {frameNumber} = frame.userData
  const { frameNumber } = { frameNumber: "00" };
  const texture = useTexture(`textures/family-portrait-${frameNumber}.jpg`);
  const scale = useAspect(1024, 1024, 0.35);
  useFrame((_, delta) => {
    frame.userData.slidePosition = MathUtils.clamp(
      MathUtils.lerp(frame.userData.slidePosition, frame.userData.opened ? MAXPOS : MINPOS, delta),
      MINPOS,
      MAXPOS
    );
    sliderRef.current.position.y = frame.userData.slidePosition;
  });
  return (
    <>
      <Plane ref={sliderRef} args={[1, 2]} scale={3.5} rotation-y={-Math.PI / 2}>
        <meshBasicMaterial color={"grey"} />
      </Plane>
      <Plane args={[1, 2]} scale={scale} rotation-y={-Math.PI / 2}>
        <meshBasicMaterial map={texture} polygonOffset polygonOffsetFactor={1} />
      </Plane>
    </>
  );
};

const FramesPaintGroup = ({ frames }) => {
  return (
    <group
      position={[frames.position.x, frames.position.y, frames.position.z]}
      rotation={[frames.rotation.x, frames.rotation.y, frames.rotation.z]}
    >
      {frames.children.map((frame, key) => (
        <Interactive
          key={`frame-${key}`}
          onSelect={e => {
            frame.userData.opened = !frame.userData.opened;
          }}
        >
          <mesh
            geometry={frame.geometry}
            position={[...Object.values(frame.position)]}
            rotation={[frame.rotation.x, frame.rotation.y, frame.rotation.z]}
          >
            <MeshPortalMaterial side={DoubleSide}>
              <Frame frame={frame} />
            </MeshPortalMaterial>
          </mesh>
        </Interactive>
      ))}
    </group>
  );
};
const Frames = ({ object, textureProps }) => {
  const [frames, framesPaint] = object;
  framesPaint.children.forEach((mesh, index) => {
    applyProps(mesh.userData, { frameNumber: index.toString().padStart(2, "0"), opened: false, slidePosition: 0 });
    return mesh;
  });
  return (
    <group>
      <FramesGroup frames={frames} textureProps={textureProps} />
      <FramesPaintGroup frames={framesPaint} />
    </group>
  );
};

export { Frames };
