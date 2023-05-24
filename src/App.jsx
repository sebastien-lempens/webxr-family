import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, SpotLight, useGLTF, Clone, Environment, useTexture, CubeCamera } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider, CapsuleCollider } from "@react-three/rapier";
import { VRButton, XR, Controllers } from "@react-three/xr";
import { Player, Switches, Frames, Pedestal, Walls } from "./components";
import { RepeatWrapping, SRGBColorSpace, ColorManagement } from "three";
const Scene = () => {
  const { nodes } = useGLTF("scene.gltf");
  const { gl } = useThree();
  const { buttons, columns, floor, table, letters, frames, framesMask, framesMask2, framesPaint, roof, walls, wallsCollider } = nodes;
  const [base, normal, metallic, roughness] = useTexture([
    "textures/texture_base.jpg",
    "textures/texture_normal.webp",
    "textures/texture_metallic.webp",
    "textures/texture_roughness.webp",
  ]);
  base.flipY = normal.flipY = metallic.flipY = roughness.flipY = false;
  //  base.repeat.y = -1
  const textureProps = {
    map: base,
    metalnessMap: metallic,
    roughnessMap: roughness,
    normalMap: normal,
    normalScale:[0.25,0.25],
    toneMapped: false,
    envMapIntensity:0.4
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
            <Clone object={floor} inject={<meshStandardMaterial {...textureProps} />} />
          </RigidBody>
          <Clone visible={true} object={roof} inject={<meshStandardMaterial {...textureProps} />} />
          <Clone object={letters} inject={<meshStandardMaterial metalness={1} roughness={0.3} />} />
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
      
      <ambientLight intensity={0.8} />
      <Environment frames={1} background files='outdoor.hdr' />
      <SpotLight
        visible={true}
        color={"white"}
        castShadow
        position={[-8, 30, -8]}
        distance={60}
        angle={0.1}
        anglePower={4}
        radiusTop={0}
        radiusBottom={7}
        attenuation={50}
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
