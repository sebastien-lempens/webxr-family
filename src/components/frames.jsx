import { memo, useMemo, useRef } from "react";
import { applyProps, useFrame } from "@react-three/fiber";
import { Plane, useTexture, useAspect, Clone, Edges, MeshDiscardMaterial } from "@react-three/drei";
import { DoubleSide, MathUtils, Plane as ThreePlane, Vector3 } from "three";
import { Interactive } from "@react-three/xr";

const Frame = ({ frame, textureProps }) => {
  const sliderRef = useRef(null);
  const sliderRefMaterial = useRef(null);
  const borderRef = useRef(null);
  const { frameNumber } = { frameNumber: frame.userData.frameNumber };
  const texture = useTexture(`textures/family-portrait-${frameNumber}.jpg`);
  let zTopMaskPlaneNormal = useMemo(() => new Vector3(0, -1, 0), []);
  const zTopMaskPlane = useMemo(() => new ThreePlane(zTopMaskPlaneNormal, 3), []);
  if (sliderRefMaterial.current) {
    zTopMaskPlane.applyMatrix4(sliderRef.current.matrixWorld);
    sliderRefMaterial.current.clippingPlanes = [zTopMaskPlane];
  }

  useFrame(({ clock }, delta) => {
    if (!sliderRefMaterial.current) return;
  sliderRef.current.position.y = MathUtils.lerp(sliderRef.current.position.y, frame.userData.opened ? 6 : 0, delta);

    borderRef.current.children.map((child, index) => {
      const [border] = child.children;
      border.material.transparent = true;
      const pingpongTime = (index * 2 + Math.sin(clock.getElapsedTime() * 5)) * 0.5;
      border.material.opacity = frame.userData.hovered ? pingpongTime : 0;
      const scaleTime = 1 + pingpongTime * 0.1;
      border.scale.x = border.scale.y = scaleTime;
    });
  });

  return (
    <>
      {/* ----------- FRAME COVER ------------ */}
      <Clone
        ref={sliderRef}
        object={frame}
        position={[0, 0, 0]}
        rotation-y={Math.PI}
        inject={<meshStandardMaterial ref={sliderRefMaterial} {...textureProps} clippingPlanes={[zTopMaskPlane]} />}
      />
      {/* ----------- FRAME PAINT ------------ */}
      <Plane rotation-y={Math.PI / 2} args={[3.2, 6]}>
        <meshBasicMaterial map={texture} side={DoubleSide} polygonOffset polygonOffsetFactor={2} />
      </Plane>
      {/* ----------- FRAME BORDER ------------ */}
      <group ref={borderRef}>
        <Plane args={[4, 6]} position-x={-1} rotation-y={-Math.PI / 2}>
          <MeshDiscardMaterial transparent />
          <Edges color={"white"} />
        </Plane>
        <Plane args={[4, 6]} position-x={-1} rotation-y={-Math.PI / 2}>
          <MeshDiscardMaterial transparent />
          <Edges color={"white"} />
        </Plane>
      </group>
    </>
  );
};

const FramesPaintGroup = ({ frames, textureProps }) => {
  return (
    <group
      position={[frames.position.x, frames.position.y, frames.position.z]}
      rotation={[frames.rotation.x, frames.rotation.y, frames.rotation.z]}
    >
      {frames.children.map((frame, key) => (
        <group
          key={`frame-${key}`}
          position={[...Object.values(frame.position)]}
          rotation={[frame.rotation.x, frame.rotation.y, frame.rotation.z]}
        >
          <Interactive
            onHover={e => (frame.userData.hovered = true)}
            onBlur={e => (frame.userData.hovered = false)}
            onSelect={e => {
              frame.userData.opened = !frame.userData.opened;
            }}
          >
            <Frame frame={frame} textureProps={textureProps} />
          </Interactive>
        </group>
      ))}
    </group>
  );
};
const Frames = memo(({ object, textureProps }) => {
  const [frames, framesPaint] = object;
  framesPaint.children.forEach((mesh, index) => {
    applyProps(mesh.userData, { frameNumber: index.toString().padStart(2, "0"), opened: false, hovered: false, slidePosition: 0 });
    return mesh;
  });
  return (
    <group>
      <Plane args={[2, 2]}>
        <Edges color={"white"}></Edges>
      </Plane>
      <Clone object={frames} inject={<meshStandardMaterial roughness={0} metalness={0.5} envMapIntensity={2} {...textureProps} />} />
      <FramesPaintGroup frames={framesPaint} textureProps={textureProps} />
    </group>
  );
});

export { Frames };
