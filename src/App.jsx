import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Clone, useTexture, Sky, Sparkles, Environment, Loader } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { VRButton, XR, Controllers } from "@react-three/xr";
import { Player, Frames, Walls, Lightrays } from "./components";
import { ColorManagement, DoubleSide, LinearSRGBColorSpace, SRGBColorSpace } from "three";
import { Suspense } from "react";
const Scene = () => {
  const { nodes } = useGLTF("scene.glb");
  const { gl } = useThree();
  const { beach, columns, columnColliders, floor, frames, framesPaint, letters, palmtree, plants, roof, sand, walls, wallsCollider } =
    nodes;
  const [beachRoughness, columnRoughness, plantRoughness, roofRoughness] = useTexture([
    "textures/roughness/beach.webp",
    "textures/roughness/column.webp",
    "textures/roughness/plant.webp",
    "textures/roughness/roof.webp",
  ]);
  beachRoughness.flipY = columnRoughness.flipY = plantRoughness.flipY = roofRoughness.flipY = false;
  const [diffuse] = useTexture(["textures/diffuse.jpg"]);
  diffuse.flipY = false;

  const textureProps = {
    map: diffuse,
    side: DoubleSide,
  };
  gl.toneMapping = 1;
  gl.toneMappingExposure = 1.8;

  return (
    <>
      <Physics debug={false}>
        {console.log("%c SCENE RENDERED", "color:purple;font-weight:bold")}
        <Player />
        <group>
          {/* ----------- WALL COLLIDERS ------------ */}
          <RigidBody type='fixed'>
            <Clone object={wallsCollider} />
          </RigidBody>
          {/* ----------- WALL ------------ */}
          <Walls object={walls} textureProps={textureProps} />
          {/* ----------- SAND ------------ */}
          <RigidBody type='fixed' colliders={false}>
            <Clone object={sand} inject={<meshStandardMaterial {...textureProps} />} />
            <CuboidCollider args={[4, 1, 4]} position={[0, 1, 0]} />
          </RigidBody>
          {/* ----------- PLANTS ------------ */}
          <Clone object={plants} inject={<meshStandardMaterial roughnessMap={plantRoughness} {...textureProps} />} />
          {/* ----------- BEACH ------------ */}
          <Clone object={beach} inject={<meshStandardMaterial roughnessMap={beachRoughness} {...textureProps} />} />
          {/* ----------- PALM TREE ------------ */}
          <Clone object={palmtree} inject={<meshStandardMaterial {...textureProps} />} />
          {/* ----------- FLOOR ------------ */}
          <RigidBody type='fixed' colliders={false}>
            <Clone object={floor} inject={<meshStandardMaterial {...textureProps} />} />
            <CuboidCollider args={[15, 0.05, 15]} position={[0, 0, 0]} />
          </RigidBody>
          {/* ----------- ROOF ------------ */}
          <Clone object={roof} inject={<meshStandardMaterial roughnessMap={roofRoughness} {...textureProps} />} />
          {/* ----------- LETTERS ------------ */}
          <Clone
            object={letters}
            inject={<meshStandardMaterial envMapIntensity={2} roughness={0.01} metalness={0.5} {...textureProps} />}
          />
          {/* ----------- COLUMNS ------------ */}
          <RigidBody type='fixed' colliders={false}>
            <Clone name='column' object={columns} inject={<meshStandardMaterial roughnessMap={columnRoughness} {...textureProps} />} />
            {columnColliders.children.map((collider, index) => (
              <CuboidCollider key={index} args={[1, 1, 1]} position={collider.position.toArray()} />
            ))}
          </RigidBody>
          {/* ----------- FRAMES ------------ */}
          <Frames object={[frames, framesPaint]} textureProps={textureProps} />
        </group>
      </Physics>
      <Environment frames={1} path='textures/equirect' />
      <OrbitControls makeDefault />
      <Sparkles count={1200} scale={30} size={0.75} speed={0.6} position-y={5} />
      <Sky distance={200} sunPosition={[-0.2, 0.5, 0]} />
      <ambientLight intensity={0.3} />
      <Lightrays />
    </>
  );
};

const App = () => {
  return (
    <>
      <VRButton />
      <Canvas gl={{ localClippingEnabled: true }}>
        <XR>
          <Controllers />
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </XR>
      </Canvas>
      <Loader />
    </>
  );
};

export default App;
