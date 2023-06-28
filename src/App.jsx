import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, SpotLight, useGLTF, Clone, useTexture, CubeCamera, Sky, Sparkles, Environment } from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider, CapsuleCollider } from "@react-three/rapier";
import { VRButton, XR, Controllers } from "@react-three/xr";
import { Player, Frames, Walls } from "./components";
import { Color, DoubleSide, RepeatWrapping, Vector3 } from "three";
import { useControls } from "leva";
const Scene = () => {
  const { nodes } = useGLTF("scene.gltf");
  const { gl, scene } = useThree();
  const { beach, columns, floor, frames, framesPaint, letters, palmtree, plants, roof, sand, walls, wallsCollider } = nodes;
  const [floorNormal] = useTexture(["textures/normal/floor.webp"]);
  floorNormal.flipY = false;
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
  gl.toneMappingExposure = 2.4;

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
          <Clone
                  object={floor}
                  inject={
                    <meshStandardMaterial
                      
                      {...textureProps}
                    />
                  }
                />
            <CuboidCollider args={[15, 0.05, 15]} position={[0, 0, 0]} />
          </RigidBody>
          {/* ----------- ROOF ------------ */}
          <Clone object={roof} inject={<meshStandardMaterial roughnessMap={roofRoughness} {...textureProps} />} />
          {/* ----------- LETTERS ------------ */}
          <Clone object={letters} inject={<meshStandardMaterial envMapIntensity={2} roughness={0} metalness={1} {...textureProps} />} />
          {/* ----------- COLUMNS ------------ */}
          <RigidBody type='fixed' colliders={false}>
            {columns.children.map(column => (
              <group key={column.uuid} rotation-y={-1.35}>
                <Clone name='column' object={column} inject={<meshStandardMaterial roughnessMap={columnRoughness} {...textureProps} />} />
                <CuboidCollider args={[0.8, 0.8, 0.8]} position={[column.position.x, 0, column.position.z]} />
              </group>
            ))}
          </RigidBody>
          {/* ----------- FRAMES ------------ */}
          <Frames object={[frames, framesPaint]} textureProps={textureProps} />
        </group>
      </Physics>
      <Environment frames={1} path='textures/equirect' />
      <OrbitControls makeDefault />
      <Sparkles count={800} scale={15} size={0.5} speed={0.6} position-y={5} />
      <Sky distance={200} sunPosition={[-0.4, 0.2, 0]} />
      <ambientLight color={"#fff"} />
      <SpotLight
        visible={true}
        color={"#fff"}
        castShadow
        position={[-5, 45, -10]}
        distance={50}
        angle={0.05}
        anglePower={5.05}
        radiusTop={0}
        radiusBottom={7}
        attenuation={60}
      />
      <SpotLight
        visible={true}
        color={"#fff"}
        castShadow
        position={[-5, 45, -10]}
        distance={50}
        angle={0.05}
        anglePower={3}
        radiusTop={0}
        radiusBottom={5}
        attenuation={50}
      />
       <SpotLight
        visible={true}
        color={"#fff"}
        castShadow
        position={[-5, 45, -10]}
        distance={50}
        angle={0.05}
        anglePower={3}
        radiusTop={0}
        radiusBottom={3}
        attenuation={50}
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
