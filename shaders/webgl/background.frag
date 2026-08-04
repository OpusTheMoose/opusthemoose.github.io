precision mediump float;
uniform vec2 dim;

// Source - https://stackoverflow.com/a/17897228
    // Posted by sam hocevar, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-08-01, License - CC BY-SA 4.0

    // All components are in the range [0…1], including hue.
    vec3 rgb2hsv(vec3 c)
    {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

        float d = q.x - min(q.w, q.y);
        const float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }

vec4 drawColor(vec2 pos ){

       const float cellSize = 40.0;
       vec2 cellPosition =  floor(pos.xy / cellSize);
       vec2 cellOrigin = cellPosition * cellSize;
       vec2 squares =  vec2(cellOrigin.y);

       float localX = mod(pos.x, cellSize);
       float localY = mod(pos.y,  cellSize);
       // 0 if even, 1 if odd. 
       float parity = mod(cellPosition.x, 2.0); 

       // flip the triangle on the y-axis depending on which cell position it is
       float x = mix(cellSize - localX, localX, parity);


       // determine if we're in the triangle
       float inTriangle = step(x, localY); 

       // if we're in triangle, color based on cell origin y + cell size. otherwise use original color
        squares = mix(squares, vec2(cellOrigin.y) + cellSize, inTriangle);

        vec2 normalized = squares / dim;
        // convert to hsv
        vec3 hsv = rgb2hsv(vec3(normalized, 1));

        return vec4(hsv, 1);
    }


void main() {
    gl_FragColor = drawColor(gl_FragCoord.xy);
}