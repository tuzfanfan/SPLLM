# Java开发专家精通Spring 2.x Java Web开发

**作者**: 张钰

---

未经许可，不得以任何方式复制或抄袭本书之部分或全部内容。

版权所有，侵权必究。

* * *

图书在版编目（CIP）数据

精通Spring 2.x Java Web开发/张钰编著.—北京：电子工业出版社，2008.9

（Java开发专家）

ISBN 978-7-121-07207-9

I.精… Ⅱ.张… Ⅲ.JAVA语言—程序设计 Ⅳ.TP312

中国版本图书馆CIP数据核字（2008）第117918号

* * *

责任编辑：王树伟 李新承

印 刷：北京智力达印刷厂

装 订：北京中新伟业印刷有限公司

出版发行：电子工业出版社

北京市海淀区万寿路173信箱

邮 编100036

开 本：787×1092 1/16

印 张：24.25

字 数：659.6千字

印 次：2008年9月第1次印刷

印 数：5000册

定 价：48.00元（含光盘1张）

凡所购买电子工业出版社图书有缺损问题，请向购买书店调换。若书店售缺，请与本社发行部联系，联系及邮购电话：（010）88254888。

质量投诉请发邮件至zlts@phei.com.cn，盗版侵权举报请发邮件至dbqq@phei.com.cn。

服务热线：（010）88258888。

目 录

内容简介

出版说明

序

第1章 开始Spring之旅

1.1 获取并查看Spring

1.1.1 获取Spring

1.1.2 Spring项目文件简介

1.1.3 查看Spring源码

1.2 开始使用Spring

1.3 小结

第2章 控制反转（IOC）和依赖注入（DI）

2.1 认识IOC

2.1.1 开始第一个实例：超级玛丽之人物构造

2.1.2 3种不同的注入方式

2.1.3 注入方式的选择

2.2 详解Spring的Bean

2.2.1 bean的标识（id和name）

2.2.2 Bean的类（class）

2.2.3 Bean的作用域

2.2.4 Bean的属性

2.2.5 Bean中应用其他的Bean

2.2.6 集合的注入

2.2.7 ＜util＞标签

2.2.8 null值的处理

2.2.9 使用依赖depends-on

2.2.10 延迟初始化Bean

2.2.11 Bean的生命周期

2.2.12 Bean的5种装配模式

2.2.13 Bean依赖检查的4种模式

2.2.14 Bean的管理

2.2.15 两种不同的Bean

2.2.16 超级玛丽游戏初始化之完结篇

2.3 详解ApplicationContext

2.3.1 ApplicationContext的初始化

2.3.2 消息处理机制

2.3.3 资源读取

2.3.4 事件传递机制

2.4 小结

第3章 Spring的AOP实现

3.1 正则表达式简介

3.2 AOP概述

3.2.1 代理机制

3.2.2 AOP中常用术语

3.3 传统的AOP支持

3.3.1 前置通知Before Advice

3.3.2 后置通知After Advice

3.3.3 环绕通知Around Advice

3.3.4 异常通知Throw Advice

3.3.5 NameMatchMethodPointAdvisor

3.3.6 RegexpMethodPointcutAdvisor

3.3.7 DefaultPointcutAdvisor

3.3.8 引介

3.4 Spring 2.0中的AOP

3.4.1 Spring 2.0中的Pointcut定义

3.4.2 基于XML Schema的前置通知

3.4.3 基于Annotation的前置通知

3.4.4 基于XML Schema的后置通知

3.4.5 基于Annotation的后置通知

3.4.6 基于XML Schema的环绕通知

3.4.7 基于Annotation的环绕通知

3.4.8 基于XML Schema的异常通知

3.4.9 基于Annotation的异常通知

3.4.10 SpringAOP综合运用之超级玛丽完结篇

3.5 小结

第4章 Spring持久层的封装及事务支持

4.1 初识Spring持久层

4.1.1 DAO的支持

4.1.2 数据源的注入

4.1.3 多种数据源的置换

4.2 JDBC的支持

4.2.1 Template模式

4.2.2 JdbcTemplate

4.2.3 使用JdbcTemplate查询数据库

4.2.4 使用JdbcTemplate更新数据

4.2.5 AbstractLobCreatingPreparedStatementCallback

4.2.6 面向对象查询数据

4.2.7 NamedParameterJdbcTemplate

4.2.8 SimpleJdbcTemplate

4.3 Spring事务支持

4.3.1 Spring事务概述

4.3.2 编程式事务管理

4.3.3 事务属性

4.3.4 声明式事务管理

4.4 小结

第5章 Spring的MVC

5.1 开始Spring MVC

5.1.1 IDE的准备

5.1.2 第一个MVC实例

5.2 Handle Mapping

5.3 ModelAndView

5.4 View

5.5 Controller

5.5.1 AbstractController

5.5.2 BaseCommandController、AbstractCommandController

5.5.3 SimpleFormController

5.5.4 MultiActionController

5.5.5 AbstractWizardFormController

5.5.6 ParameterizableViewController

5.6 拦截器

5.7 数据绑定

5.8 验证器

5.9 Spring和其他视图技术的整合

5.9.1 整合JSTL

5.9.2 整合Velocity

5.9.3 整合FreeMarker

5.9.4 整合Tiles

5.9.5 整合自定义View

5.10 本地化支持

5.11 小结

第6章 与其他Web框架的整合

6.1 整合Struts

6.1.1 Struts介绍

6.1.2 一个Struts的例子

6.1.3 一个Struts整合Spring的例子

6.2 整合JSF

6.2.1 JSF介绍

6.2.2 第一个JSF实例

6.2.3 一个JSF整合Spring的例子

6.3 整合EasyJWeb

6.3.1 EasyJWeb介绍

6.3.2 第一个EasyJWeb实例

6.3.3 一个Spring整合EasyJWeb的例子

6.4 小结

第7章 Spring和JPA

7.1 JPA介绍

7.2 JPA常用标签

7.2.1 @Entity、@Table

7.2.2 @Id、@Column

7.2.3 关系映射标签

7.3 Spring对JPA的支持

7.3.1 Spring实体管理器、实体管理工厂的创建

7.3.2 pesistence.xml

7.3.3 自动生成数据表

7.3.4 JPA操作数据

7.4 Spring整合JPA实例

7.4.1 Spring MVC+JPA

7.4.2 Struts2+Spring+JPA

7.4.3 JSF+Spring+JPA

7.4.4 EasyJWeb+Spring+JPA

7.5 小结

第8章 Spring的其他应用

8.1 Spring远程访问资源

8.2 定时器

8.2.1 Quartz

8.2.2 TimerTask

8.2.3 Web定时器

8.3 邮件

8.3.1 普通文本邮件

8.3.2 图文邮件

8.3.3 带附件的邮件

8.4 文件上传

8.4.1 单个文件上传

8.4.2 多个文件上传

8.5 小结

第9章 Spring实例——新闻发布系统

9.1 系统设计方案

9.2 系统域模型设计

9.3 DAO设计

9.3.1 泛型DAO设计

9.3.2 单个DAO设计

9.4 系统控制器设计

9.4.1 分页引擎的设计

9.4.2 新闻控制器NewsAction

9.4.3 用户控制器UserAction

9.4.4 收藏控制器CollectAction

9.4.5 订阅控制器SubscribeAction

9.4.6 风格控制器PageAction

9.5 定时器设计

9.6 系统页面设计

9.7 小结

# 内容简介

本书按照从易到难、由浅入深、循序渐进的顺序介绍Spring，并使用大量的实例使读者更加深刻地理解所学习的知识，更好地进行开发实践。本书深刻地揭示了Spring的技术内幕，对IOC、DI、AOP、事务管理等根基性的技术进行了深度的讲解。读者阅读本书后，不但可以熟练使用Spring的各项功能，而且还能够对书中的实例举一反三。

本书分为9章，主要内容包括：Spring基础介绍、控制反转（IOC）和依赖注入（DI）、Spring的AOP实现、Spring持久层的封装及事务支持、Spring的MVC、与其他Web框架的整合、Spring和JPA、Spring的其他应用、Spring实例——新闻发布系统等。

本书适合从事程序设计、系统开发的人员和程序设计爱好者参考学习。

“开发专家之SunONE”全新提升为“Java开发专家”系列

——源自精品成就理想

# 出版说明

★从“开发专家之SunONE”到“Java开发专家”

“开发专家之SunONE”系列丛书从诞生之日至今，已经4岁了。在这个系列里面，我们一直努力体现着这么一个理念：用一种较为敏锐的视角来跟踪信息技术的发展轨迹，并把可能为广大程序员所希望获得的知识，用图书出版的方式奉献给大家。

在这个系列中，我们陆续出版了约30种图书，有《Java与模式》、《JSP应用开发详解（第二版）》、《精通EJB（第三版）》、《Tomcat与Java Web应用开发详解》、《精通Struts：基于MVC的Java Web设计与开发》、《JBoss管理与开发核心技术（第三版）》、《精通Spring》、《精通Hibernate：Java对象持久化技术详解》等一大批读者朋友耳熟能详的作品。很多作品都是在国内没有同类图书的情况下出版的。在这几年的出版工作中，我们时刻感受着市场的风险，也时刻收获着无数读者给我们的认可。

在这个系列中，凝聚了大量资深技术专家的心血。有大家熟知的阎宏、刘晓华、孙卫琴、罗时飞等，还有一些正在不断上升的开发高手。这些非常优秀的国内原创作者们一直都在支持着“开发专家之SunONE”系列的出版工作，在这里，我们要向他们说声：谢谢。

桃李不言，下自成蹊。由于这些年“开发专家之SunONE”在“两个效益”中的杰出表现，电子工业出版社授予这个系列“最佳品牌奖”。

时代不断前进，技术不断变革。为了顺应Java领域的技术发展态势，为了赋予这个经典的图书系列更强的生命力，我们将“开发专家之SunONE”升级为“Java开发专家”。我们将继承原有的出版理念，紧密跟踪技术热点和发展趋势，会聚更多优秀作者，全力奉献更经典的作品。

★规划你的Java开发之路

喜马拉雅山脉的最高峰在温室效应中不断地降低，而Java世界的颠峰永远都在技术人员的追求中不断升高。每个人都有不同的路，每个人都有不同的行路方式，不过，往往“到了山顶才发现，错误的路和正确的路就差那么几步”！

身处Java洪流中的程序员最累（不过大家都说Java程序员薪水最高，呵呵），我们简单整理了一下Java领域的相关技术、工具、架构，如下图所示。这个框图中的每一个英文单词（或缩写）都可以写成一本书。Java领域还有一个特点，那就是商业产品和开源产品层出不穷，潮流不断。相比于其他领域，如.NET, Java开发更是体现了这句谚语：条条大路通罗马。罗马只有一个，大路却有多条。看上去，似乎到罗马很容易，反正路多嘛。不过，路多却容易迷失方向。当你在Java领域中摸爬滚打几年后，发现自己在无数条道路上走了很久，却不知道罗马何日才能到达，甚至连罗马的方向都不知道，这时你肯定会很失落。

很遗憾，在这个简短的出版说明里面，我们无法告诉你每一条连贯的、不费周折的通往罗马的道路该如何走。或许，通过“Java开发专家”系列中的某本书，你可以找到属于你的正确道路。在一般情况下，我们不会就某一项很窄的话题来单独写一本书，我们还是希望通过我们的专业知识和智慧，尽力把相关技术整合起来，用较为简明的方式表达出来，最后由你来选择。

这里有句话与大家共勉：少走弯路，就是捷径！

★“Java开发专家”的奉献

犹如在上面那个框图中展现的那样，我们希望在各个层面、各个方向上都能给读者奉献出优秀的图书作品，全面体现技术与应用的结合。从宏观上看，我们会从语言、IDE、环境、数据库、架构与应用、安全、项目与测试等方面进行选择，选出一些读者迫切需要的技术来先行规划。

“Java开发专家”虽然新蓓初绽，但因其源自盛放的

“开发专家之SunONE”系列而根基稳健，两个系列会有一段很长的并行时间，我们会用一种优化的方式来保证读者的顺利选择。无论哪一个系列，必定都有大家喜欢的图书。

在技术上，有着持久化的方法，在学习上，也需要有持久化的精神。

从“开发专家之SunONE”到“Java开发专家”，希望可以带给你持久化的动力。

★关于本书

从2004年发布第一个版本以来，Spring逐渐被更多的Java开发人员的所使用，得到了Java Web开发人员的认同。Spring以反向控制和AOP为框架和核心，统一了应用对象的配置、查找、生命周期管理等工作，清晰地划分出业务逻辑与基础服务两者不同的关注面，开发人员可以使用简单Java对象轻松拥有EJB一样强大的功能。Spring是一站式的开发框架，它通过自身实现和第三者集成两种途径提供了Java企业应用展现层、业务层、持久层等各项技术。

本书按照从易到难、由浅入深、循序渐进的顺序介绍Spring，并使用大量的实例使读者更加深刻地理解所学习的知识，更好地进行开发实践。本书深刻地揭示了Spring的技术内幕，对IOC、DI、AOP、事务管理等根基性的技术进行了深度的讲解。读者阅读本书后，不但可以熟练使用Spring的各项功能，而且还能够对书中的实例举一反三。全书按照Spring的实际应用共分为9章，主要介绍如何使用Spring、控制反转（IOC）和依赖注入（DI）、Spring的AOP实现、Spring持久层的封装及事务支持、Spring的MVC、与其他Web框架的整合、Spring和JPA、Spring的其他应用等，全书最后用一个新闻发布系统实例来全面介绍了Spring的Web开发技术。

联系方式

咨询电话：（010）68134545 88254161-67

电子邮件：support@fecit.com.cn

服务网址：http://www.fecit.com.cn http://www.fecit.net

通用网址：计算机图书、飞思、飞思教育、飞思科技、FECIT

# 序

有意义与没意义

“士兵突击”里许三多的一句名言是：“活着要做有意义的事，做有意义的事就是要好好活”。

ErikChang是两年前因为EasyJF开源团队而认识的，在团队里面的昵称叫天意。当时，我们一起讨论团队的发展，一起讨论时下兴起的技术，现在回想起来，虽然当时讨论的都是一些细小、无须讨论或者跟本无解的问题，但却是通过探讨与解决这些细小的问题让EasyJF走到了今天。

虽然我们一个在北边，一个在南边，素未谋面，为了同一个梦想，跟其他的成员一起为团队的事务奔忙着，不亦乐乎，这也许就是开源的力量吧。同样因为开源，Spring由一个名不见经传的商业应用变成了一个全世界广泛应用的框架，他不但让全世界知道了J2EE可以without EJB，更重要的是让我们领略到开源在软件变革领域中决定性的作用，因为Spring的成功给软件领域不断的传播、灌输着软件开发新方法、新思路及新的模式。

仅仅会在项目中有限地应用，Spring从工作上来说也许足够，但我觉得这对不起自己从事的这份职业，用许三多的话说就是“这没意义！”。因为，Spring已经让开发变得非常简单，到培训班培训几天，拿一个证基本上就能用Spring这已经不是什么奇怪的事。那么，对于一个JavaEE程序员来说，什么才有意义呢？Spring项目里面有很多能集各种设计模式、编码技巧为一体的编码设计艺术，在灵活应用Spring的同时，若能把Spring项目里面的精华、设计思想、编码技巧等吸纳过来，这对于程序员来说将会是一件非常有意义的事。

对于我这样一个爱书、爱开源及爱Spring的人来说，每一次读市面上关于Spring的图书，都会让我对Spring有新的认识及体验，因为每一个作者都会用他所认识的方式来告诉我们什么是Spring、怎么用Spring。由所选择的点不同，角度的不540C，因此读多了就知道Spring真正是什么。

2007年，我跟ErikChang、船长、stef等曾经打算合作写一本能“深入Spring 2”的书籍，然而由于工作的原因，却没能坚持到最后，遗憾的同时，也让我深深体会到了写作的艰辛。2008年春节刚过，ErikChang突然告诉我，他已写完了一本关于Spring 2的书籍。给我发了《精通Spring 2.x Java Web开发》的几章，我一口气读完，感到非常欣慰与惊叹。欣慰的是我读到了一本真正“Spring 2”的书，惊叹的是ErikChang在几个月的时间里奇迹般地写出这么多的东西。

不管您是Spring的新手还是老手，我相信你从这本书中一定能读到以前所不了解的Spring，在应用好Spring的同时，了解他的设计原理，了解他里面的设计精华及编码艺术，这将会为您增加不少的财富。

只是能简单地应用Spring，这没意义；反复不断地深入学习Spring的源码，并把收获及心得拿出来与大家分享，这有意义。因此，ErikChang做了一件非常有意义的事。

用心能做好一件事，执着能让我们取得成功。祝愿每一位读者朋友工作顺利，事业成功！

EasyJF 创始人 技术总监 蔡世友，

# 第1章 开始Spring之旅

自从Spring问世以来就引起了J2EE业界的关注，J2EE开发原本就是一个很复杂的领域，很多初级程序员都不敢涉足，Spring改变了这个局面，Spring出现以后迅速使J2EE开发越来越简单，某种程度上促进了软件生产力的发展，Spring已经成为众多程序员都日益青睐的开发框架，本章将带领大家开始学习Spring，主要内容如下。

●Spring源码的获取

●源码内容说明

●第一个Spring实例

## 1.1 获取并查看Spring

在使用Spring之前首先要获取该框架的jar包，同时Spring是一个开源项目，有兴趣的读者可以查看Spring源码，了解Spring的设计思想及源码的编写，本节带领读者一步步来获取并查看Spring源码，使读者学会独立获取Spring并在Eclipse IDE中查看Spring源码，对Spring有个概念的认识。

### 1.1.1 获取Spring

首先到官方网站下载Spring, Spring的官方网址是http://www.springframework.org/，单击download栏目，进入下载页面，如图1-1所示。

图1-1 Spring官方下载界面

然后单击需要下载的Spring版本，笔者推荐尽量选择最新的版本，如当前的SpringFramework 2.0.7（到本书撰写完毕Spring最新版本已经涉及到2.5），可进入www.source forge.net中下载Spring的源代码，如图1-2所示。

图1-2 sourceForge下载主界面

备注：SourceForge是全球最大的开放源代码软件开发平台和仓库。它集成了很多开放源代码应用程序，为软件开发提供了整套生命周期服务。SourceForge.net是开放源代码软件的开发者进行开发管理的集中式场所，也是源代码仓库。

通过单击SourceForge中Spring项目相应的链接，即下载Spring 2.0的整个项目源码，如图1-3所示。

图1-3 sourceForge下载界面

### 1.1.2 Spring项目文件简介

下载完成后，得到一个类似Spring-framework-2..0.7.zip的压缩包，然后解压该压缩文件，即可见到Spring的项目文件，如图1-4所示。

图1-4 Spring项目文件列表

1.根目录

在根目录上，主要是Spring开源项目的ant脚本文件build.xml, maven脚本maven.xml等，可以在命令行输入ant tests来运行Spring的所有测试代码，另外，还可以使用ant build及ant alljars实现在本机上根据自己的jdk重新编译Spring，并生成相关的jar包等。

在根目录上，还有Spring的发布协议说明license.txt、项目说明readme.txt、变更日志changelog.txt和注意事项notice.txt等。

2.dist目录

在Spring项目的文件中，dist是已经编译打包好的发布jar, dist中的文件结构如图1-5所示。

图1-5 Spring项目中dist目录文件列表

其中spring-src.zip是Spring源码的压缩包，spring.jar是经过编译后的打包文件，spring-mock.jar是spring提供用于单元测试中模仿对象的相关类，spring-aspects.jar是spring与aspectj集成的jar包。resources目录是Spring项目的相关资源文件，如配置文件描述符spring-beans.dtd等。

dist中的modules目录是spring各组成部分发布jar包，因为Spring的各组成部分是完全独立的，用户可以在只选择使用Spring中的一部分功能，而不是全部的时候，直接使用相关部分jar即可，比如，只用spring mvc选择spring-webmvc.jar，要用Spring中的jdbc封装可以直接选择spring-jdbc.jar, modules中的内容如图1-6所示。

图1-6 Spring项目的modules目录列表

3.docs目录

docs目录是Spring项目的文档目录，里面主要包括Spring项目使用说明文档及系统API等，在Spring 2.0的项目中，包括api文档，spring mvc应用简单示例、spring参考手册和spring标签库简介等几个部分，如图1-7所示。

图1-7 spring项目docs目录列表

4.mock目录

mock目录是Spring用于单元测试中模仿对象的mock实现源代码，也就是spring-mock.jar中的源码。

5.Aspectj目录

Aspectj目录是Spring与Aspectj集成的源代码及应用测试代码。

6.Src目录

Src目录是Spring项目的全部源代码。

7.Samples目录

Samples目录是Spring项目的应用程序示例源代码，主要包括一个简单的网上商店jpetstore，一个宠物医院petclinic。另外，还简单演示一些特殊功能的countries和imagedb等。通过这些示例程序代码，可以快速地学习到Spring的使用方法。

8.Test目录

Test目录是Spring项目的单元测试代码，Spring作为测试驱动开发的推崇者，有着非常详细的单元测试用例，通过单元测试代码，可以快速地掌握Spring各个类的方法。

9.tiger目录

tiger是Spring项目中使用java tiger版中的新功能及特性的源代码，包括注解等。

10.Lib目录

Lib目录中包括了Spring项目用到的所有jar文件，Spring的很多功能都是在一些现存的项目上搭建起来的，另外，Spring集成了很多优秀的开源项目。因此，要使用这些特性，必须在项目中引入相关的jar。在Spring的lib目录中，这些jar文件分门别类地存放于lib的子目录中，如图1-8所示。

图1-8 Spring项目lib目录列表

### 1.1.3 查看Spring源码

由于Spring的功能相当强大，其源代码的数据及源代码的层次结构等都相当复杂，因此需要借助专业的Java开发工具来查看Spring的项目源码。Spring 2.0的源代码需要在Jdk 1.5以上的版本中才能全部正常编译。下面演示在Eclipse中如何打开Spring的源代码。

（1）在Eclipse中新建一个工程，在“新建工程”对话框中，选择“create project from existing source”，然后通过“浏览文件夹”对话框选择Spring项目的解压目录，如图1-9所示。

图1-9 查看Spring源码步骤1

（2）选择好Spring项目的目录后，单击【Next】按钮，Eclipse会加载Spring项目文件，进入项目的setting配置对话框。在该对话框中主要检查Source（源代码目录）及Libraries（相关jar包）两个部分，分别如图1-10和图1-11所示。

图1-10 查看Spring源码步骤2（Spring项目的源码路径）

图1-11 查看Spring源码步骤3（Spring项目所需要的jar库文件）

（3）单击【Finish】按钮，完成项目的建立，这里即可通过Eclipse的package explorer视图面板查看Spring项目的源代码，如图1-12所示。

图1-12 查看Spring源码步骤4

## 1.2 开始使用Spring

可以直接利用Spring的相关jar包，开始使用Spring。下面演示使用Eclipse开发一个简单的Spring示例的程序。

（1）使用Eclipse的new project向导，新建一个名为spring-hello的工程，如图1-13所示。

图1-13 建立一个Java工程

（2）新建一个名为Hello的类，Package设置为spring.chapter1，如图1-14所示。

图1-14 新建一个类

（3）把所需要使用的Spring项目的jar文件加入到当前工程的Libraries中，本例中只使用Spring中简单的IOC功能，只需要spring-beans.jar、spring-core.jar及commons-logging.jar 3个包即可。

用鼠标右键单击工程名称，查看工程属性，选择工程属性中的Java Builder Path，然后选择Libraries选项，通过单击【add external jar】按钮把外部的jar文件添加到工程项目中，如图1-15所示。

图1-15 添加相关jar到classpath中

（4）输入Hello.java的完整源代码，其中Hello这个类有一个msg属性，有一个setMsg方法用于设置msg属性的值。另外，直接在Hello的main方法中使用Spring的Bean工厂来从配置文件中加载一个名为helloBean，类型为package spring.chapter1.Hello的Bean。然后调用这个Bean的sayHello方法。全部源代码如下所示：

（5）在与Hello.java同级的目录下，建一个名为bean.xml的Spring配置文件，在这个Bean配置文件中定义helloBean，并通过依赖注入设置helloBean的msg属性值，其内容如下：

完成后的工程项目如图1-16所示。

图1-16 第一个类建立完毕后的项目图

（6）运行程序，在Hello.java上单击鼠标，选择Run As下面的Java Application，即可运行这个使用Spring的程序，该程序将输入helloBean中的msg值：“这是最简单的Spring示例！”，运行结果如下。

这是最简单的Spring示例！

到这里为止，就完成了一个最简单的Spring应用实践。该例子使用了Spring的IOC功能。具体来说，就是通过一个资源文件（Resource）res，创建一个Bean工厂实例factory，然后再通过factory来查找程序中需要使用的Bean。再使用具体的Bean完成相应的工作。

当然，该示例说明不了多少问题，没有展示出Spring的特长，通过后面章节的学习大家会发现Spring究竟为什么这么备受青睐。

## 1.3 小结

本章详细地介绍了Spring的下载、Spring源文件中所属各个目录源码内容，并以一个简单的实例演示了Spring的使用方法，通过本章的学习，读者可以对Spring有一个简单的认识，能够独立下载Spring并且初步认识Spring的IOC功能，下一章将详细讲解Spring IOC。

# 第2章 控制反转（IOC）和依赖注入（DI）

近年来，在Java社区中风起轻量级容器的热潮，“让j2ee开发变得简单”，几乎每隔几个月就会有新的轻量级容器出现，这些轻量级容器都能较好地帮助开发者快速地将不同的组件组成一个应用程序，在这些轻量级容器的背后都有一个共同的装配模式，那就是“反向控制”，也就是IOC，英文全称是Inversion of Control，作为一位敏捷软件开发方法的早期开拓，Martin Fowler深入探索了IOC的工作原理，提出了“依赖注入”的新概念，也就是Dependency Injection。本章针对SpringIOC进行深入地讲解，主要内容如下。

●SpringIOC详细配置

●SpringIOC的使用方法

●ApplicationContext

## 2.1 认识IOC

当一个角色（调用者）需要另外一个角色（被调用者）协助工作时，在传统的程序设计过程中，通常由调用者来创建被调用者的实例。但在Spring里，创建被调用者的工作不再由调用者来完成，因此称为控制反转（反向控制），创建被调用者实例的工作通常由Spring容器来完成，然后注入调用者，这就是Spring的IOC。

### 2.1.1 开始第一个实例：超级玛丽之人物构造

我们都玩过超级玛丽的游戏，本书就以设计该游戏作为实例讲解，使用Spring的相关技术来构建游戏。

超级玛丽游戏首先是需要游戏人物，名称可以是玛丽，也可以是其他的名称，这样我们就将任务抽象成一个接口，所有角色都统一实现该接口，也就是说，所有人物的属性都一样，但是属性值不一样。

其代码如下：

可以看到这里使用到了一个物品类Goods，由于物品也是多种的，这里也将其抽象成一个接口，这里的物品很简单，只有名称和增加人物的生命值量。代码如下：

上面的两个类都使用了接口，目的就是为了便于扩展，这就是常说的面向接口编程，同时也希望程序员都养成这个习惯，在程序设计中尽量使用接口，关于使用接口的目的可以查阅有关资料，由于篇幅和题材的关系，这里不进行讲述。

设计一个人物类，实现了GameRole接口，代码如下：

每个人物都有一个背包，就是goods，用来放置游戏中获得药品等，我们只给出一种药品，给它取名为Medicine，物品类都实现Goods接口。代码如下：

到此为止，游戏所用的人物角色原始模型就设计好了，下面就要开始人物的游戏设定了，比如说我们要设计一个名称为Mary的人物，首先按照传统的设计方式来设计，那么应该有以下步骤。

（1）建立一个角色Role的实体：Role role=new Role（）。

（2）给这个Role的name值设置成Mary：role.setName（"Mary"）。

初始化人物代码如下：

（3）测试代码运行结果如下：

可以看出在初始化这个类中，新建了一个Role对象、一个药品对象，这样就使该程序和Role、Goods的紧紧地耦合到一起，同时代码量也大，下面使用Spring来实现同样的功能，具体步骤如下。

（1）写Spring的beans配置文件。

（2）写游戏人物初始化测试代码。

运行结果如下：

可以看出结果完全一样，比较一下代码，可以明显地看出，直接使用Spring代码没有任何耦合，而且代码量减少很多，更重要的是使用Spring使扩展性更强，比如说我要给人物初始化的时候增加一个物品，在传统的编码中，进行如下操作：

也就是说，每次添加一些药品就要新建一个Medicine，再给该Medicine赋予属性，最后还要给人物装配上，一旦游戏中药品过多，这样就显得十分烦琐，而Spring中是通过配置文件来给人物注入的，只需要修改一下配置文件，其他的什么也不用动就完成了这些工作，代码如下：

运行代码结果如下。

从上面两个例子的对比中可能会得出如下的结果。

（1）不使用Spring只是代码多些，但是不用写xml配置文件。

（2）使用Spring需要配置xml文件，但是代码少很多。

这个结论就充分地反映了代码黏合度的问题，也就是耦合，这样就顺理成章地得出一个结论：Spring的IOC大大减少了代码的耦合，使程序扩展更加方便。

### 2.1.2 3种不同的注入方式

使用注入的方式编程通常情况下有3种方式：设值注入、构造子注入和接口注入，接口注入存在很大的安全隐患，Spring在设计的时候抛弃了接口注入，只支持设值注入和构造子注入。

1.接口注入

这一节讨论接口注入，因为接口注入需要依赖特定的接口，这样使程序具备侵入性，所以Spring抛弃了这种注入方式，这里就举例来说明接口注入的应用，以超级玛丽的游戏场景初始化作为实例，游戏场景这里给它简单化，就是随机出现很多的方块，有的方块打碎后变成药品，有的变成毒方块，有的什么也没有，这样按下面的步骤来完成该实例。

（1）写一个接口来生成方块。

（2）所有要使用方块的实例都必须实现该接口来生成方块，游戏初始化类InitGameBox实现这一接口，实例代码如下：

（3）由于这里需要一个Box接口实例，写一个Box的实现类TextBox，代码如下：

（4）编写一个测试类TestInitGameBox，示例代码如下：

运行结果如下：

生成一个方块！

以上就是一个简单的接口实例的演示，这里唯一的缺陷就是组件必须依赖特定的接口，那么在大型的系统中就可能出现很多的接口，如果同时实现这些接口会给编程带来麻烦，同时也造成了很强的耦合，所以接口注入不是大型程序的首选，在小的程序中可以使用接口编程。

2.设值注入

这一节讨论设值注入，也就是set注入，set注入就是在程序中给每个变量都增加一个set方法，用来设置该属性的值。还是采用超级玛丽的游戏作为实例，这里初始化游戏场景，场景中有很多的方块，这些方块有的被玛丽打碎后变成药品有的变成毒品，也有的什么都没有，按以下步骤进行。

（1）首先建立方块的接口，代码如下：

（2）编写打碎后变成药品的方块代码。

新建一个MedicineBox类，选择实现Box接口，然后自动生成set方法，最终代码如下：

（3）编写打碎后变成毒方块的代码。

（4）编写一个没有任何返回的空方块，代码如下：

（5）编写Spring的xml配置文件seteBean.xml，代码如下：

在setBean.xml文件中首先配置了角色Bean，给Role注入了名称、生命值及两个随身携带的药品，接着配置了药品和毒品，其中药品和毒品的区别就是药品的blood属性为正数，毒品的blood属性为负数，这样设置与游戏任务吃药品来关联，给人物增加生命值的就是药品，减少人物生命值的就是毒品，在配置文件中最后配置了3种不同的方块。

（6）编写测试代码。

运行结果如下。

从上面初始化的代码中可以看出，在这里只需要关心相关的业务逻辑，不用管对象实例的生成，一切都交给Spring了。

3.构造子注入

构造子注入就是在需要注入的类中定义一个构造方法，应在构造方法中定义需要注入的实例元素，通过类的构造器来完成协助该类工作的其他实例的初始化，同样使用上面的例子来改造成构造子注入。

（1）编写药品方块，实现方块接口，代码如下：

该药品方块继承了方块接口，在类中有一个物品的列表，根据该物品列表来随机出一个方块打碎后的爆出物品，这里没有了setter方法，而是使用了一个构造函数来完成goods的初始化。

（2）编写有毒品方块类，该类实现方块接口，代码如下：

毒品方块类和药品方块类一样，通过一个构造函数来完成goods的初始化工作，下面就通过Spring来给构造函数注入相关属性。

（3）编写Sring的配置文件constructorBean.xml，代码如下：

在配置文件中首先还是通过set注入方式配置了Role和Medicine，在配置方块的时候结合方块类的构造函数，使用了＜constructor-arg＞来进行构造子注入，这里是使用set注入还是构造子注入是结合具体类来完成的，在实体类中如果有setter方法则使用set注入，实体类中如果没有setter方法，而是使用构造函数来完成类属性的初始化，那么就使用构造子注入。

（4）编写测试代码，代码如下：

测试代码中使用BeanFactory来获取配置文件中的Bean，所有的信息都是通过配置文件来注入对象中，测试代码中Bean的使用只有几行代码，其余的都是输出控制台信息的代码。

运行代码结果如下。

比较设置注入和构造子注入的代码可以发现：

（1）测试主程序完全一样。

（2）设置注入的实体类中给实体变量增加了set方法，构造子注入则将实例类的实体变量放到了构造函数中。

（3）设置注入的xml配置文件中使用的是property属性来给实体变量注入值，构造子注入使用constructor-arg属性来给实体变量注入值。

### 2.1.3 注入方式的选择

在实际应用中肯定会涉及到注入方式的选择，这个要看你的程序设计方式，设置注入就是在对象实例化以后使用set方法来注入相应的变量值，比较适合实体变量很多的实体类，而构造子注入是在对象实例化之前调用对象的构造函数来完成对象所有依赖关系的建立，这样就意味着对象的初始化是个比较复杂的过程，构造子注入的好处就是它没有了set方法，这样就能保证实体类的相关数据在执行时不会被修改，通俗地说，就是现在的持久层都已经能够关联set方法，一旦使用setXXX（）后就会给这个新的值持久到数据库中了，而构造子注入就不会出现这个情况。

总而言之，笔者认为：当实体类的变量过多时，建议使用set注入，如果开发人员想要让一些数据成员或者资源变成只读或者私有，建议使用构造子注入。

## 2.2 详解Spring的Bean

Bean是Spring装配的组件模型，有点类似微软的COM的概念，一切实体类都可以配置成一个Bean，进而就可以在任何其他的Bean中使用，一个Bean也可以不是指定的实体类，这就是抽象Bean，本节后面有详细的介绍。在Spring中有两个最基本、最重要的包，即org.springframework.beans和org.springframework.context，在这两个包中，为了实现无入侵式的框架，代码中大量地引用了Java中的反射机制，通过动态调用避免硬编码，为Spring反向控制提供了基础保证，在这两个包中，最重要的类就是BeanFactory和ApplicationContext, BeanFactory提供一种先进的配置机制来管理任何种类的Bean, ApplicationContext是建立在BeanFactory之上的，并增加了其他功能，例如，国际化的支持、资源的访问和事件传递等，首先讲述一下Bean的基本知识。

### 2.2.1 bean的标识（id和name）

首先来看一个xml配置文件：bean.xml。

这是一个标准的Spring的Bean配置文件，读者可以从上面的代码中看到，Bean的最外层标识是Beans，这个很容易理解，多个Bean自然就是Beans了，Bean的名称可以由除“＆”、“”、“”及空格以外任务的可见字符组成，一般情况下，使用字母及数字的组合来表示Bean的名称。若在Bean配置信息中没有指定Bean的名称（name），系统将会把Bean的类型全名作为Bean的名称，若有多个Bean都是同一个class而没有指定名称，则系统会自动使用类型名称加#及数字等分隔来依次生成一个唯一的名称。

上面的配置文件说明如下：

每一个完整的Bean由＜bean＞＜/bean＞这样的闭合标签来表示，第一个Bean的名称为role，第二个Bean的名称为medicine，第三个Bean的名称是spring.chapter2.mary Game.Poison，第四个Bean的名称是spring.chapter2.maryGame.Poison#1（由于该Bean和第三个Bean是同一个class，系统避免重复，根据第三个来自动生成名称）。

id和name的主要区别是如下。

id属性具有唯一性，每一个Bean只能有一个对应的id，并且它在XML DTD或者Schema中作为一个真正的XML元素的ID属性被标记，所以XML解析器能够在其他元素指向它的时候进行一些额外的校验。

name属性可以指定一个或者多个名称，各个名称之间用逗号或者分号隔开，第一个默认为标识名称，后面的多个自动成为这个Bean的别名，例如：

### 2.2.2 Bean的类（class）

在上面的配置文件中可以看到每一个Bean都有一个class属性，在Spring配置文件中class属性指明Bean的来源，也就是Bean的实际路径，它指向一个实体类，通过class属性来给实体类指定id或者name，这样在运用过程中就可以使用id或者name来应用该实体类。

这个id为role的Bean，它就是代表spring.chapter2.maryGame.Role这个类，这里注意要写明类的全路径，而不能写class="Role"，通过class指定Role类后，在其他的地方就可以使用“role”来应用spring.chapter2.maryGame.Role类。

### 2.2.3 Bean的作用域

在Spring中可以直接在配置文件中制定类的作用域，而避免了在class级来指定。Spring的作用域配置示例如下：

这里的scope就是用来配置Spring Bean的作用域，它标识Bean的作用域。

在Spring 2.0之前Bean只有两种作用域，即singleton（单例）和non-singleton（也称prototype），Spring 2.0以后，增加了session、request和global session 3种专用于Web应用程序上下文的Bean。因此，默认情况下Spring 2.0现在有5种类型的Bean。当然，Spring 2.0对Bean类型的设计进行了重构，并设计出灵活的Bean类型支持，理论上可以有无数种类型的Bean，用户可以根据自己的需要，增加新的Bean类型，满足实际应用需求。

1.singleton作用域

当一个Bean的作用域设置为singleton，那么Spring IOC容器中只会存在一个共享的Bean实例，并且所有对Bean的请求，只要id与该Bean定义相匹配，则只会返回bean的同一实例。换言之，当把一个Bean定义设置为singleton作用域时，Spring IOC容器只会创建该Bean定义的唯一实例。这个单一实例会被存储到单例缓存（singleton cache）中，并且所有针对该Bean的后续请求和引用都将返回被缓存的对象实例，这里要注意的是singleton作用域和GOF设计模式中的单例是完全不同的，单例设计模式表示一个ClassLoader中只有一个class存在，而这里的singleton则表示一个容器对应一个Bean，也就是说，当一个Bean被标识为singleton时，Spring的IOC容器中只会存在一个该Bean。

