# 一、 简介
  >详细记录一下前端详细的知识点。 梳理一下所掌握的知识。
  >废话不多说，直接进入正题。
  >本文中所提及到的浏览器， 在没有特别说明的情况下，都指的是chrome浏览器。

### * 从浏览器输入url地址，到页面呈现经历了什么？
  1. DNS解析
    什么是DNS解析？ DNS解析就是将你所输入的网页地址转换成能够访问到真正资源对应的主机的IP地址。
  从浏览器输入url地址，第一步就要去做DNS解析，来获取要访问资源对应的ip地址。整个解析过程大致又
  分为一下几个过程：
    1). 浏览器的DNS缓存；
      浏览器会先去缓存中查询有没有当前域名对应的ip地址，如果有的话，此过程结束，没有则继续。
    通常浏览器对一个域名的ip地址的缓存时间默认位60s. IE DNS 缓存时间为30min. FireFox 默认
    时间也是1min. Safari 浏览器 默认缓存时间为10s.
    2). 本地的hosts；
      如果浏览器自身缓存中没有DNS缓存记录，则会去查看本地hosts文件，查找是否具备本地址所对应
    的dns记录。如果有的话，此过程结束，否则继续。
    3). 路由器缓存；
      如果再本地依然没有找到正确的Ip地址，则会继续向上查找，去路由器缓存中查询是否有此地址对
    应的IP地址。如果有的话，此过程结束，否则继续。
    4). ISP/根域名服务器；
      如果以上步骤都没有找到此域名对应的ip地址，则会向上层服务器发送请求，等待服务器响应并将
    返回的地址缓存到以上三个过程中所对应的载体里，一遍下次访问时加快网络访问速度。
    以上就是DNS解析的整个过程， 当然关于具体的dns再根域下解析的过程还有很多内容，此处不做解释。
  2. 建立TCP链接、发送http请求， 接受服务端响应
    经过DNS解析拿到对应的IP地址以后，浏览器会向服务端建立TCP链接，并发送http请求，经过三次握手，四次挥手，拿到服务端响应内容。
  3. 浏览器解·析并渲染页面
    浏览器是一个边解析边渲染的过程。首先浏览器将html解析成DOM树，然后解析CSS成渲染树，之后浏览器将DOM树和css渲染树结合进行布局渲染，最终渲染成页面。
### * 什么是三次握手，四次挥手。 为什么需要三次握手？ 为什么需要四次挥手？
  * 三次握手： 
    第一次--客户端向服务端发送一个数据包（某种约定的数据包），与服务端建立连接，客户端等待服务端响应，此时客户端处于信号发送中状态。
    第二次--服务端收到数据之后，再返回与客户端进行连接确认的数据包，告知客户端已收到客户端刚刚的请求，此时服务端也处于信号发送状态。
    第三次--客户端在收到信号之后经过确认，认定此次通讯正常，然后再将结果数据包发送给服务端。
  * 四次挥手： 
    第一次挥手--客户端发送一个结束信号，用来告知服务器客户端将要关闭客户端的数据传输。
    第二次挥手--服务端收到信号之后，发送一个确认收到信号，然后服务端进入一个等待关闭状态
    第三次挥手--服务端发送一个结束信号，用来关闭服务端的数据传输。
    第四次挥手--客户端收到信号之后，客户端关闭，并将信号发送给服务端，服务端收到之后进入closed状态，完成四次挥手。
  * 为什么需要三次握手：
    主要的目的是为了防止失效的连接请求报文突然又传到服务端。 例如：假如不这样的话，会出现这么一种情况，客户端发送一个请求，但是由于某种原因导致此次请求的时间点相对于正确的时间点延后了很长时间，此时客户端已经认定此次连接无效了，而服务端收到请求后会误认为是客户端要建立连接，因此会作出响应，表示同意连接，但是客户端收到响应之后并不会做任何处理，因为已经失效了嘛。因此服务端会一直处于等待客户端传输数据过来，但是客户端是不会传的，因此就会造成服务端一直处于等待状态，浪费资源。
  * 为什么需要四次挥手： 
    挥手即是断开连接的过程。首先连接断开对于两端来说都需要另一端告知准备断开的信号，并且两端都要进行发送断开了将要通知的信号，如若不这样，会出现一个问题就是其中一端断开了，但是没有通知到另一端，就会导致另一端一直处于等待数据传输的状态，从而导致资源浪费。
