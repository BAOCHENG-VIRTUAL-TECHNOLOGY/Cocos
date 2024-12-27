# Cocos

| Content                    |                                                              |
| -------------------------- | ------------------------------------------------------------ |
| Cocos官网                  | https://www.cocos.com/                                       |
| COCOS CREATOR              | https://docs.cocos.com/creator/3.8/manual/zh/                |
| COCOS2D-X                  | https://docs.cocos.com/cocos2d-x/manual/zh/                  |
| Cocos Creator 3.x 学习资料 | https://forum.cocos.org/t/topic/122399                       |
| js教程                     | https://developer.mozilla.org/zh-CN/docs/Web/JavaScript      |
| ts教程                     | https://www.tslang.cn/                                       |
| TypeScript编程入门         | https://www.bilibili.com/video/BV1qJhHetEHY/?share_source=copy_web&vd_source=4827b4f3df2b188fac5577e52e1c0f95 |
| Cocos Creator 3.8由浅入深  | https://www.bilibili.com/video/BV1LN41187y7/?share_source=copy_web&vd_source=4827b4f3df2b188fac5577e52e1c0f95 |
| 项目实践                   | https://space.bilibili.com/3546653680208125<br />https://space.bilibili.com/3220524<br />https://space.bilibili.com/3546559352408708<br />https://space.bilibili.com/634931989 |
| 发布到平台                 | https://www.bilibili.com/video/BV1mZ85esEYL                  |

# 游戏技术中draw call指什么

在游戏技术中，Draw Call（绘制调用）是指渲染引擎向图形硬件（GPU）发送渲染命令以绘制一个或多个图形对象的过程，以下是具体介绍：

### 原理

- CPU 作为游戏的 “大脑”，负责处理各种游戏逻辑和数据准备工作。当需要将游戏中的物体或图形元素显示在屏幕上时，CPU 会通过特定的图形 API（如 OpenGL、DirectX 等）向 GPU 发送绘制命令，这些命令就被称为 Draw Call124.
- GPU 则是专门负责图形渲染的硬件，在接收到 Draw Call 后，会根据命令中包含的信息，如顶点数据、纹理数据、渲染状态等，对相应的图形对象进行渲染处理，最终将生成的图像显示在屏幕上134.

### 影响性能的原因

- **CPU 开销**： 每次发送 Draw Call 时，CPU 都需要进行一系列的准备工作，如设置渲染状态、绑定纹理、传递顶点数据等。如果 Draw Call 的数量过多，CPU 就会花费大量的时间在这些准备工作上，从而导致 CPU 的使用率过高，影响游戏的整体性能。特别是在一些复杂的场景中，大量的物体需要分别发送 Draw Call 进行绘制，会使 CPU 不堪重负25.
- **GPU 利用率不足**：虽然 GPU 在处理图形渲染方面具有强大的并行计算能力，但如果 Draw Call 数量过多，GPU 可能会频繁地切换渲染状态，无法充分发挥其并行处理的优势，导致 GPU 的利用率不高，从而影响渲染效率15.

### 相关优化技术

- **批处理（Batching）**：将多个相似的图形对象合并成一个或几个 Draw Call 进行绘制，以减少 Draw Call 的数量。例如，将场景中使用相同材质和纹理的多个物体合并成一个大的网格对象，然后通过一次 Draw Call 进行渲染，这样可以显著减少 CPU 与 GPU 之间的通信开销，提高渲染效率134.
- **静态批处理（Static Batching）**：主要用于处理场景中位置固定不变的静态物体。在游戏开发过程中，将这些静态物体的网格数据进行合并，形成一个更大的几何对象，然后在渲染时只需要发送一次 Draw Call 即可。静态批处理可以在游戏的烘焙阶段完成，适用于建筑物、地形等静态元素较多的场景134.
- **动态批处理（Dynamic Batching）**：针对场景中位置会发生变化的动态物体。它会在运行时根据一定的规则，将多个动态对象合并成一个 Draw Call 进行渲染。不过，动态批处理需要在运行时进行计算和合并，会对 CPU 造成一定的负担，并且合并的对象大小和数量也存在一定的限制134.
- **GPU Instancing**：允许使用相同的网格数据但不同的材质属性或变换信息来绘制多个实例对象，而无需增加 Draw Call 的数量。这对于绘制大量相似的物体，如树木、草等非常有用，可以有效提高渲染效率134.

游戏技术中图集是什么技术
