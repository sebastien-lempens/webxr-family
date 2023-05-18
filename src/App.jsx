import { Canvas } from "@react-three/fiber";
import { OrbitControls, SpotLight, useGLTF, Clone, Environment, useTexture } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { VRButton, XR, Controllers } from "@react-three/xr";
import { Player } from "./components/Player";
import { Switches } from "./components/switches";
import { Frames } from "./components/frames";
const Scene = () => {
  const { nodes } = useGLTF("scene.gltf");
  const { columns, floor, fountain, frames, framesMask, framesPaint, roof, walls, wallsCollider } = nodes;
  const [view, normal, metallic, roughness] = useTexture([
    "textures/texture_2dview.webp",
    "textures/texture_normal.webp",
    "textures/texture_metallic.webp",
    "textures/texture_roughness.webp",
  ]);
  view.flipY = normal.flipY = metallic.flipY = roughness.flipY = false;
  const textureProps = {
    map: view,
    metalnessMap: metallic,
    roughnessMap: roughness,
    normalMap: normal,
  };

  return (
    <>
      <Physics debug={false}>
        {console.log("reloaded!")}
        <Player />
        <Switches />
        <group>
          <RigidBody type='fixed'>
            <Clone object={wallsCollider} inject={<meshStandardMaterial {...textureProps} />} />
          </RigidBody>
          <Clone object={walls} inject={<meshStandardMaterial {...textureProps} />} />
          <RigidBody type='fixed'>
            <Clone object={floor} inject={<meshStandardMaterial envMapIntensity={0.15} {...textureProps} />} />
          </RigidBody>
          <Clone object={roof} inject={<meshStandardMaterial {...textureProps} />} />
          <RigidBody type='fixed'>
            <Clone name='fountain' object={fountain} inject={<meshStandardMaterial {...textureProps} />} />
          </RigidBody>
          <RigidBody type='fixed' colliders={false}>
            {columns.children.map(column => (
              <group key={column.uuid}>
                <CuboidCollider args={[1, 1, 1]} position={[column.position.x, 0, column.position.z]} />
                <Clone name='column' object={column} inject={<meshStandardMaterial {...textureProps} />} />
              </group>
            ))}
          </RigidBody>
          <Frames frames={[frames, framesMask, framesPaint]} textureProps={textureProps} />
        </group>
      </Physics>
      <OrbitControls makeDefault />
      <Environment frames={5} blur={0} files={"env.hdr"} background />
      <ambientLight intensity={0.2} color={"#fff"} />
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
        intensity={0.2}
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