### * 浏览器缓存机制是什么？
  * 浏览器的缓存机制主要包含强缓存和协商缓存两种形式。
  * 两者之间的关系就是 只要强缓存有效就会直接取强缓存，否则才会取看协商缓存。
  * 控制浏览器缓存的字段`http/1`的时候是```expires```， 他表示的是资源到期的时间点，受限于本地时间，如果修改了时间，会导致缓存失效。因此在1.1 中使用了```cache-control```来控制。
  * 浏览器在第一次发送请求时，会根据响应头中的```cache-control```资源来决定是否缓存当前资源，假如值为`no-store`，则表示不允许浏览器缓存当前资源。每次请求都会获取。
  * 假如`cache-control`的值为 `max-age=300` 代表着缓存有效期为响应头中的`date`字段 + `300s` 为当前资源的有效时间，超出这个时间就会失效。在此时间内浏览器请求都会直接从缓存中读取资源。
  * 一般资源响应头中还会有`last-modify` 和 `etag` 字段，分别代表资源最后的修改时间和资源的标示（用`etag`的原因就是`last-modify`只能精确到秒，对于1s内的资源修改会导致请求资源与实际要求不符合），
  当`cache-control` 为`max-age=0` 或者 `no-cache` 的时候，此时资源虽然被缓存了，但是过期了，此时会发送请求到服务端，并在请求体中加入`if-modify-since` 和 `if-none-match`字段，分别对应资源响应题中携带的 `lastmodify` 和 `etag` 的值。服务端根据这些值验证文件是否修改，如若修改，则返回`200`，并将资源返回，如若没有修改，则返回`304`，告知浏览器资源仍然可用，浏览器会从缓存中获取文件。
  > 注： 当`cache-control` 值为`max-age` 且 `max-age` 的值大于0 ，资源响应头中含有`lastmodify` 和 `etag`的情况下，在资源没有过期的时候，请求会直接走缓存，当资源过期的时候，浏览器会发送请求到服务端校验资源是否可用，如不可用，则返回新数据， `200`状态；如若可用，则返回`304`，并且此时浏览器会重新更新当前资源的过期时间为此次`304`请求响应的时间 （`date`字段）+  `max-age` 的值，也就是说资源会在当前节点之后的`max-age`的数量 秒内再次有效，再次请求直接`200`.
### * 如何优化单页面应用的首次加载的速度？
  * 缓存一切可以缓存的资源，压缩一切可以压缩的资源； 缓存带来的好处是显而易见的，可大幅减少由于http请求而耗费的时间
  * 使用CDN缓存； 
  * 路由懒加载；  在资源不需要的时候不需要加载，可以减少首屏加载是请求的资源大小
  * 启用Gzip压缩；  对静态资源进行gZip压缩，能减少请求资源数据的大小。 webpack 其中一个插件既可以做到，配置文件里面配置好即可。  当然需要资源能生成gzip 同时服务端配置开启。
  * 控制图片资源请求占用浏览器并发请求个数的比例；  以chrome浏览器为例，浏览器并发请求个数在同域名下只有6个，对于一般图片静态资源和js等静态资源在同一域名下的情况，需要控制图片资源并发请求的数量，避免阻塞静态资源的加载，影响首屏的加载。
  * 合并小图 ---- 雪碧图
  * 减少http请求数量；  一般能在一次请求获取数据的时候不要分开多次请求，原理同上，
  * 异步加载第三方资源
  * 避免重定向；  重定向会影响加载速度，所以在服务端设置避免重定向
  * 用 webp代替png图片； 
  * css放在头部，js等放在尾部；
  * 合理使用requestAnimationFrame代替setTimeout；
  * 减少重绘和回流
  * 减少css选择器的层级， 在js中尽量使用id选择元素；
  * 不声明过多的font-size； 这样会引起css树生成的效率低下 
