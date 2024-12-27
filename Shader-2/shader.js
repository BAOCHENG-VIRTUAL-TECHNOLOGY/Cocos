function createShader(gl, type, source){
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success){
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader){
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(success){
        return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function main(){
    const images = ['http://127.0.0.1:8080/logo.png', 'http://127.0.0.1:8080/close-icon.jpg'];
    const dataList = [];
    let index = 0;
    for(let i=0; i<images.length; i++){
        const image = new Image();
        dataList.push(image);
        image.src = images[i];
        image.onload = function(){
            index++;
            if(index >= images.length){
                render(dataList)
            }
        }
    }
}

function render(images){
    const canvas = document.createElement('canvas');
    document.getElementsByTagName('body')[0].appendChild(canvas);
    canvas.width = 400;
    canvas.height = 300;

    const gl = canvas.getContext('webgl');
    if(!gl){
        console.log('There is no gl object');
        return;
    }

    const vertexSource = `
    attribute vec2 a_position;
    attribute vec2 a_uv;
    attribute vec4 a_color;

    varying vec4 v_color;
    varying vec2 v_uv;

    void main(){
        v_uv = a_uv;
        v_color = a_color;
        gl_Position = vec4(a_position, 0.0, 1.0);    
    }
    `;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    
    // const positions = [
    //       0,   0,
    //     0.7,   0,
    //       0, 0.5,
    //     0.7, 0.5,
    // ];

    const vertexPosUv = [
        -0.5,-0.7,0,0,
         0.5,-0.7,1,0,
        -0.5, 0.7,0,1,
         0.5, 0.7,1,1
  ];

    const colors = [
        255,   0,   0, 255,
          0, 255,   0, 255,
          0,   0, 255, 255,
        255, 127,   0, 255
    ]

    gl.enable(gl.CULL_FACE);

    // const arrayBuffer = new ArrayBuffer(positions.length * Float32Array.BYTES_PER_ELEMENT + colors.length);
    // const positionBuffer = new Float32Array(arrayBuffer);
    // const colorBuffer = new Uint8Array(arrayBuffer);

    // let offset = 0;
    // for(let i=0; i<positions.length; i+=2){
    //     positionBuffer[offset]=positions[i];
    //     positionBuffer[offset+1]=positions[i+1];
    //     offset+=3;
    // }

    // offset = 8;
    // for(let i=0; i<colors.length; i+=4){
    //     colorBuffer[offset]=colors[i];
    //     colorBuffer[offset+1]=colors[i+1];
    //     colorBuffer[offset+2]=colors[i+2];
    //     colorBuffer[offset+3]=colors[i+3];
    //     offset+=12;
    // }

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPosUv), gl.STATIC_DRAW);
    // gl.bufferData(gl.ARRAY_BUFFER, arrayBuffer, gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);

    const indices = [
        0, 1, 2,
        2, 1, 3
    ];

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
    
    const fragmentSource = `
    precision mediump float;
    
    // uniform vec4 u_color;
    uniform sampler2D u_image0;
    uniform sampler2D u_image1;

    varying vec2 v_uv;
    varying vec4 v_color;

    void main(){
        vec4 tex1 = texture2D(u_image0, v_uv);
        vec4 tex2 = texture2D(u_image1, v_uv);
        gl_FragColor = tex1 * tex2 * v_color;
    }
    `;

    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 16, 0);
    
    const uvAttributeLocation = gl.getAttribLocation(program, 'a_uv');
    gl.enableVertexAttribArray(uvAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(uvAttributeLocation, 2, gl.FLOAT, false, 16, 8);

    const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
    gl.enableVertexAttribArray(colorAttributeLocation);    
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.UNSIGNED_BYTE, true, 0, 0);

    if(images.length>0){
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    }
    for(let j=0; j<images.length;j++){
        const image = images[j];
        const samplerName = `u_image${j}`;
        const u_image = gl.getUniformLocation(program, samplerName);
        gl.uniform1i(u_image, j);
        const texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0+j);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }
    // const vertexColorLocation = gl.getUniformLocation(program, 'u_color');
    // gl.uniform4fv(vertexColorLocation, [Math.random(), Math.random(), Math.random(), 1]);

    // gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
}

main();