配置实例：

2.prototype

prototype作用域部署的Bean，每一次请求（将其注入到另一个Bean中，或者以程序的方式调用容器的getBean（）方法）都会产生一个新的Bean实例，相当于一个new的操作，对于prototype作用域的Bean，有一点非常重要，那就是Spring不能对一个prototype Bean的整个生命周期负责，容器在初始化、配置、装饰或者是装配完一个prototype实例后，将它交给客户端，随后就对该prototype实例不闻不问了。不管何种作用域，容器都会调用所有对象的初始化生命周期回调方法，而对prototype而言，任何配置好的生命周期回调方法都将不会被调用。清除prototype作用域的对象并释放任何prototype Bean所持有的昂贵资源，都是客户端代码的职责（让Spring容器释放被singleton作用域Bean占用资源的一种可行方式是，通过使用Bean的后置处理器，该处理器持有要被清除的Bean的引用）。

配置实例：

或者

3.request

request表示针对每一次HTTP请求都会产生一个新的Bean，同时该Bean仅在当前HTTP request内有效。

使用request、session和global session的时候首先要在初始化Web的web.xml中进行如下配置。

如果使用的是Servlet 2.4及以上的Web容器，那么仅需要在Web应用的XML声明文件web.xml中增加下述ContextListener即可。

如果是Servlet 2.4以前的Web容器，那么要使用一个javax.servlet.Filter的实现。

接着就可以配置Bean的作用域了。

4.session

session作用域表示针对每一次HTTP请求都会产生一个新的Bean，同时该Bean仅在当前HTTP session内有效。

配置实例：

与request配置实例的前提相同，配置好web.xml文件后，就可以进行以下配置。

这样配置以后，id为role的Bean作用域为session，当一个会话结束后，Bean就会自动销毁。

5.global session

global session作用域类似于标准的HTTP session作用域，不过它仅仅在基于portlet的Web应用中才有意义。Portlet规范定义了全局session的概念，它被所有构成某个portlet Web应用的各种不同的portlet所共享。在global session作用域中定义的Bean被限定于全局portlet session的生命周期范围内。如果在Web中使用global session作用域来标识Bean，那么Web会自动当成session类型来使用。

配置实例：

与request配置实例的前提相同，配置好web.xml文件后，就可以进行如下配置。

6.自定义Bean装配作用域

在Spring 2.0中作用域是可以任意扩展的，可以自定义作用域，甚至也可以重新定义已有的作用域（但是不能覆盖singleton和prototype），Spring的作用域由接口org.springframework.beans.factory.config.Scope来定义，自定义自己的作用域只要实现该接口即可，下面给出一个实例。

建立一个线程的scope，该scope在表示一个线程中有效，代码如下：

从代码中可以看出，通过get方法将类实体添加到一个线程的map中，使用remove方法从线程中移除该Bean，定义完Scope后就可以在配置文件中通过CustomScope Configurer来注册scope，实例如下：

首先配置一个CustomScopeConfigurer实体，将自定义的scope注册到CustomScope Configurer中，接着使用＜aop：scoped-proxy/＞就完成了自定义Scope的注册，注册完毕后就可以在其他Bean中使用这个scope了。

### 2.2.4 Bean的属性

Spring中有两种注入方式，一种是set注入，另一种是构造子注入，对于这两种不同的注入方式Spring的Bean提供两种不同的属性配置方式，在配置文件中选择哪种配置方式取决于实体类。

（1）实体类的每个变量都有set方法，此时使用property属性来配置。

（2）实体类使用构造函数来初始化类的关联装配，此时使用＜constructor-arg＞属性来配置。

下面以具体实例来讲解这两种不同的配置方式。

（1）set注入。

Medicine实例代码：

可以看出这个Medicine类中的每个变量都有一个set方法，那么这个Bean的配置代码如下。

可以看出这里有两个property的配置，这个表示该Bean有两个属性，并且第一个属性名称是name, name的值为“小药丸”，第二个属性的名称是blood，值是“10”，说明spring.chapter2.maryGame.Medicine类中也有两个完全相同的属性，读者可以参看这个类，这个property完全与实体类对应，对应实体类所有的变量才可以在这里进行注入，比如说给spring.chapter2.maryGame.Medicine类增加一个颜色属性color，同时给这个color变量增加一个set方法，这样就可以在Bean的配置里同样增加一个property，增加后配置文件如下：

（2）构造子注入。

Medicine的实体类代码：

可以看出这里有一个构造函数来初始化这个实体类，对应的配置文件可以有以下几种。

（1）根据参数位置

在Medicine中有两个构造函数，在配置文件中有两个＜constructor-arg＞，每一个＜constructor-arg＞对应构造函数中的一个参数，可以看出实体类的构造函数有两个参数，第一个为name，第二个为blood，在配置文件中可以使用index关键字来标识当前这个＜constructor-arg＞对应构造函数中参数的位置，第一个从0开始，如果没有index来标识注入的值在构造函数中的位置，则Spring会默认第一个＜constructor-arg＞标签的index为0，以后多个＜constructor-arg＞依次递增，代码如下：

以上代码就会将“10”注入到Medicine的name中，将“小药丸”注入到Medicine的blood中，这样因为类型错误就会产生一个错误，如果给＜constructor-arg＞加上index进行参数位置注明，就不会产生错误了，代码如下：

（2）根据参数类型。

在＜constructor-arg＞中增加“type”标识表示参数的类型，这样在注入实体类的时候，Spring会根据类型的对应来将值注入到对应的实体属性中，在Medicine中有两个属性，类型分别为String和int，在＜constructor-arg＞中增加“type”来标识类型，这样在注入的时候就会将String类型注入到Medicine中类型为String的属性中，如果在实体类中有多个同样类型的属性，这样做容易出错，这时候可以增加“index”属性指明相关位置来进行注入。

### 2.2.5 Bean中应用其他的Bean

到这里可能有的读者会意识到前面的例子不论是set注入还是构造子注入，我们都是统一使用value这个属性来给变量注入值的，而且变量的值都是基本类型和String类型的，如果一个变量也是一个类该怎么办呢？这个就是Bean的引用。

（1）还是以同样的代码来加以说明，给药品类Medicine增加一个获取药品的时间，代码如下：

这里的date属性不再是一个基本类型的属性了，date是java.util.Date类型，在配置中就应该给date注入java.util.Date类型的值。

（2）下面给出相应的配置文件bean.xml。

这里可以看出增加了一个id为date的Bean，它的类型是java.util.Date，而id为medicine的Bean中也增加了一个property，它通过ref标识来引用另外一个id为date的Bean, Spring中引用其他Bean共有两种办法。

（1）使用ref标签

＜ref bean="date"/＞表示引用id为date的标签，ref标签可以结合local、bean和parent 3个不同的标签来一起应用。

＜ref local="date"/＞表示引用当前xml文件中的id为date的bean，这样会让xml解析器更早地验证id为date的bean是否存在，这样方便于配置文件较多的工程构建。

＜ref bean="date"/＞表示引用一个id或者name为date的bean，这个bean可以在同一个xml文件中，也可以不在当前的xml文件中。不在同一个文件中，在Spring中使用import来引入其他的配置文件，示例如下：

＜import resource="xxx. xml"/＞放到所有＜bean＞配置的前面，resource用来指定Spring配置文件的路径，可以是指定文件夹下的文件，也可以是classpath文件夹下的文件，如果是classpath文件夹下的可以如下表示。

＜ref parent="date"/＞表示引用父类Bean，这个可能比较抽象，举个例子说明一下。

在构造实体类的时候常常会在多个类中出现同样的属性字段，这样就可以给同样的字段提取出来作为一个新的类，给这个类的配置Bean设置成抽象Bean，然后其他需要使用这个Bean字段的Bean直接通过parent标签来引用就可以了，比如说Role和Medicine中都有一个Date属性，就将这个Date属性提出来配置一个抽象类。

配置文件如下：

因为Role类和Medicine类有共同的date属性，就将该属性提取出来作为一个抽象类publicbean，使用这个抽象Bean的其他Bean只需要增加一个parent="publicbean"就可以了，更不用在Bean中进行配置了，这样一旦出现了很多需要使用java.util.Date类型的Bean就可以减少很多的配置文件了。

（2）使用内部Bean。

内部Bean就是在property中配置一个Bean，示例如下：

内部Bean不需要id，只能在此处使用，其他地方不能通过id来引用，也就是说，内部Bean的id是被忽略的。

### 2.2.6 集合的注入

前面的示例都是对实体属性的配置，在实际应用中常常会遇见集合的使用，对于集合List、set、map及props等都有相应的配置方式，下面将逐个讲解。

1.List类型的注入

在前面超级玛丽的Role中有一个List属性。

这里的List＜Goods＞是jdk 1.5的新特性，使用类型来对List的值加以限制，这里表示该List只能接受类型是Goods的参数，否则会抛出一个ClassCastException异常，看一下list的注入配置方法。

在配置list类型的属性时，使用＜list＞＜/list＞闭合式标签进行配置，这里的List中注入了两个Bean，同时list也可以直接注入基本类型或者String类型的数值，list注入的方式概括如下。

（1）注入基本类型或者String。

在注入基本类型或者String类型的时候，直接使用＜value＞＜/value＞标签进行注入，字符串类型加上双引号进行标识。

（2）引用Bean的注入。

注入其他类型的时候，直接使用＜ref bean=xxx/＞来进行Bean的应用。

2.Set类型的注入

假如给上面的List改成set类型，则配置文件如下：

总结set注入方式配置如下：

（1）注入基本类型或者String类型。

（2）注入Bean。

3.Map类型注入

假如将上面的list改成map类型，则配置文件如下：

总结Map类型注入方式如下：

（1）注入基本类型和String类型。

（2）注入Bean。

4.Properties类型注入

假如将上面的List改成Properties类型，则配置文件如下：

总结Properties注入如下：

（1）注入基本类型和String类型。

注入基本类型或者String类型时，首先使用＜props＞＜/props＞标签进行标识，由于property类型的数值包含一键一值，配置单个属性的时候使用＜prop key="xxx"＞xxx＜/prop＞或者＜prop key="xxx"value="xxx"/＞进行注入配置。

（2）注入其他Bean

### 2.2.7 ＜util＞标签

Spring 2. 0中支持XML Schema，同时继续支持dtd，这样在xml配置文件中可以使用dtd和schema两种方式进行声明，示例如下：

Spring 2. 0及之前版本均支持dtd声明。

Spring 2. 0可以新增＜util＞标签进行扩充，使用＜util：list＞、＜util：map＞、＜util：set＞和＜util：properties＞等标签可以取代并简化集合的配置，下面针对4种标签分别举例说明。

在使用＜util＞标签之前首先要将xml配置文件中加入util的命名空间，增加后的Spring配置文件头如下：

将2.2.6节中的各种集合配置修改成＜util＞配置如下。

1.list配置

修改成＜util：list＞配置。

2.set配置

修改成＜util：set＞配置。

3.map配置

修改成＜util：map＞配置。

可以使用map-class来指定使用的集合对象，实例如下：

4.properties配置

修改成＜util：properties＞配置如下：

location用来指定properties文件的路径，可以指定到某个文件夹，也可以使用classpath来表示系统类路径。

### 2.2.8 null值的处理

在Bean的属性配置中，往往会遇见配置一个null值，Spring中的配置代码如下：

实例代码：

将goods设置成null。

可以看出有两种配置null的方法，分别为＜value＞null＜/value＞和＜null/＞，但是效果完全相同。

### 2.2.9 使用依赖depends-on

depends-on标签表示该Bean初始化之前强制执行指定的一个或者多个Bean初始化，以下为示例代码。

以上配置就表示在role的Bean初始化之前首先会强制初始化medicine和medicine1这两个Bean。

### 2.2.10 延迟初始化Bean

ApplicationContext默认会在系统启动时初始化所有的Bean，对于大型的系统会有成千上万个Bean，这样加载时间可能很长，甚至有几个小时，这时就要将某些Bean在需要的时候再将它初始化，给系统启动减轻负担，使用lazy-init标签来标注Bean延迟初始化，示例如下。

lazy-init="true"表示延迟初始化该Bean，默认情况是lazy-init="false"，如果要是某个配置文件中的所有Bean都延迟初始化，那么不需要将每一个Bean都加上lazy-init="true"，只需要将＜beans＞标签加上default-lazy-init="true"就可以了：

### 2.2.11 Bean的生命周期

Bean生命周期表示Bean从产生到销毁的整个过程，主要分为3个阶段，分别为Bean的初始化、Bean的使用和Bean的销毁，下面针对3个不同的阶段进行详细讲解。

1.Bean的初始化

Bean的初始化有两种方式。

（1）在配置文件中指定init-method方法来完成初始化。

（2）实现org.springframework.beans.factory.InitializingBean接口。

下面针对这两种不同的方式进行实例讲解。

第一种方式：在Bean中增加一个初始化的方法，方法名称任意，然后在Bean的配置中通过init-method来指定初始化的方法。

xml配置文件中就不需要再给Role的属性赋值了，如果配置了系统也会忽略。

在配置spring.chapter2.setDemo.Role实体时，增加了一个init-method属性来指定Role初始化的方法，这样Role新建之前就会调用init-method指定的方法来完成Role的部分初始化工作，如果给所有Bean的初始化方法都定义为同样的一个名称，比如init，则可以在＜beans＞层标签统一设置初始化的方法，而不用逐个Bean来设置。

第二种方式：实现org.springframework.beans.factory.InitializingBean接口。

InitializingBean接口中有afterPropertiesSet方法，在该方法中添加代码来完成初始化，人物角色类RoleImplInitBean。

RoleImplInitBean类实现了InitializingBean接口，当系统初始化RoleImplInitBean之前就会调用afterPropertiesSet（）方法来进行实体的初始化工作，接着就可以编写Spring的配置文件，xml文件中的配置如下：

由于在afterPropertiesSet（）方法中对Role的name和health属性进行了初始化，在配置文件中就不需要再进行配置了，如果在Spring中再进行配置，则会使用afterProperties Set（）方法中的赋值而忽略配置文件中的注入。

2.Bean的使用

在Spring中配置完Bean后，有3种方式来获得配置好的每一个Bean。

（1）使用BeanWrapper，示例代码如下：

BeanWrapper接受任意单个类作为参数来初始化一个BeanWarpper，它可以读取Bean内部的属性并给属性赋值。

（2）使用BeanFactory，示例代码如下：

BeanFactory通过读取配置文件来初始化所有的Bean（除去延迟加载的），它不能给Bean设置属性，但是可以用来管理所有的Bean。

（3）使用ApplicationContext，示例代码如下：

使用ApplicationContext时要将Spring-context.jar添加到classpath中去，ApplicationContext在Bean使用上与BeanFactory差不多，只是在其他的功能上有了更大的扩充，后面将会专门用一节的内容来详细地阐述ApplicationContext，使用Applicaiotn来获取Bean的。

3.Bean的销毁

Bean使用后需要及时销毁，这样及时释放内存而不是等待Java虚拟机自动回收是一个好的程序不可缺少的，Spring中Bean的销毁有以下两种方式。

（1）在配置文件中通过指定destroy-method属性来销毁。

（2）实现org.springframework.beans.factory.DisposableBean接口。

下面就具体实例来讲解以上两种销毁的方式。

第一种方式：首先给Role类增加一个方法destory，增加后的代码如下：

然后在Bean中配置destroy-method方法，配置后的文件如下：

在配置spring.chpater2.setDemo.Role的时候，使用destroy-method来指定Bean销毁的方法，这里指定为“destroy”方法，如果在Role类中没有“destroy”方法就会抛出一个NoSuchMethod的一场，如果将所有的Bean都统一定义一个同样名称的销毁方法，比如destroy，那么就可以在＜beans＞标签统一设置销毁的方法。

第二种方式：实现DisposableBean接口，实现destroy方法，在该方法里编写销毁的方法，示例代码如下：

RoleImplDisBean实现了DisposableBean接口，重写了destroy方法，在destroy（）方法中进行Bean初始化，这样就不需要在xml文件中指定destroy-method方法了。

### 2.2.12 Bean的5种装配模式

不管使用设置注入还是构造子注入，很多时候都可能有很多的变量或构造参数，这样就需要在Bean中配置很多的property或constructor-arg, Spring提供了5种装配模式来通过配置Bean的autowire属性简化Bean的配置，下面分别以具体的例子来讲解。

1.通过名称（byName）

byName是通过Bean属性的名称进行自动装配的，在配置文件中查找和实体类属性相同名称的Bean, Medicine的代码如下：

Medicine类中有3个属性，名称分别为name、blood和date, Spring可以使用autowire="byName"来根据名称自动注入，配置文件代码如下：

可以看出在Medicne类中有一个date属性，在Bean中配置autowire="byName"，然后在Bean中就不需要配置date属性了，它会根据名称来自动查找id为date的Bean来装配这个Bean，如果没有名称为date的Bean它就会抛出一个异常。

2.通过类型（byType）

byType就是通过类型来自动装配，系统会根据类型来给实体类的属性装配同样类型的Bean，如果在配置文件中有多个同样的装配类型，那么就会抛出一个异常，还是以Medicine为例。

改写xml文件代码如下：

Spring在装配id为medicine的Bean时，会自动根据类型来查找是否有类型为java.util.Date类型的Bean，如果有的话就自动给Bean装配上，如果没有相同类型的Bean也不会出现错误，只是该属性不会被设置，当然，这是用户不想出现的情况，这样就需要结合“Bean依赖检查”来抛出异常，详细说明见后面的2.2.13节。

3.通过构造参数（constructor）

constructor模式就是通过构造函数的参数类型来进行装配，编写一个有构造函数的Medicine。

在Medicine类的构造函数中的3个参数类型分别为String、int和Date，使用autowire="byType"标签则Spring会自动在配置文件中查找对应类型的Bean进行注入，编写xml文件代码如下：

实体类中有一个构造器，其中有一个java.util.Date类型的属性，可以看出配置文件中只配置了name和health属性，而date属性也会根据类型进行自动装配的，与byType类型差不多，可以说它是construtor的byType装配。

4.自动装配（autodetect）

自动装配就是通过对Bean的检查来选择“通过构造参数装配”或者“根据类型装配”，实际上就是根据Bean的结构自动选择使用设置注入或者构造子注入的byType装配。

5.no模式

不使用自动装配。必须通过ref元素指定依赖，这是默认设置。由于显式指定协作者可以使配置更灵活、更清晰，因此对于较大的部署配置，推荐采用该设置。而且在某种程度上，它也是系统架构的一种文档形式。

### 2.2.13 Bean依赖检查的4种模式

正是由于Spring提供了5种自动装配的模式，而装配模式都是隐式的，没有使用＜ref＞标签来直接指定Bean，这样一旦Bean多了就不能看出是否能够自动装配，这时就需要一个装配的检查，也就是依赖检查的诞生。

Spring提供了dependency-check，目前支持4种依赖检查的模式，分别是simple、object、all和none。

1.simple检查模式

simple模式指的是对基本类型、字符串和集合进行依赖检查，示例代码如下：

这里将装配模式设置为自动装配，同时使用simple检查模式，配置文件如下：

从以上代码可以看到实体类中有String、int及Date类型，设置autowire="autodetect"则表示自动根据Bean结构进行byType装配，这里的Bean有构造函数，则根据构造函数来进行byType装配，依赖检查设置dependency-check="simple"表示这里只对基本类型int及String类型进行装配，如果不存在就会抛出异常，而对于java.util.Date这里不进行检查，就算没有同样类型的一个Bean存在也不会出错。

2.object检查模式

object检查模式表示对依赖的对象进行检查，将上面的配置文件修改成dependency-check="object"，那么就表示只对java.util.Date对象进行检查，如果不存在Date对象就会抛出异常。

3.all检查模式

all模式表示对所有的属性均进行检查，将上面的配置文件中的检查模式修改成dependency-check="all"，那么就表示对所有的属性均进行检查，只要有一项没有装配成功就会抛出异常。

4.none检查模式

none模式表示不进行任何依赖检查，相当于不进行依赖检查的任何配置。

### 2.2.14 Bean的管理

Bean的配置到这里为止，读者应该都很明白了，这一节具体讨论一下Bean的管理与使用。在Spring中，Bean的使用有3种管理方式，下面具体讲解。

1.使用非XML配置文件来配置Bean

之前都是使用XML文件来配置Bean，实际上Spring还有多种方式来配置Bean，下面来具体讲解。

1）使用属性文件（properties）来配置

Spring提供了PropertiesBeanDefinitionReader类读取properties文件，以前面的人物初始化为例，人物角色类Role代码还是与以前相同，这里不用xml文件了，定义一个role.properties文件，内容如下：

（由于中文需要使用native2ascii，这里就不使用中文了）

该配置文件第1行role.（class）表示该类的别名，相当于xml中的id，第2行及第3行表示配置类的属性，第4行中的ref表示引用medicine1的Bean，与xml中的ref标签一样，编写的测试文件如下：

运行结果如下：

2）使用Spring自身程序来配置Bean

除了xml文件和属性文件以外，还可以在程序中直接来配置Bean及Bean之间的联系，通过org.springframework.beans.MutablePropertyValues设置属性，然后将属性与Bean的类设置给org.springframework.beans.beans.factory.support.RootBeanDefinition，最后通过org.springframework.beans.factory.support.BeanDefinitionRegistry来注册Bean，下面还是以人物Role为实例。

运行结果如下。

在程序中笔者已经加上了详细的注释，读者可以尝试增加一个Medicine来给Role装配上。

2.使用BeanPostProcessor来管理Bean

Bean设置好以后，在实例化之前还可以利用BeanPostProcessor来修正相关的属性，方法是实现org.springframework.beans.factory.config.BeanPostProcessor接口，该接口的代码如下：

其中postProcessBeforeInitialization方法会在Bean类初始化之前（也在Initializing Bean的afterPropertiesSet（）方法或自定义的init方法前）执行，而postProcessAfterInitia lization方法会在bean初始化之后执行。

下面举个例子来加以说明，比如说写一个人物加生命值的作弊器，在人物初始化之前给人物的生命值增加100，HealthModifier类如下：

然后在XML文件中增加一个配置HealthModifier的Bean就可以了，XML文件如下：

编写一个测试文件，如果人物初始化后的生命值变成了200则修改器成功应用了，测试代码如下：

运行结果如下。

可以看出成功地进行了生命值的修改，这里要注意的是实现BeanPostProcessor的修改器只能使用ApplicationContext来使用Bean，如果用BeanFactroy来使用的话，就需要实现org.springframework.beans.factory.config.BeanFactoryPostProcessor，在Spring中有多个该类的实现类，通过这些类的运用，可以进行一些其他的扩展引用。

### 2.2.15 两种不同的Bean

Spring中有两种类型的Bean，一种是普通Bean，普通Bean可以是用户定义的任意类；另一种是工厂Bean，即FactoryBean。工厂Bean与普通Bean不同，其返回的对象不是指定类的一个实例，其返回的是该工厂Bean的getObject方法所返回的对象。在Spring框架内部，AOP相关的功能及事务处理中，很多地方使用到工厂Bean。

看如下两个代码。

1）普通Bean

Role类中只有一个name属性，使用springIOC给Role注入name值，配置如下bean.xml。

bean. xml中给Role的name属性注入的值为字符串“mary”，编写一个测试文件如下：

使用BeanFactory获取id为scene的Bean，这里输出该Bean的类名，控制台输出如下。

普通Bean使用BeanFactory获取Bean的时候，它表示的类就是Bean的class属性指定的类，而工厂Bean是getObject（）方法返回的类。

2）工厂Bean

工厂Bean要求该类实现FactoryBean接口，编写一个工厂Bean代码如下：

Role1实现了FactoryBean接口，Role1就是一个工厂Bean, FactoryBean接口中有3个方法，Role1重写了getObject（）方法，如果注入的名称为“date”就返回当前的时间，否则就返回字符串，配置文件如下bean.xml。

配置文件中配置了两个Role1，第一个id为scene，该Bean中给Role1注入的name值为mary，第二个id为scene1，给Role1中name属性注入的值为date。

编写测试文件如下：

控制台输出如下。

对比普通Bean可以看出，工厂Bean使用BeanFactory获取的类并不是Bean的class属性指定的类，二是工厂Bean中getObject（）方法返回的对象类型，不过Spring提供了一种方法来返回Bean指定的类型。

获取Bean的时候，在Bean的id前加上“＆”，这样返回的就是Bean的class属性指定的类了，这里将输出spring.chapter2.bean.Role1，而不是class java.util.Date。

普通Bean是任意一个Java类，而工厂Bean要求这类必须继承FactoryBean，使用BeanFactory获取的普通Bean就是该Bean中getter方法的返回值，而工厂Bean则是getObject（）的返回值，这个就是普通Bean和工厂Bean的本质区别。

### 2.2.16 超级玛丽游戏初始化之完结篇

到这里为止完成了IOC所有的讲解，运用学习到的知识来完成超级玛丽游戏的初始化，按以下的步骤一步步操作（详细的代码可以参考光盘中的chapter2文件夹）。

（1）由于每个方块都要随机出X、Y坐标，而这个X、Y坐标都是随机出来的，所以就要根据游戏场景的大小来随机抽出，要建立一个根据场景随机出坐标的类。

游戏场景类，该类用来设置游戏场景的长、宽，以及根据长、宽随机出场景中任意位置，这样在随机出方块的时候也可以随机出方块在场景中的位置，当然这里的随机算法是过于简单，在实际设计过程中不能这么做，要考虑随机数不能重复的问题。

（2）修改NullBox、MedicineBox和PoisonBox，增加坐标项，代码分别如下：

（3）建立一个游戏场景类，这里只简单的做，只有一个方块个数，代码如下：

（4）建立一个游戏初始化类GameInit，用来初始化游戏人物和方块。

（5）建立配置文件game.xml。

（6）编写一个测试初始化的代码。

由于输出结果比较多，这里就不展示出来了，读者可以参考光盘中的spring.chapter2.maryGame中的TestGameInit来实际运行一下代码。

## 2.3 详解ApplicationContext

通过前面的内容可以知道ApplicationContext类可以用来管理Bean，但是ApplicationContext还具有其他很多的功能，首先看一下其源代码。

可以看出ApplicationContext接口继承了5个其他接口，ListableBeanFactory和HierarchicalBeanFactroy这两个接口是对Bean的管理，MessageSource接口提供了消息处理功能，实现资源国际化，ApplicationEventPublisher接口是事件传递的接口，ResourcePatternResolver接口则是对正则表达式的支持，下面逐个讲解。

### 2.3.1 ApplicationContext的初始化

ApplicationContext的初始化是读取XML配置文件来完成的，根据读取的路径方式不同有以下3种。

1.org.springframework.context.support.FileSystemXmlApplicationContext

指定XML定义文件的相对路径或者绝对路径来读取定义文件，例如：

2.org.springframework.context.support.ClassPathXmlApplicationContext

从classpath设置路径读取XML定义文件，这里可以使用classpath、classpath*、file：/和http://等来标识文件路径，同时支持正则表达式，例如：

该方法表示读取当前classpath下的bean.xml文件。

该方法表示从当前路径下读取xml配置文件。

该方法表示读取所有classpath下的bean.xml文件。

该方法表示读取当前ClassPath下的所有Bean开头的文件，但是该文件必须是实际的文件系统，也就是说，不能读取jar文件中Bean开头的文件。

3.org.springframework.context.support.XmlWebApplicationContext

在Web应用中，从父ApplictoinContext中指定相对位置读取定义文件，同时以上几种初始化ApplicationContext的方式均支持数组读取配置文件，例如：

### 2.3.2 消息处理机制

由于ApplicationContext集成了MessageResource接口，所以ApplicationContext就具备了MessageResource处理消息实现国际化的功能，以下是MessageResource的源代码。

这里有3种方法。

（1）第一种方法是用来从MessageSource获取消息的基本方法。如果在指定的locale中没有找到消息，则使用默认的消息。args中的参数将使用标准类库中的MessageFormat来作消息中的替换值。

（2）第二种方法本质上和上一种方法相同，其区别在于没有指定默认值，如果没找到消息，会抛出一个NoSuchMessageException异常。

（3）第三种方法和上面两种方法一样，不过这里给属性都封装到一个Message SourceResolvable实现中，而本方法可以指定MessageSourceResolvable实现。

当一个ApplicationContext被加载时，它会自动在context中查找已定义为MessageSource类型的Bean。此Bean的名称Spring约定为messageSource。如果找到，那么所有对上述方法的调用将被委托给该Bean。否则ApplicationContext会在其父类中查找是否含有同名的Bean。如果有，就把它作为MessageSource。如果它最终没有找到任何的消息源，一个空的StaticMessageSource将会被实例化，使它能够接受上述方法的调用。下面针对一个具体的实例来进行讲解。

通过MessageSource的一个实现org.springframework.context.support.ResourceBundle MessageSource来取得国际化信息，首先写一个id为messageSource的bean（这里是Spring的约定，名称必须为messageSource）。

“basename”属性用来设置保存消息资源的文件名称，这里设置为“message”，标识消息资源名称是以“message”开头的文件，可以是mesasge.properties和message_en_US.properties等，这里就以中文和英文为例，英文的message_en_US.properties内容如下。

中文的message.properties内容如下：

这里中文需要转码，使用JDK的native2ascii命令：native2ascii message.properties message.txt，然后将message.txt中的内容复制到message.properties中，转码后的message.properties内容如下：

接下来看一下是如何根据不同的Local来读取不同的消息文件的。

首先初始化ApplicationContext，然后使用getMessage方法来实现国际化，第一个参数role表示读取的资源文件中的key，第二个参数是个数组，表示要传递给这个key的，在key中用0、1这些表明传递数组参数位置，第三个参数表示将要使用的语系，设置为Locale.US程序将会查找一个名称为message_en_US的资源文件并给objs的值传递进去，如果没有找到资源文件将会使用本地的Locale。

### 2.3.3 资源读取

在实际应用的很多的时候都要进行资源的操作，Spring提供了对资源存取的接口org.springframework.core.io.ResourceLoader，而ApplicationContext继承了该接口，Application Context可以使用getResource（）方法来取得一个资源，例如：

同时也可以使用file：/和http://来指定一个资源的位置，获取资源后就可以用getFile（）方法来操作文件了。

### 2.3.4 事件传递机制

事件传递类似window的消息机制，当某一事件发生时而触发另一事件，这个就必须有个消息劫持并传递，在Java中事件传递很困难，Spring提供了ApplicationListener来监听事件，也就是说，一个监听类只需要实现ApplicationListener接口，事件类继承ApplicationEvent，然后通过ApplicationContext的publishEvent（）方法发布，这时候监听类就会监听到相应的事件并执行要执行的任务了，下面针对一个具体的例子来示范。

假如系统要对所有登录用户进行监听，按下列步骤来完成。

（1）编写登录事件类。

在构造LoginEvent时，传递一个事件给它，可以是任何一个类或者类的一个方法，在LoginEvent事件发布的时候，就可以接受并处理该事件。

（2）编写监听类。

首先做一个判断，如果是登录事件，那么就接受并执行监听事件。

（3）编写配置文件，只需要简单地定义一个监听类就可以了。

（4）编写测试类。

这里有一个login方法，也就是用户登录的方法，在发生login方法的时候将会触发监听类，程序运行结果如下。

## 2.4 小结

本章由浅入深地介绍了Spring IOC的使用，Spring IOC以Bean为基础，一切都是Bean, IOC的实现就是对Bean灵活配置运用，本章以一个有趣的游戏实例来讲述Spring IOC在实践中的运用，IOC是Spring的核心容器，更是Spring得以广泛应用的主要原因之一，通过本章的学习可以熟练地掌握Spring IOC的使用，在下一章中将与读者一起深入学习Spring的AOP。

# 第3章 Spring的AOP实现

在面向对象（OOP）的编程中，通过对现实世界的抽象及模型化来分析问题，也就是把一个大的应用系统分成一个一个的对象，然后把它们有机地组合在一起完成，这时应运而生的问题就是代码的精炼。在一个应用系统中可能会出现过多相同的代码，这些同样的业务逻辑称为关注点。AOP正是在这种环境下产生的，给多个关注点组成一个面，然后针对这个关注面进行编程，也就是AOP编程。Spring框架中也提供了一个AOP实现，使用基于代理及拦截器的机制，与Spring IOC容器融入一体的AOP框架。Spring AOP采用运行时织入方式，使其可以在基于Spring框架的应用程序中使用各种声明式系统级服务。本章针对就Spring的AOP进行详细讲解，主要内容如下。

●正则表达式简介

●Spring 2以前的AOP支持

●Spring 2中的AOP支持

## 3.1 正则表达式简介

正则表达式最早是由数学家Stephen Kleene于1956年对自然语言的递增研究成果的基础上提出来的，它并非一门专用的语言，但在很多地方由于它的出现带来了很多的便利，下面对常用的写法进行讲解。

（1）“”表示任意匹配，例如，正则表达式为“a.c”，可以匹配“abc”、“a1c”和“a*c”等。

（2）“*”表示匹配任意次数，例如，正则表达式为“a.*c”，可以匹配“abc”和“abdc”等。

（3）“”表示匹配0次或者1次，用来限定该符号左边的符号，例如，正则表达式为“a*？c”，可以匹配“abc”和“ac”，但是不能匹配“abdc”。

（4）“[]”表示匹配方括号里指定的字符，例如，正则表达式为“a[bcd]e”，可以匹配“abe”、“ace”和“ade”，但是不能匹配“a1e”等。

（5）“\”是正则表达式的连接符，例如，正则表达式为“a.\\-c”，可以匹配“a-f”、“ac-f”和“a1-f”等。

（6）“+”匹配前面的子表达式一次或多次。例如，正则表达式为“a.c+”，可以匹配“abc”和“abcabc”等。

（7）[a-z]表示字符范围。匹配指定范围内的任意字符。例如，'[a-z]'可以匹配'a'到'z'范围内的任意小写字母字符。

由于正则表达式的内容较多，Spring的AOP中会涉及到一些基础的应用，这里列举的已经足够，就不再占用过多的篇幅进行讲解了。

## 3.2 AOP概述

AOP全名Aspect-Oriented Programming，中文直译为面向切面（方面）编程，当前已经成为一种比较成熟的编程思想，可以用来很好地解决应用系统中分布于各个模块的交叉关注点问题。在轻量级的J2EE应用开发中，使用AOP来灵活处理一些具有横切性质的系统级服务，如事务处理、安全检查、缓存和对象池管理等，已经成为一种非常适用的解决方案。

### 3.2.1 代理机制

1.问题引入

假如有一个业务组件Component，其中有3个业务方法，代码如下：

现在有一个需求，在每个业务方法执行前都必须要执行一个用户验证，这样的话就需要在每个业务方法前增加一个验证的方法，代码如下：

这样就会在3个方法中同时增加同样的代码，如果一个大型系统有成千上万个这样的方法，那么就会出现非常多的同样的代码，而且万一需求改变，例如，又需要给所有的业务方法记录日志，那么就要手动给所有的方法中增加记录日志的方法，而某一天不需要某个方法的时候还要动手一个个去删除，这样就给程序人员带来了很大的麻烦。

2.问题解决

类似这类的问题可以用代理机制来进行解决，代理机制主要有两种：静态代理（Static Proxy）和动态代理（Dynamic Proxy）。

3.静态代理

静态代理设计的实现中，代理对象和被代理对象实现同一个接口，在代理对象中实现像验证用户这些服务，并且在使用的时候调用的是被代理的对象，仅仅使用一个概念来解释静态代理有些抽象，下面是一个实例使用静态代理来解决上面的问题。

（1）代理是从接口出发的，由于这里给出的是一个类Component，需要根据它编写一个接口。

（2）编写代理对象，该类和被代理对象Component一样实现IComponent接口，只不过在代理对象中增加需要的一些服务。

这里使用一个构造函数来传递实现IComponent的任意一个类，而在IComponent的几个业务方法中调用的是传递进去的类的方法，在各个方法中增加相应的服务，这个就称为代理。

（3）编写被代理对象，这里就是Component类，只不过给它增加一个接口实现，因为Component类将要传递给ProxyComponent，如果它不继承该接口，那么Proxy Component类就不能接受它。

可以看出代理对象中仅有自己的业务逻辑，没有其他任何服务。

（4）写一个测试代码看看结果。

在使用代理的时候需要注意两点。

①新建一个代理对象new ProxyComponent（），而不能直接新建一个被代理对象。②使用代理对象和被代理对象公用的接口来进行服务操作。

运行结果如下：

可以看出达到预先的要求，在每个业务之前均进行了用户验证，这里主要构造的proxy是一个接口对象，因为代理对象和被代理对象都是该接口的实现，这里的接口也相当于一个超类，代理对象Component和被代理对象ProxyComponent都相当于该超类的子类，静态代理由于要求每一个代理对象都需要有自己的被代理对象，这样一旦程序规模很大的时候就不能胜任了，根据这个设计思想在JDK1.3之后就加入了动态代理的功能。

4.动态代理

结合静态代理的实现机制，抽象出一个泛类代理，也就是说，不用依赖任何被代理对象的代理实现，通过调用java.lang.reflect.InvocationHandler接口来实现一个处理被代理对象的类来完成代理，具体以一个实例来讲解。

设计一个处理被代理对象的类，DynamicProxy类实现InvocationHandler接口。

使用Proxy.newProxyInstance静态方法建立一个代理对象，obj.getClass（）.getInter faces（）来告之所要代理的接口，调用invoke方法会传入被代理对象的方法名称和参数，也就是说，通过method.invoke（obj, args）调用代理对象中的方法，method.invoke返回结果也就是代理对象中方法的返回结果，同样使用前面的IComponent接口和Component类，这里就不再需要编写任何被代理的类了，只要使用该泛型代理类，测试代码如下：

执行结果和上面的静态代理相同，通过这两种代理可以看到原本需要在程序中的片段给提取出来了，并且将这个提取的片段用在了任意的程序中而不丝毫修改源程序，这个就是AOP的最初思想，这个提取的片段在AOP中称为横切关注面（Aspect），片段中的验证用户这样的方法称为横切关注点（Cross-cutting concern），在AOP编程中Aspect对于任何应用程序中，通过设定一定的规则在程序需要的时候介入应用程序，为它们提供服务，在不需要的时候由于其独立性又可以非常方便地脱离出来。

### 3.2.2 AOP中常用术语