### * 简述浏览器存储有哪几种方式？有什么样的区别？ cookie存储有什么坏处？
  #### 浏览器存储包含有4中 localStorage、 sessionStorage、 cookie 以及 indexedDB.
  * cookie： cookie用来做存储最致命的坏处就是会随着请求发送给服务器，增加http请求体的体积，降低数据传输的效率；另外大小不能超过4k；
  * localStorage 和 sessionStorage 基本上api是一致的；他们根本的区别在于sessionStorage伴随着当前会话存在的，不会在其他页面被共享，随着当前标签页的关闭会清空，而前者不会清空，并且会共享；两者的大小限制一般都是5M
  * indexedDB ： 是一种底层的api，是一种基于事务的事务型数据库系统，类似于sql。然后不同的是，它使用固定列表，是一个基于javaScript的面向对象的数据库。 具体用法： [#https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API]
### * 如何实现```rem```？ 输入代码。
  ```rem``` 是一种只自适应方案的css单位，其值相对于html根元素的font-size 的大小。根元素默认字体大小一般都是 16px。一般在的移动端使用较为广泛，由于移动端尺寸参差不齐，实现rem的方式一般是根据文档的宽高和当前设计图尺寸，使之按照一定的规则使得在不同屏幕宽度下 能够使得测量的效果图尺寸直接 / 100 得到正确的rem的值；具体代码如下：
  ```
    // 声明一个函数，用于初始化和窗口变化时，实时计算出根元素所应该设置的font-size的值
    /**
     * @params [Number] UISize 传入当前项目UI效果图设计的尺寸  默认值 750   即 375px的物理像素
    */ 
    function initRootHtmlFontSize(UISize = 750) {
      // 获取根节点
      let docEl = document.documentElement,
        // 事件名称  用于绑定 全局事件  
        resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize';
      let reCalc = UISize => {
        // 取出屏幕宽度
        let windowWidth = docEl.clientWidth;
        if(!windowWidth) return
        // 一般大于设计图尺寸的屏幕  就按照 原始尺寸即可  有特殊要求 可另外处理 
        if(windowWidth > UISize)  {
          docEl.style.fontSize = '100px'
        } else {
          // 此处意思即为  按照将屏幕宽度 与 UI 宽度的比值 换算 出 字体相对于 100 px时 应该设置的 大小   保证算出的rem 都是直接那 测量值 / 100  就是 准确的 rem 值
          docEl.style.fontSize = windowWidth / UISize * 100 + 'px'
        }
      }
      // 绑定时间
      window.addEventListener(resizeEvent, reCalc, false)
      winow.addEventListener('DOMContentLoaded', reCalc, false)
      // 调用
      reCalc(UISize)
    }
  ```
### * 如何准确校验一个对象的数据类型？
  * 使用 ```typeof ```可以对数据进行简单的判断
    其中 ```typeof null```  ```typeof {}```  ```typeof []``` 都是 ```Object```; 这个关键字并无法区分具体的类型；
  * 准确判断一个对象的数据类型最有效的方式就是使用 ``` Object.prototype.toString.call()```
    ``` 
      Object.prototype.toString.call({}) === [object Object]

      Object.prototype.toString.call(222) === [object Number] 

      Object.prototype.toString.call('a') === [object String] 

      Object.prototype.toString.call(undefined) === [object Undefined] 

      Object.prototype.toString.call([]) === [object Array] 

      Object.prototype.toString.call(function(){}) === [object Function] 

      Object.prototype.toString.call(null) === [object Null] 

      Object.prototype.toString.call(false) === [object Boolean]

    ```

### * 简述JS单线程 ```event loop```？
  * 总所周知：js是单线程。 也就是同一时间只能干一件事情。 这个是因为js本身的用途就是作为浏览器的脚本语言，与用户交互，操作DOM。如果js是多线程的话，一个线程为某个节点添加了内容，一个线程将这个节点删除， 那就乱套了。所以单线程就意味着所有的事件都要排队，只能一个一个来。js的设计者为了避免前一个任务（尤其是IO设备的数据读取）耗时过长引起的后面的任务被阻塞的问题，因此会把任务挂起，吸先执行后面的任务，也就是分成了同步任务，和异步任务， 其中异步任务又分为 微任务（promise， process.nextTick 等） 和 宏任务（setTimeout， setInterval 等）。
  * 整个事件循环过程如下：
    * 控制器执行全局script同步代码，期间遇到微任务，将微任务放到 微任务的事件队列， 宏任务放到宏任务的事件队列，同步事件放到同步事件队列；
    * 执行环境将同步事件队列里的事件一个一个的拉到调用栈里执行，执行完之后清空调用栈；
    * 紧接着会从微任务事件队列里面的回调任务中一个一个的在调用栈里面执行（注意，此时如果在微任务执行过程中产生的微任务，此任务会放到当前微任务的队列尾部，在此次事件循环周期内执行），直到队列里面的事情执行完毕，清空调用栈；
    * 待微任务执行完成之后，会取出宏队列中的首个任务放到执行栈中调用， 如果次过程中有微任务出现，则执行完当前宏任务中的同步任务之后，会立即调用此次产生的宏任务，直到微任务执行完成，跳出此次宏任务，继续执行宏任务队列的下一个任务。当然，此次宏任务执行中产生的宏任务将会在下一次事件循环周期内执行。
    * 宏任务执行完成之后，清空宏任务队列和调用栈，此次事件循环周期结束。
    * 重复微任务队列的任务执行 至  宏任务队列的任务执行完毕， 周而复始。

### * 简述堆栈溢出的原理？如何避免？
  * js是单线程的，因此执行是总是一个一个来，但是基于性能考量， 将js任务分为了同步任务和异步任务。 其中异步中还包含微任务和宏任务，各个任务在执行的时候都在对应的事件队列，等待调用。 而js 在执行的时候是基于一个执行上下文的抽象概念，执行上下文在逻辑上形成一个堆栈，栈的底部永远都是global context--- 全局上下文，而最顶部就是活动的当前执行上下文。 遇到新的作用域产生，就会形成新的上下文，每形成一个上下文，都会推入到当前的执行栈里， 当上级的上下文未结束，又有了新的上下文产生，就会导致执行栈越来越大，超过限制就会出现栈溢出。
  * 举例说明： 
    当有一个递归函数,次函数就会产生栈溢出，原理如下： 在全局上下文中，发现的fn函数，此时 调用栈会将此函数放入调用栈中执行，同时会形成一个基于fn 的上下文产生，当fn执行时，注意 执行fn中的fn时外层fn 并未结束，就直接形成了一个新的上下文，并将新的函数fn放入执行栈中执行，依次往复，调用栈数量越来越多，最终导致 栈溢出。
    ```
      function fn (x) { 
        x++; 
        if(x > 100000) {
          console.log(x);
          console.trace()
          return; 
        }
        fn(x)
      }
    ```
  * 避免方式： 
    知道了原理，就非常好避免了。 形成堆栈溢出的原因就是因为上下文未结束又形成了新的上下文，上下文伴随这新的作用域产生，因此只要作用域没有递归产生，就不会溢出。还拿上面的方法来说吧，为了实现100000次递归调用，我们可以换一种实现方式：
    ```
      function fn(x) {
        x++;
        if(x > 100000) {
          console.log(x);
          console.trace()
          return x
        }
        return fn.bind(null, x)
      }
      function recusionTool(fn) {
        while(fn && typeof fn === 'function') {
          fn = fn.apply(null, [arguments])
        }
      }
    ```
    这样， 便能无限制的调用此fn函数了，当然，如果你电脑配置不好 最好设置循环次数小一点，以免卡死。 根据打印出来的效果就能看到，这样的调用栈就只又三个，因为 全局调用栈 执行到 recustionTool时，形成了上下文，每次执行 fn的时候再形成fn 的上下文，但是 fn执行完了之后便结束，会跳出当前上下文，栈针从新指向了上一级也就是递归工具函数的上下文，因此， 无论循环多少次，此调用栈最多也就三个执行任务，三个执行上下文，永远不可能出现栈溢出。 当然还有其他方式，理论上都是一致的，只要知道了原因，解决起来还是很简单的。
### * 简述 ```js``` 实现继承的几个方法， 分别由什么优缺点？
  定义一个父类
  ```
    function Animal (name) {
      this.name = name
      this.sleep = function () {
        console.log('shuijiao')
      }
    } 
    Animal.prototype = {
      eat: function (food) {
        console.log('吃' + food)
      }
    }
  ```
  * 原型链继承
    将子类的原型指向父类的实例
    优点： 父类新增方法，所有子类都可以访问到，实现简单；
    缺点: 来自原型对象上的所有引用类型属性被所有实例共享； 创建子类实例时，无法向父类传参数；
    ```
      function Cat(){ 
      }
      Cat.prototype = new Animal();
      Cat.prototype.name = 'cat';
    ```
  * 构造继承
    直接再子类构造器里使用父类构造函数扩充；
    ```
      function Cat() {
        Animal.call(this, 'cat')
      }
    ```
    优点： 可以实现继承多个父类； 可以传参数;  父类引用属性不共享；
    缺点： 实例不继承父类； 不能继承父类的原型上的属性和方法； 无法复用， 每个子类都又父类函数的副本
  * 实例继承
    直接再子类构造函数内返回父类的实例
    ```
      function Cat(name) {
        let instance = new Animal(name)
        // instance.age = 1   可以为父类实例添加新特性
        return instance
      }
    ```
    优点： 不管用不用new 关键字， 调用就会产生一个继承了父类的实例
    缺点： 实例是父类的实例，不是子类的； 无法多继承
  * copy继承
    直接在子类构造器里将父类的属性遍历出来添加到 子类  ； 此方式性能低， 不再讲诉；
  * 组合继承
    通过构造继承，继承并保留传参 的优点，然后通过父类的实例作为子类的原型，实现函数复用
    ```
      function Cat() {
        Animal.call(this)
      }
      Cat.prototype = new Animal()

      <!-- 需要修复构造函数指向 -->
      Cat.prototype.constructor = Cat
    ```
    优点： 即使子类的实例，也是父类的实例； 能传参数； 不存在引用类型属性的共享问题；函数可复用
    缺点： 调用了两次父类构造函数，生成了两份实例；  子类原型被屏蔽了
  * 寄生组合继承
    ```
      function Cat () {
        Animal.call(this)
      }
      (function () {
        var super = function() {}
        super.prototype = new Animal()
        Cat.prototype = new Super()
      })()
      Cat.prototype.constructor = Cat
    ```
    缺点： 实现复杂；
  * class 类继承 
    定义一个父类 Class 可以通过extends 继承 父类
### * ```new``` 一个对象 经历了哪几步?
  new 一个对象 总共分4步  以 ``new Class()`` 为例：
  * 先创建一个空对象，用于存值 ``var obj = {}``
  * 定义 obj的__proto__ 属性 指向 构造函数的原型  ```obj.__proto__ = Class.prototype```
  * 使用新的对象调用构造函数，函数中的this指向当前对象obj; ``Class.call(obj)``
  * 将初始化完成的对象地址（如果函数执行返回值非饮用类型，那此时会将具体的返回值赋予等号 左边的变量），赋值给等号左边的变量 ; ```var o = new Class()```   即将刚刚生成的obj的对象所在的堆内存的地址赋值给 o；
### * 如何实现深度克隆？如何实现一个浅复制？
  * 深度克隆
    第一种方式： 直接遍历当前对象，然后根据当前对象的属性值是引用类型还是非引用类型 进行复制 或 递归调用
    ```
      function deepCopy(o) {
        let newObj = Object.prototype.toString.call(o) === '[object Array]' ? [] : {}
        if(o && typeof o === 'object') {
          for(let key in o) {
            if(o.hasOwnProperty(key)) {
              newObj[key] = typeof o[key] === 'object' ? deepCopy(o[key]) : o[key]
            }
          }
        }
        return newObj
      }
    ```
    第二种方式， 利用JSON的形式
    ``` let newObj = JSON.parse(JSON.stringify(oldObj))```  
    注意： 此方式只适合纯数据的clone ；如果对象中有function ，则会被直接忽略， 不会进行复制操作； 使用是建议使用第一种方式。
  * 浅复制
    其实浅复制根深度复制基本上差不多，只是在第一次遍历的时候，不需要判定对象值的类型进行下一步的递归。 数组的浅复制可以直接用 slice方法既可实现。
### * 如何实现 ```ajax``` 的拦截处理?

### * 跨域处理的几种方式？如何实现？ 跨域请求到底发出了没有？
  跨域的出现，是由于浏览器的同源策略，
### * 什么是 ```XSS``` 和 ```CSRF```？ 如何预防？

### * ```let```、```const```、```var``` 分别由什么特点？ 各有什么好处或坏处？```var``` 出现变量提升的原理？

### * 简述Promise实现原理。 可否手动实现一个？  另外就是说出某些代码的执行顺序。

### * 简述 ```Vue``` 双向绑定原理？ 简述 ```computed``` 计算属性的实现原理？

### * ```Vue``` 组件中 ```data``` 为什么需要是一个函数？

### * ```Vue``` 组件的扩展有哪几种方式？

### * 简述 ```vuex``` 的实现原理？ ```vuex``` 是在 ```Vue``` 的那个生命周期内挂载到vue实例上的？

### * 简述 ```vueRouter``` 实现原理？

### * 如何提高 ```webpack``` 构建速度？ 什么是长缓存？在 ```webpack``` 中如何做到长缓存优化？

### * 什么是```Tree-shaking``` ？ CSS可以```Tree-shaking```吗？

### * 简述 ```webpack``` 中代码分割（```code-split```）的作用？ 如何使用？

### * 什么是 ```babel``` ？ 如何使用？

### * ```css``` 预编译器有哪些？ 用过那些？ 在 ```webpack``` 中如何配置？

### * 如何实现未知宽高的元素居中？ 如何为一个div 添加两张背景图？

### * ```css``` 中 ```flex``` 布局都有那些？ ```flex-shrink``` 是用来作什么的？

### * Js 正则表达式 有哪些断言规则？ RegExp 对象有哪些方法？ 使用时有什么注意事项？

### * base64 有什么好处和坏处？