"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

/**
 * PortalAtmosphere — the marketing site's living atmosphere shader
 * (igc-sa GlobalAtmosphere.tsx), ported into the portal so the client logs
 * into the SAME world as igc-growth.com: two soft colour masses (cool steel
 * blue + warm ember) drifting on cool-black, with film grain and an edge
 * vignette. No scroll arc here — the portal is a single calm, cool-dominant
 * state with a restrained ember presence, tuned dark enough that dense
 * dashboard text stays legible on top.
 *
 * Fixed full-viewport, behind all content (z-0), pointer-events none. The
 * host div carries a CSS approximation as a fallback so a WebGL failure
 * degrades to a still-atmospheric ground rather than a blank/flat plane.
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uResolution;

  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float snoise(vec2 v){
    const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
    vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
    vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
    m=m*m;m=m*m;vec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;
    vec3 ox=floor(x+0.5);vec3 a0=x-ox;
    m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
    vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.0*dot(m,g);
  }
  vec2 aspectUv(vec2 uv,vec2 res){float a=res.x/res.y;return vec2((uv.x-0.5)*a+0.5,uv.y);}
  float softMass(vec2 uv,vec2 center,float radius,float softness){
    float d=distance(uv,center);return smoothstep(radius,radius-softness,d);
  }

  void main(){
    vec2 uv=aspectUv(vUv,uResolution);
    float t=uTime*0.035;
    vec2 driftA=vec2(snoise(vec2(t,0.13)),snoise(vec2(0.42,t*1.1)))*0.16;
    vec2 driftB=vec2(snoise(vec2(t+31.7,0.77)),snoise(vec2(0.91,t*0.9+11.3)))*0.18;

    // Fixed calm state: cool-dominant, restrained ember (no scroll arc).
    float coolI=0.70;
    float warmI=0.34;

    vec2 centerA=vec2(0.30+driftA.x,0.44+driftA.y);
    float massA=softMass(uv,centerA,0.55,0.42)*coolI;
    vec2 centerB=vec2(0.70+driftB.x,0.30+driftB.y);
    float massB=softMass(uv,centerB,0.50,0.44)*warmI;

    vec3 canvas   = vec3(0.039,0.047,0.059);  // #0A0C0F content canvas
    vec3 cool     = vec3(0.11,0.16,0.24);     // muted steel blue
    vec3 emberDim = vec3(0.34,0.24,0.10);
    vec3 emberHot = vec3(0.78,0.55,0.16);     // #C78B28-ish

    vec3 col=canvas;
    col+=cool*massA*0.55;
    vec3 emberMix=mix(emberDim,emberHot,smoothstep(0.30,0.60,warmI));
    col+=emberMix*massB*0.55;

    float grain=snoise(uv*820.0+uTime*3.0)*0.015;
    col+=grain;

    float vignette=smoothstep(1.05,0.30,distance(vUv,vec2(0.5)));
    col*=mix(0.62,1.0,vignette);

    gl_FragColor=vec4(col,1.0);
  }
`

function AtmosphereMesh() {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uResolution: { value: new THREE.Vector2(1, 1) } }),
    [],
  )
  useFrame((state) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime
    matRef.current.uniforms.uResolution.value.set(state.size.width, state.size.height)
  })
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={matRef} vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} depthWrite={false} />
    </mesh>
  )
}

export function PortalAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0"
      style={{
        zIndex: 0,
        // CSS fallback if WebGL is unavailable — still atmospheric, never flat.
        background:
          "radial-gradient(60% 55% at 70% 26%, rgba(199,139,40,0.10), transparent 62%)," +
          "radial-gradient(55% 60% at 26% 48%, rgba(40,64,104,0.14), transparent 66%)," +
          "#0A0C0F",
      }}
    >
      <Canvas
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1], near: 0, far: 2 }}
      >
        <AtmosphereMesh />
      </Canvas>
    </div>
  )
}
