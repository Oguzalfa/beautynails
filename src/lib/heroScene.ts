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
type Options = { canvas: HTMLCanvasElement; isMobile: boolean; onContextLost?: () => void }

function glassMat(isMobile: boolean, thickness: number) {
  // Transmission supplies transparency; extra alpha blending washed out the old arch.
  return new THREE.MeshPhysicalMaterial({
    color: '#fff3fa',     roughness: isMobile ? 0.045 : 0.02, metalness: 0,
    transmission: isMobile ? 0.92 : 0.97, thickness, ior: 1.48,
    reflectivity: 1, clearcoat: 1, clearcoatRoughness: 0.02,
    specularIntensity: 1.4, opacity: 1, transparent: false,
    side: THREE.FrontSide, envMapIntensity: 1.15,
    attenuationColor: new THREE.Color('#ff6eae'), attenuationDistance: 2.6,
  })
}

function createPortal(isMobile: boolean) {
  const r = 1.45, inner = 1.31, bottom = -1.3, shoulder = 0.07
  const shape = new THREE.Shape()
  shape.moveTo(-r, bottom)
  shape.lineTo(-r, shoulder)
  shape.absarc(0, shoulder, r, Math.PI, 0, true)
  shape.lineTo(r, bottom)
  shape.lineTo(inner, bottom)
  shape.lineTo(inner, shoulder)
  shape.absarc(0, shoulder, inner, 0, Math.PI, false)
  shape.lineTo(-inner, bottom)
  shape.closePath()
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.15, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.035,
    bevelSegments: isMobile ? 2 : 4, curveSegments: isMobile ? 40 : 64,
  })
  geometry.center()
  geometry.computeBoundingBox()
  return geometry
}

function ribbonPath(points: [number, number, number][]) {
  return new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)),
    false, 'centripetal')
}

function createRibbon(isMobile: boolean) {
  // Broad face toward the camera, kept inside the portrait column so the
  // headline stays on an open pink field.
  return reflectiveBand(ribbonPath([
    [-1.85, -1.05, -0.42],
    [-0.85, -0.28, -0.18],
    [0.15, 0.42, 0.02],
    [1.05, 0.98, -0.08],
    [1.85, 1.38, -0.28],
  ]), isMobile ? 64 : 112, 14,
    (t) => 0.62 + Math.sin(t * Math.PI) * 0.22, 0.04)
}

function createRibbonCross(isMobile: boolean) {
  return reflectiveBand(ribbonPath([
    [-1.55, -1.22, -0.55],
    [-0.35, -0.72, -0.2],
    [0.75, -0.08, 0.05],
    [1.7, 0.48, -0.16],
  ]), isMobile ? 48 : 88, 10,
    (t) => 0.38 + Math.sin(t * Math.PI) * 0.1, 0.03)
}

function archCurve(radius: number, z: number) {
  const bottom = -1.3, shoulder = 0.07, centerY = 0.11
  const leg = shoulder - bottom
  const arc = Math.PI * radius
  const length = leg * 2 + arc
  return new class extends THREE.Curve<THREE.Vector3> {
    constructor() { super() }
    getPoint(t: number, target = new THREE.Vector3()) {
      const distance = THREE.MathUtils.clamp(t, 0, 1) * length
      if (distance <= leg) return target.set(-radius, bottom + distance - centerY, z)
      if (distance >= leg + arc) {
        return target.set(radius, shoulder - (distance - leg - arc) - centerY, z)
      }
      const angle = Math.PI - (distance - leg) / radius
      return target.set(radius * Math.cos(angle), shoulder + radius * Math.sin(angle) - centerY, z)
    }
  }()
}

