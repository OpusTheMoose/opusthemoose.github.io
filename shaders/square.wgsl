@group(0) @binding(0) var<uniform> dim : vec2f;

@vertex
    fn vertexMain(@location(0) pos: vec2f ) -> 
    @builtin(position) vec4f {
        return vec4f(pos, 0, 1);
    }

    fn drawColor(pos: vec2f ) -> vec4f {

       let cellSize = 40.0;
       let cellPosition=  floor(pos.xy / cellSize);
       let cellOrigin = cellPosition * cellSize;
       var squares =  vec2(cellOrigin.y);

       let localX = pos.x % cellSize;
       let localY = pos.y % cellSize;
       // 0 if even, 1 if odd. 
       let parity = cellPosition.x % 2.0; 

       // flip the triangle on the y-axis depending on which cell position it is
       let x = mix(cellSize - localX, localX, parity);


       // determine if we're in the triangle
       let inTriangle = step(x, localY); 

       // if we're in triangle, color based on cell origin y + cell size. otherwise use original color
        squares = mix(squares, vec2(cellOrigin.y) + cellSize, inTriangle);

        let normalized = squares / dim;
        // convert to hsv
        var hsv= rgb2hsv(vec3f(normalized, 1));

        return vec4f(hsv, 1);
    }


   // Source - https://stackoverflow.com/a/17897228
    // Posted by sam hocevar, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-08-01, License - CC BY-SA 4.0

    // All components are in the range [0…1], including hue.
    fn rgb2hsv(c: vec3f) -> vec3f
    {
        let K = vec4f(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        let p = mix(vec4f(c.bg, K.wz), vec4f(c.gb, K.xy), step(c.b, c.g));
        let q = mix(vec4f(p.xyw, c.r), vec4f(c.r, p.yzx), step(p.x, c.r));

        let d = q.x - min(q.w, q.y);
        let e = 1.0e-10;
        return vec3f(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }

@fragment
    fn fragmentMain(@builtin(position) fragCoord: vec4f) -> @location(0) vec4f {
        return drawColor(fragCoord.xy);
    }
