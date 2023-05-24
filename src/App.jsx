import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, SpotLight, useGLTF, Clone, Environment, useTexture, CubeCamera, Box } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider, CapsuleCollider } from "@react-three/rapier";
import { VRButton, XR, Controllers } from "@react-three/xr";
import { Player, Switches, Frames, Pedestal, Walls } from "./components";
import { WebGLCubeRenderTarget, AdditiveBlending, MaxEquation } from "three";
import { useRef } from "react";
const Scene = () => {
  const { nodes } = useGLTF("scene.gltf");
  const { gl } = useThree();
  const cubeCamera = useRef();
  const renderTarget = new WebGLCubeRenderTarget(1024);
  const { buttons, columns, floor, table, letters, frames, framesMask, framesMask2, framesPaint, roof, walls, wallsCollider } = nodes;
  const [base, normal, metallic, roughness] = useTexture([
    "textures/texture_base.jpg?001",
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
    toneMapped: true,
  };
  gl.toneMapping = 1;
  gl.toneMappingExposure = 0.35;

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
          <Clone visible={true} object={roof} inject={<meshStandardMaterial   {...textureProps} />} />
          <CubeCamera frames={1} position={[0, 0, -5]}>
            {texture => (
              <Clone
                position-z={4.5}
                position-y={8.1}
                object={letters}
                inject={<meshStandardMaterial envMap={texture} metalness={1} roughness={0} />}
              />
            )}
          </CubeCamera>
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
      <ambientLight intensity={1.5} />
      <Environment frames={1} resolution={256} files={"outdoor.hdr"} />
      <CubeCamera frames={1} scale={0.012} position={[0, 0.8, 0]}>
        {texture => {
          console.log(texture);
          return (
            <Box args={[2400, 0.01, 2400]} position-y={-60}>
              <meshStandardMaterial
                envMap={texture}
                roughness={0}
                transparent
                opacity={0.5}
                blending={AdditiveBlending}
                blendEquation={MaxEquation}
                metalness={1}
              />
            </Box>
          );
        }}
      </CubeCamera>
      <SpotLight
        visible={true}
        color={"white"}
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
