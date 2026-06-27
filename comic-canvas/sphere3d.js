class Sphere3D {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) throw new Error('Container not found');

    this.options = Object.assign({
      radius: 1,
      bgColor: 0x2d1f3d,
      transparentBg: false,
      autoRotateSpeed: 0.005,
      dragSpeed: 0.005,
      fov: 45,
      frontCoverage: 0.7,
    }, options);

    this.isDragging = false;
    this.isAutoRotating = false;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
    this.rotationY = 0;
    this.rotationX = 0;
    this.autoRotateSpeed = this.options.autoRotateSpeed;
    this.dragEnabled = false;

    this._init();
  }

  _init() {
    const { width, height } = this._getSize();

    this.scene = new THREE.Scene();
    if (!this.options.transparentBg) {
      this.scene.background = new THREE.Color(this.options.bgColor);
    }

    this.camera = new THREE.PerspectiveCamera(this.options.fov, width / height, 0.1, 1000);
    this.camera.position.z = 3;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    const geometry = new THREE.SphereGeometry(this.options.radius, 64, 64);
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.FrontSide,
    });
    this.sphere = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.sphere);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    this._bindEvents();
    this._animate();
  }

  _getSize() {
    const rect = this.container.getBoundingClientRect();
    return {
      width: rect.width || 100,
      height: rect.height || 100,
    };
  }

  _bindEvents() {
    const canvas = this.renderer.domElement;
    canvas.style.cursor = 'grab';
    canvas.style.touchAction = 'none';

    const onStart = (e) => {
      if (!this.dragEnabled) return;
      e.preventDefault();
      e.stopPropagation();
      this.isDragging = true;
      this.isAutoRotating = false;
      canvas.style.cursor = 'grabbing';
      const point = e.touches ? e.touches[0] : e;
      this.prevMouseX = point.clientX;
      this.prevMouseY = point.clientY;
    };

    const onMove = (e) => {
      if (!this.isDragging) return;
      if (e.cancelable) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      const point = e.touches ? e.touches[0] : e;
      const deltaX = point.clientX - this.prevMouseX;
      const deltaY = point.clientY - this.prevMouseY;
      this.rotationY += deltaX * this.options.dragSpeed;
      this.rotationX += deltaY * this.options.dragSpeed;
      this.rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotationX));
      this.prevMouseX = point.clientX;
      this.prevMouseY = point.clientY;
    };

    const onEnd = (e) => {
      if (!this.isDragging) return;
      if (e && e.stopPropagation) e.stopPropagation();
      this.isDragging = false;
      canvas.style.cursor = 'grab';
    };

    canvas.addEventListener('mousedown', onStart, { passive: false, capture: true });
    window.addEventListener('mousemove', onMove, { capture: true });
    window.addEventListener('mouseup', onEnd, { capture: true });

    canvas.addEventListener('touchstart', onStart, { passive: false, capture: true });
    window.addEventListener('touchmove', onMove, { passive: false, capture: true });
    window.addEventListener('touchend', onEnd, { capture: true });

    canvas.addEventListener('wheel', (e) => {
      if (this.dragEnabled) {
        e.stopPropagation();
        e.preventDefault();
      }
    }, { passive: false, capture: true });
  }

  loadImage(src, options = {}) {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        src,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.wrapS = THREE.ClampToEdgeWrapping;
          texture.wrapT = THREE.ClampToEdgeWrapping;

          const img = texture.image;
          const imgRatio = img.width / img.height;

          const frontCoverage = options.frontCoverage !== undefined
            ? options.frontCoverage
            : this.options.frontCoverage;

          const uRepeat = frontCoverage;
          let vRepeat = frontCoverage;
          if (imgRatio > 1) {
            vRepeat = frontCoverage / imgRatio;
          } else {
            vRepeat = frontCoverage * imgRatio;
          }

          texture.repeat.set(uRepeat, vRepeat);
          texture.offset.set(
            (1 - uRepeat) / 2,
            (1 - vRepeat) / 2
          );

          texture.center.set(0.5, 0.5);

          this.material.map = texture;
          this.material.needsUpdate = true;
          resolve(texture);
        },
        undefined,
        reject
      );
    });
  }

  setBackgroundColor(color) {
    if (color === null || color === 'transparent') {
      this.scene.background = null;
    } else {
      this.scene.background = new THREE.Color(color);
    }
  }

  startAutoRotate(speed) {
    this.isAutoRotating = true;
    if (speed !== undefined) this.autoRotateSpeed = speed;
  }

  stopAutoRotate() {
    this.isAutoRotating = false;
  }

  enableDrag() {
    this.dragEnabled = true;
    this.renderer.domElement.style.pointerEvents = 'auto';
    this.renderer.domElement.style.cursor = 'grab';
  }

  disableDrag() {
    this.dragEnabled = false;
    this.renderer.domElement.style.pointerEvents = 'none';
  }

  render() {
    this.sphere.rotation.y = this.rotationY;
    this.sphere.rotation.x = this.rotationX;
    this.renderer.render(this.scene, this.camera);
  }

  _animate() {
    requestAnimationFrame(() => this._animate());
    if (this.isAutoRotating) {
      this.rotationY += this.autoRotateSpeed;
    }
    this.render();
  }

  resize() {
    const { width, height } = this._getSize();
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  dispose() {
    if (this.material) {
      if (this.material.map) this.material.map.dispose();
      this.material.dispose();
    }
    if (this.sphere) this.sphere.geometry.dispose();
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}
