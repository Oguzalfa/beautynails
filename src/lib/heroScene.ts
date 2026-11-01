import * as THREE from 'three'

export type SceneApi = {
  canvas: HTMLCanvasElement
  setProgress: (p: number) => void
  setPointer: (nx: number, ny: number) => void
  setVisible: (visible: boolean) => void
  setReduced: (reduced: boolean) => void
  resize: () => void
  dispose: () => void
}

type Options = {
  canvas: HTMLCanvasElement
  isMobile: boolean
  onContextLost?: () => void
}

function glassMat(isMobile: boolean, opacity: number) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#ff9ec8'),
    roughness: isMobile ? 0.12 : 0.05,
    metalness: 0.04,
    transmission: isMobile ? 0.15 : 0.82,
    thickness: isMobile ? 0.2 : 0.48,
    ior: 1.45,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    transparent: true,
    opacity: isMobile ? Math.min(opacity, 0.62) : Math.min(opacity, 0.78),
    side: THREE.DoubleSide,
    envMapIntensity: 1.65,
  })
}

/** Thick rounded glass portal matching the reference bulk. */
function createThickPortal(outerW: number, height: number, thickness: number, depth: number) {
  const shape = new THREE.Shape()
  shape.moveTo(-outerW, -height * 0.5)
  shape.lineTo(-outerW, height * 0.05)
  shape.absarc(0, height * 0.05, outerW, Math.PI, 0, true)
  shape.lineTo(outerW, -height * 0.5)
  shape.lineTo(outerW - thickness, -height * 0.5)
  shape.lineTo(outerW - thickness, height * 0.05)
  shape.absarc(0, height * 0.05, Math.max(0.2, outerW - thickness), 0, Math.PI, false)
  shape.lineTo(-outerW + thickness, -height * 0.5)
  shape.closePath()

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.055,
    bevelSegments: 5,
    curveSegments: 80,
  })
  geo.center()
  return geo
}