这一部分的术语可能读者在阅读的过程中会有很多的疑惑，学习完了后续章节，这些疑惑自然就迎刃而解了，不过在这里把这些术语提出来以便后面用到时有个概念的意识。

1.切面（Aspect）

切面是一个抽象的概念，从软件的角度来说是指在应用程序不同模块中的某一个领域或方面。从程序抽象的角度来说，可以对照OOP中的类来理解。OOP中的类（class）是实现世界模板的一个抽象，其包括方法、属性、实现的接口和继承等。而AOP中的切面（aspect）是实现世界领域问题的抽象，除了包括属性和方法以外，同时切面中还包括切入点Pointcut和增强（advice）等，另外切面中还可以给一个现存的类添加属性和构造函数，指定一个类实现某一个接口和继承某一个类等。例如，在Spring AOP中可以使用下面的配置来定义一个切面。

2.连接点（Join point）

连接点是指程序中的某一个点。连接点分得非常细致，如一个方法、一个属性、一条语句、对象加载和构造函数等都可以作为连接点。AspecJ中的连接点主要有下面的几种形式。

●方法调用（Method Call）——方法被调用时。

●方法执行（Method execution）——方法体的内容执行时。

●构造函数调用（Constructor call）——构造函数被调用时。

●构造函数执行（Constructor execution）——构造函数体的内容执行时。

●静态初始化部分执行（Static initializer execution）——类中的静态部分内容初始化时。

●对象预初始化（Object pre-initialization）——主要是指执行构造函数中的this（）及super（）时。

●对象初始化（Object initialization）——在初始化一个类时。

●属性引用（Field reference）——引用属性值时。

●属性设值（Field set）——设置属性值时。

●异常执行（Handler execution）——异常执行时。

●通知执行（Advice execution）——当一个AOP通知（增强）执行时。

连接点的表示使用系统提供的关键字来表达，例如，用call来表示方法调用连接点，使用execution来表示方法执行连接点。连接点不会单独存在，需要与一定的上下文结合，而是在原始切入点中包含连接点的表述。

3.切入点（Pointcuts）

切入点指一个或多个连接点，可以理解成一个点的集合。切入点的描述比较具体，而且一般会跟连接点上下文环境结合。例如，在前面的例子中，切入点“execution（*Component.*（..）”表示“在Component类中所有以business打头的方法执行过程中”，其包含了3个连接点（business1、business2、business3）的集合。另外，“Component类中的所有方法调用”、“包com.easyjf.service里面所有类中所有方法抛出错误”、“类UserInfo的所有getter或setter方法执行”，这些都可以作为切入点。另外，在大多数AOP框架实现中，切入点还支持集合运算，可以把多个切入点通过一定的组合，形成一个新的切入点。在AspectJ中，可以使用||、＆＆和！等操作符来组合得到一个符合特定要求的切入点，如：

表示所有UserInfo类中的所有带一个String或int型参数的setter方法。pointcut transaction（）：target（service..）＆＆call（*save*（..））表示service包中所有以save开头的方法。

4.增强或通知（Advice）

Advice一词不管翻译成建议、通知或者增强，都不能直接反映其内容，因此本书主要使用“通知”这一叫法。当然也可以把其仅看做是一个简单的名词来看待。通知（Advice）里面定义了切面中的实际逻辑（即实现），比如日志的写入的实际代码，或是安全检查的实际代码。换一种说法，增强（Advice）是指在定义好的切入点处，所要执行的程序代码。例如，下面的话都是用来描述增强（Advice）的例子：“当到达切入点setter时，检查该方法的参数是否正确”、“在save方法出现错误这个切入点，执行一段错误处理及记录的操作”。一般情况下，通知（增强）主要有前通知、后通知和环绕通知3种基本类型。

前通知（before advice）是指在连接点之前，先执行增强中的代码。

后通知（after advice）是指在连接点执行后，再执行增强中的代码。后增强一般分为连接点正常返回增强及连接点异常返回增强等类型。

环绕通知（around advice）是一种功能强大的增强，可以自由地改变程序的流程，连接点返回值等。在环绕增强中除了可以自由添加需要的横切功能以外，还需要负责主动调用连接点，通过proceed来执行激活连接点的程序。

5.拦截器（interceptor）

拦截器是用来实现对连接点进行拦截，从而在连接点前或后加入自定义的切面模块功能。在大多数Java的AOP框架实现中，都是使用拦截器来实现字段访问及方法调用的拦截（interception）。所以作用于同一个连接点的多个拦截器组成一个连接器链（interceptor chain），链接上的每个拦截器通常会调用下一个拦截器。Spring AOP及JBoos AOP实现都是采用拦截器来实现的。

6.目标对象（Target object）

指在基于拦截器机制实现的AOP框架中，位于拦截器链上最末端的对象实例。一般情况下，拦截器末端都包含一个目标对象，通常也就是实际业务对象。当然，也可以不使用目标对象，直接把多个切面模块组织到一起，形成一个完整最终应用程序，整个系统完全使用基于AOP编程方法实现，这种情况很少见。

7.AOP代理（proxy）

AOP代理是指在基于拦截器机制实现的AOP框架中，实际业务对象的代理对象。这个代理对象一般被切面模块引用，AOP的切面逻辑正是插入在代理对象中来执行的。AOP代理的包括J2SE的代理，以及其他字节码生成工具生成的代理两种类型。

## 3.3 传统的AOP支持

不同的AOP框架对AOP的实现方式不同，Spring中是用Java程序来编写的，独立于任何其他的AOP语言，Spring 2.0以前的AOP支持主要是针对不同类型的拦截使用XML配置文件及实现特定的接口通过代理来完成，主要有4种通知，分别为前置通知、后置通知、环绕通知和异常通知。

### 3.3.1 前置通知Before Advice

前置通知Before Advice会在目标对象的方法执行前被调用，设计思路如下：

（1）设计一个接口。

（2）编写这个接口的实现。

（3）编写前置通知的逻辑代码，该代码必须实现MethodBeforeAdvice接口，需要前置的服务都写在这里。

（4）编写XML配置文件，通过代理来实现AOP的前置通知。

首先看一下MethodBeforeAdvice接口的源码。

在代码中可以看到，MethodBeforeAdvice集成了BeforeAdvice接口，而BeforeAdvice接口是继承org.aopalliance.aop.Advice，分析源码可知Advice和BeforeAdvice接口都是空接口，即标签接口，只有在MethodBeforeAdvice中有了before方法，before方法会在target所指定的方法前执行，before方法中的逻辑执行完毕后才会执行目标对象中的方法，根据上面的4步思路写一个具体的实例来讲解。

（1）编写一个接口，这里依然使用IComponent接口。

（2）代理对象，也就是IComponent接口的实现。

（3）编写前置通知的逻辑代码，该类必须实现MethodBeforeAdvice，所有需要前置的服务均在before（）方法体中，这里只是一个简单的控制台输出，在实际运用中可以将验证用户的方法放到before（）方法体中。

AdviceBeforeHello实现了MethodBeforeAdvice接口，这里只是一个简单的演示，给程序增加的前置通知就是打印出一个字符串，即代理对象执行程序之前均会打印出该字符串，如果有任何复杂的逻辑均可以写在before方法内。

（4）编写代理的配置文件advice.xml。

配置文件中配置了一个org.springframework.aop.framework.ProxyFactoryBean类，这是一个代理工厂的泛型类，它可以将任意接口实现代理功能，该类有3个属性，proxyInterfaces指定所要代理的接口，可以是多个接口，使用List配置，这里只指定一个接口Icomponent；target属性表示代理的目标对象，也就是代理类，这里指定的是spring.chapter3.advice.Hello；第3个属性interceptorNames知道那个拦截器的名称，这里指向的是beforeAdvice，也就是前面定义的"spring.chapter3.advice.AdviceBefore Component类，这里可以指定多个前置通知。

（5）编写测试代码。

测试代码中，使用ApplicationContext获取Bean, ApplicationContext直接读取配置文件来获取Bean，测试代码运行结果如下：

这里使用ApplicationContext获得Bean对象，这个Bean是通过org.springframe work.aop.framework.ProxyFactoryBean代理出来的，记得要转换成相应的接口，也就是代理对象所实现的接口，这里是IComponent，通过这个例子可以看出Hello和AdviceBeforeCompon是两个完全独立的程序，通过ProxyFactoryBean进行代理，从而实现了AOP的功能，即通过AOP将一些程序片段插入了Hello类中，而且Component和AdviceBeforeComponent都是可以重复设计的，彼此没有任何的耦合。

### 3.3.2 后置通知After Advice

后置通知After Advice和前置通知相对，就是在指定的程序片段后执行一些服务，设计思路如下。

（1）设计一个接口。

（2）编写这个接口的实现。

（3）编写前置通知的逻辑代码，该代码必须实现。org.springframework.aop.After ReturningAdvice接口，需要后置的服务都写在这里。

（4）编写XML配置文件，通过代理来实现AOP的后置通知，org.springframe work.aop.AfterReturningAdvice接口定义如下：

AfterReturningAdvice接口继承了AfterAdvice接口，而AfterAdvice接口又是Advice接口的子接口，这里的AfterAdvice和Advice均是标识接口，只有在AfterReturningAdvice中才有一个方法体afterReturning，该方法中的参数分别为目标返回值、方法实例、参数对象数组和目标对象，afterReturning没有任何返回值。

继续使用前面的Component例子来进行示例，在business方法后执行一个通知用户已经执行的方法，也就是一个后置通知，首先定义一个AfterHelloAdvice，该类实现AfterReturningAdvice方法。

接着需要在XML配置文件中定义这个后置通知，这需要在ProxyFactroyBean的InterceptorNames中增加该后置引用就可以了，详细文件代码如下：

该配置文件与前面的前置通知配置文件基本相同，就是多了一个定义后置通知类AfterHelloAdvice的Bean，以及ProxyFactroyBean的interceptorNames属性增加一个后置Bean的引用，注意这里的引用是引用后置Bean的id，只能用＜value＞来引用，不能用＜ref＞标签。测试代码与前置通知相同，运行结果如下：

达到预先的目的，后置通知在实际应用中非常广泛。例如，在用户注册的时候给用户发送激活通知，就可以使用该后置通知来实现，只需要在注册的代码中增加一个后置发送邮件的通知就可以了。

### 3.3.3 环绕通知Around Advice

环绕通知就是在指定的程序前后均执行相关的服务，设计思路如下。

（1）设计一个接口。

（2）编写这个接口的实现。

（3）编写前置通知的逻辑代码，该代码必须实现org.aopalliance.intercept.Method Interceptor接口，需要的服务都写在这里。

（4）编写XML配置文件，通过代理来实现AOP的环绕通知，看一下org.aopalliance.intercept.MethodInterceptor接口的源代码。

该接口不是Spring内部的接口，而是AOP Alliance标准所指定的，不过Spring对这个接口有一个具体的实现过程，同时该接口相融所有遵守AOP Alliance标准的所有AOP框架。

环绕通知相当于前置通知和后置通知的结合，不同的是在MethodInterceptor的invoke（）方法中，可以自由地使用MethodInvocation提供的proceed（）方法来执行目标对象的方法，同时proceed（）方法将会返回目标方法执行后的返回结果，在invoke方法结束前还可以修改该结果，下面还是以上面的那个例子来示范一下环绕通知的应用。

编写一个环绕通知的类，该类实现MethodInterceptor接口。

这里调用了MethodInvocation的proceed（）方法，也就是说，调用了目标对象Component中的business1等方法，在这个方法的前后分别增加了验证和通知执行，接着修改一下配置文件，去掉前置通知和后置通知的配置，只需要将这个环绕通知添加进去就可以了，具体代码如下：

这里只需要配置一个环绕通知的Bean，并且将这个Bean配置到interceptorNames中就完成了所有的工作，测试代码与前面的相同，可以看到结果也与前面的相同。

### 3.3.4 异常通知Throw Advice

异常通知就是在程序发生异常的时候执行相关的服务，可以输出指定的异常便于用户判断发生异常的原因所在，设计思路如下：

（1）设计一个接口。

（2）编写这个接口的实现。

（3）编写前置通知的逻辑代码，该代码必须实现org.springframework.aop.Throws Advice接口，需要的服务都写在这里。

（4）编写XML配置文件，通过代理来实现AOP的异常通知，看一下ThrowsAdvice接口的源代码。

可以看到这个异常通知的接口就是一个标签接口，不过它继承的是AfterAdvice接口，而AfterAdvice接口也是一个标签接口，从该接口代码可以看出异常通知也是一个AfterAdvice，某种意义上来说也是一种后置通知，不过是异常发生后的后置通知，可以在异常通知实现类中定义afterThrowing方法为以下形式。

这里的方括号中的参数表示可以省略，也可以存在，但是不可少的一个参数是异常类的，而且这个异常必须是Throwable异常的子类，在执行的过程中会检查是否有该参数类型的异常抛出，如果有就执行方法体，要注意的是异常通知只是通知发生相关异常的程序来执行该方法体中的代码而不是避免异常的抛出，下面以具体示例来示范异常通知的使用。

（1）修改IComponent接口，使其有异常抛出。

（2）修改Component类，同样抛出异常。

Component的每个方法中均抛出一个异常，这样在调用Component中方法的时候就会有异常抛出，这么做的目的是在演示异常通知的执行情况。

（3）编写一个异常通知类，ThrowAdvice继承org.springframework.aop.Throws Advice接口，示例代码如下：

该异常通知类只有一个afterThrowing方法，一个参数就是Throwable类，方法体中只有一个字符串的输出。

（4）修改一下XML配置文件，增加异常通知的Bean，同时将Bean注册到拦截器interceptorNames中，最终代码如下：

ProxyFactoryBean中的interceptorNames属性用来配置拦截器，这里支持list配置，可以同时配置多个拦截器，在执行的时候按照配置的顺序来执行拦截工作，这里的配置文件和前面的前置通知、后置通知和环绕通知基本相同，只是这里配置了异常通知的Bean，将interceptorNames属性改成了该Bean。

（5）测试代码如下：

这里的测试代码除了抛出异常外，都和前面的几个相同，运行结果如下：

从运行结果知道执行了异常通知的方法，但是异常仍然抛出了，异常通知主要就是用于告诉用户异常的所在，通常都自定义一些异常，通过异常通知来抛出，这样便于用户查找异常抛出的问题所在，便于解决问题。

### 3.3.5 NameMatchMethodPointAdvisor

前面用实例讲解了Spring的4种通知的实现，到这里细心的读者可能会提出一个问题：前面的4种通知都是针对一个实体类来说的，如果只想针对某个类的某个方法执行相关的通知该怎么办呢？问题是这一节要解决的，在Spring中有两种方法来解决该问题，第一个就是使用NameMatchMethodPointAdvisor来指定要执行通知服务的方法，第二种方法就是使用正则表达式来定义要执行通知的方法，也就是下一节的Regexp MethodPointAdvisor。

还是用前面的实例按下列步骤来讲解NameMatchMethodPointAdvisor的具体使用。

（1）定义一个接口，这里还是使用Icomponent。

（2）写这个接口的实现，仍然使用Component。

（3）仍然使用前面的前置通知的代码。

（4）编写定义Bean的配置文件，这里就引入了NameMacthMethodPointcutAdvisor，通过它指定需要注入的方法，代码如下：

这里定义了一个componentAdvisor的Bean，它指向org.springframework.aop.support.NameMatchMethodPointcutAdvisor，该类有两个属性，第一个是mappedName，表示将要映射的方法名称，可以使用通配符，也可以指定具体的某一个方法名，“*1”表示所有以“1”结尾的名称；第二个属性是advice，表示将要使用的通知，这里指向前置通知beforeAdvice，同时将ProxyFactoryBean的interceptorNames修改成这个component Advisor。

（5）编写测试代码。

运行结果如下：

可以看出只有第一个业务方法前执行了用户验证，这是因为前面的配置mapped Names为“*1”，所以只有business1方法执行了前置通知，如果将mappedName改成“business*”，那么所有以“business”开头的方法都将执行前置通知，同时NameMacth MethodPointcut还提供了mappedNames来支持多个方法的映射，mapped Names支持list配置，可以进行如下配置。

这样指定了方法名，那么只有这3种方法会执行前置通知。

### 3.3.6 RegexpMethodPointcutAdvisor

Spring除了使用前面的NameMatchMethodPointcutAdvisor可以指定通知的方法外，还提供了正则表达式切入点的表示方法：org.springframework.aop.support.Regexp Method PointcutAdvisor。

将上面的NameMacthMethodPointcurAdvisor指定的方法修改成RegexpMethod PointcutAdvisor，只需要修改配置文件即可，修改好的配置文件如下：

这里定义了一个id为regExpAdvisor的Bean，它指向org.springframework.aop.support.RegexpMethodPointcutAdvisor，该类有两个属性需要配置，第一个属性pattern指定需要执行通知的完整的类名称及方法名称的规则，这里使用了正则表达式来表示，“.*1”表示以“1”结尾的所有的方法名称，结合ProxyFactroyBean中的targer属性表示Component类中所有以“1”结尾的所有方法均执行前置通知，第二个属性“advice”，表示需要执行通知，这里表示定义为beforeAdvice的前置通知，执行结果与前面的相同。

### 3.3.7 DefaultPointcutAdvisor

前面讲到了NameMatchMethodPointcutAdvisor和RegexpMethodPointcutAdvisor提供了对一定命名规则和正则表达式切入点的封装，defaultPointcutAdvisor则提供了一个切入点的支持，Spring提供了4种用来定义切入的类，分别为org.springframework.aop.support.NameMatchMethodPointcut、org.springframework.aop.support.JdkRegexpMethod Point cut、org.springframework.aop.support.Perl5RegexpMethodPointcut和org.springframework.aop.support.ExpressionPointcut，这4种类可以用来描述切入点的类均可由DefaultPointcutAdvisor来进行封装，首先讲解一下DefaultPointcutAdvisor的使用方法。

DefaultPointcutAdvisor类的使用很简单，它有一个advice及pointcut属性，advice属性用来指明要使用的通知，pointcut属性用来指定切入点，可以通过构造子或设值注入方式来配置该Bean。看下面的构造子注入方式。

或者使用设值方法注入，如下所示。

下面结合这4种切入点的描述类一起讲解DefaultPointcutAdvisor。

1.NameMatchMethodPointcut

将前面的RegexpMethodPointcutAdvisor的配置换成NameMatchMethodPointcut，结合DefaultPointcutAdvisor只需要修改配置文件，最终配置如下：

NameMatchMethodPointcut只有一个属性mappedName或者mappedNames，前者表示映射单个字符串，后者表示映射一组字符串，支持＜list＞配置，这里“business*”表示所有business开头的方法，这里的“*”是通配符，不是正则表达式，可以看出DefaultPointcutAdvisor的配置也很简单，就是将advice属性指定为beforeAdvice，也就是前置通知，同时将pointcut属性指向了配置的NameMatchMethodPointcut。

2.JdkRegexpMethodPointcut、Perl5RegexpMethodPointcut

由于这两个都是正则表达式切入点的描述，所以这里就放到一起对比讲解，JdkRegexpMethodPointcut需要在JDK 1.4及以上的环境运行，不需要额外的库；Perl5RegexpMethodPointcut需要把jakarta-oro-xx.jar文件放到classpath上，例如jakarta-oro-2.0.8.jar，这两个正则表达式切入点与描述类的使用方法一样，它们均有两个属性。

（1）pattern或patterns：前者表示单个正则表达式，后者表示多个正则表达式，支持＜list＞配置。

（2）ExcludedPattern或ExcludedPatterns：前者表示排除某个字符串，后者表示排除一组字符串，支持＜list＞配置。

根据上面的讲述，将前面的NameMatchMethodPoint改成JdkRegexpMethodPointcut和Perl5RegexpMethodPointcut配置，分别如下：

JdkRegexpMethodPointcut配置：

这里表示匹配所有business开头的方法，但是除去了business2方法，其他的配置与NameMatchMethodPointcut相同。

Perl5RegexpMethodPointcut配置：

这里只需要将class换成org.springframework.aop.support.Perl5RegexpMethodPointcut就可以了，同时在classpath中要添加jakarta-oro-xx.jar文件，其他的不需要进行任何修改。

3.ExpressionPointcut

Spring 2. 0在Pointcut的基础上引入了一个ExpressionPointcut接口，用来通过切入点表达语言描述切入点。有了ExpressionPointcut，我们可以使用下面更加简单的方式来描述切入点，例如，execution（*Component.business*（..））表示执行所有Component的业务方法（此处为business打头的方法）。

Spring 2. 0提供了一个ExpressionPointcut的实现，即AspectJExpressionPointcut，该类的使用很简单，只需要进行如下配置即可。

其他的配置与前面的几个均相同。

除了以上4种不同的切入点的应用，还可以自定义切入点进行某些特殊的运用，自定义切入点类只需要实现org.springframework.aop.pointcut类，然后在Bean中声明该类，接着就可以使用这些自定义的pointcut类了。

### 3.3.8 引介

前面讲述的一系列通知均是对某一个类某些方法体的监控，而引介则是修改某个类，通过引介可以给一个类引入一个新的方法和属性，与通知不同的是引介引入的方法、属性将成为某个类具有的一个实体方法或属性，而通知只是对方法的增强，并没有修改类，Spring中提供了IntroductionInterceptor来定义引介，在Spring 2.0中Introduction Interceptor的源代码如下。

IntroductionInterceptor也只是一个标签接口，它继承了MethodInterceptor，而MethodInterceptor则是环绕通知必须继承的接口，实际上它是一个方法拦截器，另外，该接口还继承了DynamicIntroductionAdvice，在Spring中DynamicIntroductionAdvice定义如下：

DynamicIntroductionAdvice也是Advice的子类，implementsInterface用来指定实现某个接口。要实现一个引介拦截器，只需要实现IntroductionInterceptor接口即可，在Spring中，为用户提供了两个IntroductionInterceptor的实现，其中比较常用的是DelegatingIntroductionInterceptor，另外一个是DelegatePerTargetObjectDelegating Intro-ductionInterceptor。

DelegatingIntroductionInterceptor需要一个准备引入的接口实现的实例作为参数，而DelegatePerTargetObjectDelegatingIntroductionInterceptor需要指定一个接口及实现类作为参数。例如，下面就构建了一个引介。

另外，Spring还定义了一个用于描述引介信息的IntroductionInfo，内容如下：

还有一个封装IntroductionInfo及Advisor的引介增强器（切面），内容如下：

Spring提供了IntroductionAdvisor的一个实现DefaultIntroductionAdvisor，在实际应用中可以通过继承该类并实现指定的接口来实现一个引介增强器（切面）。注意：在配置文件中不能在没有IntroductionAdvisor的情况下使用IntroductionInterceptor。因为引介是改变类的静态结构，不需要定义切入点Pointcut。在Spring AOP中，引介的使用是通过把一个指定的接口实现添加到代理工厂中，从而使代理工厂返回的代理对象也实现引介指定的接口。

下面以一个具体的实例来说明。

（1）依然使用IComponent接口及其实现类Component。

（2）定义一个新的接口IOther，代码如下：

（3）写一个IOther的实现类。

（4）用DelegatingIntroductionInterceptor来完成引介。

首先使用Component构建一个代理工厂，然后使用DelegatingIntroductionInterceptor构建一个引介，将Other类传递进去，proxy.addAdvice（introduction）就将该引介添加到代理工厂中，这样代理工厂代理出来的既是IComponen，也是IOther，如果没有引介proxy.getProxy（）会是IComponent，通过引介后它具备的IOther功能，也就相当于将IOther中的方法添加进了IComponent，将上面的程序换成配置文件如下：

首先DelegatingIntroductionInterceptor作为构造参数传递给org.springframework.aop.support.DefaultIntroductionAdvisor，接着将Other类作为构造函数的参数传递给DelegatingIntroductionInterceptor，这样就完成了一个切面的构造，接着使用引介当做Proxy FactroyBean的拦截器来配置，测试代码就可以用ApplicationContextgetBean（"proxy"）；来完成了，这样获得的Bean同时具备了Icomponent和IOther功能。

## 3.4 Spring 2.0中的AOP

在Spring 2.0中除了支持3.3节中讲述的传统的AOP支持，还提供了两种实现AOP的方式。

（1）基于XML的配置，使用基于Schema的XML配置来完成AOP，而且Advice也不用再实现任何其他特定的接口。

（2）使用JDK5的注释来完成AOP的实现，只需要一个简单的标签就完成了AOP的整个过程。

使用Spring 2 0AOP的新特性来实现AOP更加简单、快捷，所以使用Spring 2.x版本的框架开发建议使用这两种AOP实现，这样更能缩短开发周期，性能方面丝毫不逊色以前的AOP支持。

### 3.4.1 Spring 2.0中的Pointcut定义

Spring 2. 0中的切入点Pointcut定义有两种方法，表达式配置和Annotation配置，下面具体讲解。

1.表达式

Spring 2. 0中的Pointcut定义支持的关键字有：execution（方法执行的连接点，这是Spring中最主要的切入点指定者）、within（限定匹配特定类型的连接点）、this（连接点本身）、target（连接点目标对象）和arg（连接点参数）等，表达式的定义格式如下：

有“”号的部分表示可省略的，modifers-pattern表示修饰符，如public和protected等，ret-type-pattern表示方法返回类型，declaring-type-pattern代表特定的类，name-pattern代表方法名称，param-pattern表示参数，throws-pattern表示抛出的异常。在切入点表达式中，可以使用“*”来代表任意字符，用“..”来表示任意个参数（注意这里不是正则表达式），比如前面的execution（void spring.chapter3.proxy.Component.business*（..））就表示执行spring.chapter3.proxy.Component中所有business开头的方法，这里省略了第一个参数，第二个参数为void，在很多情况下传回值可以用“*”表示所有传回值均匹配，第三个参数指定了类spring.chapter3.proxy.Component，第四个参数business*表示所有business开头的方法，这里方法的参数为（..），表示0个或者任意个参数，也可以使用“*”来指定任意参数，比如business*（*，String），表示2个参数，第一个为任意类型，第二个为String类型，同时还可以使用within关键字来表示，例如，within（spring.chapter3.proxy.*）表示spring.chapter3.proxy包下的任何方法，由于within用得比较少，同时功能也有所局限，这里不再花太多的篇幅介绍。

2.Annotation表达式

基于JDK 5.0以上版本还可以使用Annotation来配置切入点，表达式写法与前面相同，只不过这里不再需要使用配置文件来声明表达式了，直接使用@Pointcut（"execution（）"）就可以表示一个切入点，以后在需要应用该切入点的时候就可以使用其标识的方法了。

例如，

表示在spring.chapter3.proxy.Component中所有business开头的方法这样一个切入点，在执行前置通知或者其他需要使用的时候直接使用：@before（"beforePointcut"），也就相当于@before（"execution（void spring.chapter3.proxy.Component.business*（..））"）。

### 3.4.2 基于XML Schema的前置通知

Spring 2. 0提供了Schema来通过配置文件解决了前置通知的限定接口，以改写3.3.1节中的实例来讲解，AdviceBeforeComponent不再需要实现MethodBeforeAdvice接口，修改后的代码如下：

这里的代码更加简单，before（）方法是自己定义的，可以任意定义方法名，方法可以用接口JoinPoint作为参数，也可以不用任何参数，接着修改advice.xml配置文件如下：

首先加入schema的命名空间：

接着就可以使用＜aop：config＞标签来配置一个aop片段，在＜aop：config＞中首先定义了一个＜aop：pointcut＞，配置好的pointcut在配置文件中就可以使用它的id来进行应用了，＜aop：pointcut＞相当于一个Bean的配置，只是它只在＜aop：config＞范围内有效，这里要注意的是正则表达式execution（*spring.chapter3.proxy.IComponent.*（..））中的“*”与后面的表达式间要有个空格，否则会提示正则表达式错误，＜aop：aspect＞表示一个切面的定义，该切面引用beforeAdvice的Bean作为通知，＜aop：before＞表示一个前置通知的定义，该通知的规则引用beforePointcut切入点的表达式，method表示要引用的beforeAdvice中的before方法。

＜aop：config＞配置规则如下。

＜aop：config＞配置介绍如下。

（1）＜aop：pointcut＞用来配置AOP的正则表达式，配置好的pointcut直接使用id来进行引用。

（2）＜aop：advisor＞用来配置AOP的切面，与pointcut相同，可以直接使用advisor的id来引用该切面。

（3）＜aop：aspect＞用来配置一个切面，＜aop：aspect＞中ref属性用来指定要AOP的实施类，可以应用配置文件中的任何一个Bean，该Bean将会根据＜aop：adviceType＞的配置来进行前置通知或者其他的AOP行为。

（4）＜aop：adviceType＞有多种类型，可以是＜aop：before＞、＜aop：after-returning＞、＜aop：around＞和＜aop；after-throwing＞，分别表示前置通知、后置通知、环绕通知和异常通知，pointcut-ref属性用来引用＜aop：config＞中定义的某个pointcut, method用来指定实施AOP行为类中的方法，也就是用来指定＜aop：aspect＞中ref属性指定的类中的一个方法，该方法对pointcut-ref指定的一系列方法实行AOP行为。

针对上面的代码编写一个测试文件。

运行结果如下：

从控制台输出信息可以看到，达到预先前置通知的效果，在每个business方法前均执行了用户验证，这里要注意的是除了直接引用spring.jar外，还需要aspectweaver.jar、asm-*.jar和asm-commons-*.jar。

### 3.4.3 基于Annotation的前置通知

Spring 2. 0结合JDK 5及以上版本，还提供了Annotation设置AOP的Advice，避免了XML的配置，更加简化了AOP实现，这里将3.4.2节中的示例改为Annotation配置AOP，首先修改AdviceBeforeComponent如下：

@Aspect标签表示将该类设置为一个Aspect，可以在任意一个类中使用@Aspect标签来表示，@Before标签表示该方法是一个前置通知，它遵守的规则是execution（*spring.chapter3.proxy.IComponent.*（..）），也就是spring.chapter3.proxy.Icomponent接口中的所有方法，before（）也是用户任意定义的，使用@Before标签标注的方法就会在表达式表示的方法执行前执行，也就是说，这里的before（）方法就是前置通知方法，所有前置通知的服务均写在这里，接着修改一下XML配置文件如下：

这里没有了前面的＜aop：config＞等配置，只有一个＜aop：aspectj-autoproxy/＞表示自动进行代理，其余的一切都不用管了，交给Spring就可以了。从这个例子中可以看出，基于Annotation的AOP配置是最简化的，但是它使用了@Aspect等标签，这样给系统造成了一定的耦合，在实际应用中要选择哪个完全取决于个人意向。

### 3.4.4 基于XML Schema的后置通知

Spring 2. 0的后置通知不需要再实现AfterReturningAdvice接口，可以使用任意类中的任意方法作为后置通知，直接使用＜aop：after-returning＞标签来定义后置通知，这里改写3.3.2节中的例子，首先修改AfterComponentAdvice如下：

这里不需再实现任何接口了，after方法也是任意命名的，该方法可以接受JoinPoint作为参数，也可以不用任何参数，接着修改advice.xml配置文件如下。

这里的配置与前置通知几乎相同，除了＜aop：before＞改成了＜aop：after-returning＞，其他的都一样，其含义也是一样的，测试代码还是使用基于Schema的前置通知中的TestSchema.java，运行结果如下：

通过控制台输出信息，可以看到达到预定的后置通知效果，3种方法均执行了后置通知中的after方法。

### 3.4.5 基于Annotation的后置通知

在JDK 5.0及其以上版本，可以使用Annotation来标注后置通知，这里还是以实例讲解，修改上一节的AfterComponentAdvice，使用@AfterReturning标签标注如下：

使用@Aspect标签标识该类是一个Aspect，这里定义了一个Pointcut：afterPointcut，这样后面就可以直接使用afterPointcut（），便于切入点的重用，@AfterReturning标签中的pointcut用来引用一个切入点，这里也可以写成pointcut=execution（*spring.chapter3.proxy.IComponent.*（..））”，不过前面已经设定了该表达式的Pointcut的名称为after Pointcut，所以在这里只需要对名称进行引用就可以了，@AfterReturning中的returning标签表示返回值，也就是说，目标对象的返回值为ret，这样在下面的方法中就可以对该返回值进行一定的控制了。

advice. xml配置文件中只需要＜aop：aspectj-autoproxy/＞就取代了schema中的一系列配置。

### 3.4.6 基于XML Schema的环绕通知

Spring 2. 0中的环绕通知不再需要实现特定的接口，可以任意定义一个类的一个方法，但是该方法必须有一个ProceedingJoinPoint作为参数，环绕通知在执行完前置服务后需要使用ProceedingJoinPoint来激活AOP目标对象的相关方法，然后在执行环绕通知中的后置服务，修改3.3.3节实例中AroundComponentAdvice如下：

这里的around（）方法是自定义的任何方法，该方法要实现环绕通知，则要求其必须有一个参数为ProceedJoinPoint, ProceedJoinPoint的proceed（）方法将会激活目标对象的方法，目标对象的方法执行后将会返回方法的返回值，AroundAdvice可以修改这一值，接着修改advice.xml配置文件如下：

这里除了将＜aop：before＞改成了＜aop：around＞以外，其他的配置均一样，这里的method方法也是指定aroundAdvice中的around方法在执行环绕通知时执行。

测试程序依然使用TestSchema.java，运行结果如下：

### 3.4.7 基于Annotation的环绕通知

基于JDK 5以上版本，可以使用@Around标签来标注环绕通知，使用@Around标注环绕通知更加简单，修改上一节的代码如下：

使用@Aspect标注一个类，表示该类是一个AOP片段，@Around用来标注AOP实施类中的方法，使用@Around标注的方法将会对目标对象实施环绕通知，环绕通知需要激活目标对象中的方法，这样就要求该方法必须有一个ProceedingJoinPoint作为参数，用来激活目标对象中的方法，环绕通知类编写完毕后，配置文件中只需要增加一句＜aop：aspectj-autoproxy/＞就完成了环绕通知的所有工作，@Around指定的方法就会自动将正则表达式中的方法进行环绕通知。

### 3.4.8 基于XML Schema的异常通知

Spring 2. 0中的异常通知同样不再需要实现ThrowsAdvice接口，可以任意使用自定义的方法作为异常通知，结合Schema的XML配置就完成了所有的工作，修改3.3.4节中的ThrowAdvice代码如下：

这里的afterThrowing方法是自定义的任意方法，异常通知只有在有异常抛出的时候才能触发，这里就需要修改Icomponent接口，使其每个方法均抛出异常。

同时修改Component类，同样抛出异常。

修改配置文件如下。

注意这里只有＜aop：after-throwing＞标签和其他几个schema的配置不同，其他的均相同，运行TestSchema.java。

### 3.4.9 基于Annotation的异常通知

基于Annotation的异常通知要使用@AfterThrowing，这里直接将前一节的示例改成基于Annotation配置的，首先修改ThrowAdvice如下：

这里的@AfterThrowing中有两个属性。第一个是定义切入点的，这里的设计使用了表达式，也可以和前面的基于Annotation后置通知中那样配置一个切入点，然后进行引用。第二个属性throwing表示抛出的异常，下面方法中的参数即表示该异常。

配置文件中同样只需要＜aop：aspectj-autoproxy＞一句取代了所有的AOP配置。

### 3.4.10 SpringAOP综合运用之超级玛丽完结篇

超级玛丽游戏初始化后，在人物每次前进一步都可能碰见方块的阻挡，玛丽是否打碎该方块？按下面步骤完成游戏制作。

（1）修改GameRole接口，定义一个人物前进的方法，每一次前进的距离为1（以场景坐标为单位），而玛丽行走的时候会有上下左右4个方向，需要定义4种方法来表示玛丽的行走。

（2）修改Role类，增加GameRole方法。

这里4个行走的方法都是简单的坐标变换，而在玛丽游戏中重要的就是玛丽在行走的过程中会遇见一些方块，打碎这些方块就会爆出一些东西，有药品也有毒物品，也就是说，行走的4个方法中都应该调用一个doBox（）方法来表示打碎物品后的处理，代码如下：

在4个方法中都应该有doBox（）方法，而该方法可能有很多的内容，同时玛丽还有可能增加飞行和游泳等动作，这样就造成了大量的代码重复，这个时候就考虑使用AOP来解决了。

（3）编写一个切面，定义doBox方法作为行走方法的后置通知。

这里首先定义一个名称为afterPointcut的切点。

接着定义了一个后置通知。

这个后置通知有两个参数，第一个JoinPoint用来获取目标对象，也就是go*方法的参数列表，第二个是go*方法的返回值，通过这个后置通知就可以对游戏进行控制，List＜Box＞boxes=（List＜Box＞）args[0]；获得目标对象参数列表中的第一个参数boxes，因为这是随机出来的，所以这里必须使用第一次随机，也就是场景初始化的时候随机出来的一组方块，GameRole role=（GameRole）args[1]；获得目标对象参数列表中的第二个参数role，这个也是人物初始化出来的一个对象，int x=（Integer）list.get（0）；获得目标方法返回值中的第一个值，也就是人物的X坐标，int y=（Integer）list.get（1）；获得目标方法返回值中的第二个值，也就是人物的Y坐标，其他的代码均是一些逻辑处理的，注意这里的：

role. setX（101）是结合下面的运行代码来写的，运行代码中要使人物必须走到场景的最右端，这是游戏结束的一个条件。

（4）编写配置文件game-config.xml。

配置文件的Bean配置代码过多，由于篇幅关系这里省略了，可以参考光盘中的game-config.xml源文件，这里只给出了后置通知Bean的配置及自动代理配置，配置AOP的时候，命名空间要加上AOP的部分。

（5）定义一个游戏运行代码。

该运行代码中，规定人物只要有生命值就必须走到场景的最右端：while（role.getX（）＜role.getRan（）.getX（）），如果人物在中途频繁遇到毒药品而且补血药品不够，那么在后置通知中会结束他的循环条件，自动结束游戏。这里游戏角色的行走都是随机的。

根据随机概率来确定行走方向，这里的ran.nextInt（5）==0就向左走，表示向左走的概率20%，而ran.nextInt（2）==0就向右走，表示向右走的概率为50%，“向左走”的概率定义得很小，目的在于使游戏角色Mary尽早走到场景的最右端，运行该代码，可以看到人物在行走过程中会自动补血，只要药品充足肯定会走到场景的最右端的。当然，这只是一个简单的模拟游戏，实际还有很多的问题这里没有解决，不过只要大家熟悉了AOP的使用，一定可以将这个游戏制作得十分完善的。由于篇幅原因，这里就不再给游戏进行深加工了。

## 3.5 小结

