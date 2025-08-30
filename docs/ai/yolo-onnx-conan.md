## 需求

最近本人的想法是， onnx + opencv 的yolo c++库，实现yolo在c++直接推理，但是看见一堆依赖，确实难以令人入手。便是想到了vcpkg和conan，这两个。但是这两个我压根并没有完全知道哪一个好用，我便从我的技术栈角度去考虑。

### 完整对比表格
| 维度 | **Conan** | **vcpkg** |
|---|---|---|
| **核心设计** | 去中心化包管理器，支持跨平台、跨构建系统，依赖描述通过 conanfile.txt/py 定义 | 由微软维护的本地包管理器，侧重 Windows/MSVC，通过文件或 CMake 集成 |
| **维护方** | JFrog（2020 年收购 Conan） | Microsoft |
| **首次发布** | 2016 年 | 2015 年 |
| **维护年限（截至 2024）** | 8 年 | 9 年 |
| **CI/CD 支持** | ★★★★★ 提供缓存、并行构建、制品上传下载等完整支持 | ★★☆ Dependabot 可自动更新基线，但编译缓存需手动处理 |
| **VS Code 支持** | ★★★★ 通过官方插件 Conan for VS Code 实现语法高亮、自动补全、包搜索与安装 | ★★★★ 官方提供 vcpkg.json 文件支持，VS Code 可自动识别并提示依赖管理 |

### 适用场景总结
- **Conan**：适合需要高度定制、跨平台、跨构建系统的项目，尤其适合 CI/CD 环境。
- **vcpkg**：适合主要在 Windows 平台开发或需要快速引入常用库的项目。

### 因为本人比较熟悉Python，也比较重视CI/CD这个操作，同时还有一点，大部分推理的设备都是Ubuntu系统开发，使用vcpkg可能不会有太好的效果，便选择conan进行对c++的依赖管理。


## Conan概念

Conan 是 C/C++ 的开源包管理器，解决依赖管理复杂、跨平台构建困难等问题，核心概念包括跨平台支持、自动化依赖解析、可重复构建、版本控制、去中心化架构、二进制管理等。它支持多操作系统和构建系统，允许通过配置文件定义依赖，并与 CMake 等工具集成。以下将简要介绍其核心概念、工作原理及使用方法。

### 核心概念
- **跨平台支持**：Conan 支持 Windows、Linux、macOS 等主流操作系统，以及 iOS、Android 等移动端平台。它能够处理不同平台、编译器、构建类型等配置下的依赖管理。
- **自动化依赖解析**：Conan 能够自动解析项目依赖关系，处理版本冲突，并确保构建环境的一致性。
- **可重复构建和版本控制**：Conan 通过锁定文件（lockfile）确保项目在不同环境中使用相同的依赖版本，提升构建的可重复性。
- **去中心化架构**：Conan 采用客户端-服务器架构，支持本地和远程仓库。用户可以私有化部署服务器，托管私有包和二进制文件。
- **二进制管理**：Conan 支持管理预编译的二进制文件，针对不同配置（如操作系统、架构、编译器版本等）生成和存储不同的二进制文件。

### 工作原理
- **客户端-服务器模型**：Conan 的客户端（命令行工具）可以从不同的服务器（远程仓库）获取包，也可以将包上传到服务器，类似于 Git 的 push-pull 模型。
- **包的标识**：一个包在 Conan 中由包名、版本、用户和渠道唯一标识，例如 fmt/8.0.1@user/channel。

### 使用方法
- **安装 Conan**：Conan 是用 Python 编写的，可以通过 pip 安装：
```bash
pip install conan
```
- **配置项目依赖**：在项目目录中创建 conanfile.txt 或 conanfile.py 文件，定义所需的库依赖。以下是一个 conanfile.txt 文件的示例：
```txt
[requires]
fmt/8.0.1
spdlog/1.9.2
[generators]
cmake
```
- **安装依赖**：使用 conan install 命令安装依赖：
```bash
conan install . --build=missing
```
- **集成到构建系统**：Conan 支持生成 CMake、Visual Studio、Makefiles 等的构建配置文件。例如，在 CMakeLists.txt 中包含生成的 Conan 文件：
```cmake
include(${CMAKE_BINARY_DIR}/conanbuildinfo.cmake)
conan_basic_setup()
```

