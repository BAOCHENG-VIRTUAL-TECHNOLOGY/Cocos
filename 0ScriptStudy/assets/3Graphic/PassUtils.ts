import { _decorator, gfx, renderer, pipeline, rendering,
    Vec4, macro, geometry, toRadian, cclegacy, Material } from 'cc';
const { ClearFlagBit, Color, LoadOp,
    Format, Rect, StoreOp, Viewport } = gfx;
const {Camera, CSMLevel, LightType, ShadowType, SKYBOX_FLAG} = renderer.scene;
const { supportsR32FloatTexture } = pipeline;
const { AccessType, AttachmentType, ComputeView, LightInfo, QueueHint,
    RasterView, ResourceResidency, SceneFlags } = rendering;

function SRGBToLinear (out, gamma: Vec4) {
        out.x = gamma.x * gamma.x;
        out.y = gamma.y * gamma.y;
        out.z = gamma.z * gamma.z;
}

export function isUICamera (camera): boolean {
    const scene = camera.scene!;
    const batches = scene.batches;
    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        if (camera.visibility & batch.visFlags) {
            return true;
        }
    }
    return false;
}


let profilerCamera = null;

export function decideProfilerCamera (cameras: any[]) {
    for (let i = cameras.length - 1; i >= 0; --i) {
        const camera = cameras[i];
        if (camera.window.swapchain) {
            profilerCamera = camera;
            return;
        }
    }
    profilerCamera = null;
}

// Anti-aliasing type, other types will be gradually added in the future
export enum AntiAliasing {
    NONE,
    FXAA,
    FXAAHQ,
}

export function validPunctualLightsCulling (pipeline, camera) {
    const sceneData = pipeline.pipelineSceneData;
    const validPunctualLights = sceneData.validPunctualLights;
    validPunctualLights.length = 0;
    const _sphere = geometry.Sphere.create(0, 0, 0, 1);
    const { spotLights } = camera.scene!;
    for (let i = 0; i < spotLights.length; i++) {
        const light = spotLights[i];
        if (light.baked) {
            continue;
        }

        geometry.Sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
        if (geometry.intersect.sphereFrustum(_sphere, camera.frustum)) {
            validPunctualLights.push(light);
        }
    }

    const { sphereLights } = camera.scene!;
    for (let i = 0; i < sphereLights.length; i++) {
        const light = sphereLights[i];
        if (light.baked) {
            continue;
        }
        geometry.Sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
        if (geometry.intersect.sphereFrustum(_sphere, camera.frustum)) {
            validPunctualLights.push(light);
        }
    }
}

const _cameras = [];

export function getCameraUniqueID (camera) {
    if (_cameras.indexOf(camera) === -1) {
        _cameras.push(camera);
    }
    return _cameras.indexOf(camera);
}

export function getLoadOpOfClearFlag (clearFlag, attachment) {
    let loadOp = LoadOp.CLEAR;
    if (!(clearFlag & ClearFlagBit.COLOR)
        && attachment === AttachmentType.RENDER_TARGET) {
        if (clearFlag & SKYBOX_FLAG) {
            loadOp = LoadOp.CLEAR;
        } else {
            loadOp = LoadOp.LOAD;
        }
    }
    if ((clearFlag & ClearFlagBit.DEPTH_STENCIL) !== ClearFlagBit.DEPTH_STENCIL
        && attachment === AttachmentType.DEPTH_STENCIL) {
        if (!(clearFlag & ClearFlagBit.DEPTH)) loadOp = LoadOp.LOAD;
        if (!(clearFlag & ClearFlagBit.STENCIL)) loadOp = LoadOp.LOAD;
    }
    return loadOp;
}

export function getRenderArea (camera, width: number, height: number, light = null, level = 0) {
    const out = new Rect();
    const vp = camera ? camera.viewport : new Rect(0, 0, 1, 1);
    const w = width;
    const h = height;
    out.x = vp.x * w;
    out.y = vp.y * h;
    out.width = vp.width * w;
    out.height = vp.height * h;
    if (light) {
        switch (light.type) {
        case LightType.DIRECTIONAL: {
            const mainLight = light;
            if (mainLight.shadowFixedArea || mainLight.csmLevel === CSMLevel.LEVEL_1) {
                out.x = 0;
                out.y = 0;
                out.width = w;
                out.height = h;
            } else {
                const screenSpaceSignY = cclegacy.director.root.device.capabilities.screenSpaceSignY;
                out.x = level % 2 * 0.5 * w;
                if (screenSpaceSignY) {
                    out.y = (1 - Math.floor(level / 2)) * 0.5 * h;
                } else {
                    out.y = Math.floor(level / 2) * 0.5 * h;
                }
                out.width = 0.5 * w;
                out.height = 0.5 * h;
            }
            break;
        }
        case LightType.SPOT: {
            out.x = 0;
            out.y = 0;
            out.width = w;
            out.height = h;
            break;
        }
        default:
        }
    }
    return out;
}

class FxaaData {
    fxaaMaterial: Material;
    private _updateFxaaPass () {
        if (!this.fxaaMaterial) return;

        const combinePass = this.fxaaMaterial.passes[0];
        combinePass.beginChangeStatesSilently();
        combinePass.tryCompile();
        combinePass.endChangeStatesSilently();
    }
    private _init () {
        if (this.fxaaMaterial) return;
        this.fxaaMaterial = new Material();
        this.fxaaMaterial._uuid = 'builtin-fxaa-material';
        this.fxaaMaterial.initialize({ effectName: 'pipeline/fxaa-hq' });
        for (let i = 0; i < this.fxaaMaterial.passes.length; ++i) {
            this.fxaaMaterial.passes[i].tryCompile();
        }
        this._updateFxaaPass();
    }
    constructor () {
        this._init();
    }
}