本章由浅入深地讲解了AOP的实现原理，首先详细地讲述了Spring 2.0以前的AOP实现，然后重点讲解了Spring 2.0中的AOP使用方法，针对每一个AOP实现都以实例来逐步讲解，便于读者理解，最后使用AOP技术完成第2章的超级玛丽游戏的设计。通过本章的学习，读者可以熟练地掌握Spring AOP在实际工作中的运用。

# 第4章 Spring持久层的封装及事务支持

对于数据库的存取，Spring提供了DAO支持，可以不用管任何的底层数据库细节。Spring的一组DAO接口就可以完成所有数据的操作，同时对于传统的JDBC的支持，Spring还提供了JdbcTemplate简化了JDBC操作，在事务处理方面，Spring也提供了编程式事务处理（Programmatic transaction management）与声明式事务处理（Declarative transaction management），结合IOC和AOP的思想，Spring可以非常简单地操作数据库。在本章中，将以一些实际的例子来介绍Spring持久层与事务的应用。本章主要内容有：Spring DAO支持、JDBC支持和两种不同方式的事务支持。

## 4.1 初识Spring持久层

Spring没有自己的持久层实现，但是它提供了DAO的支持，可以任意封装任何其他的持久层实现框架，便于以标准的方式使用不同的数据访问技术，可以让用户方便地在这些持久化技术间切换，而且让用户在编码的时候不用考虑处理各种技术中特定的异常。

### 4.1.1 DAO的支持

DAO即Data Access Object的缩写，也就是数据访问对象。DAO思想来源于面向接口设计，也就是将所有的数据库操作抽象成一个接口。在操作数据库时使用接口，这样就避免了和底层操作的耦合。

1.传统的DAO设计

这里举一个传统的DAO例子来讲解传统的DAO设计，按下列步骤来进行。

（1）建立一个用户对象User。

这里的User对象只有3个字段，第一个是标识id，每个用户都有一个唯一的id，第二个是用户名，第三个是密码。

（2）设计一个操作用户的DAO接口IUserDAO。

这里有4种方法，分别为对用户的增删改查，在以后的业务层需要操作数据库的时候就使用IUserDAO来操作，这样就不用考虑该接口实现类的逻辑了，也就是说，避免了和底层操作直接打交道。

（3）写一个IUserDAO的实现类，也就是操作数据库的底层代码。

这里只写了一个增加用户的代码，直接使用SQL语句进行用户的保存，通过代码可以看到，操作数据库首先需要连接打开数据库，操作完毕后还需要关闭数据源。如果一个类中有很多需要操作数据库的方法，那么就需要编写很多同样的代码，这样给编程代码带来很大的不便。

（4）在业务层操作数据库时的代码。

通过Spring的IOC就可以将IUserDAO注入到业务层中，示例如下：

可以看到在配置文件中配置了一个IUserDAO的实现类，并将该实现类注入到UserAction中了，在业务层只使用接口就可以完成对数据库的所有操作，传统的DAO封装要自己实现DAO中各种方法，这样就需要写很多同样的数据库连接、操作和关闭等方法来完成数据库操作，在程序编写的过程中显得很烦琐，而Spring DAO的封装改变了这一切，Spring运用了Template-CallBack模式，建立一个Template类（比如JdbcTemplate和HibernateTemplate），这样就不需要重复过多的数据库操作代码，同时支持了面向对象的查询。

2.Spring的DAO封装

Spring提供了一个DAOSupport抽象类，该类代码如下：

DaoSupport实现了InitializingBean接口，在Bean初始化的时候执行initDao（）方法来完成Dao的注入，这样其他任意指定持久层框架的DAO支持类只需要继承该抽象类，重写一些initDao（）方法，注入相关的Dao即可，DAOSupport支持Hibernate、JDBC、JPA、TopLink和JDO等操作数据库，分别提供了HibernateDaoSupport、JpaDaoSupport、TopLinkDaoSupport和JdoDaoSupport来完成数据库操作。这里以HibernateDaoSupport为例，HibernatDaoSupport部分代码如下：

这里可以看出，HibernateDaoSupport是DaoSupprot的子类，同时HibernateDao Support使用了HibernateTemplate来完成数据库的操作，要使用前面的IUserDAO结合HibernateDaoSupport来完成数据操作则如下：

这里的UserDAOByHibernate相当于前面的UserDAO，即IUserDAO的实现类，业务层还是直接使用IUserDAO，业务层也不用过问究竟是在使用UserDAO，还是使用UserDAOByHibernate，这一切都是Spring来完成的。在UserDAOByHibernate中直接使用了this.getHibernateTemplate（）来获取一个HibernateTemplate操作数据，可以看出代码里没有任何的数据连接的操作了，显得简洁很多（这里需要导入hibernate相关包），关于Spring DAO的具体使用方法可以参考第7章“Spring与JPA”。

### 4.1.2 数据源的注入

不管采用什么方法来进行数据库操作，首先都要设置数据源，在Spring中都是采用IOC方式来注入数据源，直接在配置文件中给DAO注入数据源。

数据库有很多种类，在Spring中就不用考虑数据库的类型，均可以使用配置文件来完成数据源的注入，同时支持多种不同的数据源，如JDBC、连接池和JNDI等注入。不管使用什么方式来操作数据库，只要保留一个DataSource的接口就可以进行数据源注入了。这里还是以前面自定义的UserDAO为例，UserDAO中有一个DataSource属性，同时它提供了set方法。这时就可以使用Spring的IOC来注入这个数据源了，首先在配置文件中定义一个DataSource如下：

其中driverClassName属性用来设置数据库驱动程序类型。这里是mysql数据库，url表示数据库连接的路径；这里是本机的news数据库；3306是mysql的默认端口；username表示连接数据库的用户名，password表示连接数据库的密码，结合前面的UserDAO，就可以写如下配置文件来注入DataSource。

这时要将mysql-connector-java-*.jar添加到classpath中，本书中使用的是mysq l5.0.12，这里统一使用的是mysql-connector-java-3.1.12-bin.jar。在测试之前要准备好数据库，在mysql数据库中建立一个news数据库，同时在news库中建立一个user表，使用下面的sql。

将数据表的id字段设置成了自动增长，第一条数据的id就为1。

修改一下UserDAO，这里只写了insert（）方法和find（）的方法，代码如下：

在UserDAO中直接使用SQL来操作数据库，这里就不用管事务的开启和提交了，因为Connection默认是自动提交的，也可以使用Connection.setCommit（false）来关闭自动提交，这样就需要手动提交事务，在UserDAO中首先进行了数据源的连接：conn=dataSource.getConnection（），之后的一切操作都是建立在Connection之上的，每一次操作完毕后都需要关闭连接和PreparedStatement对象。

写一个测试程序如下：

运行后会发现有输出，查看一下数据库确实有一条记录保存了，说明数据库操作执行成功了。这个就是使用最原始数据库操作方法来注入数据源的操作，当然，在Spring提供的DAO支持的几个DaoSupport中也同样有DataSource属性要注入，方法也是一样的，就是通过IOC来进行Bean配置。

### 4.1.3 多种数据源的置换

Spring除了内置的DriverManagerDataSource以外，还提供了对DBCP连接池及JNDI的支持，下面针对这两种不同数据源的使用进行讲解。

1.DBCP连接池

首先要将commons-collections.jar、commons-dbcp.jar和commons-pool.jar添加到classpath中，然后直接修改前面DriverManagerDataSource的配置文件如下：

可以看出只需要修改Bean的class为org.apache.commons.dbcp.BasicDataSource就可以了，其他的都不用进行任何修改，测试程序依然和前面的一样。注意这里设置了一个destroy-method方法，该方法表示在BeanFactory关闭的时候调用close方法关闭了BasicDataSource。

2.JNDI的支持

与DBCP相比，在进行Web开发中，更多的是使用JDNI来连接数据库。这里以Tomcat容器为例，首先要在Tomcat\conf目录下找到server.xml，在server.xml中的＜/Host＞前添加context，代码如下：

在tomcat中配置好连接池后就可以修改前面的Spring配置文件来获取连接池了，修改后如下：

在使用JNDI时，配置DataSource需要使用org.springframework.jndi.JndiObject FactoryBean，该类中只有一个属性jndiName，配置为Tomcat中对应JNDI的Resource中的name。

## 4.2 JDBC的支持

通过4.1节中的例子可以看到，在使用JDBC时有太多烦琐的细节需要处理，例如，Connection和Statement的获取和关闭，异常的捕获等问题。在Spring中提供了一系列的Template，这些Template封装了数据库的处理细节；也就是说，只要使用Template来操作数据库就不需要考虑那些细节问题了。

### 4.2.1 Template模式

Template模式就是在父类中定义一个操作中的骨架算法，而将一些用户自定义的逻辑延迟到子类中。这里以一个示例来说明，假如所有的business方法中都必须进行用户验证（validateUser）、异常捕获和一个业务操作，那么就将用户验证、异常捕获封装到父类中，子类中只需要写一些business代码就可以了，父类代码如下：

这里是一个抽象类，有一个execute（）方法，在该方法中进行了用户验证、异常捕获和一个业务执行。在这三项任务结束后执行了doBusiness（）方法，同时doBusiness（）方法又是一个抽象方法，继承该抽象类就要重写这个抽象方法，在这里定义用户自己的业务，写一个子类如下：

这里继承类就重写了doBusiness方法，定义一个用户自己的业务，接着写一个测试类如下：

这里的Business类调用了父类的execute方法，也就是说，按execute（）方法的执行顺序来执行，运行结果如下：

这里Business类是BusinessTemplate的一个子类，原本也需要写用户验证和异常捕获等业务，而采用了一个父类模板就将所有的业务都省略了，其他任何需要进行用户验证、异常捕获和业务这些操作的逻辑都只需要继承BusinessTemplate，然后写用户的逻辑代码就可以了，再也不用写那些重复的逻辑了，Spring中正是采用了这样的方法来封装了数据库操作的Connection、Statement这些连接、关闭及异常捕获等。

### 4.2.2 JdbcTemplate

Spring提供了org.springframework.jdbc.core.JdbcTemplate类，它封装了数据库操作的方法，同时它是一个线程安全的，JdbcTemplate的构造函数接受一个DateSource对象，使用JdbcTemplate template=new JdbcTemplate（dataSource）来完成JdbcTemplate的初始化，然后就可以使用JdbcTemplate来操作数据库了。继续使用4.1节中的例子来演示JdbcTemplate的使用，前面的UserDAO使用了传统的数据库操作方式，这里改为使用JdbcTemplate。

这里，在注入DataSource的时候完成了JdbcTemplate对象的初始化。

接着就可以使用JdbcTemplate来操作数据库了，不用手动连接数据源及其他的数据源操作了，代码中也只需要编写相关的业务逻辑，不需要关心数据源的任何操作了。这一切都是JdbcTemplate来完成的。

### 4.2.3 使用JdbcTemplate查询数据库

JdbcTemplate封装了对数据库的所有操作，同一种操作也提供了多种方式。Jdbc Template是org.springframework.jdbc.core.JdbcOperations接口的实现类，在该接口中提供了50多种数据库操作。这里列举一些常用的操作来进行讲解，其他的内容可以查看Spring的源码。

1.返回单个对象查询

1）Object query（String sql, ResultSetExtractor extractor）

接受sql和ResulutSetExtractor作为参数，ResultSetExtractor中的extractData（ResultSet rs）方法接受一个ResultSet作为参数，执行查询的sql后，将查询结果封装到Result Set中并由ResultSetExtractor的extractorData方法返回，可以进行如下查询。

2）Object query（String sql, Object[]args, ResultSetExtractor extractor）

该方法与Object query（String sql, ResultSetExtractor extractor）相同，不过这里增加了一个数组来传递sql中的参数，数组中参数的位置与sql中的位置一一对应，实例如下。

3）int queryForInt（String sql）

根据sql语句来查询int类型的对象，例如，int num=jdbcTemplate.queryForInt（"select count（*）from user"）；返回user表中的所有记录数。

4）int queryForInt（String sql, Object[]args）

根据sql和一个参数数组来查询，查询int类型的返回值，例如，int num=jdbcTemplate.queryForInt（"select id from user where username=？"，new Object[]{"erik chang"}）；查询username为erikchang的用户id，这里的数组与查询语句中的参数一一对应，也就是查询语句中第一个问号对应数组中的第一个参数值。

5）long queryForLong（String sql）

根据sql查询long类型的对象，与queryForInt（String sql）相同。

根据userName参数来查询用户的id，直接将查询参数放到查询语句中。

6）long queryForLong（String sql, Object[]args）

根据sql和一个参数数组来查询Long类型的对象，与queryForInt（String sql, Object[]args）相同。

根据一个或者一组参数来查询类型为Long的字段值，在查询语句中使用“”占位符来表示参数，同时使用一个数组来封装参数，参数在数组中的位置与查询语句中的“”位置一一对应。

7）Object queryForObject（String sql, Class requiredType）

根据sql查询requiredType类型对象，例如，String name=（String）jdbcTemplate.queryForObject（"select username from user where id=1"，java.lang.String.class）；查询String对象，同理可以查询其他的任何类型。

8）Object queryForObject（String sql, Object[]args, Class requiredType）

该方法与前一个方法差不多，不过这里使用一个数组来传递sql中的参数。

9）Object queryForObject（String sql, RowMapper rowMapper）

根据sql返回多个对象，并且将这些对象封装到一个ResultSet中，RowMapper接受ResultSet作为参数，使用该方法首先自定义一个类继承RowMapper接口，给需要查询的对象进行一次封装。

接着就可以进行如下查询。

在使用queryForObject（String sql, RowMapper rowMapper）的时候，首先需要根据查询对象建立一个RowMapper对象，该对象必须实现RowMapper接口，在mapRow（）方法中将查询返回结果集ResultSet各个值取出来分别传递给查询对象的对应字段，并将查询对象返回。

10）Object queryForObject（String sql, Object[]args, RowMapper rowMapper）

该方法与queryForObject（String sql, RowMapper rowMapper）方法相同，不过这里使用了一个数组来给sql传递参数。

实例如下：

首先建立一个UserRowMapper类，该类实现RowMapper接口。

然后进行如下查询。

2.返回多个对象查询

1）List query（String sql, RowMapper rowMapper）

接受一个sql和一个用户自定义的RowMapper对象，将sql查询的对象封装到自定义的RowMapper中，使用前面的UserRowMapper，可以进行如下查询。

2）List query（String sql, Object[]args, RowMapper rowMapper）

与List query（String sql, RowMapper rowMapper）相同，不过这里使用了一个数组传递sql中的参数。

3）List queryForList（String sql）

根据sql查询返回一组对象，返回的list是一组Map对象，每个Map表示返回值的一条数据，例如，List list=jdbcTemplate.queryForList（"select*from user"）；这样返回的是一组Map，返回值可以如下表示。

每个Map中封装了一个User对象，可以通过map.get（String key）来获取一个字段，示例如下：

4）List queryForList（String sql, Object[]args）

该方法与queryForList（String sql）差不多，不过这里使用了一个数组来传递sql中的参数，sql中的参数使用“”占位符。

数组参数的位置与“”占位符位置对应。

5）List queryForList（String, Class elementType）

根据sql查询返回一组elementType类型对象，这里只支持基本类型及String类型，可以进行如下查询。

这样将返回一组String对象，这里不再是Map了，不可以进行如下查询。

### 4.2.4 使用JdbcTemplate更新数据

Spring中提供了execute（）和update（）方法来执行sql语句进行数据更新，主要有以下几种方法用来更新数据。

1.void execute（String sql）

该方法接受一个sql，执行该sql来完成操作，可以是任意合法的sql语句。

2.Object execute（String sql, PreparedStatementCallback action）

该方法接受一个sql和PreparedStatementCallback参数，在sql中可以使用“”作为占位符，通过PreparedStatementCallback中的PreparedStatement对象给sql传递参数，示例如下：

sql中有3个参数在预处理中使用ps.setxxx（参数位置，参数值）来完成参数传递，这里的参数位置从1开始。

3.Object execute（ConnectionCallback action）

该方法接受一个ConnectionCallback作为参数，ConnectionCallback中有一个doInConnection（Connection con），可以根据Connection对象来获取PreparedStatement来完成查询，示例如下：

4.int update（String sql）

该方法与execute（String sql）相同，不过这里返回的是sql执行的数据量，如果sql只修改或插入了一条数据，那么返回值为1，修改两条就返回2，没有任何修改或者插入则返回0。

5.int update（String sql, Object[]args）

该方法与int update（String sql）相同，不过这里使用了一个数组args来传递sql中的参数，在sql中可以使用“”作为参数占位符。

6.int update（PreparedStatementCreator psc）

该方法接受一个PreparedStatementCreator作为参数，在PrepareStatementCreator中有一个createPreparedStatement（Connection con）方法，该方法返回一个Prepared Statement对象，进而update方法执行该返回值，这个update方法同样是返回sql执行的数据量，可以编写如下代码使用该方法。

7.int update（String sql, PreparedStatementSetter pss）

PreparedStatementSetter接口有一个setValues（PreparedStatement ps）方法，在该方法中使用PreparedStatement对象来给update方法的第一个sql传递查询参数，同样在sql中使用“”占位符，这个update方法同样是返回sql执行的数据量，示例如下：

8.int update（String sql, Object[]args, int[]argTypes）

该方法与int update（String sql）及int update（String sql, Object[]args）方法使用相同，不过这里多了一个argTypes数组作为第三个参数，该参数用来表示第二个参数args中每个值对应的数据库中的字段类型，该参数接受的对象是java.sql.Types中的所有值。

### 4.2.5 AbstractLobCreatingPreparedStatementCallback

AbstractLobCreatingPreparedStatementCallback是Spring中提供的对Lob（Binary large object）和Clob（Character large object）对象支持的抽象类，还是用一个实例来说明，首先给user数据表增加一个字段image，它的类型是Blob，然后修改一下UserDAO中的insert方法，使其给user插入一个图片，修改后代码如下：

首先读取一个二进制文件d：/test.jpg，使用execute（String sql, PreparedStatement Callback action），因为AbstractLobCreatingPreparedStatementCallback是ParedStatement Callback的实现类，所以这里可以直接使用new AbstractLobCreatingPreparedStatement Callback（）来完成方法的参数传递，AbstractLobCreatingPreparedStatementCallback类也采用了前面所说的Templat模式来完成Lob数据写入，这里使用了SetValues（Prepared Statement ps, LobCreator creator）来给sql传递参数，与Prepared StatementCallback参数相同，使用PreparedStatement来给基本类型、String类型的参数赋值，而Lob、Clob类型则使用LobCreator来赋值，creator.setBlobAs BinaryStream（ps，3，is，（int）image.length（））；方法读入二进制文件并传递给sql, creator.setClobAsCharacterStream（ps，3，is，（int）image.length（））；setClobAsCharacterStream方法读入Clob文件并传递给sql。

二进制文件存取后可以使用Object query（String sql, ResultSetExtractor extractor）方法来查询并保存Blob、Clob文件，示例如下：

handler. getBlobAsBinaryStream（rs，3）方法中的第二个参数为该blob对象在ResultSet中的位置，这里将图片读取出来并保存为new.jpg文件，使用了Spring中的工具类FileCopyUtils来完成两个流对象的复制。

### 4.2.6 面向对象查询数据

Spring JDBC的操作还是使用了sql语句，如果对sql不是非常熟悉的程序员可能在运用的过程中还有些麻烦，为此Spring提供了org.springframework.jdbc.object包来设计完全面向对象查询，只要封装一个面向对象的查询类，丝毫不用写任何的sql语句就可以完成JdbcTemplate所有的数据库操作功能。

1.org.springframework.jdbc.object.SqlQuery

SqlQuery是主查询类，它提供了强大的查询功能，不过它的查询返回值将会放到一个RowMapper中进行处理，所以在使用SqlQuery的时候要定义一个自己的RowMapper，然后将返回值放到自定义的RowMapper中，这样就完成了查询工作。

首先定义一个UserRowMapper，该类实现RowMapper接口，代码如下：

UserRowMapper类中只有一个mapRow方法，该方法就是将返回结果记录集ResultSet的值封装到User类中。

定义一个UserSqlQuery类，该类继承SqlQuery，代码如下：

UserSqlQuery类首先定义了一个构造函数，在构造函数中调用了SqlQuery中的SqlQuery（DataSource ds, String sql）完成数据源及sql的注入，在sql中仍然使用“”作为占位符，int[]types数组为占位符设置sql字段属性，这里为LONGVARCHAR，最后调用compile（）方法编译，执行sql返回值将有newRowMapper方法返回，这里直接使用了自定义的UserRowMapper来记录返回值，完成上述步骤后，就可以在UserDAO的find（）方法中使用这个查询了。

SqlQuery提供了很多的execute方法来执行查询，详情可以参考Spring的API文档，这里使用了execute传递一个id参数，因为返回值是一个数组，而且数组中只有一个User对象，所以直接使用了（User）list.get（0）。

2.org.springframework.jdbc.object.MappingSqlQuery

MappingSqlQuery类是SqlQuery类的子类，使用MappingSqlQuery查询就不用使用RowMapper处理返回值了，直接写一个UserMappingSqlQuery类继承MappingSqlQuery，代码如下：

UserMappingSqlQuery中首先还是使用SqlQuery中的构造函数完成数据源和sql的注入，返回值直接通过mapRow方法来完成，接着就可以使用它了。

返回值还是一个list, list中就是查询出来的User对象。

3.org.springframework.jdbc.object.SqlUpdate

SqlUpdate类用来表示一个类的更新，当然前面的SqlQuery和MappiingSqlQuery同样可以执行更新的sql语句，不过Spring为了适应用户的编程习惯，特意设计了SqlUpdate类来执行更新（update）和记录（insert）等操作，SqlUpdate类的使用更加简单，只要通过构造函数完成数据源和sql注入即可，定义一个自己的UserSqlUpdate，代码如下：

构造方法与上面的SqlQuery、MappingSqlQuery相同，这里不过多重复，接着就可以编写如下代码来使用了。

SqlUpdate实例直接调用update方法来完成参数的传递及sql的执行。

4.org.springframework.jdbc.object.SqlFunction

SqlFunction类是MappingSqlQuery的一个子类，它也就是具备了MappingSqlQuery的所有功能，不过SqlFunction实例的调用使用run或runGeneric方法来完成，同样可以在run（）或runGeneric（）方法中传递一个数组作为sql的参数，其中run（）方法返回int类型的，一般用在数量的查询，runGenetic（）方法返回一个对象，使用时首先定义一个UserSqlFucntion，代码如下：

接着就可以编写如下代码来查询。

如果在UserSqlFunction的构造函数中sql为select count（*）from user，则在使用的时候就直接使用userSqlFunction.run（）。

### 4.2.7 NamedParameterJdbcTemplate

Spring 2. 0开始提供了NamedParameterJdbcTemplate，使用“xxx”样式来替换了传统的“”占位符，使用JdbcTemplate查询数据的时候可能会按以下形式编写：

使用Spring 2.0以后就可以使用NamedParameterJdbcTemplate改写为如下形式。

注意这里参数的传递，使用了一个MapSqlParameterSource对象，这里是单个参数的传递，也可以使用Map对象来传递多个参数，代码如下：

（dataSource）；

jdbcTemplate. update（sql, map）；

要注意的是sql中的“xxx”命名参数中的“xxx”也与map中的key相同，在面向对象的设计中，Spring还提供了BeanPropertyParameterSource来直接传递对象参数，示例如下：

这里要注意的是User对象中的字段名称必须与“xxx”命名参数中相同，这里User类中的字段名分别为userName和passWord，命名参数也就必须和它一样，将前面的UserDAO改成NamedParameterJdbcTemplate后的代码如下：

然后使用NamedParameterJdbcTemplate来操作数据库，这里就可以使用Named ParameterJdbcTemplate自身的特性来编写数据库操作的SQL了。

### 4.2.8 SimpleJdbcTemplate

SimpleJdbcTemplate是Spring 2.0中泛型支持，使用SimpleJdbcTemplate必须在JDK 5.0以上版本，使用JdbcTemplate查询返回的是Object对象，而SimpleJdbcTemplat支持泛型，直接可以返回User对象，将UserDAO修改为SimpleJdbcTemplate。

使用SimpleJdbcTemplate操作数据就可以直接返回一个对象，而不是Map，在使用的过程中直接使用userDao.find（id），这样返回的就是一个User对象，就不需要对查询返回值进行二次封装了，某种程度减少一定的代码量。

## 4.3 Spring事务支持

Spring提供了编程式（Programmatic transaction manage-ment）和声明式（Declararive transaction management）两种事务支持，为不同的事务API提供了一致的编程模型，大大地简化了事务的复杂度。

### 4.3.1 Spring事务概述

首先看一下传统的JDBC事务操作，传统的JDBC事务操作首先设置connction非自动提交，等到执行完相关逻辑后再执行connection.commit（）完成事务提交，如果sql执行过程中有错误发生，则执行connection.rollback（）回滚事务，代码如下：

Spring的事务支持采用的是AOP思想，提供了PlatformTransactionManager作为一致的事务源模型，一切对事务支持的逻辑均可以通过实现PlatformTransactionManager接口形成一个新的事务源，org.springframework.transaction.PlatformTransactionManager接口代码如下：

该接口只有3种方法，commit（TransactionStatus status）方法就是事务提交，rollback（TransactionStatus status）方法是事务回滚，注意两种方法的参数都是TransactionStatus，也就是说，事务究竟是提交还是回滚应该根据该参数来决定，在PlatformTransaction Manager中TransactionStatus是通过getTransaction（TransactionDefinition definition）来返回一个TransactionStatus对象的，getTransaction（）方法又接受了一个Transaction Definition参数，TransactionDefinition接口定义了事务的隔离程度（Isolation-level）、传播行为（Propagation behavior）、超时（Timeout）和只读（Read-only），也就是说，TransactionDefinition是事务属性的几个大集合，通过事务的属性集合来获取一个TransactionStatus，然后根据这个TransactionStatus来决定是否提交，看一下TransactionStatus的源代码。

在Spring中如果要实现事务管理，可以直接使用PlatformTransactionManager来完成，PlatformTransactionManager有很多子类，例如，DataSourceTransactionManager（数据源事务管理）HibernateTransactionManager（Hibernate事务管理）JdoTransactionManager（Jdo事务管理）和JtaTransactionManager（Jta事务管理）等。

### 4.3.2 编程式事务管理

Spring提供了两种不同的编程式事务管理，一是直接使用PlatformTransaction Manager实现，二是使用TransactionTemplate实现。

1.PlatformTransactionManager

使用PlatformTransactionManager来完成事务管理的时候要根据不同的事务类别选择使用PlatformTransactionManager不同的子类实现事务管理，这里以DataSource TransactionManager为例，所有的TransactionManager都需要一个Transaction Definition对象作为参数，一般都在事务管理中新建一个DefaultTransactionDefinition对象来作为TransactionManager的参数，修改前面UserDAO中的insert（）方法，使该方法执行中接受事务支持，代码如下：

在insert方法中使用了DataSourceTransactionManager进行事务管理，这里的sql语句是正确的，在测试的过程中可以将sql改成一个错误的，或者将数据库连接停止，这样就可以看到事务的回滚执行。

在UserDAO中，定义了一个TransactionDefinition和一个DataSource Transaction Manager, TransactionDefinition用来定义事务的相关属性，这里只设定了事务的传播行为：def.setPropagationBehavior（TransactionDefinition.PROPAGATION_REQUIRED），这里设为PROPAGATION_REQUIRED表示执行当前的事务，如果没有就建立一个新的事务，DataSourceTransactionManager的初始化需要一个dataSource参数，所以将DataSourceTransactionManager的初始化放在了DataSource的set方法中，这样在配置文件中使用IOC思想就直接完成了DataSourceTransactionManager的参数注入和初始化工作，在insert方法中，首先DataSourceTransactionManager根据TransactionDefinition来获取一个TransactionStatus，一旦有错误发生马上回滚：transactionManager.rollback（status），综合上面的例子总结TransactionManager的事务管理一般步骤如下：

（1）初始化一个TransactionManager，这里是注入一个DataSource来完成了Data SourceTransactionManager的初始化。

（2）定义一个TransactionDefinition，使用TransactionDefinition来设定事务的相关事务，如隔离度、传播行为和超时等。

（3）根据第一步中的TransactionManager和第二步中的TransactionDefinition来获取一个TransactionStatus，通过TransactionStatus来控制事务的执行或者调查的状态。

2.TransactionTemplate

TransactionTemplate接口继承了DefaultTransactionDefinition类，也是采用了Template模式来完成事务的管理，将上面的UserDAO中的insert方法改用Transaction Template来管理事务，代码如下：

直接新建一个TransactionTemplate，执行TransactionTemplate的execute方法就完成了事务的管理，这里不用再使用try……catch……来处理异常回滚了，这里的doTransaction方法需要返回一个值，如果没有返回值的话可以编写代码如下：

### 4.3.3 事务属性

前一节中已经用到了TransactioinDefinition, TransactionDefinition接口用来定义事务的相关属性，包括传播行为（PropagationBehavior）、隔离层级（IsolationLevel）、只读（Read-only）和事务超时（Transaction timeout），在实际应用中大都使用Transaction Definition的一个实现类DefaultTransactionDefinition，通过DefaultTransactionDefinition来设置事务的相关属性。

1.传播行为（PropagationBehavior）

传播行为告之何时开始一个事务，事务何时停止，在DefaultTransactionDefinition中定义了传播行为必须是“PROPAGATION_”开头的字符串，Spring中定义了以下7种不同的传播行为。

1）PROPAGATION_REQUIRED

在TransactionDefinition中定义了int PROPAGATION_REQUIRED=0，表示支持当前的事务，如果当前没有开启事务则新建一个事务。

2）PROPAGATION_SUPPORTS

在TransactionDefinition中定义了int PROPAGATION_SUPPORTS=1，表示支持当前事务，如果当前没有事务则以非事务方式执行。

3）PROPAGATION_MANDATORY

在TransactionDefinition中定义了int PROPAGATION_MANDATORY=2，表示纳入该事务管理的方法必须在事务中进行，如果当前没有事务就抛出异常。

4）PROPAGATION_REQUIRES_NEW

在TransactionDefinition中定义了int PROPAGATION_REQUIRES_NEW=3，表示当前如果有事务存在就暂停它，然后新建一个新的事务。

5）PROPAGATION_NOT_SUPPORTED

在TransactionDefinition中定义了int PROPAGATION_NOT_SUPPORTED=4，表示当前方法不在事务中进行，如果当前已经开启事务则停止当前事务。

6）PROPAGATION_NEVER

在TransactionDefinition中定义了int PROPAGATION_NEVER=5，表示当前方法不在事务中进行，如果当前已经开启事务则抛出异常。

7）PROPAGATION_NESTED

在TransactionDefintion中定义了int PROPAGATION_NESTED=6，表示当前方法在嵌入事务中进行，如果当前不是嵌入事务，则新建一个事务。

事务的传播行为主要表示事务的应用边界，也就是事务的开始和停止点，代码如下：

这里将事务设置为PROPAGATION_REQUIRED，则表示当前方法执行的时候，如果已经开启事务了，在已经开启的事务的边界就是当前方法事务的边界，如果没有开启事务，则开启一个新的事务，则新事务的边界就是当前方法的开始和结束。

2.隔离层级（IsolationLevel）

在任意应用程序中，各个事务都是相互隔离的，这些事务可能同时存在，但是彼此都不会有任何影响的，这样就要求对事务进行锁定，但是如果事务锁定，两个事务同时操作同一项业务的时候，第一个事务没有执行完毕的话就始终处于锁定状态，那么第二个事务就没有办法进行，这样就造成了程序等待，一旦程序逻辑多了，等待就越来越多，这样就会造成系统的缓慢甚至崩溃，实际上在事务执行的时候不一定都需要进行完全锁定，在Spring中，提供了5种隔离层级，通过设定隔离层级来设置事务锁定的层级。

1）ISOLATION_DEFAULT

在TransactionDefinition中定义了int ISOLATION_DEFAULT=-1，表示使用底层数据库预设的隔离层级，也就是当前使用数据库隔离层级对应JDBC的隔离层级。

2）ISOLATION_READ_UNCOMMITTED

在TransactionDefinition中定义了int ISOLATION_READ_UNCOMMITTED=Connec-tion.TRANSACTION_READ_UNCOMMITTED，表示允许事务读取其他并行事务还没有提交的数据，这样隔离层级会造成前后数据不一致等问题。

3）ISOLATION_READ_COMMITTED

在TransactionDefinition中定义了int ISOLATION_READ_COMMITTED=Connec-tion.TRANSACTION_READ_COMMITTED，表示允许事务读取并行的事务已经提交的数据。

4）ISOLATION_REPEATABLE_READ

在TransactionDefinition中定义了int ISOLATION_REPEATABLE_READ=Connec-tion.TRANSACTION_REPEATABLE_READ，表示要求多次读取的数据必须相同，一个事务读取数据的时候，如果另一个并行的事务正在修改但是还没有提交数据，则这个并行事务中的数据将恢复到修改前。

5）ISOLATION_SERIALIZABLE

在TransactionDefinition中定义了int ISOLATION_SERIALIZABLE=Connection.TRANSACTION_SERIALIZABLE，表示完全隔离层级，一个事务在修改数据的时候，在提交前，另一个并行数据想要读取数据是不可能的，只有等当前事务操作结束后，其他的事务才能对其进行操作，该层级对效率有影响，但是在某些时候还是必需的。

3.只读（Read-only）

表示当前事务只能进行读取动作，所以这个事务属性必须在事务中设置，也就是说，必须有事务执行，要和传播行为的PROPAGATION_REQUIRED、PROPAGATION_REQUIRES_NEW和ROPAGATION_NESTE配合使用，通过这个属性可以对某些不可变的数据进行保护。

4.事务超时（Transaction timeout）

在TransactionDefinition有如下定义：

也就是说，在没有自定义超时的情况下，事务是永远不会超时的，在事务存在的情况下，以使用DefaultTransactionDefinition.setTimeout（）来设置超时时间，一旦事务在设定的时间内没有结束则执行一个新的动作，这样就在某种程度上对系统进行了安全优化，同时对内存释放也是有好处的。

### 4.3.4 声明式事务管理

Spring提供的编程式管理，主要用于细颗粒的事务处理上，大多数情况不需要对某个方法进行单独的编程式事务管理，Spring提供了编程事务管理，采用AOP思想对需要事务支持的所有方法进行管理，不需要在方法体类编写任何事务管理的代码，直接通过配置文件或者Annotation就完成了事务管理。

1.TransactionProxyFactoryBean

TransactionProxyFactoryBean采用的是动态代理完成事务管理的，直接配置一个TransactionProxyFactoryBean就可以了，这里的UserDAO不需要任何的事务管理代码，UserDAO直接使用JdbcTemplate代码如下：

这里的UserDAO没有任何的事务管理代码，现在要给insert方法增加事务管理，就可以使用TransactionProxyFactoryBean来动态代理IUserDAO接口，对insert方法进行事务管理，配置文件如下：

这个配置文件中与JdbcTemplate中不同的是配置了一个TransactionManager和一个TransactionProxyFactoryBean，就是通过这个代理类来完成事务的管理，TransactionProxy FactoryBean常用的有5个属性。

1）proxyInterfaces

该属性配置需要代理的接口。

2）target

该属性配置proxyInterfaces中指定接口的实现类。

3）transactionManager

该属性指定一个TransactionManager。

4）transactionAttributes

该属性指定proxyInterfaces的接口中的方法，支持＜props＞多个配置，这里的“insert*”表示insert开头的所有方法将纳入事务管理，这里的“*”是通配符，也可以指定方法全名，纳入事务管理的方法在执行过程中一旦发生错误，则马上回滚先前所有的操作。＜prop＞标签中key表示纳入事务管理的方法名，value表示事务定义，即Transaction Definition，这里是PROPAGATION_REQUIRED，表示支持当前事务，如果当前没有事务则新建一个事务。在配置＜prop＞标签值的时候可以配置多个事务定义，包括传播行为、隔离层级和只读等，例如：

这里的配置是：传播行为，隔离层次，只读，+（-）异常，PROPAGATION_REQUIRED是传播行为，ISOLATION_DEFAULT是隔离层级，readOnly是只读，这里要注意如果配置为readOnly则为只读，不配置就为非只读，不要配置为true或者false，-SQLException表示有SQLException异常发生的时候马上回滚，撤销操作，如果是+SQLException表示有异常的时候立即提交。

5）transactionAttributeSource

这里的配置文件没有用到这个属性，该属性接受一个TransactionAttributeSource作为参数，通过配置TransactionProxyFactoryBean的transactionAttributes属性可以管理事务的相关属性，如果多个事务都需要同样的配置，如PROPAGATION_REQUIRED, ISOLATION_DEFAULT, readOnly，-SQLException，那么在某种程度上也造成了配置的重复，Spring中还提供了TransactionAttributeSource来封装事务的属性，然后将Transaction AttributeSource作为一个新的Bean注入到TransactionProxyFactoryBean的transaction AttributeSource中，TransactionAttributeSource接口有多个实现类，常用的有org.springframe work.transaction.interceptor.MatchAlwaysTransactionAttributeSource，可以直接使用Match AlwaysTransactionAttributeSource来表示所有的方法均纳入事务管理，代码如下：

这里是将IUserDAO中所有的方法均纳入了事务管理中，同时事务的默认传播行为是PROPAGATION_REQUIRED，隔离层级为ISOLATION_DEFAULE, MatchAlways TransactionAttributeSource有一个方法setTransactionAttribute（TransactionAttribute transaction Attribute），这样就可以使用TransactionAttribute的实现类来将MatchAlways Transaction AttributeSource注入自定义的事务属性，TransactionAttribute的实现类最常用的是org.springframework.transaction.interceptor.DefaultTransactinAttribute, DefaultTrasactionAttribute是DefaultTransactionDefinition类的子类，可以直接注入传播行为、隔离层级、超时和只读，DefaultTransactionDefinition配置方法如下：

最终配置代码如下：

MatchAlwaysTransactionAttributeSource只能轮廓地设定接口中所有的方法均纳入事务管理，如果要指定某个方法要纳入事务管理，可以使用org.springframework.transac tion.interceptor.NameMatchTransactionAttributeSource指定某个方法，代码如下：

上述配置表示所有以“insert”开头的方法均纳入事务管理，如insert1（）、insert2（）这些方法都被纳入事务管理，配置好TransactionAttributeSource后需要装配到Transaction ProxyFactoryBean中。

在transactionAttributeSource属性中指定已经配置好的TransactionAttriuteSource，这样就完成了指定方法的事务配置。

