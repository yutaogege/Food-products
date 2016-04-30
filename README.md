# Food-products
餐品项目说明

## 安装grunt

在命令行之行下面的命令，-g是指将grunt安装到全局
> 这里默认你已安装了node和npm

```shell
npm install -g grunt-cli
```

##  安装node依赖
> 如果你已安装了grunt，命令行遍历到package.json所在的目录下执行下面的命令来安装node依赖包

```shell
npm install
```
## 开发模式
 > 开发模式执行下面的命令
 
 ```shell
grunt server
```
**注意：** 最后命令会停在watch的状态，此时每次保存已修改的文件都会执行一次grunt watch


## 生产模式
 > 这一步对代码进行打包压缩，图片压缩

 ```shell
grunt build
```
  or
 ```shell
grunt
```
