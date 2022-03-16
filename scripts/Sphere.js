import { raf, resize } from '@emotionagency/utils'
import * as THREE from 'three'
import gsap from 'gsap'

import fragmentShader from './shaders/fragment.glsl'
import vertexShader from './shaders/vertex.glsl'

export class Sphere {
  constructor($wrapper) {
    this.$wrapper = $wrapper
    this.bounds()
    this.init()
  }

  bounds() {
    const methods = ['animate', 'resize']

    methods.forEach(m => {
      this[m] = this[m].bind(this)
    })
  }

  init() {
    this.scene = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    })

    resize.on(this.resize)

    this.renderer.setSize(this.width, this.height)
    this.$wrapper.appendChild(this.renderer.domElement)

    this.createMesh()

    raf.on(this.animate)
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    )

    this.camera.position.z = 1.9

    gsap.to(this.$wrapper, {
      duration: 1,
      scale: 1,
      opacity: 1,
    })
  }

  createMesh() {
    this.texture = new THREE.TextureLoader().load('/images/bg-cubemap.jpg')

    this.geometry = new THREE.SphereGeometry(1, 64, 64)

    this.glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: this.texture },
      },
      vertexShader,
      fragmentShader,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    })

    this.material = new THREE.MeshBasicMaterial({ map: this.texture })
    this.glow = new THREE.Mesh(this.geometry, this.glowMaterial)
    this.sphere = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.glow)
    this.scene.add(this.sphere)

    this.glow.rotation.z = 1
    this.glow.position.z = 0.58

    gsap.to(this.sphere.rotation, {
      duration: 2.5,
      y: 4,
    })
  }

  resize() {
    const { width, height } = window.getComputedStyle(this.$wrapper)
    this.width = parseInt(width) * 1.61
    this.height = parseInt(height) * 1.61

    this.setupCamera()

    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height)
  }

  animate() {
    this.renderer.render(this.scene, this.camera)
    this.sphere.rotation.y += 0.01
    this.glow.rotation.y += 0.01
  }

  destroy() {
    this.geometry.dispose()
    this.material.dispose()
    this.glowMaterial.dispose()
    this.texture.dispose()

    raf.off(this.animate)
    resize.off(this.resize)
    this.$wrapper.removeChild(this.renderer.domElement)
  }
}