2.基于Schema

Spring 2. 0中就可以不用TransactionProxyFactoryBean来管理事务，它提供了Schema，使用＜tx：advice＞标签结合aop就可以轻松地实现事务管理，假如现在要对IUserDAO接口中的insert方法进行事务管理，使用schema则可以进行如下配置：

＜tx：advice＞标签表示一个事务advice，它需要设置一个TransactionManager，这里引用了DataSourceTransactionManager，在＜tx：advice＞内部使用＜tx：attributes＞来设置相关属性，每一个＜tx：method＞表示设定一个需要纳入事务的方法，这里支持组配置，在＜tx：attributes＞内部可以有多个＜tx：method＞，＜tx：method＞中可以配置propagation（传播行为）、isolation（隔离层级）、timeout（超时秒数）、read-only（事务是否只读）、rollbackFor（需要回滚的异常，这里是一个数组）和noRollbackFor（不需要回滚的异常，这里配置成一个数组），结合一个＜aop：config＞来配置事务，这里的＜aop：config＞中的＜aop：advisor＞引用的advice就是＜tx：advice＞的一个实例，相当于前面讲解AOP中的一个Bean，这里要注意一点，在配置＜tx：method＞中的事务传播行为和隔离层级属性的时候，不再需要“PROPAGATION_”和“ISOLATION_”作为前缀了，也就是“PROPAGATION_REQUIRED”直接配置为“REQUIRED”就可以了，isolation的配置也一样，在使用UserDAO的时候不再需要设置代理对象，直接获取UserDAO进行应用即可。

3.基于Annotation

Spring 2在JDK5及其以上版本，提供了一套Annotation标签来配置事务，这样就避免了配置文件书写，在需要进行事务管理的方法体上使用@Transactional标签就轻松地完成了事务的管理，将上面的UserDAO改成Annnotation配置，则代码如下：

在org.springframework.transaction.annotation包中提供了@Transactional标签来配置事务，该标签有propagation、isolation、timeout、readOnly、rollbackFor和noRollbackFor属性，其中propagation表示传播行为，isolation表示隔离层级，timeout表示事务超时秒数，readOnly表示事务是否只读，rollbackFor表示事务需要恢复的异常，noRollbackFor表示事务不回滚的异常，其中rollbackFor和noRollbackFor均配置为一个数组，如rollbackFor={Exception1，Exception2……}。

代码中需要事务支持的方法使用@Transactional配置完毕以后，在配置文件中只需要＜tx：annotation-driven transaction-manager="指定一个TransactionManaget"/＞，使用Annotation配置文件如下：

这里由于不再设置代理对象了，所以在应用UserDAO的时候，直接使用UserDAO usrDao=context.getBean（"userDao"）就可以了，不用再转换成IUserDAO接口进行应用了。

## 4.4 小结

本章深入学习了Spring的持久层封装及事务的支持，详细地介绍了Spring的JDBC操作和事务，通过本章的学习，读者可以深入地理解事务的概念及事务在实际运用中的作用，并且可以熟练地使用Spring来处理事务，在下一章中将学习Spring的MVC。

# 第5章 Spring的MVC

MVC是当前Web设计的主流模式，它起源于Smalltalk语言，在Java领域有很多优秀的MVC框架，例如Struts和EasyJWeb等，Spring作为一个综合性框架也提供了一套自己的MVC架构方案，结合它本身的IOC和AOP轻松地解决了现存的很多MVC问题，Spring MVC在很多方面毫不逊色当前主流的MVC框架，同时Spring MVC是目前所有MVC框架中可扩展性非常好的框架之一，本章将带领大家一起深入学习Spring MVC的实践运用，结合多个实例来讲解Spring MVC实践运用的方法及相关注意事项，本章主要内容有以下几点。

●Spring MVC的视图View、ModelAndView

●多种不同控制器的使用

●拦截器、验证器

●和其他多种视图的整合

## 5.1 开始Spring MVC

Spring MVC在Web应用中也是充当一个流程控制的作用，具体数据操作还是要依赖DAO层，本节将使用Eclipse开发一个最简单的Spring MVC程序，了解开发MVC程序的开发流程及相关注意事项。

### 5.1.1 IDE的准备

（1）开发Web程序，有很多种IDE可供选择，如JBuilder、NetBeans和Eclipse等，本书所有的程序开发均是基于Eclipse IDE开发的，关于Eclipse这里就不再介绍了，可以从http://www.eclipse.org/downloads/官方网站下载最新版本，如图5-1所示。本书使用的版本是3.3.0，保证计算机中已经安装JDK, eclipse下载后正常安装即可。

图5-1 Eclipse下载页面

（2）Tomcat的下载与安装。

Tomcat是基于Servlet标准的Web服务器的，适用于中小型应用程序的运载，同时Tomcat又是一个开源产品，也是当前开发中最主流的Web服务器，本书使用的是Tomcat 5.5，可以从http://tomcat.apache.org官方下载，如图5-2所示。

图5-2 Tomcat下载页面

（3）TomcatPlugin的下载与安装。

TomcatPlugin是一款基于Eclipse的tomcat插件，用于在Eclipse中管理tomcat（启动、停止已经重启Tomcat），便于项目开发，可以从http://www.eclipsetotale.com/tomcat Plugin.html#A3官方网站下载，如图5-3所示。

图5-3 tomcatplugin下载页面

tomcatPlugin针对不同版本的eclipse也有对应的版本，这里下载的是tomcatPlugin V32，解压后直接将tomcatPluginV32下的com.sysdeo.eclipse.tomcat_3.2.0文件夹复制到eclipse中的plugs文件下，重新启动eclipse就可以看到eclipse的工具栏上多了3只小猫的图像，如图5-4所示。

图5-4 TomcatPlugin安装后的Eclipse工具条

如果出现以上图像，表示tomcatPlugin安装成功，如果没有出现几只小猫的图像，那么就手动删除eclipse/configuration下的org.eclipse.update，然后重新启动eclipse即可，安装完tomcatPlugin后需要设置一下Tomcat的启动路径，在eclipse的菜单栏中，选择【Windows】→【Preferences】命令，打开属性配置窗口，如图5-5所示。

图5-5 Eclipse中配置tomcat启动路径

在这里选择Tomcat的版本号及Tomcat的安装目录，单击【OK】按钮完成配置，这时候分别单击如图5-6所示按钮中的第一个按钮表示启动Tomcat，第二个按钮表示停止Tomcat，第三个按钮表示重新启动Tomcat，同时在控制台console中也可以看到相关的信息。

图5-6 Tomcat插件按钮组

### 5.1.2 第一个MVC实例

Web开发需要的IDE准备好以后就可以开发一个Web应用，这里按如下步骤进行。

（1）从Eclipse菜单中，选择【Files】→【New】→【Other】命令，打开一个新建窗口，如图5-7所示。

图5-7 新建Tomcat Project

这里选择【Java】→【Tomcat Project】（只有安装完TomcatPlugin后才会有此项）命令，单击【Next】按钮进入下一个窗口，如图5-8所示。

图5-8 输入项目名称

这里输入项目名称为FirstSpringMVC，单击【Finish】按钮即完成项目的新建，最终项目在Eclipse中的结构，如图5-9所示。

图5-9 新建完毕的项目结构

（2）添加相关的jar到项目的classpath中，这里首先将spring.jar和commons-logging.jar复制到FirstSpringMVC/WEB-INF/lib下，然后在FirstSpringMVC上单击鼠标右键，选择【Properties】→【Java Build Path】命令，如图5-10所示。

图5-10 项目的Properties窗口

接着单击【Add JARs】按钮打开一个添加窗口，如图5-11所示。

图5-11 添加JAR文件到CLASSPATH

选中之前复制过来的两个jar文件（可以按【Shift】键进行多选），单击【OK】按钮，完成jar的添加。

（3）在WEB-INF下添加一个web.xml文件，内容如下：

＜welcome-file-list＞指定该项目的首页列表，这里只指定一个为index.jsp，也就是在浏览器中输入http://xxx/FirstSpringMVC这样的请求时会自动导向index.jsp页面，不过index.jsp页面必须直接放到FirstSpringMVC的目录下，这样才是安全的。这里不过是进行一个简单的演示，＜servlet＞标签标识配置一个servlet，其中的＜servlet-name＞表示servlet名称，可以任意定义，＜servlet-class＞表示该servlet的路径，这里指向Spring包中servlet，＜init-param＞用来配置启动参数，“contextConfigLoaction”用来设置系统上下文的配置文件所在的位置，这里指定为/WEB-INF/mvc-config.xml，设置多个配置文件可以使用“”作为分隔符，代码如下：

如果不指定contextConfigLoaction, Spring会默认寻找WEB-INF下的“servlet名称-servlet.xml”作为Bean初始化的文件，在这里也就是“dispatchServlet-servlet.xml”，指定后Spring容器将会以mvc-config.xml文件的内容来初始化Bean，＜servlet-mapping＞标签表示servlet映射，其中＜servlet-name＞表示映射的servlet的名称，与前面配置的servlet名称相对应，＜url-pattern＞表示接受的url后缀，这里表示所有.html请求都将交给名称为dispatcherServlet的Servlet来处理。

（4）在WEB-INF/src中新建一个类UserController，该类继承org.springframework.web.servlet.mvc.Controller，代码如下：

（5）在WEB-INF中添加一个mvc-config.xml文件，配置Bean，代码如下：

Spring的工作流程是由后台的Controller返回一个ModleAndView, DispatcherServlet交给ViewResolver来进行视图解析，所有在配置Bean的时候都要根据不同的视图来配置不同的ViewResolver实例，这里使用的是jsp视图，所以直接使用InternalResourceView Resovler, mvc-config.xml中配置了两个Bean，第一个是InternalResourceViewResolver，这个是Spring中视图解析类，它需要设置一个，“prefix”属性表示Web程序中页面文件所在的路径，“suffix”属性表示Web页面的扩展名，第二个Bean就是一个指向spring.chapter5.firstmvc.UserController类，name属性表示当有“user.html”请求的时候将DispatcherServlet交给UserController类来处理，这里的“show”是结合ViewResolver来处理的，由于在ViewResolver中配置了prefix和suffix属性，这里的“show”就表示“/WEB-INF/web/show.jsp”。

（6）在WEB-INF中新建一个Web文件夹，同时在Web文件夹下建立一个show.jsp文件，内容如下：

接着新建一个index.jsp文件，直接放到FirstSpringMVC的目录下，index.jsp内容如下：

在页面建立的时候要注意编码，这里将所有的编码均设置为UTF-8，到这里为止，一个简单的Web应用就完成了，最终结构如图5-12所示。

图5-12 FirstSpringMVC最终结构图

（7）启动Tomcat，打开IE浏览器，在地址栏输入http://localhost：8080/FirstSpring MVC，运行结果如图5-13所示。

图5-13 第一个SpringMVC运行结果

输入用户名，单击【提交】按钮，转到第二个页面，如图5-14所示。

图5-14 第一个SpringMVC提交结果

## 5.2 Handle Mapping

Spring对每一个约定URL请求首先都会交给DispatcherServlet来处理，而DispatcherServlet实际上只是一个请求分发器，它只负责将相应的URL请求传递给某个具体的控制器进行处理，看一下前面的配置代码。

由于web.xml中指定了所有的“.html”都交给DispatcherServlet来处理，所以当有“user.html”请求时也会由DispatcherServlet处理，而DispatcherServlet会将“user.html”请求分发给UserController控制器处理，DispatcherServlet默认的handle Mapping是org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping, BeanNameUrl Handler Mapping根据Bean定义的name属性来决定相应的处理器，这个Bean的name是“/user.html”，它对应的class是UserController，就表示user.html请求交给UserController处理，BeanNameUrlHandlerMapping要求给每个Bean都配置一个Name，而且控制器中只能有一个请求处理，一旦使用多动作处理器就不能再使用BeanNameUrlHandler Mapping了，Spring在handle Mapping上最常用的是SimpleUrlHandlerMapping，将上面的例子修改成SimpleUrlHandlerMapping代码如下：

这个配置文件中多了一个“urlHandleMapping”的Bean，该Bean就是SimpleUrl HandlerMapping，这个类有的mappings属性中接受＜props＞组配置多个映射，＜prop＞的key表示请求，value表示处理key请求控制器Bean的id，同时key还支持通配符，如＜prop key="/user*.html"＞userController＜/prop＞表示所有“user”开头的“.html”请求均由id为userController的Bean处理。

Handler Mapping在Spring 2以后又增加了ControllerClassNameHandlerMapping，该Handler Mapping约定控制器的命名规范，使用ControllerClassNameHandlerMapping系统会根据请求的URL来查找处理器，例如User.html请求，则系统会自动查找名称为UserController的控制器，使用方法如下：

直接在配置文件中配置一个Bean，其class指向org.springframework.web.servlet.mvc.support.ControllerClassNameHandlerMapping就可以了，不过在配置Controller Bean的时候要使用name属性配置，因为ControllerClassNameHandlerMapping会根据名称进行Controller的查找。

Handle Mapping在Spring中是依据DispatcherServlet的getHandler（）方法返回一个HandlerExecutionChain来进行匹配处理的。

## 5.3 ModelAndView

Spring的Controller执行相关逻辑后，将获取的数据返回到一个ModelAndView对象中，并由ModelAndView根据数据合成页面，ModelAndView有以下几种构造方式。

1.ModelAndView（）

空参数构造函数，返回一个“prefix/请求名称+.suffix”的页面，例如以下配置。

url请求为“user.html”时，onSubmit（）方法将跳转到/WEB-INF/web/user.jsp页面，这个时候User对象不会被传递到页面中，空参数构造函数在页面跳转上有很大的作用。

2.ModelAndView（String viewName）

带一个页面名称的构造函数，此时返回到“prefix/viewName+.suffix”页面，例如return new ModelAndView（"show"）；这样将会跳转到show.jsp页面，Spring 2.0以后版本提供了addObject（Object obj）方法来给ModelAndView添加值，如：

3.ModelAndView（View view）

带一个View参数的构造函数，只返回一个视图页面，例如：return new ModelAnd View（new InternalResourceView（"/WEB-INF/web/show.jsp"））将会返回/WEB-INF/web下的show.jsp页面，这里就不需要配置ViewResolver了。

4.ModelAndView（String viewName, Map model）

构造参数为返回：页面+mpa，返回一个“prefix/viewName+.suffix”视图，并将map值显示到页面，例如：

5.ModelAndView（View view, Map model）

构造参数为View+Map，返回一个视图，并将Map值显示在视图上，例如：

return new ModelAndView（new InternalResourceView（"/WEB-INF/web/show. jsp"），map）将返回/WEB-INF/web下的show.jsp页面，同时会将map中的数据返回到视图，由于此时直接使用了new InternalResourceView（），所以就不再需要配置ViewResolver了。

6.ModelAndView（String viewName, String modelName, Object modelObject）

构造参数为viewName+modelName+medelObject，此时将返回“prefix/viewName+.suffix”视图，同时将modelObject对象封装到modelName标签中，在页面直接引用modelName就相当于modelObject对象了，例如：

这里将userName字符串封装到userName标签中，并且返回page视图，同时在page视图中直接引用${userName}就可以引用userName值了。

7.ModelAndView（View view, String modelName, Object modelObject）

构造参数为view+modelName+modelObject，返回一个view视图，同时将model Object对象封装到modelName标签中，在页面直接引用modelName就相当于model Object对象了，例如：

## 5.4 View

Spring MVC中的层次十分明显，Model层就是实体对象层，View是一个视图类，Spring的View没有任何限制，它支持所有的视图，包括JSP、servlet、JSTL、Velocity、FreeMaker和Tiles等，而且可以自己定义任意的视图，View接口的源码如下：

View接口有两种方法，第一种是获取视图的ContentType，这个在Web页面文件中经常能看到，也就是服务器响应的http内容类型，第二种方法render（）用来合成视图，Spring的Controller将相关的值封装到一个Map中传递给View，接着View调用render（）方法来合成视图，在Spring中有一个View的实现类AbstractView, AbstractView是所有视图类的父类，AbstractView部分代码如下：

这里可以看到render（）方法中获取attributes和requestContextAttribute中的值后转到renderMergedOutputModel（）方法中进行页面的合成，在AbstractView类的实现类中只需要重新使用renderMergedOutputModel（）方法即完成了页面的合成，AbstractView有一个实现类AbstractUrlBasedView, AbstractUrlBasedView是一个URL处理类，根据URL来完成页面的合成，Spring的层次性非常强，这样在程序阅读方面可能会有些难度，但是大大降低了程序的耦合度和复杂度，Spring的视图处理类，例如，InternalResource View、JstlView和VelocityView等都是AbstractUrlBasedView的继承类，不过对于模板语言Spring在AbstractUrlBasedView和模板视图处理类中间又增加了一个Abstract TemplateView，根据模板视图处理类，当控制器返回一个ModelAndView的时候，可以直接使用“new”操作符来建立一个视图对象，由于一个系统会有很多返回ModelAndView，所以Spring又提供了一致的配置来解决过多的视图新建，在配置文件中指定一个ViewResolver来控制当前系统视图的选择，例如前面的：

viewClass配置为InternalResourceView表示采用的是Servlet/JSP作为视图，此时就可以在页面中使用JSP的标签，而InternalResourceViewResolver的viewClass默认就是InternalResourceView，所以如果使用JSP和Servlet视图就不用再配置viewClass了。假如这里要使用JSTL作为视图，则只需要将“InternalResourceViewResolver”的“viewClass”修改成“org.springframework.web.servlet.view.JstlView”就可以了，这个时候就可以在页面中使用“JSTL”标签进行引用了。

## 5.5 Controller

org. springframework.web.servlet.mvc.Controller是Spring控制器的最底层接口，该接口的代码如下：

在编写控制器的时候可以直接继承Controller来重写handleRequest方法，同时Spring中提供了很多Controller接口的实现类，根据不同的需要可以选择不同的Controller，这一节针对一些常用的Controller进行详细的介绍。

### 5.5.1 AbstractController

AbstractController是Controller的一个实现类，同时该类又继承了WebContent Generator，提供了Session缓存与同步化的处理（sysnchronized），使用Abstract Controller的时候只需要继承该类，重写handleRequestInternal（）方法即可，代码如下：

注意到这里有一个构造函数，在该构造函数中调用了父类的几个方法，第一个方法表示MyController只接受POST请求，如果遇到“GET”等其他请求时就会抛出一个org.springframework.web.servlet.support.RequestMethodNotSupportedException异常，这里常用在数据提交保护上，限制用户必须使用“POST”方法来提交数据，第二个方法表示该Controller会检查Session并尝试获取session，第三个方法表示该Controller实现同步化，也就是说，该Controller的一个请求必须执行完毕后才能执行其他的请求。

### 5.5.2 BaseCommandController、AbstractCommandController

前面在5.4.1节中MVC实例中自定义的控制器是如下定义的。

这里是通过request.getParameter（）来获取参数值的，如果一个表单中有很多个参数值，那么就需要使用一系列的reuqest.getParameter（）来获取，这样就显得十分麻烦，Spring为了解决这个问题，提供了BaseCommandController来根据获取的字段和实体Bean进行对照封装，如果request中有与Bean中字段相同的参数，则自动将request封装成一个实体类，这样就不用再使用request.getParameter（）来获取相关数据了，Abstract CommandController是BaseCommandController的一个子类，使用起来更加简单，这里以一个实例来讲解BaseCommandController及AbstractCommandController的使用。

首先建立一个User实体类，代码如下：

接着定义一个UserBaseCommandController，该类继承BaseCommandController，代码如下：

UserBaseCommandController首先使用构造函数完成CommandClass的注入，this.setCommandClass（User.class）表示request中的参数将会与User类中setter方法对比（也就是setxxx方法），然后重写了handleRequestInternal（）方法，第一步将新建一个User对象，然后使用bindAndValidate（）方法绑定request和user对象，也就是将request中的参数绑定到User对象中，这里要注意的是User中必须有setter方法的字段才能进行绑定。

完成UserBaseCommandController后，再写一个配置文件，代码如下：

配置一下web.xml（这里不再重复代码，与5.1节中的相同），建立一个页面index.jsp，代码如下：

写一个结果显示页面show.jsp，代码如下：

启动tomcat，在浏览器中打开该项目的首页，然后输入数据，单击【提交】按钮，就会转入show.jsp，可以看到相关数据的显示，如图5-15所示。

图5-15 BaseCommandController实例运行结果

改用AbstractCommandController，首先定义UserAbstractCommandController类继承AbstractorCommandController代码如下：

这里需要重写handle（）方法，该方法中的command参数是经过处理过的对象，也就是构造函数中的CommandClass，这里就是User.class，然后配置成一个Bean，同时修改一下SimpleUrlHandlerMapping，运行结果与BaseCommandController相同，这里省略了同样的代码，具体可以查看配套光盘中的CommandController项目。使用BaseCommandController或者AbstractCommandController，可以使用setValidator（）方法来设置验证器，这样就可以对数据进行一定的规则验证，关于验证器在5.7节中将进行详细的介绍。

### 5.5.3 SimpleFormController

SimpleFormController是对表单数据的封装，实现SimpleFormController的任何Controller都不再需要使用request.getParameter（）来获取参数了，不过要遵守一个约定，就是页面表单的名称要与实体Bean中的相同。下面以一个具体的示例按以下步骤来讲解SimpleFormController的使用。

（1）建立一个User类，这里使用5.4.2节中的User类，该类中的两个字段名称分别为userName和passWord，使用SimpleFormController时就需要将页面中的表单中的字段名称也定义为userName和passWord。

（2）定义一个index.jsp页面，代码如下：

注意代码中加粗的部分，表单中的字段名称要与实体类中的属性名称一致，这样SimpleFormController就会将这个表单中的数据抓取到一个User实体中。

（3）定义一个SimpleController，该类继承SimpleFormController，代码如下：

SimpleController类重写了SimpleFormController中的onSubmit（）方法，Spring会根据表单传递的form元素封装成一个实体Bean，并作为一个Object传递给onSubmit（）方法，这里的Object就是一个User，直接将obj转换成一个User就可以了，不需要再写一些request.getParameter（）来获取相应的数据了。

（4）配置web.xml，代码如下：

web. xml就是用来定义servlet及该servlet的映射，同时还可以配置启动其他的配置文件。

（5）配置mvc-config.xml，代码如下：

这里的SimpleController是一个SimpleFormController，所以需要给它配置一个“commandClass”属性，该属性表示控制器要将form转换成commandClass指定的实体，这里配置为spring.chapter5.domain.User表示SimpleController控制器会将表单传递过来的数据转换成一个User实体。

（6）建立一个结果显示页面，代码如下：

这个页面将user实体的名称及密码显示出来，最终的工程结构如图5-16所示。

图5-16 SimpleFormController项目结构图

（7）在Eclipse中启动Tomcat，打开IE，输入地址http://localhost：8080/Simple Controller，打开一个窗口，如图5-17所示。

图5-17 使用SimpleFormController控制器页面

输入用户名和密码，单击【提交】按钮将会跳转到结果显示页面，如图5-18所示。

图5-18 SimpleFormController控制器结果显示页面

### 5.5.4 MultiActionController

MultiActionController是多动作处理器，它也是Controller的一个实现类，在编写程序的时候，如果使用Controller接口，则需要给每一个请求都写一个Controller，那么这样就会出现很多的Controller，无论对于开发人员还是服务器的内存消耗都不是件好事，所以Spring提供了MultiActionController，在这个Controller中可以任意写多少个请求的处理，它自己会根据用户的请求来决定执行某个方法，MultiActionController需要配合MethodNameResolver来完成方法的映射，MultiActionController默认的MethodName Resolver是org.springframework.web.servlet.mvc.multiaction.InternalPath MethodName Resolver，使用默认的InternalPathMethodNameResolver会根据请求名称进行方法选择，不推荐使用该方法，这里就不过多介绍了，MultiActionController结合Parameter MethodNameResolver来解决多方法映射是一个非常好的搭配，还是针对一个实例来进行讲解。

（1）建立一个MultiController类，该类继承MultiActionController，代码如下：

该类中定义了insert（）、delete（）、updat（）和find（）这4种方法（这里的方法名称是任意的，方法的返回值、参数均可以任意），4种方法都直接返回了一个ModelAndView：

这个ModelAndView（）的返回表示给第三个字符型串“insert”封装到“method”这个标签中，并返回到page页面，这样在页面中就可以使用${method}来进行引用。

（2）定义一个web.xml文件，代码与前一节中的相同，不再重复代码了。

（3）定义一个mvc-config.xml文件，代码如下：

该配置文件中首先定义一个SimpleUrlHandlerMapping，处理url请求的映射，这里只有一个＜prop key="/multiController.html"＞multiController＜/prop＞，表示如果有multiController.html请求时将会交给multiController控制器处理，接着配置了一个viewResolver，这里表示依然使用JSP和Servlet视图，然后配置了一个ParameterMethod NameResolver，该类主要有两个属性，“paramName”属性表示接受的参数表达方法，这里为“method”就表示接受“multiController.html？method=xxx”这样的请求，“defaultMethodName”属性表示默认的请求属性，也就是“multiController.html”这样没有任何参数的请求，这里设置为“insert”表示当请求为“multiController.html”的请求就相当于“multiController.html？method=insert”；最后配置了一个multiController，指向前面定义的MultiController，给这个MultiActionController注入了一个methodName Resolver，也就是前面定义的paramsMethodResolver，这样一旦multiController处理请求的时候就要集合paramsMethodResolver识别参数。

（4）定义一个show.jsp页面，根据配置文件，将show.jsp放到WEB-INF/web下，show.jsp代码如下：

您执行的是${method}方法

页面中使用了4个form，分别对应不同的action，提交到后台处理后依然返回到show.jsp，回传单击按钮所执行的方法，打开浏览器，输入默认的请求http://localhost：8080/MultiActionController/multiController.html，打开窗口如图5-19所示。

图5-19 MultiActionController默认浏览窗口

单击【delete】按钮将会执行MultiController中的delete方法，结果如图5-20所示。

图5-20 MultiActionController默认浏览窗口

可以看到这里的url出现了“method=delete”，从后台传回了“delete”方法字样，表示后台是执行了delete（）方法。

这里的MultiController类继承了MultiActionController来提供多方法控制器，Spring中的MultiActionController还提供了delegate属性来指定某个类来实现多方法控制器，而该类不再需要继承MultiActionController，可以将上面的MultiController方法去掉继承，方法体中依然是4种方法，代码如下：

这个时候只需要修改配置文件就可以完成多方法控制的功能，配置文件修改如下：

配置文件中依然配置了SimpleUrlHandlerMapping、InternalResourceViewResolver和ParameterMethodNameResolver，接着配置了自定义的MultiController，最后配置了MuliActionController，在这个控制器中指定了方法映射为paramMethodResolver，同时多控制指定委托的对象为MultiController自定义的类，这样配置后运行结果与实现MultiActionController的相同，同时Spring还提供PropertiesMethodNameResolver来实现同样的功能，还是使用没有继承MultiActionController的自定义类MultiController，将配置文件修改为如下即可实现同样的功能。

这里的配置文件在配置SimpleUrlHandlerMapping时使用通配符“*”，这个就是结合PropertiesMethodNameResolver来进行的，接着配置了一个PropertiesMethodName Resolver，只需要配置一个“mappings”属性就可以了，这里也是配置请求列表，由于SimpleUrlHandlerMapping中使用了通配符，所以这里就是使用“multiController.html”结尾的请求均会交给MultiController来处理的，＜prop key="/insertmultiController.html"＞insert＜/prop＞表示一旦请求为“insertmultiController.html”就将要执行对应的控制器中的insert方法。

### 5.5.5 AbstractWizardFormController

AbstractWizardFormController是Spring提供的跨页表单控制器，也是Abstract Controller的一个子类，很多的时候由于表单过多或者表单内容的分类，可能会使用好几个页面来显示表单，等用户填写完毕后一起提交，这样多页之间的数据传递如手动写代码来完成是一件很麻烦而且容易出错的事情，Spring提供了AbstractWizard FormController来轻松地完成这样原本相对艰巨的工作，还是以一个实例按下列步骤完成。

（1）建立一个实体类User，代码如如下：

这里的User有3个属性，每个属性放到一个页面，最终在第三个页面实现提交，这里只是一个演示，在实际注册过程中可能会有很多的字段需要处理，这样才需要使用跨页提交。

（2）建立一个WizardFormController控制器类，该类继承AbstractWizardForm Controller，代码如下：

WizardFormController中首先利用构造函数给父类注入CommandClass，这里是User.class，也就是表单将会转换的实体类，重写processFinish（）方法，processFinish（）方法中的command参数是多页数据集合后转换成的对象实体CommandClass，接着就可以根据视图来选择处理方式了，因为这里是JSP视图，所以还是用一个Map来封装，如果是Velocity视图就直接：

页面中使用${user.userName}等标签就可以获取相关的数据了。

（3）编写web.xml配置文件，还是与前一节的相同，这里不再重复，可以查看光盘中的AbstractWizardFormController项目中的代码。

（4）编写mvc-config.xml，也就是Spring Bean的配置文件，代码如下：

配置文件中主要不同的是配置了一个WizardFormController自定义的跨页控制器类，这里定义了“pages”属性，该属性就是指定多页的名称，控制器在处理的时候按照配置的页面列表顺序进行页面跳转，这里的页面就是user1.jsp、user2.jsp和user3.jsp，并安装该顺序进行页面跳转。

（5）编写user1.jsp、user2.jsp、user3.jsp及结果显示页面show.jsp，代码分别如下：

这里要注意的是填写数据的文本框的名称要与User实体中的相同，这里的就是“userName”，页面跳转的按钮要使用“submit”类型的，因为这个页面跳转是通过后台的跨页控制器进行跳转的，同时页面跳转的按钮名称要遵守“_targer+将要跳转页面的索引”的命名规则，页面的顺序按照配置文件中WizardFormController的“pages”属性中页面的索引（索引从0开始），针对前面的配置文件，则user1.jsp将要跳转到user2.jsp, user2.jsp在“pages”中的索引为1，所以这里名称就为“_targer1”，同理可以编写user2.jsp，代码如下：

user3. jsp代码如下：

这里需要注意的是“完成注册”这个提交按钮，它的名称必须是“_finish”，这个是Spring中的一个约定，启动Tomcat，打开浏览器，输入http://localhost：8080/WizardForm Controller/wizardController.html，打开注册第一页，如图5-21所示。

图5-21 跨页控制器第一个页面

输入相关数据，单击【下一步】按钮，进入注册第二个页面，如图5-22所示。

图5-22 跨页控制器第二个页面

继续输入数据，单击【下一步】按钮进入注册的第三个页面，如图5-23所示。

图5-23 跨页控制器第三个页面

继续输入注册数据，单击【完成注册】按钮，打开结果显示页面，该页中将显示前面三页填写的内容，如图5-24所示。

图5-24 跨页控制器结果显示页面

### 5.5.6 ParameterizableViewController

ParameterizableViewController是AbstractController的子类，该类不需要任何继承，只要配置一个“viewName”属性就可以进行页面的跳转，在5.4.2节中用到了一个index.jsp，当时这个页面直接放到了项目的根目录下，这样造成页面的不安全，在实际应用中应该将所有的页面文件都放到WEB-INF下，由于Index.jsp只是一个静态的页面，如果编写一个Controller就显得比较麻烦了，这个时候就可以使用ParameterizableView Controller了，ParameterizableViewController的源码如下：

可以看到ParameterizableViewController中的handleRequestInternal（）方法直接返回一个ModelAndView，而这个ModelAndView是根据注入的viewName进行构造的，这就说明使用这个类的时候只需要直接给它注入一个viewName就可以返回一个视图了，这个时候没有封装任何数据，一般都用在静态页面的跳转，相当于自己定义一个只有视图返回的方法，在5.4.2节的实例中，将index.jsp复制到WEB-INF/web文件夹下，同时修改mvc-config.xml如下：

这样一旦有indexController.html请求就会交给ParameterizableViewController处理，这里就会返回/WEB-INF/web/index.jsp页面。

## 5.6 拦截器

拦截器就是当接受到URL请求的时候在执行控制器程序之前进行拦截的一段程序，根据拦截程序执行结果来重新定向，例如5.4.5节中用户注册的例子，一旦接受到“wizardController.html”请求，原本是用户注册的页面，现在要求上班期间不能进行用户注册，这时候有两个解决方案，一种是修改源程序进行if（上班了吗？）{……}这样的判断，另一种就是使用一个拦截器来对“wizardController.html”请求进行拦截，在拦截器中判断用户当前是否是上班时间，两种方案都可以实现目的，但是第一种方案给源程序增加了一些逻辑，万一出现新的需求又要修改源码，这种做法是不妥的，最好的解决方案是使用一个拦截器来解决问题，Spring中提供了org.springframework.web.servlet.Handler Interceptor接口来实现拦截器的功能，只要实现该接口，然后装配到HandlerMapping中就形成一个拦截器，拦截器与AOP的前置通知不同，前置通知在执行完通知片段中的代码后只要没有异常抛出都会执行目标对象中的代码，达不到重新定向的功能，而拦截器是拦截URL，根据一定的规则进行URL重新定向。

org. springframework.web.servlet.HandlerInterceptor接口源代码如下：

该接口中有3种方法，preHandler（）方法在URL请求之前执行，根据返回值判断时候继续URL，如果返回true则继续，postHande（）方法在URL所对应的控制器方法执行后DispatcherServlet导向一个View前执行，这里可以给View添加新的数据，afterCompletion（）方法在URL请求过程执行完毕返回View后执行，主要用来释放资源。

这里结合5.4.5节示例讲解拦截器的使用，首先定义一个拦截器类RegHandler Interceptor，该类继承HandlerInterceptor接口，代码如下：

RegHandlerInterceptor拦截器中只写了preHandle（）方法，这里就是对时间进行一个判断，不在规定的时间区域则跳转到一个没有权限的页面，如果URL请求在规定的时间则返回true，继续执行当前的URL也就是用户注册页面，接着修改一下配置文件如下。

配置文件中首先给SimpleUrlHandlerMapping配置了一个拦截器，SimpleUrlHandler Mapping的interceptors属性是一个拦截器组属性，可以使用list来配置多个拦截器，配置文件编写完毕运行5.4.5节中的URL：http://localhost：8080/AbstractWizardForm Controller/wizardController.html，如果服务器时间不再8～17点就会导向noRight.jsp页面，详细的代码请参照光盘中的AbstractWizardFormController实例。

## 5.7 数据绑定

数据绑定是Spring中对表单数据验证规则的一种解决方案，不同的表单数据都存在一定的规则，例如，用户名和密码均不能为空，密码长度大于6等，Spring中结合SimpleFormController提供了＜Spring：bind＞标签进行数据绑定，绑定规则在后台控制器中进行设置，还是以一个实例来讲解数据绑定的使用。

首先定义一个SimpleController控制器，该类继承了SimpleFormContorller，代码如下：

这里要注意的是以下两点。

（1）在setErrorPage（）方法中要设置一个formView, formView是SimpleForm Controller的默认页面，也可以在配置文件中注入formView，如果没有设置该值，那么请求转交到该控制器后就会寻找simpleController.jsp页面。

（2）这里重写的onSubmit（）方法中必须带有一个BindException参数，只要这样才能返回相关的错误信息，这里只做了不为空及长度不小于6的判断，根据判断结果返回不同的视图，errors.reject（String errorCode, String defaultMessage）方法就返回错误的相关提示信息，第一个参数是结合资源文件来获取的，如果不存在资源文件就返回第二个默认的提示信息，关于资源信息的获取可以参照第2章中的2.3.3节，返回ModelAndView时候使用了errors.geModel（），errors.getModel（）将会传相关的错误提示信息。

接着可以编写配置文件，配置文件中就是配置一个HandlerMapping ViewResolver及SimpleController，具体代码可以查看光盘中的SpringBind实例，最后编写一些页面文件，这里有两个页面，一个是表单页面也就是错误提示页，另一个是正确结果显示页面，结果显示页面没有特殊的代码，这里不再重复，表单提交页index.jsp代码如下：

在页面顶部要使用@taglib引入Spring标签库：%@taglib prefix="spring"uri="http://www.springframework.org/tags"%，＜spring：bind＞标签包含在一个＜input/＞前后表示对该字段进行绑定验证，“path”属性表示要绑定对象的名称，这个是结合前面自定义的SimpleController设置的，SimpleFormController中默认的commandName是command，如果在SimpleController中进行如下设置。

则页面中path属性就要设置为“user.xxx”，“user.*”表示绑定表单上的所有数据，“user.userName”表示该userName字段绑定了command中userName属性，这里的command其实就是User对象，status属性封装了绑定对象，status.expression显示的是绑定对象的属性名称，status.value显示被绑定的属性值，这些解释有些抽象，这里将程序进行如下修改以便更加直观地演示这些标签的应用。修改SimpleController如下：

这里对不同的错误做出不同的判断，使用errors.rejectValue（String field, String errorCode, String defaultMessage）返回错误信息，该方法接受3个参数，第一个为绑定的属性名称，第二个为错误信息代码（从资源文件中获取），第三个是默认错误信息（如果没有从资源文件中获取信息则返回默认信息），修改index.jsp代码如下。

这里将不同的错误信息放在相关的字段后进行提示，如果验证不通过则会出现错误提示，如图5-25所示。

图5-25 数据绑定验证错误提示

## 5.8 验证器

前一节中讲述了数据绑定进行验证的方法，在Spring中还提供了一种验证器规则，在前面的5.4.2节的BaseCommandController中提及了验证器的注入，Spring在BaseCommandController中增加了验证器的注入，在BaseCommandController的所有子类中都可以使用setValidators（）来设置相关的验证器，validator接口源码如下：

接口中只有两种方法，supports（Class clazz）方法返回参数中的类是否支持该验证器，如果支持则执行validate（Object target, Errors errors）方法进行验证，validate（Object target, Errors errors）方法的第一个参数target表示一个表单对象，实际上是对应一个实体类，第二个参数errors是对表单验证错误的回传，与数据绑定中的相同，可以使用reject（）和rejectValue（）方法返回相关的错误提示信息，这里以5.6节中的例子为例说明验证器的应用方法，首先定义一个验证器UserValidator，代码如下：

supprots（）方法表示该验证器只对User这个类进行验证，validate（）方法中对User中相关属性进行了验证，页面代码与5.6节中的最终代码相同，不过这里要修改一些配置文件，将验证器装配到SimpleController中，配置如下：

装配验证器后提交数据的时候就会对表单数据进行验证，如果数据不符合验证器规则，则出现错误提示，如图5-26所示。

