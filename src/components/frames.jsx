import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { PivotControls, Mask, useMask } from "@react-three/drei";
import { DoubleSide, Vector3 } from "three";
const Frame = ({ frame, textureProps }) => {
  const frameRef = useRef();
  const stencil = useMask(1, true);
  const [slider] = frame.children;
  useEffect(() => {
    frameRef.current.position.add(new Vector3(-0.4, 0, 0));
  }, []);
  useFrame(() => {
    // console.log(frameRef.current.position);
    if (frameRef.current) {
      //frameRef.current.position.y += 0.01;
    }
  });

  return (
    <>
      <PivotControls offset={[0, 0, 1]} activeAxes={[true, true, true]} disableRotations depthTest={false}>
        <mesh>
          <ringGeometry args={[0.75, 0.85, 64]} />
          <meshPhongMaterial color='black' />
        </mesh>
        <Mask id={1} position={[4, 2, -15]}>
          <circleGeometry args={[0.8, 64]} />
        </Mask>
      </PivotControls>
      <mesh
        geometry={frame.geometry}
        position={[...Object.values(frame.position)]}
        rotation={[frame.rotation.x, frame.rotation.y, frame.rotation.z]}
      >
        <meshStandardMaterial {...textureProps} />
      </mesh>
      <mesh
        ref={frameRef}
        geometry={slider.geometry}
        position={[...Object.values(frame.position)]}
        rotation={[frame.rotation.x, frame.rotation.y, frame.rotation.z]}
      >
        <meshBasicMaterial color={"yellow"} {...stencil} />
      </mesh>
    </>
  );
};
const FramesGroup = ({ frames, textureProps }) => {
  return (
    <group
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
const FramesMaskGroup = ({ frames }) => {
  const stencil = useMask(1, true);
  return (
    <>
      <group
        position={[frames.position.x, frames.position.y, frames.position.z]}
        rotation={[frames.rotation.x, frames.rotation.y, frames.rotation.z]}
      >
        {frames.children.map((frame, key) => (
          <group  key={`pivot-${key}`} >
            <PivotControls offset={[0, 0, 1]} activeAxes={[true, true, true]} disableRotations depthTest={false}>
              <mesh>
                <ringGeometry args={[0.75, 0.85, 64]} />
                <meshPhongMaterial color='black' />
              </mesh>
              <Mask id={1}  >
                <circleGeometry args={[0.8, 64]} />
              </Mask>
            </PivotControls>

            <mesh
              key={`frame-${key}`}
              geometry={frame.geometry}
              position={[...Object.values(frame.position)]}
              rotation={[frame.rotation.x, frame.rotation.y, frame.rotation.z]}
            >
              <meshBasicMaterial color={"yellow"} side={DoubleSide} {...stencil} />
            </mesh>
          </group>
        ))}
      </group>
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
        <mesh
          key={`frame-${key}`}
          geometry={frame.geometry}
          position={[...Object.values(frame.position)]}
          rotation={[frame.rotation.x, frame.rotation.y, frame.rotation.z]}
        >
          <meshBasicMaterial color={"blue"} side={DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};
const Frames = ({ frames: frameNodes, textureProps }) => {
  const [frames, framesMask, framesPaint] = frameNodes;
  console.log(frames, framesMask, framesPaint);

  return (
    <>
      <FramesGroup frames={frames} textureProps={textureProps} />
      <FramesMaskGroup frames={framesMask} />
      <FramesPaintGroup frames={framesPaint} />
    </>
  );
};

export { Frames };
