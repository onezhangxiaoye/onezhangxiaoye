import{_ as s,o as a,c as n,a as l}from"./app.abea79e5.js";const A=JSON.parse('{"title":"web worker","description":"","frontmatter":{},"headers":[{"level":2,"title":"web worker 的限制","slug":"web-worker-的限制","link":"#web-worker-的限制","children":[]},{"level":2,"title":"主线程使用方法","slug":"主线程使用方法","link":"#主线程使用方法","children":[]},{"level":2,"title":"worker 线程使用方法","slug":"worker-线程使用方法","link":"#worker-线程使用方法","children":[]},{"level":2,"title":"worker 线程加载脚本","slug":"worker-线程加载脚本","link":"#worker-线程加载脚本","children":[]},{"level":2,"title":"canvas 离屏渲染","slug":"canvas-离屏渲染","link":"#canvas-离屏渲染","children":[]},{"level":2,"title":"使用 worker 执行耗时操作，保证主线程的运行不卡顿","slug":"使用-worker-执行耗时操作-保证主线程的运行不卡顿","link":"#使用-worker-执行耗时操作-保证主线程的运行不卡顿","children":[]}],"relativePath":"js/web-worker.md","lastUpdated":1677463857000}'),o={name:"js/web-worker.md"},e=l(`<h1 id="web-worker" tabindex="-1">web worker <a class="header-anchor" href="#web-worker" aria-hidden="true">#</a></h1><p><a href="https://www.ruanyifeng.com/blog/2018/07/web-worker.html" target="_blank" rel="noreferrer">阮一峰 Web Worker 使用教程</a><a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers#web_workers_api" target="_blank" rel="noreferrer">MDN 使用 Web Workers</a></p><p><code>Web Worker</code> 为 <code>Web</code> 内容在后台线程中运行脚本提供了一种简单的方法。线程可以执行任务而不干扰用户界面。此外，他们可以使用 <code>XMLHttpRequest</code> 执行 <code>I/O </code>(尽管 <code>responseXML</code> 和 <code>channel</code> 属性总是为空)。一旦创建，一个 <code>worker</code> 可以将消息发送到创建它的 JavaScript 代码，通过将消息发布到该代码指定的事件处理程序（反之亦然）。</p><h2 id="web-worker-的限制" tabindex="-1">web worker 的限制 <a class="header-anchor" href="#web-worker-的限制" aria-hidden="true">#</a></h2><ul><li>同源限制 <ul><li><strong>分配给 <code>worker</code> 线程运行的脚本文件，必须与主线程的脚本文件同源</strong>。</li></ul></li><li><code>DOM</code> 限制 <ul><li><code>worker</code> 线程所在的全局对象 (<code>self</code>)，与主线程不一样，无法读取主线程所在网页的 <code>DOM</code> 对象，也无法使用 <code>document</code>、<code>window</code>、<code>parent</code> 这些对象。但是，<code>worker</code> 线程可以 <code>navigator</code> 对象和 <code>location</code> 对象。</li></ul></li><li>文件限制 <ul><li><code>worker</code> 线程无法读取本地文件，即不能打开本机的文件系统（<code>file://</code>），它所加载的脚本，必须来自网络。</li></ul></li></ul><h2 id="主线程使用方法" tabindex="-1">主线程使用方法 <a class="header-anchor" href="#主线程使用方法" aria-hidden="true">#</a></h2><ul><li><a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Worker/postMessage" target="_blank" rel="noreferrer">worker.postMessage(aMessage, transferList)</a> 向 <code>worker</code> 线程发送数据， <ul><li><code>aMessage</code> <strong>它可以是各种数据类型，包括二进制数据</strong></li><li><code>transferList</code> 一个可选的 <code>Transferable</code> 对象的数组，用于传递所有权。如果一个对象的所有权被转移，在发送它的上下文中将变为不可用（中止），并且只有在它被发送到的 worker 中可用。 可转移对象是如 <code>ArrayBuffer</code>，<code>MessagePort</code> 或 <code>ImageBitmap</code> 的实例对象。<code>transferList</code> 数组中不可传入 <code>null</code> 。</li></ul></li><li><code>worker.terminate()</code> 用于关闭 <code>worker</code> 线程</li><li><code>worker.addEventListener(&#39;message&#39;, callback)</code> 用于监听 <code>worker</code> 线程发送过来的消息</li></ul><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">var worker = new Worker(&#39;worker.js&#39;)</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">worker.postMessage(&#39;hello web worker&#39;)</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">worker.addEventListener(&#39;message&#39;, function (e) {</span></span>
<span class="line"><span style="color:#A6ACCD;">    // 事件对象的 data 属性可以获取 Worker 发来的数据</span></span>
<span class="line"><span style="color:#A6ACCD;">    console.log(&#39;主线程收到的消息: &#39;, e.data);</span></span>
<span class="line"><span style="color:#A6ACCD;">})</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h2 id="worker-线程使用方法" tabindex="-1">worker 线程使用方法 <a class="header-anchor" href="#worker-线程使用方法" aria-hidden="true">#</a></h2><p>在 <code>worker</code> 线程中的全局对象是 <code>self</code> 最外层的 <code>this === self</code></p><ul><li><code>self.addEventListener(&#39;message&#39;, callback)</code> 用于监听主线程发送过来的消息</li><li><code>self.postMessage</code> 向主线程发送数据，<strong>它可以是各种数据类型，包括二进制数据</strong></li><li><code>self.close()</code> 在子线程中关闭自身</li></ul><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#A6ACCD;">self</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">addEventListener</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">message</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">name</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">e</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">// const v = getCount()</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">self</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">postMessage</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        name</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">张三</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">        age</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">123</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span></code></pre></div><h2 id="worker-线程加载脚本" tabindex="-1">worker 线程加载脚本 <a class="header-anchor" href="#worker-线程加载脚本" aria-hidden="true">#</a></h2><p>加载多个脚本 <code>importScripts(&#39;script1.js&#39;, &#39;script2.js&#39;);</code></p><h2 id="canvas-离屏渲染" tabindex="-1">canvas 离屏渲染 <a class="header-anchor" href="#canvas-离屏渲染" aria-hidden="true">#</a></h2><ul><li><a href="https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/transferControlToOffscreen" target="_blank" rel="noreferrer">HTMLCanvasElement.transferControlToOffscreen()</a> 将控制转移到一个在主线程或者 <code>web worker</code> 的 <code>OffscreenCanvas</code> 对象上。</li><li><a href="https://developer.mozilla.org/zh-CN/docs/Web/API/OffscreenCanvas" target="_blank" rel="noreferrer">OffscreenCanvas</a> 提供了一个可以脱离屏幕渲染的 <code>canvas</code> 对象。它在窗口环境和 <code>web worker</code> 环境均有效</li><li><code>OffscreenCanvas.getContext()</code> 为 <code>offscreen canvas</code> 对象返回一个渲染画布。</li><li><code>OffscreenCanvas.toBlob()</code> 创建一个代表 <code>canvas</code> 中的图像的 <code>Blob</code> 对象。</li><li><code>OffscreenCanvas.transferToImageBitmap()</code> 从 <code>OffscreenCanvas</code> 最近渲染的图像创建一个 <code>ImageBitmap</code> 对象。</li></ul><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#676E95;font-style:italic;">// 主线程中获取 canvas dom</span></span>
<span class="line"><span style="color:#C792EA;">var</span><span style="color:#A6ACCD;"> worker </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Worker</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">worker.js</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> canvas </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> document</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getElementById</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">canvas</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> offscreen  </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> canvas</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">transferControlToOffscreen</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">worker</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">postMessage</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span><span style="color:#A6ACCD;"> </span><span style="color:#F07178;">canvas</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> offscreen </span><span style="color:#89DDFF;">},</span><span style="color:#A6ACCD;"> [offscreen])</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">worker</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">addEventListener</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">message</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">e</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">主线程收到的消息: </span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">e</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">data</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">performance</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">now</span><span style="color:#F07178;">())</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span></code></pre></div><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#676E95;font-style:italic;">// worker.js 中绘制</span></span>
<span class="line"><span style="color:#A6ACCD;">self</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">addEventListener</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">message</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">name</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">e</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">let</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">canvas</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">e</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">data</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">canvas</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">ctx</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">canvas</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getContext</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">2d</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">ctx</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">lineWidth</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">6</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">ctx</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">strokeStyle</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">red</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">ctx</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">beginPath</span><span style="color:#F07178;">()</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">ctx</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">moveTo</span><span style="color:#F07178;">(</span><span style="color:#F78C6C;">20</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">20</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">ctx</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">lineTo</span><span style="color:#F07178;">(</span><span style="color:#F78C6C;">20</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">100</span><span style="color:#F07178;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">ctx</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">stroke</span><span style="color:#F07178;">()</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span></code></pre></div><h2 id="使用-worker-执行耗时操作-保证主线程的运行不卡顿" tabindex="-1">使用 worker 执行耗时操作，保证主线程的运行不卡顿 <a class="header-anchor" href="#使用-worker-执行耗时操作-保证主线程的运行不卡顿" aria-hidden="true">#</a></h2><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#676E95;font-style:italic;">// worker.js 执行 10亿次的累加，等待计算完成再返回给主线程</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">accumulation</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">let</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">a</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">0</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">for</span><span style="color:#F07178;"> (</span><span style="color:#C792EA;">let</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">i</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">0</span><span style="color:#89DDFF;">;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">i</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">1000000000</span><span style="color:#89DDFF;">;</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">i</span><span style="color:#89DDFF;">++</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#A6ACCD;">a</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">+=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">Math</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">random</span><span style="color:#F07178;">()</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">a</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">self</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">addEventListener</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">message</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">function</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">name</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">e</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">res</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">accumulation</span><span style="color:#F07178;">()</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">self</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">postMessage</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">res</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span></code></pre></div>`,20),p=[e];function r(c,t,y,F,D,i){return a(),n("div",null,p)}const d=s(o,[["render",r]]);export{A as __pageData,d as default};
