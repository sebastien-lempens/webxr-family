import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, SpotLight, useGLTF, Clone, useTexture, CubeCamera, Sparkles, Environment } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider, CapsuleCollider } from "@react-three/rapier";
import { VRButton, XR, Controllers } from "@react-three/xr";
import { Player, Frames, Pedestal, Walls } from "./components";
import { Color } from "three";
import { useControls } from "leva";
const Scene = () => {
  const { nodes } = useGLTF("scene.gltf");
  const { gl, scene } = useThree();
  const { columns, floor, fountain, plants, letters, frames, framesPaint, roof, walls, wallsCollider } = nodes;
  const [base, normal, metallic, roughness] = useTexture([
    "textures/texture_base.jpg",
    "textures/texture_normal.webp",
    "textures/texture_metallic.webp",
    "textures/texture_roughness.webp",
  ]);
  base.flipY = normal.flipY = metallic.flipY = roughness.flipY = false;
  scene.background = new Color("skyblue");
  const textureProps = {
    map: base,
    //  metalnessMap: metallic,
    // roughnessMap: roughness,
    //  normalMap: normal,
    toneMapped: true,
  };
  gl.toneMapping = 1;
  gl.toneMappingExposure = 2.4;

  return (
    <>
      <Physics debug={false}>
        {console.log("%c SCENE RENDERED", "color:purple;font-weight:bold")}
        <Player />
        <group>
          <RigidBody type='fixed'>
            <Clone object={wallsCollider} />
          </RigidBody>
          <Walls object={walls} textureProps={textureProps} />
          <RigidBody type='fixed'>
            <Clone object={fountain} inject={<meshStandardMaterial {...textureProps} />} />
          </RigidBody>
          <Clone object={plants} inject={<meshStandardMaterial {...textureProps} />} />
          <RigidBody type='fixed'>
            <Clone object={floor} inject={<meshStandardMaterial {...textureProps} />} />
          </RigidBody>
          <CubeCamera frames={1} position={[0, 5, 0]}>
            {texture => <Clone visible={true} object={roof} position-y={9.56} inject={<meshStandardMaterial {...textureProps} />} />}
          </CubeCamera>
          <CubeCamera frames={1} position={[0, 5, -5]}>
            {texture => {
              return (
                <Clone
                  position-z={4.5}
                  position-y={3.1}
                  object={letters}
                  inject={<meshStandardMaterial envMap={texture} envMapIntensity={3} metalness={0} roughness={0} {...textureProps} />}
                />
              );
            }}
          </CubeCamera>
          {/* <Pedestal object={table} textureProps={textureProps} /> */}
          <RigidBody type='fixed' colliders={false}>
            {columns.children.map(column => (
              <group key={column.uuid}>
                <CuboidCollider args={[0.8, 0.8, 0.8]} position={[column.position.x, 0, column.position.z]} />
                <Clone name='column' object={column} inject={<meshStandardMaterial {...textureProps} />} />
              </group>
            ))}
          </RigidBody>
          <Frames object={[frames, framesPaint]} textureProps={textureProps} />
        </group>
      </Physics>

      <OrbitControls makeDefault />
      <Environment frames={1} files={'outdoor.hdr'}   />
      <Sparkles count={800} scale={15} size={0.5} speed={0.6} position-y={5} />
      <ambientLight color={"#fff0cf"} intensity={.8} />
      <SpotLight
        visible={true}
        color={"#fff0cf"}
        castShadow
        position={[-8, 30, -8]}
        distance={50}
        angle={0.25}
        anglePower={4}
        radiusTop={0}
        radiusBottom={7}
        attenuation={40}
        intensity={0}
      />
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
          <Scene />
        </XR>
      </Canvas>
    </>
  );
};

export default App;