function reflectiveBand(
  path: THREE.Curve<THREE.Vector3>, segments: number, across: number,
  widthAt: (t: number) => number, bulge: number,
) {
  const positions: number[] = [], uv: number[] = [], indices: number[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const center = path.getPoint(t)
    const tangent = path.getTangent(t)
    const outward = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize()
    const width = widthAt(t)
    for (let j = 0; j <= across; j++) {
      const u = j / across
      const point = center.clone().addScaledVector(outward, (u - 0.5) * width)
      point.z += Math.sin(u * Math.PI) * bulge
      positions.push(point.x, point.y, point.z)
      uv.push(u, t)
      if (i < segments && j < across) {
        const a = i * (across + 1) + j, b = a + across + 1
        indices.push(a, b, a + 1, b, b + 1, a + 1)
      }
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function canvasTexture(size: [number, number], paint: (ctx: CanvasRenderingContext2D) => void) {
  const source = document.createElement('canvas')
  source.width = size[0]
  source.height = size[1]
  const ctx = source.getContext('2d')
  if (!ctx) throw new Error('Unable to create the procedural studio texture')
  paint(ctx)
  const texture = new THREE.CanvasTexture(source)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function studioEnvironment(renderer: THREE.WebGLRenderer, isMobile: boolean) {
  // HDR white panels against darker pink fields give glass/chrome long,
  // high-contrast studio reflections instead of a uniform pink PMREM.
  const studio = new THREE.Scene()
  studio.background = new THREE.Color('#f7b3d0')
  studio.add(new THREE.Mesh(new THREE.BoxGeometry(12, 10, 12),
    new THREE.MeshBasicMaterial({ color: '#ffd0e4', side: THREE.BackSide, toneMapped: false })))
  const card = (w: number, h: number, xyz: [number, number, number], power: number, tint = '#fff2fa') => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(tint).multiplyScalar(power),
        side: THREE.DoubleSide, toneMapped: false,
      }))
    mesh.position.set(...xyz)
    mesh.lookAt(0, 0, 0)
    studio.add(mesh)
  }
  card(0.28, 5.8, [-1.1, 0.9, 4.4], 14)
  card(0.18, 4.6, [1.35, 0.15, 3.8], 12)
  card(0.55, 5.2, [-3.4, 1.1, 2.2], 8)
  card(0.42, 4.8, [3.6, 0.4, 2.4], 9)
  card(4.2, 0.28, [0.1, 3.4, 1.6], 7)
  const generator = new THREE.PMREMGenerator(renderer)
  const target = generator.fromScene(studio, 0, 0.1, 30, { size: isMobile ? 128 : 256 })
  generator.dispose()
  studio.traverse((object) => {
    const mesh = object as THREE.Mesh
    mesh.geometry?.dispose()
    if (Array.isArray(mesh.material)) mesh.material.forEach((material) => material.dispose())
    else mesh.material?.dispose()
  })
  return target
}

