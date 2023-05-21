import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, SpotLight, useGLTF, Clone, Environment, useTexture, CubeCamera } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider, CapsuleCollider } from "@react-three/rapier";
import { VRButton, XR, Controllers } from "@react-three/xr";
import { Player, Switches, Frames, Pedestal, Walls } from "./components";
import { RepeatWrapping, sRGBEncoding } from "three";
const Scene = () => {
  const { nodes } = useGLTF("scene.gltf");
  const { buttons, columns, floor, table, frames, framesMask, framesMask2, framesPaint, roof, walls, wallsCollider } = nodes;
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
  };

  return (
    <>
      <CubeCamera>{texture => <Environment map={texture} files={'texture'} />}</CubeCamera>
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

      <hemisphereLight intensity={3}    />
      {/* 
      <pointLight intensity={1.2} position={[0,2,0]} /> */}
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
