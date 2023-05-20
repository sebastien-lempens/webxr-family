import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, SpotLight, useGLTF, Clone, Environment, useTexture } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider, CapsuleCollider } from "@react-three/rapier";
import { VRButton, XR, Controllers } from "@react-three/xr";
import { Player, Switches, Frames, Pedestal, Walls } from "./components";
const Scene = () => {
  const { nodes } = useGLTF("scene.gltf");
  const { buttons, columns, floor, table, frames, framesMask, framesMask2, framesPaint, roof, walls, wallsCollider } = nodes;
  const [base, normal, metallic, roughness] = useTexture([
    "textures/texture_base.webp",
    "textures/texture_normal.webp",
    "textures/texture_metallic.webp",
    "textures/texture_roughness.webp",
  ]);
  base.flipY = normal.flipY = metallic.flipY = roughness.flipY = false;
  const textureProps = {
    map: base,
    metalnessMap: metallic,
    roughnessMap: roughness,
    normalMap: normal,
    normalScale:[-0.2,0.2]
  };

  return (
    <>
      <Physics debug={false}>
        {console.log("%c SCENE RENDERED", "color:purple;font-weight:bold")}
        <Player />
        <Switches object={buttons} />
        <group>
          <RigidBody type='fixed'>
            <Clone object={wallsCollider} inject={<meshStandardMaterial {...textureProps} />} />
          </RigidBody>
          <Walls object={walls} textureProps={textureProps} />
          <RigidBody type='fixed'>
            <Clone object={floor} inject={<meshStandardMaterial envMapIntensity={0.35} {...textureProps} />} />
          </RigidBody>
          <Clone visible={true} object={roof} inject={<meshStandardMaterial {...textureProps} normalMap={null} />} />
          <Pedestal object={table} textureProps={textureProps} />
          <RigidBody type='fixed' colliders={false}>
            {columns.children.map(column => (
              <group key={column.uuid}>
                <CuboidCollider args={[0.8, 0.8, 0.8]} position={[column.position.x, 0, column.position.z]} />
                <Clone name='column' object={column} inject={<meshStandardMaterial {...textureProps} />} />
              </group>
            ))}
          </RigidBody>
          <Frames object={[frames, framesMask, framesMask2, framesPaint]} textureProps={textureProps} />
        </group>
      </Physics>
      <OrbitControls makeDefault />
      <Environment frames={5} blur={0} preset="sunset"  background />
      <ambientLight intensity={0.4} color={"#fff"} />
      <SpotLight
        visible={true}
        color={"#fff"}
        castShadow
        position={[-8, 30, -8]}
        distance={50}
        angle={0.2}
        anglePower={8}
        radiusTop={0}
        radiusBottom={8}
        attenuation={40}
        intensity={0.4}
      />
    </>
  );
};

const App = () => {
  return (
    <>
      <VRButton />
      <Canvas>
        <XR>
          {/* <Controllers /> */}
          <Scene />
        </XR>
      </Canvas>
    </>
  );
};

export default App;