function smoothstep(a: number, b: number, value: number) {
  const t = THREE.MathUtils.clamp((value - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

export function createHeroScene({ canvas, isMobile, onContextLost }: Options): SceneApi {
  const renderer = new THREE.WebGLRenderer({
    canvas, alpha: true, antialias: !isMobile, powerPreference: 'high-performance',
  })
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.08
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.35 : 1.75))
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40)
  const camBase = { x: 0, y: 0.04, z: 4.8 }
  camera.position.set(camBase.x, camBase.y, camBase.z)
  camera.lookAt(0, 0, 0)
  scene.add(new THREE.HemisphereLight(0xfff7fc, 0xc04f83, 0.4))
  const key = new THREE.DirectionalLight(0xffffff, 2.2)
  key.position.set(-3, 4, 5)
  const rim = new THREE.DirectionalLight(0xffd2e9, 1.1)
  rim.position.set(4, 2, -2)
  const glint = new THREE.PointLight(0xffffff, 28, 6, 2)
  glint.position.set(0.35, 1.25, 1.6)
  const glintLow = new THREE.PointLight(0xfff4fa, 16, 5, 2)
  glintLow.position.set(1.15, -0.35, 1.35)
  scene.add(key, rim, glint, glintLow)
  const environment = studioEnvironment(renderer, isMobile)
  scene.environment = environment.texture

  // CSS lies outside WebGL's transmission buffer. A real opaque backdrop
  // keeps refracted glass pink instead of sampling transparent canvas alpha.
  const backdropTexture = canvasTexture([512, 256], (ctx) => {
    const pink = ctx.createLinearGradient(0, 30, 512, 210)
    pink.addColorStop(0, '#ffe4f0')
    pink.addColorStop(0.32, '#ffd0e5')
    pink.addColorStop(0.66, '#f9a2cc')
    pink.addColorStop(1, '#ef74af')
    ctx.fillStyle = pink
    ctx.fillRect(0, 0, 512, 256)
    const glow = ctx.createRadialGradient(400, 65, 5, 400, 65, 210)
    glow.addColorStop(0, 'rgba(255,247,251,0.7)')
    glow.addColorStop(0.45, 'rgba(255,228,242,0.2)')
    glow.addColorStop(1, 'rgba(255,228,242,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, 512, 256)
    const floor = ctx.createLinearGradient(0, 190, 0, 256)
    floor.addColorStop(0, 'rgba(255,146,198,0)')
    floor.addColorStop(0.55, 'rgba(234,90,157,0.12)')
    floor.addColorStop(1, 'rgba(255,207,231,0.65)')
    ctx.fillStyle = floor
    ctx.fillRect(0, 190, 512, 66)
  })
  const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      map: backdropTexture, toneMapped: false, depthWrite: false, depthTest: false,
    }))
  backdrop.position.z = -4.5
  backdrop.renderOrder = -100
  scene.add(backdrop)

  const decor = new THREE.Group()
  scene.add(decor)
  const portalGeometry = createPortal(isMobile)
  const portalSize = portalGeometry.boundingBox!.getSize(new THREE.Vector3())
  // The bevel is physical glass; the curved front skin carries the two broad
  // studio reflection bands seen in the source. A flat-normal front alone
  // reflects a single pink field, regardless of the PMREM's light cards.
  const reflectionMaterial = new THREE.MeshPhysicalMaterial({
    color: '#ffffff', roughness: 0.03, metalness: 0,
    transmission: 0.62, thickness: 0.06, ior: 1.45,
    clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.8,
    transparent: true, opacity: 0.42, depthWrite: false,
    side: THREE.DoubleSide,
  })
  const arch = new THREE.Group()
  const archGlass = glassMat(isMobile, 0.32)
  archGlass.attenuationDistance = 0.38
  archGlass.attenuationColor = new THREE.Color('#ff2f86')
  archGlass.envMapIntensity = 0.85
  arch.add(new THREE.Mesh(portalGeometry, archGlass))
  const frontReflection = new THREE.Mesh(
    reflectiveBand(archCurve(1.38, 0.119), isMobile ? 80 : 144, 8, () => 0.045, 0.012),
    reflectionMaterial,
  )
  frontReflection.renderOrder = 10
  arch.add(frontReflection)
  const rimGeometry = new THREE.TubeGeometry(archCurve(1.472, 0.12), isMobile ? 88 : 160,
    0.0065, 6, false)
  const whiteRim = new THREE.Mesh(rimGeometry, new THREE.MeshBasicMaterial({
    color: '#fff7fc', transparent: true, opacity: 0.42, toneMapped: false,
  }))
  whiteRim.renderOrder = 11
  arch.add(whiteRim)
  arch.add(new THREE.Mesh(
    new THREE.TubeGeometry(archCurve(1.313, 0.115), isMobile ? 88 : 160, 0.007, 6, false),
    new THREE.MeshPhysicalMaterial({
      color: '#ff7eb6', roughness: 0.06, metalness: 0.15,
      transmission: 0.45, thickness: 0.04, clearcoat: 1, envMapIntensity: 1.6,
    }),
  ))
  arch.rotation.y = -0.1
  decor.add(arch)
  const ribbonMaterial = new THREE.MeshPhysicalMaterial({
    color: '#ffb3d4', roughness: 0.05, metalness: 0,
    transmission: 0.64, thickness: 0.62, ior: 1.46,
    clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 0.95,
    attenuationColor: new THREE.Color('#ff2a78'), attenuationDistance: 0.24,
    side: THREE.DoubleSide,
  })
  const ribbon = new THREE.Mesh(createRibbon(isMobile), ribbonMaterial)
  decor.add(ribbon)
  decor.add(new THREE.Mesh(createRibbonCross(isMobile), ribbonMaterial.clone()))
  const podium = new THREE.Mesh(
    new THREE.CylinderGeometry(1.64, 1.64, 0.045, isMobile ? 48 : 80),
    [glassMat(isMobile, 0.12), glassMat(isMobile, 0.2), glassMat(isMobile, 0.12)])
  podium.position.set(0.05, -1.18, 0.12)
  podium.scale.z = 0.4
  decor.add(podium)
  const podiumRim = new THREE.Mesh(
    new THREE.TorusGeometry(1.63, 0.012, 8, isMobile ? 48 : 80),
    new THREE.MeshPhysicalMaterial({
      color: '#ffd5e8', metalness: 0.45, roughness: 0.09,
      clearcoat: 1, envMapIntensity: 1.5,
    }))
  podiumRim.rotation.x = Math.PI / 2
  podiumRim.scale.y = 0.4
  podiumRim.position.copy(podium.position)
  podiumRim.position.y += 0.025
  decor.add(podiumRim)
  const contactTexture = canvasTexture([128, 128], (ctx) => {
    const shadow = ctx.createRadialGradient(64, 64, 8, 64, 64, 64)
    shadow.addColorStop(0, 'rgba(118,28,71,0.23)')
    shadow.addColorStop(0.55, 'rgba(136,29,78,0.1)')
    shadow.addColorStop(1, 'rgba(136,29,78,0)')
    ctx.fillStyle = shadow
    ctx.fillRect(0, 0, 128, 128)
  })
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.7),
    new THREE.MeshBasicMaterial({
      map: contactTexture, transparent: true, depthWrite: false, toneMapped: false,
    }))
  contact.rotation.x = -Math.PI / 2
  contact.position.set(0.1, -1.225, 0.1)
  decor.add(contact)
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(isMobile ? 0.09 : 0.14, isMobile ? 24 : 40, isMobile ? 16 : 24),
    new THREE.MeshPhysicalMaterial({
      color: '#f4f4f6', roughness: 0.06, metalness: 1,
      clearcoat: 1, envMapIntensity: 1.35,
    }))
  sphere.position.set(1.58, -0.95, 0.42)
  decor.add(sphere)

  // Services stay in the single accessible DOM, with no proxy meshes here.
  let progress = 0, pointerX = 0, pointerY = 0, targetPointerX = 0, targetPointerY = 0
  let visible = true, reduced = false, raf = 0, disposed = false, contextLost = false
  const clock = new THREE.Clock()
  const onLost = (event: Event) => {
    event.preventDefault()
    contextLost = true
    cancelAnimationFrame(raf)
    onContextLost?.()
  }
  const onRestored = (event: Event) => {
    event.preventDefault()
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
    const time = clock.getElapsedTime()
    const approach = smoothstep(0.16, 0.5, p)
    const pullback = smoothstep(0.58, 0.9, p)
    const near = approach * (1 - pullback)
    const sway = reduced ? 0 : Math.sin(time * 0.42) * 0.004
    camera.position.set(
      camBase.x + near * 0.08 + pointerX * 0.025,
      camBase.y + near * 0.03 + pointerY * 0.015,
      camBase.z - near * 0.5 + pullback * 0.12)
    camera.lookAt(near * 0.06, 0.02 + near * 0.02, 0)

    // Initial arch: about hero x46..98%, y-20..104%, behind the photo column.
    const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(16)) * camBase.z
    const viewWidth = viewHeight * camera.aspect
    decor.position.set(
      viewWidth * (isMobile ? 0 : 0.18) + pointerX * 0.012,
      viewHeight * (isMobile ? -0.02 : -0.01) + pointerY * 0.008, 0)
    decor.scale.set(
      viewWidth * (isMobile ? 0.86 : 0.36) / portalSize.x,
      viewHeight * (isMobile ? 0.92 : 0.8) / portalSize.y, 1)
    // Keep the chrome ball spherical while the arch is fitted to the layout.
    sphere.scale.set(1 / decor.scale.x, 1 / decor.scale.y, 1)
    decor.rotation.y = pointerX * 0.008 + sway
    decor.rotation.x = pointerY * 0.005
    arch.rotation.y = -0.1 + near * 0.11 - pullback * 0.03
    ribbon.rotation.z = near * 0.045 + sway * 0.7
    sphere.position.x = 1.58 + (reduced ? 0 : Math.sin(time * 0.5) * 0.006)
    const distance = camera.position.z - backdrop.position.z
    const backdropHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * distance
    backdrop.scale.set(backdropHeight * camera.aspect * 1.16, backdropHeight * 1.16, 1)
    backdrop.position.x = camera.position.x
    backdrop.position.y = camera.position.y
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
      if (visible && reduced && !contextLost) renderFrame()
    },
    setPointer: (nx, ny) => {
      if (reduced || contextLost) return
      targetPointerX = THREE.MathUtils.clamp(nx, -1, 1) * 2.5
      targetPointerY = THREE.MathUtils.clamp(ny, -1, 1) * 1.5
    },
    setVisible: (value) => {
      visible = value
      if (!value) cancelAnimationFrame(raf)
      else start()
    },
    setReduced: (value) => {
      reduced = value
      targetPointerX = 0
      targetPointerY = 0
      pointerX = 0
      pointerY = 0
      if (value) { cancelAnimationFrame(raf); renderFrame() }
      else start()
    },
    resize,
    dispose: () => {
      disposed = true
      cancelAnimationFrame(raf)
      canvas.removeEventListener('webglcontextlost', onLost, false)
      canvas.removeEventListener('webglcontextrestored', onRestored, false)
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh
        mesh.geometry?.dispose()
        if (Array.isArray(mesh.material)) mesh.material.forEach((material) => material.dispose())
        else mesh.material?.dispose()
      })
      backdropTexture.dispose()
      contactTexture.dispose()
      environment.dispose()
      renderer.dispose()
    },
  }
}

