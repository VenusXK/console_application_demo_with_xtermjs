
https://github.com/microsoft/node-pty

### 依赖

#### Windows


npm install requires some tools to be present in the system like Python and C++ compiler. Windows users can easily install them by running the following command in PowerShell as administrator. For more information see https://github.com/felixrieseberg/windows-build-tools:

```cmd
npm install --global --production windows-build-tools
```

The following are also needed:

Windows SDK(https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/) - only the "Desktop C++ Apps" components are needed to be installed

### `npm`安装`windows-build-tools`时卡在`Successfully installed Python 2.7`

这其实是windows-build-tools安装脚本的一个BUG，我在其github的issue中找到了这个
链接：https://github.com/felixrieseberg/windows-build-tools/issues/244

有兴趣的可以直接打开看原文，以下为我的翻译

解决步骤：
1. 运行npm install -g windows-build-tools
2. 在%temp%文件夹中找到最新的文件名类似于dd_installer_20210421124746.log的文件
3. 查看此文件，确保日志中输出了Closing the installer with exit code 0
4. 确保你安装了vscode
ps:其实可以直接跳过2–4步，因为你的python环境早就安装好了，重复的步骤安装程序早就执行完毕了
1. 在%temp%目录下创建一个名为dd_client_.log的文件
2. 编辑5中创建的文件，加入一行Closing installer. Return code: 3010.然后保存。

然后windows-build-tools就可以继续安装了
注：直接在资源管理器中粘贴%temp%即可打开你的Windows temp目录。

### `javascript` 错误：类型错误：`process.env` 只接受在安装`windows-build-tools`时可配置的

下载安装程序失败。错误：TypeError：“process.env”只接受可配置、可写和可枚举的数据描述符。

我已经运行了以下命令npm install --全局windows构建工具
节点版本：v18.12.0 NPM版本：8.19

ddrv8njm

我也遇到了同样的问题。首先我试着做`npm install --global --production windows-build-tools@4.0.0`，但没有成功，然后我试着做`npm config set msvs_version 2022`，但仍然没有成功。
最后，我尝试下载节点版本17. 9. 1，并重试命令，它的工作！！
以下是步骤：

步骤1：卸载节点版本18.12并安装版本17.9.1

第2步：在窗口搜索栏下搜索%temp%（复制%temp%，然后按窗口按钮+ Ctrl V）https://i.stack.imgur.com/jGaSg.png

第3步：创建“dd_client_.log.txt”并输入“正在关闭安装程序。返回代码：第3010章

之后，您应该能够使用npm install --global windows-build-tools完成整个过程

非常感谢seantsang

我不知道在node.js版本18.12中安装windows-build-tools时seantsang的技术是否直接起作用。如果我所说的没有帮助，也许可以尝试this