export function createHeroScene({ canvas, isMobile, onContextLost }: Options): SceneApi {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isMobile,
    powerPreference: 'high-performance',
  })
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.28
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.35 : 1.75))

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40)
  camera.position.set(0.25, 0.12, 5.1)

  scene.add(new THREE.AmbientLight(0xffeaf4, 0.85))
  const key = new THREE.DirectionalLight(0xffffff, 1.85)
  key.position.set(3.2, 3.8, 4.4)
  const fill = new THREE.DirectionalLight(0xffc2dc, 0.7)
  fill.position.set(-2.8, 1.4, 2.8)
  const rim = new THREE.DirectionalLight(0xffffff, 0.85)
  rim.position.set(0.4, -1.6, -3.2)
  const spark = new THREE.PointLight(0xffffff, 0.55, 8)
  spark.position.set(1.4, 1.6, 2.2)
  scene.add(key, fill, rim, spark)

  const envScene = new THREE.Scene()
  envScene.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(8, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0xffb7d5, side: THREE.BackSide }),
    ),
  )
  envScene.add(new THREE.DirectionalLight(0xffffff, 2.2))
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envMap = pmrem.fromScene(envScene, 0.02).texture
  scene.environment = envMap
  pmrem.dispose()

  const decor = new THREE.Group()
  decor.position.set(isMobile ? 0.08 : 0.72, isMobile ? 0 : 0.05, 0)
  scene.add(decor)

  const matA = glassMat(isMobile, 0.7)
  const matB = glassMat(isMobile, 0.55)

  // Wide thick front arch
  const archFront = new THREE.Mesh(createThickPortal(1.55, 2.05, 0.48, 0.32), matA)
  archFront.position.set(0.1, 0.05, 0.05)
  archFront.rotation.set(0.12, -0.12, 0.02)
  decor.add(archFront)

  // Rear arch for depth
  const archBack = new THREE.Mesh(createThickPortal(1.9, 2.35, 0.4, 0.24), matB)
  archBack.position.set(-0.05, 0.18, -0.55)
  archBack.rotation.set(0.05, -0.24, 0.01)
  decor.add(archBack)

  // Curved glossy ribbon behind
  const ribbon = new THREE.Mesh(
    new THREE.TorusGeometry(2.05, 0.11, 18, 100, Math.PI * 1.1),
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ef2c83'),
      roughness: 0.1,
      metalness: 0.45,
      clearcoat: 1,
      transparent: true,
      opacity: 0.9,
    }),
  )
  ribbon.rotation.set(1.05, -0.4, 0.5)
  ribbon.position.set(0.2, -0.15, -0.95)
  decor.add(ribbon)

  // Reflective thin oval plinth
  const plinth = new THREE.Mesh(
    new THREE.TorusGeometry(1.35, 0.035, 12, 80),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffd6e8'),
      metalness: 0.55,
      roughness: 0.18,
    }),
  )
  plinth.rotation.x = Math.PI / 2
  plinth.position.set(0.12, -1.15, 0.08)
  plinth.scale.set(1.05, 1, 0.48)
  decor.add(plinth)

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 32, 32),
    new THREE.MeshPhysicalMaterial({
      color: '#ffc4de',
      roughness: 0.06,
      metalness: 0.12,
      clearcoat: 1,
      transmission: isMobile ? 0 : 0.4,
      thickness: 0.3,
    }),
  )
  sphere.position.set(1.62, -0.7, 0.6)
  decor.add(sphere)

  let progress = 0
  let pointerX = 0
  let pointerY = 0
  let targetPointerX = 0
  let targetPointerY = 0
  let visible = true
  let reduced = false
  let raf = 0
  let disposed = false
  let contextLost = false

  const base = { x: isMobile ? 0.08 : 0.72, y: isMobile ? 0 : 0.05 }

  const onLost = (e: Event) => {
    e.preventDefault()
    contextLost = true
    cancelAnimationFrame(raf)
    onContextLost?.()
  }
  const onRestored = (e: Event) => {
    e.preventDefault()
    contextLost = true
    cancelAnimationFrame(raf)
  }
  canvas.addEventListener('webglcontextlost', onLost, false)
  canvas.addEventListener('webglcontextrestored', onRestored, false)

  const resize = () => {
    if (disposed || contextLost) return
    const parent = canvas.parentElement
    const width = parent?.clientWidth || canvas.clientWidth || 1
    const height = parent?.clientHeight || canvas.clientHeight || 1
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  const renderFrame = () => {
    if (disposed || contextLost) return
    pointerX += (targetPointerX - pointerX) * 0.08
    pointerY += (targetPointerY - pointerY) * 0.08

    const p = progress
    const deepen = smoothstep(0.12, 0.62, p)
    const settle = smoothstep(0.62, 0.9, p)
    const intro = smoothstep(0, 0.2, p)

    archFront.rotation.y = -0.12 + deepen * 0.2 * (1 - settle * 0.3) + pointerX * 0.03
    archFront.rotation.x = 0.12 + deepen * 0.07 + pointerY * 0.012
    archFront.position.z = 0.05 + deepen * 0.3

    archBack.rotation.y = -0.24 + deepen * 0.1 + pointerX * 0.016
    archBack.position.z = -0.55 + deepen * 0.1

    ribbon.rotation.z = 0.5 + deepen * 0.12
    ribbon.position.y = -0.15 + deepen * 0.14

    decor.rotation.y = pointerX * 0.028
    decor.rotation.x = pointerY * 0.015
    decor.position.x = base.x + pointerX * 0.03
    decor.position.y = base.y + pointerY * 0.02

    matA.opacity = (isMobile ? 0.46 : 0.52) + intro * 0.12
    matB.opacity = (isMobile ? 0.34 : 0.4) + intro * 0.1

    renderer.render(scene, camera)
  }

  const loop = () => {
    if (disposed || !visible || reduced || contextLost) return
    renderFrame()
    raf = requestAnimationFrame(loop)
  }

  const start = () => {
    cancelAnimationFrame(raf)
    if (!disposed && !contextLost && visible && !reduced) raf = requestAnimationFrame(loop)
    else if (!disposed && !contextLost) renderFrame()
  }

  resize()
  renderFrame()
  start()

  return {
    canvas,
    setProgress: (p) => {
      progress = THREE.MathUtils.clamp(p, 0, 1)
      if (reduced || !visible || contextLost) renderFrame()
    },
    setPointer: (nx, ny) => {
      if (reduced || contextLost) return
      targetPointerX = THREE.MathUtils.clamp(nx, -1, 1) * 2.5
      targetPointerY = THREE.MathUtils.clamp(ny, -1, 1) * 1.5
    },
    setVisible: (v) => {
      visible = v
      if (!v) cancelAnimationFrame(raf)
      else start()
    },
    setReduced: (r) => {
      reduced = r
      targetPointerX = 0
      targetPointerY = 0
      pointerX = 0
      pointerY = 0
      if (r) {
        cancelAnimationFrame(raf)
        renderFrame()
      } else start()
    },
    resize,
    dispose: () => {
      disposed = true
      cancelAnimationFrame(raf)
      canvas.removeEventListener('webglcontextlost', onLost, false)
      canvas.removeEventListener('webglcontextrestored', onRestored, false)
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
        const mat = mesh.material
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
        else if (mat) (mat as THREE.Material).dispose()
      })
      envMap.dispose()
      renderer.dispose()
    },
  }
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}
