// WebGL Distortion Class (fixed)
export class WebGLDistortion {
  constructor(canvas, imageSrc) {
    this.canvas = canvas;
    this.gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    this.imageSrc = imageSrc;
    this.texture = null;
    this.program = null;
    this.mouse = { x: -100, y: -100 };
    this.targetMouse = { x: -100, y: -100 };
    this.time = 0;
    this.animationId = null;

    if (!this.gl) {
      console.warn("WebGL not supported, falling back to <img>");
      return;
    }

    this.init();
  }

  init() {
    this.setupShaders();
    this.loadTexture();
    this.setupGeometry();
    this.render();
  }

  setupShaders() {
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform sampler2D u_texture;
      uniform vec2 u_mouse;
      uniform float u_time;
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;
      
      void main() {
        vec2 uv = v_texCoord;

        vec2 mousePos = u_mouse / u_resolution;
        mousePos.y = 1.0 - mousePos.y;

        float dist = distance(uv, mousePos);

        float ripple = sin(dist * 30.0 - u_time * 4.0) * 0.5 + 0.5;
        ripple *= smoothstep(0.3, 0.0, dist);

        float wave = sin(uv.x * 10.0 + u_time * 2.1) * 0.01;
        wave += sin(uv.y * 15.0 + u_time * 0.4) * 0.008;

        vec2 mouseDistortion = vec2(0.0);
        if (dist < 0.3) {
          float intensity = (0.3 - dist) / 0.3;
          float angle = atan(mousePos.y - uv.y, mousePos.x - uv.x);
          mouseDistortion = vec2(cos(angle), sin(angle)) * intensity * 0.03;
          mouseDistortion *= sin(u_time * 1.2) * 0.5 + 0.5;
        }

        vec2 distortedUV = uv + mouseDistortion;
        distortedUV.x += wave;
        distortedUV.y += wave * 0.7;

        float aberration = ripple * 0.005;
        vec4 color;
        color.r = texture2D(u_texture, distortedUV + vec2(aberration, 0.0)).r;
        color.g = texture2D(u_texture, distortedUV).g;
        color.b = texture2D(u_texture, distortedUV - vec2(aberration, 0.0)).b;
        color.a = 1.0;

        float glow = ripple * 0.2;
        color.rgb += glow;

        gl_FragColor = color;
      }
    `;

    const vertexShader = this.createShader(
      this.gl.VERTEX_SHADER,
      vertexShaderSource
    );
    const fragmentShader = this.createShader(
      this.gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    this.program = this.createProgram(vertexShader, fragmentShader);
    if (this.program) {
      this.gl.useProgram(this.program);
    }
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", this.gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  createProgram(vertexShader, fragmentShader) {
    if (!vertexShader || !fragmentShader) return null;

    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error("Program link error:", this.gl.getProgramInfoLog(program));
      return null;
    }
    return program;
  }

  setupGeometry() {
    const positions = [-1, -1, 1, -1, -1, 1, 1, 1];
    const texCoords = [0, 0, 1, 0, 0, 1, 1, 1];

    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW
    );

    const positionLocation = this.gl.getAttribLocation(
      this.program,
      "a_position"
    );
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(
      positionLocation,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    const texCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(texCoords),
      this.gl.STATIC_DRAW
    );

    const texCoordLocation = this.gl.getAttribLocation(
      this.program,
      "a_texCoord"
    );
    this.gl.enableVertexAttribArray(texCoordLocation);
    this.gl.vertexAttribPointer(
      texCoordLocation,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );
  }

  loadTexture() {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      this.texture = this.gl.createTexture();
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_S,
        this.gl.CLAMP_TO_EDGE
      );
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_T,
        this.gl.CLAMP_TO_EDGE
      );
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_MIN_FILTER,
        this.gl.LINEAR
      );
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_MAG_FILTER,
        this.gl.LINEAR
      );
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        image
      );
    };
    image.src = this.imageSrc;
  }

  updateMouse(x, y) {
    this.targetMouse.x = x;
    this.targetMouse.y = y;
  }

  render = () => {
    if (!this.gl || !this.program || !this.texture) {
      this.animationId = requestAnimationFrame(this.render);
      return;
    }

    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.1;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.1;
    this.time += 0.016;

    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.gl.viewport(0, 0, rect.width, rect.height);

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.useProgram(this.program);

    this.gl.uniform2f(
      this.gl.getUniformLocation(this.program, "u_mouse"),
      this.mouse.x,
      this.mouse.y
    );
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.program, "u_time"),
      this.time
    );
    this.gl.uniform2f(
      this.gl.getUniformLocation(this.program, "u_resolution"),
      rect.width,
      rect.height
    );

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_texture"), 0);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    this.animationId = requestAnimationFrame(this.render);
  };

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.gl) {
      if (this.texture) this.gl.deleteTexture(this.texture);
      if (this.program) this.gl.deleteProgram(this.program);
    }
  }
}