let fxaaData: FxaaData | null = null;
export function buildFxaaPass (camera,
    ppl,
    inputRT: string) {
    if (!fxaaData) {
        fxaaData = new FxaaData();
    }
    const cameraID = getCameraUniqueID(camera);
    const cameraName = `Camera${cameraID}`;
    let width = camera.window.width;
    let height = camera.window.height;
    const area = getRenderArea(camera, width, height);
    width = area.width;
    height = area.height;
    // Start
    const clearColor = new Color(0, 0, 0, 1);
    if (camera.clearFlag & ClearFlagBit.COLOR) {
        clearColor.x = camera.clearColor.x;
        clearColor.y = camera.clearColor.y;
        clearColor.z = camera.clearColor.z;
    }
    clearColor.w = camera.clearColor.w;

    const fxaaPassRTName = `dsFxaaPassColor${cameraName}`;
    const fxaaPassDSName = `dsFxaaPassDS${cameraName}`;

    // ppl.updateRenderWindow(inputRT, camera.window);
    if (!ppl.containsResource(fxaaPassRTName)) {
        ppl.addRenderTarget(fxaaPassRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
        ppl.addDepthStencil(fxaaPassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderTarget(fxaaPassRTName, width, height);
    ppl.updateDepthStencil(fxaaPassDSName, width, height);
    const fxaaPassIdx = 0;
    const fxaaPass = ppl.addRasterPass(width, height, 'fxaa');
    fxaaPass.name = `CameraFxaaPass${cameraID}`;
    fxaaPass.setViewport(new Viewport(area.x, area.y, width, height));
    if (ppl.containsResource(inputRT)) {
        const computeView = new ComputeView();
        computeView.name = 'sceneColorMap';
        fxaaPass.addComputeView(inputRT, computeView);
    }
    const fxaaPassView = new RasterView('_',
        AccessType.WRITE, AttachmentType.RENDER_TARGET,
        LoadOp.CLEAR, StoreOp.STORE,
        camera.clearFlag,
        clearColor);
    fxaaPass.addRasterView(fxaaPassRTName, fxaaPassView);
    fxaaData.fxaaMaterial.setProperty('texSize', new Vec4(width, height, 1.0 / width, 1.0 / height), fxaaPassIdx);
    fxaaPass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
        camera, fxaaData.fxaaMaterial, fxaaPassIdx,
        SceneFlags.NONE,
    );
    return { rtName: fxaaPassRTName, dsName: fxaaPassDSName };
}

export const MAX_BLOOM_FILTER_PASS_NUM = 6;
export const BLOOM_PREFILTERPASS_INDEX = 0;
export const BLOOM_DOWNSAMPLEPASS_INDEX = 1;
export const BLOOM_UPSAMPLEPASS_INDEX = BLOOM_DOWNSAMPLEPASS_INDEX + MAX_BLOOM_FILTER_PASS_NUM;
export const BLOOM_COMBINEPASS_INDEX = BLOOM_UPSAMPLEPASS_INDEX + MAX_BLOOM_FILTER_PASS_NUM;
class BloomData {
    bloomMaterial: Material;
    threshold = 0.1;
    iterations = 2;
    intensity = 0.8;
    private _updateBloomPass () {
        if (!this.bloomMaterial) return;

        const prefilterPass = this.bloomMaterial.passes[BLOOM_PREFILTERPASS_INDEX];
        prefilterPass.beginChangeStatesSilently();
        prefilterPass.tryCompile();
        prefilterPass.endChangeStatesSilently();

        for (let i = 0; i < MAX_BLOOM_FILTER_PASS_NUM; ++i) {
            const downsamplePass = this.bloomMaterial.passes[BLOOM_DOWNSAMPLEPASS_INDEX + i];
            downsamplePass.beginChangeStatesSilently();
            downsamplePass.tryCompile();
            downsamplePass.endChangeStatesSilently();

            const upsamplePass = this.bloomMaterial.passes[BLOOM_UPSAMPLEPASS_INDEX + i];
            upsamplePass.beginChangeStatesSilently();
            upsamplePass.tryCompile();
            upsamplePass.endChangeStatesSilently();
        }

        const combinePass = this.bloomMaterial.passes[BLOOM_COMBINEPASS_INDEX];
        combinePass.beginChangeStatesSilently();
        combinePass.tryCompile();
        combinePass.endChangeStatesSilently();
    }
    private _init () {
        if (this.bloomMaterial) return;
        this.bloomMaterial = new Material();
        this.bloomMaterial._uuid = 'builtin-bloom-material';
        this.bloomMaterial.initialize({ effectName: 'pipeline/bloom' });
        for (let i = 0; i < this.bloomMaterial.passes.length; ++i) {
            this.bloomMaterial.passes[i].tryCompile();
        }
        this._updateBloomPass();
    }
    constructor () {
        this._init();
    }
}
let bloomData: BloomData | null = null;
export function buildBloomPasses (camera,
    ppl,
    inputRT: string,
    threshold = 0.1,
    iterations = 2,
    intensity = 0.8) {
    if (!bloomData) {
        bloomData = new BloomData();
    }
    bloomData.threshold = threshold;
    bloomData.iterations = iterations;
    bloomData.intensity = intensity;
    const cameraID = getCameraUniqueID(camera);
    const cameraName = `Camera${cameraID}`;
    let width = camera.window.width;
    let height = camera.window.height;
    const area = getRenderArea(camera, width, height);
    width = area.width;
    height = area.height;
    // Start bloom
    const bloomClearColor = new Color(0, 0, 0, 1);
    if (camera.clearFlag & ClearFlagBit.COLOR) {
        bloomClearColor.x = camera.clearColor.x;
        bloomClearColor.y = camera.clearColor.y;
        bloomClearColor.z = camera.clearColor.z;
    }
    bloomClearColor.w = camera.clearColor.w;
    // ==== Bloom prefilter ===
    const bloomPassPrefilterRTName = `dsBloomPassPrefilterColor${cameraName}`;
    const bloomPassPrefilterDSName = `dsBloomPassPrefilterDS${cameraName}`;

    width >>= 1;
    height >>= 1;
    if (!ppl.containsResource(bloomPassPrefilterRTName)) {
        ppl.addRenderTarget(bloomPassPrefilterRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
        ppl.addDepthStencil(bloomPassPrefilterDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderTarget(bloomPassPrefilterRTName, width, height);
    ppl.updateDepthStencil(bloomPassPrefilterDSName, width, height);
    const bloomPrefilterPass = ppl.addRasterPass(width, height, 'bloom-prefilter');
    bloomPrefilterPass.name = `CameraBloomPrefilterPass${cameraID}`;
    bloomPrefilterPass.setViewport(new Viewport(area.x, area.y, width, height));
    if (ppl.containsResource(inputRT)) {
        const computeView = new ComputeView();
        computeView.name = 'outputResultMap';
        bloomPrefilterPass.addComputeView(inputRT, computeView);
    }
    const prefilterPassView = new RasterView('_',
        AccessType.WRITE, AttachmentType.RENDER_TARGET,
        LoadOp.CLEAR, StoreOp.STORE,
        camera.clearFlag,
        bloomClearColor);
    bloomPrefilterPass.addRasterView(bloomPassPrefilterRTName, prefilterPassView);
    bloomData.bloomMaterial.setProperty('texSize', new Vec4(0, 0, bloomData.threshold, 0), 0);
    bloomPrefilterPass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
        camera, bloomData.bloomMaterial, 0,
        SceneFlags.NONE,
    );
    // === Bloom downSampler ===
    for (let i = 0; i < bloomData.iterations; ++i) {
        const texSize = new Vec4(width, height, 0, 0);
        const bloomPassDownSampleRTName = `dsBloomPassDownSampleColor${cameraName}${i}`;
        const bloomPassDownSampleDSName = `dsBloomPassDownSampleDS${cameraName}${i}`;
        width >>= 1;
        height >>= 1;
        if (!ppl.containsResource(bloomPassDownSampleRTName)) {
            ppl.addRenderTarget(bloomPassDownSampleRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
            ppl.addDepthStencil(bloomPassDownSampleDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
        }
        ppl.updateRenderTarget(bloomPassDownSampleRTName, width, height);
        ppl.updateDepthStencil(bloomPassDownSampleDSName, width, height);
        const bloomDownSamplePass = ppl.addRasterPass(width, height, `bloom-downsample${i}`);
        bloomDownSamplePass.name = `CameraBloomDownSamplePass${cameraID}${i}`;
        bloomDownSamplePass.setViewport(new Viewport(area.x, area.y, width, height));
        const computeView = new ComputeView();
        computeView.name = 'bloomTexture';
        if (i === 0) {
            bloomDownSamplePass.addComputeView(bloomPassPrefilterRTName, computeView);
        } else {
            bloomDownSamplePass.addComputeView(`dsBloomPassDownSampleColor${cameraName}${i - 1}`, computeView);
        }
        const downSamplePassView = new RasterView('_',
            AccessType.WRITE, AttachmentType.RENDER_TARGET,
            LoadOp.CLEAR, StoreOp.STORE,
            camera.clearFlag,
            bloomClearColor);
        bloomDownSamplePass.addRasterView(bloomPassDownSampleRTName, downSamplePassView);
        bloomData.bloomMaterial.setProperty('texSize', texSize, BLOOM_DOWNSAMPLEPASS_INDEX + i);
        bloomDownSamplePass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
            camera, bloomData.bloomMaterial, BLOOM_DOWNSAMPLEPASS_INDEX + i,
            SceneFlags.NONE,
        );
    }
    // === Bloom upSampler ===
    for (let i = 0; i < bloomData.iterations; ++i) {
        const texSize = new Vec4(width, height, 0, 0);
        const bloomPassUpSampleRTName = `dsBloomPassUpSampleColor${cameraName}${bloomData.iterations - 1 - i}`;
        const bloomPassUpSampleDSName = `dsBloomPassUpSampleDS${cameraName}${bloomData.iterations - 1 - i}`;
        width <<= 1;
        height <<= 1;
        if (!ppl.containsResource(bloomPassUpSampleRTName)) {
            ppl.addRenderTarget(bloomPassUpSampleRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
            ppl.addDepthStencil(bloomPassUpSampleDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
        }
        ppl.updateRenderTarget(bloomPassUpSampleRTName, width, height);
        ppl.updateDepthStencil(bloomPassUpSampleDSName, width, height);
        const bloomUpSamplePass = ppl.addRasterPass(width, height, `bloom-upsample${i}`);
        bloomUpSamplePass.name = `CameraBloomUpSamplePass${cameraID}${bloomData.iterations - 1 - i}`;
        bloomUpSamplePass.setViewport(new Viewport(area.x, area.y, width, height));
        const computeView = new ComputeView();
        computeView.name = 'bloomTexture';
        if (i === 0) {
            bloomUpSamplePass.addComputeView(`dsBloomPassDownSampleColor${cameraName}${bloomData.iterations - 1}`, computeView);
        } else {
            bloomUpSamplePass.addComputeView(`dsBloomPassUpSampleColor${cameraName}${bloomData.iterations - i}`, computeView);
        }
        const upSamplePassView = new RasterView('_',
            AccessType.WRITE, AttachmentType.RENDER_TARGET,
            LoadOp.CLEAR, StoreOp.STORE,
            camera.clearFlag,
            bloomClearColor);
        bloomUpSamplePass.addRasterView(bloomPassUpSampleRTName, upSamplePassView);
        bloomData.bloomMaterial.setProperty('texSize', texSize, BLOOM_UPSAMPLEPASS_INDEX + i);
        bloomUpSamplePass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
            camera, bloomData.bloomMaterial, BLOOM_UPSAMPLEPASS_INDEX + i,
            SceneFlags.NONE,
        );
    }
    // === Bloom Combine Pass ===
    const bloomPassCombineRTName = `dsBloomPassCombineColor${cameraName}`;
    const bloomPassCombineDSName = `dsBloomPassCombineDS${cameraName}`;

    width = area.width;
    height = area.height;
    if (!ppl.containsResource(bloomPassCombineRTName)) {
        ppl.addRenderTarget(bloomPassCombineRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
        ppl.addDepthStencil(bloomPassCombineDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderTarget(bloomPassCombineRTName, width, height);
    ppl.updateDepthStencil(bloomPassCombineDSName, width, height);
    const bloomCombinePass = ppl.addRasterPass(width, height, 'bloom-combine');
    bloomCombinePass.name = `CameraBloomCombinePass${cameraID}`;
    bloomCombinePass.setViewport(new Viewport(area.x, area.y, width, height));
    const computeViewOut = new ComputeView();
    computeViewOut.name = 'outputResultMap';
    bloomCombinePass.addComputeView(inputRT, computeViewOut);
    const computeViewBt = new ComputeView();
    computeViewBt.name = 'bloomTexture';
    bloomCombinePass.addComputeView(`dsBloomPassUpSampleColor${cameraName}${0}`, computeViewBt);
    const combinePassView = new RasterView('_',
        AccessType.WRITE, AttachmentType.RENDER_TARGET,
        LoadOp.CLEAR, StoreOp.STORE,
        camera.clearFlag,
        bloomClearColor);
    bloomCombinePass.addRasterView(bloomPassCombineRTName, combinePassView);
    bloomData.bloomMaterial.setProperty('texSize', new Vec4(0, 0, 0, bloomData.intensity), BLOOM_COMBINEPASS_INDEX);
    bloomCombinePass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
        camera, bloomData.bloomMaterial, BLOOM_COMBINEPASS_INDEX,
        SceneFlags.NONE,
    );
    return { rtName: bloomPassCombineRTName, dsName: bloomPassCombineDSName };
}

class PostInfo {
    postMaterial: Material;
    antiAliasing: AntiAliasing = AntiAliasing.NONE;
    private _init () {
        this.postMaterial = new Material();
        this.postMaterial.name = 'builtin-post-process-material';
        if (macro.ENABLE_ANTIALIAS_FXAA) {
            this.antiAliasing = AntiAliasing.FXAA;
        }
        this.postMaterial.initialize({
            effectName: 'pipeline/post-process',
            defines: {
                // Anti-aliasing type, currently only fxaa, so 1 means fxaa
                ANTIALIAS_TYPE: this.antiAliasing,
            },
        });
        for (let i = 0; i < this.postMaterial.passes.length; ++i) {
            this.postMaterial.passes[i].tryCompile();
        }
    }
    constructor (antiAliasing: AntiAliasing = AntiAliasing.NONE) {
        this.antiAliasing = antiAliasing;
        this._init();
    }
}

let postInfo: PostInfo | null = null;

export function buildPostprocessPass (camera,
    ppl,
    inputTex: string,
    antiAliasing: AntiAliasing = AntiAliasing.NONE) {
    if (!postInfo || (postInfo && postInfo.antiAliasing !== antiAliasing)) {
        postInfo = new PostInfo(antiAliasing);
    }
    const cameraID = getCameraUniqueID(camera);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;
    const postprocessPassRTName = `postprocessPassRTName${cameraID}`;
    const postprocessPassDS = `postprocessPassDS${cameraID}`;
    if (!ppl.containsResource(postprocessPassRTName)) {
        // 注册 color texture 资源，因为当前 pass 是要上屏，所以传递 camera.window 作为上屏信息。
        // 如果是离屏的则需要调用 ppl.addRenderTarget 函数即可
        ppl.addRenderTexture(postprocessPassRTName, Format.BGRA8, width, height, camera.window);
        // 注册 depthStencil texture 资源
        ppl.addDepthStencil(postprocessPassDS, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    // 下面两行会更新 color texture 与 depthStencil texture 的注册信息(主要为尺寸大小)，
    // 同样如果离屏的则调用 'ppl.updateRenderTarget' 函数
    ppl.updateRenderWindow(postprocessPassRTName, camera.window);
    ppl.updateDepthStencil(postprocessPassDS, width, height);
    // 注册一个 RasterPass，它的 layoutName 为 post-process
    const postprocessPass = ppl.addRasterPass(width, height, 'post-process');
    postprocessPass.name = `CameraPostprocessPass${cameraID}`;
    // 设置当前 rasterPass 的 viewport
    postprocessPass.setViewport(new Viewport(area.x, area.y, area.width, area.height));
    // 判断系统中是否有输入纹理的同名信息，并把该输入纹理注入到 outputResultMap的sampler 中
    if (ppl.containsResource(inputTex)) {
        const computeView = new ComputeView();
        computeView.name = 'outputResultMap';
        postprocessPass.addComputeView(inputTex, computeView);
    }
    // 设置 postprocessPass 的 clear color 信息
    const postClearColor = new Color(0, 0, 0, camera.clearColor.w);
    if (camera.clearFlag & ClearFlagBit.COLOR) {
        postClearColor.x = camera.clearColor.x;
        postClearColor.y = camera.clearColor.y;
        postClearColor.z = camera.clearColor.z;
    }
    // 注册 color texture 相关的 pass view
    const postprocessPassView = new RasterView('_',
        AccessType.WRITE, AttachmentType.RENDER_TARGET,
        getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.RENDER_TARGET),
        StoreOp.STORE,
        camera.clearFlag,
        postClearColor);
    // 注册 depth stencil texture 相关的 pass view
    const postprocessPassDSView = new RasterView('_',
        AccessType.WRITE, AttachmentType.DEPTH_STENCIL,
        getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.DEPTH_STENCIL),
        StoreOp.STORE,
        camera.clearFlag,
        new Color(camera.clearDepth, camera.clearStencil, 0, 0));
    // 把 color texture 资源与相关的pass view产生关联(即 renderpass 的 color texture 输出口)
    postprocessPass.addRasterView(postprocessPassRTName, postprocessPassView);
    // 把 depth stencil texture 资源与相关的 pass view 产生关联
    postprocessPass.addRasterView(postprocessPassDS, postprocessPassDSView);
    // 添加具体的渲染队列，拿到 postprocess material 去画一个与屏幕等尺寸的四边形
    postprocessPass.addQueue(QueueHint.NONE).addFullscreenQuad(
        postInfo.postMaterial, 0, SceneFlags.NONE,
    );
    postprocessPass.addQueue(QueueHint.RENDER_TRANSPARENT).addSceneOfCamera(camera, new LightInfo(),
        SceneFlags.UI);
    if (profilerCamera === camera) {
        // 开启 profiler 渲染
        postprocessPass.showStatistics = true;
    }
    // 把 color texture 与 depth stencil texture 的资源返回，可以用于后续其它 render pass 的数据源
    return { rtName: postprocessPassRTName, dsName: postprocessPassDS };
}

export function buildForwardPass (camera,
    ppl,
    isOffScreen: boolean) {
    const cameraID = getCameraUniqueID(camera);
    const cameraName = `Camera${cameraID}`;
    const cameraInfo = buildShadowPasses(cameraName, camera, ppl);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    const forwardPassRTName = `dsForwardPassColor${cameraName}`;
    const forwardPassDSName = `dsForwardPassDS${cameraName}`;
    if (!ppl.containsResource(forwardPassRTName)) {
        if (!isOffScreen) {
            
            ppl.addRenderTexture(forwardPassRTName, Format.BGRA8, width, height, camera.window);
        } else {
            // 如果是离屏的则需要调用 ppl.addRenderTarget 函数即可
            ppl.addRenderTarget(forwardPassRTName, Format.RGBA16F, width, height, ResourceResidency.MANAGED);
        }
        // 注册 depthStencil texture 资源
        ppl.addDepthStencil(forwardPassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    // 下面两行会更新 color texture 与 depthStencil texture 的注册信息(主要为尺寸大小)，同样如果离屏的则调用 'ppl.updateRenderTarget' 函数
    if (!isOffScreen) {
        ppl.updateRenderWindow(forwardPassRTName, camera.window);
        ppl.updateDepthStencil(forwardPassDSName, width, height);
    } else {
        ppl.updateRenderTarget(forwardPassRTName, width, height);
        ppl.updateDepthStencil(forwardPassDSName, width, height);
    }
    // 注册一个 RasterPass，它的 layoutName 为 default
    const forwardPass = ppl.addRasterPass(width, height, 'default');
    forwardPass.name = `CameraForwardPass${cameraID}`;
    // 设置当前 rasterPass 的 viewport
    forwardPass.setViewport(new Viewport(area.x, area.y, width, height));
    for (const dirShadowName of cameraInfo.mainLightShadowNames) {
        if (ppl.containsResource(dirShadowName)) {
            const computeView = new ComputeView('cc_shadowMap');
            forwardPass.addComputeView(dirShadowName, computeView);
        }
    }
    for (const spotShadowName of cameraInfo.spotLightShadowNames) {
        if (ppl.containsResource(spotShadowName)) {
            const computeView = new ComputeView('cc_spotShadowMap');
            forwardPass.addComputeView(spotShadowName, computeView);
        }
    }
    const passView = new RasterView('_',
        AccessType.WRITE, AttachmentType.RENDER_TARGET,
        isOffScreen ? LoadOp.CLEAR : getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.RENDER_TARGET),
        StoreOp.STORE,
        camera.clearFlag,
        new Color(camera.clearColor.x, camera.clearColor.y, camera.clearColor.z, camera.clearColor.w));
    const passDSView = new RasterView('_',
        AccessType.WRITE, AttachmentType.DEPTH_STENCIL,
        isOffScreen ? LoadOp.CLEAR : getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.DEPTH_STENCIL),
        StoreOp.STORE,
        camera.clearFlag,
        new Color(camera.clearDepth, camera.clearStencil, 0, 0));
    forwardPass.addRasterView(forwardPassRTName, passView);
    forwardPass.addRasterView(forwardPassDSName, passDSView);
    forwardPass
        .addQueue(QueueHint.RENDER_OPAQUE)
        .addSceneOfCamera(camera, new LightInfo(),
            SceneFlags.OPAQUE_OBJECT | SceneFlags.PLANAR_SHADOW | SceneFlags.CUTOUT_OBJECT
             | SceneFlags.DEFAULT_LIGHTING | SceneFlags.DRAW_INSTANCING);
    let sceneFlags = SceneFlags.TRANSPARENT_OBJECT | SceneFlags.GEOMETRY;
    if (!isOffScreen) {
        sceneFlags |= SceneFlags.UI;
        forwardPass.showStatistics = true;
    }
    forwardPass
        .addQueue(QueueHint.RENDER_TRANSPARENT)
        .addSceneOfCamera(camera, new LightInfo(), sceneFlags);
    return { rtName: forwardPassRTName, dsName: forwardPassDSName };
}

export function buildShadowPass (passName: Readonly<string>,
    ppl,
    camera, light, level: number,
    width: Readonly<number>, height: Readonly<number>) {
    const fboW = width;
    const fboH = height;
    const area = getRenderArea(camera, width, height, light, level);
    width = area.width;
    height = area.height;
    const device = ppl.device;
    const shadowMapName = passName;
    if (!ppl.containsResource(shadowMapName)) {
        const format = supportsR32FloatTexture(device) ? Format.R32F : Format.RGBA8;
        ppl.addRenderTarget(shadowMapName, format, fboW, fboH, ResourceResidency.MANAGED);
        ppl.addDepthStencil(`${shadowMapName}Depth`, Format.DEPTH_STENCIL, fboW, fboH, ResourceResidency.MANAGED);
    }
    ppl.updateRenderTarget(shadowMapName, fboW, fboH);
    ppl.updateDepthStencil(`${shadowMapName}Depth`, fboW, fboH);
    const pass = ppl.addRasterPass(width, height, 'default');
    pass.name = passName;
    pass.setViewport(new Viewport(area.x, area.y, area.width, area.height));
    pass.addRasterView(shadowMapName, new RasterView('_',
        AccessType.WRITE, AttachmentType.RENDER_TARGET,
        LoadOp.CLEAR, StoreOp.STORE,
        ClearFlagBit.COLOR,
        new Color(1, 1, 1, camera.clearColor.w)));
    pass.addRasterView(`${shadowMapName}Depth`, new RasterView('_',
        AccessType.WRITE, AttachmentType.DEPTH_STENCIL,
        LoadOp.CLEAR, StoreOp.DISCARD,
        ClearFlagBit.DEPTH_STENCIL,
        new Color(camera.clearDepth, camera.clearStencil, 0, 0)));
    const queue = pass.addQueue(QueueHint.RENDER_OPAQUE);
    queue.addSceneOfCamera(camera, new LightInfo(light, level),
        SceneFlags.SHADOW_CASTER);
}

export function buildReflectionProbePasss (camera,
    ppl,
    isOffScreen: boolean) {
    const probes = cclegacy.internal.reflectionProbeManager.getProbes();
    if (probes.length === 0) {
        return;
    }
    for (let i = 0; i < probes.length; i++) {
        const probe = probes[i];
        if (probe.needRender) {
            for (let faceIdx = 0; faceIdx < probe.bakedCubeTextures.length; faceIdx++) {
                buildReflectionProbePass(camera, ppl, probe, probe.bakedCubeTextures[faceIdx].window!, faceIdx);
            }
            probe.needRender = false;
        }
    }
}

export function buildReflectionProbePass (camera,
    ppl, probe, renderWindow, faceIdx: number) {
    const cameraName = `Camera${faceIdx}`;
    const area = probe.renderArea();
    const width = area.x;
    const height = area.y;
    const probeCamera = probe.camera;

    const probePassRTName = `reflectionProbePassColor${cameraName}`;
    const probePassDSName = `reflectionProbePassDS${cameraName}`;

    probe.updateCameraDir(faceIdx);

    if (!ppl.containsResource(probePassRTName)) {
        ppl.addRenderTexture(probePassRTName, Format.RGBA8, width, height, renderWindow);
        ppl.addDepthStencil(probePassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderWindow(probePassRTName, renderWindow);
    ppl.updateDepthStencil(probePassDSName, width, height);

    const probePass = ppl.addRasterPass(width, height, 'default');
    probePass.name = `ReflectionProbePass${faceIdx}`;
    probePass.setViewport(new Viewport(0, 0, width, height));

    const passView = new RasterView('_',
        AccessType.WRITE, AttachmentType.RENDER_TARGET,
        getLoadOpOfClearFlag(probeCamera.clearFlag, AttachmentType.RENDER_TARGET),
        StoreOp.STORE,
        probeCamera.clearFlag,
        new Color(probeCamera.clearColor.x, probeCamera.clearColor.y, probeCamera.clearColor.z, probeCamera.clearColor.w));
    const passDSView = new RasterView('_',
        AccessType.WRITE, AttachmentType.DEPTH_STENCIL,
        getLoadOpOfClearFlag(probeCamera.clearFlag, AttachmentType.DEPTH_STENCIL),
        StoreOp.STORE,
        probeCamera.clearFlag,
        new Color(probeCamera.clearDepth, probeCamera.clearStencil, 0, 0));
    probePass.addRasterView(probePassRTName, passView);
    probePass.addRasterView(probePassDSName, passDSView);
    const passBuilder = probePass.addQueue(QueueHint.RENDER_OPAQUE);
    passBuilder.addSceneOfCamera(camera, new LightInfo(), SceneFlags.REFLECTION_PROBE);
    updateCameraUBO(passBuilder as unknown as any, probeCamera, ppl);
}

class CameraInfo {
    shadowEnabled = false;
    mainLightShadowNames = new Array<string>();
    spotLightShadowNames = new Array<string>();
}

export function buildShadowPasses (cameraName: string, camera, ppl): CameraInfo {
    validPunctualLightsCulling(ppl, camera);
    const pipeline = ppl;
    const shadowInfo = pipeline.pipelineSceneData.shadows;
    const validPunctualLights = ppl.pipelineSceneData.validPunctualLights;
    const cameraInfo = new CameraInfo();
    const shadows = ppl.pipelineSceneData.shadows;
    if (!shadowInfo.enabled || shadowInfo.type !== ShadowType.ShadowMap) { return cameraInfo; }
    cameraInfo.shadowEnabled = true;
    const _validLights: any[] = [];
    let n = 0;
    let m = 0;
    for (;n < shadowInfo.maxReceived && m < validPunctualLights.length;) {
        const light = validPunctualLights[m];
        if (light.type === LightType.SPOT) {
            const spotLight = light;
            if (spotLight.shadowEnabled) {
                _validLights.push(light);
                n++;
            }
        }
        m++;
    }

    const { mainLight } = camera.scene!;
    // build shadow map
    const mapWidth = shadows.size.x;
    const mapHeight = shadows.size.y;
    if (mainLight && mainLight.shadowEnabled) {
        cameraInfo.mainLightShadowNames[0] = `MainLightShadow${cameraName}`;
        if (mainLight.shadowFixedArea) {
            buildShadowPass(cameraInfo.mainLightShadowNames[0], ppl,
                camera, mainLight, 0, mapWidth, mapHeight);
        } else {
            const csmLevel = pipeline.pipelineSceneData.csmSupported ? mainLight.csmLevel : 1;
            for (let i = 0; i < csmLevel; i++) {
                cameraInfo.mainLightShadowNames[i] = `MainLightShadow${cameraName}`;
                buildShadowPass(cameraInfo.mainLightShadowNames[i], ppl,
                    camera, mainLight, i, mapWidth, mapHeight);
            }
        }
    }

    for (let l = 0; l < _validLights.length; l++) {
        const light = _validLights[l];
        const passName = `SpotLightShadow${l.toString()}${cameraName}`;
        cameraInfo.spotLightShadowNames[l] = passName;
        buildShadowPass(passName, ppl,
            camera, light, 0, mapWidth, mapHeight);
    }
    return cameraInfo;
}

export class GBufferInfo {
    color!: string;
    normal!: string;
    emissive!: string;
    ds!: string;
}
// deferred passes
export function buildGBufferPass (camera,
    ppl) {
    const cameraID = getCameraUniqueID(camera);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;
    const gBufferPassRTName = `gBufferPassColorCamera`;
    const gBufferPassNormal = `gBufferPassNormal`;
    const gBufferPassEmissive = `gBufferPassEmissive`;
    const gBufferPassDSName = `gBufferPassDSCamera`;
    if (!ppl.containsResource(gBufferPassRTName)) {
        const colFormat = Format.RGBA16F;
        ppl.addRenderTarget(gBufferPassRTName, colFormat, width, height, ResourceResidency.MANAGED);
        ppl.addRenderTarget(gBufferPassNormal, colFormat, width, height, ResourceResidency.MANAGED);
        ppl.addRenderTarget(gBufferPassEmissive, colFormat, width, height, ResourceResidency.MANAGED);
        ppl.addDepthStencil(gBufferPassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderTarget(gBufferPassRTName, width, height);
    ppl.updateRenderTarget(gBufferPassNormal, width, height);
    ppl.updateRenderTarget(gBufferPassEmissive, width, height);
    ppl.updateDepthStencil(gBufferPassDSName, width, height);
    // gbuffer pass
    const gBufferPass = ppl.addRasterPass(width, height, 'default');
    gBufferPass.name = `CameraGBufferPass${cameraID}`;
    gBufferPass.setViewport(new Viewport(area.x, area.y, area.width, area.height));
    const rtColor = new Color(0, 0, 0, 0);
    if (camera.clearFlag & ClearFlagBit.COLOR) {
        if (ppl.pipelineSceneData.isHDR) {
            SRGBToLinear(rtColor, camera.clearColor);
        } else {
            rtColor.x = camera.clearColor.x;
            rtColor.y = camera.clearColor.y;
            rtColor.z = camera.clearColor.z;
        }
    }
    const passColorView = new RasterView('_',
        AccessType.WRITE, AttachmentType.RENDER_TARGET,
        LoadOp.CLEAR, StoreOp.STORE,
        camera.clearFlag,
        rtColor);
    const passNormalView = new RasterView('_',
        AccessType.WRITE, AttachmentType.RENDER_TARGET,
        LoadOp.CLEAR, StoreOp.STORE,
        camera.clearFlag,
        new Color(0, 0, 0, 0));
    const passEmissiveView = new RasterView('_',
        AccessType.WRITE, AttachmentType.RENDER_TARGET,
        LoadOp.CLEAR, StoreOp.STORE,
        camera.clearFlag,
        new Color(0, 0, 0, 0));
    const passDSView = new RasterView('_',
        AccessType.WRITE, AttachmentType.DEPTH_STENCIL,
        LoadOp.CLEAR, StoreOp.STORE,
        camera.clearFlag,
        new Color(camera.clearDepth, camera.clearStencil, 0, 0));
    gBufferPass.addRasterView(gBufferPassRTName, passColorView);
    gBufferPass.addRasterView(gBufferPassNormal, passNormalView);
    gBufferPass.addRasterView(gBufferPassEmissive, passEmissiveView);
    gBufferPass.addRasterView(gBufferPassDSName, passDSView);
    gBufferPass
        .addQueue(QueueHint.RENDER_OPAQUE)
        .addSceneOfCamera(camera, new LightInfo(), SceneFlags.OPAQUE_OBJECT | SceneFlags.CUTOUT_OBJECT);
    const gBufferInfo = new GBufferInfo();
    gBufferInfo.color = gBufferPassRTName;
    gBufferInfo.normal = gBufferPassNormal;
    gBufferInfo.emissive = gBufferPassEmissive;
    gBufferInfo.ds = gBufferPassDSName;
    return gBufferInfo;
}

class LightingInfo {
    deferredLightingMaterial: Material;
    private _init () {
        this.deferredLightingMaterial = new Material();
        this.deferredLightingMaterial.name = 'builtin-deferred-material';
        this.deferredLightingMaterial.initialize({
            effectName: 'pipeline/deferred-lighting',
            defines: { CC_RECEIVE_SHADOW: 1 },
        });
        for (let i = 0; i < this.deferredLightingMaterial.passes.length; ++i) {
            this.deferredLightingMaterial.passes[i].tryCompile();
        }
    }
    constructor () {
        this._init();
    }
}

let lightingInfo: LightingInfo | null = null;

// deferred lighting pass
export function buildLightingPass (camera, ppl, gBuffer: GBufferInfo) {
    if (!lightingInfo) {
        lightingInfo = new LightingInfo();
    }
    const cameraID = getCameraUniqueID(camera);
    const cameraName = `Camera${cameraID}`;
    const cameraInfo = buildShadowPasses(cameraName, camera, ppl);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    const deferredLightingPassRTName = `deferredLightingPassRTName`;
    const deferredLightingPassDS = `deferredLightingPassDS`;
    if (!ppl.containsResource(deferredLightingPassRTName)) {
        ppl.addRenderTarget(deferredLightingPassRTName, Format.RGBA8, width, height, ResourceResidency.MANAGED);
        ppl.addDepthStencil(deferredLightingPassDS, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderTarget(deferredLightingPassRTName, width, height);
    ppl.updateDepthStencil(deferredLightingPassDS, width, height);
    // lighting pass
    const lightingPass = ppl.addRasterPass(width, height, 'deferred-lighting');
    lightingPass.name = `CameraLightingPass${cameraID}`;
    lightingPass.setViewport(new Viewport(area.x, area.y, width, height));
    for (const dirShadowName of cameraInfo.mainLightShadowNames) {
        if (ppl.containsResource(dirShadowName)) {
            const computeView = new ComputeView('cc_shadowMap');
            lightingPass.addComputeView(dirShadowName, computeView);
        }
    }
    for (const spotShadowName of cameraInfo.spotLightShadowNames) {
        if (ppl.containsResource(spotShadowName)) {
            const computeView = new ComputeView('cc_spotShadowMap');
            lightingPass.addComputeView(spotShadowName, computeView);
        }
    }
    if (ppl.containsResource(gBuffer.color)) {
        const computeView = new ComputeView();
        computeView.name = 'gbuffer_albedoMap';
        lightingPass.addComputeView(gBuffer.color, computeView);

        const computeNormalView = new ComputeView();
        computeNormalView.name = 'gbuffer_normalMap';
        lightingPass.addComputeView(gBuffer.normal, computeNormalView);

        const computeEmissiveView = new ComputeView();
        computeEmissiveView.name = 'gbuffer_emissiveMap';
        lightingPass.addComputeView(gBuffer.emissive, computeEmissiveView);

        const computeDepthView = new ComputeView();
        computeDepthView.name = 'depth_stencil';
        lightingPass.addComputeView(gBuffer.ds, computeDepthView);
    }
    const lightingClearColor = new Color(0, 0, 0, 0);
    if (camera.clearFlag & ClearFlagBit.COLOR) {
        lightingClearColor.x = camera.clearColor.x;
        lightingClearColor.y = camera.clearColor.y;
        lightingClearColor.z = camera.clearColor.z;
    }
    lightingClearColor.w = 0;
    const lightingPassView = new RasterView('_',
        AccessType.WRITE, AttachmentType.RENDER_TARGET,
        LoadOp.CLEAR, StoreOp.STORE,
        camera.clearFlag,
        lightingClearColor);
    lightingPass.addRasterView(deferredLightingPassRTName, lightingPassView);
    lightingPass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
        camera, lightingInfo.deferredLightingMaterial, 0,
        SceneFlags.VOLUMETRIC_LIGHTING,
    );
    lightingPass.addQueue(QueueHint.RENDER_TRANSPARENT).addSceneOfCamera(camera, new LightInfo(),
        SceneFlags.TRANSPARENT_OBJECT | SceneFlags.PLANAR_SHADOW | SceneFlags.GEOMETRY);
    return { rtName: deferredLightingPassRTName, dsName: deferredLightingPassDS };
}

function getClearFlags (attachment: rendering.AttachmentType, clearFlag, loadOp) {
    switch (attachment) {
    case AttachmentType.DEPTH_STENCIL:
        if (loadOp === LoadOp.CLEAR) {
            if (clearFlag & ClearFlagBit.DEPTH_STENCIL) {
                return clearFlag;
            } else {
                return ClearFlagBit.DEPTH_STENCIL;
            }
        } else {
            return ClearFlagBit.NONE;
        }
    case AttachmentType.RENDER_TARGET:
    default:
        if (loadOp === LoadOp.CLEAR) {
            return ClearFlagBit.COLOR;
        } else {
            return ClearFlagBit.NONE;
        }
    }
}

export function buildUIPass (camera,
    ppl) {
    const cameraID = getCameraUniqueID(camera);
    const cameraName = `Camera${cameraID}`;
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    const dsUIAndProfilerPassRTName = `dsUIAndProfilerPassColor${cameraName}`;
    const dsUIAndProfilerPassDSName = `dsUIAndProfilerPassDS${cameraName}`;
    if (!ppl.containsResource(dsUIAndProfilerPassRTName)) {
        ppl.addRenderTexture(dsUIAndProfilerPassRTName, Format.BGRA8, width, height, camera.window);
        ppl.addDepthStencil(dsUIAndProfilerPassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }
    ppl.updateRenderWindow(dsUIAndProfilerPassRTName, camera.window);
    ppl.updateDepthStencil(dsUIAndProfilerPassDSName, width, height);
    const uIAndProfilerPass = ppl.addRasterPass(width, height, 'default');
    uIAndProfilerPass.name = `CameraUIAndProfilerPass${cameraID}`;
    uIAndProfilerPass.setViewport(new Viewport(area.x, area.y, width, height));
    const passView = new RasterView('_',
        AccessType.WRITE, AttachmentType.RENDER_TARGET,
        getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.RENDER_TARGET),
        StoreOp.STORE,
        camera.clearFlag,
        new Color(camera.clearColor.x, camera.clearColor.y, camera.clearColor.z, camera.clearColor.w));
    const passDSView = new RasterView('_',
        AccessType.WRITE, AttachmentType.DEPTH_STENCIL,
        getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.DEPTH_STENCIL),
        StoreOp.STORE,
        camera.clearFlag,
        new Color(camera.clearDepth, camera.clearStencil, 0, 0));
    uIAndProfilerPass.addRasterView(dsUIAndProfilerPassRTName, passView);
    uIAndProfilerPass.addRasterView(dsUIAndProfilerPassDSName, passDSView);
    const sceneFlags = SceneFlags.UI;
    uIAndProfilerPass
        .addQueue(QueueHint.RENDER_TRANSPARENT)
        .addSceneOfCamera(camera, new LightInfo(), sceneFlags);
    if (profilerCamera === camera) {
        uIAndProfilerPass.showStatistics = true;
    }
}

export function buildNativeForwardPass (camera, ppl) {
    const cameraID = getCameraUniqueID(camera);
    const cameraName = `Camera${cameraID}`;
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;

    // Resources
    const forwardPassRTName = `dsForwardPassColor${cameraName}`;
    const forwardPassDSName = `dsForwardPassDS${cameraName}`;
    if (!ppl.containsResource(forwardPassRTName)) {
        ppl.addRenderTexture(forwardPassRTName, Format.BGRA8, width, height, camera.window);
        ppl.addDepthStencil(forwardPassDSName, Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
    }

    ppl.updateRenderWindow(forwardPassRTName, camera.window);
    ppl.updateDepthStencil(forwardPassDSName, width, height);
    // Passes
    const forwardPass = ppl.addRasterPass(width, height, 'default');
    forwardPass.name = `CameraForwardPass${cameraID}`;
    forwardPass.setViewport(new Viewport(area.x, area.y, width, height));

    const cameraRenderTargetLoadOp = getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.RENDER_TARGET);
    const cameraDepthStencilLoadOp = getLoadOpOfClearFlag(camera.clearFlag, AttachmentType.DEPTH_STENCIL);

    forwardPass.addRasterView(forwardPassRTName,
        new RasterView('_',
            AccessType.WRITE, AttachmentType.RENDER_TARGET,
            cameraRenderTargetLoadOp,
            StoreOp.STORE,
            getClearFlags(AttachmentType.RENDER_TARGET, camera.clearFlag, cameraRenderTargetLoadOp),
            new Color(camera.clearColor.x, camera.clearColor.y, camera.clearColor.z, camera.clearColor.w)));
    forwardPass.addRasterView(forwardPassDSName,
        new RasterView('_',
            AccessType.WRITE, AttachmentType.DEPTH_STENCIL,
            cameraDepthStencilLoadOp,
            StoreOp.STORE,
            getClearFlags(AttachmentType.DEPTH_STENCIL, camera.clearFlag, cameraDepthStencilLoadOp),
            new Color(camera.clearDepth, camera.clearStencil, 0, 0)));

    forwardPass
        .addQueue(QueueHint.RENDER_OPAQUE)
        .addSceneOfCamera(camera, new LightInfo(),
            SceneFlags.OPAQUE_OBJECT
            | SceneFlags.PLANAR_SHADOW
            | SceneFlags.CUTOUT_OBJECT
            | SceneFlags.DEFAULT_LIGHTING
            | SceneFlags.DRAW_INSTANCING);
    forwardPass
        .addQueue(QueueHint.RENDER_TRANSPARENT)
        .addSceneOfCamera(camera, new LightInfo(),
            SceneFlags.TRANSPARENT_OBJECT
            | SceneFlags.GEOMETRY);
    forwardPass
        .addQueue(QueueHint.RENDER_TRANSPARENT)
        .addSceneOfCamera(camera, new LightInfo(),
            SceneFlags.UI);
    forwardPass.showStatistics = true;
}

export function buildNativeDeferredPipeline (camera, ppl) {
    const cameraID = getCameraUniqueID(camera);
    const area = getRenderArea(camera, camera.window.width, camera.window.height);
    const width = area.width;
    const height = area.height;
    if (!ppl.containsResource('Albedo')) {
        // GBuffers
        ppl.addRenderTarget('Albedo', Format.RGBA16F, width, height, ResourceResidency.MANAGED);
        ppl.addRenderTarget('Normal', Format.RGBA16F, width, height, ResourceResidency.MANAGED);
        ppl.addRenderTarget('Emissive', Format.RGBA16F, width, height, ResourceResidency.MANAGED);
        ppl.addDepthStencil('DepthStencil', Format.DEPTH_STENCIL, width, height, ResourceResidency.MANAGED);
        // Lighting
        ppl.addRenderTexture('Color', Format.BGRA8, width, height, camera.window);
    }
    if (!lightingInfo) {
        lightingInfo = new LightingInfo();
    }
    // GeometryPass
    {
        const gBufferPass = ppl.addRasterPass(width, height, 'default');
        gBufferPass.name = 'GeometryPass';
        gBufferPass.setViewport(new Viewport(area.x, area.y, area.width, area.height));

        gBufferPass.addRasterView('Albedo', new RasterView('_',
            AccessType.WRITE, AttachmentType.RENDER_TARGET,
            LoadOp.CLEAR, StoreOp.STORE, ClearFlagBit.COLOR));
        gBufferPass.addRasterView('Normal', new RasterView('_',
            AccessType.WRITE, AttachmentType.RENDER_TARGET,
            LoadOp.CLEAR, StoreOp.STORE, ClearFlagBit.COLOR));
        gBufferPass.addRasterView('Emissive', new RasterView('_',
            AccessType.WRITE, AttachmentType.RENDER_TARGET,
            LoadOp.CLEAR, StoreOp.STORE, ClearFlagBit.COLOR));
        gBufferPass.addRasterView('DepthStencil', new RasterView('_',
            AccessType.WRITE, AttachmentType.DEPTH_STENCIL,
            LoadOp.CLEAR, StoreOp.STORE,
            ClearFlagBit.DEPTH_STENCIL,
            new Color(1, 0, 0, 0)));
        gBufferPass
            .addQueue(QueueHint.RENDER_OPAQUE)
            .addSceneOfCamera(camera, new LightInfo(), SceneFlags.OPAQUE_OBJECT | SceneFlags.CUTOUT_OBJECT);
    }
    // LightingPass
    {
        const lightingPass = ppl.addRasterPass(width, height, 'default');
        lightingPass.name = 'LightingPass';
        lightingPass.setViewport(new Viewport(area.x, area.y, width, height));

        const lightingClearColor = new Color(0, 0, 0, 0);
        if (camera.clearFlag & ClearFlagBit.COLOR) {
            lightingClearColor.x = camera.clearColor.x;
            lightingClearColor.y = camera.clearColor.y;
            lightingClearColor.z = camera.clearColor.z;
        }
        lightingClearColor.w = 1;
        lightingPass.addRasterView('Color', new RasterView('_',
            AccessType.WRITE, AttachmentType.RENDER_TARGET,
            LoadOp.CLEAR, StoreOp.STORE,
            camera.clearFlag,
            lightingClearColor));

        lightingPass.addComputeView('Albedo', new ComputeView('gbuffer_albedoMap'));
        lightingPass.addComputeView('Normal', new ComputeView('gbuffer_normalMap'));
        lightingPass.addComputeView('Emissive', new ComputeView('gbuffer_emissiveMap'));
        lightingPass.addComputeView('DepthStencil', new ComputeView('depth_stencil'));

        lightingPass.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
            camera, lightingInfo.deferredLightingMaterial, 0,
            SceneFlags.VOLUMETRIC_LIGHTING,
        );
        lightingPass.addQueue(QueueHint.RENDER_TRANSPARENT).addSceneOfCamera(camera,
            new LightInfo(),
            SceneFlags.TRANSPARENT_OBJECT | SceneFlags.PLANAR_SHADOW | SceneFlags.GEOMETRY);
    }
}

export function updateCameraUBO (setter: any, camera, ppl) {
    const pipeline = cclegacy.director.root.pipeline;
    const sceneData = ppl.pipelineSceneData;
    const skybox = sceneData.skybox;
    setter.addConstant('CCCamera');
    setter.setMat4('cc_matView', camera.matView);
    setter.setMat4('cc_matViewInv', camera.node.worldMatrix);
    setter.setMat4('cc_matProj', camera.matProj);
    setter.setMat4('cc_matProjInv', camera.matProjInv);
    setter.setMat4('cc_matViewProj', camera.matViewProj);
    setter.setMat4('cc_matViewProjInv', camera.matViewProjInv);
    setter.setVec4('cc_cameraPos', new Vec4(camera.position.x, camera.position.y, camera.position.z, pipeline.getCombineSignY()));
    // eslint-disable-next-line max-len
    setter.setVec4('cc_surfaceTransform', new Vec4(camera.surfaceTransform, 0.0, Math.cos(toRadian(skybox.getRotationAngle())), Math.sin(toRadian(skybox.getRotationAngle()))));
    // eslint-disable-next-line max-len
    setter.setVec4('cc_screenScale', new Vec4(sceneData.shadingScale, sceneData.shadingScale, 1.0 / sceneData.shadingScale, 1.0 / sceneData.shadingScale));
    setter.setVec4('cc_exposure', new Vec4(camera.exposure, 1.0 / camera.exposure, sceneData.isHDR ? 1.0 : 0.0, 1.0 / Camera.standardExposureValue));
}

