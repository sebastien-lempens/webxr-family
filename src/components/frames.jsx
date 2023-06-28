import { useMemo, useRef } from "react";
import { applyProps, useFrame } from "@react-three/fiber";
import { Plane, useTexture, useAspect, Clone } from "@react-three/drei";
import { DoubleSide, MathUtils, Plane as ThreePlane, Vector3 } from "three";
import { Interactive } from "@react-three/xr";

const Frame = ({ frame }) => {
  const sliderRef = useRef(null);
  const sliderRefMaterial = useRef(null);
  const { frameNumber } = { frameNumber: frame.userData.frameNumber };
  const texture = useTexture(`textures/family-portrait-${frameNumber}.jpg`);
  const textureName = useTexture(`textures/family-name-00.jpg`);
  const scale = useAspect(1024, 830, 0.33);
  let zTopMaskPlaneNormal = useMemo(() => new Vector3(0, -1, 0), []);
  const zTopMaskPlane = useMemo(() => new ThreePlane(zTopMaskPlaneNormal, 1), []);
  if (sliderRefMaterial.current) {
    zTopMaskPlane.applyMatrix4(sliderRef.current.matrixWorld);
    sliderRefMaterial.current.clippingPlanes = [zTopMaskPlane];
  }
  useFrame((_, delta) => {
    if (!sliderRefMaterial.current) return;
    sliderRef.current.position.y = MathUtils.lerp(sliderRef.current.position.y, frame.userData.opened ? 6 : 0, delta);
  });
  return (
    <>
      <Plane ref={sliderRef} args={[1, 2]} scale={scale} rotation-y={-Math.PI / 2}>
        <meshStandardMaterial ref={sliderRefMaterial} map={textureName} metalness={0.7} roughness={1} clippingPlanes={[zTopMaskPlane]} />
      </Plane>
      <Plane args={[1, 2]} scale={scale} rotation-y={-Math.PI / 2}>
        <meshBasicMaterial map={texture} polygonOffset polygonOffsetFactor={2} />
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
        <group
          key={`frame-${key}`}
          position={[...Object.values(frame.position)]}
          rotation={[frame.rotation.x, frame.rotation.y, frame.rotation.z]}
        >
          <Interactive
            onSelect={e => {
              frame.userData.opened = !frame.userData.opened;
            }}
          >
            <Frame frame={frame} />
          </Interactive>
        </group>
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
      <Clone object={frames} inject={<meshStandardMaterial {...textureProps} />} />
      <FramesPaintGroup frames={framesPaint} />
    </group>
  );
};

export { Frames };