图5-26 使用验证器验证表单数据

## 5.9 Spring和其他视图技术的整合

Spring MVC在视图技术上采用了面向接口编程，也就是Spring的视图是由一个接口View来完成的，这样在视图的扩展上就是任意的，Spring内部定义JSTL和Velocity等当前主流视图技术的View实现类进行支持，同时也可以根据视图的应用方法进行自定义视图，Spring在合成视图前会检测InternalResourceViewResolver中的viewClass，根据viewClass的配置来选择视图合成的方式。

### 5.9.1 整合JSTL

JSTL是标准的JSP标签库，全称是JSP Standard Tag Library，关于JSTL的标签这里就不进行过多的介绍，可以参考相关的资料。

Spring提供了org.springframework.web.servlet.view.JstlView来完成Jstl视图的合成，只需要将InteralResourceViewResolver中的viewClass属性设置为JstlView就完成视图的设置了，这样在JSP页面中就可以使用JSTL所有的标签，举个例子来说明。

首先建立一个控制器JstlViewController，代码如下：

这里就是一个简单的控制器，在用户提交数据的时候会将user对象返回到page页面，针对控制器及jstl视图编写如下的配置文件。

配置文件给InternalResourceViewResolver配置了viewClass属性为org.springframe work.web.servlet.view.JstlView，这样Spring在合成视图的时候就会自动寻找JstlView来进行页面合成，在编写JSP页面之前需要将jstl.jar和standard.jar添加到classpath中，其中jstl.jar在下载的Spring项目lib/j2ee文件夹下可以找到，standard.jar可以在lib/jakarta-taglibs文件夹下找到，编写jsp文件如下：

这里也可以使用＜spring：bind＞进行数据绑定，Spring的数据绑定和视图没有任何冲突，在任何视图中均可以使用且使用方法基本相同，最后编写一个结果显示页面如下：

这里要在页面中添加标签库的引入＜%@taglib prefix="c"uri="http://java.sun.com/jsp/jstl/core"%＞，接着就可以在页面中使用所有的JSTL标签了。

启动Tomcat，打开浏览器，输入该项目的地址http://localhost：8080/JstlView/jstl.html，打开注册页，如图5-27所示。

图5-27 jstl实例运行首页

在注册页中输入相关的数据，单击【注册】按钮，将结果提交到后台处理并显示到结果页上，如图5-28所示。

图5-28 JSTL结果显示页面

### 5.9.2 整合Velocity

Velocity是一款非常出色的模板语言，同时它还拥有自己的servlet引擎，Velocity是apache的一级子项目，受到广大开发人员的拥护，velocity以其简洁、易用而著称，关于velocity的具体介绍可以参考相关的资料，本书由于篇幅问题不过多重复。

Spring中提供了velocity视图解析器（velocityViewResolver）来指定velocity视图，同时也可以直接使用new VelocityView（）来返回一个velocity视图。

以一个例子来讲解Spring对Velocity的支持，在编写代码前要将velocity-1.5.jar、velocity-dep-1.5.jar添加到classpath中，然后建立一个控制器VelocityController，代码与上一节相同，这里不再重复，可以参看光盘中的VelocityView项目中的Velocity Controller.java，控制编写完毕后就可以写一个配置文件，代码如下：

配置文件中增加了一个velocityConfig，这个是velocity启动的相关选项，resourceL oaderPath属性表示velocity模板所在的位置，velocityProperties是设置velocity的相关属性，这里是为了统一编码防止中文乱码出现，在viewResolver中这里不再是InternalViewResolver了，velocity有自己的解析器，也就是org.springframework.web.servlet.view.velocity.VelocityViewResolver，将这个解析器的viewClass设置为Velocity View就表示在本系统中所有的视图均使用velocity解析器来合成页面。

编写velocity模板页面，show.vm代码如下：

这里使用的就是velocity标签进行数据显示了，同时结合velocity视图技术进行数据绑定的时候，＜spring：bind＞标签应改为#springBind（"command.xxx"），这里给个示例，如在JSP中绑定如下：

在velocity中就显得更加简洁了，不过这里要注意的是status.errorMessage前要加一个“”，这个是velocity的一个标签字符，表示如果status.errorMessage为空就显示。

在整合velocity时候需要注意中文问题，解决中文乱码的方法如下：

（1）统一编码，将Java文件、页面文件和数据库编码均设置为UTF-8（也可以是别的，为了国际化一般使用UTF-8）。

（2）配置VelocityConfigurer的时候增加velocityProperties编码配置。

（3）配置VelocityView的时候配置页面编码。

经过上述3个步骤的配置就可以完全解决Velocity中出现中文乱码的问题了。

### 5.9.3 整合FreeMarker

FreeMarker也是一款非常出名的模板语言，与velocity相比，FreeMaker有更强大的工具类，在页面中可以使用这个工具类进行格式定制，关于FreeMarker的具体使用这里就不再用过多的篇幅介绍，可以参考相关的资料。

Spring的视图层提供了FreeMarkerView来完成FreeMarker视图的合成，具体使用如下实例。

（1）建立FreeMarker模板index.flt。

结果显示页面：show.flt。

（2）编写一个控制器FreeMarkerController，代码与前一节的相同，这里也不再重复。

（3）编写配置文件如下：

配置文件中首先配置一个FreeMarkerConfigurer，该Bean用来配置FreeMarker的相关启动项，这里配置了templateLoaderPath和freemarkerSettings, templateLoaderPath用来配置模板文件的默认存放路径，模板解析器将会根据这个路径进行模板的查找，这里配置为“WEB-INF/web”，表示所有的模板均放在了WEB-INF/web文件夹下，freemarkerSettings属性用来配置freemarker.template.Configuration中的相关启动属性，主要如下。

（1）defaltEncoding：默认的编码，这个要与页面编码统一，否则就会出现页面乱码，这里的页面都是UTF-8，而freemarker的defaultEncoding默认为ISO-8859-1，所以这里设置为UTF-8，这个是中文乱码出现的关键点。

（2）template_update_delay：模板更新间隔时间，freemarker提供了模板自动更新，每间隔一定的时间就重新从原始地址加载一次原始文件，这个属性主要用来设置间隔的时间。

在完成FreeMarker启动项配置后，配置一个viewRsolver，这里的viewResolver要配置为FreeMarkerViewResolver，其viewClass属性要配置为FreeMarkerView, viewResolver的contentType属性用来配置输出模板头文件的编码，这里要结合defaultEncoding一起来配置，统一了编码就可以避免中文输出乱码问题。

Spring的数据绑定标签也可以结合FreeMarker模板使用，不过这里的表达稍微有点不同，原来的＜spring：bind＞改为＜@spring.bind/＞，将上面的index.ftl文件增加数据绑定后如下。

首先要在模板文件头导入spring.ftl，＜#import"/spring.ftl"as spring/＞，在绑定的时候，以前的status.*标签都改成了spring.status.*，这个只是页面的模板引擎的改变而产生一些表达方式的改变，后台使用验证器或者使用SimpleFormController的onSubmit（Object obj, BindException e）方法均相同。

### 5.9.4 整合Tiles

Tiles是一种模板引擎，主要适用于页面的布局，类似于html中的Frame，不过tiles是经过模板引擎编译后任意组合的一种布局模板。

Spring同样提供了TilesView来解析Tiles模板，还是以一个实例来进行讲解Spring结合tiles的应用。

（1）定义tiles模板文件。

tiles是一个布局模板，在使用Tiles之前要将commons-digester.jar、commons-collec tions.jar、commons-beanutils.jar及struts.jar添加到classpath中（前3个jar文件可以在spring/lib/jakarta-commons下找到，struts.jar可以在springg/lib/struts下找到），给出tiles的配置文件，tiles-defs.xml代码如下：

这里首先定义了一个原始模板，名称为“.template”，该模板路径是“/WEB-INF/web/template.jsp”，模板中使用三个tiles标签，分别为head、body和footer，3个标签分别引入3个不同的页面，本实例中共有两个展示页面，名称分别为index和result，使用titles后，展示页面不再是一个存在的页面了，展示页面是根据模板文件而搭配出的页面，这里配置了一个名为“index”的页面，它是继承原始模板的，不过在原始模板的“body”标签处引入的是index.jsp文件，而result展示页面则给原始模板“body”标签处引入的是result.jsp页面，这里使用的几个页面代码分别如下：

tiles技术就是通过一个模板页面将上面这些页面搭配出了两个不同的页面，模板页面代码如下。

模板中使用的标签“head”等要与tiles配置文件中的一致。

（2）定义一个控制器TilesController，这里依然使用SimpleFormController，代码如下：

此处返回的View名称page不再是Spring配置文件中的那个文件名，而是tiles配置文件中名称和page相同的tiles视图。

（3）定义项目配置文件mvc-config.xml，代码如下：

首先定义了TilesConfigurer，该类是Spring中启动Tiles引擎的相关属性配置，这里只配置了一个definitions属性，表示读取Tiles配置文件的路径，这里支持多个文件读取，在配置ViewResolver的时候使用了InternalResourceViewResolver，这个时候要将viewClass配置为TilesView，由于Tiles模板使用的jsp相关路径都在Tiles配置文件中定义了，这里就不要任何配置了，在控制器的配置中page为“result”，此时控制返回view的时候将会在Tiles配置文件中查找一个name为“result”的视图。

启动Tomcat，打开浏览器，输入http://localhost：8080/TilesView/tiles.html，如图5-29所示，最后运行结果如图5-30所示。

图5-29 Tile视图技术实例

图5-30 Tiles视图技术实例提交页面

控制器返回一个View，该View已经是一个合成完毕的视图，也就是说，在定义为result的Tiles视图中任何一个地方均可以使用由Controller返回的相关数据，这个在不少资料中都有错误的说法，这里提醒大家注意。

### 5.9.5 整合自定义View

Spring视图技术是由View接口完成的，所以只要实现该接口就可以为自己的任何视图和Spring进行融合，这里就以Excel为例，由于Spring中提供AbstractExcelView完成了Excel的很多操作，这里就不需要实现View接口类，直接继承AbstractExcelView就可以了。

由于AbstractExcelView使用了POI操作Excel文档，所以在使用AbstractExcelView前要将poi-*.jar添加到classpath中。

首先定义一个ExcelView，继承AbstractExcelView，也就是Excel的视图解析器，代码如下：

ExcelView重新使用了buildExcelDocument（）方法，该方法就是将控制器传递进去的数据Map通过HSSFWorkbook对象写入Excel文档。

接着定义一个控制器ExcelController，代码如下：

该控制器返回的ModelAndView中直接新的一个自定义的视图，并将Map传递给了该视图。

编写配置文件mvc-config.xml如下：

配置文件中只定义了一个SimplrUrlHandlerMapping来处理url请求映射，在定义控制器的时候页面的值用的是全路径/WEB-INF/web/index.jsp，因为这里没有配置解析器来统一前缀和后缀，所以要使用文件全路径，在浏览器中请求excel.html时候将会到index.jsp页面，输入相关数据提交后会提示Excel文档的生成，保存后可以看到表单内容已经保存到Excel文档中了，这个应用也可以用在表格生成Excel文档上。

启动Tomcat，打开浏览器，输入该项目的地址http://localhost：8080/ExcelView/excel.html，打开首页，如图5-31所示，结果如图5-32所示。

图5-31 自定义View实例

图5-32 自定义View提示保存Excel

系统提示保存Excel文档，单击【保存】按钮，将文档保存到本地，打开如图5-33所示的窗口，可以看到文档中的数据和录入的一样。

图5-33 Excel文档中保存表单数据

## 5.10 本地化支持

Spring提供了一系列的标签，通过获取资源文件，然后根据不同的Locale来使用不同的语种，结合2.3.3节资源读取可以完成Web国际化的功能，本节以一个实例进行演示。

（1）编写资源文件：message_zh_CN.properties，直接放到src目录下，内容如下：

编写message_zh_CN.properties文件的时候要用记事本编写，保存为message_zh_CN.properties，保存的时候编码选择ANSI就可以了，注意不要保存为UTF-8类型。编写完资源文件后，用native2ascii进行转码，将转码后的内容复制到message_zh_CN.properties中，接着编写一个英文的资源文件message_en_US.properties，内容如下：

（2）编写一个控制LocaleController，代码如下：

这个控制器只有一个简单的导向，直接返回一个Page视图，并将user传递给视图。（3）编写一个验证器UserValidator。

该验证器对用户名和密码进行了简单的验证，错误信息返回errors.rejectValue（String field, String code），这里根据资源文件来获取错误提示，errors.rejectValue（"userName"，"nousername"）就表示返回到绑定userName的表单，并且从资源文件中获取nousrname的错误代码。

（4）编写配置文件mvc-config.xml，代码如下：

配置文件中首先定义了messageSource，使用ResourceBundleMessageSource来自动读取messages_*.properties资源文件，然后定义了localeResolver，使用AcceptHeader LocaleResolver自动获取本地浏览器的locale，根据locale的不同进行资源文件的读取。

（5）编写页面文件，分别如下：

＜/html＞在该页面中仍然是使用＜spring：bind＞标签进行绑定表单，在文字显示的时候使用了＜spring：message＞标签进行资源读取，这里＜spring：message code="submit"＞表示该按钮的value属性将从资源文件中获取代码为“submit”的信息，如果locale是zh_cn则显示“提交”，locale为“en_us”则显示“submit”，同理编写show.jsp。

show. jsp中使用＜spring：message＞根据locale获取了相关的信息，详细代码参看光盘中的SpringLocale项目。

将IE的Locale设置为（通过Internet选项→语言来设置）zh-cn时，运行结果如图5-34所示，提交结果如图5-35所示。

图5-34 Locale为zh-cn时运行结果

图5-35 Locale为zh-cn提交结果

当IE的Locale设置为en-us时候，运行结果如图5-36所示，提交结果如图5-37所示。

图5-36 Locale为en-us时运行结果

图5-37 Locale为en-us提交结果

## 5.11 小结

本章详细地讲述了Spring MVC框架的运用，并针对Spring MVC框架中各种控制器的实际运用进行了实例讲解，最后以多个实例讲述了Spring MVC和几种当前主流视图技术的整合，通过本章的学习，读者可以熟练地掌握Spring MVC的使用方法及使用技巧，通过本章实例的学习，读者可以在自己实践中熟练地运用Spring MVC框架结合IOC、AOP进行Web程序构建，在下一章中将学习Spring和其他框架的结合使用。

# 第6章 与其他Web框架的整合

Spring是一个综合性的框架，它拥有非常多的功能，而且每个功能都是相对独立的，程序员可以选择任意自己喜欢的框架来结合Spring进行整合编码，本章中重点介绍当前流行的和笔者认为比较好的框架结合Spring进行系统构建，本章的主要内容如下。

●Spring和Struts2的整合

●Spring和JSF的整合

●Spring和EasyJWeb的整合

## 6.1 整合Struts

Struts是一个非常优秀的MVC框架，它是由Craig McClanahan在2000年3月份发起的项目，目前是Java Web开发中最主流的MVC框架，这一节中将详细介绍Spring结合Struts进行项目开发。

### 6.1.1 Struts介绍

Struts是一个Web框架，也是目前最流行最成熟的MVC框架，Spring虽然也提供了自己的MVC框架，但是介于Struts的应用十分广泛，Spring也内置了对Struts的完美支持，在系统构建的时候可以使用Spring的IOC和AOP等任意功能结合Struts进行编码。

Struts目前是apache的一级子项目，可以到http://struts.apache.org中下载Struts的源码文件及jar文件，如图6-1所示。截止到本文撰写Struts的最高版本是2.0.11，由于篇幅关系这里就不详细介绍关于Struts的下载了，本文以最新的struts 2.0.11为例，结合Spring进行讲解。

图6-1 Struts下载页面

### 6.1.2 一个Struts的例子

Struts2是struts1.*和webwork合并以后的MVC框架，与Struts1.*有着很大的区别，关于Struts2的详细使用这里就不占用篇幅进行讲解了，读者可以参考相关资料。

在进行实例之前首先将以下的jar文件（均可在struts/lib下找到）导入到新建的tomcat工程中。

由于struts中的标签系统比较繁杂，对于初学者可能会有很多的不理解，本实例采用JSTL标签，所以还要将jstl.jar和standard.jar添加到classpath中。

添加完需要的jar文件后，按下列步骤来完成第一个Struts2的实例。

（1）配置web.xml文件，代码如下：

Struts2的web.xml不再需要声明serlvet了，直接配置一个filter即可，该配置首先定义了一个filter名称为struts，这个名称是任意的，filter-class指向org.apache.struts2.dispatcher.FilterDispatcher，就是说所有的请求都将交给FilterDispather来处理，filter-mapping首先制定filter-name，也就是前面定义过的filter, url-pattern为/*表示任意的请求均交给该filter来处理，这里与Spring相同，可以任意定义，如果系统中有其他静态页面，最好定义为*.do等，这样.html的请求就不会转交给Struts来处理，也减轻了struts的负荷。

（2）建立一个实体类User，代码如下：

User类中只有两个属性，一个为用户名，另一个是用户密码，在struts2中也可以直接将实体属性写在Action中，不过多了层次的清楚以及系统的重用，建议将实体类独立出来。

（3）建立一个UserAction，按struts2的约定，该action继承ActionSupport，代码如下：

在UserAction中重写了ActionSupport方法，这里Action中有一个User属性，该属性对应一个表单，也就是说，表单中字段名称只要为“user.”+user的属性如user.userName，在执行UserAction的时候就会自定给表单转换成一个User, return SUCCESS是Struts2的一个标志，一旦serlvet接受到SUCCESS的标志就转向定义的页面。

（4）建立jsp页面，代码分别如下：

该页面中的form对应了User实体，所以这里的字段名称为user.userName及user.passWord，与User实体的属性对应起来。

该页面中使用了JSTL标签，所以在页面顶部需要引入JSTL标签库。

（5）配置struts.xml, Struts2中需要定义名称为struts.xml的文件，该文件直接放在src目录下，内容如下：

＜constant＞是用来设置struts启动的常量属性的，struts.enable.Dynamic MethodI nvocation表示启动动态方法调用，struts.devMode表示当前为struts开发模式，还有其他更多的常量配置，可以Struts2的说明文档。常量的配置也可以在src目录下建立一个struts.properties文件来进行配置，如建立一个struts.properties文件，内容如下：

＜include fil0065="/＞标签表示引入新的配置文件，该标签主要用来层次化配置文件，如果一个系统有很多的action，那么就会有很多的配置文件，使用＜include file=""/＞可以将多个xml文件连接成一个整体，这样配置起来就不会显得十分的臃肿，并且维护起来非常的方便，这里使用＜include file="user.xml"/＞导入了user.xml文件。

（6）编写user.xml文件，该文件也直接放到src下，代码如下：

＜package＞表示一个包，是一个集成，package的名称必须是唯一的package可以扩展，当一个package扩展自另一个package时，该package会在本身配置的基础上加入扩展的package的配置，父package必须在子package前配置，name属性表示package名称extends指定继承的父package名称，abstract属性设置package的属性为抽象的，抽象的package不能定义action，配置方法为abstract="true或者false"，namespace：定义package命名空间该命名空间影响到url的地址，如namespace="/demo"，如果原来该action的访问地址为/UserAction.action，设置命名空间/demo/UserAction.action，＜action＞对应一个action, action的name属性就是url请求的方式，name="UserAction"，则UserAction.*的请求都交给该Action来处理，＜result＞用来配置有SUCCESS标志的返回页面。整个项目详情请参看光盘中的FirstStrutsProject，项目结构如图6-2所示。

图6-2 FirstStrutsProject项目结构图

（7）启动tomcat，在浏览器中输入http://localhost：8080/FirstStrutsProject/打开首页，输入用户名和密码，提交后转到显示页面，结果如图6-3和图6-4所示。

图6-3 第一个Struts2运行结果

图6-4 第一个Struts实例提交结果

### 6.1.3 一个Struts整合Spring的例子

在Struts 2以前，Spring提供了一个plug来整合Struts，这样的实例在很多资料上都有详细的讲解，这里就不再重复，Struts 2以后，提供了struts 2-spring-plugin-*.jar来完成与Spring的整合，本节以一个实例来详细地讲解struts2和Spring的整合。

首先将以下的jar文件添加到项目的classpath中。

页面文件中依然使用JSTL，所以还要将jstl.jar和standard.jar添加到classpath中，接着按下面的步骤来完成Spring整合Struts。

（1）建立实体类User，代码如下：

（2）建立一个UserAction，该类继承ActionSupport，代码如下：

该action对应一个表单，其中有一个User变量，这时表单字段只要为user.userName和user.passWord，表单在提交的时候就会自动封装成一个User对象，同时在action中也可以直接增加字段，这样就不需要User类了，代码改写如下：

这样则要求表单中的字段名称为userName和passWord，那么表单在提交的时候就会将名称相同的数据封装到action中的两个字段中。

（3）编写web.xml，由于要引入Spring来管理Bean，这时就要使用Context LoaderListener, web.xml代码最终配置如下：

在web.xml中指定了Spring配置文件名为mvc-config.xml，并且该文件在WEB-INF下，也就是与web.xml在同一目录，如果要将Spring的配置文件放到src目录下，则需要这样指定：

这样表示mvc-config.xml在src目录下，同时要在配置文件中注册一个Spring的监听器ContextLoaderListener，这样struts的FilterDispatcher就能寻找到Spring中的Bean。

（4）编写Spring的配置文件mvc-config.xml，代码如下：

在配置Bean的时候需要将Bean装配模式配置为自动装配，就是每个＜bean＞配置一个autowire="autodetect"，配置的小技巧就是将＜beans＞层配置一个default-autowire="autodetect"，这样就表示所有＜beans＞内部的＜bean＞装配模式均为自动装配，配置文件中的Bean的id就是在struts文件中引入的class。

（5）编写struts配置文件。

首先在src目录下编写一个struts.xml文件，该文件通常用来配置struts启动常量及多个struts配置文件的引入，代码如下：

在配置文件中增加了一个启动常量struts.objectFactory，该配置就表示struts配置文件中的所有class都交给Spring来管理，可以对所有struts使用的class进行Spring的AOP、事务和拦截等处理。

编写user.xml，代码如下：

user. xml与6.1.2节中唯一不同就是这里的class为“userAction”，而6.1.2节中的class为“spring.chapter6.struts.action.UserAction”，这里的class是指向Spring配置文件中id为userAction的Bean，也就是调用了Spring配置文件中的Bean。

（6）编写页面index.jsp和show.jsp，限于篇幅这里不展示代码了，可以参看光盘中的SpringStruts实例。

（7）启动tomcat，在浏览器中输入http://localhost：8080/SpringStruts，打开注册页面，如图6-5所示。

图6-5 Spring整合Struts实例运行界面

输入相关数据，单击【提交】按钮，则转到结果显示页，如图6-6所示。

图6-6 Spring整合Struts2实例提交结果

到这里为止，大家对Spring整合Struts 2的流程应该熟悉了，但是应该还存在一个疑问：Spring整合Struts，也就是Struts控制器的class是从Spring中获取的，这个与直接在struts中指定class有什么区别呢？

下面再演示一个例子，在这个例子中就会感觉到为什么要使用Spring整合Struts 2了。

Spring整合Struts 2，也就是将struts需要的流程控制器对应的类交给了Spring来管理，而Spring就可以使用它内置的IOC和AOP等其他任意的功能对该类进行处理，Struts调用的是经过Spring处理以后的类，这样就可以完成很多Struts不能够完成的事情。

该例子使用Spring的IOC来给action注入相关服务，同时使用Spring的AOP来记录用户登录的情况，按下面的步骤进行设计。

（1）编写web.xml及User类，这里不再重复，与前面的相同，具体参考光盘中的SpringStruts 2项目。

（2）因为Spring中的AOP是基于代理思想来设计的，每个需要进行AOP设计的类都需要有一个上级接口，通过调用该接口来完成AOP。设计组件接口IUserDAO，代码如下：

该接口中只有一个方法submit（）。

（3）编写接口的实现UserService，代码如下：

可以看到UserSerivce就是将传递的字符转换成大写然后重新返回。

（4）编写UserAction，也就是处理流程的控制器，代码如下：

该控制器中在返回视图之前将用户名转换成大写，然后重新赋值给User，这样在页面看到的将是用户名的大写，这里要注意在action中调用的是IUserDAO接口，因为AOP只有接口调用才能产生作用，这里不能写成UserService，而在配置文件中要使用IOC来注入IUserDAO的实现类UserService。

（5）编写Struts配置文件，这里要定义struts.xml及user.xml，代码与本节前面的例子相同，限于篇幅这里不再重复。

（6）编写记录用户登录情况的后置AOP代码，代码如下：

这里记录用户登录情况只是在控制台进行了输出，实际应用中可以保存到数据库中，注意在导入包的时候要选择Spring的AOP（Struts2也提供了AOP包）。

（7）编写Spring的配置文件mvc-config.xml，代码如下：

在配置文件中首先设定了自动代理，然后配置Struts的Action，将action注入了userService。

（8）启动tomcat，在浏览器中输入http://localhost：8080/SpringStruts2打开注册页面，如图6-7所示。

图6-7 Spring整合Struts2实例2

输入数据，单击【提交】按钮，在页面显示中用户名会变成大写，如图6-8所示。

图6-8 Spring整合Struts2实例2提交结果

同时在EclipseIDE的控制台会看到用户登录结果的记录，如图6-9所示。

图6-9 Spring整合Struts2实例2控制台信息

这个实例也是Spring整合Struts，这里就运用了Spring的IOC和AOP特性，当Struts2将类管理交给Spring以后，就可以完全按照Spring自己的方式来管理Bean，可以进行注入、通知、引介和事务支持等，这也就是Struts和Spring整合的必要性。

## 6.2 整合JSF

Spring的主要特征IOC和AOP等可以和任意框架整合，可以满足不同框架的不同需要，同时也弥补了很多框架很难实现的功能，使J2EE变得简单很多。

### 6.2.1 JSF介绍

JSF即JavaServer Faces，是JCP（Java Commnunity Process）提出的一个Java技术标准，目前主要提供Web技术的view层及UI组件，并且提供类似桌面开发的开发模型，这样对于习惯了桌面开发的程序员能够很快地适应Web开发，本节主要讲解Spring和JSF的整合，对于JSF的使用细节就不过多讲述。

登录Java官方网站就可以下载JSF最新版本，http://java.sun.com/j2ee/javaserverfaces/download.html，如图6-10所示。

图6-10 JSF下载页

与其他MVC框架相比，JSF更注重于流程的设计，不需要编写太多的action，通过配置文件来确定页面的流程，这个可能就是JSF在Web设计受到青睐的很大原因。

JSF最新版本是1.2，而对于在开发中使用最多的Tomcat5.*，JSF 1.2还不能直接在Tomcat5.*容器中运行，所以本章还是使用JSF 1.1版本，如果要使用JSF 1.2，可以使用GlassFish来运行，也可以在Tomcat6.*中进行。

### 6.2.2 第一个JSF实例

JSF也是一个标准的MVC框架，通过一个Servlet来处理所有的请求，在进行JSF编程之前需要将以下的jar文件添加到项目的classpath中。

以上jar文件均可以在光盘中JSFProject实例中WEB-INF/lib文件夹下找到。

首先建立一个实体类User，代码如下：

配置web.xml文件，定义servlet及请求的映射。web.xml代码如下：

web. xml文件定义了javax.faces.webapp.FacesServlet这个servlet，且所有*.faces的请求均由该servlet来处理。

JSF是一个注重流程处理的MVC框架，在JSF中需要定义一个faces-config.xml，该配置文件用来配置页面的导向，在本实例中faces-config.xml配置如下：

在faces-config.xml中，＜faces-config＞是最外层的标签，＜navigation-rule＞表示页面的流程规则，每个＜navigation-rule＞中有一个＜from-view-id＞，可以有多个＜navigation-case＞，表示在＜from-view-id＞中定义的页面中一旦有＜from-outcome＞定义的请求就导向＜to-view-id＞页面，这里表示在/web/index.jsp中一旦有login的请求（表单的action为login）就导向/web/show.jsp页面。

＜managed-bean＞用来管理实体Bean对象，这里管理的Bean结合JSF的标签库来运用，在实例中定义了一个名称为user的Bean，它指向的是spring.chapter6.jsf.domain.User，且Bean存活期为“session”，这样在页面中就可以使用user.userName来引用Bean的属性。

定义两个页面，代码分别如下：

这里在页面中使用了JSF的“core”和“html”标签库，在JSF中＜f：view＞是所有组件的根组件，所有其他的标签均包含在＜f：view＞中，＜h：form＞表示一个表单，＜h：inputText/＞表示一个文本框，它的值对应名称为user的Bean的userName属性，＜h：inputSecret/＞表示一个密码框，它的值对应名称为user的Bean的passWord属性，＜h：commandButton/＞表示一个按钮，action="login"与faces-config.xml中的＜from-outcome＞对应，这里表示提交后将会转到web/show.jsp页面，show.jsp页面代码如下：

show. jsp页面中使用JSTL标签来显示，这里要注意的是标签要结合JSF的outputText来使用，不能直接用JSTL标签来显示数据，因为JSF中没有将相关数据封装到response中，项目最终结构如图6-11所示。

图6-11 JSF实例项目结构图

这里要注意的是faces-config.xml放到web.xml同一个目录中，同时在本实例中所有的页面都放到项目根目录下的Web文件夹下，不要放到WEB-INF下。

运行项目如图6-12所示。

图6-12 JSF实例运行界面

填写相关数据，提交转到show.jsp页面中，这里没有任何的后台处理，在show.jsp中直接将User相关数据显示出来了，如图6-13所示。

图6-13 JSF实例提交页面

### 6.2.3 一个JSF整合Spring的例子

JSF本身有一个＜managed-bean＞来管理相关的Bean，但是在JSF中Bean的管理功能十分有限，在很多的时候还是需要使用Spring的IOC来管理Bean，同时在事务等其他方面使用Spring进行处理会给编程带来很大的便利，还是以一个实例来讲解Spring和JSF的整合。

首先还是定义一个实体Bean，这里还是User，代码如下：

User类中增加了一个性别，新建一个性别类，代码如下：

性别类只有一个属性，这里只是一个简单的演示，在实际应用中可能不会这么做。

编写web.xml定义servlet, web.xml代码如下：

web. xml文件通过contextLoaderListener来引入Spring配置的Bean, JSF在调用Bean应用的时候，首先从JSF的配置文件faces-config.xml中查找，如果找不到通过Listener的引入就会从Spring的Context中查找Bean。

定义faces-config.xml，该文件放在web.xml同目录下，代码如下：

在faces-config.xml文件中增加了一个DelegatingVariableResolver，没有任何Bean的定义，就是因为在web.xml中使用了listener来引入Spring的配置文件，这样就将所有的Bean转交给Spring来进行管理了，JSF在查找Bean的时候会首先从faces-config.xml配置文件中来寻找定义的Bean，如果没有则通过DelegatingVaribaleResolver来寻找Spring中配置的Bean，编写Spring的配置文件mvc-config.xml，由于在web.xml中引入mvc-config.xml是从WEB-INF下读取的，所以这里将mvc-config.xml放到WEB-INF下，也就是与web.xml在同一目录，代码如下：

这是一个标准的Spring配置文件，定义了两个Bean0，并且将User类注入了Sex实体，这个是JSF自身Bean管理做不到的，这两个Bean的应用就相当于JSF中的＜managed-bean＞，如下定义两个页面文件。

这里直接引用了user.*和sex.*，也就是对Spring中定义的两个Bean进行了应用，相当于JSF用＜managed-bean＞标签定义的Bean，提交页面定义如下：

这里依然使用的是JSF结合JSTL的输出标签，实例详细代码及结构参考光盘中的SpringJSF实例，运行结果如图6-14所示，提交结果如图6-15所示。

图6-14 Spring整合JSF实例

图6-15 Spring整合JSF实例提交结果显示

Spring和JSF整合，实际上就是在web.xml配置文件中定义一个Spring的Context LoaderListener来引入Spring配置文件，也就是JSF将Bean管理交给了Spring，而JSF只管页面流程的配置。

## 6.3 整合EasyJWeb

EasyJWeb是一个国产的MVC框架，它对Spring有着非常好的支持，提供了一个SpringContainer来传递Bean，在EasyJWeb配置文件中添加一个SpringContainer来引入XmlWebApplicationContext，这样就将Bean的管理工作都交给了Spring，在action层中就可以使用EasyJWeb来进行程序的编写。

### 6.3.1 EasyJWeb介绍

EasyJWeb是一个国人开源团队EasyJF组织开发的MVC框架，由于其完由全国人开发，所以在很多地方适合本地程序员开发，目前最高版本是1.0M3版本，这里不再重复EasyJWeb介绍，详情参考官方网站：http://www.easyjf.com，如图6-16所示。

图6-16 EasyJWeb下载界面

### 6.3.2 第一个EasyJWeb实例

EasyJWeb也是驱动请求的MVC框架，它有自身的IOC和AOP，当然功能上与Spring相比存在很大的差别，在使用EasyJWeb进行Web开发的时候，在Bean的管理及事务支持等方面还是使用Spring比较好。

在使用EasyJWeb开发前要将以下jar文件添加到classpath中。

首先还是定义一个实体类User，代码如下：

定义一个action，在EasyJWeb中，action可以继承AbstractCmdAction，也可以继承AbstractPageAction，可以根据自己的喜好，关于它们的区别这里不多重复，有兴趣的读者可以参考EasyJWeb相关文档，UserAction代码如下：

AbstractCmdAction默认执行的方法是doInit（），当请求是user.ejf时调用默认方法，请求是uesr.ejf？cmd=show时调用show（）方法，这个是EasyJWeb中的一种命名约束，UserAction中定义了两个方法，第一个直接打开一个页面index.html，在EasyJWeb中页面默认的路径是WEB-INF/views/，执行doshow（）方法后，有一个form.toPo（user），这里就是将表单对象转换成实体类，这里与Spring的SimpleFormController中的command相同，表单字段名称要与实体类属性相同。

接着编写web.xml，定义servlet及相关配置文件的读取，代码如下：

首先定义了＜context-param＞来读取指定的EasyJWeb配置文件，这里为/WEB-INF/下的mvc.xml，然后指定了servlet，在最后指定了一个Filter, Filter用来统一编码，对所有的中文均采用UTF-8格式来防止中文乱码的出现。

编写EasyJWeb的配置文件mvc.xml，代码如下：

EasyJWeb的配置文件也是基于schema的，最外层使用＜easyjf-web＞标签，＜modules＞标签表示所有应用模块，＜module＞表示单个应用模块，每一个＜module＞对应一个action，＜module＞中的name属性用来标识该模块，在程序中可以使用module.findPage（模块名）来导向模块页面，path属性表示请求的方式，“path="/user"”表示请求为user.ejf的时候交给action指定的程序来处理，这里表示每当user.ejf的请求都交给UserAction来处理。

index. html代码及show.html代码如下：

表单的字段名为userName和passWord，与User实例类中的属性相同，这样再调用form.toPo（）就直接将表单转换成User对象了。

代码中使用了velocity标签，velocity标签是EasyJWeb默认的标签，在使用EasyJWeb的过程中也可以使用freemarker等其他标签，使用方法可以参考官方网站的介绍，这里不多重复。

启动tomcat，在浏览器中输入http://localhost：8080/FirstEasyJWebProject/uesr.ejf，打开注册页，如图6-17所示。

图6-17 第一个EasyJWeb实例

输入相关数据，提交后转到显示页面，如图6-18所示。

图6-18 第一个EasyJWeb实例提交结果

### 6.3.3 一个Spring整合EasyJWeb的例子

Spring得以广泛应用主要是由于它支持IOC及AOP，给编程过程中带来了非常大的方便，EasyJWeb在使用中也不例外，虽然EasyJWeb有自己的一套IOC，但是与Spring相比还是有很大的差别，不过EasyJWeb提供了一个内置容器来兼容Spring，通过这个内置容器EasyJWeb就可以将Bean的管理完全交给Spring，这样就可以使用Spring的所有特性，达到程序简易化的目的。

在进行Spring整合EasyJWeb前将以下jar文件添加到classpath中。

首先定义一个实体类User，代码如下：

User中有3个属性，用户名userName、密码passWord和性别sex，其中性别是一个新的实体，代码如下：

性别类可以存在数据库中，这里直接从配置文件中注入。

编写UserAction，该action继承AbstractCmdAction，代码如下：

action中有两种方法，初始化方法doInit（）直接打开index.html页面，表示当请求为“user.ejf”时候打开index.html页面，doShow（）方法封装表单对象到WebForm中，并导向新的页面show.html，这样就可以在show.html中使用velocity标签来显示数据了，这里@Inject标签是easyjweb自身的标签，easyjweb将会自动从配置文件中来获取相同类型的Bean并注入到UserAction中。

Web配置文件web.xml代码如下：

配置文件中首先指定了easyjwebConfigLocation来获取EasyJWeb配置文件，这里指定EasyJWeb配置文件为WEB-INF/mvc.xml，然后指定所有“.ejf”后缀的请求均交给ActionServlet来处理，最后还是指定了一个Filter来统一编码。

接着编写EasyJWeb的配置文件，EasyJWeb的配置文件只用来配置action，其他所有的Bean都交给Spring来管理，mvc.xml代码如下：

配置文件中首先使用Spring的XmlWebApplicationContext来读取Spring的Bean配置文件，支持多个文件导入，配置文件中的bean-config.xml就是Spring的配置文件，接着使用EasyJWeb的SpringContainer来引入XmlWebApplicationContext，这样就可以在EasyJWeb中任意使用Spring配置的Bean，@Inject标签就会从Spring的配置中来查找Bean并注入到action中。在＜modules＞中只配置了一个＜module＞，每一个＜module＞对应一个action，这里只有UserAction，表示当请求为“user.ejf”的时候servlet将会转交给UserAction来处理。

编写Spring配置文件bean-config.xml代码如下：

该配置文件中配置了User及Sex类，这里直接给Sex注入了一个性别“男”，并且将Sex注入到User类中，这样结合EasyJWeb的@Inject标签就可以自动将User注入到Action中。

编写页面文件index.html和show.html，页面代码都使用velocity作为模板引擎，具体代码如下：

index. html中字段属性名也与User实体中的相同，这样就可以使用form.toPo（）来将表单转换成一个User实体。

index. html及show.html均要放到WEB-INF/views/下，启动tomcat，在浏览器中输入http://localhost：8080/SpringEasyJWeb/user.ejf，打开注册页面，如图6-19所示，结果如图6-20所示。

图6-19 Spring整合EasyJWeb实例

图6-20 Spring整合EasyJWeb实例提交结果

在提交结果中可以看到性别已经通过注入到User中了，这样就完成了Spring和EasyJWeb的整合。

## 6.4 小结

本章通过对当前主流MVC框架Strut2和JSF、EasyJWeb的实例介绍，详细地说明了Spring在其他MVC框架中所起到的作用，并且通过Spring和其他MVC框架的实例整合来使读者进一步地熟悉Spring，通过本章的学习，读者可以了解Spring和当前主流MVC框架的整合开发，熟悉使用Spring结合其他MVC开发，在下一章中将讲解Spring和JPA的结合使用。

# 第7章 Spring和JPA

自从JPA伴随着JavaEE 5.0孕育而生之后，Spring 2紧随其后，马上对JPA进行了深度整合，编码人员在使用Spring高性能的时候，可以结合同样备受青睐的JPA来操作数据了，使用Spring 2结合JPA开发应用程序时达到了前所未有的方便与快捷，本章将讲述JPA的主要标签及数据操作方法，并结合Spring来针对实例讲解JPA的开发，本章主要内容如下。

●JPA介绍及JPA操作数据

●Spring结合JPA实例开发

●Struts2结合JPA实例开发

●JSF结合JPA实例开发

●EasyJWeb结合JPA实例开发

## 7.1 JPA介绍

自从Java流行以后，为了使开发简易化，各种框架层出不穷，在数据持久化方面先后出现了Hibernate、Toklink和iBats等优秀的应用框架，使用户开发任务大大减轻，随之而来产生一个问题就是应用程序一旦需要改变持久层框架就需要改动大量的代码，在程序维护及升级过程中带来了很大的不便。

比如某公司CMS系统使用Hibernate进行数据操作，实例代码如下：

Hibernate的查询方法是get（），现在公司由于特定需求要给持久层框架改成Toplink，而Toplink的查询方法是find（），这样上面的代码就需要修改为如下：

而在CMS中有大量的这种数据持久化操作代码，这样的工作量就非常大，如果某天又要换成其他持久层框架，这样就翻来覆去地修改代码，给程序员带来很大的不便，JPA就是为了统一持久层框架而形成的一套标准的数据操作接口，JPA即（Java Persistence API）Java持久化API，其他所有的持久层应用框架都实现JPA接口，这样在持久层开发过程中就不需要使用任何特定框架的方法，一切都使用JPA接口来完成数据操作，比如，在JPA中查询的方法统一为find（），程序员在编码的时候调用的是JPA的接口，具体实现是Hibernate还是Toplink与数据操作代码没有直接的关系。

这样如果需要切换其他持久层框架，只要是JPA的实现框架，只需要切换相关的jar文件及修改一下配置文件即可完成，不需要再修改程序中的代码。

## 7.2 JPA常用标签

使用JPA的时候用户不需要再执行相关的SQL来建表，只需要建立一个数据库，在程序初始化的时候自动完成建表及各表之间的关联关系，这一切都依赖于JPA提供的标签来完成，只需要给需要建表的类加上相关的标签就可以了。

### 7.2.1 @Entity、@Table

@Entity标签表示JAP将会根据该实体建立一张表，例如：

在程序启动的时候会检测到User类有@Entity标签，这样JPA就会建立一张名为user的标签，而且该表有两个字段，分别为uesrName和passWord，直接使用@Entity标签生成的表名及表中的字段名称都与实体类相同，如果user实体对应的是数据库中person表则可以使用@Table标签来指定表名，代码如下：

这样在启动程序的时候JPA会自动根据@Table标签来生成一个关系数据表且表名为person。

### 7.2.2 @Id、@Column

在实际应用过程中一般每一个实体类都会有唯一的主键，也就是常说的id, JPA根据不同的实现框架有一套统一的主键生成策略，直接使用@id标签来制定id生成策略并对应到数据表中的主键字段，代码如下：

这里生成数据表名称为user，且有3个字段分别为id、userName和passWord，并且该实体类的主键是id字段，id字段的生成策略为GenerationType.TABLE，表示为基础数据库表的实体分配主键以确保唯一性，GenerationType.TABLE是大多数应用采用的主键生成策略，当然JPA还有以下其他的主键生成策略。

（1）GenerationType. AUTO不指定任何策略时的默认生成策略，JPA会根据数据库类型自动选择生成策略。

（2）GenerationType. IDENTITY指定持续性提供程序使用数据库身份列。

（3）GenerationType. SEQUENCE指定持续性提供程序使用数据库序列。

@Column用来指定数据表中的字段和实体属性对应，例如实体中的userName属性在JPA生成数据表的时候对应name字段，则代码可以如下：

JPA在检测Entity的时候首先会检测是否有@Column标签来指定关系数据表中的字段名称，如果没有指定就会以实体类的属性名称作为关系数据表的字段名称，这里使用@Column（name="name"）来指定了关系数据表中与userName属性对应的字段名称是name。

### 7.2.3 关系映射标签

在系统设计的时候，通常都会有很多个实体类，而且这些实体类之间有着一定的关系，例如，系统中有用户实体User，文章实体Article，每个用户可以有多篇文章，这样User和Article之间就有一对多的关系，在持久层框架出现之前程序员会在Article实体中增加一个userId字段来表示每篇文章都有一个作者，这样就表示了一个简单的一对多的关系，同时在建立数据表的时候也会在Article表中建立一个userId字段，这种处理办法是最原始的，一旦程序庞大，各种关联关系复杂以后就会给程序员带来很大的麻烦，持久层框架出现以后通过程序员手动建立表以后再写一定的配置文件来表示关系映射，当JPA出现后就彻底地解决了关系映射的复杂性，不需要手动建立外键来表示映射关系了，直接使用JPA提供的几种标签就轻松地解决问题。

1.@OneToOne

@OneToOne标签用来处理一对一关系映射，例如一个User对应一个Article，则可以使用@OneToOne表示，代码如下：

在User实体中使用@OneToOne标签来标识User中的Article属性，表示一个用户对应一篇文章，@JoinColumn用来指定连接字段，这里表示每个User实体连接一个Article中的Id，在Article实体中，使用@OneToOne（optional=false, mappedBy="id"）表示每一篇文章对应一个作者，同时不允许作者为空（optional=false表示不允许指定的关系实体为空），mapped-by表示每一篇文章映射一个User实体中Id字段。

2.@OneToMany、@ManyToOne

@OneToMany表示一对多关系，比如每个用户User有多篇文章Article，就可以用@OneTOMany标签，代码如下：

User实体代码：

Article实体代码：

这里使用@OneToMany（cascade=CascadeType.ALL, mappedBy="id"）表示User和Article是一对多的关系，cascade=CascadeType.ALL表示User实体和Article的任何操作关联，增、删、改、查该用户同时增、删、改、查该用户的文章，mappedBy="id"表示User和Article是单向关联，这样JPA在建立关系表的时候就会在article表中建立一个user_id字段来表示关联，如果不使用mappedBy来表示单向关联，那么就表示User和Article是双向关联，这样JPA在建立关系表的时候会自动建立一张中间表user_article，这里对于初学者要注意的是在OneToMany关系中，Many一方需要使用一个数组来表示，如：

而不能如下表示。

3.@ManyToMany

@ManyToMany表示多对多的关系映射，例如一篇文章可以有多个作者，一个作者也可以有多篇文章，这样User和Article中就是多对多的关系，在JPA中可以如下表示。

User实体代码如下：

这里每个User对应一个List＜Article＞，就是表示一个用户可以有多篇文章，同时用@ManyToMany表示用户和文章是多对多的关系。

Article实体代码如下：

在Article实体中同时对应一个List＜User＞，同样适用@ManyToMany标签进行标识，这样双向标识就完成了一个多对多的关系映射，JPA根据@ManyToMany标签会在建立关系表的时候自动建立两张中间表，分别为user_article和article_user。

## 7.3 Spring对JPA的支持

Spring对JPA有着非常完美的支持，使用Spring提供了EntityManagerFactory来管理JPA，这样就可以完全不用顾虑在系统中使用哪种JPA实现框架。

### 7.3.1 Spring实体管理器、实体管理工厂的创建

Spring提供了两种JPA的支持，使用Spring来管理JPA将会大大地减轻程序员的数据结构设计工作，并且更加方便用户的使用。

JPA在Spring启动的时候，默认情况会查找classpath：META-INF下的persistence.xml文件来进行初始化，也可以通过人为指定JPA初始化文件的位置和名称，Spring提供了EntityFactory来管理JPA，在Spring中有两种EntityFactory来管理JPA。

1.LocalEntityManagerFactoryBean

LocalEntityManagerFactoryBean负责创建一个适合于当前环境的EntityManager来使用JPA进行数据访问。factory bean将使用JPA PersistenceProvider类的自动检测机制，而在大多数情况下，仅仅需要一个persistence unit名称配置。

在JNDI中就可以直接使用lookup来查询这个EntityFactory，实例代码如下：

这样在应用中就可以直接使用EntityManagerFactory了。

2.LocalContainerEntityManagerFactoryBean

使用LocalContainerEntityManagerFactoryBean来创建JPA实体管理器更加方便，只需要在Spring配置文件中配置一个LocalContainEntityManagerFactoryBean即可，实例代码如下：

LocalContainerEntityManagerFactoryBean有3个主要的属性。

（1）persistenceXmlLocation指定JPA配置文件persistence.xml所在的位置，这里的JPA配置文件名称也可以任意指定。

（2）dataSource注入一个数据源，一般都是给数据源配置成一个单独的Bean，然后直接引入即可。

（3）jpaVendorAdapter jpa适配器，该属性用来指定JPA实现框架，这里指定为JPA的实现框架为Hibernate，如果将持久层框架换成Toplink就可以将jpaVendorAdapter改为如下所示代码：

### 7.3.2 pesistence.xml

JPA默认的配置文件是persistence.xml，且默认该文件位置在classpath：META-INF下，不过Spring提供了LocalContrainerEntityManagerFactory可以对persistence.xml文件进行任意命名和位置改变，pesistence.xml文件一般主要配置如下：

＜persistence-util＞表示一个持久单元，name属性用来指定该持久单元的名称，transaction-type属性用来指定该持久单元的事务支持，“RESOURCE_LOCAL”表示该持久单元的实体管理器不参与JTA事务，＜provider＞用来指定该持久单元的提供商，＜propertites＞用来指定JPA的相关属性，hibernate.show_sql表示控制台是否显示sql语句，hibernate.hbm2ddl.auto表示建表的时候采用的方式，“update”表示每次系统启动都根据当前的@Entity进行数据表更新，以前数据表中的数据就会全部丢失，还可以设置为“create”，这样就只会在系统第一次初始化建立数据关系表，在系统部署完毕后应该设置为create，这样就不会造成数据丢失，同时在＜properties＞中还可以定义数据源连接的相关属性，代码如下：

不过不建议这么做，这样不便于数据源的重用。

### 7.3.3 自动生成数据表

JPA在伴随系统启动的时候会建立数据库和表，这样对于用户安装系统来说就更加方便了，不用进行任何的SQL，同时也保护了系统的数据结构。

使用Spring管理JPA, JPA建表就会在Spring初始化过程中完成，下面以一个简单的实例来演示如何使用Spring+JPA完成自动建表的过程。

首先建立一个Tomcat Project，在项目classpath中添加如下jar文件。

由于JPA所依赖的包比较多，所以这里都给列出来了，同时由于Spring版本管理不是很好，不同Spring版本依赖包有较大的出入，读者可以直接使用光盘中SpringJPA项目中的所有jar文件。

本例以mysql为演示数据库，所以在添加jar的时候需要将mysql-connector-java-*.jar添加到classpath中。

系统共有两个实体类，User和Article，本节的目的就是在启动系统的过程中完成JPA自动建表，也就是完成User和Article及相关中间表的自动建立。

首先建立领域模型（Domain Model）。

Hibernate3和JPA有完全相同的一套标签，这里要注意导入的是javax.persistence.*包，而不是hibernate中的包。

User中有id、userName和passWord 3个字段，在建立数据表的时候就会同样有3个字段，User中有List＜Article＞，同时用@OneToMany标签标识User和Article是一对多的关系，同时该一对多是单向映射（mappedBy="id"），这样在建立数据表的时候就会在article表中增加一个user_id字段而不会出现一张中间表。

Article实体中有3个字段，在建立article关系表中就会生成3个同样的字段，同时需要用@ManyToOne表明Article和User是多对一的关系。

建立web.xml文件，代码如下：

这里直接使用SpringMVC，所以web.xml文件就是一个标准Spring MVC的配置文件，在配置文件中引入了mvc-config.xml，这里的mvc-config.xml位置是在WEB-INF下，当然也可以根据个人喜好放到classpath下，不过那样就需要改变一下contextConfigLocation中的路径配置。

mvc-config. xml文件代码如下：

这里的mvc-config.xml中只是引入一个applicationContext.xml, applicationContext.xml文件这里指定在classpath下，也可以根据个人喜好放到WEB-INF下，只要改变一下配置路径即可，applicationContext.xml文件是用来启动JPA引擎的配置文件，代码如下：

在applicationContext.xml中主要就是配置了一个EntityManagerFactory，这里使用的是LocalContainerEntityManagerFactoryBean，这个就是JPA实体管理器，也就是通过完成自动建表及后续所有数据库操作的，LocalContainerEntityManagerFactoryBean有3个属性需要配置。

（1）persistenceXmlLocation用来指定persistence.xml文件所在的文件，persistence.xml文件是JPA自身的配置文件，用来指定Entity初始化的。

（2）dataSource用来指定一个数据连接，这里引入另一个Bean，在通常情况下均是将数据连接配置成一个Bean，这样便于重用。

（3）jpaVendorAdapter属性用来指定JPA的实现框架，只要改动该属性就可以任意改变系统使用的持久层框架，本实例中采用Hibernate 3.2作为JPA的实现框架，所以进行上面的配置。

最后再编写JPA的配置文件persistence.xml，代码如下：

persistence. xml指定了该持久单元实体管理器不参与JTA事务，同时该持久层单元的提供商是org.hibernate.ejb.HibernatePersistence，这样在系统启动的时候JPA将会调用Hibernate的建表程序进行数据关系表的生成。

最后项目结构如图7-1所示。

图7-1 JPA自动建表项目结构图

启动Tomcat，查看一下mysql中的news数据库，可以看到news中多了三张表，分别为user、article和hibernate_sequences，其中hibernate_sequences是hibernate生成的序列表。

### 7.3.4 JPA操作数据

JPA是一个标准的数据操作接口，Spring对JPA有着非常好的支持，在Spring中有3种方法可以通过JPA来进行数据操作。

1.使用EntityManager操作数据

EntityManager是JPA实体Entity的管理类，通过EntityManager可以对Entity进行任意的操作，EntityManager是通过EntityManagerFactory来生成的，在配置文件中配置一个EntityManagerFactory，然后给需要操作数据的类中注入EntityManagerFactory来生成一个EntityManager，这样就可以使用EntityManager来操作数据了。

如UserDAO类中有一个save方法用来保存数据，使用EntityManager操作数据UserDAO可以编写代码如下：

通过Spring的IOC给UserDAO注入一个EntityManagerFactory，在操作数据的时候首先调用EntityManagerFactory.createEntityManager（）来建立一个EntityManager，接着就可以使用EntityManager来操作数据了，操作数据的时候要加上事务的管理，数据操作完毕后一定要关闭EntityManager。

EntityManager还有几个操作数据的方法，例如：

2.使用JpaTemplate操作数据

Spring提供了JpaTemplate通过EntityManager来操作数据库，使用JpaTemplate提供的一系列方法可以满足用户的数据操作要求。

JpaTemplate需要一个EntityManager或者EntityManagerFactory作为参数进行初始化：JpaTemplate template=new JpaTemplate（EntityManager）或者JpaTemplate tempalte=new JpaTemplate（EntityManagerFactory）。

其中的EntityManager和EntityManagerFactory就是Spring提供的实体管理器，可以直接通过配置文件来进行初始化，一般情况下都使用EntityMnanagerFactory的子类LocalContainerEntityManagerFactory。

配置完毕EntityManagerFactory就可以通过Spring的IOC功能来进行JpaTempalte的初始化了，例如有一个用户数据操作的接口IUserDAO。

接口中定义了用户的几种简单的数据操作，包括增删改查，接着写一个操作的实体类UserDAOImpl，代码如下：

在UserDAOImpl中通过注入EntityManagerFactroy来完成JpaTempate的初始化。

配置文件代码如下：

通过配置文件来给UserDAOImpl注入EntityManagerFactory，这样在action中就可以直接使用IUserDAO来进行数据操作了。

3.使用JpaDaoSupport操作数据

JpaDaoSupport操作数据是建立在JpaTempalte的基础之上的，在JpaDaoSupport操作数据的时候只需要继承JpaDaoSupport类，然后就可以使用this.getJpaTemplate.xxx来进行数据操作，同时需要给JpaDaoSupport的子类注入一个EntityManager或者EntityManagerFactory。

将前面的JpaTempalte操作数据中的UserDAOImple改成使用JpaDaoSupport操作，代码如下：

可以看到在UserDAOImpl中不再有任何的JpaTemplate初始化代码了，这一切都在JpaDaoSupport中完成了，不过使用JpaDaoSupport操作数据的时候还需要给实现类UserDAOImple注入一个EntityManagerFactory，配置文件还是与前面使用JpaTemplate操作数据的相同。

## 7.4 Spring整合JPA实例

Spring+JPA越来越受开发者的青睐，也是今后Java开发的一个非常好的组合，使用Spring的IOC、AOP及MVC，结合JPA的数据操作及自动建表功能，使Spring+JPA成为快速开发高性能系统的首选方案。本节中分别结合Spring MVC、Struts2、JSF和EasyJWeb来完成一个添加用户的实例。

### 7.4.1 Spring MVC+JPA

Spring MVC结合Spring的IOC等特性来与JPA整合是J2EE开发一个非常好的组合，本节中以一个实例来讲解Spring+JPA在实际开发中的方法。

首先建立一个实体模型，该实体对应数据库中的一个关系表，利用JPA来实现自动建表，所以实体类用@Entity来标识，代码如下：

在User实体中使用默认的表名user，同时在关系表中会建立3个默认的字段：id、userName和passWord。

建立一个数据操作接口IUserDAO，代码如下：

IUserDAO中有5个方法，分别为保存、删除、更新、查询单个用户和查询所有的用户，这里给所有的方法都加上了事务注释，表示这些方法均纳入事务管理，这样在系统中所有IuserDAO的实现类都纳入进行事务管理了。

编写IUserDAO实现类UserDAOImpl, UserDAOImpl实现了IUserDAO接口，并且又继承org.springframework.orm.jpa.support.JpaDaoSupport，在JpaDaoSupport中使用了EntityManagerFactory来进行数据库操作，UserDAOImpl代码如下：

UserDAOImpl是IUserDAO的实现类，所以UserDAOImpl中的几种方法都已经纳入事务管理，在UserDAOImpl中就不需要关注事务了。

建立一个控制器UserAction，该类继承SimpleFormController，代码如下：

UserAction使用IUserDAO进行数据操作，这里只有一个简单的流程：保存一个用户并显示所有的用户，在实际应用中会涉及到很多种操作，同时在显示数据的时候还要用到分页引擎，这里只是演示Spring MVC和JPA的整合就不过多地说明了。

编写web.xml文件，代码如下：

web. xml中指定了处理请求的servlet，同时指定servlet初始化的时候启动配置文件mvc-config.xml, mvc-config.xml文件代码如下：

mvc-config. xml中首先导入了“classpath：applicationContext.xml”，applicationContext.xml文件是用来启动JPA的实体管理器，接着定义了视图解析器是JstlView，表示视图中可以使用JSTL标签，由于本实例中只有一个请求，这里就没有设定SimpleUrlHandlerMapping，将UserAction的id指定为“/user.html”，此时表示当请求为“user.html”的时候交给UserAction来处理，UserAction是SimpleFormController的继承类，该类需要注入commandClass属性来进行表单转换，“formView”属性是SimpleFormController的默认视图。

applicationContext. xml文件代码如下：

applicationContext. xml中首先配置了一个dataSource，这里使用了org.apache.commons.dbcp.BasicDataSource，接着配置了Spring的实体管理器LocalContainerEntityManager FactoryBean, LocalContainerEntityManagerFactoryBean主要有3个属性需要配置，persistenceXmlLocation属性用来加载jpa单元配置文件，这里可以指定任意目录下的任意名的配置文件，如果不进行配置则默认查找classpath/META-INF下的persistence.xml文件，jpaVendorAdapter属性用来指定JPA实现框架，这里使用的是Hibernate3.2，所以使用一个内部Bean指定为Hibernate适配器，org.springframework.orm.jpa.JpaTransactionManager是Spring提供的事务管理器，通过该事务管理器可以对所有的实体进行事务管理，由于UserDAOImpl是JpaDaoSupport的子类，所以需要给它注入一个实体管理工厂类entityManagerFactory，同时由于IUserDAO中使用标签@Transaction对数据操作方法进行了事务配置，所以在配置文件中需要加一个＜tx：annotation-driven transaction-manager="transactionManager"/＞配置对应的事务管理。

编写JPA的单元配置文件，文件位置及名称要与applicationContext.xml中指定的一致，这里为classpath下的persistence.xml，代码如下：

设计页面index.jsp及show.jsp，代码分别如下：

index. jsp中只有两个字段，分别为userName和passWord，与User的两个属性对应，在Spring的控制器中就可以直接使用User user=（User）command来进行表单与实体的转换。

show. jsp页面中使用JSTL标签，所以首先使用@taglib来引入标签库，show.jsp中使用了jstl的for循环＜c：forEach＞＜/c：forEach＞，items属性表示引用的数组，var属性表示数组中单个对象的引用。

启动Tomcat，打开浏览器，输入http://localhost：8080/SpringJPA/user.html，打开注册页面，如图7-2所示。

图7-2 Spring MVC+JPA实例

输入相关的数据，单击【提交】按钮后转到结果显示页，如图7-3所示。

图7-3 Spring MVC+JPA实例显示结果

本实例中只演示了数据的保存和显示，但是在UserDAOImpl中已经编写了删除和更新等操作，读者有兴趣可以结合光盘中的SpringJPA实例来进一步完成该实例。

### 7.4.2 Struts2+Spring+JPA

JPA是一个独立的开发组件，可以和任意MVC等框架进行组合开发，Struts2是当前Web开发最主流的MVC框架，本节中将以一个实例来演示Struts2结合JPA进行整合开发。

首先将struts2、Spring和jpa相关包导入到classpath中，具体使用的包可以参考光盘中的SSJ实例，接着按照下列步骤来完成一个实例。

（1）建立一个实体类，并且根据该实体类自动建立数据表。

User中还是只有3个字段，自己手动在mysql数据库中建立一个news库，建立数据表的时候依然使用默认的表名user，并且表中3个字段的名称均为默认：id、userName和passWord。

（2）建立一个用户数据操作接口IUserDAO，代码如下：

IUserDAO接口中有4种方法，保存和更新使用了同一个方法saveOrupdate（User user），这是因为JPA自身一个小问题，使用JPA和其他MVC框架整合时如果保存数据使用persist（）方法会经常抛出如下的异常。

在IUserDAO中saveOrupdate（）方法的事务传播行为是REQUIRED，表示saveOrupdate（）方法必须在事务中进行，如果当前没有事务则开启一个事务，getUsers（）方法是返回所有用户的方法，该方法的事务传播行为设置为SUPPORTS，表示该方法可以在无事务状态下执行。

（3）编写IUserDAO的实现类UserDAOImpl，代码如下：

UserDAOImpl继承了JpaDaoSupport，所以可以使用JpaDaoSupport中的JpaTemplate来进行数据操作，这里的保存和更新都使用了merge（）方法，因为JPA中的保存persist（）方法自身存在一些问题，这一点在使用JPA的时候要注意。

（4）编写基于Struts2的UserAction。

UserAction中有3个属性，第一个是操作数据用的dao，这里使用的是接口，而实际上是使用了UserDAOImpl，第二个User对应页面表单对象，在struts2中会自动将表单对象转换成action中的一个私有对象，第三个List＜User＞是返回到页面的所有用户，这些都是struts自身的特性，详情可以参考第6章中的struts介绍。

（5）编写struts2的web.xml配置文件，由于篇幅关系这里不再重复，可以参考光盘中的SSJ实例或者第6章中的struts2实例中的配置。

（6）编写Spring的配置文件mvc-config.xml，代码如下：

在mvc-config.xml中首先导入了classpath下的applicatoinContext.xml，该文件用来配置Spring的实体管理器，mvc-config.xml中只有一个Bean，对应UserAction，其中的dao是在applicationContext.xml中配置的，因为UserDao需要注入一个Entity ManagerFactory，在这里配置完userAction后就不需要在struts2中配置相关的action了，直接引用mvc-config.xml中UserAction的id即可。

（7）编写Struts2的配置文件struts.xml和user.xml，代码分别如下：

该配置中指定了struts的ObjectFactory为Spring，这样就将所有的Bean管理交给了Spring，在struts的配置文件中就直接可以引用Spring配置的任何一个Bean。

该配置中引用了Spring中配置的id为“userAction”的Bean，如果没有Spring来管理Bean，这里的class因为配置为“spring.chapter7.ssj.action.UserAction”，该Bean的执行结果将导向/WEB-INF/web/show.jsp页面。

（8）编写applicationContext.xml和persistence.xml，该文件的配置与7.4.1节中的相同，这里不再重复，可以参考光盘中的SSJ实例。

（9）编写页面文件index.jsp、show.jsp，代码分别如下：

show. jsp中使用了JSTL标签，＜c：foreach＞是JSTL标签中的循环，items用来表示需要循环的数组，也就是后台传递回来的数组名称return new ModelAndView（this.getPage（），"users"，users）；中对应，var表示一个数组中的单个实体，这里就是一个User，接着就可以使用user.xxx来引用User的属性值。

启动Tomcat，打开浏览器，输入http://localhost：8080/SSJ就可以打开项目的首页，如图7-4所示。

图7-4 Struts2+Spring+JPA实例首页

输入数据，单击【提交】按钮后，转到显示所有用户页面，如图7-5所示。

图7-5 Struts2+Spring+JPA实例用户显示页面

### 7.4.3 JSF+Spring+JPA

JSF也是一种很不错的MVC框架，在第6章中已经介绍了JSF结合Spring的使用，在本节中以一个实例来演示JSF+Spring+JPA的应用。

首先建立一个用户模型User，代码如下：

在User实体中有3个字段，分别为id、userName和passWord，使用@Entity标签注释User实体，JPA会根据User的字段生成一个User关系表。

建立一个数据操作接口IUserDAO，代码如下：

IUserDAO接口中只有两种方法，save（User user）为保存用户方法，getUsers（）为获取所有用户的方法，根据系统需要这里只写了两种方法，在实际应用中会有多个不同的方法。

编写IUserDAO的实现类UserDAOImpl，代码如下：

UserDAOImpl中使用EntityManager来操作数据，首先给UserDAOImpl注入了一个EntityManagerFactory, EntityManagerFactory.createEntityManager建立一个EntityManager，接着就可以使用EntityManager来进行数据操作了，在使用EntityManager操作数据的时候要注意开启和关闭事务，操作结束以后还要关闭EntityManager，其中EntityManager.createQuery（String sql）中的sql只需要写查询语句中“from”及其以后的部分，这里为“from User u”，不能写为“select u from User u”。

编写控制器类UserAction，在JSF中控制器类不需要继承和实现任何其他类或接口，任意用户定义的类都可以作为控制器类，UserAction代码如下：

UserAction中定义了3个变量，IUserDAO用来操作数据，需要使用IOC来注入，User是对表单的映射，在表单中要将字段的名称设置为userAction.User.userName，这样提交表单就会自动转换成UserAction中的User对象，要注意的是这里的User必须要进行一个实例化操作private User user=new User（），DataModel是JSF中对实体数据的封装，使用setWrapperData（list）给DataModel对象注入返回的一个数组对象，如setUsers（this.dao.getUsers（）），this.dao.getUsers（）将会返回一个List＜User＞对象，setUsers（）将会调用setWrapperData（）方法将List＜User＞添加到DataModel对象中，JSF结合＜h：dataTable＞标签可以循环显示DataModel中的数组，UserAction中只有一个save（）方法，该方法返回一个字符串为“success”，JSF的配置文件中将会定义返回字符为“success”的方法导向页面。

配置web.xml文件，代码如下：

web. xml定义了ContextLoaderListener加载Spring的Context，同时启动Spring配置文件mvc-config.xml，最后定义servlet，关于JSF和Spring整合请参考6.2.3节中的详细介绍。

编写Spring配置文件mvc-config.xml，代码如下：

mvc-config. xml中导入了classpath下的applicationContext.xml文件，这里只配置了一个Bean。

applicationContext. xml文件用来配置EntityManagerFactory并启动JPA引擎，代码如下：

applicatioinContext. xml中配置了EntityManagerFactory实体，并且将Entity Manager Factory注入了UserDAOImpl中，最后配置UserAction实体，这样在JSF页面中就可以利用#{usrAction.xx}来使用userAction中的所有属性和方法了，application Context.xml中指定了JPA的启动文件为classpath下的persistence.xml, persistence.xml文件与前面章节中相同，这里就不再重复，可以参考光盘中JSJ实例中的源代码。

最后定义JSF的配置文件faces-config.xml，代码如下：

最后编写页面文件index.jsp、show.jsp，代码分别如下：

index. jsp中首先使用@taglib引入了JSF的标签库core、html，＜h：inputText value="#{userAction.user.userName}"/＞表示该字段对应配置文件中id为userAction中的user的userName属性，这样在提交该表单时就会自动将该字段值赋给UserAction中的user的userName, action="#{userAction.save}"表示该表单会提交给userAction中的save（）方法来处理。

＜h：dataTable＞标签用来循环数组，value="#{userAction.users}"表示该dataTable循环userAction中的users属性，在userAction中users必须是DataModel类型，var="user"表示获取users数组中的一个对象并且将该对象命名为user，接着就可以使用#{user.userName}来引用相关属性值了，这里要注意的是JSF显示数据的时候需要设置表头，代码如下：

这样才能使用＜h：outputText value="#{user.userName}"/＞显示数据，否则直接使用＜h：outputText value="#{user.userName}"/＞是不能显示数据的。

项目整体结构如图7-6所示。

图7-6 JSJ项目结构图

启动tomcat，打开浏览器，输入http://localhost：8080/JSJ/web/index.faces打开该实例的首页，如图7-7所示。

图7-7 JSF+Spring+JPA实例运行首页

输入相关数据，单击【提交】按钮后，将会出现结果显示页，如图7-8所示。

图7-8 JSF+Spring+JPA实例结果显示图

### 7.4.4 EasyJWeb+Spring+JPA

EasyJWeb和Struts、JSF相同，在Web应用中只是一个MVC层，同样可以结合Spring、JPA开发Web程序。

首先还是建立实体模型User，仍然使用JPA根据实体类来生成关系数据表，在实体类中依旧使用@Entity来进行标注，User代码如下：

建立User的实体操作接口IUserDAO，该接口中只有两种方法，save（）为保存数据方法，getUsers（）为获取所有用户的方法，代码如下：

编写IUserDAO的实现类UserDAOImpl，这里直接继承了JpaDaoSupport，使用JpaTemplate来操作数据，也可以直接使用EntityManager来操作数据，代码如下：

UserDAOImpl在编写的时候直接使用@Transactional来进行事务标注，这样在使用UsrDAOImpl中任何一种方法的时候都会启用Spring的事务管理器来进行事务处理。

编写控制器类UserAction，由于这里使用的是EasyJWeb框架，所以该类只需要继承AbstractCmdAction即可（关于AbstracCmdAction的具体使用可以参考6.3节中的介绍），代码如下：

doInit（）方法是AbstractCmdAction的默认方法，也就是当请求交给UserAction来处理的时候，如果没有带任何命令参数就会调用该方法，这里的doInit（）方法直接返回一个静态页面index.html, EasyJWeb默认的页面都需要放在WEB-INF/views下，doSubmit（）方法是一个任意定义的方法。当用户请求交给UserAction来处理的时候，带有参数cmd=submit或者easyJWebCommand=submit，就会调用该方法，这里的doSubmit（）方法用来保存用户并获取所有的用户，然后将所有的用户显示到页面show.html上。

编写web.xml配置文件，该文件用来指定serlvet，并启动EasyJWeb的配置文件，代码如下：

Web. xml中启动了WEB-INF下的mvc.xml, mvc.xml为EasyJWeb的配置文件，代码如下：

mvc. xml中首先使用SpringContainer加载了Spring的配置文件，这样在EasyJWeb中就可以使用Spring定义的所有Bean, applicationContext.xml是Spring配置JPA及其他Bean的文件。mvc.xml中配置了一个＜module＞，在EasyJWeb中，每一个＜module＞对应一个请求，path属性表示请求的url，这里表示当请求为“user.ejf”的时候servlet将会转交给UserAction来处理。

applicationContext. xml文件代码如下：

applicationContext. xml中定义了数据源连接、EntityManagerFactory和事务管理器，并且给UserDAOImpl注入了entityManagerFactory（由于UserDAOImpl继承了JpaDao Support，而JpaDaoSupport是使用EntityManagerFactory来进行数据操作的），最后使用＜tx：annotation-driven transaction-manager="transactionManager"＞来表明@Transactional注释来进行事务管理，applicationContext.xml中指定了JPA的配置文件为classpath下的persistence.xml，由于篇幅关系，这里不再重复persistence.xml代码，可以参考光盘中ESJ实例中的源码。

定义页面文件index.html和show.html，代码分别如下：

index. html中用户名和密码的名称分别对应了User实体中的userName和passWord，这样就可以使用EasyJWeb的toPO（）方法完成表单与实体对象的转换。

show. html中使用velocity标签来应用返回页面的所有用户users的值，关于velocity的标签这里不过多讲述，可以参考相关资料。

运行Tomcat，打开浏览器，输入http://localhost：8080/user.ejf将会打开调用UserAction中的doInit（）方法，返回一个页面index.html，如图7-9所示。

图7-9 EasyJWeb+Spring+JPA实例

输入数据，单击【提交】按钮后，将会保存用户并返回，所有用户显示到show.html页面，如图7-10所示。

图7-10 EasyJWeb+Spring+JPA实例显示结果

## 7.5 小结

本章首先讲述了JPA的标签应用及使用JPA操作数据库的几种方式，然后以实例详细讲述了Spring、Struts、JSF和EasyJWeb等框架和JPA的综合应用，通过本章的学习可以了解和学会使用JPA，并且懂得如何使用多种MVC框架来结合JPA开发J2EE应用。

# 第8章 Spring的其他应用

Spring之所以受众人青睐的主要原因就是其IOC和AOP思想的应用，在Java Web开发领域中，Spring已经有一席之地，同时Spring还提供了许多其他方面的应用，大大简化了原本非常复杂的开发过程，例如远程资源访问和定时调度等，在本章中主要讲述Spring在几个领域的独到应用，主要内容如下。

●Spring远程访问

●Spring定时器

●Spring发送邮件

●Spring上传文件

## 8.1 Spring远程访问资源

Spring出现之前，远程资源访问一直都是EJB的专利，但是由于EJB的复杂性及开发烦琐，导致远程资源访问一直都是很多初级开发者不敢涉足的领域，Spring推出以后，一切都得到了大大的简化，本节中以一个简单的实例来讲述使用Spring访问远程资源。

RMI（Remote Method Invocation）即远程方法调用，它是EJB中最普通的字眼了，对于初学者来说容易对“远程访问”产生一个误区，所谓的“远程访问”就是在客户端计算机访问远程服务器某个应用系统中某个方法，有些初学者误认为“使用浏览器访问一个页面，执行的就是服务器上的某个方法，这就是远程访问”，其实不然，当打开一个页面的时候，该页面实际上是存取在远程服务器上的，页面和执行的方法在服务器的同一个应用上，这是系统内部访问。通俗地说，远程访问就是不同的应用系统之间的方法访问，应用系统A中有一个方法doAMethod（），应用系统B要访问A中的doAMethod（），在普通的应用中是不可能的，Spring出现以前就需要使用EJB来解决，这样就可以使很多重要的资源共用，使用EJB受到一连串的编写规则约束：如服务接口定义时必须继承java.rmi.Reomte接口，服务在实现的时候必须继承java.rmi.UnicastRemoteObject类等，编写手续显得十分繁杂。

使用Spring构建RMI程序就不用那么烦琐了，接口和服务都可以任意编写，一切只需要配置一个RmiServiceExporter就可以解决了。

首先定义一个服务接口。

接口中有两种方法用来实现相关服务，Spring就是通过代理接口来实现远程访问的，所以服务端口需要在客户端保存一份。

编写服务器端的服务接口实现类。

ServicImpl保存到服务器端，该类就是具体服务实现，也就是远程调用的实际实现类，远程调用doOther（）方法的时候就会返回一个字符串“str+已经成功访问”。

配置服务器端文件，代码如下：

服务器端使用org.springframework.remoting.rmi.RmiServiceExporer来完成远程访问服务类的配置，其“service”属性用来指定远程访问服务的实现类，“serviceName”用来给该远程访问服务命名，就是通过该名称来进行远程访问，“serviceInterface”用来指定远程服务类的实现接口，“registryPort”用来指定访问端口，在远程访问的时候通过rmi://ip：registryPort/serviceName来进行远程访问。

编写一个RMI服务器端，用来启动服务，代码如下：

服务器启动只需要读取rmi-server.xml就可以了，初始化rmi-server.xml的时候Spring会自动产生Naming、rmic和stub。

运行一下SpringServer，有如下结果。

表示服务器端已经正常启动，并且在2008端口监听RMI服务。

当客户端需要进行远程访问的时候，首先将远程服务的接口Iserivce保存一份，然后编写一个配置文件如下：

通过org.springframework.remoting.rmi.RmiProxyFactoryBean来通知服务端的URL，并制定需要进行远程访问的服务，这样远程服务端监听程序就会进行服务传递，RmiProxyFactoryBean中的serviceUrl属性用来指定远程访问服务的Url+服务名称，与服务器端的配置对应，serviceInterface属性用来远程访问服务的本地接口。

编写一个远程访问的测试类，代码如下：

远程访问的测试代码和Spring本地Bean测试相同，只需要获取Bean，然后执行相关的方法即可，这里要注意的是远程访问调用远程方法，并返回远程方法的返回值，但是不能在本地控制台输出远程方法中的“System.out.println（）”中的打印内容。

首先运行SpringServer，启动服务器端的服务，接着运行本地的RMIClient，这样就进行远程资源访问了，运行结果如下。

可以看到本地成功地访问了远程服务，给远程服务传递的参数并接受远程返回的结果。

## 8.2 定时器

定时任务一直都是开发过程中不可缺少的一项，例如，定时生成静态文件、定时检查用户相关特性等，在开发领域中也是一项比较难的任务，自从JDK 1.3版本以后，就可以是内置Quartz和Timer，使用Spring结合Quartz或者Timer来开发定时任务就显示不那么艰巨了。

### 8.2.1 Quartz

Quartz是OpenSymphony开源组织在Jobscheduling领域又一个开源项目，它可以与J2EE、J2SE应用程序相结合，也可以单独使用。Quartz可以用来创建简单任务运行十个，百个，甚至是好几万个Jobs这样复杂的日程表。Jobs可以制作成标准的Java组件或EJBs。Quartz的最新版本为Quartz 1.6.0，可以从http://www.opensymphony.com/quartz/download.action中下载Quartz最新源码。

Quartz使用起来十分简单，比如说要定义一个任务为MyJob，只需要使MyJob实现org.quartz.Job接口，在execute（）方法中编写任务代码，然后通过相关的配置就可以完成Quartz的定时调度工作了，由于篇幅关系关于Quartz的应用这里不过多讲述，本节主要讲述Spring结合Quartz应用的几种方式。

1.使用JobDetailBean

Spring提供了org.springframework.scheduling.quartz.QuartzJobBean定义任务类，只要给需要实现任务的类继承该类，在executeInternal（）方法中书写相应任务代码，实例如下。

MyJob继承了QuartzJobBean，在executeInternal方法中编写了任务代码，这里只有两个输出，通过时间的输出来测试定时任务的执行，同时在MyJob中定义了一个属性timeout，用来控制定时的时间。该时间通过JobDetailBean来配置。

配置JobDetailBean，代码如下：

配置文件中首先定义了JobDetailBean，该类用来控制定时调度任务，其中jobClass属性用来指定实现定时任务的类，jobDataAsMap属性中的timeout用来设定jobClass类中的定时时间，接着定义一个触发器trigger, Spring提供了CronTriggerBean来定义触发器规则，jobDetail属性用来指定JobDetailBean, cronExpression属性用来描述触发器规则，这里的“10，15，20，25，30，35，40，45，50，55****？”表示每隔5秒就触发一次定时器任务。

cronExpression规则如下。

cronExpression表达式至少包含6个元素，最多7个元素，各个元素之间用空格间隔，各个元素表达的含义为：秒（0～59）分（0～59）小时（0～23）每月第几天（1～31）月（1～12或者JAN～DEC）每星期第几天（1～7或SUN～SAT）年（1970～2099）。

7个元素中“每月第几天”和“每星期第几天”只能配置一个，不设置的元素以“”表示，如果某个元素需配置多个，则用“”隔开，如上面的“10，15，20”表示配置7个元素中的第一个“秒”且在10、15、20三个时间点执行，对于连续时间可以用“-”表示，如1～20*****？表示在每分钟的1～20秒均执行。

编写一个测试代码如下：

首先获取JobDetailBean以及触发器CronTriggerBean，然后使用StdSchedulerFactory来获取默认的调度器，将JobDetailBean及CronTriggerBean注册到调度器scheduler中，最后启动该调度器，运行结果如下：

从间隔时间可以看出，该定时器每间隔5秒钟即运行一次。

2.使用MethodInvokingJobDetailFactoryBean

在使用JobDetailBean来编写定时器任务的时候，任务类必须继承QuartzJobBean类，给定时任务编写在executeInternal（）方法中，这样实现定时器虽然比较简单，但是还是有点约束，Spring提供了org.springframework.scheduling.quartz.MethodInvokingJob DetailFactoryBean来给任意类指定为任务类。

首先任意定义一个任务类MyJob.java，该类可以任意命名，同时类中的方法也可以任意命名。

现在要将doJob（）方法设置为一个定时执行的方法，只需要通过简单的配置即可。

通过配置MethodInvokingJobDetailFactoryBean可以指定任意类的任意方法为定时任务类，“targetObject”用来指定任务类，“targetMethod”用来指定“targetObject”类中的任意一个方法，就是这么简单的配置即完成了定时任务的配置，写一个测试文件代码如下：

运行结果如下：

可以看出定时任务已经运行了，通过MethodInvokingJobDetailFactoryBean来编写定时任务显得更加简单。

### 8.2.2 TimerTask

TimerTask是JDK本身的一个定时器类，使用TimerTask可以定义自己的定时调度任务，任务类继承TimerTask类，然后结合Spring的ScheduledTimerTask和TimerFactoryBean可以轻松地实现定时调度任务，任务类还可以不继承TimerTask，直接使用MethodInvokingTimerTaskFactoryBean来配置自定义的任务类，下面针对两种不同的方法以实例讲解。

1.直接使用TimerTask

直接使用TimerTask类来完成定时调度任务，任务类需要继承java.util.TimerTask，重写run（）方法，将调度任务写到run方法中，然后通过Spring的ScheduledTimerTask配置就可以完成定时调度任务。

编写任务类MyJob，该类继承TimerTask，代码如下：

MyJob重写run（）方法，将需要定时调度的任务写到run（）中，这里只有一个简单的输出，通过时间的对比可以看到定时任务的调用。

使用ScheduledTimerTask配置MyJob任务类如下timer.xml。

配置文件中首先使用ScheduledTimerTask配置定时任务类，timerTask属性用来执行定时任务类，period属性表示定时器任务执行的间隔时间，delay属性表示第一次启动定时任务前延迟的时间，这里的两个时间配置单位都是毫秒，配置完ScheduledTimerTask后，需要将ScheduledTimerTask配置到TimerFactoryBean容器中，这样就可以调用scheduledTimerTask来启动定时器任务。

编写一个scheduledTimerTask测试代码如下：

运行TestTimer，结果如下：

2.使用自定义任务类

Spring提供了MethodInvokingTimerTaskFactoryBean来指定任意的自定义类为定时任务类，该类不再需要继承TimerTask。

定义一个任意的任务类，该类的名称为任意，类中的定时方法也是用户任意定义的，编写一个MyJob类代码如下：

该类为用户任意定义类，execute（）方法就是自定义的任务类方法，编写完自定义任务类，使用Spring的MethodInvokingTimerTaskFactoryBean来指定该类为任务类，接着就可以与前面TimerTask的配置相同来进行配置，配置文件代码如下：

MethodInvokingTimerTaskFactoryBean的targetObject属性用来指定自定义的任务类，targerMethod属性指定自定义任务类中的某个方法为定时执行的方法，其他的配置与前面相同，只是在配置ScheduledTimerTask的timerTask属性的时候，需要将该属性指定为MethodInvokingTimerTaskFactoryBean类。

测试文件与前面的相同，运行可以发现定时效果和使用TimerTask相同。

### 8.2.3 Web定时器

前面两节详细地讲述了两种不同定时器的应用，Java主要应用在Web开发上，在Web开发中经常涉及到定时器应用，本节就以一个实例来讲解定时器在Web中的应用。

比如，一个系统中用户注册后需要激活后方能登录，用户注册后给用户提供一个激活地址，通过该地址进行激活，设置一定的激活时间，如果该时间内没有激活则自动删除该用户，本例只演示定时器定时删除未激活用户，读者可以自行完善该程序。

首先设计用户对象，代码如下：

User对象中包括用户名userName，密码passWord，是否激活active（默认是false，表示没有激活，激活后为true），激活码code（自动生成一个激活码，通过一个URL验证激活码来激活用户），注册时间regTime，通过一个定时器来间隔一定的时间进行一次用户数据扫描，该时间内没有激活的用户将自动删除。

设计一个用户操作接口，代码如下：

该接口中只有5种方法，save（User user）方法为保存用户到数据库中，update（User uesr）为更新指定用户，delete（User user）为删除指定用户，getUserByName（String userName）根据用户名查询用户，getUsers（）为获取所有用户。

编写IUserDAO的实现类UserDAOImpl，该类继承JpaDaoSupport使用JpaTemplate来操作数据库，代码如下：

在UserDAOImp中使用JpaTemplate来进行数据操作，delete（User user）方法在使用JpaTemplate.remove（）方法之前使用了merger（），这个是因为删除用户的时候delete（）参数User是经过数据库查询返回的一个对象，如果直接使用JpaTemplate.remove（user），那么在调用该方法的时候就会抛出如下异常。

这是因为Hibernate删除的对象必须是一个新对象，而这里的user是一个持久化对象，这样删除的时候就会出错，而merge（）方法执行后就会重新序列化对象并产生一个新对象，这样就可以执行删除了。

编写用户注册的控制器UserAction，该类继承SimpleFormController类，这样可以很方便地处理表单，代码如下：

UserAction重写了SimpleFormController中的onSubmit（）方法，（User）command直接将表单转换成了User对象，user.setActive（false）表示新注册用户都为未激活用户，user.setCode（）给新注册的用户添加一个激活码，这里的激活码很简单，直接使用了一个随机数，然后调用IUserDAO的save（）方法来保存用户并将该用户对象返回到页面page中，编写激活用户的控制器ActiveAction，由于激活用户的时候是通过一个连接来激活的，所以ActiveAction不需要处理表单，也就不需要继承SimpleFormController了，ActiveAction需要使用HttpServletRequest对象来获得激活URL中的参数，所以ActiveAction类实现Controller接口即可，代码如下：

handleRequest（）方法中获取了两个参数，一个是用户名，另一个是激活码，并且根据用户名从数据库中查询了该用户，然后比较激活码，如果激活码相同则设置该用户的激活状态为true，这样就表示用户已经激活，激活成功后将该用户返回到一个新的页面page上。

到这里为止，用户注册及激活的控制已经写完，接着编写一个定时器类，该类用来扫描用户是否激活，如果没有激活的用户则间隔一定的时间删除，UserScheduler代码如下：

UserScheduler继承了TimerTask类，重写了run（）方法，在run（）方法中，首先获取了所有的用户，然后对用户给予扫描，如果用户的激活状态为false则删除它。

Spring 2版本以后使用定时器就不需要再向系统注册listener了，直接在Spring的配置文件中配置该定时器，系统在启动的时候读取Spring的配置文件，就会自动启动定时器任务，代码如下：

定时器的配置与前面两节中讲述的相同，这里不再重复。

接着编写spring的配置文件ApplicationContext.xml，该文件用来启动EntityManager Factory，具体代码与前面的差不多，这里不再重复，可以参考光盘中的WebScheduler实例。

最后编写3个页面文件，代码分别如下：

index. jsp中的两个字段名与User类中的用户名和密码相同，这样在UserAction中就可以直接使用（User）command进行转换了。

show. jsp页面是显示用户注册成功的，该页提供一个连接"/WebScheduler/active.html？code=${user.code}＆username=${user.userName}"来激活用户，可以看到在该连接中提供了两个参数code和username，与ActiveAction中的对应。

success. jsp页面是显示用户激活成功的页面。

项目最终结构如图8-1所示。

图8-1 WebScheduler项目结构图

启动tomcat，打开浏览器，输入http://localhost：8080/WebScheduler，注册几个用户，观察控制台或者数据库，可以看到每间隔一定的时间就会删除没有激活的用户，而已经激活的用户就会永久存在。

## 8.3 邮件

邮件发送是Web开发中必不可少的一项，Spring提供了org.springframework.mail.MailSender来发送邮件，MailSender有两个实现类，分别为CosMailSenderImpl和JavaMail SenderImpl，其中JavaMailSenderImpl是支持javamail发送邮件，本书中均以javamail为基础，在使用JavaMailSenderImpl发送邮件之前需要添加activation.jar和mail.jar文件到classpath下，这两个文件可以在Spring源文件的lib/j2ee下找到。

### 8.3.1 普通文本邮件

普通文本邮件就是说邮件中只有文字内容，这样的邮件Spring提供了SimpleMailMessage支持，SimpleMailMessage只有一个text属性来书写邮件正文，使用SimpleMailMessage很简单。

建立一个SimpleMailMessage，然后将该对象相关属性设置一定的值后就可以使用JavaMailSenderImpl对象的send（）方法发送该邮件，在实际应用中可以获取表单中的相关数据并填充到SimpleMailMessage对象中，一个完整的实例代码如下：

使用JavaMailSenderImpl对象之前要设置发送邮件的主机sender.setHost（），setPort（）方法用来设置端口，默认邮件端口是25，setUsername（）用来设置用户名，setPassword（）用来指定用户的密码，在使用一些网络smtp服务器的时候往往没有主机的使用权限，建议测试的时候自行建立一个smtp来发送邮件。

### 8.3.2 图文邮件

Spring提供了MimeMessage来发送图文邮件，首先建立一个MimeMessage，然后调用JavaMailSenderImpl对象send（）方法发送即可，实例代码如下：

MimeMessage对象直接由JavaMailSenderImpl.createMimeMessage（）建立，在发送图文邮件的时候使用了MimeMessageHelper，该对象支持HTML格式的发送，这样就可以在HTML代码中嵌套任意的图文代码了。messageHelp.setText（body, ture）第二个参数为true，表示将发送HTML格式的邮件，注意在发送HTML邮件的时候需要统一编码，可以看到在新建MimeMessageHelper对象的时候第三个参数为“GBK”，同时HTML代码中的charset中的编码也要写为GBK，只有这样发送中文邮件才不会出现乱码。

### 8.3.3 带附件的邮件

带附件的邮件也是通过MimeMessage发送，附件通过MimeMessageHelper对象附加。有两个增加附件的方式，一是MimeMessageHelper对象的addInline（）方法直接将附件增加到邮件正文中，这样的附件只能是图片之类在HTML页面中能够显示的格式，如果是rar等文件就不可以了，这样可以使用第二种方式，使用MimeMessageHelper对象的addAttachment（）方法增加附件：

使用addInline（）增加附件代码如下：

使用addInline（）方法添加的附件会嵌套在HTML代码中，在邮件正文中显示，这里使用addInline（）方法增加了一张图片，addInline（）方法的第一个参数表示添加文件的id，在HTML中嵌套图片的时候，＜img src="cid：img"＞＜/img＞这里的cid要与addInline（）方法中第一个参数对应。

使用addAttachment（）增加附件代码如下：

使用addAttachment（）方式添加附件，该文件会以附件的形式显示在邮件中，而不会显示在邮件中文中。

## 8.4 文件上传

文件上传是Web开发中最常见的，Spring提供了org.springframework.web.multipart.commons.CommonsMultipartResolver和org.springframework.web.multipart.cos.CosMulti partResolver支持上传，这两个类分别基于commons-fileupload和COSFileUpLoad上传文件。

### 8.4.1 单个文件上传

很多资料包括Spring技术手册在讲述上传的时候，都是先将需要上传的文件转换成byte数组，然后复制文件流保存数据，这样上传文件都读到内存中，一旦文件过大或者多个用户同时上传就会造成内存消耗过多和上传速度慢。在实际应用过程中不要这么做，只需要对输入流和输出流进行读取就可以完成了。

使用commons-filesupload上传文件，首先将以下jar文件添加到classpath中。

首先建立一个文件类FileBean，代码如下：

FileBean有3个属性，name为上传后的文件名，path为文件上传后的路径，size为上传文件的大小。

建立上传控制器FileUploadController，该类继承SimpleFormController，代码如下：

在FileUploadController中uploadPath为上传文件路径，page为上传成功后导向的页面，onSubmit（）方法中执行上传，首先使用MultipartHttpServletRequest获取Commons MultipartFile对象，CommonsMultipartFile对象包含了上传文件的所有信息，包括文件路径和大小等，接着使用输入/输出流进行读写就完成了文件的保存。

建立两个页面index.jsp和show.jsp，代码分别如下：

index. jsp页面用来选择上传文件并提交，这里表单的enctype必须为multipart/form-data, method为post。

show. jsp页面用来显示上传的文件信息。

编写web.xml文件如下：

web. xml文件为一个标准的Spring Servlet配置文件，在web.xml中导入了mvc-config.xml，该文件代码如下：

mvc-config. xml文件中首先配置了CommonsMultipartResolver，设置上传文件的相关属性，这里只设定了上传文件的最大限度，配置FileUploadController中的上传路径为D：/。

启动Tomcat，打开浏览器，输入http://localhost：8080/Upload/upload.html，打开页面如图8-2所示。

图8-2 Spring上传单个文件实例

选择一个文件，单击【提交】按钮转到show.jsp页面，如图8-3所示。

图8-3 Spring上传单个文件实例上传成功

在show.jsp页面中可以看到上传文件的信息，同时查看D：\下确实已经有了该文件，表示上传已经成功。

### 8.4.2 多个文件上传

多个文件上传和单个文件上传相同，不过在上传控制器的onSubmit（）方法中获取所有上传文件，并依次上传单个文件，修改FileUploadController代码的OnSubmit（）方法如下：

首先使用multipartRequest.getFileNames（）获取上传文件列表，然后通过一个迭代器进行逐个上传，修改上传页面代码如下：

这里同时上传3个文件，同时提交到控制器处理，修改文件上传成功页面代码如下：

show. jsp中使用了JSTL标签，这里要将standard.jar添加到classpath中，启动tomcat，打开首页，如图8-4所示。

图8-4 Spring上传多个文件实例

选择多个文件，单击【提交】按钮后转到结果显示页面，如图8-5所示。

图8.5 Spring上传多个实例提交结果

## 8.5 小结

本章讲述了Spring的几种特殊应用：远程资源访问、定时器和邮件发送等，针对每个不同的方面均以一个实例由浅入深地讲解了Spring在实际应用中的使用方法，同时结合实际开发提出了各个方面的注意事项，通过本章的学习可以熟悉地掌握Spring在远程调用、邮件和上传等方面的运用。

# 第9章 Spring实例——新闻发布系统

本书前8章详细地讲解了Spring各个不同组件的应用，Spring作为一个综合性框架，要想使Spring在开发中发挥最大的性能，节省开发周期及开发难度，就需要结合Spring各个组件进行整合开发，本章将以一个实例——新闻发布系统为例，详细讲解在开发实际应用中如何使用Spring各个组件进行整体系统设计，并结合实例讲解开发设计系统的方法、思想及技巧。

## 9.1 系统设计方案

1.系统涉及的模型设计方案

系统主要模型如下。

1）用户

用户模型：用户名、密码、邮件、是否激活、激活码、权限

用户分分类：游客、未激活用户、正式用户（已激活用户）、管理员，游客是所有浏览该系统的用户，未激活用户为已经注册即是没有激活的用户，正式用户即是已经注册并且已经激活的用户，管理员为超级用户，拥有后台管理的所有权限。

用户权限设计如下。

●游客的权限为：浏览新闻。

●未激活用户权限和：浏览新闻。

●正式用户权限：浏览新闻、收藏新闻、发布新闻，正式用户发布的新闻需要经过管理员批准方能显示到页面。

●管理员权限：浏览新闻、收藏新闻、发布新闻、审核正式用户发布的新闻、注册用户的管理，页面风格管理（本系统通过CSS管理页面风格）。

用户定时器设计：定时器随系统启动，用户注册未激活24小时后自动删除。

2）新闻

新闻模型：主题、内容、发布人、发布时间、发布年月日、审核状态。

新闻发布规则：注册用户均可以发布新闻，但是用户发布的新闻需要经过管理员批准才能显示在页面上。

新闻定时器：若该新闻一天内没有获得批准则自动删除该新闻，每天定时给订阅用户发送当天通过审核的新闻。

3）收藏夹

收藏夹模型：收藏地址URL、收藏夹用户。

收藏规则：任意正式用户均可以收藏该系统中任意新闻，并可以管理自己的收藏夹。

4）页面风格

页面风格模型：页面主题、页面CSS、CSS状态（是否应用）。

页面风格应用规则：添加任意的页面风格，其CSS状态值均为“0”，系统应用状态值为1的页面风格，要求系统中只能存在一个页面风格的CSS状态值为“1”。

5）订阅

订阅模型：邮件

订阅规则：订阅新闻，只要求输入一个E-mail地址，添加地址到系统订阅数据表中，系统定时遍历所有订阅用户，给订阅用户发送当天审核通过的新闻。

2.系统架构设计方案

本系统采用SpringMVC+SpringIOC+SpringAOP作为架构框架，后台使用MySql数据库，持久层使用JPA（实现框架为Hibernate3.2）。

## 9.2 系统域模型设计

系统主要有5个领域模型，代码分别如下。

1）用户模型设计

用户模型中id为用户唯一标识号，userName为用户名，passWord为用户密码，E-mail为用户邮箱地址，active为用户激活状态，未激活用户active为false, code为用户激活码，level为用户角色等级，1为管理员，0为普通用户，用户注册后均为普通用户，管理员在后台可以将普通用户提升为管理员，news为用户发布的新闻，一条新闻对应一个发布者，collects为收藏夹，每个用户都有多个收藏。

2）新闻模型设计

新闻模型中有4个所属新闻的属性，分别为新闻标题title、新闻内容content、新闻发布时间publishTime、publishday为发布新闻的年月日，设计该字段的目的在于定时发送新闻，系统定时发送当天新闻，查询的时候需要“publishTime=new Date（）”这样的查询条件，而new Date（）返回的是当前时间精确到秒，所以查询当天新闻的条件应该为“publishday=new Date（）.getYear（）+new Date（）.getMonth（）”，新闻状态status（状态为1的新闻表示已经审核可以在页面显示出来，所有添加的新闻默认状态都为0，需经管理员审核后才能发布到页面）。

3）收藏夹模型设计

收藏夹中的url表示该收藏的url地址，同时多个收藏对应一个用户，用户可以在后台管理自己的收藏。

4）页面风格模型设计

页面风格模型中的title表示该系统的名称，CSS表示该系统将要应用的CSS样式表，status表示一个page的状态，系统将应用status为1的Page对象，也就是说，在所有的Page对象中只有一个Page对象status值为1，这里Page对象只是一个简单的设计，在实际应用中可以进行很大的扩充，比如设定表格宽度和颜色等，均可以通过Page对象来应用。

5）新闻订阅模型设计

新闻订阅模型只有一个email属性，用户主要将自己的E-mail提交到系统，系统会定时发送最新的新闻到用户的邮箱中。

## 9.3 DAO设计

由于系统中存在多个不同的对象，要对这些对象一直进行操作，就需要给每一个对象设计一个DAO接口，并且需要编写这些DAO的实现，为了便于系统的扩展，在应用中设计一个泛型DAO，然后利用Spring的ProxyFactoryBean来完成接口代理。

### 9.3.1 泛型DAO设计

GenericDAO代码如下：

GenericDAO中有多种方法，save（T t）为保存对象，update（T t）为更新对象，remove（T t）为删除对象，find（T t）为查找对象，getByName（String propertyName, Object value）为根据对象的某个属性及该属性的值查找对象，List＜T＞query（String sql, Object[]paras, int begin, int count）为根据指定sql返回满足条件的一组对象。

编写泛型DAO的实现类GenericDAOImpl，代码如下：

GenericDAOImpl实现了GenericDAO接口并继承了JpaDaoSupport类，在Generic DAOImpl中使用JpaTemplate来操作数据库，其中save（）、remove（）、update（）和find（）方法均使用了JpaTemplate相应的方法进行数据增、删、改、查的操作，getByName（final String property, final Object value）方法调用了JpaTemplate.execute（new JpaCallback（{……}））方法来构造查询语句，并返回一个适合条件的对象，query（final String sql, final Object[]paras, final int begin, final int count）与getByName（final String property, final Object value）相同，不过这里返回了一个数组对象。

GenericDAOImpl需要传递一个查询返回对象Class＜T＞clz，在执行getByName（）和query（）方法的时候需要通过调用clz对象名来构造查询语句完成查询过程。

### 9.3.2 单个DAO设计

每一个域模型需要进行持久化操作，这里使用了泛型DAO，就不需要针对每一个域模型进行DAO设计了，每个DAO执行需要一个接口，该接口继承GenericDAO，然后通过Spring的ProxyFactoryBean完成接口的代码即可。

该系统中有5个域模型并且这5个域模型都需要持久化操作，所以要设计5个域模型对应的DAO接口，代码分别如下：

5个DAO均继承了泛型DAO，只需要给泛型DAO传递一个返回对象的类型＜xxx＞即可，通过Spring的ProxyFactoryBean就可以通过配置完成DAO的实现代理，进而不需要编写每一个DAO的实现类。

配置方法代码如下：

首先将genericDAO配置为抽象Bean，由于GenericDAOImpl继承了JpaDaoSupport，所以这里要注入一个EntityManageFactory对象，然后配置一个ProxyFactoryBean，该Bean也为抽象Bean，配置每个域模型对应DAO的时候只需要给相应的DAO配置为proxyFactoryBean的子Bean即可，proxyInterfaces属性配置需要代理的接口，target属性用来配置将要代理的对象，这里是将DAO代理为GenericDAOImpl的实现，target属性使用了一个内部Bean完成了配置，其实就是配置了一个GenericDAOImpl, GenericDAOImpl中构造查询语句需要使用相应对象的名称，所以在配置GenericDAOImpl时候需要注入一个实体类，通过这些配置就可以使用INewsDAO来进行持久化操作了，由于篇幅关系这里只列出了INewsDAO的配置，其他几个DAO的配置与INewsDAO相同，具体可以参考光盘News项目中源代码。

## 9.4 系统控制器设计

系统控制可以使用Spring的SimpleFormController及MultiActionController或者其他Controller来实现，关于Controller的使用具体可以参考第5章的控制器介绍，本实例中均使用MultiActionController来完成控制器的设计。

### 9.4.1 分页引擎的设计

分页引擎是每个系统中必不可少的一个引擎，分页引擎的设计也多种多样，其复杂性和易用性也随着系统的不同而有所不同，本例中针对中小型的系统来设计一个较简单的分页引擎，结合velocity标签使用。

分页设计中主要有3种方法，一个显示第一页的方法list（），下一页next（），上一页previous（），同时分页引擎是针对任意对象需要给分页引擎传递一个泛对象T，代码如下：

3种方法均接受HttpServletRequest request、List＜T＞objs、int total、String page和int count 5个参数，第1个是HttpServletRequest对象，第2个为查询结果的数组对象，第3个为返回对象的记录总数，第4个为返回的页面对象，第5个为分页引擎每页的记录数。

List（HttpServletRequest request, List＜T＞objs, int total, String page, int count）方法中查询了从第一条到第count条记录数，并将记录及页面信息封装到HashMap中，在页面中就可以使用一致的标签来调用页面引擎，页面velocity代码如下：

pages是总页数，使用（double）total/（double）count＞total/count）？total/count+1：total/count计算得出，不够一页的按一页计算，在其他控制器中调用PageList的3种方法即完成了分页设计。

### 9.4.2 新闻控制器NewsAction

NewsAction继承MultiActionController，所有的新闻设计均在该控制器中，由于方法比较多，这里按方法讲解。

1.首页控制方法index（）

Index（HttpServletRequest request, HttpServletResponse response）方法返回首页，首页中只显示最新通过审核的6条新闻，代码如下：

index（）方法使用了INewsDAO, INewsDAO通过Spring IOC注入到控制器中，INewsDAO是通过ProxyFactoryBean代理后的对象，首先使用INewsDAO对象查询前6条通过审核的新闻记录，然后查询出status为1的Page对象作为页面风格，然后将新闻记录和风格对象封装到HashMap中，在页面中就可以使用map.get（"newes"）来获取新闻记录并显示，这里返回的页面为indexPage, indexPage通过IOC注入到NewsAction中，下面是对应的页面部分代码。

页面头部代码如下：

在头部文件中调用了风格对象用来显示系统的名称及CSS。

页面中需要加一些图片修饰，这里只列出velocity标签的代码。

使用velocity的#foreach标签来显示数组，并且在每条新闻的标题增加一个链接，通过该链接来打开新闻具体内容页面，使用news.html？method=show＆id=$！news.id来调用NewsAction中的show（）方法并传递新闻id给show（）方法。

2.显示新闻方法show（）

show（）方法代码如下：

show（）方法中根据传递的id来查询对应的新闻，并将新闻对象封装到news标签中显示到页面中。

3.显示新闻列表方法list（）

list（）方法中使用INewsDAO查询count数目的新闻记录数及新闻总数（count使用IOC给NewsAction注入），然后调用分页引擎PageList的list（）方法显示第一页。

4.新闻分页方法

在next（）方法中与list（）方法相同，首先计算当前页的新闻记录数及新闻总数，然后调用分页引擎的next（）方法。

对应的页面直接使用分页引擎中的velocity标签代码如下：

在调用相应的方法中需要传递一个参数“begin”，也就是下一页记录开始的位置。

后台登录：

login（）方法直接导向了一个页面loginPage, loginPage也是通过IOC注入。

添加新闻代码如下：

add（）方法首先通过session判断用户是否登录，如果用户没有登录或者用户登录已经超时，则return new Page（this.getLoginPage（））导向登录页面，如果用户已经登录并未超时，则导向添加新闻的页面newsPage。

保存新闻代码如下：

保存新闻的时候使用new String（request.getParameter（"title"）.getBytes（"ISO-8859-1"），"UTF-8"））进行转码避免中文乱码，使用INewsDAO保存新闻到数据库然后返回到保存成功的页面，在保存新闻的时候需要将status值设置为0，这样新闻就不会在页面中显示出来，需要等审核后才能显示。

删除新闻代码如下：

remove（）方法直接根据传递的id来删除对应的新闻并重新调用newsManage（）方法，其中newsManage（）方法是后台管理的新闻列表展示方法，方法体与list（）方法相同，不过显示的页面不同而已，具体可以参考光盘中的源代码。

新闻审核与取消审核代码如下：

check（）方法为审核新闻的方法，审核新闻只需要调用INewsDAO的update（Long id）方法来更新新闻的status值为“1”。

uncheck（）方法与check（）对应，取消审核是将新闻的status值设置为“0”，这样新闻就不会在页面中显示出来。

5.增加订阅方法

scribe（）方法使用ISubscribeDAO保存用户提交的数据到数据库，ISubscribeDAO与INewsDAO相同，同时IOC注入到NewsAction中。

### 9.4.3 用户控制器UserAction

用户控制器UserAction同样继承MultiActionController，所有用户操作的方法均在该控制器中，下面针对每个方法逐个讲解。

用户注册代码如下：

reg（）方法直接导向一个新的页面regPage, regPage使用IOC注入到UserAction中。

保存用户：

add（）方法使用HttpServletRequest对象获取各个参数并转码赋给User对象，默认注册用户level值均为“0”，表示普通用户。激活码使用用户名的hashcode及注册时间组成，保存用户的时候进行了简单的判断，不允许用户重复注册，用户名及密码的规则验证可以在客户端使用js验证，用户注册后将导向激活页面：return new Model AndView（this.getActivePage（），"map"，map）；

激活用户代码如下：

active（）方法通过传递的激活码及用户名来对照数据库中的值，如果用户名和激活码均相同，则设置用户active值为true，然后导向登录页面return new Model AndView（this.getLoginPage（））。

用户登录代码如下：

sign（）方法获取表单中的用户名和密码，通过比较数据库中的用户名及密码是否相同来决定导向的页面，如果登录成功，则将用户保存到HttpSession中，然后导向managePage页面，在sign（）方法中如果登录成功，则new Model And View（this.getManagePage（），"main"，""）；将空白页封装到main标签中，框架页中右侧页调用的就是main标签，这样就会打开一个空白页面。

用户管理分页：

userManage（）方法打开用户管理的第一个页面，显示用户第一条到第count条的记录，在用户载入之前需要判断用户是否登录。

userManage_next（）和userManage_previous（）方法分别为用户分页中的“下一页”和“上一页”，两种方法均调用PageList方法中的next（）和previous（）方法。

用户等级管理：

admin（）方法为提升普通用户为管理员用户，unAdmin（）方法为降低管理员用户为普通用户的方法，管理员和普通用户的区别就是管理员level值为“1”，普通用户level值为“0”，这里只是一个简单的权限设计，如果需要设计强大的权限系统，可以参考acegi权限设计。

用户退出：

logout（）方法移除当前session保存的用户对象然后导向登录页面。

### 9.4.4 收藏控制器CollectAction

收藏控制器CollectAction也是继承MultiActionController，所有的收藏操作均放在该控制器中，具体每个方法代码如下。

添加收藏：

add（）方法将记录用户当前的URL并导向记录页面，在记录页面中可以任意输入收藏的名称然后保存，可以在后台“收藏管理”中看到自己的收藏记录，在添加收藏之前需要进行用户登录验证，如果用户没有登录或者用户登录已经超时，则导向用户登录页面。

保存收藏：

save（）方法通过HttpServletRequest获取Collect对象的相关属性值，使用Icollect DAO保存到数据库中，在保存收藏之前也需要进行用户的登录验证。

收藏管理：

list（）方法直接使用ICollectDAO查询出当前登录用户的所有收藏，这里的查询为“this.getCollectDAO（）.query（"obj.user=？"”。

这里的User为当前session中保存的对象也就是登录用户。

删除收藏：

remove（）方法根据传递的id使用ICollectDAO删除对应的Collect对象。

### 9.4.5 订阅控制器SubscribeAction

SubscribeAction同样继承MultiActionController，订阅只需要一个E-mail即可，订阅管理这里只设计一个删除订阅，SubscribeAction源代码如下：

SubscribeAction中需要注入3个属性，ISubscribeDAO为操作订阅的DAO, subPage为订阅列表页，loginPage为用户登录页。list（）方法用来显示所有订阅，这里没有进行分页设计，读者有兴趣可以参考新闻管理中的分页设计来改变一下订阅为分页显示，在显示分页的时候需要进行用户登录验证，如果没有登录，则导向登录页面，remove（）方法为删除订阅方法，remove（）方法根据传递的id使用ISubscribeDAO来删除对应的订阅对象。

### 9.4.6 风格控制器PageAction

PageAction继承MultiActionController，所有的Page对象操作都在PageAction中实现，PageAction代码如下：

PageAction中有3种方法，insert（）方法为增加风格对象，直接使用IPageDAO来持久化Page对象，remove（）方法根据相应的id删除Page对象，css（）方法应用选中的Page对象，由于本系统只使用status值为1的Page对象，css（）方法将遍历所有status值为1的Page对象（实际上只有1个），将status=1的Page对象status值改为0，并将传递的id值对应的Css对象status设置为“1”。

## 9.5 定时器设计

本系统需要设计3个定时器，分别为未激活用户删除定时器、删除未批准新闻定时器和定时发送新闻定时器。

未激活用户删除定时器的规则为每间隔24小时定时删除没有激活的注册用户。

删除未批准新闻定时器规则为每间隔24小时定时删除没有审核的新闻。

定时发送新闻定时器的规则为每个24小时给订阅用户定时发送当天审核通过的新闻。

本例中SystemScheduler使用TimerTask来实现，代码如下：

SystemScheduler中使用INewsDAO来查询没有审核的新闻并删除，使用IUserDAO查询没有激活的注册用户并删除，使用ISubscribeDAO来查询所有订阅的E-mail，并给所有的E-mail发送当天通过审核的新闻。

配置该定时器代码如下：

系统在启动的时候加载Bean就会自动启动该定时器，定时器每间隔24小时（34 560 000毫秒）就会自动启动该定时器执行3个定时工作。

## 9.6 系统页面设计

系统页面分为前台和后台，所有页面均使用velocity标签显示数据，结合后台的5个控制器，页面中有过多的修饰代码这里不再列举，仅仅列举出主要代码，前台有以下页面。

首页index.html代码如下：

＜form name="form1"method="post"action="/News/news. html？method=scribe"＞第一手掌握最新新闻资讯，只需要输入一个邮箱即可Email＜input type="text"name="email"＞

＜input type="submit"name="Submit"value="订阅"＞

本系统将会第一时间给用户的邮箱发送第一手新闻资讯，保证没有任何广告等垃圾邮件。

index. html中用户可以输入自己的E-mail订阅新闻，使用velocity代码显示News Action中index（）方法中的6条新闻数据，页面如图9-1所示。

图9-1 新闻系统首页

新闻列表页list.html代码如下：

＜td height="21"colspan="3"valign="top"＞＜div align="right"＞＜span class="STYLE1"＞共有$！map.get（"pages"）页每页$！map.get（"count"）条第$！map.get（"begin"）页#if（$map.get（"begin"）＞1）.＜a href="/News/news.html？met hod=previ ous＆begin=$！map.get（"begin"）"＞上一页＜/a＞#end#if（$map.get（"begin"）＜$map.get（"pages"））＜a href="/News/news.html？method=next＆begin=$！map.get（"begin"）"＞下一页＜/a＞#end＜/span＞＜/td＞

新闻列表页中使用velocity的#foreach标签来显示所有的新闻，同时使用velocity标签来显示分页标签，页面如图9-2所示。

图9-2 新闻列表页

新闻展示页show.html代码如下：

show. html中直接显示单条新闻的主题及内容，同时每条新闻展示都有一个收藏链接，页面如图9-3所示。

图9-3 新闻展示页面

用户登录页login.html：

页面如图9-4所示。

图9-4 用户登录页面

用户注册页面：

页面如图9-5所示。

图9-5 用户注册页

用户激活页：

页面如图9-6所示。

图9-6 用户激活页

添加收藏页：

页面如图9-7所示。

图9-7 收藏添加页面

后台页面主要如下。

后台首页：后台为框架页，代码如下：

框架页左侧为left.html，使用user.html？method=left方法来转发。left.html页代码如下：

left. html中使用velocity对不同的用户菜单进行了显示限制，#if（$！user.level==1）表示管理用户显示的菜单，管理员用户显示菜单如图9-8所示。

图9-8 后台首页：管理员用户

普通用户页面如图9-9所示。

图9-9 后台首页：普通用户

新闻管理页面：

页面如图9-10所示。

图9-10 新闻管理页面

用户管理页面：

页面如图9-11所示。

图9-11 用户管理页面

风格管理页面：

风格管理页中包括风格列表和风格添加，页面如图9-12所示。

图9-12 风格管理页面

添加新闻页面：

页面如图9-13所示。

9-13新闻添加页面

订阅管理页面：

页面如图9-14所示。

图9-14 订阅管理页面

收藏管理页面：

页面如图9-15所示。

图9-15 收藏管理页面

## 9.7 小结

本章中以一个新闻发布系统为实例，结合前几章的内容详细地讲解了Spring在实际开发中的具体运用。从系统设计方案到系统组件设计，按照设计层次逐步地讲解系统设计方法，并结合开发实际讲述了开发实践中的一些设计技巧和设计思想，系统预留一些未完成的功能，读者如有兴趣可以进一步地完善该系统。